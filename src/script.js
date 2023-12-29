import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer'
import * as dat from 'lil-gui'
import vertexShader from './shader/vertex.glsl'
import fragmentShader from './shader/fragment.glsl'
import compute from './shader/compute.glsl'

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
camera.position.set(0.25, - 0.25, 1)
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
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.outputColorSpace = THREE.SRGBColorSpace


/* 
GPGPU
*/
const width = 1000
const size = 256
const count = width ** 2

const gpgpu = new GPUComputationRenderer(width, width, renderer)

const dtPos = gpgpu.createTexture()
const data = dtPos.image.data

for (let i = 0; i < data.length; i++) {
    data[i * 4 + 0] = THREE.MathUtils.randFloatSpread(size)
    data[i * 4 + 1] = THREE.MathUtils.randFloatSpread(size)
    data[i * 4 + 2] = THREE.MathUtils.randFloatSpread(size)
    data[i * 4 + 3] = 1
}

let dtPosVar = gpgpu.addVariable('texturePosition', compute, dtPos)

dtPosVar.wrapS = THREE.RepeatWrapping
dtPosVar.wrapT = THREE.RepeatWrapping

gpgpu.init()

const pointsGeo = new THREE.BufferGeometry()
const positions = new Float32Array(count * 3)
const references = new Float32Array(count * 2)
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
pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
pointsGeo.setAttribute("reference", new THREE.BufferAttribute(references, 2))

const pointsMat = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
        texturePosition: {
            value: null,
        },
        uPointSize: {
            value: 1,
        },
        uPixelRatio: {
            value: window.devicePixelRatio,
        },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
})

const points = new THREE.Points(pointsGeo, pointsMat)

scene.add(points)


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    gpgpu.compute()

    points.material.uniforms.texturePosition.value = gpgpu.getCurrentRenderTarget(dtPosVar).texture
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()