<template>
  <div id="app">
    <header>
      <router-link to="/" style="color: white; text-decoration: none;">
        <h1>Bienvenue</h1>
      </router-link>
    </header>


    <main>
      <router-view></router-view>
    </main>
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
