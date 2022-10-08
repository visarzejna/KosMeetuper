<template>
  <div class="center">
    <!-- <div class="columns is-8 is-variable"> -->
      <table class="table messages-table">
        <thead>
          <tr>
            <th scope="col">Questions</th>
            <th scope="col">Answers</th>
            <th scope="col">Created</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="faq in faqs" :key="faq._id">
            <td>
              <b>{{ faq.question }}</b>
            </td>
            <td>{{ faq.response }}</td>
            <td>{{ faq.createdAt | fromNow }}</td>
            <td>
              <a
                @click.prevent="deleteQuestion(faq._id)"
                class="button is-danger"
                >Delete</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    <!-- </div> -->
    <form class="column is-one-third has-text-left">
      <div class="field">
        <label class="label">Question</label>
        <div class="control">
          <textarea
            v-model="form.question"
            class="textarea is-medium"
          ></textarea>
          <div v-if="$v.form.question.$error" class="form-error">
            <span v-if="!$v.form.question.required" class="help is-danger"
              >Question is required</span
            >
          </div>
        </div>
      </div>
      <div class="field">
        <label class="label">Answer</label>
        <div class="control">
          <textarea
            v-model="form.response"
            class="textarea is-medium"
            placeholder="Write your asnwer"
          ></textarea>
          <div v-if="$v.form.response.$error" class="form-error">
            <span v-if="!$v.form.response.required" class="help is-danger"
              >Answer is required</span
            >
          </div>
        </div>
      </div>
      <div class="control">
        <button
          type="button"
          @click="addQuestion"
          class="button is-link is-fullwidth has-text-weight-medium is-medium"
        >
          Add question
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { mapActions } from "vuex";
export default {
  props: {
    faqs: [],
  },
  data() {
    return {
      form: {
        question: null,
        response: null,
      },
      faqArray: this.faqs
    };
  },
  validations: {
    form: {
      question: {
        required,
      },
      response: {
        required,
      },
    },
  },
  methods: {
    ...mapActions("faq", ["createQuestion"]),
    addQuestion() {
      this.$v.form.$touch();
      this.createQuestion(this.form)
        .then(() => {
            this.form.question = ""
            this.form.response = ""
             this.$store
          .dispatch("faq/fetchQuestions")
          .then((faqs) => (this.faqsArray = faqs));
          this.$emit('updatedFaqs', this.faqArray);
          this.$toasted.success("FAQ Added Succesfully!", {
          duration: 3000,
        });
        })
        .catch((errorMessage) => {
          console.log(errorMessage.message)
            this.$toasted.error("Make sure all fields are filled" , {
              duration: 5000
            })
            })
    },
    deleteQuestion(qId) {
      this.$store.dispatch("faq/deleteQuestion", qId).then(() => {
        this.$store
          .dispatch("faq/fetchQuestions")
          .then((faqs) => (this.faqArray = faqs));
          this.$emit('updatedFaqs', this.faqArray)
        this.$toasted.success("Question Deleted Succesfully!", {
          duration: 3000,
        });
      });
    },
  },
};
</script>

<style scoped>
.center {
  display: flex;
  justify-content: space-between;
}
form {
  /* border: 1px solid rgb(147, 147, 147); */
  box-shadow: 0px 1px 6px #111;
  padding: 20px;
}
th,
tr {
  width: 200px;
}
@media only screen and (max-width: 1000px) {
    .center {
  display: flex;
  flex-direction:column ;
  align-items: center;

}
}

</style>
