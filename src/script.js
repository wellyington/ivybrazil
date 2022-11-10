import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import gsap from 'gsap'



const hdrTextureURL = new URL('../static/rainforest_trail_2k.hdr', import.meta.url)

const gltfLoader = new GLTFLoader()

// Debug
const gui = new dat.GUI()
dat.GUI.toggleHide();

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

let tl = gsap.timeline()

// Flag
gltfLoader.load('flag-objOnly.gltf', (gltf) => {
    gltf.scene.scale.set(0.3, 0.3, 0.3, 0.3)
    gltf.scene.rotation.set(-0.1, -1.5, -0.03)
    gltf.scene.position.set(0, -0.3, 0)
    scene.add(gltf.scene)
    gui.add(gltf.scene.rotation, 'x').min(-9).max(9)
    gui.add(gltf.scene.rotation, 'y').min(-9).max(9)
    gui.add(gltf.scene.rotation, 'z').min(-9).max(9)

    tl.to(gltf.scene.rotation, { y: -0.2, duration: 1})
    tl.to(gltf.scene.scale, { x: 0.4, y: 0.4, z: 0.4, duration: 1}, "-=1")
    tl.to(gltf.scene.position, { x: .6, duration: 1})
    tl.to(gltf.scene.scale, { x: 0.5, y: 0.5, z: 0.5, duration: 1})
})

// Lights

const pointLight = new THREE.AmbientLight(0xffffff, 1)
pointLight.position.x = 4
pointLight.position.y = 4
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
camera.position.x = 0
camera.position.y = 0.5
camera.position.z = 1.5
scene.add(camera)

// HDRI

const loader = new RGBELoader()
loader.load(hdrTextureURL, function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    //scene.background = texture;
    scene.environment = texture;
})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = false

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()