//contains site data
let sites = []
let tempSiteInputs = []

function generateContent() {
    for (let i = 0; i < sites.length; i++) {
        tempSiteInputs.push({
            id: sites[i].id,
            url: sites[i].url,
            title: getTitle(sites[i].url),
            favicon: getFavicon(sites[i].url),
            description: sites[i].description,
            date: sites[i].date
        })
    }
}
function getTitle(url) {
    url = url.slice(8); //Remove https://
    if (url[0] === "w" && url[1] === "w" && url[2] === "w" && url[3] === ".") { //Remove www.
        url = url.slice(4)
    }
    return capitaliseFirst(url.substring(0, url.indexOf(".")));
};

function capitaliseFirst(string) {
    let first = string[0].toUpperCase();
    return first + string.slice(1);
}

function getFavicon(url) {
    return `https://s2.googleusercontent.com/s2/favicons?sz=64&domain_url=${url}`; //Google site that returns favicon from url
}

//---CREATES ELEMENT FROM DATA---
function arrangeContent() {
    contentDestination = document.getElementById("boxes-wrap")
    function displaySites(sites) {
        for (let i = 0; i < sites.length; i++) {
            let contentWrap = document.createElement('div');
            contentWrap.classList.add("site-content-wrap");
            contentWrap.id = `${sites[i].id}`
            contentWrap.onclick = () => {
                window.open(sites[i].url);
            }

            let contentImg = document.createElement('Img');
            contentImg.classList.add("site-img");
            contentImg.src = sites[i].favicon;
            contentImg.id = `image-${i}`

            let contentDescription = document.createElement('p');
            contentDescription.classList.add("site-description");
            contentDescription.innerText = getTitle(sites[i].url);

            let contentHighlight = document.createElement('div');
            contentHighlight.classList.add('site-highlight')

            contentWrap.appendChild(contentImg);
            contentWrap.appendChild(contentDescription);
            contentWrap.appendChild(contentHighlight);
            contentDestination.appendChild(contentWrap);
        }
    }
    document.createElement("div");
    // for (let i = 0; i < tempSiteInputs.length; i++) { console.log("added site") }
    displaySites(tempSiteInputs);
}

//--- RIGHT SIDEBAR CONTENT DETAILS ON HOVER---
function sidebarHoverInfo() {

    let contentWrap = document.getElementsByClassName('site-content-wrap');
    for (let i = 0; i < contentWrap.length; i++) {
        contentWrap[i].onmouseover = () => {
            displaySidebarContent(tempSiteInputs[i]);
        }
        contentWrap[i].onmouseout = () => {
            displaySidebarContent(null);
        }
    }

    function displaySidebarContent(content) {
        let sidebar = document.getElementById('sidebar-right');
        if (!(content === null)) {
            removeChildren(sidebar);
            generateSidebarContent(sidebar, content)
            return
        }
        removeChildren(sidebar);
    }
    function generateSidebarContent(sidebar, content) {
        sidebar.innerHTML = `
    <p style="margin: 0; margin-bottom: 20px">Preview</p>
    <iframe class="sidebar-iframe" frameborder="0" scrolling="no"src="${content.url}"></iframe>
<div class="site-content-wrap-static"><img class="site-img"
                src="${content.favicon}">
            <p class="site-description">${content.title}</p>
            <div class="site-highlight"></div>
        </div>
        <div class="sidebar-right-wrap">
            <p>${content.title}</p>
            <p><em>${content.url}</em></p>
            <p>${content.description}</p>
            <p>Added ${content.date}</p>
        </div>`
    }

    function removeChildren(parent) {
        parent.innerHTML = '';
    }
}
//---HOVER ANIMATION BOXES---
function generateHoverAnimation() {
    let mostX = 15; // Increase or decrease for more exaggerated animation
    let mostY = 15;
    let boxes = document.getElementsByClassName('site-content-wrap');
    let highlights = document.getElementsByClassName('site-highlight');
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].addEventListener("mousemove", (e) => {
            boxes[i].style.transition = "0s";
            highlights[i].style.transition = "0s";

            const x = e.offsetX;
            const y = e.offsetY;
            const { width, height } = boxes[i].getBoundingClientRect();
            const halfWidth = width / 2;
            const halfHeight = height / 2;

            const rotationY = (-((x - halfWidth) / halfWidth) * mostX);
            const rotationX = ((y - halfHeight) / halfHeight) * mostY;

            boxes[i].style.transform = `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`
            highlights[i].style.left = `${(rotationY / mostY * 30) * 1}%`
            highlights[i].style.top = `${(rotationX / mostX * 30) * -1}%`
        });

        boxes[i].addEventListener("mouseleave", (e) => {
            boxes[i].style.transition = "transform 0.2s ease-in-out";
            boxes[i].style.transform = "rotate(0)";
            highlights[i].style.transition = "0.1s ease-in-out";

            highlights[i].style.left = `-20%`
            highlights[i].style.top = `-20%`
        })
    }
}

//---FORM---
//named popUp as intended to make pop-up form initially
let popUp = document.getElementById('pop-up');
let boxesWrap = document.getElementById('boxes-wrap');
let contentHeader = document.getElementById('content-header');
let contentHeaderDefault = contentHeader.innerHTML; //store data of original html
function handleNewContentClick() {
    boxesWrap.style.display = "none"
    contentHeader.innerHTML = `<button id="back-content-button" class="button" onclick="handleNewContentBack()">
        <div id="back-content-button-animation-el">
            <p>Back</p>
        </div>
    </button>
    <div></div>
    <div></div`
    popUp.classList.add('pop-up-active');
}

