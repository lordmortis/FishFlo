import * as Debug from './debug';
import * as Utils from './utils';

var entities = [];
var components = {};
var systems = [];
var debugElem = null;

var renderLoop = null;

function loop() {
	systems.forEach(system => {
		const inputs = Utils.SystemDataMap(components, system.InputComponents);
		const outputs = Utils.SystemDataMap(components, system.OutputComponents);
		system.Run(inputs, outputs);
	});

	if (debugElem != null) {
		let html = Debug.ComponentList(components);
		html += Debug.SystemList(systems);
		html += Debug.EntityList(entities);

		debugElem.innerHTML = `<div>${html}</div>`;
	}
}

export function Setup(theComponents, theSystems) {
	theComponents.forEach(element => {
		const name = element.Name;
		if (components[name] != null) {
			console.error(`There's already a component called ${name}`);
			return;
		}

		components[name] = {
			createFunc: element.Create,
			entityData: new Map(),
		}
	});

	systems = theSystems;
}

export function AddEntity(name, componentNames) {
	const id = entities.length;

	entities.push(name);
	componentNames.forEach(name => {
		var component = components[name];
		if (component == null) {
			console.error(`Could not find component ${name} for entity ${id} "${name}"`);
			return;
		}
		component.entityData.set(id, component.createFunc());
	});

	return id;
}

export function ComponentFor(entityID, componentName) {
	if (entityID < 0 || entityID >= entities.length) {
		console.error(`Could not find entity with ID ${entityID}`);
		return null;
	}

	var component = components[componentName];
	if (component == null) {
		console.error(`Could not find component ${componentName}`);
		return null;
	}

	if (!component.entityData.has(entityID)) {
		const name = entities[entityID];
		console.error(`Could not find component ${componentName} for entity ${name} (${entityID})`);
		return null;
	}

	return component.entityData.get(entityID);
}

export function SetDebug(element) {
	debugElem = element;
}

export function StartLoop() {
	//loop();
	renderLoop = setInterval(loop, 16);
}

export function StopLoop() {
	if (renderLoop != null) clearInterval(renderLoop);
	renderLoop = null;
}
