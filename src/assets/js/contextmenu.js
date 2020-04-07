let DOMContextMenu = document.querySelector(".contextmenu");

function ShowContextMenu(x, y) {
    DOMContextMenu.classList.add("active");

    if(x > window.innerWidth - DOMContextMenu.getBoundingClientRect().width) {
        x = window.innerWidth - DOMContextMenu.getBoundingClientRect().width;
    }
    if(y > window.innerHeight - DOMContextMenu.getBoundingClientRect().height) {
        y = window.innerHeight - DOMContextMenu.getBoundingClientRect().height;
    }

    DOMContextMenu.style.top = y + "px";
    DOMContextMenu.style.left = x + "px";
}

document.addEventListener('click', function() {
    HideContextMenu();
});

function HideContextMenu() {
    DOMContextMenu.classList.remove("active");
}

function AddContextMenuItem(icon, text, callFunction) {
    let contextMenuItem = document.createElement("div");
    contextMenuItem.classList.add("menu-item");

    let contextMenuIcon = document.createElement("div");
    contextMenuIcon.classList.add("icon");
    contextMenuIcon.innerHTML = "<i class=\"mdi mdi-" + icon + "\"></i>";
    contextMenuItem.appendChild(contextMenuIcon);

    let contextMenuText = document.createElement("div");
    contextMenuText.classList.add("text");
    contextMenuText.innerText = text;
    contextMenuItem.appendChild(contextMenuText);

    contextMenuItem.addEventListener('click', function() {
        callFunction();
    });

    DOMContextMenu.appendChild(contextMenuItem);
}
function ClearContextMenu() {
    DOMContextMenu.innerHTML = "";
}