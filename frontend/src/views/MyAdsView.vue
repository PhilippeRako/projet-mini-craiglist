<template>
  <div class="my-ads container py-4">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
      <div>
        <h2>Mes annonces</h2>
        <p class="text-muted mb-0">Consultez vos annonces publiées et vos brouillons.</p>
      </div>
      <div class="d-flex gap-2 flex-wrap">
        <router-link to="/create-ad" class="btn btn-primary">Nouvelle annonce</router-link>
        <router-link to="/dashboard" class="btn btn-outline-secondary">Retour menu principal</router-link>
      </div>
    </div>

    <div v-if="loading" class="alert alert-info">Chargement de vos annonces...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="ads.length === 0" class="alert alert-warning">Vous n'avez encore créé aucune annonce.</div>

    <div v-else class="row row-cols-1 g-4">
      <div v-for="ad in ads" :key="ad.id" class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-3 gap-2">
              <div>
                <h5 class="card-title mb-1">{{ ad.title }}</h5>
                <p class="mb-0 text-muted small">{{ ad.category }} - {{ ad.city }}</p>
              </div>
              <span class="badge rounded-pill" :class="ad.status === 'PUBLISHED' ? 'bg-success' : 'bg-secondary'">
                {{ ad.status === 'PUBLISHED' ? 'Publié' : 'Brouillon' }}
              </span>
            </div>

            <p class="card-text mb-2">{{ ad.description }}</p>
            <p class="fw-semibold mb-3">{{ formatPrice(ad) }}</p>

            <div class="mt-auto d-flex gap-2 flex-wrap">
              <router-link :to="`/edit-ad/${ad.id}`" class="btn btn-outline-primary btn-sm flex-grow-1">Modifier</router-link>
              <button @click="deleteAd(ad.id)" class="btn btn-outline-danger btn-sm flex-grow-1">Supprimer</button>
              <router-link v-if="ad.status === 'PUBLISHED'" :to="`/ad/${ad.id}`" class="btn btn-outline-secondary btn-sm flex-grow-1">Voir</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import router from '../router';

const ads = ref([]);
const loading = ref(true);
const error = ref('');

const fetchMyAds = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await fetch('http://localhost:3001/api/ads/mine', {
      credentials: 'include'
    });
    if (!response.ok) {
      const data = await response.json();
      error.value = data.error || 'Erreur lors de la récupération de vos annonces.';
      return;
    }
    ads.value = await response.json();
  } catch (err) {
    error.value = 'Impossible de contacter le serveur.';
  } finally {
    loading.value = false;
  }
};

const formatPrice = (ad) => {
  if (ad.price_type === 'FREE') return 'Gratuit';
  if (ad.price_type === 'HOURLY') return `${ad.price_value}€ /h`;
  return `${ad.price_value}€ fixe`;
};

const deleteAd = async (id) => {
  if (!confirm('Voulez-vous vraiment supprimer cette annonce ?')) return;
  try {
    const response = await fetch(`http://localhost:3001/api/ads/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!response.ok) {
      const data = await response.json();
      alert(data.error || 'Erreur lors de la suppression.');
      return;
    }
    ads.value = ads.value.filter(ad => ad.id !== id);
    alert('Annonce supprimée.');
  } catch (err) {
    alert('Impossible de contacter le serveur.');
  }
};

onMounted(() => {
  fetchMyAds();
});
</script>

<style scoped>
.my-ads {
  min-height: 100%;
}
</style>
