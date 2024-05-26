const progressBar = document.querySelector(".progress");
const progressText = document.querySelector(".progress-text");
const downloadText = document.getElementById("download-text");
const progressBarContainer = document.querySelector(".progress-bar-container");
const checkmarkContainer = document.querySelector(".checkmark-container");

let progress = 0;
const totalTime = 1500;
const maxProgress = 100;

function simulateDownload() {
  const startTime = Date.now();
  const increment = maxProgress / (totalTime / 100);

  function updateProgress() {
    const elapsedTime = Date.now() - startTime;
    progress = Math.min((elapsedTime / totalTime) * maxProgress, maxProgress);

    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.floor(progress)}%`;

    if (progress < maxProgress) {
      requestAnimationFrame(updateProgress);
    } else {
      downloadText.innerHTML =
        'Thanks for downloading Nihon <span class="heart">❤</span>';
      progressText.style.opacity = "0";
      progressBarContainer.style.opacity = "0";

      setTimeout(() => {
        progressBarContainer.style.display = "none";
        checkmarkContainer.style.display = "block";
      }, 500);
    }
  }

  requestAnimationFrame(updateProgress);
}

simulateDownload();

function disableDragImages() {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.addEventListener("dragstart", (ev) => {
      ev.preventDefault();
    });
  });
}

function disableDragNavLinks() {
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.addEventListener("dragstart", (ev) => {
      ev.preventDefault();
    });
  });
}

document.addEventListener("selectstart", (ev) => {
  ev.preventDefault();
});

window.addEventListener("load", () => {
  disableDragImages();
  disableDragNavLinks();
});
