<template>
  <div class="profile-edit">
    <h2>Modifier mon profil</h2>

    <form @submit.prevent="save">
      <label>Pseudo</label>
      <input v-model="pseudo" class="form-control" />

      <label>Ville</label>
      <input v-model="ville" class="form-control" />

      <label>Bio</label>
      <textarea v-model="bio" class="form-control"></textarea>

      <button class="btn btn-success mt-3">Enregistrer</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import router from "../router";

const pseudo = ref("");
const ville = ref("");
const bio = ref("");

onMounted(async () => {
  const res = await fetch("http://localhost:3001/api/auth/me", {
    credentials: "include"
  });
  if (res.ok) {
    const u = (await res.json()).user;
    pseudo.value = u.pseudo;
    ville.value = u.ville;
    bio.value = u.bio;
  }
});

const save = async () => {
  const res = await fetch("http://localhost:3001/api/auth/update", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pseudo: pseudo.value,
      ville: ville.value,
      bio: bio.value
    })
  });

  if (res.ok) {
    alert("Profil mis à jour !");
    router.push("/profil");
  }
};
</script>
