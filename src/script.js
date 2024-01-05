import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as dat from 'lil-gui'
import vertexShader from './shader/vertex.glsl'
import fragmentShader from './shader/fragment.glsl'
import depthvertex from './shader/depthVertx.glsl'
import depthfrag from './shader/depthFrag.glsl'


const param = {
    near: 1,
    far: 20
}

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

gltfLoader.load('/muyu.glb', (gltf) => {
    const model = gltf.scene
    scene.add(model)
})

const noiseTex = textureLoader.load('/noise2.png')
noiseTex.wrapS = THREE.RepeatWrapping
noiseTex.wrapT = THREE.RepeatWrapping


/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(10, 10, 32, 32)

// Material
const material = new THREE.MeshBasicMaterial({
    color: 'blue',
    side: THREE.DoubleSide
})

const depthMat = new THREE.ShaderMaterial({
    vertexShader: depthvertex,
    fragmentShader: depthfrag,
    uniforms: {
        uFar: {
            value: param.far,
        },
        uNear: {
            value: param.near,
        },
    }
})

const depthRt = new THREE.WebGLRenderTarget(512, 512)

const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: depthvertex,
    fragmentShader:depthfrag,
    uniforms: {
        depthTex: {
            value: depthRt.texture,
        },
        uFar: {
            value: param.far,
        },
        uNear: {
            value: param.near,
        },
        noiseTex: {
            value: noiseTex,
        },
        uTime: {
            value: 0,
        },
    },
})

// Mesh
const mesh = new THREE.Mesh(geometry, shaderMaterial)
mesh.rotateX(-Math.PI / 2)
mesh.position.set(0, 0.5, 0)
mesh.name = 'sea'
scene.add(mesh)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(6, 4, 5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace


const handleDepthMat = (flag = false) => {
    scene.traverse((child) => {
        if (child.name !== 'sea' && child.type === 'Mesh') {
            if (flag) {
                child.material = child.userData.oldMat
            } else {
                child.userData.oldMat = child.material
                child.material = depthMat
            }
        }
    })
}

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {

    // Update controls
    controls.update()


    const elapsedTime = clock.getElapsedTime()


    shaderMaterial.uniforms.uTime.value = elapsedTime * 10.

    // renderer.setRenderTarget(depthRt)

    handleDepthMat(false)
    mesh.visible = false

    // renderer.render(scene, camera)

    // renderer.setRenderTarget(null)

    // handleDepthMat(true)

    // mesh.visible = true


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}



tick()