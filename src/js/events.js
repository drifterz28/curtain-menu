'use strict';
var simpleSwipe = require('./simple-swipe');

var hamburger;
var menu;
var subNavLinks;
var subNav;
var slideControl;

module.exports = {
	setup: function() {
		hamburger = document.querySelector('.hamburger');
		menu = document.querySelector('.navMenu');
		subNavLinks = document.querySelectorAll('.subnavLink');
		subNav = document.querySelector('.subNav');
		slideControl = document.querySelector('.slideControl');
	},
	hamburger: function(e) {
		e.preventDefault();
		var target = e.currentTarget;
		var actives = document.querySelectorAll('.active');
		target.classList.toggle('active');
		for(var i = 0; i < actives.length; i++) {
			actives[i].classList.remove('active');
		}
		subNav.classList.remove('open');
		subNav.setAttribute('style', '');
		menu.classList.toggle('open');
	},
	subNavControl: function() {
		var isOpen = subNav.classList.contains('open');
		subNav.setAttribute('style', '');
		subNav.classList.toggle('open');
		if (isOpen) {
			subNav.classList.toggle('open');
		}
		for(var i = 0; i < subNavLinks.length; i++) {
			subNavLinks[i].classList.remove('active');
		}
	}
};
/*
for (var i = 0; i < subNavLinks.length; i++) {
	subNavLinks[i].addEventListener('click', subNavControl);
}

function subNavControl(e) {
	e.preventDefault();
	var isOpen = subNav.classList.contains('open');
	var target = e.currentTarget;
	var targetText = target.textContent;
	subNav.setAttribute('style', '');
	subNav.classList.toggle('open');
	if (isOpen) {
		subNav.classList.toggle('open');
	}
	for(var i = 0; i < subNavLinks.length; i++) {
		subNavLinks[i].classList.remove('active');
	}
	target.classList.add('active');
	subNav.querySelector('.subHeaderTitle').textContent = targetText;
}

var x = new simpleSwipe(slideControl,
	function(swipe) {
		var target = swipe.event.currentTarget.parentNode;
		target.classList.add('animate');
		if(swipe.direction === 'right') {
			target.style.transform = 'translateX(' + swipe.length + 'px)';
		}
		if(swipe.direction === 'left') {
			target.style.transform = 'translateX(' + swipe.length + 'px)';
		}
	},
	function(swipe) {
		swipe.event.preventDefault();
		console.log(swipe);
		if(swipe.direction === 'right' || swipe.direction === 'left') {
			var target = swipe.event.currentTarget.parentNode;
			//target.style.transform = 'translateX(0)';
			target.classList.remove('animate');
		}
	}
);
*/
