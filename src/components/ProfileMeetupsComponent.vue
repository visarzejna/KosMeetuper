<template>
  <div v-if="meetups.length > 0" class="container">
    <div 
      v-for="meetup in meetups"
      :key="meetup._id"
      class="column is-3-tablet is-6-mobile"
    >
      <!-- MEETUPS -->
      <router-link
        :to="{ name: 'PageMeetupDetail', params: { id: meetup._id } }"
      >
        <div class="card">
          <div class="card-image">
            <figure class="image is-4by3">
              <img :src="meetup.image" />
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4">{{ meetup.title }}</p>
              </div>
            </div>
            <div class="content">
              <p>
                {{ meetup.shortInfo }}
              </p>
            </div>
          </div>
          <footer class="card-footer"></footer>
        </div>
      </router-link>
      <br />
    </div>
  </div>
  <div v-else><h1>No joined meetups Currently</h1></div>
</template>

<script>
export default {
  props: {
    meetups: [],
  },
};
</script>

<style scoped>
.container {
  display: flex;
}
</style>
