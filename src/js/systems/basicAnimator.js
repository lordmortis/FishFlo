import * as THREE from "three";

export const Name = "Basic Animator";

export const InputComponents = [
	"Transform",
	"Basic Animation"
];

export const OutputComponents = [
	"Transform",
];

let lastFrame = null;

export function Run(inputData, outputData) {
	if (lastFrame == null) {
		lastFrame = new Date();
		return;
	}

	const thisFrame = new Date();
	const deltaTime = (thisFrame - lastFrame) / 1000;
	lastFrame = thisFrame;

	inputData.forEach((data, key) => {
		if (!outputData.has(key)) return;
		var input = inputData.get(key)["Basic Animation"];
		var output = outputData.get(key).Transform;
		output.position.addScaledVector(input.position, deltaTime);
		var temp = output.rotation.clone();
		temp.multiply(input.rotation);
		output.rotation.rotateTowards(temp, deltaTime);
		output.scale.addScaledVector(input.scale, deltaTime)
		//console.log(output);

	});
}
