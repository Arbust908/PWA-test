import { useRouter } from 'vue-router'
import {useStore} from 'vuex'

export async function useStoreLogic (entity: String, method:String, payload?:Object) {
  let store = useStore()
  let router = useRouter()
  
  let response = await store.dispatch(`${entity}DataHandler`, method, payload)
  .then((res) => {
    if(res.data) {
      if(method !== 'get' && method !== 'getAll') router.push(`/${entity}`)
      return { type: "success", data: res.data }
    } else {
      return { type: "failed", data: res.message }
    }
  })

  return response
} 