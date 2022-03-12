<template>
  <div id="nav" class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link class="navbar-brand" to="/">Modding the Rayfield Engine</router-link>
    <router-link to="/">Home</router-link> |
    <router-link to="/learn">Learn</router-link> |
    <router-link to="/play">Play</router-link> |
    <router-link to="/create">Create</router-link>
  </div>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 10px;
  layout: flex;
}

#nav a {
  font-weight: bold;
  color: #b9929f;
  padding: 5px;
}

#nav a.router-link-exact-active {
  color: #e2c2c6;
}

.bg-light {
    background-color: #610F7F !important;
}

.navbar-light .navbar-nav .nav-link:focus, .navbar-light .navbar-nav .nav-link:hover {
    color: #E2C2C6;
}

.navbar-light .navbar-nav .nav-link {
    color: #b9929f;
}

.navbar-brand, .navbar-nav .active > .nav-link {
    color: #e2c2c6 !important;
}
</style>
