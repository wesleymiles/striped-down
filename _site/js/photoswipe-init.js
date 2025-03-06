document.addEventListener("DOMContentLoaded", () => {
    const lightbox = new PhotoSwipe({
      gallery: ".gallery",
      children: "a",
      pswpModule: PhotoSwipe
    });
  
    lightbox.init();
  });