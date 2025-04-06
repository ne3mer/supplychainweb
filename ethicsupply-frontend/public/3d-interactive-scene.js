import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Main scene setup
function init() {
  // Scene, camera, renderer setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8f9fa);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(5, 5, 10);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const container = document.getElementById("3d-container");
  if (container) {
    // Clear any existing content
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
  } else {
    console.error("Container not found");
    return;
  }

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2;
  controls.minDistance = 3;
  controls.maxDistance = 20;

  // World elements
  createWorld(scene);

  // Add event listeners for window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation loop
  const animationObjects = [];

  function animate() {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();

    // Update animations
    const time = Date.now() * 0.001; // Convert to seconds

    // Update drone position
    if (window.drone) {
      window.drone.position.y = 5 + Math.sin(time) * 0.2;
      window.drone.rotation.y += 0.01;
    }

    // Update factory emissions
    if (window.emissionParticles) {
      window.emissionParticles.rotation.y += 0.01;
    }

    // Update digital data flow
    if (window.dataFlows) {
      window.dataFlows.forEach((flow) => {
        // Move data packets along paths
        flow.children.forEach((packet) => {
          packet.position.y += 0.05;
          if (packet.position.y > 5) {
            packet.position.y = 0;
          }
        });
      });
    }

    // Update globe rotation
    if (window.globe) {
      window.globe.rotation.y += 0.002;
    }

    // Update connections
    if (window.connections) {
      window.connections.forEach((connection) => {
        connection.material.dashOffset -= 0.01;
      });
    }

    renderer.render(scene, camera);
  }

  animate();
}

// Create world elements
function createWorld(scene) {
  // Add a platform/ground
  const groundGeometry = new THREE.CylinderGeometry(10, 10, 0.5, 32);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0xecf0f1,
    metalness: 0.2,
    roughness: 0.8,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.position.y = -0.25;
  ground.receiveShadow = true;
  scene.add(ground);

  // Create a decorative ring around the platform
  const ringGeometry = new THREE.RingGeometry(10, 10.3, 32);
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0x2ecc71,
    metalness: 0.3,
    roughness: 0.7,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.01;
  scene.add(ring);

  // Create a mini globe (representing global supply chain)
  const globeGeometry = new THREE.SphereGeometry(1, 32, 32);
  const globeMaterial = new THREE.MeshStandardMaterial({
    color: 0x3498db,
    metalness: 0.1,
    roughness: 0.8,
  });
  const globe = new THREE.Mesh(globeGeometry, globeMaterial);
  globe.position.set(-3, 2, -2);
  globe.castShadow = true;
  globe.receiveShadow = true;
  scene.add(globe);
  window.globe = globe;

  // Add grid lines to globe (longitude/latitude)
  const globeWireframe = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.SphereGeometry(1.01, 16, 16)),
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    })
  );
  globe.add(globeWireframe);

  // Create a warehouse
  createWarehouse(scene, 3, 0, -2);

  // Create a factory with emissions (representing environmental impact)
  createFactory(scene, -4, 0, 2);

  // Create a drone (representing modern supply chain technology)
  createDrone(scene, 0, 5, 0);

  // Create digital data flows (representing AI and data analysis)
  createDataFlows(scene);

  // Create connecting lines between elements
  createConnections(scene);

  // Create decorative trees
  createTrees(scene);
}

// Create a warehouse
function createWarehouse(scene, x, y, z) {
  const warehouseGroup = new THREE.Group();

  // Main building
  const buildingGeometry = new THREE.BoxGeometry(2, 1.5, 2);
  const buildingMaterial = new THREE.MeshStandardMaterial({
    color: 0xecf0f1,
    metalness: 0.1,
    roughness: 0.8,
  });
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  building.position.y = 0.75;
  building.castShadow = true;
  building.receiveShadow = true;
  warehouseGroup.add(building);

  // Roof
  const roofGeometry = new THREE.ConeGeometry(1.5, 0.7, 4);
  const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0xe74c3c,
    metalness: 0.1,
    roughness: 0.8,
  });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.y = 1.75;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  warehouseGroup.add(roof);

  // Door
  const doorGeometry = new THREE.PlaneGeometry(0.6, 0.8);
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x34495e,
    metalness: 0.3,
    roughness: 0.8,
    side: THREE.DoubleSide,
  });
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(0, 0.4, 1.01);
  warehouseGroup.add(door);

  // Windows
  const windowGeometry = new THREE.PlaneGeometry(0.4, 0.4);
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x3498db,
    metalness: 0.5,
    roughness: 0.5,
    side: THREE.DoubleSide,
    opacity: 0.7,
    transparent: true,
  });

  const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
  window1.position.set(-0.5, 1, 1.01);
  warehouseGroup.add(window1);

  const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
  window2.position.set(0.5, 1, 1.01);
  warehouseGroup.add(window2);

  warehouseGroup.position.set(x, y, z);
  scene.add(warehouseGroup);
  window.warehouse = warehouseGroup;
}

