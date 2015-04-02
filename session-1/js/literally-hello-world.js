//////////////////////////
// Standard global vars //
//////////////////////////

var containter;
var renderer;
var scene;
var camera;
var world;

init();

createObjects();

animate();

function init() {

  //First, we create the essential pieces to run a webgl experiemce: a renderer, scene & camera
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
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

function createObjects() {
  var sunLight = new THREE.DirectionalLight(0xE8B954, 1);
  sunLight.position.set(125, 0, 60);

  var ambientLight = new THREE.AmbientLight(0xC9C9C9);

  var worldGeo = new THREE.SphereGeometry(10, 32, 32);
  var worldTexture = THREE.ImageUtils.loadTexture('img/earth-8k.jpg');
  var worldMat = new THREE.MeshLambertMaterial({map: worldTexture});
  world = new THREE.Mesh(worldGeo, worldMat);

  scene.add(ambientLight);
  scene.add(sunLight);
  scene.add(world);
}

function animate() {
  requestAnimationFrame(animate);

  world.rotation.y += 0.003;

  renderer.render(scene, camera);
}