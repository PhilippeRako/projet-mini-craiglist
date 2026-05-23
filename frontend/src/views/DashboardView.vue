<template>
  <div class="dashboard container py-4">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
      <h2 class="mb-0">Accueil {{ currentUser ? `(${currentUser.pseudo})` : '' }}</h2>
      <div class="d-flex gap-2 flex-wrap">
        <router-link to="/create-ad" class="btn btn-primary">Créer une annonce</router-link>
        <router-link to="/inbox" class="btn btn-secondary">Messagerie</router-link>
        <router-link to="/my-ads" class="btn btn-outline-secondary">Mes annonces</router-link>
      </div>
    </div>

    <section class="filters mb-4">
      <div class="row g-3">
        <div class="col-12 col-md-4">
          <input
            class="form-control"
            type="text"
            v-model="searchQuery"
            placeholder="Recherche par mot-clé..."
          />
        </div>

        <div class="col-6 col-md-2">
          <select class="form-select" v-model="filterType">
            <option value="">Tous les types</option>
            <option value="OFFER">Offre</option>
            <option value="REQUEST">Demande</option>
          </select>
        </div>

        <div class="col-6 col-md-2">
          <select class="form-select" v-model="filterCategory">
            <option value="">Toutes les catégories</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>

        <div class="col-6 col-md-2">
          <input
            class="form-control"
            type="text"
            v-model="filterCity"
            placeholder="Ville"
          />
        </div>

        <div class="col-6 col-md-2">
          <select class="form-select" v-model="sortOrder">
            <option value="recent">Plus récent</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      <div class="mt-3 d-flex flex-wrap gap-2 align-items-center">
        <span class="text-muted">Résultats mis à jour automatiquement.</span>
        <button class="btn btn-outline-secondary" @click="resetFilters">Réinitialiser</button>
      </div>
    </section>

    <h3 class="mb-3">Toutes les annonces</h3>

    <div v-if="loading" class="alert alert-info">Chargement des annonces...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="ads.length === 0" class="alert alert-warning">Aucune annonce pour le moment. Soyez le premier à en créer une !</div>

    <div v-else class="row row-cols-1 row-cols-md-2 g-4">
      <div v-for="ad in ads" :key="ad.id" class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-3 gap-2">
              <h5 class="card-title mb-0"><router-link :to="`/ad/${ad.id}`" class="text-decoration-none">{{ ad.title }}</router-link></h5>
              <div class="d-flex gap-2">
                <button
                  v-if="currentUser"
                  @click="toggleFavorite(ad.id)"
                  class="btn btn-sm btn-link"
                  :class="isFavorite(ad.id) ? 'text-danger' : 'text-secondary'"
                  :title="isFavorite(ad.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                >
                  {{ isFavorite(ad.id) ? '♥' : '♡' }}
                </button>
                <span class="badge rounded-pill" :class="ad.type === 'OFFER' ? 'bg-success' : 'bg-info text-dark'">{{ ad.type === 'OFFER' ? 'Offre' : 'Demande' }}</span>
              </div>
            </div>

            <p class="card-text text-muted mb-1">{{ ad.category }} - {{ ad.city }}</p>
            <p class="card-text mb-2">{{ ad.description }}</p>
            <p class="fw-semibold mb-2">{{ ad.price_type === 'FREE' ? 'Gratuit' : (ad.price_type === 'HOURLY' ? ad.price_value + '€ /h' : ad.price_value + '€ Fixe') }}</p>
            <p class="text-secondary mb-3">Par <strong>{{ ad.author }}</strong></p>

            <div class="mt-auto d-flex gap-2 flex-wrap">
              <button
                v-if="currentUser && currentUser.id !== ad.user_id"
                @click="contactSeller(ad.id)"
                class="btn btn-success btn-sm flex-grow-1"
              >
                Contacter
              </button>

              <div v-if="currentUser && currentUser.id === ad.user_id" class="d-flex gap-2 flex-wrap w-100">
                <router-link :to="`/edit-ad/${ad.id}`" class="btn btn-outline-primary btn-sm flex-grow-1">Modifier</router-link>
                <button @click="deleteAd(ad.id)" class="btn btn-outline-danger btn-sm flex-grow-1">Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import router from '../router';
