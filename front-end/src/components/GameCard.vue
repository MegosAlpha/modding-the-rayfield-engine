<template>
  <div class="container">
    <p><strong>{{gameName}}</strong></p>
    <p><em>by {{userName}}</em></p>
  </div>
</template>

<script>
  export default {
    name: 'GameCard',
    props: {
      gameName: String,
      userName: String
    }
  }
</script>

<style scoped>
  .container {
    border-style: dashed;
    flex: 0 0 33.333333%;
  }
</style>
