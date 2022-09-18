import axiosInstance from "@/services/axios";

export default {
  namespaced: true,

  state: {
    items: [],
  },
  getters: {},
  actions: {
    fetchQuestions({ state, commit }) {
        axiosInstance.get("http://localhost:5000/api/v1/answer").then((res) => {
          const questions = res.data;
          commit(
            "setItems",
            { resource: "faq", items: questions },
            { root: true }
          );
          return state.items;
        });
    },
    createQuestion({rootState}, questionToCreate) {
      const user = rootState.auth.user;

      if (user.role === "admin") {
        return axiosInstance
          .post("http://localhost:5000/api/v1/answer", questionToCreate)
          .then((res) => res.data);
      }
    },
    deleteQuestion({rootState}, questionId) {
      const user = rootState.auth.user;
      if (user.role === "admin") {
        return axiosInstance
          .delete(`http://localhost:5000/api/v1/answer/${questionId}`)
          .then((res) => {
            const questionId = res.data;
            return questionId;
          });
      }
    },
  },
  mutations: {},
};
