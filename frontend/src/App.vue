<template>
  <div id="app">
    <header class="bg-dark">
      <Navbar></Navbar>
    </header>


    <main>
      <router-view></router-view>
    </main>

    <footer class="fixed-bottom"><FooterComponent></FooterComponent></footer>
  </div>
</template>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f9;
}
header {
  background-color: #333;
  color: white;
  padding: 1rem;
  text-align: center;
}
main {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}
</style>
<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import FooterComponent from "@/components/Footer.vue";
</script>