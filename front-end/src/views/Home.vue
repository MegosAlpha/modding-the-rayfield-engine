<template>
  <div class="home">
<div class="container">
            <div class="row">
                <div class="col-lg">
                    <img src="/demo.png" alt="A Rayfield Engine Game" class="img-thumbnail" />
                </div>
                <div class="col-lg">
                    <h1>Modding the Rayfield Engine</h1>
                    <p>Welcome! This site hopes to be the definitive reference for modding Rayfield Engine games. Despite the closed-source nature of the engine itself, some folks have provided a method to generate some simple games using approximations of the engine's tooling. The nice thing for us is that the engine tools we have proxy access to are remarkably text-oriented, as opposed to the tendency of game development to take place in highly graphical environments. For our purposes, all you'll need is a stable internet connection, a browser with support for WebAssembly, and some free time. If you'd like to make more significant adjustments, such as adjustments to the tileset or tilemaps, you'll want a photo manipulation software like <a href="https://www.gimp.org/">GIMP</a> and an editor compatible with <a href="https://www.mapeditor.org/">Tiled Map Editor</a> JSON files, respectively.</p>

                    <p>To get started with modding, head over to the Learn page. If you're here to play the provided demo or a community game, go to the Play page. Finally, the Create page is used for designing and releasing a modded Rayfield Engine game.</p>
                </div>
            </div>
        </div>

  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {}
}
</script>
