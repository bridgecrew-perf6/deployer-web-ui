import {onMounted, reactive, ref, toRefs, UnwrapRef} from "vue";
import deployerRepository from "@/api/deployerRepository";
import {BizAppResponse} from "@/utils/response";

export default function appInfoRepositories(appId: number) {
    const appInfo = ref<BizAppResponse>()

    const getAppInfo = async () => {
        try {
            if (appId > 0) {
                appInfo.value = await deployerRepository.getAppByAppId(appId)
            }
        } catch (e) {
            console.log(e)
        }
    }

    onMounted(getAppInfo)

    return {
        appInfo,
    }
}
