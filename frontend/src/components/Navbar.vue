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
            to="/offres"
            class="btn btn-outline-light fw-semibold px-4"
        >
          Offre
        </router-link>

        <router-link
            to="/demandes"
            class="btn btn-light fw-semibold px-4"
        >
          Demande
        </router-link>
      </div>


      <div class="dropdown ms-auto">
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
function logout() {
  // Tu mets ici ton appel API ou ton clear token
  console.log("Déconnexion…")
}
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
