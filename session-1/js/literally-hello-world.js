var containter;
var renderer;
var scene;
var camera;
var controls;
var world;

init();

createObjects();

animate();

function init() {

  //////////////////////////
  //        Intro         //
  //////////////////////////

  // Init creates the essential pieces to run a three.js experiment:
  // a renderer, scene & camera

  //////////////////////////
  //      Renderer        //
  //////////////////////////

  // renderer displays the 3d scene we create in WebGL. Three.js also has a
  // canvas renderer and others, but WebGLRenderer has by far the best
  // performance, and it's what we're here to play with. In practice we'd check
  // for WebGL support, but this is a controlled environment, so who cares.

  // For now all we do is enable antialiasing for smoothness, set the pixel
  // ratio (for retina devices), and set the renderer's size to cover the whole screen.

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  // Then all we have to do is add the renderer's <canvas> to the body

  document.body.appendChild(renderer.domElement);

  //////////////////////////
  //        Scene         //
  //////////////////////////

  // Scenes hold all the fun stuff we make, and are what the renderer renders.
  // All we have to do for now is make one. We'll be adding objects to it
  // throughout.

  scene = new THREE.Scene();

  //////////////////////////
  //        Camera        //
  //////////////////////////

  // Cameras are what we look through to view the scene. They tell the renderer
  // What parts of the scene get rendered onto the <canvas>, and how the scene
  // appears. Here we use a PerspectiveCamera, the most common camera type.
  // Your eyes are perspective cameras.

  // We create it with a 45 degree field of view (common for 3d stuff like games, etc),
  // the aspect ratio of the screen, since the renderer is set that size. A near
  // value of 0.1, which just means that objects wont be cut off unless they're 
  // VERY close to the camera.  And a far plane of 200 beyond which objects won't
  // be rendered.

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);

  // Next we add the camera to the scene. Three.js does this automatically in most
  // cases but I'm doing it manually here to create a habit of adding objects to
  // the scene.  We set the camera's position centered on the X & Y axis but pull
  // it back 50 units along the Z axis. We then tell the camera to look at the
  // center of the scene.

  scene.add(camera);
  camera.position.set(0, 0, -50);
  camera.lookAt(scene.position);

  //////////////////////////
  //       Controls       //
  //////////////////////////

  // Controls are modules loaded from threejs/examples/js/controls (a weird
  // organizational structure, I know). You can get super fancy with controls,
  // but for this all we need is out of the box orbit controls, which uses the
  // mouse to rotate the camera round a fixed point.

  controls = new THREE.OrbitControls(camera);

  //////////////////////////
  //       Resizing       //
  //////////////////////////

  // Finally, we use threex, a set of three.js extensions, to handle window
  // resizing. Its a simple function you could write yourself, but why reinvent
  // the wheel, right? Without this, the renderer size wouldn't scale with the
  // window.

  THREEx.WindowResize(renderer, camera);
}

function createObjects() {

  //////////////////////////
  //        Intro         //
  //////////////////////////

  // createObjects is where we create all the stuff that will get displayed in
  // our scene.

  //////////////////////////
  //       Lights         //
  //////////////////////////

  // Because we're used to living in a world where there's always at least a 
  // little bit of light, it's easy to take for granted the fact that without
  // a light, we wouldn't see anything.  If you comment out the lights, you won't
  // be able to see any of your objects.

  // First we create a directional light to act as the sun, give it a bright, 
  // slightly yellow color, and give it an intensity of 1. We position it a good
  // distance from the origin so it won't overwhelm the scene with light.

  var sunLight = new THREE.DirectionalLight(0xFFE79B, 1);
  sunLight.position.set(125, 0, 60);

  // Next we create an ambient light. Ambient lights have no intensity, just color
  // because they affect every object in the scene equally. "Intensity" is
  // simply controlled by how bright the color is. In some ways its like painting 
  // every object in the scene with a brush. If you have a bright blue object and
  // a bright red ambient light, it will just appear purple.

  // We're setting a very dark color, but not quite black, so the dark side of
  // the world will be just slightly visible. Try setting it to different colors
  // to get a sense of how ambient lights work.

  var ambientLight = new THREE.AmbientLight(0x171717);

  // Now we get to make our world 3d object. Every 3d object is made of two
  // components: a geometry and a material. In the broadest of strokes,
  // geometries define an object's shape, and materials define an object's
  // appearance (generally how it responds to light).

  // We're creating a sphere with a radius of 10, and 32 faces both horizontally
  // and vertically, so it looks nice and round. We're using a Lambert material,
  // which gives the world a matte finish (you could use phong for a shinier, 
  // more marble like finish if you want). Because this wouldn't be literally
  // hello world with just a sphere, we use image utilities to create a texture
  // map for the material from a jpeg.  Then we just make the mesh out of the 
  // geometry and material.

  var worldGeo = new THREE.SphereGeometry(10, 32, 32);
  var worldTexture = THREE.ImageUtils.loadTexture('img/earth-8k.jpg');
  var worldMat = new THREE.MeshLambertMaterial({map: worldTexture});
  world = new THREE.Mesh(worldGeo, worldMat);

  // Finally we just add the lights and the world to the scene.

  scene.add(ambientLight);
  scene.add(sunLight);
  scene.add(world);
}

function animate() {

  //////////////////////////
  //        Intro         //
  //////////////////////////

  // animate() is what is known as a render loop. Every render loop begins with 
  // a recursive requestAnimationFrame call to run this every single frame. It's
  // far more performant this way than with setInterval. Every render loop at
  // bare minimum will call renderer.render to create and display the current
  // frame. We go beyond the minimum here, updating controls (turning any mouse 
  // movement into camera movement), and giving the globe a nice easy spin.

  requestAnimationFrame(animate);

  world.rotation.y += 0.003;
  controls.update();

  renderer.render(scene, camera);
}