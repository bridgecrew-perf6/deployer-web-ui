import {reactive, ref} from "vue";
import {BizAppResponse, BizResponse} from "@/utils/response";

export const appList = ref<BizAppResponse[]>([])
export const bizInfo = ref()

export const appState = reactive({
  appList: [] as BizAppResponse[],
  bizInfo: {} as BizResponse,
})
