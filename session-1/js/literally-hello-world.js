//////////////////////////
// Standard global vars //
//////////////////////////

var containter;
var renderer;
var scene;
var camera;

init();

animate();

function init() {

  //First, we create the essential pieces to run a webgl experiemce: a renderer, scene & camera
  renderer = new THREE.WebGLRenderer({antialias: true});
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);

  scene.add(camera);
  camera.position.set(0, 0, -50);
  camera.lookAt(scene.position);

  //Then, we create a container, add the container to body, and add the renderer to the container
  container = document.createElement('div');
  container.classList.add('container');
  document.body.appendChild(container);
  container.appendChild(renderer.domElement);

  // Finally, we use threex to handle window resizing
  THREEx.WindowResize(renderer, camera);
}

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}