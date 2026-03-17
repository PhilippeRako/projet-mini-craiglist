<template>
  <div class="conversation">
    <h2>Conversation</h2>

    <div v-if="loading">Chargement...</div>
    <div v-else>
      <div class="messages">
        <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['message', msg.sender_id === currentUser.id ? 'me' : 'other']"
        >
          <p>{{ msg.content }}</p>
          <span>{{ new Date(msg.created_at).toLocaleString() }}</span>
        </div>
      </div>

      <div class="send-box">
        <input v-model="newMessage" placeholder="Votre message..." />
        <button @click="sendMessage">Envoyer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const convId = route.params.id;

const messages = ref([]);
const newMessage = ref("");
const loading = ref(true);
const currentUser = ref(null);

const fetchCurrentUser = async () => {
  const res = await fetch("http://localhost:3001/api/auth/me", { credentials: "include" });
  if (res.ok) currentUser.value = (await res.json()).user;
};

const fetchMessages = async () => {
  const res = await fetch(`http://localhost:3001/api/conversations/${convId}/messages`, {
    credentials: "include"
  });
  messages.value = await res.json();
  loading.value = false;
};

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  const res = await fetch(`http://localhost:3001/api/conversations/${convId}/messages`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: newMessage.value })
  });

  if (res.ok) {
    newMessage.value = "";
    fetchMessages();
  }
};

onMounted(async () => {
  await fetchCurrentUser();
  await fetchMessages();
});
</script>

<style scoped>
.conversation { padding: 20px; }
.messages { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.message { padding: 10px; border-radius: 8px; max-width: 70%; }
.me { background: #d1e7dd; align-self: flex-end; }
.other { background: #f8d7da; align-self: flex-start; }
.send-box { display: flex; gap: 10px; }
.send-box input { flex: 1; padding: 8px; }
</style>
