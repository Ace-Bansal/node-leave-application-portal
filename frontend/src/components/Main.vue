<template>
  <div class="main">
    <Header />
    <Apply/>
  </div>
</template>

<script>
import Apply from "../components/Apply"
import Header from "../components/Header"

export default {
  name: 'Main',
  components: {
    Apply,
    Header
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
