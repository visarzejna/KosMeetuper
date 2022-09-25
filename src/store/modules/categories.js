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
    fetchCategories({ state, commit }) {
      axios.get("/api/v1/categories").then((res) => {
        const categories = res.data;
        commit(
          "setItems",
          { resource: "categories", items: categories },
          { root: true }
        );
        return state.items;
      });
    },
    createCategory({ rootState }, categoryToCreate) {
      const user = rootState.auth.user;
  
      if (user.role === "admin") {
        return axiosInstance
          .post("/api/v1/categories", categoryToCreate)
          .then((res) => res.data)
          .catch(err => rejectError(err));
      }
    },
    deleteCategory({ rootState }, categoryId) {
      const user = rootState.auth.user;
      if (user.role === "admin") {
        return axiosInstance
          .delete(`/api/v1/categories/${categoryId}`)
          .then((res) => {
            const categoryId = res.data;
            return categoryId;
          });
      }
    },
  },
 
  mutations: {},
};
