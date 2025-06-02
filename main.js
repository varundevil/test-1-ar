import { MindARThree } from "https://cdn.jsdelivr.net/npm/mind-ar@1.1.5/dist/mindar-image-three.prod.js";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";

const loadingScreen = document.getElementById("loading-screen");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const errorMessage = document.getElementById("error-message");
const container = document.getElementById("container");

// Hide loading screen after full load
window.addEventListener("load", () => {
  console.log("Window loaded");
  loadingScreen.style.display = "none";
  startScreen.style.display = "flex";
});

startButton.addEventListener("click", async () => {
  const hasPermission = await checkCameraPermission();
  if (!hasPermission) {
    errorMessage.textContent = "Camera access denied. Please allow permission and reload.";
    return;
  }

  startScreen.style.display = "none";
  container.style.display = "block";
  startAR();
});

const checkCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (e) {
    console.warn("Camera access error:", e);
    return false;
  }
};

const startAR = async () => {
  const mindarThree = new MindARThree({
    container,
    imageTargetSrc: "./assets/marker.mind",
  });

  const { renderer, scene, camera } = mindarThree;

  const anchor = mindarThree.addAnchor(0);

  const video = document.createElement("video");
  video.src = "./assets/video.mp4";
  video.crossOrigin = "anonymous";
  video.loop = true;
  video.muted = true;
  video.playsInline = true;

  const texture = new THREE.VideoTexture(video);
  const geometry = new THREE.PlaneGeometry(1, 0.5625);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const plane = new THREE.Mesh(geometry, material);
  anchor.group.add(plane);

  anchor.onTargetFound = () => video.play();
  anchor.onTargetLost = () => video.pause();

  await video.play(); // Preload
  await mindarThree.start();
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
};
