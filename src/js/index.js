import * as THREE from "three";

import * as Detector from "./vendor/Detector";

import * as ECS from './ecs';

import * as Components from './components';

import * as Systems from './systems';
import * as GameRenderer from './systems/gameRenderer';

function setupDivSizes(gameDiv, debugDiv) {
  var width = window.innerWidth;
  var height = window.innerHeight;

  if (debugDiv != null) height = height / 2.0;

  gameDiv.setAttribute("style", `width:${width}px;height:${height}px`);
  if (debugDiv != null) debugDiv.setAttribute("style", `width:${width}px;height:${height}px`);
}

(() => {
  // do we have somewhere to put the game?
  var gameDiv = document.getElementById("game");

  var debugDiv = document.getElementById("debug");

  if (gameDiv == null) {
    alert("No game window! Bailing.");
    return;
  }

  const errors = [];

  if (!Detector.webgl) errors.push("Sorry, your browser doesn't support webGL");
  if (typeof (Worker) === "undefined") errors.push("Sorry your browser doesn't support web workers");

  if (errors.length > 0) {
    let errorHTML = "";
    while (errors.length > 0) {
      const error = errors.pop();
      errorHTML += `<p>${error}</p>`;
    }
    gameDiv.innerHTML = `<div class="error">${errorHTML}</div>`;
    return;
  }

  setupDivSizes(gameDiv, debugDiv);
  GameRenderer.Setup(gameDiv);

  ECS.Setup(Components.All, Systems.All);

  var cubeID = ECS.AddEntity("Cube", ["Transform", "Render", "Basic Animation"]);
  var cubeRenderData = ECS.ComponentFor(cubeID, "Render");
  cubeRenderData.geometry = new THREE.BoxGeometry(1, 1, 1);
  cubeRenderData.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  var cubeAnimation = ECS.ComponentFor(cubeID, "Basic Animation");
  //cubeAnimation.position.x = -0.1;
  cubeAnimation.rotation.setFromAxisAngle(new THREE.Vector3(0.2, 0.2, 0), Math.PI / 4);

  if (debugDiv != null) ECS.SetDebug(debugDiv);

  ECS.StartLoop();
})();
