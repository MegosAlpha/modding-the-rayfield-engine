<template>
  <div class="container" v-if="user">
    <form>
      <label for="project-name">Enter the name of your project (game ID):</label>
      <input name="project-name" id="projectNameInput" type="text" v-model="projectName">
      <br />
      <label for="asset-types">Select the type of asset you'd like to upload:</label>
      <select name="asset-types" id="assetTypeInput" v-model="assetType">
        <option value="condialogue">Conditional Dialogue</option>
        <option value="movement">Movement Map / Animation / Basic AI</option>
        <option value="navigation">Navigation</option>
        <option value="tileset">Tileset</option>
        <option value="map">Level / Tilemap</option>
      </select>
      <br />
      <label for="map-suffix">If you're submitting a map, please add a suffix. The map can be navigated to as "map&lt;suffix&gt;".</label>
      <input name="map-suffix" id="mapSuffixInput" type="text" v-model="mapSuffix">
      <br />
      <input type="file" id="assetFile" name="asset-file">
      <input id="submitAsset" type="submit" value="Submit Asset" @click="submitAsset">
      <input id="rebuildProject" type="submit" value="Rebuild Project" @click="rebuildProject">
      <input id="publishLatest" type="submit" value="Publish Latest Build" @click="publishLatest">
      <br />
      <input id="nukeMyGames" type="submit" class="btn btn-danger" value="Nuke My Games" @click="nukeMyGames">
    </form>
  </div>
  <Login v-else />

  <div id="toaster" class="position-fixed bottom-0 right-0 p-3" style="z-index: 5; right: 0; bottom: 0;">
  </div>
</template>

<script>
  import Login from '@/components/Login.vue';
  export default {
    name: 'Create',
    components: {
      Login
    },
    data() {
      return {
        globalRebuildLock: false,
        projectName: "",
        globalToastNumber: 0,
        assetType: "",
        mapSuffix: ""
      };
    },
    methods: {
      doToast(sender, message, shortTime = true) {
        let template = `<div id="liveToast${this.globalToastNumber}" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true" data-delay="${shortTime? 2000: 6000000}">
                <div class="toast-header">
                    <strong class="mr-auto">${sender}</strong>
                    <button onclick="toastClose(${this.globalToastNumber})" type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>`;
        document.getElementById("toaster").innerHTML += template;
        $('#liveToast' + this.globalToastNumber).toast('show');
        this.globalToastNumber += 1;
      },
      async rebuildProject(event) {
        event.preventDefault();
        if (this.projectName == "") {
          this.doToast("Create Form", "Project name / game ID may not be empty.");
          return;
        }
        if (this.globalRebuildLock) {
          this.doToast("Create Form", "Build is already in progress. Please wait.")
          return;
        } else {
          this.globalRebuildLock = true;
        }
        this.doToast("Rayfield Modding API", "Now starting your build! Please wait. This may take a few minutes.");
        let result = await fetch("https://raymon.musitraynes.com/build/" + this.projectName, {
          method: 'POST',
        });
        this.doToast("Rayfield Modding API", await result.text(), false);
        this.globalRebuildLock = false;
      },
      b64PNGEncode(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result.slice(22));
          reader.onerror = error => reject(error);
        });
      },
      async submitAsset(event) {
        event.preventDefault();
        if (this.projectName == "" || this.assetType == "") {
          this.doToast("Create Form", "Missing project name or asset type.");
          return;
        }
        const canonicalAssetName = (this.assetType === "map") ? this.assetType + this.mapSuffix : this.assetType;
        const assetFile = document.getElementById("assetFile").files[0];
        if (assetFile == undefined) {
          this.doToast("Create Form", "No upload detected. Please select a file and try again.");
          return;
        }
        let body = "";
        if (this.assetType == "tileset") {
          body = await this.b64PNGEncode(assetFile);
        } else {
          body = await assetFile.text();
        }
        const url = "https://raymon.musitraynes.com/upload/" + this.projectName + "/" + canonicalAssetName;
        let result = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({ data: body }),
          headers: {
            'Content-Type': 'application/json'
          },
        });
        this.doToast("Rayfield Modding API", await result.text());
      },
      async publishLatest(event) {
        event.preventDefault();
        if (this.projectName == "") {
          this.doToast("Create Form", "Project name / game ID may not be empty.");
          return;
        }
        let response = await fetch('/api/games', {
          method: 'POST',
          body: JSON.stringify({
            gameId: this.projectName,
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.status == 403) {
          this.doToast("MTRE API -- Publish Denied", "This account is not the original publisher of this game.")
        } else if (response.status == 500) {
          this.doToast("MTRE API -- Internal Server Error", await response.text());
        } else if (response.status == 404) {
          this.doToast("MTRE API -- Build Acquistion Failure", "Please press 'Rebuild Project' and confirm that the project finished building before pressing publish.", false)
        } else {
          this.doToast("MTRE API", "Publish successful!");
        }
      },
      async nukeMyGames(event) {
        event.preventDefault();
        let response = await fetch('/api/games', {
          method: 'DELETE'
        });
        this.doToast("MTRE API Nuclear Arsenal", await response.text());
      }
    },
    computed: {
      user() {
        return this.$root.$data.user;
      }
    }
  }
</script>

