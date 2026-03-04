<template>
  <div class="landing">
    <h2>Bienvenue sur ServiceBoard</h2>
    <p>Votre plateforme pour proposer et trouver des services facilement.</p>
    <div class="actions">
      <router-link to="/login" class="btn">Se connecter</router-link>
      <router-link to="/register" class="btn btn-outline">S'inscrire</router-link>
    </div>
  </div>
</template>

<style scoped>
.landing {
  text-align: center;
  margin-top: 50px;
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
}
.btn {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: 0.2s;
}
.btn-outline {
  background-color: transparent;
  color: #28a745;
  border: 2px solid #28a745;
}
.btn:hover { opacity: 0.8; }
.btn-outline:hover { background-color: #28a745; color: white; }
</style>
