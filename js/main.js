var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var character, piccione;

var piccioni= [];

camera.position.z = 10;

function render() {
    requestAnimationFrame(render);
    ruotapiccione();
    ruotapiccioni();
    renderer.render(scene, camera);
}
var mesh = null;

var materials = [
    new THREE.MeshStandardMaterial( {
      color: 0xE7E7E7,
      roughness: 0.5
    } ), // right
    new THREE.MeshStandardMaterial( {
      color: 0xE7790D,
      roughness: 0.5
    } ), // left
    new THREE.MeshStandardMaterial( {
      color: 0x5C8678,
      roughness: 0.5
    } ), // top
    new THREE.MeshStandardMaterial( {
      color: 0x373737,
      roughness: 0.5
    } ), // bottom
];

function initLights() {
    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
}

function initMesh() {
    var loader = new THREE.JSONLoader();
    loader.load('./models/piccione.json', function(geometry,mat) {
        piccione = new THREE.Mesh(
            geometry,
            new THREE.MultiMaterial(materials)
        );
        multiply();
        scene.add(piccione);
    });
}

var SPEED = 0.01;

function ruotapiccione() {
    //piccione.rotation.x -= SPEED * 2;
    piccione.rotation.y -= SPEED;
    //piccione.rotation.z -= SPEED * 3;
}

function ruotapiccioni() {
  for( i=0; i<piccioni.length; i++){
    //piccioni[i].rotation.x -= SPEED;
    piccioni[i].rotation.y -= SPEED*2;
    //piccioni[i].rotation.z -= SPEED*3;

  }
}

function multiply(){
  for ( i=0; i<10; i++){
    for ( j=0; j<10; j++){

    var p=piccione.clone();
    p.position.set(
      10*i-50,
      10*j-50,
      Math.random()*-100
    );
    piccioni.push(p);
    scene.add(p);
    // p.position.x=Math.random()*100-50;
    // p.position.y=Math.random()*100-50;
    // p.position.z=Math.random()*100-50;
    // scene.add(p);
  }
}
}

initLights();
initMesh();
render();
