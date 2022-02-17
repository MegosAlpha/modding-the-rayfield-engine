let globalToastNumber = 0;

function toastClose(toastNumber) {
    // Some Bootstrap toasts are a bit buggy
    $('#liveToast' + toastNumber).toast('show');
    $('#liveToast' + toastNumber).toast('hide');
}

function doToast(sender, message, shortTime=true) {
    let template = `<div id="liveToast${globalToastNumber}" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true" data-delay="${shortTime? 2000: 6000000}">
                <div class="toast-header">
                    <strong class="mr-auto">${sender}</strong>
                    <button onclick="toastClose(${globalToastNumber})" type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>`;
    document.getElementById("toaster").innerHTML += template;
    $('#liveToast' + globalToastNumber).toast('show');
    globalToastNumber += 1;
}

const b64PNGEncode = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.slice(22));
        reader.onerror = error => reject(error);
    });
};

document.getElementById("submitAsset").addEventListener("click", async function (event) {
    event.preventDefault();
    const projectName = document.getElementById("projectNameInput").value;
    const assetType = document.getElementById("assetTypeInput").value;
    const mapSuffix = document.getElementById("mapSuffixInput").value;
    if (projectName == "" || assetType == "") {
        doToast("Create Form", "Missing project name or asset type.");
        return;
    }
    const canonicalAssetName = (assetType === "map") ? assetType + mapSuffix : assetType;
    const assetFile = document.getElementById("assetFile").files[0];
    if (assetFile == undefined) {
        doToast("Create Form", "No upload detected. Please select a file and try again.");
        return;
    }
    let body = "";
    if (assetType == "tileset") {
        body = await b64PNGEncode(assetFile);
    } else {
        body = await assetFile.text();
    }
    const url = "https://raymon.musitraynes.com/upload/" + projectName + "/" + canonicalAssetName;
    let result = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({data: body}),
        headers: {
            'Content-Type': 'application/json'
        },
    });
    doToast("Rayfield Modding API", await result.text());
});

let globalRebuildLock = false;

document.getElementById("rebuildProject").addEventListener("click", async (event) => {
    event.preventDefault();
    const projectName = document.getElementById("projectNameInput").value;
    if (projectName == "") {
        doToast("Create Form", "Project name / game ID may not be empty.");
        return;
    }
    if (globalRebuildLock) {
        doToast("Create Form", "Build is already in progress. Please wait.")
        return;
    } else {
        globalRebuildLock = true;
    }
    doToast("Rayfield Modding API", "Now starting your build! Please wait. This may take a few minutes.");
    let result = await fetch("https://raymon.musitraynes.com/build/" + projectName, {
        method: 'POST',
    });
    doToast("Rayfield Modding API", await result.text(), false);
    globalRebuildLock = false;
});
