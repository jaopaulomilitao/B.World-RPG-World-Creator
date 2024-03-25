import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

let scene, camera, renderer, objects, dragControls, orbitControls, plane;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.setScalar(20);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Adiciona controles de órbita para controlar a câmera com o botão direito do mouse
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.mouseButtons = {
        LEFT: THREE.MOUSE.NONE, // Desabilita o movimento com o botão esquerdo
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
    };

    // Inicializa a lista de objetos e os DragControls
    objects = [];
    dragControls = new DragControls(objects, camera, renderer.domElement);

    // Adiciona uma textura transparente para o plano verde
    let textureLoader = new THREE.TextureLoader();
    let texture = textureLoader.load('textures/druida.png');
    let materialTransparent = new THREE.MeshBasicMaterial({ map: texture, transparent: true });

    // Cria um plano com a textura transparente
    let geometryTransparent = new THREE.PlaneGeometry(6, 6);
    plane = new THREE.Mesh(geometryTransparent, materialTransparent);
    plane.position.y = 0.01; // Coloca o plano ligeiramente acima da grade
    plane.userData.limit = {
        min: new THREE.Vector3(-10, 0, -10),
        max: new THREE.Vector3(10, 0, 10)
    };
    objects.push(plane);
    scene.add(plane);

    // Adiciona um novo plano com textura para substituir a grade
    let textureGrid = textureLoader.load('textures/mapa.jpg');
    let materialGrid = new THREE.MeshBasicMaterial({ map: textureGrid });
    let geometryGrid = new THREE.PlaneGeometry(50, 50);
    let grid = new THREE.Mesh(geometryGrid, materialGrid);
    grid.position.y = -3; // Reduz a altura do plano
    grid.rotation.x += Math.PI / 2;
    grid.rotation.y += Math.PI;
    scene.add(grid);

    // Adiciona a skybox
    let skyboxTexture = textureLoader.load('textures/skybox.jpg');
    scene.background = skyboxTexture;


    // Define o loop de animação
    renderer.setAnimationLoop(animate);
}

function animate() {
    objects.forEach(o => {
        if (o === plane) {
            updatePlanePosition(o);
            updatePlaneRotation(o);
        }
    });

    renderer.render(scene, camera);
}

function updatePlanePosition(plane) {
    // Restringe a posição do plano aos limites do plano com a grade
    let newPosition = plane.position.clone().clamp(plane.userData.limit.min, plane.userData.limit.max);
    plane.position.copy(newPosition);
}

function updatePlaneRotation(plane) {
    // Atualiza a rotação do plano para sempre olhar na direção da câmera
    let lookAtMatrix = new THREE.Matrix4();
    lookAtMatrix.lookAt(camera.position, plane.position, camera.up);
    plane.quaternion.setFromRotationMatrix(lookAtMatrix);
}

init();
