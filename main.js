import { MindARThree } from 'https://cdn.jsdelivr.net/npm/mind-ar@1.1.5/dist/mindar-image-three.prod.js';

const video = document.createElement("video");
video.src = "./assets/video.mp4";
video.crossOrigin = "anonymous";
video.loop = true;
video.muted = true;
video.playsInline = true;

// DOM elements
const loadingScreen = document.getElementById("loading-screen");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const errorMessage = document.getElementById("error-message");
const container = document.getElementById("container");

const startAR = async () => {
  const mindarThree = new MindARThree({
    container,
    imageTargetSrc: "./assets/marker.mind",
  });

  const { renderer, scene, camera } = mindarThree;
  const anchor = mindarThree.addAnchor(0);

  await video.play(); // Preload video
  const texture = new THREE.VideoTexture(video);
  const geometry = new THREE.PlaneGeometry(1, 0.5625);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const plane = new THREE.Mesh(geometry, material);
  anchor.group.add(plane);

  anchor.onTargetFound = () => video.play();
  anchor.onTargetLost = () => video.pause();

  await mindarThree.start();
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
};

const checkCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(track => track.stop()); // Release camera
    return true;
  } catch (e) {
    return false;
  }
};

window.addEventListener("load", () => {
  // Simulate loading delay
  setTimeout(() => {
    loadingScreen.style.display = "none";
    startScreen.style.display = "flex";
  }, 1000);
});

startButton.addEventListener("click", async () => {
  const hasPermission = await checkCameraPermission();
  if (!hasPermission) {
    errorMessage.textContent = "Camera access denied. Please allow camera permissions and reload the page.";
    return;
  }

  // Hide start screen and show AR container
  startScreen.style.display = "none";
  container.style.display = "block";
  startAR();
});
