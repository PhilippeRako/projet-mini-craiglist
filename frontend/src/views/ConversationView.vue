<template>
  <div class="conversation">
    <h2>Conversation</h2>
    <button class="btn-back" @click="router.back()">← Retour</button>
    <button class="btn-delete" @click="deleteAll">Supprimer tous les messages</button>    


    <div v-if="loading">Chargement...</div>
    <div v-else>
      <div class="messages">
        <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['message', msg.sender_id === currentUser.id ? 'me' : 'other']"
        >
          <strong>{{ msg.sender_pseudo }}</strong>
          <p>{{ msg.content }}</p>
          <span>{{ new Date(msg.created_at).toLocaleString() }}</span>
        </div>
      </div>

      <div class="send-box">
        <input
            v-model="newMessage"
            placeholder="Votre message..."
            @keyup.enter="sendMessage"
        />

        <button class="btn-send" @click="sendMessage">Envoyer</button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import router from "../router";


const route = useRoute();
const convId = route.params.id;

const messages = ref([]);
const newMessage = ref("");
const loading = ref(true);
const currentUser = ref(null);

const deleteAll = async () => {
  if (!confirm("Supprimer tous les messages ?")) return;

  const res = await fetch(`http://localhost:3001/api/conversations/${convId}/messages`, {
    method: "DELETE",
    credentials: "include"
  });

  if (res.ok) {
    messages.value = [];
  }
};


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
.btn-back {
  background: #eee;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 15px;
}
.btn-back:hover {
  background: #ddd;
}

.conversation { padding: 20px; }
.messages { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.message { padding: 10px; border-radius: 8px; max-width: 70%; }
.me { background: #d1e7dd; align-self: flex-end; }
.other { background: #f8d7da; align-self: flex-start; }
.send-box { display: flex; gap: 10px; }
.send-box input { flex: 1; padding: 8px; }

.btn-delete {
  background: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 15px;
}
.btn-delete:hover {
  background: #b02a37;
}

.btn-send {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-send:hover {
  background: #0056b3;
}


</style>
