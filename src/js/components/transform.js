import { Vector3, Quaternion } from "three";

export const Name = "Transform";
export function Create() {
	return {
		position: new Vector3(0, 0, 0),
		rotation: new Quaternion(),
		scale: new Vector3(1, 1, 1),
	}
}