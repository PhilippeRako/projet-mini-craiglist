<template>
  <div class="profile">
    <h2>Mon profil</h2>

    <div v-if="!user">Chargement...</div>

    <div v-else>
      <p><strong>Pseudo :</strong> {{ user.pseudo }}</p>
      <p><strong>Ville :</strong> {{ user.ville || "Non renseigné" }}</p>
      <p><strong>Bio :</strong> {{ user.bio || "Aucune bio" }}</p>

      <div class="d-flex gap-2 mt-3 flex-wrap">
        <router-link to="/my-ads" class="btn btn-secondary">
          Mes annonces
        </router-link>
        <router-link to="/profil/edit" class="btn btn-primary">
          Modifier mon profil
        </router-link>
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
