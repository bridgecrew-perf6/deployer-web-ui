import {onMounted, ref} from "vue";
import deployerRepository from "@/api/deployerRepository";
import {BizResponse} from "@/utils/response";

export default function bizRepositories() {
    const bizId = ref()
    const bizList = ref<BizResponse[]>([])
    const getBizList = async () => {
        try {
            bizList.value = await deployerRepository.getBiz()
        } catch (e) {
            console.error(e)
        }
    }

    onMounted(getBizList)

    return {
        bizId,
        bizList,
    }
}
