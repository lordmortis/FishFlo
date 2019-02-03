import * as Detector from "./vendor/Detector";

import * as GameRenderer from './systems/gameRenderer/index';

function setupDivSizes(gameDiv, debugDiv) {
  var width = window.innerWidth;
  var height = window.innerHeight;

  if (debugDiv != null) height = height / 2.0;

  gameDiv.setAttribute("style", `width:${width}px;height:${height}px`);
  if (debugDiv != null) debugDiv.setAttribute("style", `width:${width}px;height:${height}px`);
}

// wrap everything inside a function scope and invoke it (IIFE, a.k.a. SEAF)
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

  // setup the debug window
  if (debugDiv) { }
})();
