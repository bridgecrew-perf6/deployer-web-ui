import {onMounted, ref} from "vue";
import deployerRepository from "@/api/deployerRepository";

export default function appInfoRepositories(appId: number) {
    const appInfo = ref()

    const getAppInfo = async () => {
        try {
            console.log(appId, ';;;;;; common header 数据请求一次 刷新能保留')
            appInfo.value = await deployerRepository.getAppByAppId(appId)
        } catch (e) {
            console.log(e)
        }
    }

    onMounted(getAppInfo)

    return {
        appInfo,
    }
}
