import { Component, createApp, defineComponent, h, ref, markRaw } from 'vue'

import page from "page";
import routes from "./routes";
import "./index.css";

// createApp(App).mount('#app')
const defaultComponent = markRaw({
  render: () => h("div", "Loading…"),
});


const Router: Component = defineComponent({
  setup() {
    const viewComponent: Component = ref(null);
    return { viewComponent }
  },

  render() {
    return h(this.viewComponent || defaultComponent);
  },

  created() {
    for (const path in routes) {
      if (Object.prototype.hasOwnProperty.call(routes, path)) {
        const route = routes[path];
        page(path, () => this.viewComponent = route);
      }
    }
    page();
  },
});

createApp(Router).mount("#app");
