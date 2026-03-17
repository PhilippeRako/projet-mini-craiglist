<template>
  <div class="inbox">
    <h2>Messagerie</h2>

    <div v-if="loading">Chargement...</div>

    <div v-else-if="conversations.length === 0">
      <p>Aucune conversation pour le moment.</p>
    </div>

    <div v-else class="conversation-list">
      <div
          v-for="conv in conversations"
          :key="conv.id"
          class="conversation-item"
          @click="openConversation(conv.id)"
      >
        <h4>{{ conv.ad_title }}</h4>
        <p><strong>{{ conv.other_user }}</strong></p>
        <p class="last-message">{{ conv.last_message }}</p>
        <span class="date">{{ new Date(conv.last_date).toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import router from "../router";

const conversations = ref([]);
const loading = ref(true);

const fetchInbox = async () => {
  const res = await fetch("http://localhost:3001/api/conversations", {
    credentials: "include"
  });

  if (res.ok) {
    conversations.value = await res.json();
  }

  loading.value = false;
};

const openConversation = (id) => {
  router.push(`/conversation/${id}`);
};

onMounted(fetchInbox);
</script>

<style scoped>
.inbox { padding: 20px; }
.conversation-list { display: flex; flex-direction: column; gap: 15px; }
.conversation-item {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  background: white;
}
.conversation-item:hover { background: #f8f9fa; }
.last-message { color: #555; }
.date { font-size: 12px; color: #999; }
</style>
