<template>
  <form @input="emitFormData">
    <div class="field">
      <label class="title m-b-sm">Choose Title</label>
      <input
        @blur="$v.form.title.$touch()"
        v-model="form.title"
        class="input"
        type="text"
        placeholder="Enter Title"
      />
      <div v-if="$v.form.title.$error">
        <span v-if="!$v.form.title.required" class="help is-danger"
          >Title is required</span
        >
      </div>
    </div>
    <div class="field">
      <label class="title m-b-sm">Start Date</label>
      <datepicker
        @input="setDate"
        :disabledDates="disabledDates"
        :input-class="'input'"
        :placeholder="new Date() | formatDate"
      ></datepicker>
      <div v-if="$v.form.startDate.$error">
        <span v-if="!$v.form.startDate.required" class="help is-danger"
          >Starts at is required</span
        >
      </div>
    </div>
    <div class="field">
      <label class="title m-b-sm">From</label>
      <vue-timepicker
        @change="changeTime($event, 'timeFrom')"
        :minute-interval="10"
      ></vue-timepicker>
    </div>
    <div class="field">
      <label class="title m-b-sm">To</label>
      <vue-timepicker
        @change="changeTime($event, 'timeTo')"
        :minute-interval="10"
      ></vue-timepicker>
    </div>
    <div class="field">
      <label class="title m-b-sm">Please Choose the Category.</label>
      <div class="m-b-lg">
        <div class="select">
          <select
            @blur="$v.form.category.$touch()"
            v-model="form.category"
            @change="emitFormData"
          >
            <option
              v-for="category of categories"
              :value="category"
              :key="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        <div v-if="$v.form.category.$error">
          <span v-if="!$v.form.category.required" class="help is-danger"
            >Category is required</span
          >
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import moment from "moment";
import Datepicker from "vuejs-datepicker";
export default {
  components: {
    Datepicker,
    VueTimepicker,
  },
  data() {
    return {
      disabledDates: {
        customPredictor: function (date) {
          const today = new Date();
          const yesterday = today.setDate(today.getDate() - 1);
          return date < yesterday;
        },
      },
      form: {
        title: null,
        startDate: null,
        timeTo: null,
        timeFrom: null,
        category: null,
      },
    };
  },
  validations: {
    form: {
      title: { required },
      startDate: { required },
      category: { required },
      timeTo: { required },
      timeFrom: { required },
    },
  },
  computed: {
    categories() {
      return this.$store.state.categories.items;
    },
  },
  methods: {
    emitFormData() {
      this.$emit("stepUpdated", {
        data: this.form,
        isValid: !this.$v.$invalid,
      });
    },
    setDate(date) {
      this.form.startDate = moment(date).format();
      this.emitFormData();
    },
    changeTime({ data }, field) {
      const minutes = data.mm || '00' 
      const hours = data.HH || '00'
      this.form[field] = hours + ":" + minutes;
      this.emitFormData();
    },
  },
};
</script>

<style scoped>
.time-picker {
  display: block;
}
</style>