// Create a factory with emissions
function createFactory(scene, x, y, z) {
  const factoryGroup = new THREE.Group();

  // Main building
  const buildingGeometry = new THREE.BoxGeometry(2, 2, 2);
  const buildingMaterial = new THREE.MeshStandardMaterial({
    color: 0xbdc3c7,
    metalness: 0.2,
    roughness: 0.8,
  });
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  building.position.y = 1;
  building.castShadow = true;
  building.receiveShadow = true;
  factoryGroup.add(building);

  // Chimney
  const chimneyGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
  const chimneyMaterial = new THREE.MeshStandardMaterial({
    color: 0x95a5a6,
    metalness: 0.3,
    roughness: 0.7,
  });
  const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
  chimney.position.set(0.5, 2.75, 0.5);
  chimney.castShadow = true;
  factoryGroup.add(chimney);

  // Emissions particles (representing pollution)
  const emissionParticles = new THREE.Group();
  const particleGeometry = new THREE.SphereGeometry(0.07, 8, 8);
  const particleMaterial = new THREE.MeshStandardMaterial({
    color: 0x7f8c8d,
    transparent: true,
    opacity: 0.7,
  });

  // Create a spiral of particles
  for (let i = 0; i < 20; i++) {
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    const angle = i * 0.3;
    const radius = 0.1 + i * 0.02;
    particle.position.set(
      Math.cos(angle) * radius,
      i * 0.1,
      Math.sin(angle) * radius
    );
    emissionParticles.add(particle);
  }

  emissionParticles.position.set(0.5, 3.5, 0.5);
  factoryGroup.add(emissionParticles);
  window.emissionParticles = emissionParticles;

  // Add a filter to chimney (representing environmental responsibility)
  const filterGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
  const filterMaterial = new THREE.MeshStandardMaterial({
    color: 0x2ecc71,
    metalness: 0.3,
    roughness: 0.7,
  });
  const filter = new THREE.Mesh(filterGeometry, filterMaterial);
  filter.position.set(0.5, 3.3, 0.5);
  factoryGroup.add(filter);

  factoryGroup.position.set(x, y, z);
  scene.add(factoryGroup);
  window.factory = factoryGroup;
}

// Create a drone
function createDrone(scene, x, y, z) {
  const droneGroup = new THREE.Group();

  // Drone body
  const bodyGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.8);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x2c3e50,
    metalness: 0.5,
    roughness: 0.5,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  droneGroup.add(body);

  // Propeller arms
  const armGeometry = new THREE.BoxGeometry(0.1, 0.1, 1.2);
  const armMaterial = new THREE.MeshStandardMaterial({
    color: 0x7f8c8d,
    metalness: 0.5,
    roughness: 0.5,
  });

  const arm1 = new THREE.Mesh(armGeometry, armMaterial);
  droneGroup.add(arm1);

  const arm2 = new THREE.Mesh(armGeometry, armMaterial);
  arm2.rotation.y = Math.PI / 2;
  droneGroup.add(arm2);

  // Propellers
  const propellerGeometry = new THREE.BoxGeometry(0.6, 0.05, 0.1);
  const propellerMaterial = new THREE.MeshStandardMaterial({
    color: 0x3498db,
    metalness: 0.5,
    roughness: 0.5,
  });

  // Front left
  const propeller1 = new THREE.Mesh(propellerGeometry, propellerMaterial);
  propeller1.position.set(0, 0.1, 0.6);
  propeller1.rotation.y = Math.random() * Math.PI;
  droneGroup.add(propeller1);

  // Front right
  const propeller2 = new THREE.Mesh(propellerGeometry, propellerMaterial);
  propeller2.position.set(0.6, 0.1, 0);
  propeller2.rotation.y = Math.random() * Math.PI + Math.PI / 2;
  droneGroup.add(propeller2);

  // Back left
  const propeller3 = new THREE.Mesh(propellerGeometry, propellerMaterial);
  propeller3.position.set(0, 0.1, -0.6);
  propeller3.rotation.y = Math.random() * Math.PI;
  droneGroup.add(propeller3);

  // Back right
  const propeller4 = new THREE.Mesh(propellerGeometry, propellerMaterial);
  propeller4.position.set(-0.6, 0.1, 0);
  propeller4.rotation.y = Math.random() * Math.PI + Math.PI / 2;
  droneGroup.add(propeller4);

  // Package
  const packageGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.4);
  const packageMaterial = new THREE.MeshStandardMaterial({
    color: 0xf1c40f,
    metalness: 0.1,
    roughness: 0.8,
  });
  const package = new THREE.Mesh(packageGeometry, packageMaterial);
  package.position.y = -0.3;
  droneGroup.add(package);

  // Camera (representing monitoring & oversight)
  const cameraGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
  const cameraMaterial = new THREE.MeshStandardMaterial({
    color: 0xe74c3c,
    metalness: 0.5,
    roughness: 0.5,
  });
  const camera = new THREE.Mesh(cameraGeometry, cameraMaterial);
  camera.rotation.x = Math.PI / 2;
  camera.position.set(0, -0.1, 0.3);
  droneGroup.add(camera);

  droneGroup.position.set(x, y, z);
  droneGroup.castShadow = true;
  scene.add(droneGroup);
  window.drone = droneGroup;
}

