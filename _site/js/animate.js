document.addEventListener('DOMContentLoaded', function () {

  //
  const containers = document.querySelectorAll('.lottie');

  // Loop through each container
  containers.forEach(container => {
    // Get the path to the animation from the 'data-animation' attribute
    const animationPath = container.getAttribute('data-animation');

    // Configure Lottie options
    const animationOptions = {
      container: container,
      renderer: 'svg', // 'svg' or 'canvas'
      loop: true,
      autoplay: true,
      path: animationPath,
    };

    // Load and play the animation for each container
    const anim = lottie.loadAnimation(animationOptions);


    // playing the animations on hover 
//   var lottiePlayer = document.querySelectorAll('.lottie');
//
//   $(lottiePlayer).on('mouseenter', function(event) {
//       console.log(this);
//       this.setDirection(1)
//       this.play()
//
//   }).on('mouseleave', function(event) {
//       this.setDirection(-1)
//       this.play()
//   });

});



});
  
