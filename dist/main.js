(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./simple-swipe":2}],2:[function(require,module,exports){
'use strict';

function SimpleSwipe(el, callbackMove, callbackEnd) {
    this.el = el;
    this.callbackMove = callbackMove;
    this.callbackEnd = callbackEnd;
    this.addListeners();
}

SimpleSwipe.prototype = {
    el: undefined,
    callbackMove: undefined,
    callbackEnd: undefined,
    startX: undefined,
    startY: undefined,
    prevX: undefined,
    prevY: undefined,
    x: undefined,
    y: undefined,
    getAngle: function (x0, y0, x1, y1) {
        x0 = x0 || this.startX;
        y0 = y0 || this.startY;
        x1 = x1 || this.x;
        y1 = y1 || this.y;
        function mod(a, n) { return ((a % n) + n) % n; }
        var r = Math.atan2(y1 - y0, x0 - x1); // radians
        return mod(Math.round(r * 180 / Math.PI), 360); // degrees
    },
    getDirection: function (angle) {
        angle = angle || this.getAngle();
        return (angle >= 315 || angle <= 45) ? 'left'
            : (angle > 45 && angle < 135) ? 'down'
                : (angle >= 135 && angle <= 225) ? 'right'
                    : 'up';
    },
    getLength: function (x0, y0, x1, y1) {
        x0 = x0 || this.startX;
        y0 = y0 || this.startY;
        x1 = x1 || this.x;
        y1 = y1 || this.y;
        var length = Math.round(Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)));
        return isNaN(length) ? 0 : length;
    },
    touchStart: function (event) {
        event.preventDefault();
        if (event.touches.length === 1) {
            this.startX = event.touches[0].pageX;
            this.startY = event.touches[0].pageY;
        } else {
            this.touchCancel();
        }
    },
    touchMove: function (event) {
        event.preventDefault();
        if (event.touches.length === 1) {
            this.prevX = this.x;
            this.prevY = this.y;
            this.x = event.touches[0].pageX;
            this.y = event.touches[0].pageY;
            if (this.callbackMove) {
                this.callbackMove({
                    event: event,
                    direction: this.getDirection(),
                    directionLast: this.getDirection(this.getAngle(this.prevX, this.prevY)),
                    length: this.getLength(),
                    lengthLast: this.getLength(this.prevX, this.prevY),
                }, this.el);
            }
        } else {
            this.touchCancel();
        }
    },
    touchEnd: function (event) {
        event.preventDefault();
        if (this.callbackEnd) {
            this.callbackEnd({
                event: event,
                direction: this.getDirection(),
                length: this.getLength(),
            }, this.el);
        }
        this.touchCancel();
    },
    touchCancel: function () {
        delete this.startX;
        delete this.startY;
        delete this.prevX;
        delete this.prevY;
        delete this.x;
        delete this.y;
    },
    handleEvent: function (event) {
        switch (event.type) {
            case 'touchmove':
                this.touchMove(event);
                break;
            case 'touchstart':
                this.touchStart(event);
                break;
            case 'touchend':
                this.touchEnd(event);
                break;
            case 'touchcancel':
                this.touchCancel();
                break;
            case 'touchleave':
                this.touchCancel();
                break;
        }
    },
    addListeners: function () {
        if(this.el.length === undefined) {
            this.el = [this.el];
        }
        for(var i = 0; i < this.el.length; i++) {
            this.el[i].addEventListener('touchcancel', this);
            this.el[i].addEventListener('touchend', this);
            this.el[i].addEventListener('touchleave', this);
            this.el[i].addEventListener('touchmove', this);
            this.el[i].addEventListener('touchstart', this);
        }
    },
    removeListeners: function () {
        if(this.el.length === undefined) {
            this.el = [this.el];
        }
        for(var i = 0; i < this.el.length; i++) {
            this.el[i].removeEventListener('touchcancel', this);
            this.el[i].removeEventListener('touchend', this);
            this.el[i].removeEventListener('touchleave', this);
            this.el[i].removeEventListener('touchmove', this);
            this.el[i].removeEventListener('touchstart', this);
        }
    },
};
module.exports = SimpleSwipe;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9zaW1wbGUtc3dpcGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgc2ltcGxlU3dpcGUgPSByZXF1aXJlKCcuL3NpbXBsZS1zd2lwZScpO1xyXG5cclxudmFyIGhhbWJ1cmdlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oYW1idXJnZXInKTtcclxudmFyIG1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2TWVudScpO1xyXG52YXIgc3ViTmF2TGlua3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc3VibmF2TGluaycpO1xyXG52YXIgc3ViTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN1Yk5hdicpO1xyXG52YXIgc2xpZGVDb250cm9sID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlQ29udHJvbCcpO1xyXG5cclxuaGFtYnVyZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgdmFyIHRhcmdldCA9IGUuY3VycmVudFRhcmdldDtcclxuICAgIHZhciBhY3RpdmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjdGl2ZScpO1xyXG4gICAgdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGFjdGl2ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBhY3RpdmVzW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgfVxyXG4gICAgc3ViTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuICAgIHN1Yk5hdi5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJycpO1xyXG4gICAgbWVudS5jbGFzc0xpc3QudG9nZ2xlKCdvcGVuJyk7XHJcbn0pO1xyXG5cclxuZm9yICh2YXIgaSA9IDA7IGkgPCBzdWJOYXZMaW5rcy5sZW5ndGg7IGkrKykge1xyXG4gICAgc3ViTmF2TGlua3NbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzdWJOYXZDb250cm9sKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3ViTmF2Q29udHJvbChlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB2YXIgaXNPcGVuID0gc3ViTmF2LmNsYXNzTGlzdC5jb250YWlucygnb3BlbicpO1xyXG4gICAgdmFyIHRhcmdldCA9IGUuY3VycmVudFRhcmdldDtcclxuICAgIHZhciB0YXJnZXRUZXh0ID0gdGFyZ2V0LnRleHRDb250ZW50O1xyXG4gICAgc3ViTmF2LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnJyk7XHJcbiAgICBzdWJOYXYuY2xhc3NMaXN0LnRvZ2dsZSgnb3BlbicpO1xyXG4gICAgaWYgKGlzT3Blbikge1xyXG4gICAgICAgIHN1Yk5hdi5jbGFzc0xpc3QudG9nZ2xlKCdvcGVuJyk7XHJcbiAgICB9XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgc3ViTmF2TGlua3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBzdWJOYXZMaW5rc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgIH1cclxuICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgIHN1Yk5hdi5xdWVyeVNlbGVjdG9yKCcuc3ViSGVhZGVyVGl0bGUnKS50ZXh0Q29udGVudCA9IHRhcmdldFRleHQ7XHJcbn1cclxuXHJcbnZhciB4ID0gbmV3IHNpbXBsZVN3aXBlKHNsaWRlQ29udHJvbCxcclxuICAgIGZ1bmN0aW9uKHN3aXBlKSB7XHJcbiAgICAgICAgdmFyIHRhcmdldCA9IHN3aXBlLmV2ZW50LmN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZTtcclxuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnYW5pbWF0ZScpO1xyXG4gICAgICAgIGlmIChzd2lwZS5kaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcclxuICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKCcgKyBzd2lwZS5sZW5ndGggKyAncHgpJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHN3aXBlLmRpcmVjdGlvbiA9PT0gJ2xlZnQnICYmIHN3aXBlLmxlbmd0aCA8IDIwKSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgtJyArIHN3aXBlLmxlbmd0aCArICdweCknO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBmdW5jdGlvbihzd2lwZSkge1xyXG4gICAgICAgIHN3aXBlLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdmFyIHRhcmdldCA9IHN3aXBlLmV2ZW50LmN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZTtcclxuICAgICAgICB2YXIgZG9jV2lkdGggPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApO1xyXG4gICAgICAgIHZhciBjbGVhckJveCA9IGRvY1dpZHRoIC0gKGRvY1dpZHRoICogMC4yMCk7XHJcbiAgICAgICAgdmFyIHN3aXBlU3RvcExvY2F0aW9uWCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgICAgdmFyIHRhcmdldFJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgaWYgKHN3aXBlLmRpcmVjdGlvbiA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgwKSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRlJyk7XHJcbiAgICB9XHJcbik7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmZ1bmN0aW9uIFNpbXBsZVN3aXBlKGVsLCBjYWxsYmFja01vdmUsIGNhbGxiYWNrRW5kKSB7XHJcbiAgICB0aGlzLmVsID0gZWw7XHJcbiAgICB0aGlzLmNhbGxiYWNrTW92ZSA9IGNhbGxiYWNrTW92ZTtcclxuICAgIHRoaXMuY2FsbGJhY2tFbmQgPSBjYWxsYmFja0VuZDtcclxuICAgIHRoaXMuYWRkTGlzdGVuZXJzKCk7XHJcbn1cclxuXHJcblNpbXBsZVN3aXBlLnByb3RvdHlwZSA9IHtcclxuICAgIGVsOiB1bmRlZmluZWQsXHJcbiAgICBjYWxsYmFja01vdmU6IHVuZGVmaW5lZCxcclxuICAgIGNhbGxiYWNrRW5kOiB1bmRlZmluZWQsXHJcbiAgICBzdGFydFg6IHVuZGVmaW5lZCxcclxuICAgIHN0YXJ0WTogdW5kZWZpbmVkLFxyXG4gICAgcHJldlg6IHVuZGVmaW5lZCxcclxuICAgIHByZXZZOiB1bmRlZmluZWQsXHJcbiAgICB4OiB1bmRlZmluZWQsXHJcbiAgICB5OiB1bmRlZmluZWQsXHJcbiAgICBnZXRBbmdsZTogZnVuY3Rpb24gKHgwLCB5MCwgeDEsIHkxKSB7XHJcbiAgICAgICAgeDAgPSB4MCB8fCB0aGlzLnN0YXJ0WDtcclxuICAgICAgICB5MCA9IHkwIHx8IHRoaXMuc3RhcnRZO1xyXG4gICAgICAgIHgxID0geDEgfHwgdGhpcy54O1xyXG4gICAgICAgIHkxID0geTEgfHwgdGhpcy55O1xyXG4gICAgICAgIGZ1bmN0aW9uIG1vZChhLCBuKSB7IHJldHVybiAoKGEgJSBuKSArIG4pICUgbjsgfVxyXG4gICAgICAgIHZhciByID0gTWF0aC5hdGFuMih5MSAtIHkwLCB4MCAtIHgxKTsgLy8gcmFkaWFuc1xyXG4gICAgICAgIHJldHVybiBtb2QoTWF0aC5yb3VuZChyICogMTgwIC8gTWF0aC5QSSksIDM2MCk7IC8vIGRlZ3JlZXNcclxuICAgIH0sXHJcbiAgICBnZXREaXJlY3Rpb246IGZ1bmN0aW9uIChhbmdsZSkge1xyXG4gICAgICAgIGFuZ2xlID0gYW5nbGUgfHwgdGhpcy5nZXRBbmdsZSgpO1xyXG4gICAgICAgIHJldHVybiAoYW5nbGUgPj0gMzE1IHx8IGFuZ2xlIDw9IDQ1KSA/ICdsZWZ0J1xyXG4gICAgICAgICAgICA6IChhbmdsZSA+IDQ1ICYmIGFuZ2xlIDwgMTM1KSA/ICdkb3duJ1xyXG4gICAgICAgICAgICAgICAgOiAoYW5nbGUgPj0gMTM1ICYmIGFuZ2xlIDw9IDIyNSkgPyAncmlnaHQnXHJcbiAgICAgICAgICAgICAgICAgICAgOiAndXAnO1xyXG4gICAgfSxcclxuICAgIGdldExlbmd0aDogZnVuY3Rpb24gKHgwLCB5MCwgeDEsIHkxKSB7XHJcbiAgICAgICAgeDAgPSB4MCB8fCB0aGlzLnN0YXJ0WDtcclxuICAgICAgICB5MCA9IHkwIHx8IHRoaXMuc3RhcnRZO1xyXG4gICAgICAgIHgxID0geDEgfHwgdGhpcy54O1xyXG4gICAgICAgIHkxID0geTEgfHwgdGhpcy55O1xyXG4gICAgICAgIHZhciBsZW5ndGggPSBNYXRoLnJvdW5kKE1hdGguc3FydChNYXRoLnBvdyh4MSAtIHgwLCAyKSArIE1hdGgucG93KHkxIC0geTAsIDIpKSk7XHJcbiAgICAgICAgcmV0dXJuIGlzTmFOKGxlbmd0aCkgPyAwIDogbGVuZ3RoO1xyXG4gICAgfSxcclxuICAgIHRvdWNoU3RhcnQ6IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgaWYgKGV2ZW50LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnRYID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWDtcclxuICAgICAgICAgICAgdGhpcy5zdGFydFkgPSBldmVudC50b3VjaGVzWzBdLnBhZ2VZO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudG91Y2hDYW5jZWwoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgdG91Y2hNb3ZlOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGlmIChldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICB0aGlzLnByZXZYID0gdGhpcy54O1xyXG4gICAgICAgICAgICB0aGlzLnByZXZZID0gdGhpcy55O1xyXG4gICAgICAgICAgICB0aGlzLnggPSBldmVudC50b3VjaGVzWzBdLnBhZ2VYO1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBldmVudC50b3VjaGVzWzBdLnBhZ2VZO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYWxsYmFja01vdmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tNb3ZlKHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudDogZXZlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uOiB0aGlzLmdldERpcmVjdGlvbigpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbkxhc3Q6IHRoaXMuZ2V0RGlyZWN0aW9uKHRoaXMuZ2V0QW5nbGUodGhpcy5wcmV2WCwgdGhpcy5wcmV2WSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aDogdGhpcy5nZXRMZW5ndGgoKSxcclxuICAgICAgICAgICAgICAgICAgICBsZW5ndGhMYXN0OiB0aGlzLmdldExlbmd0aCh0aGlzLnByZXZYLCB0aGlzLnByZXZZKSxcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMuZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy50b3VjaENhbmNlbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB0b3VjaEVuZDogZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBpZiAodGhpcy5jYWxsYmFja0VuZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrRW5kKHtcclxuICAgICAgICAgICAgICAgIGV2ZW50OiBldmVudCxcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogdGhpcy5nZXREaXJlY3Rpb24oKSxcclxuICAgICAgICAgICAgICAgIGxlbmd0aDogdGhpcy5nZXRMZW5ndGgoKSxcclxuICAgICAgICAgICAgfSwgdGhpcy5lbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudG91Y2hDYW5jZWwoKTtcclxuICAgIH0sXHJcbiAgICB0b3VjaENhbmNlbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLnN0YXJ0WDtcclxuICAgICAgICBkZWxldGUgdGhpcy5zdGFydFk7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMucHJldlg7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMucHJldlk7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMueDtcclxuICAgICAgICBkZWxldGUgdGhpcy55O1xyXG4gICAgfSxcclxuICAgIGhhbmRsZUV2ZW50OiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAndG91Y2htb3ZlJzpcclxuICAgICAgICAgICAgICAgIHRoaXMudG91Y2hNb3ZlKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICd0b3VjaHN0YXJ0JzpcclxuICAgICAgICAgICAgICAgIHRoaXMudG91Y2hTdGFydChldmVudCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAndG91Y2hlbmQnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy50b3VjaEVuZChldmVudCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAndG91Y2hjYW5jZWwnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy50b3VjaENhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3RvdWNobGVhdmUnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy50b3VjaENhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGFkZExpc3RlbmVyczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmKHRoaXMuZWwubGVuZ3RoID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5lbCA9IFt0aGlzLmVsXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuZWwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5lbFtpXS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLmVsW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxbaV0uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hsZWF2ZScsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLmVsW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLmVsW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlTGlzdGVuZXJzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYodGhpcy5lbC5sZW5ndGggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmVsID0gW3RoaXMuZWxdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5lbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmVsW2ldLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxbaV0ucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5lbFtpXS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGxlYXZlJywgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxbaV0ucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxbaV0ucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gU2ltcGxlU3dpcGU7XHJcbiJdfQ==
