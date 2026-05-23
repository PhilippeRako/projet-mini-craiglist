<template>
  <div class="favorites container py-4">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
      <div>
        <h2>Mes favoris</h2>
        <p class="text-muted mb-0">Annonces que vous avez sauvegardées.</p>
      </div>
      <router-link to="/dashboard" class="btn btn-outline-secondary">Retour au listing</router-link>
    </div>

    <div v-if="loading" class="alert alert-info">Chargement de vos favoris...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="favorites.length === 0" class="alert alert-warning">Vous n'avez aucun favori pour le moment.</div>

    <div v-else class="row row-cols-1 row-cols-md-2 g-4">
      <div v-for="ad in favorites" :key="ad.id" class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-3 gap-2">
              <h5 class="card-title mb-0"><router-link :to="`/ad/${ad.id}`" class="text-decoration-none">{{ ad.title }}</router-link></h5>
              <div>
                <button @click="toggleFavorite(ad.id)" class="btn btn-sm btn-link text-danger" title="Retirer des favoris">
                  ♥
                </button>
              </div>
            </div>

            <p class="card-text text-muted mb-1">{{ ad.category }} - {{ ad.city }}</p>
            <p class="card-text mb-2">{{ ad.description }}</p>
            <p class="fw-semibold mb-2">{{ formatPrice(ad) }}</p>
            <p class="text-secondary mb-3">Par <strong>{{ ad.author }}</strong></p>

            <div class="mt-auto d-flex gap-2 flex-wrap">
              <button
                v-if="currentUser && currentUser.id !== ad.user_id"
                @click="contactSeller(ad.id)"
                class="btn btn-success btn-sm flex-grow-1"
              >
                Contacter
              </button>
              <router-link :to="`/ad/${ad.id}`" class="btn btn-outline-secondary btn-sm flex-grow-1">Voir</router-link>
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

const favorites = ref([]);
const loading = ref(true);
const error = ref('');
const currentUser = ref(null);

const fetchCurrentUser = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/me', { credentials: 'include' });
    if (response.ok) {
      const data = await response.json();
      currentUser.value = data.user;
    }
  } catch (err) {
    console.error('Erreur récupération utilisateur', err);
  }
};

const fetchFavorites = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await fetch('http://localhost:3001/api/favorites', {
      credentials: 'include'
    });
    if (!response.ok) {
      const data = await response.json();
      error.value = data.error || 'Erreur lors de la récupération de vos favoris.';
      return;
    }
    favorites.value = await response.json();
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

const toggleFavorite = async (adId) => {
  try {
    const response = await fetch(`http://localhost:3001/api/favorites/${adId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!response.ok) {
      const data = await response.json();
      alert(data.error || 'Erreur lors de la suppression du favori.');
      return;
    }
    favorites.value = favorites.value.filter(ad => ad.id !== adId);
    alert('Retiré des favoris.');
  } catch (err) {
    alert('Impossible de contacter le serveur.');
  }
};

const contactSeller = async (adId) => {
  if (!currentUser.value) {
    alert('Vous devez être connecté pour contacter un vendeur.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3001/api/conversations/start', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || 'Erreur lors de l\'ouverture de la conversation.');
      return;
    }

    router.push(`/conversation/${data.id}`);
  } catch (err) {
    console.error('Erreur contact vendeur :', err);
    alert('Impossible de contacter le vendeur.');
  }
};

onMounted(async () => {
  await fetchCurrentUser();
  fetchFavorites();
});
</script>

<style scoped>
.favorites {
  min-height: 100%;
}
</style>
