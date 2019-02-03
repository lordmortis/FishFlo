import * as THREE from "three";

var isSetup = false;
var scene = null;
var camera = null;
var renderer = null;

var rendererdEntities = new Map();

function addObjectToScene(key, data) {
	var localMatrix = new THREE.Matrix4();
	localMatrix.compose(data.Transform.position, data.Transform.rotation, data.Transform.scale);
	const renderData = {
		geometry: data.Render.geometry,
		material: data.Render.material,
		localMatrix: localMatrix,
		mesh: new THREE.Mesh(data.Render.geometry, data.Render.material),
	}
	renderData.mesh.matrixAutoUpdate = false;
	renderData.mesh.matrix.copy(localMatrix);
	scene.add(renderData.mesh);
	rendererdEntities.set(key, renderData);
}

function updateObjectInScene(key, data) {
	const renderData = rendererdEntities.get(key);
	renderData.localMatrix.compose(data.Transform.position, data.Transform.rotation, data.Transform.scale);
	if (renderData.mesh.matrix.equals(renderData.localMatrix)) return;
	console.log("updating");
	renderData.mesh.matrix.copy(renderData.localMatrix);
}

export const Name = "Game Renderer";

export const InputComponents = [
	"Transform",
	"Render"
];

export const OutputComponents = [];

export function Run(inputData, outputData) {
	inputData.forEach((data, key) => {
		if (rendererdEntities.has(key)) {
			updateObjectInScene(key, data);
		} else {
			addObjectToScene(key, data);
		}
	});

	if (!isSetup) {
		console.error("Renderer Component requires setup!");
		return;
	}
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

	isSetup = true;

	scene = new THREE.Scene();
	var ratio = containerElem.clientWidth / containerElem.clientHeight;
	camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(containerElem.clientWidth, containerElem.clientHeight);
	containerElem.appendChild(renderer.domElement);

	camera.position.z = 5;
}