// Create digital data flows (representing AI analysis)
function createDataFlows(scene) {
  const dataFlows = [];

  // Create three vertical data flows
  for (let i = 0; i < 3; i++) {
    const dataFlow = new THREE.Group();
    const x = i * 2 - 2;

    // Create the flow path
    const pathGeometry = new THREE.CylinderGeometry(0.03, 0.03, 5, 8);
    const pathMaterial = new THREE.MeshStandardMaterial({
      color: 0x3498db,
      transparent: true,
      opacity: 0.3,
    });
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    path.position.y = 2.5;
    dataFlow.add(path);

    // Add data packets moving along the path
    for (let j = 0; j < 5; j++) {
      const packetGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      const packetMaterial = new THREE.MeshStandardMaterial({
        color: 0x2ecc71,
        emissive: 0x2ecc71,
        emissiveIntensity: 0.5,
      });
      const packet = new THREE.Mesh(packetGeometry, packetMaterial);
      packet.position.y = j;
      dataFlow.add(packet);
    }

    dataFlow.position.set(x, 0, -4);
    scene.add(dataFlow);
    dataFlows.push(dataFlow);
  }

  window.dataFlows = dataFlows;
}

// Create connections between elements (representing the integrated supply chain)
function createConnections(scene) {
  const connections = [];

  // Define connection points
  const points = [
    { name: "factory", position: new THREE.Vector3(-4, 1, 2) },
    { name: "warehouse", position: new THREE.Vector3(3, 1, -2) },
    { name: "globe", position: new THREE.Vector3(-3, 2, -2) },
    { name: "drone", position: new THREE.Vector3(0, 5, 0) },
    { name: "data", position: new THREE.Vector3(0, 2, -4) },
  ];

  // Connect points with dashed lines
  const lineMaterial = new THREE.LineDashedMaterial({
    color: 0x3498db,
    linewidth: 1,
    scale: 1,
    dashSize: 0.3,
    gapSize: 0.1,
  });

  // Create connections in a specific order
  const connectionPairs = [
    [0, 1], // factory to warehouse
    [1, 3], // warehouse to drone
    [3, 2], // drone to globe
    [2, 0], // globe to factory
    [3, 4], // drone to data
    [4, 0], // data to factory
    [4, 1], // data to warehouse
  ];

  connectionPairs.forEach((pair) => {
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      points[pair[0]].position,
      points[pair[1]].position,
    ]);

    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.computeLineDistances();
    scene.add(line);
    connections.push(line);
  });

  window.connections = connections;
}

// Create decorative trees
function createTrees(scene) {
  // Define positions for trees around the edge
  const treePositions = [
    { x: 8, z: 0 },
    { x: 7, z: 4 },
    { x: 4, z: 7 },
    { x: 0, z: 8 },
    { x: -4, z: 7 },
    { x: -7, z: 4 },
    { x: -8, z: 0 },
    { x: -7, z: -4 },
    { x: -4, z: -7 },
    { x: 0, z: -8 },
    { x: 4, z: -7 },
    { x: 7, z: -4 },
  ];

  treePositions.forEach((pos) => {
    // Random tree size
    const scale = 0.5 + Math.random() * 0.3;

    // Tree trunk
    const trunkGeometry = new THREE.CylinderGeometry(
      0.1 * scale,
      0.15 * scale,
      0.5 * scale,
      8
    );
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      metalness: 0.1,
      roughness: 0.9,
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(pos.x, 0.25 * scale, pos.z);
    trunk.castShadow = true;
    scene.add(trunk);

    // Tree foliage
    const foliageGeometry = new THREE.ConeGeometry(0.4 * scale, 1 * scale, 8);
    const foliageMaterial = new THREE.MeshStandardMaterial({
      color: 0x2ecc71,
      metalness: 0,
      roughness: 0.9,
    });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.set(pos.x, 0.75 * scale + 0.25, pos.z);
    foliage.castShadow = true;
    scene.add(foliage);
  });
}

// Start the scene when DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  // Check if the 3D container exists before initializing
  if (document.getElementById("3d-container")) {
    init();
  } else {
    // If the container isn't available yet, wait a moment and try again
    setTimeout(() => {
      if (document.getElementById("3d-container")) {
        init();
      } else {
        console.error("3D container not found after waiting");
      }
    }, 1000);
  }
});

export { init };
