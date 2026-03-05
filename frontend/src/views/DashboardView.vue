<template>
  <div class="dashboard">
    <div class="header-dashboard">
      <h2>Accueil {{ currentUser ? `(${currentUser.pseudo})` : '' }}</h2>
      <router-link to="/create-ad" class="btn-primary">Créer une annonce</router-link>
    </div>
    
    <h3>Toutes les annonces</h3>
    
    <div v-if="loading" class="loading">Chargement des annonces...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="ads.length === 0" class="empty">Aucune annonce pour le moment. Soyez le premier à en créer une !</div>
    
    <div v-else class="ads-grid">
      <div v-for="ad in ads" :key="ad.id" class="ad-card">
        <span :class="['badge', ad.type === 'OFFER' ? 'badge-offer' : 'badge-request']">
          {{ ad.type === 'OFFER' ? 'Offre' : 'Demande' }}
        </span>
        <h4>{{ ad.title }}</h4>
        <p class="category">{{ ad.category }} - {{ ad.city }}</p>
        <p class="price">
          {{ ad.price_type === 'FREE' ? 'Gratuit' : (ad.price_type === 'HOURLY' ? ad.price_value + '€ /h' : ad.price_value + '€ Fixe') }}
        </p>
        <p class="author">Par <strong>{{ ad.author }}</strong></p>

        <!-- Actions uniquement si c'est notre annonce -->
        <div v-if="currentUser && currentUser.id === ad.user_id" class="ad-actions">
          <router-link :to="`/edit-ad/${ad.id}`" class="btn-action btn-edit">Modifier</router-link>
          <button @click="deleteAd(ad.id)" class="btn-action btn-delete">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const ads = ref([]);
const loading = ref(true);
const error = ref('');
const currentUser = ref(null);

// Savoir qui est connecté actuellement
const fetchCurrentUser = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/me', { credentials: 'include' });
    if (response.ok) {
      const data = await response.json();
      currentUser.value = data.user;
    }
  } catch (err) {
    console.error("Erreur récupération utilisateur", err);
  }
};

// Récupérer tt les annonces
const fetchAds = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/ads');
    if (response.ok) {
      ads.value = await response.json();
    } else {
      error.value = 'Erreur lors de la récupération des annonces.';
    }
  } catch (err) {
    error.value = 'Impossible de contacter le serveur.';
  } finally {
    loading.value = false;
  }
};

// Supprimer une annonce
const deleteAd = async (id) => {
  if (!confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;

  try {
    const response = await fetch(`http://localhost:3001/api/ads/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    if (response.ok) {
      // on retire l'annonce de la liste affichée sans avoir à recharger la page
      ads.value = ads.value.filter(ad => ad.id !== id);
      alert("Annonce supprimée avec succès !");
    } else {
      const data = await response.json();
      alert("Erreur : " + data.error);
    }
  } catch (err) {
    alert("Erreur lors de la suppression.");
  }
};

onMounted(async () => {
  await fetchCurrentUser();
  fetchAds();
});
</script>

<style scoped>
.dashboard { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.header-dashboard { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
.btn-primary { background-color: #007bff; color: white; padding: 8px 15px; border-radius: 4px; text-decoration: none; font-weight: bold; }
.btn-primary:hover { background-color: #0056b3; }

.ads-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin-top: 20px; }
.ad-card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; background: white; transition: box-shadow 0.2s; position: relative; display: flex; flex-direction: column; }
.ad-card:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
.badge { position: absolute; top: 15px; right: 15px; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; color: white; }
.badge-offer { background-color: #28a745; }
.badge-request { background-color: #17a2b8; }
.category { color: #6c757d; font-size: 14px; margin-bottom: 5px; }
.price { font-weight: bold; color: #333; font-size: 18px; margin: 10px 0; }
.author { font-size: 12px; color: #999; margin-bottom: 15px; }

/* Styles des boutons d'action */
.ad-actions { margin-top: auto; display: flex; gap: 10px; border-top: 1px solid #eee; padding-top: 15px; }
.btn-action { flex: 1; text-align: center; padding: 6px; border-radius: 4px; font-size: 13px; font-weight: bold; cursor: pointer; text-decoration: none; border: none; }
.btn-edit { background-color: #f8f9fa; color: #007bff; border: 1px solid #007bff; }
.btn-edit:hover { background-color: #007bff; color: white; }
.btn-delete { background-color: #f8f9fa; color: #dc3545; border: 1px solid #dc3545; }
.btn-delete:hover { background-color: #dc3545; color: white; }
</style>
