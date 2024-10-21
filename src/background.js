
/*
browser.contextMenus.removeAll();
browser.contextMenus.create({
    id: "translateText",
    title: browser.i18n.getMessage("translateTextMenu"),
    contexts: ["selection"],
});

browser.contextMenus.onClicked.addListener(function (info, tab) {
    switch (info.menuItemId) {
        case "translateText":
            translateTextMenu(info, tab);
            break;
    }
});

function translateTextMenu(info, tab) {
    browser.tabs.sendMessage(
        tab.id, {
            message: "showPanelFromMenu"
        }
    )
}

*/
