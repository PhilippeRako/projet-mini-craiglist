<template>
  <div class="register">
    <h2>Créer un compte</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label>Pseudo</label>
        <input type="text" v-model="pseudo" required />
      </div>
      <div>
        <label>Mot de passe</label>
        <input type="password" v-model="password" required />
      </div>
      <div>
        <label>Ville</label>
        <input type="text" v-model="ville" />
      </div>
      <div>
        <label>Bio</label>
        <textarea v-model="bio"></textarea>
      </div>
      <button type="submit">S'inscrire</button>
    </form>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const pseudo = ref('');
const password = ref('');
const ville = ref('');
const bio = ref('');
const message = ref('');
const router = useRouter();

const handleRegister = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pseudo: pseudo.value,
        password: password.value,
        ville: ville.value,
        bio: bio.value
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      alert(data.message + ' Vous pouvez vous connecter !');
      router.push('/login');
    } else {
      message.value = 'Erreur : ' + data.error;
    }
  } catch (error) {
    message.value = 'Erreur de connexion au serveur.';
  }
};
</script>

<style scoped>
.register { max-width: 400px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
form div { margin-bottom: 15px; }
label { display: block; margin-bottom: 5px; }
input, textarea { width: 100%; padding: 8px; box-sizing: border-box; }
button { width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
button:hover { background-color: #0056b3; }
.message { margin-top: 15px; color: green; font-weight: bold; }
</style>
