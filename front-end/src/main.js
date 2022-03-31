import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

App.data = function () {
  return {
      user: null
  };
}

createApp(App).use(router).mount('#app')

