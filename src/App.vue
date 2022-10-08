<template>
  <div v-if="isAuthResolved" id="app">
    <TheNavbar />
    <div class="page-wrapper">
      <router-view :key="$route.path" />
    </div>
    <TheFooter />
  </div>
</template>

<script>
import TheNavbar from "@/components/shared/TheNavbar";
import TheFooter from "@/components/shared/TheFooter";
export default {
  name: "app",
  components: {
    TheNavbar,
    TheFooter,
  },
  computed: {
    isAuthResolved() {
      return this.$store.state.auth.isAuthResolved;
    },
    isLocationResolved() {
      return this.$store.state.meta.isLocationResolved;
    },
  },
  created() {
    // this.$store.dispatch('auth/getAuthUser')
    this.$store.dispatch("meta/fetchMetaData");
  },
};
</script>

<style lang="scss">
@import "assets/css/spacing.css";
@import "~bulma/bulma.sass";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  // background-color: rgba(0, 0, 0, 0.2);
}

.page-wrapper {
  min-height: 55vh;
}

.bold {
  font-weight: bold;
}
.cover {
  background-size: cover;
  /*background-position: center;*/
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.hero {
  position: relative;
}
.hero-body {
  padding: 3rem 1.5rem;
}
.hero-bg {
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
    url("https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1600");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: bottom;
}
</style>
