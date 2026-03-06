<template>
  <footer class="footer">
    <div class="footer-content">
      <p><b>Craiglist projet cnam</b></p>
      <p>Kallee Shradha - Rakotondrabe Philippe</p>
    </div>
  </footer>
</template>
<script>
export default {
  name: "FooterComponent",
};
</script>
<style scoped>
footer {
  background-color: #343434;
  color: white;
  text-align: center;
  padding: 20px;
}
footer-content a {
  color: #f0f8ff;
  text-decoration: none;
  margin: 0 10px;
}
footer-content a:hover {
  text-decoration: underline;
}
</style>