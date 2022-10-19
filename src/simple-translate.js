/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

let tl = browser.i18n.getUILanguage();

document.body.insertAdjacentHTML("beforeend", "<div id='simple-translate-panel'><p>...</p></div>");
//var button = document.getElementById("simple-translate-button");
var panel = document.getElementById("simple-translate-panel");
var selectionWord;
var clickPosition;


window.addEventListener("mouseup", Select, false);
function Select(e) {
    hidePanel(e);
    setTimeout(function () {
        if (e.target.tagName == "INPUT" || e.target.tagName == "TEXTAREA") {
            selectionWord = e.target.value.substring(e.target.selectionStart, e.target.selectionEnd);
        } else {
            selectionWord = String(window.getSelection());
        }

        if ((selectionWord.length !== 0) && (e.target.id !== "simple-translate-panel") && (e.target.parentElement.id !== "simple-translate-panel"))
        {
            clickPosition = e;
        }
    }, 200);
}

function translate() {
    promises = [];
    sourceLine = selectionWord.split("\n");
    for (i = 0; i < sourceLine.length; i++) {
        promises.push(getRequest(sourceLine[i]));
    }
    Promise.all(promises)
        .then(function (results) {
            showResult(results);
        });
}

function getRequest(word) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        let url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" + tl + "&dt=t&q=" + encodeURIComponent(word);
        xhr.open("GET", url);
        xhr.send();
        xhr.onload = function () {
            resolve(xhr);
        };
    })
}

function showResult(results) {
    panel.innerText = "";
    let resultText = "";
    for (let j = 0; j < results.length; j++) {
        for (let i = 0; i < results[j].response[0].length; i++) {
            resultText += results[j].response[0][i][0];
        }
        resultText += "\n";
    }
    panel.innerHTML = "<p></p>"
    panel.getElementsByTagName("p")[0].innerText = resultText;
    panelPosition(clickPosition);

}

function showPanel(e) {
    clickPosition = e;
    panel.style.display = 'block';
    panelPosition(e);
}

function hidePanel(e) {
    //button.style.display = 'none';
    if ((e.target.id !== "simple-translate-panel") && (e.target.parentElement.id !== "simple-translate-panel")) {
        panel.style.display = 'none';
        panel.innerHTML = "<p>...</p>";
    }
}

function panelPosition(e) {
    var p = new Object();
    panel.style.width = '400px'; 
    var panelHeight = panel.clientHeight;
    var panelWidth = parseInt(window.getComputedStyle(panel.getElementsByTagName("p")[0], null).width);

    if (e.clientX + panelWidth > window.innerWidth - 80) {
        p.x = window.innerWidth - panelWidth - 80;
    } else {
        p.x = e.clientX;
    }
    if (e.clientY + panelHeight > window.innerHeight - 30) {
        p.y = window.innerHeight - panelHeight - 30;
    } else {
        p.y = e.clientY;
    }
    panel.style.width = 'auto'; 
    panel.style.top = p.y + 'px';
    panel.style.left = p.x + 'px';

    panel.style.maxWidth = "400px";
    panel.style.maxHeight = "300px";
    panel.style.backgroundColor = "#aaaaaa";
    panel.getElementsByTagName("p")[0].style.fontSize = "16px";
    panel.getElementsByTagName("p")[0].style.color = "#000";
}


browser.runtime.onMessage.addListener(function (request) {
    switch (request.message) {
        case "showPanelFromMenu":
            showPanelFromMenu();
            break;
    }
});



function showPanelFromMenu() {
    //button.style.display = "none";
    translate();
    showPanel(clickPosition);
}
