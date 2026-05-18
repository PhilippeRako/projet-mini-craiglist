<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
    <div class="container-fluid">


      <div class="d-flex gap-3">
        <router-link
            to="/"
        >
          <img id="logoapp" src="../assets/cnamlogo.png" alt="logo">
        </router-link>
        <router-link
            v-if="currentUser"
            to="/offres"
            class="btn btn-outline-light fw-semibold px-4"
        >
          Offre
        </router-link>

        <router-link
            v-if="currentUser"
            to="/demandes"
            class="btn btn-light fw-semibold px-4"
        >
          Demande
        </router-link>

      </div>


      <div v-if="currentUser" class="dropdown ms-auto">

      <button
            class="btn btn-dark border-0 dropdown-toggle d-flex align-items-center"
            type="button"
            data-bs-toggle="dropdown"
        >
          <i class="bi bi-person-circle fs-3"></i>
        </button>

        <ul class="dropdown-menu dropdown-menu-end shadow">
          <li>
            <router-link class="dropdown-item" to="/profil">
              Voir mon profil
            </router-link>
          </li>

          <li>
            <router-link class="dropdown-item" to="/profil/edit">
              Modifier mon profil
            </router-link>
          </li>

          <li><hr class="dropdown-divider" /></li>

          <li>
            <button class="dropdown-item text-danger" @click="logout">
              Se déconnecter
            </button>
          </li>
        </ul>

      </div>

    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import router from "../router";

const currentUser = ref(null);

const fetchCurrentUser = async () => {
  try {
    const res = await fetch("http://localhost:3001/api/auth/me", {
      credentials: "include"
    });
    if (res.ok) {
      currentUser.value = (await res.json()).user;
    } else {
      currentUser.value = null;
    }
  } catch (e) {
    currentUser.value = null;
  }
};

const logout = async () => {
  try {
    const res = await fetch("http://localhost:3001/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });

    if (res.ok) {
      currentUser.value = null;
      router.push("/login");
    }
  } catch (e) {
    console.error("Erreur logout", e);
  }
};

onMounted(() => {
  fetchCurrentUser();
  window.addEventListener("login-success", fetchCurrentUser);
});

onUnmounted(() => {
  window.removeEventListener("login-success", fetchCurrentUser);
});
</script>


<style scoped>

#logoapp {
  width: 15vmin;
}

.navbar {
  background: #1f1f1f;
}

.btn-light {
  background: #ffffff;
  color: #000;
}

.btn-outline-light:hover {
  background: #ffffff;
  color: #000;
}

.dropdown-menu {
  border-radius: 8px;
}
</style>
