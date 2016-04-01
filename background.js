/* jshint esversion:6 */
var orchestra = [];
var macId = null;
var useInfinite;
var airhorn = function() {
	this.audio = new Audio();
	this.audio.src = 'AIRHORN.mp3';
	
	this.start = function() {
		this.audio.play();
	};

	this.restart = function() {
		this.audio.pause();
		this.audio.currentTime = 0;
	};
};

var a = new airhorn();

function release() {
	
	if(useInfinite) {
		a = new airhorn();
		orchestra.push(a);
		a.audio.onended = function() {
			orchestra.splice(0,1);
		};
	} else {
		a.restart();
	}
	a.start();
}

function restore_options() {
	// Use default value (infiniteAirhorns: true)
	// if we can't find any stored options
	chrome.storage.sync.get({
		infiniteAirhorns: true
	}, function(items) {
		useInfinite = items.infiniteAirhorns;

		// Bind button once options loaded
		chrome.browserAction.onClicked.addListener(()=> {
			release();
			socket.send(macId);
		});
	});
}

// Fired when an update has taken place
chrome.runtime.onInstalled.addListener(function(details) {
	if(details.reason == 'update') {
		chrome.notifications.create('airhornupdatesuccess',
			{
				type : "basic",
				iconUrl: 'icon1.png',
				title: 'AIRHORN.mp3 updated',
				message: 'Current version: ' + chrome.app.getDetails().version + '\nLast version: ' + details.previousVersion,
				contextMessage: 'Click for more info',
			},
			function() {}
		);
	}

	chrome.storage.local.get('machine-id', function(item){
		var storedMacId = item['machine-id'];
		if(!storedMacId) {
			storedMacId = Math.random().toString(36).slice(2);
			chrome.storage.local.set({'machine-id':storedMacId});
		}
		macId = storedMacId;
	});

});

// Notification click handler
chrome.notifications.onClicked.addListener(function(id) {

	if(id == 'airhornupdatesuccess') {

		var width = window.screen.availWidth;
		var height = window.screen.availHeight;

		width = Math.round((width/2) - 260);
		height = Math.round((height/2) - 355);

		chrome.windows.create({url: 'changelog.html', type: 'popup', left: width, top: height, width: 520, height: 710}, function(window) {

		});
	}
});

document.addEventListener('DOMContentLoaded', restore_options);

// AIRHORN WORLDWIDE
var socket = new WebSocket("ws://159.122.222.199:8080");


socket.onmessage = function(event) {
	let message = event.data;

	console.log(message);
	if(macId !== message.id) release();

};