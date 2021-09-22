export async function useStoreLogic (router: Object, store: Object, entity: String, method:String, payload?:Object) {
  return await store.dispatch(`${entity}DataHandler`, {method, payload})
  .then((res) => {
    String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    }
    let routeName = entity.capitalize() 
    
    if(res && method == 'create') {
      router.push({name: routeName})
      return { type: "success", res }
    }

    if(!res.createdAt && method == 'create'){
      let message = store.getters[`${entity}Message`](method)
      return { type: "failed", message }
    }

    if(method == 'get' || method == 'getAll') { 
      if(res.status !== 'failed') return { type: "success", res }
      else { 
        let message = store.getters[`${entity}Message`](method) 
        return { type: "failed", message }
      }
    }

    if(method == 'delete') {
      if(res.status !== 'failed') return { type: "success", res }
      else { 
        let message = store.getters[`${entity}Message`](method) 
        return { type: "failed", message }
      }
    }

    if(method == 'update') {
      if(res.status !== 'failed') {
        router.push({name: routeName})
        return { type: "success", res }
      }
      else { 
        let message = store.getters[`${entity}Message`](method) 
        return { type: "failed", message }
      }
    }
  })
}
