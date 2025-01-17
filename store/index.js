import axios from "axios";

export const state = () => ({
  /* 
    recipes: [
        {
            id: 1,
            recipeImage: "https://i.ibb.co/SBsMYNC/Rendang.jpg",
            recipeTitle: "Rendang",
            likes: 100,
            body: "Rendang Recipe",
        },
        {
            id: 2,
            recipeImage: "https://i.ibb.co/MRNhgzW/Tomyam.jpg",
            recipeTitle: "Tomyam",
            likes: 40,
            body: "Tomyam Recipe",
        },
        {
            id: 3,
            recipeImage: "https://i.ibb.co/CW4tVvp/Spaghetti-aglioo-o-lio.jpg",
            recipeTitle: "Spagethi Aglio Olio",
            likes: 200,
            body: "Spagethi Aglio Olio Recipe",
        },
        {
            id: 4,
            recipeImage: "https://i.ibb.co/z7zRVxV/Spaghetti-Carbonara.jpg",
            recipeTitle: "Spagethi Carbonara",
            likes: 200,
            body: "Spagethi Carbonara Recipe",
        },
        {
            id: 5,
            recipeImage: "https://i.ibb.co/Cn1XPNB/Kimchi.jpg",
            recipeTitle: "Kimchi",
            likes: 10,
            body: "Kimchi Recipe",
        },
    ],
*/
  recipes: [],
  token: null,
  userData: null,
});

export const getters = {
  recipeData(state) {
    return state.recipes;
  },

  lastIdRecipe(state) {
    let recipeLength = state.recipes.length;
    return state.recipes[recipeLength - 1].id;
  },

  detailRecipe: (state) => (id) => {
    return state.recipes.find((recipe) => recipe.id === id);
  },

  isAuthenticated(state) {
    return state.token != null;
  },
};

export const mutations = {
  addNewRecipe(state, payload) {
    return state.recipes.push(payload);
  },

  setRecipe(state, payload) {
    state.recipes = payload;
  },

  setToken(state, payload) {
    state.token = payload;
  },

  setUserData(state, payload) {
    state.userData = payload;
  },
};

export const actions = {
  // nuxtServerInit({commit}) {
  //     return axios.get("https://vue-js-project-9f7db-default-rtdb.firebaseio.com/datarecipe")
  //                 .then(response => {
  //                         const recipeArray = [];
  //                         for (const key in response.data) {
  //                             recipeArray.push({...response.data[key], id: key})
  //                             }
  //                     commit('setRecipe', recipeArray)
  //                     })
  //                 .catch(e => context.error(e))
  // }
  nuxtServerInit({ commit }) {
    return axios
      .get(
        "https://vue-js-project-9f7db-default-rtdb.firebaseio.com/datarecipe.json"
      )
      .then((response) => {
        const recipeArray = [];
        for (const key in response.data) {
          recipeArray.push({ ...response.data[key], id: key });
        }
        commit("setRecipe", recipeArray);
      })
      .catch((e) => context.error(e));
  },

  authenticateUser({ commit }, authData) {
    let webAPIKey = "AIzaSyDpfWzk5wlzHGn63kUnntrviYdiVSSYS8s";
    let authUrl = authData.isLogin
      ? "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
      : "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";

    return axios
      .post(authUrl + webAPIKey, {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true,
        displayName: authData.displayName,
      })
      .then((response) => {
        commit("setToken", response.data.idToken);
        commit("setUserData", {
          username: response.data.displayName,
          userId: response.data.localId,
          email: response.data.email,
        });
      })
      .catch((error) => console.log(error.response.data.message));
  },

  addRecipe({ commit, state }, recipe) {
    return axios
      .post(
        "https://vue-js-project-9f7db-default-rtdb.firebaseio.com/datarecipe.json?auth=" +
          state.token,
        recipe
      )
      .then((response) => {
        commit("addNewRecipe", recipe);
      });
  },
};
