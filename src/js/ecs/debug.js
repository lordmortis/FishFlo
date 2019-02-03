export function ComponentList(components) {
	var html = "";
	html += "<h1>Components</h1>";

	var componentNames = Object.keys(components);

	if (componentNames.length == 0) {
		html += "<p>No components Registered</p>";
	} else {
		html += "<table>";
		html += "<th><tr><td>Name</td><td>Entities</td></tr></th>"
		html += "<tbody>";
	}

	componentNames.forEach(name => {
		const component = components[name];
		const entityCount = Object.keys(component.entityData).length;
		html += `<tr><td>${name}</td><td>${entityCount}</td></tr>`;
	});

	if (componentNames.length > 0) {
		html += "</tbody>";
		html += "</table>";
	}

	return html;
}

export function SystemList(systems) {
	var html = "";
	html += "<h1>Systems</h1>";

	if (systems.length == 0) {
		html += "<p>No systems Registered</p>";
	} else {
		html += "<table>";
		html += "<th><tr>";
		html += "<td>Name</td><td>Input Components</td>";
		html += "<td>Output Components</td>";
		html += "</tr></th>";
		html += "<tbody>";
	}

	systems.forEach(system => {
		html += "<tr>";
		html += `<td>${system.Name}</td>`;
		html += `<td>${system.InputComponents.join(',')}</td>`;
		html += `<td>${system.OutputComponents.join(',')}</td>`;
		html += "</tr>";
	});

	if (systems.length > 0) {
		html += "</tbody>";
		html += "</table>";
	}

	return html;
}

export function EntityList(entities) {
	var html = "";
	html += "<h1>Entities</h1>";

	if (entities.length == 0) {
		html += "<p>No entities Registered</p>";
	} else {
		html += "<table>";
		html += "<th><tr>";
		html += "<td>Name</td>";
		html += "</tr></th>";
		html += "<tbody>";
	}

	entities.forEach(name => {
		html += "<tr>";
		html += `<td>${name}</td>`;
		html += "</tr>";
	});

	if (entities.length > 0) {
		html += "</tbody>";
		html += "</table>";
	}

	return html;
}