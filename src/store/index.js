import { createStore } from 'vuex'

import user from '@/store/user'
import global from '@/store/global'

const store = createStore({
    modules: {
        user,
        global,
    },
})

export default store
