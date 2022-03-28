<template>
  <h2>Click any game below to play!</h2>
  <p>Note: Some mock data presented below. Only the first game is protected on the API. Other games can be changed or removed at any time. Project 4's community-oriented feature set is aimed implementing a proper game registry.</p>
  <div class="container" id="games">
    <div v-for="game in games" v-bind:key="game.name">
      <GameCard v-bind:user-name="game.user" v-bind:game-name="game.name" @click="selectGame(game.name)"/>
    </div>
  </div>
  <Player v-if="selectedGame !== ''" v-bind:game="selectedGame"/>
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
      // Mock Data. Planned for upgrade in Project 4.
      this.games = [{
        name: "apitest",
        user: "admin"
      },
      {
        name: "apitest2",
        user: "unknown"
      },
      {
        name: "apitest3",
        user: "???"
      },
      {
        name: "???",
        user: "???"
      }]
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
