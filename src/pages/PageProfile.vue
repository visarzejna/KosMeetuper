<template>
  <div class="columns">
    <div class="container profile">
      <div class="section profile-heading">
        <div class="columns is-mobile is-multiline">
          <div class="column is-2">
            <figure class="image header-icon user-profile-image">
              <img class="is-rounded" :src="user.avatar" />
            </figure>
          </div>
          <div class="column is-4-tablet is-10-mobile name">
            <p>
              <span class="title is-bold">{{ user.name }}</span>
              <br />
              <UserUpdateModal :authUser="user" @userSubmitted="updateUser" />
              <br />
            </p>
            <p class="tagline">
              {{ user.info }}
            </p>
            <p class="secondary-text">
              Created on: {{ user.createdAt | formatDate }}
            </p>
          </div>
          <div
            @click="activeTab = 'meetups'"
            :class="{ isActive: activeTab === 'meetups' }"
            class="stats-tab column is-2-tablet is-4-mobile has-text-centered"
          >
            <p class="stat-val">{{ meetupsCount }}</p>
            <p class="stat-key">Meetups</p>
          </div>

          <div
            @click="activeTab = 'threads'"
            :class="{ isActive: activeTab === 'threads' }"
            class="stats-tab column is-2-tablet is-4-mobile has-text-centered"
          >
            <p class="stat-val">{{ threadsCount }}</p>
            <p class="stat-key">Threads</p>
          </div>

          <div
            @click="activeTab = 'posts'"
            :class="{ isActive: activeTab === 'posts' }"
            class="stats-tab column is-2-tablet is-4-mobile has-text-centered"
          >
            <p class="stat-val">{{ postsCount }}</p>
            <p class="stat-key">Posts</p>
          </div>
          <div
            @click="activeTab = 'joinedMeetups'"
            :class="{ isActive: activeTab === 'joinedMeetups' }"
            class="stats-tab column is-2-tablet is-4-mobile has-text-centered"
          >
            <p class="stat-val">{{ joinedMeetups.length }}</p>
            <p class="stat-key">Going to</p>
          </div>
        </div>
      </div>
      <div
        v-if="activeTab === 'meetups'"
        class="columns is-mobile is-multiline"
      >
        <template v-if="meetups && meetups.length > 0">
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
                      <p class="subtitle is-6">
                        <span class="tag is-dark subtitle">{{
                          meetup.category.name | capitalize
                        }}</span>
                      </p>
                    </div>
                  </div>
                  <div class="content">
                    <p>
                      {{ meetup.shortInfo }}
                    </p>
                  </div>
                </div>
                <footer class="card-footer">
                  <router-link
                    :to="{
                      name: 'PageMeetupEdit',
                      params: { meetupId: meetup._id },
                    }"
                    class="card-footer-item"
                    >Edit</router-link
                  >
                  <a
                    @click.prevent="
                      ($event) => showDeleteMeetupWarning($event, meetup._id)
                    "
                    class="card-footer-item delete-item"
                    >Delete</a
                  >
                </footer>
              </div>
            </router-link>
            <br />
          </div>
        </template>
        <div v-else class="stats-error">No meetups currently created</div>
      </div>
      <div
        v-if="activeTab === 'threads'"
        class="columns is-mobile is-multiline"
      >
        <template v-if="threads && threads.length > 0">
          <div
            v-for="thread in threads"
            :key="thread._id"
            class="column is-3-tablet is-6-mobile"
          >
            <!-- THREADS -->
            <div class="card">
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <p class="title is-4">{{ thread.title }}</p>
                  </div>
                </div>
              </div>
              <footer class="card-footer">
                <a @click="deleteThread(thread._id)" class="card-footer-item"
                  >Delete</a
                >
              </footer>
            </div>
            <br />
          </div>
        </template>
        <div v-else class="stats-error">No Threads currently created</div>
      </div>
      <div v-if="activeTab === 'posts'" class="columns is-mobile is-multiline">
        <template v-if="posts && posts.length > 0">
          <div
            v-for="post in posts"
            :key="post._id"
            class="column is-3-tablet is-6-mobile"
          >
            <!-- POSTS -->
            <div class="card">
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <p class="title is-4">{{ post.text }}</p>
                  </div>
                </div>
              </div>
              <footer class="card-footer">
                <a @click="deletePost(post._id)" class="card-footer-item"
                  >Delete</a
                >
              </footer>
            </div>
            <br />
          </div>
        </template>
        <div v-else class="stats-error">No posts currently created</div>
      </div>
      <div
        v-if="activeTab === 'joinedMeetups'"
        class="columns is-mobile is-multiline"
      >
        <template>
          <MeetupsComponent :meetups="joinedMeetups" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import UserUpdateModal from "@/components/UserUpdateModal";
