<template>
<div class="container">
  <h2>Click any game below to play!</h2>
  <p>Note: All games below are published by the community. We are not responsible for any modified content in these games.</p>
  <div class="container" id="games">
    <div v-for="game in games" v-bind:key="game.name">
      <GameCard v-bind:user-name="game.user.username" v-bind:game-name="game.title" @click="selectGame(game.title)" />
    </div>
  </div>
  </div>
  <Player v-if="selectedGame !== ''" v-bind:game="selectedGame" />
</template>

<script>
  import GameCard from '@/components/GameCard.vue'
  import Player from '@/components/Player.vue'

  export default {
    name: 'Play',
    components: {
      GameCard,
      Player
    },
    data() {
      return {
        games: [],
        selectedGame: ""
      }
    },
    computed: {
      user() {
        return this.$root.data.user;
      }
    },
    created() {
      this.getGames();
    },
    methods: {
      async getGames() {
        let response = await fetch('/api/games');
        let responseObj = JSON.parse(await response.text());
        this.games = responseObj;
      },
      async selectGame(gameName) {
        this.selectedGame = gameName;
      }
    }
  }
</script>

<style scoped>
  #games {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
</style>
