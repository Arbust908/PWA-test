export default {
    state: () => ({
      all: [
      //   {
      //     id: 1,
      //     type: "Comun",
      //     description: "Arena" ,
      //     meshType: "#110",
      //     grainType: "80",
      //     observations: "",
      //     isCompleted: true
      // },
      // {
      //     id: 2,
      //     type: "Resinada",
      //     description: "Arena" ,
      //     meshType: "#30",
      //     grainType: "70",
      //     observations: "-",
      //     isCompleted: true
      // },
      // {
      //     id: 3,
      //     type: "Sinterlite",
      //     description: "Arena" ,
      //     meshType: "#40",
      //     grainType: "",
      //     observations: "-",
      //     isCompleted: false
      // }
      ],
    }),
    getters: {
      getSandbyId: state => (id) => {
        return state.all.find(all => all.id === id)
      },
    },
    mutations: {
      ADD_SAND(state, payload) {
        state.all.push(payload);
      },
      UPDATE_SAND(state, payload) {
        state.all.map((sand, index) => {
          if (sand.id === payload.id) {
            state.all[index] = payload;
          }
        });
      },
    },
    actions: {
      saveSand({ commit }, sand) {
        // console.log('>>Adding Sand', sand);
        console.table(sand);
        const baseS = {
            id: 0,
            type: "",
            description: "",
            meshType: "",
            grainType: "",
            observations: ""
    };
    commit('ADD_SAND', { ...baseS, ...sand });
        if (sand.isFull) {
        // Axios POST to api to create sand
        } else {
        // Axios POST to incomplete sand
        }
    },
    updateSand({ commit }, sand) {
      commit('UPDATE_SAND', sand);
        },
    },
};