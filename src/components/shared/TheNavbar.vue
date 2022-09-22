<template>
  <nav class="navbar is-spaced" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link :to="'/'" class="navbar-item" href="https://bulma.io">
        <h1 class="title is-4">KosMeetuper</h1>
      </router-link>
      <a
        @click="openBurger"
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div
      id="navbarBasicExample"
      :class="['navbar-menu', 'is-mobile', { 'is-active': isOpen }]"
    >
      <div class="navbar-start">
        <router-link :to="'/'" class="navbar-item"> Home </router-link>

        <router-link :to="{ name: 'PageMeetupFind' }" class="navbar-item">
          Find
        </router-link>
        <router-link :to="{ name: 'PageContactUs' }" class="navbar-item">
          Contact Us
        </router-link>

        <div
          :class="[
            'navbar-item',
            'has-dropdown',
            'is-hoverable',
            'is-mobile',
            { 'is-active': isMoreOpen },
          ]"
        >
          <a @click="openMore" class="navbar-link"> More </a>

          <div class="navbar-dropdown">
            <router-link :to="{ name: 'PageAboutUs'}" class="navbar-item"> About </router-link>
            <router-link :to="{ name: 'PageFAQ'}" class="navbar-item"> FAQ </router-link>
            <hr class="navbar-divider" />
            <router-link :to="{ name: 'PageContactUs' }" class="navbar-item">
          Report an issue
        </router-link>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div v-if="user">
            Welcome <b>{{ user.username }}</b>
          </div>
        </div>
        <div v-if="user" class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link"> Account </a>
          <div class="navbar-dropdown">
            <router-link
              :to="{ name: 'PageProfile' }"
              href="#"
              class="navbar-item"
            >
              Profile
            </router-link>
            <hr v-if="user.role === 'admin'" class="navbar-divider" />
            <router-link
              v-if="user.role === 'admin'"
              :to="{ name: 'PageAdminDashboard' }"
              href="#"
              class="navbar-item"
            >
              Dashboard
            </router-link>
            <hr class="navbar-divider" />
            <a @click.prevent="logout" class="navbar-item">Logout</a>
          </div>
        </div>
        <div v-else class="navbar-item has-dropdown">
          <div class="buttons">
            <router-link
              :to="{ name: 'PageRegister' }"
              class="button is-primary"
            >
              <strong>Sign up</strong>
            </router-link>
            <router-link :to="{ name: 'PageLogin' }" class="button is-light">
              Log in
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
export default {

  data() {
    return {
      isOpen: false,
      isMoreOpen: false,
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/authUser",
    }),
  },
  methods: {

    logout() {
      this.$store.dispatch("auth/logout").then(() => {
        this.$router.push("/");
      });
    },
    
    openBurger() {
      this.isOpen = !this.isOpen;
    },
    openMore() {
      this.isMoreOpen = !this.isMoreOpen;
    },
  },
};
</script>

<style scoped>
.navbar{
  background-color: rgb(240, 240, 240);
}
</style>
