'use strict';

var renderer;
var scene;
var camera;
var controls;
var object;
var raycaster = new THREE.Raycaster();
var mouseVector = new THREE.Vector2();

var ambientLight;
var hemiLight;

/*
  Scene properties
*/
var sceneProperties = {
  bgColor: 0x111111,
  color: 0xFF00FF,
  specular: 0x000000,
  ambient: 0x171717,
  hemiSky: 0xC8C8C8,
  hemiGround: 0x752C9C,
  hemiIntensity: 1
};


init();

createObjects();

buildGui();

animate();

function init() {

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor(sceneProperties.bgColor);

  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 4000);

  scene.add(camera);
  camera.position.set(0, 0, -50);
  camera.lookAt(scene.position);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  THREEx.WindowResize(renderer, camera);
}

function createObjects() {

  ambientLight = new THREE.AmbientLight(sceneProperties.ambient);

  hemiLight = new THREE.HemisphereLight(sceneProperties.hemiSky, sceneProperties.hemiGround, sceneProperties.hemiIntensity);

  var objectGeo = new THREE.IcosahedronGeometry(10);
  var objectMat = new THREE.MeshPhongMaterial();
  objectMat.color.setHex(0xF06A1E);
  objectMat.specular.setHex(sceneProperties.specular);
  objectMat.shading = THREE.FlatShading;
  objectMat.shininess = 10;
  objectMat.needsUpdate = true;
  object = new THREE.Mesh(objectGeo, objectMat);
  object.name = 'fella';

  scene.add(ambientLight);
  scene.add(hemiLight);
  scene.add(object);

  window.addEventListener('click', nudgeObject, false);
}

function nudgeObject(e) {
  var intersect;
  mouseVector.x = 2 * (e.clientX / window.innerWidth) - 1;
  mouseVector.y = 1 - 2 * ( e.clientY / window.innerHeight );
  
  raycaster.setFromCamera(mouseVector, camera);
  intersect = raycaster.intersectObject(object);

  if(intersect.length) {
    TweenMax.to(object.position, 0.4, {z: object.position.z+10});
  }
}

function buildGui() {
  var gui = new dat.GUI();
  var objFolder = gui.addFolder('object properties');
  var sceneFolder = gui.addFolder('scene properties');

  objFolder.addColor(sceneProperties, 'color' ).onChange(function(val){
    object.material.color.setHex(val);
  });
  objFolder.addColor(sceneProperties, 'specular' ).onChange(function(val){
    object.material.specular.setHex(val);
  });

  sceneFolder.addColor(sceneProperties, 'bgColor').onChange(function(val){
    renderer.setClearColor(sceneProperties.bgColor);
  });
  sceneFolder.addColor(sceneProperties, 'ambient').onChange(function(val){
    ambientLight.color.setHex(sceneProperties.ambient);
  });
  sceneFolder.addColor(sceneProperties, 'hemiSky').onChange(function(val){
    hemiLight.color.setHex(sceneProperties.hemiSky);
  });
  sceneFolder.addColor(sceneProperties, 'hemiGround').onChange(function(val){
    hemiLight.groundColor.setHex(sceneProperties.hemiGround);
  });
  sceneFolder.add(sceneProperties, 'hemiIntensity', 0, 5).onChange(function(val){
    hemiLight.intensity = sceneProperties.hemiIntensity;
  });
}

function animate() {

  requestAnimationFrame(animate);

  controls.update();

  // object.rotation.y += 0.01

  renderer.render(scene, camera);
}