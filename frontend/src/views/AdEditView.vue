<template>
  <div class="ad-create">
    <h2>Modifier l'annonce</h2>
    
    <div v-if="loadingAd" class="loading">Chargement des données de l'annonce...</div>
    <form v-else @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Type d'annonce</label>
        <select v-model="form.type" required>
          <option value="OFFER">Je propose un service (Offre)</option>
          <option value="REQUEST">Je recherche un service (Demande)</option>
        </select>
      </div>

      <div class="form-group">
        <label>Titre de l'annonce</label>
        <input type="text" v-model="form.title" required placeholder="Ex: Cours de guitare pour débutant" />
      </div>

      <div class="form-group">
        <label>Catégorie</label>
        <select v-model="form.category" required>
          <option value="">-- Choisissez une catégorie --</option>
          <option value="Bricolage">Bricolage</option>
          <option value="Jardinage">Jardinage</option>
          <option value="Soutien Scolaire">Soutien Scolaire</option>
          <option value="Informatique">Informatique</option>
          <option value="Ménage">Ménage</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div class="form-group">
        <label>Description détaillée</label>
        <textarea v-model="form.description" required rows="5" placeholder="Décrivez votre service en détail..."></textarea>
      </div>

      <div class="form-group">
        <label>Ville</label>
        <input type="text" v-model="form.city" required placeholder="Ex: Lyon" />
      </div>

      <div class="form-group">
        <label>Disponibilités</label>
        <input type="text" v-model="form.availability" placeholder="Ex: Les week-ends uniquement" />
      </div>

      <div class="form-row">
        <div class="form-group half">
          <label>Tarification</label>
          <select v-model="form.price_type" required>
            <option value="FREE">Gratuit</option>
            <option value="HOURLY">À l'heure</option>
            <option value="FIXED">Prix fixe</option>
          </select>
        </div>

        <div class="form-group half" v-if="form.price_type !== 'FREE'">
          <label>Montant (€)</label>
          <input type="number" v-model="form.price_value" step="0.5" required min="0" />
        </div>
      </div>

      <div class="form-group">
        <label>Modalités</label>
        <select v-model="form.modalities">
          <option value="REMOTE">À distance (Visio)</option>
          <option value="AT_PROVIDER">Chez le prestataire</option>
          <option value="AT_CUSTOMER">Chez le client</option>
          <option value="ANYWHERE">Peu importe</option>
        </select>
      </div>

      <button type="submit" class="btn-submit" :disabled="loadingSubmit">
        {{ loadingSubmit ? 'Modification en cours...' : 'Enregistrer les modifications' }}
      </button>
    </form>
    
    <p v-if="message" :class="['message', isError ? 'error' : 'success']">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute(); // Permet de récupérer l'ID dans l'URL
const loadingAd = ref(true);
const loadingSubmit = ref(false);
const message = ref('');
const isError = ref(false);

const form = reactive({
  type: 'OFFER', title: '', description: '', category: '', city: '',
  availability: '', price_type: 'HOURLY', price_value: null, modalities: 'AT_CUSTOMER'
});

// Récupérer l'annonce existante et pré-remplir le formulaire
onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3001/api/ads`); // On récupère toutes les annonces
    const ads = await res.json();
    const myAd = ads.find(a => a.id == route.params.id); // On trouve celle qui correspond à notre ID dans l'URL
    
    if(myAd) {
      // On copie les données de l'annonce dans notre formulaire
      Object.assign(form, myAd);
    } else {
      isError.value = true;
      message.value = 'Annonce introuvable !';
    }
  } catch (err) {
    isError.value = true;
    message.value = 'Erreur lors du chargement de l\'annonce.';
  } finally {
    loadingAd.value = false;
  }
});

const handleSubmit = async () => {
  loadingSubmit.value = true;
  message.value = '';
  isError.value = false;
  
  try {
    const response = await fetch(`http://localhost:3001/api/ads/${route.params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Important pour vérifier que l'utilisateur est bien l'auteur
      body: JSON.stringify(form)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      isError.value = false;
      message.value = 'Annonce modifiée avec succès !';
      // Redirection vers le dashboard après 1.5s
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } else {
      isError.value = true;
      message.value = 'Erreur : ' + (data.error || 'Erreur inconnue');
    }
  } catch (error) {
    isError.value = true;
    message.value = 'Erreur de connexion au serveur.';
  } finally {
    loadingSubmit.value = false;
  }
};
</script>

<style scoped>
.ad-create { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.form-group { margin-bottom: 20px; }
.form-row { display: flex; gap: 15px; }
.half { flex: 1; }
label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; }
input, select, textarea { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-family: inherit; }
input:focus, select:focus, textarea:focus { border-color: #28a745; outline: none; }
.btn-submit { width: 100%; padding: 12px; background-color: #28a745; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: bold; cursor: pointer; transition: background-color 0.2s; margin-top: 10px; }
.btn-submit:hover:not(:disabled) { background-color: #218838; }
.btn-submit:disabled { background-color: #6c757d; cursor: not-allowed; }
.message { margin-top: 20px; padding: 10px; border-radius: 4px; text-align: center; font-weight: bold; }
.success { background-color: #d4edda; color: #155724; }
.error { background-color: #f8d7da; color: #721c24; }
.loading { text-align: center; font-style: italic; color: #666; margin: 20px 0; }
</style>
