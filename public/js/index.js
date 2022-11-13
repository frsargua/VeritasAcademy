let caruouselContainerEl = document.getElementById("carousel-slider");

let i = 0;
setInterval(() => {
  if (i === 3) {
    i = 0;
  }
  caruouselContainerEl.style.setProperty("--slide--number", String(i));
  i++;
}, 3000);
