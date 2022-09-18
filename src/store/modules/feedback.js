import axiosInstance from "@/services/axios";
import axios from "axios";

export default {
  namespaced: true,

  state: {
    items: [],
  },
  getters: {},
  actions: {
    fetchFeedbackMessages({ rootState, state, commit }) {
      const user = rootState.auth.user;

      if (user.role === "admin") {
        axiosInstance.get("http://localhost:5000/api/v1/feedback").then((res) => {
          const messages = res.data;
          commit(
            "setItems",
            { resource: "feedback", items: messages },
            { root: true }
          )
          return state.items;
        });
      }
    },
    createFeedbackMessage({state}, messageToCreate) {
      return axios
        .post("http://localhost:5000/api/v1/feedback", messageToCreate)
        .then((res) => res.data)
        .catch((errors) => {
            console.log(errors)
          });
    },
    deleteMessage({rootState}, messageId) {
      const user = rootState.auth.user;
      if (user.role === "admin") {
        return axiosInstance
          .delete(`http://localhost:5000/api/v1/feedback/${messageId}`)
          .then((res) => {
            const messageId = res.data;
            return messageId;
          })
          .catch((errors) => {
            console.log(errors)
          });
      }
    },
  },
  mutations: {},
};
