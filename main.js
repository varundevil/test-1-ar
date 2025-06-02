import { MindARThree } from 'https://cdn.jsdelivr.net/npm/mind-ar@1.1.5/dist/mindar-image-three.prod.js';

const start = async () => {
  const mindarThree = new MindARThree({
    container: document.querySelector("#container"),
    imageTargetSrc: "./assets/marker.mind",
  });

  const { renderer, scene, camera } = mindarThree;
  const anchor = mindarThree.addAnchor(0);

  // Create a video element
  const video = document.createElement("video");
  video.src = "./assets/video.mp4";
  video.crossOrigin = "anonymous";
  video.loop = true;
  video.muted = true;
  video.playsInline = true;

  await video.play();

  const texture = new THREE.VideoTexture(video);
  const geometry = new THREE.PlaneGeometry(1, 0.5625); // 16:9 ratio
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const plane = new THREE.Mesh(geometry, material);

  anchor.group.add(plane);

  anchor.onTargetFound = () => {
    video.play();
  };
  anchor.onTargetLost = () => {
    video.pause();
  };

  await mindarThree.start();
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
};

start();
