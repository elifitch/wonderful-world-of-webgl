var containter;
var renderer;
var scene;
var camera;
var controls;
var object;
var landscape;

var dirLight;
var ambientLight;
var hemiLight;

/*
  Object properties
*/
var sceneProperties = {
  material : {},
  color: 0xFF00FF,
  specular: 0x00FF00,
  shininess: 1,
  shading: THREE.FlatShading,
  ambient: 0x171717,
  hemiSky: 0xC8C8C8,
  hemiGround: 0x333333,
  hemiIntensity: 1
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

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 4000);

  scene.add(camera);
  camera.position.set(0, 0, -50);
  camera.lookAt(scene.position);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  THREEx.WindowResize(renderer, camera);
}

function createObjects() {
  var lightContainer = new THREE.Object3D();
  var lightSphere = new THREE.Mesh(new THREE.SphereGeometry(1,6,6), new THREE.MeshBasicMaterial());
  dirLight = new THREE.DirectionalLight(0xFFE79B, 1);
  lightContainer.position.set(125, 0, 60);
  lightContainer.add(lightSphere);
  lightContainer.add(dirLight);
  window.lightContainer = lightContainer;

  ambientLight = new THREE.AmbientLight(sceneProperties.ambient);

  hemiLight = new THREE.HemisphereLight(sceneProperties.hemiSky, sceneProperties.hemiGround, sceneProperties.hemiIntensity);

  var objectGeo = new THREE.IcosahedronGeometry(10);
  var objectMat = new THREE.MeshPhongMaterial();
  objectMat.color.setHex(sceneProperties.color);
  objectMat.shading = sceneProperties.shading;
  objectMat.shininess = sceneProperties.shininess;
  objectMat.needsUpdate = true;
  object = new THREE.Mesh(objectGeo, objectMat);

  var loader = new THREE.ColladaLoader();
  loader.load('obj/mountain-scene-water.dae', function(collada){
    landscape = collada.scene;
    landscape.rotation.x = -Math.PI / 2;
    landscape.position.y = -40;
    landscape.scale.set(20, 20, 20);
    landscape.visible = false;
    scene.add(landscape)
  })

  scene.add(ambientLight);
  scene.add(hemiLight);
  scene.add(lightContainer);
  scene.add(object);
}

function buildGui() {
  var gui = new dat.GUI();
  var objFolder = gui.addFolder('object properties');
  var sceneFolder = gui.addFolder('scene properties');

  objFolder.addColor(sceneProperties, 'color' ).onChange(function(val){
    object.material.color.setHex(val);
  });

  objFolder.addColor(sceneProperties, 'specular' ).onChange(function(val){
    if (object.material.specular) {
      object.material.specular.setHex(val);
    }
  });

  objFolder.add(sceneProperties, 'shininess', 1, 100).onChange(function(val){
    object.material.shininess = val;
  })

  objFolder.add(sceneProperties, 'shading', {
    flat: 'THREE.FlatShading',
    smooth: 'THREE.SmoothShading'
  }).onChange(function(val){
    object.material.shading = eval(val);
    updateObject();
  })

  objFolder.add(sceneProperties, 'material', {
    lambert: 'new THREE.MeshLambertMaterial()',
    phong: 'new THREE.MeshPhongMaterial()'
  }).onChange(function(val){
    object.material = eval(val);
    if(val === 'new THREE.MeshPhongMaterial()') {
      object.material.specular.setHex(sceneProperties.specular);
    }
    object.material.color.setHex(sceneProperties.color);
    object.material.shading = sceneProperties.shading;
    updateObject();
  })



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

function updateObject() {
  object.material.needsUpdate = true;
  object.geometry.verticesNeedUpdate = true;
  object.geometry.normalsNeedUpdate = true;
  object.geometry.colorsNeedUpdate = true;
}

function animate() {

  requestAnimationFrame(animate);

  controls.update();

  object.rotation.y += 0.01

  renderer.render(scene, camera);
}