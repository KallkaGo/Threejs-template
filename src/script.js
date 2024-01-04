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
import computeShader2 from './shader/compute2.glsl'
import gsap from 'gsap'


const width = 500
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
// const ambientLight = new THREE.AmbientLight('gray', 0.6)
// scene.add(ambientLight)

const dirctionLight = new THREE.DirectionalLight('white', 1)
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
camera.position.set(0, 2, 5)
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
let toPositionVariable

const param = {
    progress: 0
}

const initComputeRenderer = (model) => {

    model.geometry.scale(2, 2, 2)
    const { array, count } = model.geometry.getAttribute('position')

    gpuCompute = new GPUComputationRenderer(width, width, renderer)
    const posDt = gpuCompute.createTexture()
    const data = posDt.image.data

    const radius = size

    const toPosDt = gpuCompute.createTexture()
    const toData = toPosDt.image.data
    let toIndex = 0

    for (let i = 0; i < data.length; i++) {

        const theta = Math.random() * Math.PI * 2 // 随机生成极角
        const phi = Math.acos(2 * Math.random() - 1) // 随机生成极径的余弦值，确保均匀分布在球体表面

        // 将球坐标转换为直角坐标
        data[i * 4 + 0] = radius * Math.sin(phi) * Math.cos(theta)
        data[i * 4 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        data[i * 4 + 2] = radius * Math.cos(phi)
        data[i * 4 + 3] = 1
        // data[i * 4 + 0] = THREE.MathUtils.randFloatSpread(size)
        // data[i * 4 + 1] = THREE.MathUtils.randFloatSpread(size)
        // data[i * 4 + 2] = THREE.MathUtils.randFloatSpread(size)

        toIndex %= count
        const toIndex3 = toIndex * 3
        const i4 = i * 4
        toData[i4] = array[toIndex3]
        toData[i4 + 1] = array[toIndex3 + 1]
        toData[i4 + 2] = array[toIndex3 + 2]
        toData[i4 + 3] = 1
        toIndex++
    }

    toPositionVariable = gpuCompute.addVariable('toPosition', computeShader2, toPosDt)

    positionVariable = gpuCompute.addVariable('texturePosition', computeShader, posDt)

    positionVariable.material.uniforms.uTime = { value: 0 }

    gpuCompute.setVariableDependencies(positionVariable, [positionVariable, toPositionVariable])

    gpuCompute.setVariableDependencies(toPositionVariable, [positionVariable, toPositionVariable])

    toPositionVariable.wrapS = THREE.RepeatWrapping
    toPositionVariable.wrapT = THREE.RepeatWrapping

    positionVariable.wrapS = THREE.RepeatWrapping
    positionVariable.wrapT = THREE.RepeatWrapping

    gpuCompute.init()


}

const paramColor = {
    color: new THREE.Color("#c9a573"),
}

gui.addColor(paramColor, 'color').onChange(() => {
    points.material.uniforms.uColor.value = paramColor.color
})

const initPoints = (model) => {
    // model.geometry.scale(2, 2, 2)
    // const { array, count } = model.geometry.getAttribute('position')

    const pointsgeometry = new THREE.BufferGeometry()
    const pointsmaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            texturePosition: {
                value: null,
            },
            toPosition: {
                value: null
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
            },
            uColor: {
                value: paramColor.color
            }
        },
        transparent: true,
        // blending: THREE.MultiplyBlending,
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

    // let toIndex = 0
    // const toPos = new Float32Array(pointscount * 3)
    // for (let i = 0; i < pointscount; i++) {
    //     toIndex %= count
    //     const toIndex3 = toIndex * 3
    //     const i3 = i * 3
    //     toPos[i3] = array[toIndex3]
    //     toPos[i3 + 1] = array[toIndex3 + 1]
    //     toPos[i3 + 2] = array[toIndex3 + 2]
    //     toIndex++
    // }


    // pointsgeometry.setAttribute('toPos', new THREE.BufferAttribute(toPos, 3))
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
        positionVariable.material.uniforms.uTime.value = elapsedTime
        points.material.uniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget(positionVariable).texture
        points.material.uniforms.toPosition.value = gpuCompute.getCurrentRenderTarget(toPositionVariable).texture
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