<template>
  <section class="landing">
    <video autoplay muted loop playsinline class="bg-video">
      <source src="@/assets/intro.mp4" type="video/mp4" />
    </video>

    <div class="overlay"></div>

    <div class="content">
      <h1>ServiceBoard</h1>
      <p class="subtitle">Trouvez, proposez et gérez vos services en toute simplicité.</p>

      <div class="actions">
        <router-link to="/login" class="btn primary">Se connecter</router-link>
        <router-link to="/register" class="btn secondary">S'inscrire</router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
:global(html, body) {
  margin: 0;
  padding: 0;
  width: 100%;
  height: auto;
  overflow-x: hidden;
}

.landing {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.bg-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 1;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
  z-index: 2;
}

.content {
  position: relative;
  z-index: 3;
  text-align: center;
  color: white;
  max-width: 600px;
  padding: 20px;
  animation: fadeIn 1s ease-out;

  margin: 0 auto;
  margin-top: 120px;
}


h1 {
  font-size: 3.2rem;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.3rem;
  margin-bottom: 40px;
  opacity: 0.9;
}

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.btn {
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
  transition: 0.25s;
}

.primary {
  background: #2ecc71;
  color: white;
}

.secondary {
  border: 2px solid #2ecc71;
  color: #2ecc71;
}

.primary:hover {
  background: #27ae60;
}

.secondary:hover {
  background: #2ecc71;
  color: white;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