import MeetupsComponent from "@/components/ProfileMeetupsComponent";
import { mapState } from "vuex";
export default {
  components: {
    UserUpdateModal,
    MeetupsComponent,
  },
  data() {
    return {
      activeTab: "meetups",
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      meetups: (state) => state.stats.meetups.data,
      threads: (state) => state.stats.threads.data,
      posts: (state) => state.stats.posts.data,
      joinedMeetups: (state) => state.stats.joinedMeetups,
      meetupsCount: (state) => state.stats.meetups.count,
      threadsCount: (state) => state.stats.threads.count,
      postsCount: (state) => state.stats.posts.count,
    }),
  },
  created() {
    this.$store
      .dispatch("stats/fetchUserStats")
      .then((stats) => console.log(stats));
    this.$store.dispatch("stats/fetchUserJoinedMeetups");
  },
  methods: {
    updateUser({ user, done }) {
      this.$store
        .dispatch("auth/updateUser", user)
        .then(() => {
          this.$toasted.success("Profile Successfuly Updated", {
            duration: 3000,
          });
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
    },

    showDeleteMeetupWarning(e, meetupId) {
      e.stopPropagation();
      const isConfirm = confirm(
        "Are you sure you want to delete this meetup???"
      );

      if (isConfirm) {
        this.$store
          .dispatch("meetups/deleteMeetup", meetupId)
          .then((id) => {
            this.$store.dispatch("stats/updateStats", id);
            this.$toasted.success("Meetup Deleted Succesfully!", {
              duration: 3000,
            });
          })
          .catch((err) => console.log(err));
      }
    },
    deleteThread(tId) {
      this.$store.dispatch("threads/deleteThread", tId).then((threadId) => {
        this.$store.dispatch("stats/fetchUserStats");

        this.$toasted.success("Thread Deleted Succesfully!", {
          duration: 3000,
        });
      });
    },
    deletePost(postId) {
      this.$store.dispatch("threads/deletePost", postId).then((id) => {
        //  this.$router.go(0)
        this.$store.dispatch("stats/fetchUserStats");

        this.$toasted.success("Thread Deleted Succesfully!", {
          duration: 3000,
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
body {
  background: #f5f7fa;
}
.is-hoverable {
  transition: 0.3s;

  &:hover {
    -webkit-box-shadow: 2px 4px 15px -2px rgba(189, 189, 189, 1);
    -moz-box-shadow: 2px 4px 15px -2px rgba(189, 189, 189, 1);
    box-shadow: 2px 4px 15px -2px rgba(189, 189, 189, 1);
  }
}
.stats-error {
  font-size: 40px;
  font-weight: bold;
  margin-top: 30px;
}

.delete-item {
  color: red;
}

.stats-tab {
  border-bottom: 2px solid transparent;
  transition: 0.5s;
}

.stats-tab:hover {
  cursor: pointer;
  border-bottom: 2px solid black;
}

.stats-tab.isActive {
  border-bottom: 2px solid black;
}

.stat-val {
  font-size: 3em;
  padding-top: 20px;
  font-weight: bold;
}

.stat-key {
  font-size: 1.4em;
  font-weight: 200;
}
.secondary-text {
  color: lightgray;
}
.section.profile-heading
  .column.is-2-tablet.has-text-centered
  + .has-text-centered {
  border-left: 1px dotted rgba(0, 0, 0, 0.2);
}

.container.profile {
  margin-top: 1%;
}

.control.is-pulled-left span.select {
  margin-right: 5px;
  border-radius: 2px;
}

.modal-card .content h1 {
  padding: 40px 10px 10px;
  border-bottom: 1px solid #dadada;
}

.container.profile .profile-options .tabs ul li.link a {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f1f1f1;
}
</style>
