'use strict';

import { sleep, storageGet, storageSet, createTab, hash } from './util';

async function parseMsg(action, data = null) {
    switch (action) {
        case 'start': return openFeedTab();
        case 'save': return saveFeed(data);
        default: Promise.resolve('Action not valid');
    }
}

function openFeedTab() {
    return createTab('feed.html');
}

async function saveFeed(data) {
    const id = hash(data.name);
    console.log('id', id);
    await storageSet(id, data);
    return id;
}

// ATTENCTION: Using async as a listener function doesn't work
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Messaggio ricevuto in back', request);
    if (request.action) {
        parseMsg(request.action, request.data).then(sendResponse);
        return true;
    }
});