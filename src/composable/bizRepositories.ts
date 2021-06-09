import {onMounted, ref, watch} from "vue";
import deployerRepository from "@/api/deployerRepository";
import {BizAppResponse, BizResponse} from "@/utils/response";
import {appList, appState, bizInfo} from "@/utils/store";

export default function bizRepositories() {
    const bizId = ref()
    const bizList = ref<BizResponse[]>([])
    // const appList = ref<BizAppResponse[]>([])
    const getBizList = async () => {
        try {
            bizList.value = await deployerRepository.getBiz()
            bizId.value = bizList.value?.[0].ID
            // bizInfo.value = bizList.value?.[0]
            appState.bizInfo = bizList.value?.[0]
        } catch (e) {
            console.error(e)
        }
    }
    const getBizAppList = async (bizId: number) => {
        try {
            // appList.value = await deployerRepository.getBizAllApp(bizId)
            appState.appList = await deployerRepository.getBizAllApp(bizId)
        } catch (e) {
            console.error(e)
        }
    }

    onMounted(getBizList)
    watch(bizId, (value) => {
        // bizInfo.value = bizList.value.filter(b => b.ID === value)
        appState.bizInfo = bizList.value.filter(b => b.ID === value)?.[0]
        getBizAppList(value).then()
    })

    return {
        bizId,
        bizList,
        // appList,
    }
}
