var containter;
var renderer;
var scene;
var camera;
var controls;
var object;
/*
  Object properties
*/
var objectProperties = {
  material : new THREE.MeshLambertMaterial({color: 0xFF00FF}),
  color: 0xFF00FF
}


init();

createObjects();

buildGui();

animate();

function init() {

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);

  scene.add(camera);
  camera.position.set(0, 0, -50);
  camera.lookAt(scene.position);

  controls = new THREE.OrbitControls(camera);

  THREEx.WindowResize(renderer, camera);
}

function createObjects() {

  var dirLight = new THREE.DirectionalLight(0xFFE79B, 1);
  dirLight.position.set(125, 0, 60);

  var ambientLight = new THREE.AmbientLight(0x171717);

  var objectGeo = new THREE.IcosahedronGeometry(10);
  var objectMat = objectProperties.material;
  object = new THREE.Mesh(objectGeo, objectMat);

  scene.add(ambientLight);
  scene.add(dirLight);
  scene.add(object);
}

function buildGui() {
  var gui = new dat.GUI();
  gui.addColor(objectProperties, 'color' );
  console.log(gui)
  // document.body.appendChild(gui.domElement);
  console.log(object)
}

function updateObject() {
  console.log(objectProperties.color)
  object.material.color.setHex(objectProperties.color);
}

function animate() {

  requestAnimationFrame(animate);

  controls.update();

  updateObject();

  renderer.render(scene, camera);
}