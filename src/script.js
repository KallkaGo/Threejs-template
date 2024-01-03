import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer'
import Stats from 'three/examples/jsm/libs/stats.module'
import * as dat from 'lil-gui'
import vertexShader from './shader/vertex.glsl'
import fragmentShader from './shader/fragment.glsl'
import computeShader from './shader/compute.glsl'
import gsap from 'gsap'

const width = 2000
const pointscount = width ** 2
const size = 1


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/* 
Light
*/
const ambientLight = new THREE.AmbientLight('gray', 0.6)
scene.add(ambientLight)

const dirctionLight = new THREE.DirectionalLight('white', 0.5)
scene.add(dirctionLight)



/**
 * Loader
 */
const textureLoader = new THREE.TextureLoader()
const fbxLoader = new FBXLoader()
const gltfLoader = new GLTFLoader()

const stats = new Stats()

document.body.appendChild(stats.dom)

let points

gltfLoader.load('/houzi.glb', (gltf) => {

    const model = gltf.scene.children[0]

    // scene.add(gltf.scene)

    initComputeRenderer(model)

    initPoints(model)

})









// scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(0, 4, 5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))




/* GPGPU */


let gpuCompute
let positionVariable

const initComputeRenderer = () => {

    gpuCompute = new GPUComputationRenderer(width, width, renderer)
    const posDt = gpuCompute.createTexture()
    const data = posDt.image.data

    let toIndex = 0

    for (let i = 0; i < data.length; i++) {

        toIndex %= data.length

        data[i * 4 + 0] = THREE.MathUtils.randFloatSpread(size)
        data[i * 4 + 1] = THREE.MathUtils.randFloatSpread(size)
        data[i * 4 + 2] = THREE.MathUtils.randFloatSpread(size)
        data[i * 4 + 3] = 1
    }


    positionVariable = gpuCompute.addVariable('texturePosition', computeShader, posDt)

    gpuCompute.setVariableDependencies(positionVariable, [positionVariable])

    positionVariable.wrapS = THREE.RepeatWrapping
    positionVariable.wrapT = THREE.RepeatWrapping

    gpuCompute.init()

}

const initPoints = (model) => {
    model.geometry.scale(2, 2, 2)
    const { array, count } = model.geometry.getAttribute('position')

    const pointsgeometry = new THREE.BufferGeometry()
    const pointsmaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            texturePosition: {
                value: null,
            },
            uPointSize: {
                value: 2,
            },
            uPixelRatio: {
                value: window.devicePixelRatio,
            },
            uProgress: {
                value: 0
            },
            uTime: {
                value: 0
            },
            uRadius: {
                value: 0
            }
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    })

    const positions = new Float32Array(pointscount * 3)
    const references = new Float32Array(pointscount * 2)
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < width; j++) {
            const idx = i + j * width
            positions[idx * 3 + 0] = Math.random()
            positions[idx * 3 + 1] = Math.random()
            positions[idx * 3 + 2] = Math.random()
            references[idx * 2 + 0] = i / width
            references[idx * 2 + 1] = j / width
        }
    }

    let toIndex = 0
    const toPos = new Float32Array(pointscount * 3)
    for (let i = 0; i < pointscount; i++) {
        toIndex %= count
        const toIndex3 = toIndex * 3
        const i3 = i * 3
        toPos[i3] = array[toIndex3]
        toPos[i3 + 1] = array[toIndex3 + 1]
        toPos[i3 + 2] = array[toIndex3 + 2]
        toIndex++
    }

    console.log('pos', toPos)

    pointsgeometry.setAttribute('toPos', new THREE.BufferAttribute(toPos, 3))
    pointsgeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    pointsgeometry.setAttribute("reference", new THREE.BufferAttribute(references, 2))



    points = new THREE.Points(pointsgeometry, pointsmaterial)
    scene.add(points)


    const param = {
        time: 0,
        progress: 0,
        radius: 3
    }

    gsap.to(param, {
        progress: 1,
        radius: 1,
        duration: 4,
        ease: 'power2.inOut',
        onUpdate: () => {
            points.material.uniforms.uTime.value = param.progress
            points.material.uniforms.uRadius.value = param.radius
        },
        onComplete: () => {
            gsap.to(param, {
                time: 1,
                duration: 2,
                ease: 'power1.inOut',
                onUpdate: () => {
                    points.material.uniforms.uProgress.value = param.time
                }
            })
        }
    })


}






/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {

    stats.update()

    const elapsedTime = clock.getElapsedTime()

    if (gpuCompute) {
        gpuCompute.compute()
        points.material.uniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget(positionVariable).texture
        // points.material.uniforms.uProgress.value = elapsedTime * 0.1
    }

    // Update controls
    controls.update()



    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()