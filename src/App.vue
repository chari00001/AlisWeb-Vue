<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import Navbar from './components/Navbar.vue'

const store = useStore()

onMounted(() => {
  // Sayfa yüklendiğinde kullanıcı oturumunu kontrol et
  store.dispatch('auth/checkAuth')
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.main-content {
  padding-top: 80px; /* Height of navbar + some extra padding */
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

button {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #42b983;
  color: white;
  font-size: 1rem;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3aa876;
}

.error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.success {
  color: #28a745;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
