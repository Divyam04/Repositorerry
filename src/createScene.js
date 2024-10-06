import * as THREE from 'three';
import { planetParams } from './planetData';
import { addSphere } from './addSphere';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createInfoBox } from './dataBox';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

createInfoBox();

const backgroundTexture = new THREE.TextureLoader().load( "textures/black-sky-with-few-stars.webp" );
scene.background = backgroundTexture;
scene.background.colorSpace = THREE.SRGBColorSpace;

const orbitControls = new OrbitControls(camera, renderer.domElement);

// setting initial camera position so that we can hit space and fly back to it
const initialCameraPosition = new THREE.Vector3(5, 30, 15);
camera.position.copy(initialCameraPosition);
camera.lookAt(0, 0, 0);

const planets = {}

// Loop where we create the planet objects
for (let planetParamsSingle of planetParams) {
    planets[planetParamsSingle.name] = addSphere(planetParamsSingle, scene);
    //console.log(planets)
}

export {renderer, planets, scene, camera, initialCameraPosition, orbitControls}
