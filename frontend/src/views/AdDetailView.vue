<template>
  <div class="ad-detail">
    <button class="btn-back" @click="router.back()">← Retour</button>

    <div v-if="loading" class="status">Chargement...</div>
    <div v-else-if="error" class="status error">{{ error }}</div>
    <div v-else>
      <h2>{{ ad.title }}</h2>
      <div class="ad-meta">
        <span class="badge" :class="ad.type === 'OFFER' ? 'offer' : 'request'">
          {{ ad.type === 'OFFER' ? 'Offre' : 'Demande' }}
        </span>
        <span>{{ ad.category }}</span>
        <span>{{ ad.city }}</span>
      </div>

      <div class="ad-info">
        <p><strong>Auteur :</strong> {{ ad.author }}</p>
        <p><strong>Disponibilités :</strong> {{ ad.availability || 'Non renseigné' }}</p>
        <p><strong>Modalités :</strong> {{ ad.modalities || 'Non renseigné' }}</p>
        <p><strong>Statut :</strong> {{ ad.status }}</p>
        <p><strong>Publiée le :</strong> {{ formattedDate }}</p>
      </div>

      <div class="ad-description">
        <h3>Description</h3>
        <p>{{ ad.description }}</p>
      </div>

      <div class="ad-price">
        <strong>Tarif :</strong>
        <span v-if="ad.price_type === 'FREE'">Gratuit</span>
        <span v-else-if="ad.price_type === 'HOURLY'">{{ ad.price_value }} € /h</span>
        <span v-else>{{ ad.price_value }} € (fixe)</span>
      </div>

      <div class="actions">
        <button
          v-if="currentUser && currentUser.id !== ad.user_id"
          class="btn-contact"
          @click="contactSeller"
          :disabled="contacting"
        >
          {{ contacting ? 'Ouverture...' : 'Contacter' }}
        </button>

        <p v-else-if="currentUser && currentUser.id === ad.user_id" class="owner-note">
          C'est votre annonce.
        </p>

        <p v-else class="login-note">
          <router-link to="/login">Connectez-vous</router-link> pour contacter l'auteur.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const ad = ref(null);
const loading = ref(true);
const error = ref('');
const currentUser = ref(null);
const contacting = ref(false);

const fetchAd = async () => {
  const id = route.params.id;
  try {
    const res = await fetch(`http://localhost:3001/api/ads/${id}`, {
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) {
      error.value = data.error || 'Annonce introuvable.';
      return;
    }
    ad.value = data;
  } catch (err) {
    error.value = 'Impossible de charger l’annonce.';
  } finally {
    loading.value = false;
  }
};

const fetchCurrentUser = async () => {
  try {
    const res = await fetch('http://localhost:3001/api/auth/me', {
      credentials: 'include'
    });
    if (res.ok) {
      currentUser.value = (await res.json()).user;
    }
  } catch (err) {
    console.error(err);
  }
};

const contactSeller = async () => {
  if (!ad.value) return;
  contacting.value = true;
  try {
    const res = await fetch('http://localhost:3001/api/conversations/start', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId: ad.value.id })
    });
    const data = await res.json();
    if (!res.ok) {
      error.value = data.error || 'Impossible d’ouvrir la conversation.';
      return;
    }
    router.push(`/conversation/${data.id}`);
  } catch (err) {
    error.value = 'Impossible de contacter l’auteur.';
  } finally {
    contacting.value = false;
  }
};

const formattedDate = computed(() => {
  if (!ad.value || !ad.value.created_at) return 'Non disponible';
  return new Date(ad.value.created_at).toLocaleString();
});

onMounted(async () => {
  await fetchCurrentUser();
  await fetchAd();
});
</script>

<style scoped>
.ad-detail { max-width: 760px; margin: 0 auto; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.btn-back { background: #f0f0f0; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; margin-bottom: 20px; }
.ad-meta { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; color: #555; }
.badge { padding: 4px 8px; border-radius: 999px; color: white; font-weight: bold; font-size: 13px; }
.badge.offer { background: #28a745; }
.badge.request { background: #17a2b8; }
.ad-info p, .ad-price { margin: 8px 0; }
.ad-description { margin: 20px 0; }
.actions { margin-top: 25px; }
.btn-contact { background: #007bff; color: white; border: none; padding: 12px 18px; border-radius: 8px; cursor: pointer; }
.btn-contact:disabled { background: #6c757d; cursor: not-allowed; }
.owner-note, .login-note { margin-top: 12px; color: #555; }
.status { padding: 20px; text-align: center; }
.error { color: #a94442; background: #f2dede; border-radius: 8px; }
</style>
