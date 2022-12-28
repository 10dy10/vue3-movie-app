import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes";
import store from "./store";  //index라는 이름은 생략 가능
import loadImage from './plugins/loadImage'

createApp(App)
  .use(router) //$route, $router
  .use(store)  // $store
  .use(loadImage)   //$loadImage
  .mount("#app");