const ads = ref([]);
const loading = ref(true);
const error = ref('');
const currentUser = ref(null);
const searchQuery = ref('');
const filterType = ref('');
const filterCategory = ref('');
const filterCity = ref('');
const sortOrder = ref('recent');
const categories = ref(['Bricolage', 'Jardinage', 'Soutien Scolaire', 'Informatique', 'Ménage', 'Autre']);

const buildQueryParams = () => {
  const params = new URLSearchParams();
  if (searchQuery.value) params.set('q', searchQuery.value);
  if (filterType.value) params.set('type', filterType.value);
  if (filterCategory.value) params.set('category', filterCategory.value);
  if (filterCity.value) params.set('city', filterCity.value);
  if (sortOrder.value) params.set('sort', sortOrder.value);
  return params.toString() ? `?${params.toString()}` : '';
};

const applyFilters = () => {
  loading.value = true;
  fetchAds();
};

let filterTimer = null;

watch([searchQuery, filterType, filterCategory, filterCity, sortOrder], () => {
  loading.value = true;
  error.value = '';

  if (filterTimer) {
    clearTimeout(filterTimer);
  }

  filterTimer = setTimeout(() => {
    fetchAds();
  }, 300);
});

const resetFilters = () => {
  searchQuery.value = '';
  filterType.value = '';
  filterCategory.value = '';
  filterCity.value = '';
  sortOrder.value = 'recent';
  applyFilters();
};

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
    const response = await fetch(`http://localhost:3001/api/ads${buildQueryParams()}`);
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



//Système de messagerie
const contactSeller = async (adId) => {
  if (!currentUser.value) {
    alert("Vous devez être connecté pour contacter un vendeur.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3001/api/conversations/start", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Erreur lors de l'ouverture de la conversation.");
      return;
    }

    // Redirection vers la conversation
    router.push(`/conversation/${data.id}`);
  } catch (err) {
    console.error("Erreur contact vendeur :", err);
    alert("Impossible de contacter le vendeur.");
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

// Gestion des favoris
const favorites = ref(new Set());

const fetchFavorites = async () => {
  if (!currentUser.value) return;
  try {
    const response = await fetch('http://localhost:3001/api/favorites', {
      credentials: 'include'
    });
    if (response.ok) {
      const favoriteAds = await response.json();
      favorites.value = new Set(favoriteAds.map(ad => ad.id));
    }
  } catch (err) {
    console.error('Erreur récupération favoris :', err);
  }
};

const isFavorite = (adId) => {
  return favorites.value.has(adId);
};

const toggleFavorite = async (adId) => {
  if (!currentUser.value) {
    alert('Vous devez être connecté pour ajouter aux favoris.');
    return;
  }

  if (isFavorite(adId)) {
    // Retirer des favoris
    try {
      const response = await fetch(`http://localhost:3001/api/favorites/${adId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        favorites.value.delete(adId);
      }
    } catch (err) {
      console.error('Erreur retrait favori :', err);
    }
  } else {
    // Ajouter aux favoris
    try {
      const response = await fetch('http://localhost:3001/api/favorites', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId })
      });
      if (response.ok) {
        favorites.value.add(adId);
      }
    } catch (err) {
      console.error('Erreur ajout favori :', err);
    }
  }
};

onMounted(async () => {
  await fetchCurrentUser();
  await fetchFavorites();
  fetchAds();
});
</script>

<style scoped>
.dashboard {
  min-height: 100%;
}

.filters .form-select,
.filters .form-control {
  min-height: 42px;
}

.card-text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  line-clamp: 4;
}
</style>
