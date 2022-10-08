import axiosInstance from "@/services/axios";
import axios from "axios";
import { rejectError } from '../../helpers/index'

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
        axiosInstance.get("/api/v1/feedback").then((res) => {
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
        .post("/api/v1/feedback/", messageToCreate)
        .then((res) => res.data)
        .catch(err => rejectError(err));
    },
    deleteMessage({rootState}, messageId) {
      const user = rootState.auth.user;
      if (user.role === "admin") {
        return axiosInstance
          .delete(`/api/v1/feedback/${messageId}`)
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
