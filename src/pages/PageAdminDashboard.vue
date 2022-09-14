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
        <table class="table is-striped ">
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
              <th scope="row"><img class="is-rounded" :src="registeredMember.avatar"  style="width: 80px" /></th>
              <th >{{ registeredMember.name }}</th>
              <td>{{ registeredMember.username }}</td>
              <td>{{ registeredMember.email }}</td>
              <td>{{ registeredMember.createdAt | formatDate }}</td>
              <td>{{ registeredMember.joinedMeetups.length }}</td>
              <td>{{ registeredMember.role }}</td>
              <td>
             
                <router-link to="/"
                  class="button is-danger"
                  >Delete</router-link
                >  
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import pageLoader from "@/mixins/pageLoader";
export default {
  data() {
    return {
      activeTab: "members",
      registeredMembers: [],
    };
  },
  mixins: [pageLoader],
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      meetups: (state) => state.meetups.items,
  
      pagination: (state) => state.meetups.pagination,
      // registeredMembers: (state) => state.auth.registeredUsers
    }),
  },
  created() {
    if (this.user.role === "user") {
      this.$router.push("../");
    }
    this.$store
      .dispatch("auth/getUsers")
      .then((allMembers) => (this.registeredMembers = allMembers));
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
    
    // console.log("The meetups: " + this.meetups);
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
          .then((id) => {
            this.$store.dispatch("stats/updateStats", id);
            this.$toasted.success("Meetup Deleted Succesfully!", {
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
      -webkit-box-shadow: 2px 4px 15px -2px rgba(189,189,189,1);
      -moz-box-shadow: 2px 4px 15px -2px rgba(189,189,189,1);
      box-shadow: 2px 4px 15px -2px rgba(189,189,189,1);
    }
    }
.stats-error {
  font-size: 40px;
  font-weight: bold;
  margin-top: 30px;
}
.table{
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
</style>
