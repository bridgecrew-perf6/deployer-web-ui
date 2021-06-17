import {reactive, ref, UnwrapRef} from "vue";
import {BizAppResponse, BizResponse} from "@/utils/response";

export const appList = ref<BizAppResponse[]>([])
export const bizInfo = ref()

export interface App {
  appList: BizAppResponse[];
  bizInfo: BizResponse;
  appInfo: BizAppResponse;
}

export const appState: UnwrapRef<App> = reactive({
  appList: [],
  bizInfo: {},
  appInfo: {},
})

// export function getAppInfo() {
//   return JSON.parse(localStorage.getItem('appInfo') as string)
// }

export const getAppInfo = () => {
  return JSON.parse(localStorage.getItem('appInfo') as string)
}
