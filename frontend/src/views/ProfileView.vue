<template>
  <div class="profile-container">
    <div class="profile-card shadow-sm">
      <h2 class="text-center mb-4">Mon profil</h2>

      <div v-if="!user" class="text-center py-4">
        <div class="spinner-border text-primary"></div>
        <p class="mt-2">Chargement...</p>
      </div>

      <div v-else>
        <div class="text-center mb-3">
          <div class="avatar">
            {{ user.pseudo?.charAt(0).toUpperCase() }}
          </div>
          <h3 class="mt-2">{{ user.pseudo }}</h3>
        </div>

        <div class="info-list">
          <p><strong>Ville :</strong> {{ user.ville || "Non renseigné" }}</p>
          <p><strong>Bio :</strong> {{ user.bio || "Aucune bio" }}</p>
        </div>

        <div class="d-flex gap-2 mt-4 flex-wrap justify-content-center">
          <router-link to="/my-ads" class="btn btn-outline-secondary">
            Mes annonces
          </router-link>
          <router-link to="/profil/edit" class="btn btn-primary">
            Modifier mon profil
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const user = ref(null);

onMounted(async () => {
  const res = await fetch("http://localhost:3001/api/auth/me", {
    credentials: "include"
  });
  if (res.ok) user.value = (await res.json()).user;
});
</script>

<style>
.profile-container {
  display: flex;
  justify-content: center;
  padding: 40px 15px;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 450px;
  width: 100%;
}

.avatar {
  width: 80px;
  height: 80px;
  background: #0d6efd;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  margin: 0 auto;
}

.info-list p {
  margin: 8px 0;
  font-size: 16px;
}
</style>
