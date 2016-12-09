<template>
  <div class="sf-alert">
    <p>alert</p>
    <p v-on:click="doClick">close</p>
  </div>
</template>
<script>
export default {
  data () {
    return {};
  },
  methods: {
    doClick: function () {
      this.$emit("close");
    }
  }
}
</script>