let prevHTML;

//---DELETE CONTENT UI CHANGE --- API DELETE REQUEST---
function handleDeleteContentClick() {
    prevHTML = boxesWrap.innerHTML;
    contentHeader.innerHTML = `<button id="back-content-button" class="button" onclick="handleDeleteContentBack()">
        <div id="back-content-button-animation-el">
            <p>Back</p>
        </div>
    </button>
    <div id="deleting-content">DELETING CONTENT</div> 
    <div></div`;

    let boxes = document.getElementsByClassName('site-content-wrap');

    for (let i = 0; i < boxes.length; i++) {
        boxes[i].classList.add('site-content-wrap-delete')
        boxes[i].insertAdjacentHTML("afterbegin", '<div class="site-delete"></div>')
        // console.log(boxes[i]);
        boxes[i].onclick = deleteThisContent;
    }
}
function deleteThisContent(props) {
    let el = props.path[1];
    let elTitle = el.children[2].innerText;
    let text = document.getElementById('delete-item-p');
    let wrap = document.getElementById('delete-item-check-wrap');
    let deleteButton = document.getElementById('delete-item-delete')
    let mainContentWrap = document.getElementById('main-content-wrap')

    //Changes UI Layout
    mainContentWrap.classList.add('blur-content');
    wrap.style.display = "flex"
    let otherButtons = document.getElementById('content-header');
    otherButtons.style.opacity = "0";
    otherButtons.style.pointerEvents = "none";
    text.innerText = `Delete ${elTitle}?`

    deleteButton.onclick = () => {
        fetch(`http://localhost:1337/api/sites/${el.id}`, {
            method: 'DELETE',
        })
            .then(res => {
                handleDeleteContentCancel();
                handleDeleteContentBack();

                // console.log(prevHTML)
            })
            .catch(err => {
                // console.log("Delete error")
            });
    }
}

function handleDeleteContentCancel() {
    document.getElementById('main-content-wrap').classList.remove('blur-content');

    document.getElementById('delete-item-check-wrap').style.display = "none";
    let otherButtons = document.getElementById('content-header');
    otherButtons.style.opacity = "1";
    otherButtons.style.pointerEvents = "all";
}



function handleDeleteContentBack() {
    contentHeader.innerHTML = contentHeaderDefault;
    boxesWrap.innerHTML = prevHTML;
    refresh();


}
function handleNewContentBack() {
    boxesWrap.style.display = "flex"
    contentHeader.innerHTML = contentHeaderDefault;
    popUp.classList.remove('pop-up-active');
}

function handleForm() {
    let url = document.getElementById('pop-up-form-url-input').value;
    let description = document.getElementById('pop-up-form-description-input').value;
    document.getElementById('pop-up-form-url-input').value = '';
    document.getElementById('pop-up-form-description-input').value = '';

    postData(url, description);
}

function postData(url, description) {
    let formData = {
        "data": {
            "url": url,
            "description": description
        }
    }
    fetch('http://localhost:1337/api/sites/', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    }).then(() => {
        handleNewContentBack();
        refresh();
    })
}

//---LOADING SCREEN---

function loadingScreenOn() {
    document.getElementById('loading-text').innerText = "Loading";
    document.getElementById('loading-wrap').style.display = "flex";
    interval = setInterval(function () {
        let loadingEl = document.getElementById('loading-text')
        let loadingText = loadingEl.innerText;
        // console.log("interval")
        if (loadingText.length < 10) {
            loadingText += '.'
            loadingEl.innerHTML = loadingText;
        }
        else {
            loadingEl.innerHTML = 'Loading';
        }
    }, 200)

}
function loadingScreenOff() {
    document.getElementById('loading-wrap').style.display = "none";
    clearInterval(interval);
}

function iterateLoadingAnimation() {

}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-GB')
}

function refresh() {
    if (!getDataAlreadyActive) {
        document.getElementById('boxes-wrap').innerHTML = '';
        sites = [];
        tempSiteInputs = [];
        getData();
    }
    else {
        console.log("Already Refreshing")
    }
}


//---Fetch request before loading content---
let getDataAlreadyActive = false;
async function getData() {
    if (!getDataAlreadyActive) {
        loadingScreenOn();
        getDataAlreadyActive = true;
        fetch('http://localhost:1337/api/sites/')
            .then(res => res.json())
            .then(data => displayData(data.data))
        async function displayData(data) {
            for (let i = 0; i < data.length; i++) {
                sites.push({
                    url: data[i].attributes.url,
                    description: data[i].attributes.description,
                    date: formatDate(data[i].attributes.createdAt),
                    id: data[i].id
                })
            }
            let loadDelay = 300;
            setTimeout(loadingScreenOff, loadDelay)
            setTimeout(startApp, loadDelay)
            setTimeout(() => { getDataAlreadyActive = false }, loadDelay)

        }
    }
    else {
        console.log("getData() is already active")
    }
}

//called by getData()
function startApp() {
    generateContent();
    arrangeContent();
    sidebarHoverInfo();
    generateHoverAnimation();
}


getData();




