<template>
  <div class="center">
    <!-- <div class="columns is-8 is-variable"> -->
      <table class="table messages-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Image</th>
            <th scope="col">Created</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category._id">
            <td>
              <b>{{ category.name }}</b>
            </td>
            <td scope="row">
              <img
                class="is-rounded"
                :src="category.image"
                style="width: 80px"
              />
            </td>
            <td>{{ category.createdAt | formatDate }}</td>
            <td>
              <a
                @click.prevent="deleteCategory(category._id)"
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
        <label class="label">Name</label>
        <div class="control">
          <input
            v-model="form.name"
            @blur="$v.form.name.$touch()"
            class="input is-medium"
          />
          <div v-if="$v.form.name.$error" class="form-error">
            <span v-if="!$v.form.name.required" class="help is-danger"
              >Name is required</span
            >
          </div>
        </div>
      </div>
      <div class="field">
        <label class="label">Image link</label>
        <div class="control">
          <input
            v-model="form.image"
            @blur="$v.form.image.$touch()"
            class="input is-medium"
            placeholder="Image URL"
          />
          <div v-if="$v.form.image.$error" class="form-error">
            <span v-if="!$v.form.name.url" class="help is-danger"
              >Url format is not valid!</span
            >
            <span v-if="!$v.form.name.supportedFileType" class="help is-danger"
              >Selected file type is not valid!</span
            >
          </div>
        </div>
      </div>
      <div class="control">
        <button
          type="button"
          @click.prevent="addCategory"
          class="button is-link is-fullwidth has-text-weight-medium is-medium"
        >
          Add Category
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { required, url } from "vuelidate/lib/validators";
import { supportedFileType } from "@/helpers/validators";
export default {
  props: {
    categories: [],
  },
  data() {
    return {
      form: {
        name: null,
        image: null,
      },
      updatedCategories: this.categories
    };
  },
  validations: {
    form: {
      name: {
        required,
      },
      image: {
        url,
        supportedFileType,
      },
    },
  },
  methods: {
    ...mapActions("categories", ["createCategory"]),
    addCategory() {
     this.$v.form.$touch()
        this.createCategory(this.form)
       .then(() => {
            this.form.name = null
            this.form.image = null
             this.$store
          .dispatch("categories/fetchCategories")
          .then((categories) => (this.updatedCategories = categories));
          this.$emit('updatedCategories', this.updatedCategories);
          this.$toasted.success("Category Added Succesfully!", {
          duration: 3000,
        });
        })
        .catch((errorMessage) => {
            this.$toasted.error(errorMessage , {
              duration: 5000
            })
            })
    },
    deleteCategory(cId) {
      this.$store.dispatch("categories/deleteCategory", cId).then(() => {
        this.$store
          .dispatch("categories/fetchCategories")
          .then((categories) => (this.updatedCategories = categories));
          this.$emit('updatedCategories', this.updatedCategories);
        this.$toasted.success("Category Deleted Succesfully!", {
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
  height: 300px;
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
