import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";
import {
  Button,
  Input,
  Layout,
  Menu,
  Select,
  Avatar,
  Dropdown,
  Table,
  Steps,
  Checkbox,
  Form,
  Popconfirm
} from "ant-design-vue";

const app = createApp(App)
app.use(router)

app.use(Layout)
app.use(Menu)
app.use(Input)
app.use(Button)
app.use(Select)
app.use(Avatar)
app.use(Dropdown)
app.use(Table)
app.use(Steps)
app.use(Checkbox)
app.use(Form)
app.use(Popconfirm)

app.mount('#app')
