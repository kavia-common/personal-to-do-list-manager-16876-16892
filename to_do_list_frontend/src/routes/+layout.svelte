<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<main>
  <section class="container">
    {@render children()}
  </section>
</main>

<style>
  main {
    min-height: 100vh;
    display: block;
  }
</style>
