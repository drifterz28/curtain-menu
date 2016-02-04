'use strict';

var React = require('react');
var ReactDom = require('react-dom');
var app = React.createFactory(require('./app.jsx'));
var navData = {
	SiteName: "Cool Site",
	menu: [
		{
			title: "Technology",
			icon: "usb",
			subCat: [
				{
					title: "IoT",
					icon: "wifi"
				},
				{
					title: "Arduino",
					icon: "android"
				},
				{
					title: "iPhone",
					icon: "apple"
				},
				{
					title: "Raspberry Pi",
					icon: "lightbulb-o"
				},
				{
					title: "Android",
					icon: "mobile"
				}
			]
		},
		{
			title: "Motorcycles",
			icon: "motorcycle",
			subCat: [
				{
					title: "Motorcycle Racing",
					icon: "motorcycle"
				}
			]
		},
		{
			title: "Cars",
			icon: "car",
			subCat: [
				{
					title: "Supercars",
					icon: "car"
				},
				{
					title: "Formula One",
					icon: "car"
				},
				{
					title: "Camaro",
					icon: "car"
				}
			]
		}
	]
};

function init() {
	ReactDom.render(app(navData), document.querySelector('.site'));
}

init();
/*
google.load("feeds", "1");

function initialize() {
	var feed = new google.feeds.findFeeds("technology IoT", findDone);
	function findDone(result) {
		console.log(result);
		if (!result.error) {
			var container = document.getElementById("feed");
			for (var i = 0; i < result.feed.entries.length; i++) {
				var entry = result.feed.entries[i];
				var div = document.createElement("div");
				div.appendChild(document.createTextNode(entry.title));
				container.appendChild(div);
			}
		}
	}
}
google.setOnLoadCallback(initialize);
*/
