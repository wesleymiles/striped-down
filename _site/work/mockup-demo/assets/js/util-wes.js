/***
jQuery is planned for use in the future and should be added before doing anything complicated.
***/

var doc = document.documentElement;

imsUtil = {
	isScrolled: false,
	init:function() {
		imsUtil.setHeightToBackgroundImageHeight('body.huddle .mockup')
	},
	setHeightToBackgroundImageHeight:function(selector) {
		var image_elem = document.querySelector(selector);
		var style = window.getComputedStyle(image_elem, null);
		var image_url = style.backgroundImage.slice(4, -1).replace(/"/g, "");
		var image = new Image();
		image.onload = function() {
		  image_elem.style.height = image.height /*+ 150*/ + "px";
		}
		image.src = image_url;
	},
	windowScrollTop: function() {
		return (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
	}
}

/***
show/hide feature from: https://gomakethings.com/how-to-show-and-hide-elements-with-vanilla-javascript/
***/

document.addEventListener("DOMContentLoaded", function(event) {
	imsUtil.init();
});

// Show an element
var show = function (elem) {
	elem.classList.add('is-visible');


};

// Hide an element
var hide = function (elem) {
	elem.classList.remove('is-visible');
};

// Toggle element visibility
var toggle = function (elem) {
	elem.classList.toggle('is-visible');
	document.body.classList.toggle("active-menu");
};

// Listen for click events
document.addEventListener('click', function (event) {

	// Make sure clicked element is our toggle
	if (!event.target.classList.contains('toggle-menu')) return;

	// Prevent default link behavior
	event.preventDefault();

	// Get the content
	var content = document.querySelector(event.target.hash);
	if (!content) return;

	// Toggle the content
	toggle(content);



	// Brainstorms on fixing the menu and restof the screen when menu is opened 
	// document.body.style.position = 'fixed';
	// document.getElementById('mobile-mockup').getElementsByClassName('mockup').style.position = 'fixed';
	// document.body.style.top = `-${window.scrollY}px`;

}, false);

/***
ims-is-scolled function, repurposed
 */

//Scroll events 
window.addEventListener('scroll', function() {
	if(imsUtil.windowScrollTop() <= 250) { //set approximate value to make the trigger more user-friendly? 
		imsUtil.isScrolled = false;
	} else {
		imsUtil.isScrolled = true;		
	}
	//imsUtil.isViewable();
});

var scrollIntervalFunction = setInterval(function() {
	if ( imsUtil.isScrolled ) {
		document.body.classList.add('ims-is-scrolled');
	} else {
		document.body.classList.remove('ims-is-scrolled');
	}
}, 250);



