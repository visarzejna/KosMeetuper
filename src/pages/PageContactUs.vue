<template>
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Contact Form - Free Bulma template</title>
      <link
        rel="shortcut icon"
        href="../images/fav_icon.png"
        type="image/x-icon"
      />
      <!-- Bulma Version 0.9.0-->
      <link
        rel="stylesheet"
        href="https://unpkg.com/bulma@0.9.0/css/bulma.min.css"
      />
      <link
        href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
        integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN"
        crossorigin="anonymous"
      />
      <link rel="stylesheet" href="../css/contact.css" />
    </head>

    <body>
      <section class="hero is-fullheight">
        <div class="hero-body">
          <div class="container has-text-centered">
            <div class="columns is-8 is-variable">
              <div class="column is-two-thirds has-text-left">
                <h1 class="title is-1">Contact Us</h1>
                <p class="is-size-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla
                  eligendi soluta voluptate facere molestiae consequatur.
                </p>
                <div class="social-media">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    class="button is-light is-large"
                    ><i class="fa fa-facebook-square" aria-hidden="true"></i
                  ></a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    class="button is-light is-large"
                    ><i class="fa fa-instagram" aria-hidden="true"></i
                  ></a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    class="button is-light is-large"
                    ><i class="fa fa-twitter" aria-hidden="true"></i
                  ></a>
                </div>
              </div>
              <form class="column is-one-third has-text-left">
                <div class="field">
                  <label class="label">Name</label>
                  <div class="control">
                    <input
                      v-model="form.name"
                      @blur="$v.form.name.$touch()"
                      class="input is-medium"
                      type="text"
                    />
                    <div v-if="$v.form.name.$error" class="form-error">
                      <span v-if="!$v.form.name.required" class="help is-danger"
                        >Name is required</span
                      >
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label class="label">Email</label>
                  <div class="control">
                    <input
                      v-model="form.email"
                      @blur="$v.form.email.$touch()"
                      class="input is-medium"
                      type="text"
                    />
                    <div v-if="$v.form.email.$error" class="form-error">
                      <span
                        v-if="!$v.form.email.required"
                        class="help is-danger"
                        >Email is required</span
                      >
                      <span v-if="!$v.form.email.email" class="help is-danger"
                        >Email address is not valid</span
                      >
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label class="label">Message</label>
                  <div class="control">
                    <textarea
                      v-model="form.message"
                      @blur="$v.form.message.$touch()"
                      class="textarea is-medium"
                    ></textarea>
                    <div
                      v-if="$v.form.message.$error"
                      class="form-error"
                    >
                      <span
                        v-if="!$v.form.message.required"
                        class="help is-danger"
                        >Message is required</span
                      >
                    </div>
                  </div>
                </div>
                <div class="control">
                  <button
                    type="button"
                    @click="sendMessage"
                    class="button is-link is-fullwidth has-text-weight-medium is-medium"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </body>
  </html>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      form: {
        name: null,
        email: null,
        message: null,
      },
    };
  },
  validations: {
    form: {
      name: {
        required,
      },
      email: {
        required,
        email,
      },
      message: {
        required,
      },
    },
  },
  methods: {
    ...mapActions("feedback", ["createFeedbackMessage"]),
    sendMessage() {
      this.$v.form.$touch();
      this.createFeedbackMessage(this.form)
        .then(() => {
          this.form.name = null;
          this.form.email = null;
          this.form.message = null;
          this.$toasted.success("Message Sent Succesfully!", {
            duration: 3000,
          });
        })
        .catch((errorMessage) => {
          this.$toasted.error("Make sure you didn't miss any required field", {
            duration: 5000,
          });
        });
    },
  },
};
</script>

<style></style>
