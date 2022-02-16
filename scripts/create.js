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
        return;
    }
    const canonicalAssetName = (assetType === "map") ? assetType + mapSuffix : assetType;
    const assetFile = document.getElementById("assetFile").files[0];
    let body = "";
    if (assetType == "tileset") {
        body = await b64PNGEncode(assetFile);
    } else {
        body = await assetFile.text();
    }
    const url = "https://raymon.musitraynes.com/upload/" + projectName + "/" + canonicalAssetName;
    console.log(url);
    let result = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({data: body}),
        headers: {
            'Content-Type': 'application/json'
        },
    });
    alert(await result.text());
});

let globalRebuildLock = false;

document.getElementById("rebuildProject").addEventListener("click", async (event) => {
    event.preventDefault();
    if (globalRebuildLock) {
        return;
    } else {
        globalRebuildLock = true;
    }
    const projectName = document.getElementById("projectNameInput").value;
    let result = await fetch("https://raymon.musitraynes.com/build/" + projectName, {
        method: 'POST',
    });
    alert(await result.text());
    globalRebuildLock = false;
});
