<template>
    <div class="messages">
      <table class="table messages-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Message</th>
            <th scope="col">Created</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="message in messages" :key="message.id">
            <td><b>{{ message.name }}</b></td>
            <td>{{ message.email }}</td>
            <td class="breakLine" style="width:200px">{{ message.messageDescription }}</td>
            <td class="breakLine" style="width:200px">{{ message.createdAt | fromNow }}</td>
            <td>
              <a
                  @click.prevent="deleteMessage(message.id)"
                  class="button is-danger"
                  >Delete</a
                >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</template>

<script>
export default {
    props: {
        messages: []
    },
    methods: {
        deleteMessage(messageId){
            this.$store.dispatch('feedback/deleteMessage', messageId)
                .then(() => {
                     this.$store
              .dispatch("feedback/fetchFeedbackMessages")
              .then((messages) => (this.messages = messages));
            this.$toasted.success("Message Deleted Succesfully!", {
              duration: 3000,
            });
                })
        }
    }
};
</script>

<style scoped> 
    .messages {
  box-shadow: 0px 1px 6px #aaaaaa;
  border-radius: 5px;
  margin-top: 20px;
  background-color: #f8f9fa;
  padding: 15px;
}
table {
width:100%;
table-layout:fixed;
border: 1px solid #aaaaaa;
}
td {
word-wrap:break-word;
}
</style>
