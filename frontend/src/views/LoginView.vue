<template>
  <div class="login">
    <h2>Se connecter</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>Pseudo</label>
        <input type="text" v-model="pseudo" required />
      </div>
      <div>
        <label>Mot de passe</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Connexion</button>
    </form>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const pseudo = ref('');
const password = ref('');
const message = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', 
      body: JSON.stringify({
        pseudo: pseudo.value,
        password: password.value
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      router.push('/dashboard');
    } else {
      message.value = 'Erreur : ' + data.error;
    }
  } catch (error) {
    message.value = 'Erreur de connexion au serveur.';
  }
};
</script>

<style scoped>
.login { max-width: 400px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
form div { margin-bottom: 15px; }
label { display: block; margin-bottom: 5px; }
input { width: 100%; padding: 8px; box-sizing: border-box; }
button { width: 100%; padding: 10px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
button:hover { background-color: #218838; }
.message { margin-top: 15px; font-weight: bold; }
</style>
