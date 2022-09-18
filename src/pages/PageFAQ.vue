<template>
  <div class="container" style="margin:30px ">
    <div><h1>Frequently Asked Questions (FAQ)</h1></div>
    <div v-if="faqs.length === 0"><h1>No Asked Questions</h1></div>

    <details v-else v-for="faq in faqs" :key="faq.id">
      <summary>{{ faq.question | capitalize }}</summary>
      <div className="answer">
        <p>- {{ faq.response | capitalize}}</p>
      </div>
    </details>

    <div className="center-button">
      <Link className="redirect-button" to="/contactUs">Contact</Link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
     ...mapState({
        faqs: (state) => state.faq.items,
    })
    
  },
  created() {
   

    this.$store.dispatch("faq/fetchQuestions");
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap");
h1 {
  color: black;
  text-align: center;
  font-family: "Noto Sans", sans-serif;
  font-size: 30px;
}
summary {
  font-size: 30px;
  font-weight: 600;
  font-family: "Noto Sans", sans-serif;
  background-color: #fff;
  color: #333;
  padding: 1rem;
  margin-bottom: 1rem;
  outline: none;
  border-radius: 0.25rem;
  text-align: left;
  cursor: pointer;
  position: relative;
  word-wrap: break-word;
  border-top: 1px solid gray;
}
details > summary::after {
  position: absolute;
  content: "+";
  right: 20px;
}
details[open] > summary::after {
  position: absolute;
  content: "-";
  right: 20px;
}
details > summary::-webkit-details-marker {
  display: none;
}
details[open] summary ~ * {
  animation: sweep 0.5s ease-in-out;
}
@keyframes sweep {
  0% {
    opacity: 0;
    margin-top: -10px;
  }
  100% {
    opacity: 1;
    margin-top: 0px;
  }
}
.answer {
      padding: 50px;
}
.answer p {
  font-size: 25px;
  word-wrap: break-word;
}
.redirect-button {
  text-decoration: none;
  width: 200px;
  height: 50px;
  padding: 10px 25px;
  border: 2px solid #000;
  font-family: "Lato", sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  text-align: center;
}
.redirect-button:hover {
  background: #000;
  color: #fff;
}
.center-button a {
  text-decoration: none;
  color: black;
}
.center-button {
  text-align: center;
}
@media screen and (max-width: 900px) {
  h1 {
    padding-top: 100px;
  }
}
</style>
