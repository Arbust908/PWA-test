import { createApp, h, markRaw } from "vue";
import page from "page";
import routes from "./routes";
import "./index.css";

// createApp(App).mount('#app')
const DefaultComponent = markRaw({
  render: () => h("div", "Loading…"),
});

const SimpleRouterApp = {
  data: () => ({
    ViewComponent: null,
  }),

  render() {
    return h(this.ViewComponent || DefaultComponent);
  },

  created() {
    for (let route in routes) {
      page(route, () => {
        this.ViewComponent = markRaw(
          require("./pages/" + routes[route] + ".vue").default
        );
      });
    }

    page();
  },
};

createApp(SimpleRouterApp).mount("#app");
