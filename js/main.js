var clock
var character, piccione, ground;
var food = [];

var scene, renderer, camera, controls;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var action = {},
    mixer;


var materials = [
    new THREE.MeshPhongMaterial({
        // color: 0xE7E7E7,
        // roughness: 0.5
        color: 0xBCC6CC,
        shininess: 30,
        metal: true,
        wrapAround: true,
        shading: THREE.FlatShading
    }), // right
    new THREE.MeshStandardMaterial({
        color: 0xE7790D,
        roughness: 0.5
    }), // left
    new THREE.MeshStandardMaterial({
        color: 0x5C8678,
        roughness: 0.5
    }), // top
    new THREE.MeshStandardMaterial({
        color: 0x373737,
        roughness: 0.5
    }), // bottom
];

init();

function init() {

    clock = new THREE.Clock();

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x9debf4, 1);

    container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    camera.position.y = 5;

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 0.6, 0);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener( 'mousedown', onMouseDown, false );

    initLights();
    initMesh();
    initTerrain();
}


function initLights() {
    var light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    var light2 = new THREE.PointLight(0x0000ff, 1, 100);
    light2.position.set(50, 50, 1);
    scene.add(light2);

    var light3 = new THREE.PointLight(0xffff00, 1, 100);
    light3.position.set(-50, 50, 1);
    scene.add(light3);
}

function initTerrain(){
    var geometry = new THREE.PlaneBufferGeometry(100, 100);
    geometry.rotateX(-Math.PI / 2);
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 0 ) );

    var material = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        roughness: 0.5
    })
    ground = new THREE.Mesh(geometry, material);
    scene.add(ground);
}

function initMesh() {
    var loader = new THREE.JSONLoader();
    loader.load('./models/piccione_walk.json', function(geometry, mat) {

      for (var k in materials) {
              materials[k].skinning = true;
          }

        piccione = new THREE.SkinnedMesh(
            geometry,
            new THREE.MultiMaterial(materials)
        );

        mixer = new THREE.AnimationMixer(piccione);
        console.log(geometry.animations);

        action.walk = mixer.clipAction(geometry.animations[2]);
        action.walk.setEffectiveWeight(1);
        action.walk.enabled = true;


        action.bite = mixer.clipAction(geometry.animations[1]);
        action.bite.setEffectiveWeight(1);
        action.bite.enabled = true;
        action.bite.setLoop( THREE.LoopOnce,0 );
        action.bite.clampWhenFinished = true;


        //multiply();
        scene.add(piccione);

        // skeletonHelper = new THREE.SkeletonHelper( piccione );
				// skeletonHelper.material.linewidth = 2;
				// scene.add( skeletonHelper );

        animate();
        isLoaded = true;
        //action.bite.play();

    });
}

function rotateToFood(){
  if (food.length>0){
    piccione.lookAt(food[food.length-1].position);
  }
}

function walkToFood(){
  if (food.length>0){

    var vec1=piccione.position;
    var vec2=food[food.length-1].position;
    var distance = vec1.distanceTo( vec2 );
    if (distance<4){
      scene.remove(food[food.length-1]);
      food.pop(food.length-1);
      action.walk.stop();
      action.bite.play();
      action.bite.reset();

    }else{
      piccione.translateZ( 0.1 );
      action.walk.play();

    }
  }
}

function createFood(x,y,z){
  var geometry = new THREE.BoxGeometry(.3, .3,.3);
  // geometry.position( new THREE.Matrix4().makeTranslation( x, y, z ) );
  var material = new THREE.MeshStandardMaterial({
      color: 0xffaaaa,
      roughness: 0.5
  })
  var f = new THREE.Mesh(geometry, material);
  scene.add(f);
  f.position.set( x, y, z );
  food.push(f);
}

function onMouseDown(e){
  mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
  mouse.y = 1 - 2 * ( e.clientY / window.innerHeight );
  raycaster.setFromCamera( mouse, camera );

  var terrains = [];
  terrains.push( ground );

  var intersects = raycaster.intersectObjects( terrains );

  if ( intersects.length > 0 ) {
    createFood(intersects[ 0 ].point.x,intersects[ 0 ].point.y,intersects[ 0 ].point.z);
  }
//  console.log(intersects);

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate () {
  requestAnimationFrame(animate);
  //ruotapiccione();
  controls.update();
  rotateToFood();
  walkToFood();


  render();
}

function render () {
  var delta = clock.getDelta();
  mixer.update(delta);
  renderer.render(scene, camera);
}
