if (typeof importScripts === 'function') {
	try {
		importScripts('browser-polyfill.min.js');
	} catch (e) {
		console.error('Failed to import polyfill in background:', e);
	}
}

const openByTabId = new Map();

browser.tabs?.onRemoved?.addListener((tabId) => {
	openByTabId.delete(tabId);
});

// Apply the display mode (popup vs sidePanel)
function applyDisplayMode(mode) {
	if (mode === 'popup') {
		browser.action.setPopup({ popup: 'popup.html' });
	} else {
		// sidePanel mode: clear popup so onClicked fires
		browser.action.setPopup({ popup: '' });
	}
}

// Initialize display mode on startup
browser.storage.local.get({ displayMode: 'sidePanel' }).then((result) => {
	applyDisplayMode(result.displayMode);
});

// Listen for changes to displayMode
browser.storage.onChanged.addListener((changes, area) => {
	if (area === 'local' && changes.displayMode) {
		// Do not apply popup mode immediately to prevent side panel from getting stuck open.
		// It will be applied when the panel is closed or on next launch.
		if (changes.displayMode.newValue === 'sidePanel') {
			applyDisplayMode('sidePanel');
		}
	}
});

browser.action.onClicked.addListener((tab) => {
	try {
		if (!browser.sidePanel?.open) {
			console.warn('Side panel API not available.');
			return;
		}

		const tabId = typeof tab?.id === 'number' ? tab.id : undefined;
		if (tabId == null) {
			console.warn('No tabId available; cannot toggle side panel.');
			return;
		}

		const isOpen = openByTabId.get(tabId) === true;

		if (isOpen) {
			if (typeof browser.sidePanel.close === 'function') {
				browser.sidePanel.close({ tabId }).catch((error) => {
					console.error('Failed to close side panel:', error);
				});
			} else if (typeof browser.sidePanel.setOptions === 'function') {
				browser.sidePanel.setOptions({ tabId, enabled: false }).catch((error) => {
					console.error('Failed to disable side panel:', error);
				});
			}
			openByTabId.set(tabId, false);

			// Apply popup mode now if it was selected while the side panel was open
			browser.storage.local.get({ displayMode: 'sidePanel' }).then((result) => {
				if (result.displayMode === 'popup') {
					applyDisplayMode('popup');
				}
			});
			return;
		}

		// Fire-and-forget
		if (typeof browser.sidePanel.setOptions === 'function') {
			browser.sidePanel
				.setOptions({ tabId, enabled: true, path: 'popup.html' })
				.catch((error) => console.error('Failed to enable side panel:', error));
		}

		browser.sidePanel
			.open({ tabId })
			.then(() => openByTabId.set(tabId, true))
			.catch((error) => {
				// If opening fails because it's already open, assume state might have been stale
				if (error.message && error.message.includes('already open')) {
					openByTabId.set(tabId, true);
					browser.sidePanel.close({ tabId }).catch(() => {});
					openByTabId.set(tabId, false);
					return;
				}
				openByTabId.set(tabId, false);
				console.error('Failed to open side panel:', error);
			});
	} catch (error) {
		console.error('Failed to toggle side panel:', error);
	}
});
