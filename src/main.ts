import 'core-js/stable';
import 'regenerator-runtime/runtime';
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
  Popconfirm,
  Switch, Badge, ConfigProvider, Card, Col, Row, Collapse, Modal, Tooltip,
} from "ant-design-vue";
import HeaderComponent from 'menu-header-component/dist/menu-header-component.common.js'
import 'menu-header-component/dist/menu-header-component.css'
import TaskFlow from 'task-flow-ui/dist/task-flow-ui.umd.js'
import 'task-flow-ui/dist/task-flow-ui.css'

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
app.use(Switch)
app.use(Badge)
app.use(ConfigProvider)
app.use(Card)
app.use(Col)
app.use(Row)
app.use(Collapse)
app.use(Modal)
app.use(Tooltip)

app.use(HeaderComponent)
app.use(TaskFlow)

app.mount('#app')
