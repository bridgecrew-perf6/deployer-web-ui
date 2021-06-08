import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";
import {Button, Input, Layout, Menu} from "ant-design-vue";

const app = createApp(App)
app.use(router)

app.use(Layout)
app.use(Menu)
app.use(Input)
app.use(Button)

app.mount('#app')
