import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Initialize the scene
function init() {
  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f7);

  // Create camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 4, 10);

  // Create renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.getElementById("3d-container").appendChild(renderer.domElement);

  // Add orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2;

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7.5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  // Create ground
  const groundGeometry = new THREE.CircleGeometry(15, 32);
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xaaffaa });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Create warehouse
  createWarehouse(scene, -6, 0, 0);

  // Create tree
  createTree(scene, 6, 0, 0);

  // Create AI brain
  createAIBrain(scene, 0, 4, 0);

  // Create delivery truck
  createTruck(scene, -2, 0, 4);

  // Create ESG badge
  createESGBadge(scene, 8, 4, -4);

  // Create connecting lines
  createConnectingLines(scene);

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// Create warehouse
function createWarehouse(scene, x, y, z) {
  const warehouseGroup = new THREE.Group();

  // Main building
  const buildingGeometry = new THREE.BoxGeometry(4, 2.5, 3);
  const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0xcfd8dc });
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  building.position.y = 1.25;
  building.castShadow = true;
  building.receiveShadow = true;
  warehouseGroup.add(building);

  // Roof
  const roofGeometry = new THREE.BoxGeometry(4.4, 0.2, 3.4);
  const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x90a4ae });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.y = 2.6;
  roof.castShadow = true;
  warehouseGroup.add(roof);

  // Door
  const doorGeometry = new THREE.BoxGeometry(1.5, 1.5, 0.1);
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(0, 0.75, 1.51);
  warehouseGroup.add(door);

  // Label
  createTextLabel("Warehouse A", 0, 3, 0, warehouseGroup);

  warehouseGroup.position.set(x, y, z);
  scene.add(warehouseGroup);
}

// Create tree
function createTree(scene, x, y, z) {
  const treeGroup = new THREE.Group();

  // Trunk
  const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 2, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.y = 1;
  trunk.castShadow = true;
  treeGroup.add(trunk);

  // Leaves
  const leavesGeometry = new THREE.SphereGeometry(1.5, 16, 16);
  const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x4caf50 });
  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.position.y = 2.8;
  leaves.castShadow = true;
  treeGroup.add(leaves);

  treeGroup.position.set(x, y, z);
  scene.add(treeGroup);
}

// Create AI brain
function createAIBrain(scene, x, y, z) {
  const brainGroup = new THREE.Group();

  // Brain sphere
  const brainGeometry = new THREE.SphereGeometry(1, 16, 16);
  const brainMaterial = new THREE.MeshStandardMaterial({
    color: 0x7986cb,
    emissive: 0x3f51b5,
    emissiveIntensity: 0.2,
  });
  const brain = new THREE.Mesh(brainGeometry, brainMaterial);
  brain.castShadow = true;
  brainGroup.add(brain);

  // Neural network (lines crossing the brain)
  for (let i = 0; i < 5; i++) {
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(1, 0, 0),
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.rotation.x = Math.random() * Math.PI;
    line.rotation.y = Math.random() * Math.PI;
    brainGroup.add(line);
  }

  brainGroup.position.set(x, y, z);
  scene.add(brainGroup);

  // Add animation
  return brainGroup;
}

// Create truck
function createTruck(scene, x, y, z) {
  const truckGroup = new THREE.Group();

  // Cabin
  const cabinGeometry = new THREE.BoxGeometry(1, 1, 0.8);
  const cabinMaterial = new THREE.MeshStandardMaterial({ color: 0x3f51b5 });
  const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
  cabin.position.y = 0.5;
  cabin.position.z = 0.6;
  cabin.castShadow = true;
  truckGroup.add(cabin);

  // Cargo
  const cargoGeometry = new THREE.BoxGeometry(1.5, 1.2, 2);
  const cargoMaterial = new THREE.MeshStandardMaterial({ color: 0xeceff1 });
  const cargo = new THREE.Mesh(cargoGeometry, cargoMaterial);
  cargo.position.y = 0.6;
  cargo.position.z = -0.6;
  cargo.castShadow = true;
  truckGroup.add(cargo);

  // Wheels
  const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
  wheelGeometry.rotateX(Math.PI / 2);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x212121 });

  const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheel1.position.set(0.5, 0.3, 0.6);
  truckGroup.add(wheel1);

  const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheel2.position.set(-0.5, 0.3, 0.6);
  truckGroup.add(wheel2);

  const wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheel3.position.set(0.5, 0.3, -0.6);
  truckGroup.add(wheel3);

  const wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheel4.position.set(-0.5, 0.3, -0.6);
  truckGroup.add(wheel4);

  truckGroup.position.set(x, y, z);
  scene.add(truckGroup);

  return truckGroup;
}

// Create ESG badge
function createESGBadge(scene, x, y, z) {
  const badgeGroup = new THREE.Group();

  const badgeGeometry = new THREE.CircleGeometry(1, 32);
  const badgeMaterial = new THREE.MeshStandardMaterial({
    color: 0x81c784,
    emissive: 0x4caf50,
    emissiveIntensity: 0.3,
  });
  const badge = new THREE.Mesh(badgeGeometry, badgeMaterial);
  badge.castShadow = true;
  badgeGroup.add(badge);

  createTextLabel("ESG", 0, 0, 0.1, badgeGroup);

  badgeGroup.position.set(x, y, z);
  scene.add(badgeGroup);
}

// Create connecting lines
function createConnectingLines(scene) {
  // Route lines
  const lineMaterial = new THREE.LineDashedMaterial({
    color: 0x9e9e9e,
    dashSize: 0.5,
    gapSize: 0.3,
  });

  // Warehouse to AI
  const warehouseToAIPoints = [
    new THREE.Vector3(-6, 1, 0),
    new THREE.Vector3(0, 4, 0),
  ];
  const warehouseToAIGeometry = new THREE.BufferGeometry().setFromPoints(
    warehouseToAIPoints
  );
  const warehouseToAILine = new THREE.Line(warehouseToAIGeometry, lineMaterial);
  warehouseToAILine.computeLineDistances();
  scene.add(warehouseToAILine);

  // AI to Tree
  const aiToTreePoints = [
    new THREE.Vector3(0, 4, 0),
    new THREE.Vector3(6, 1, 0),
  ];
  const aiToTreeGeometry = new THREE.BufferGeometry().setFromPoints(
    aiToTreePoints
  );
  const aiToTreeLine = new THREE.Line(aiToTreeGeometry, lineMaterial);
  aiToTreeLine.computeLineDistances();
  scene.add(aiToTreeLine);

  // Truck to AI
  const truckToAIPoints = [
    new THREE.Vector3(-2, 1, 4),
    new THREE.Vector3(0, 4, 0),
  ];
  const truckToAIGeometry = new THREE.BufferGeometry().setFromPoints(
    truckToAIPoints
  );
  const truckToAILine = new THREE.Line(truckToAIGeometry, lineMaterial);
  truckToAILine.computeLineDistances();
  scene.add(truckToAILine);
}

// Helper function for text labels (simplified)
function createTextLabel(text, x, y, z, parent) {
  // In a real implementation, you would use a sprite or HTML element
  // Since Three.js doesn't have native text, this is a placeholder
  const sphereGeometry = new THREE.SphereGeometry(0.1, 8, 8);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(x, y + 0.5, z);
  parent.add(sphere);
}

// Start the scene when DOM is loaded
window.addEventListener("DOMContentLoaded", init);

export { init };
