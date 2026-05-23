<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
    <div class="container-fluid">


      <div class="d-flex gap-3">
        <router-link
            v-if="currentUser"
            to="/dashboard"
        >
          <img id="logoapp" src="../assets/cnamlogo.png" alt="logo">
        </router-link>


      </div>


      <div v-if="currentUser" class="d-flex gap-3 ms-auto align-items-center">
        <div class="dropdown">
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
              <router-link class="dropdown-item" to="/my-ads">
                Mes annonces
              </router-link>
            </li>
            <li>
              <router-link class="dropdown-item" to="/favorites">
                Mes favoris
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

.btn-dark:hover {
  background: #2d2d2d;
}

.badge {
  font-size: 0.7rem;
  min-width: 20px;
  height: 20px;
  padding: 2px 5px;
}
</style>
