<template>
  <div class="columns">
    <div class="container profile">
      <div class="section profile-heading">
        <div class="columns is-mobile is-multiline">
          <div class="column is-2"></div>
          <div
            @click="activeTab = 'meetups'"
            :class="{ isActive: activeTab === 'meetups' }"
            class="stats-tab column is-2-tablet is-4-mobile has-text-centered"
          >
            <p class="stat-val">{{ meetups.length }}</p>
            <p class="stat-key">Meetups</p>
          </div>
          <div
            @click="activeTab = 'members'"
            :class="{ isActive: activeTab === 'members' }"
            class="stats-tab column is-2-tablet is-4-mobile has-text-centered"
          >
            <p class="stat-val">{{ registeredMembers.length }}</p>
            <p class="stat-key">Members</p>
          </div>
          <div
            @click="activeTab = 'messages'"
            :class="{ isActive: activeTab === 'messages' }"
            class="stats-tab column is-2-tablet is-4-mobile has-text-centered"
          >
            <p class="stat-val">{{ messages.length }}</p>
            <p class="stat-key">Messages</p>
          </div>
          <div
            @click="activeTab = 'faq'"
            :class="{ isActive: activeTab === 'faq' }"
            class="stats-tab column is-2-tablet is-4-mobile has-text-centered"
          >
            <p class="stat-val">{{ faq.length }}</p>
            <p class="stat-key">FAQ</p>
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
              <div class="card is-hoverable">
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
                    <p>Created at: {{ meetup.createdAt | formatDate }}</p>
                  </div>
                </div>
                <footer class="card-footer">
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
      <div class="columns is-centered">
        <paginate
          v-if="activeTab === 'meetups'"
          v-model="pagination.pageNum"
          :page-count="pagination.pageCount"
          :click-handler="fetchPaginatedMeetups"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'paginationContainer'"
          class="is-centered"
        >
        </paginate>
      </div>
      <div v-if="activeTab === 'members'" class="center">
        <table class="table is-striped">
          <thead>
            <tr>
              <th scope="col">Avatar</th>
              <th scope="col">Name</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Created At</th>
              <th scope="col">Joined Meetups</th>
              <th scope="col">Role</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              :key="registeredMember._id"
              v-for="registeredMember in registeredMembers"
            >
              <th scope="row">
                <img
                  class="is-rounded"
                  :src="registeredMember.avatar"
                  style="width: 80px"
                />
              </th>
              <th>{{ registeredMember.name }}</th>
              <td>{{ registeredMember.username }}</td>
              <td>{{ registeredMember.email }}</td>
              <td>{{ registeredMember.createdAt | formatDate }}</td>
              <td>{{ registeredMember.joinedMeetups.length }}</td>
              <td>{{ registeredMember.role }}</td>
              <td>
                <a
                  @click.prevent="
                    ($event) =>
                      showDeleteUserWarning($event, registeredMember._id)
                  "
                  class="button is-danger"
                  >Delete</a
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="activeTab === 'messages'">
        <FeedbackMessages :messages="messages"/>
      </div>
      <div v-if="activeTab === 'faq'">
        <CreateFAQ :faqs="faq"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import pageLoader from "@/mixins/pageLoader";
import FeedbackMessages from "../components/AdminComponents/FeedbackMessages.vue"
import CreateFAQ from "../components/AdminComponents/CreateFAQ.vue"
export default {
  components: {
    FeedbackMessages,
    CreateFAQ
  },
  data() {
    return {
      activeTab: "members",
      registeredMembers: [],
      // meetups: [],
    };
  },
  mixins: [pageLoader],
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      meetups: (state) => state.meetups.items,
      messages: (state) => state.feedback.items,
      faq: (state) => state.faq.items,
      pagination: (state) => state.meetups.pagination,
    }),
  },
  created() {
    if (this.user.role === "user") {
      this.$router.push("../");
    }
    this.$store
      .dispatch("auth/getUsers")
      .then((allMembers) => (this.registeredMembers = allMembers));
    this.$store.dispatch("feedback/fetchFeedbackMessages");
    this.$store.dispatch("faq/fetchQuestions");

    const { pageSize, pageNum } = this.$route.query;

    if (pageSize && pageNum) {
      this.initializePagesFromQuery({ pageSize, pageNum });
    }

    Promise.all([this.handleFetchMeetups({}), this.fetchCategories()])
      .then(() => this.pageLoader_resolveData())
      .catch((err) => {
        console.error(err);
        this.pageLoader_resolveData();
      });
  },
  methods: {
    showDeleteMeetupWarning(e, meetupId) {
      e.stopPropagation();
      const isConfirm = confirm(
        "Are you sure you want to delete this meetup???"
      );

      if (isConfirm) {
        this.$store
          .dispatch("meetups/deleteMeetup", meetupId)
          .then(() => {
            Promise.all([this.handleFetchMeetups({}), this.fetchCategories()])
              .then(() => this.pageLoader_resolveData())
              .catch((err) => {
                console.error(err);
                this.pageLoader_resolveData();
              });

            this.$toasted.success("Meetup Deleted Succesfully!", {
              duration: 3000,
            });
          })
          .catch((err) => console.log(err.message));
      }
    },
    showDeleteUserWarning(e, userId) {
      e.stopPropagation();
      const isConfirm = confirm("Are you sure you want to delete this User???");

      if (isConfirm) {
        this.$store
          .dispatch("auth/deleteUser", userId)
          .then(() => {
            this.$store
              .dispatch("auth/getUsers")
              .then((allMembers) => (this.registeredMembers = allMembers));
            this.$toasted.success("User Deleted Succesfully!", {
              duration: 3000,
            });
          })
          .catch((err) => console.log(err));
      }
    },
    ...mapActions("meetups", ["fetchMeetups", "initializePagesFromQuery"]),
    ...mapActions("categories", ["fetchCategories"]),
    handleFetchMeetups({ reset }) {
      const filter = {};
      filter["pageSize"] = this.pagination.pageSize;
      filter["pageNum"] = this.pagination.pageNum;

      return this.fetchMeetups({ filter, reset }).then((_) =>
        this.setQueryPaginationParams()
      );
    },
    fetchPaginatedMeetups(page) {
      this.setPage(page);
      this.handleFetchMeetups({ reset: false });
    },
    setPage(page) {
      this.$store.commit("meetups/setPage", page);
    },
    setQueryPaginationParams() {
      const { pageSize, pageNum } = this.pagination;
      this.$router.push({ query: { pageNum, pageSize } });
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
.table {
  border: 1px grey solid;
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
table{
  width: 100%;
}
</style>
