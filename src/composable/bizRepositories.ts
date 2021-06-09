import {onMounted, ref, watch} from "vue";
import deployerRepository from "@/api/deployerRepository";
import {BizResponse} from "@/utils/response";

export default function bizRepositories() {
    const bizId = ref()
    const bizList = ref<BizResponse[]>([])
    const appList = ref([])
    const getBizList = async () => {
        try {
            bizList.value = await deployerRepository.getBiz()
            bizId.value = bizList.value?.[0].ID
        } catch (e) {
            console.error(e)
        }
    }
    const getBizAppList = async (bizId: number) => {
        try {
            await deployerRepository.getBizAllApp(bizId)
        } catch (e) {
            console.error(e)
        }
    }

    onMounted(getBizList)
    watch(bizId, (value) => {
        console.log(value, '[[[[')
        getBizAppList(value).then()
    })

    return {
        bizId,
        bizList,
    }
}
