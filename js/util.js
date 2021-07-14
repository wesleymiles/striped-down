/***
jQuery is planned for use in the future and should be added before doing anything complicated.
***/

imsUtil = {
	init:function() {
		imsUtil.setHeightToBackgroundImageHeight('body.huddle #wrapper .mockup')
	},
	setHeightToBackgroundImageHeight:function(selector) {
		var image_elem = document.querySelector(selector);
		var style = window.getComputedStyle(image_elem, false);
		var image_url = style.backgroundImage.slice(4, -1).replace(/"/g, "");
		var image = new Image();
		image.onload = function() {
		  image_elem.style.height = image.height + "px";
		}
		image.src = image_url;
	}
}

document.addEventListener("DOMContentLoaded", function(event) {
	imsUtil.init();
});
