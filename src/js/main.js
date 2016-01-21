var simpleSwipe = require('./simple-swipe');

var hamburger = document.querySelector('.hamburger');
var menu = document.querySelector('.navMenu');
var subNavLinks = document.querySelectorAll('.subnavLink');
var subNav = document.querySelector('.subNav');
var slideControl = document.querySelector('.slideControl');

hamburger.addEventListener('click', function(e) {
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
});

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
        if (swipe.direction === 'right') {
            target.style.transform = 'translateX(' + swipe.length + 'px)';
        }
        if (swipe.direction === 'left' && swipe.length < 20) {
            target.style.transform = 'translateX(-' + swipe.length + 'px)';
        }
    },
    function(swipe) {
        swipe.event.preventDefault();
        var target = swipe.event.currentTarget.parentNode;
        var docWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var clearBox = docWidth - (docWidth * 0.20);
        var swipeStopLocationX = event.changedTouches[0].clientX;
        var targetRect = target.getBoundingClientRect();
        if (swipe.direction === 'left') {
            target.style.transform = 'translateX(0)';
        }
        target.classList.remove('animate');
    }
);
