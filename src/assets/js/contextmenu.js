let DOMContextMenu = document.querySelector(".contextmenu");

function ShowContextMenu(x, y) {
    let DOMActiveSection = document.querySelector("section.active");

    DOMContextMenu.classList.add("active");

    if(x > DOMActiveSection.clientWidth - DOMContextMenu.getBoundingClientRect().width) {
        x = DOMActiveSection.clientWidth - DOMContextMenu.getBoundingClientRect().width;
    }
    if(y > DOMActiveSection.clientHeight - DOMContextMenu.getBoundingClientRect().height) {
        y = DOMActiveSection.clientHeight - DOMContextMenu.getBoundingClientRect().height;
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