// Saves options to chrome.storage

function save_options() {
	chrome.storage.sync.set({
		infiniteAirhorns: this.checked
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved!';
		status.classList.add('update');

		 // Reload background page to update options
		 // (in this case, it's not critical we keep the extension running)
		chrome.runtime.getBackgroundPage(function(backgroundWindow) {
			backgroundWindow.location.reload();
		});

		 // Yeah, I know this animation sucks
		setTimeout(function() {
			status.classList.remove('update');
			setTimeout(function() {
				status.textContent = '';
			}, 301);
		}, 750);
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	// Use default value (infiniteAirhorns: true)
	// if we can't find any stored options
	chrome.storage.sync.get({
		infiniteAirhorns: true
	}, function(items) {
		document.getElementById('infiniteAirhorns').checked = items.infiniteAirhorns;
	});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('infiniteAirhorns').addEventListener('change', save_options);