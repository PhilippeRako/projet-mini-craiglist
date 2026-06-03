<template>
  <div class="register-page">
    <div class="register-box">
      <h2>Créer un compte</h2>

      <form @submit.prevent="handleRegister">
        <div class="field">
          <label>Pseudo</label>
          <input type="text" v-model="pseudo" required />
        </div>

        <div class="field">
          <label>Mot de passe</label>
          <input type="password" v-model="password" required />
        </div>

        <div class="field">
          <label>Ville</label>
          <input type="text" v-model="ville" />
        </div>

        <div class="field">
          <label>Bio</label>
          <textarea v-model="bio"></textarea>
        </div>

        <button type="submit" class="btn primary">S'inscrire</button>
      </form>

      <p v-if="message" class="message">{{ message }}</p>

      <router-link to="/" class="btn secondary back-btn">Retour</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const pseudo = ref('')
const password = ref('')
const ville = ref('')
const bio = ref('')
const message = ref('')
const router = useRouter()

const handleRegister = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pseudo: pseudo.value,
        password: password.value,
        ville: ville.value,
        bio: bio.value
      })
    })

    const data = await response.json()

    if (response.ok) {
      alert(data.message + ' Vous pouvez vous connecter !')
      router.push('/login')
    } else {
      message.value = 'Erreur : ' + data.error
    }
  } catch {
    message.value = 'Erreur de connexion au serveur.'
  }
}
</script>

<style scoped>
:global(html, body) {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: white;
}

.register-page {
  width: 100vw;
  height: 100vh;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.register-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.8s ease;
}

h2 {
  margin-bottom: 25px;
  color: #2e7d32;
  font-size: 2rem;
}

.field {
  text-align: left;
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
  display: block;
}

input,
textarea {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  transition: 0.2s;
  resize: none;
}

input:focus,
textarea:focus {
  border-color: #2e7d32;
  outline: none;
}

.btn {
  display: inline-block;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
  transition: 0.25s;
  margin-top: 10px;
}

.primary {
  background: #2e7d32;
  color: white;
}

.primary:hover {
  background: #1b5e20;
}

.secondary {
  border: 2px solid #2e7d32;
  color: #2e7d32;
  background: transparent;
}

.secondary:hover {
  background: #2e7d32;
  color: white;
}

.back-btn {
  margin-top: 20px;
}

.message {
  margin-top: 15px;
  font-weight: bold;
  color: #c0392b;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
