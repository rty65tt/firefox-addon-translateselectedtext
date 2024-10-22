'use strict';

function restore () {
  chrome.storage.local.get({
    autotranslate: true
  }, (prefs) => {
    document.getElementById('autotranslate').checked = prefs.autotranslate;
  });
}

function save () {
  const autotranslate = document.getElementById('autotranslate').checked;
  chrome.storage.local.set({
    autotranslate
  }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => status.textContent = '', 1000);
  });
}

document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);
