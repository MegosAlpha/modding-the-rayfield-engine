<template>
 <div class="aspect-ratio-preserving-container">
    <iframe id="gameRoot"></iframe>
  </div>
</template>

<script>
export default {
  name: 'Player',
  props: {
    game: String
  },
  methods: {
    setPlayerDestination() {
      document.getElementById("gameRoot").src = "https://raymon.musitraynes.com/games/" + this.game + "/index.html";
    }
  },
  mounted() {
    this.setPlayerDestination()
  },
  watch: {
    game() {
      this.setPlayerDestination()
    }
  },
  changed() {
    this.setPlayerDestination()
  }
}
</script>

<style scoped>
  #gameRoot {
    position: absolute;
    top: 0;
    left:0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
}

.aspect-ratio-preserving-container {
    position: relative;
    padding-bottom: 56.25%;
}
</style>
