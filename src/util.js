export function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getCurrentTabId() {
	return new Promise((resolve, reject) => {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			resolve(tabs[0].id);
		});
	});
}

export function executeScript(tabId, args) {
	return new Promise((resolve, reject) => chrome.tabs.executeScript(tabId, args, resolve));
}

export function insertCSS(tabId, args) {
	return new Promise((resolve, reject) => chrome.tabs.insertCSS(tabId, args, resolve));
}

export function sendMessage(msg, tabId = null) {
	return new Promise((resolve, reject) => {
		if (tabId) {
			chrome.tabs.sendMessage(tabId, msg, (data) => {
				const lastError = chrome.runtime.lastError;
				lastError instanceof Object ? reject(lastError.message) : resolve(data);
			});
		} else {
			chrome.runtime.sendMessage(msg, (data) => {
				const lastError = chrome.runtime.lastError;
				lastError instanceof Object ? reject(lastError.message) : resolve(data);
			});
		}
	});
}

// --- STORAGE ---
//To watch storage of the extension, open background page from chrome extension page and paste "chrome.storage.sync.get(function(result){console.log(result)})"

export function storageSet(key, value) {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.set({ [key]: value }, resolve);
	});
}

export function storageGet(key) {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get(key, resolve);
	});
}

export function createTab(htmlFile) {
	return new Promise((resolve, reject) => {
		chrome.tabs.create({ url: chrome.runtime.getURL(htmlFile) }, resolve);
	});
}

export function hash(text) {
	let hash = 0;
	let char;
	for (let i = 0; i < text.length; i++) {
		char = text.charCodeAt(i)
		hash = ((hash << 5) - hash) + char;
		hash |= 0;
	}
	return hash;
}