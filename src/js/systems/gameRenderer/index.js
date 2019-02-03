import * as THREE from "three";

var isSetup = false;
var scene = null;
var camera = null;
var renderer = null;


function render() {
	renderer.render(scene, camera);
}

export function Setup(containerElem) {
	if (isSetup) {
		console.error("Already Setup!");
		return;
	}

	if (containerElem == null) {
		console.error("No element to render into");
		return;
	}

	scene = new THREE.Scene();
	var ratio = containerElem.clientWidth / containerElem.clientHeight;
	camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(containerElem.clientWidth, containerElem.clientHeight);
	containerElem.appendChild(renderer.domElement);

	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
	camera.position.z = 5;

	requestAnimationFrame(render);
}
