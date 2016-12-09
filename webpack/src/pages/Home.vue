<template>
  <main-layout>
    <p>Welcome home</p>
    <markdown></markdown>
  </main-layout>
</template>

<script>
  import MainLayout from '../layouts/Main.vue'
  import Markdown from '../examples/test.md'


  export default {
    components: {
      MainLayout,
      Markdown,
    }
  }
</script>
