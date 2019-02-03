export function SystemDataMap(components, names) {
	let first = true;
	const matching = new Map();

	names.forEach(name => {
		const component = components[name];
		if (component == null) {
			console.error(`Could not find component ${name} for system ${system.Name}`);
			inputs[name] = [];
			StopLoop();
			return;
		}

		if (first) {
			component.entityData.forEach((data, entityID) => {
				var obj = {};
				obj[name] = data;
				matching.set(entityID, obj);
			});
			first = false;
			return;
		}

		const invalidIDs = [];
		matching.forEach((data, entityID) => {
			if (!component.entityData.has(entityID)) {
				invalidIDs.push(entityID);
				return;
			}
			data[name] = component.entityData.get(entityID);
		});

		invalidIDs.forEach((id) => {
			matching.delete(id);
		});
	});

	return matching;
}