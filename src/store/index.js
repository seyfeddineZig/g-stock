import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'
import auth from './auth'
import defaultstore from './defaultstore'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
      auth,
      defaultstore
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  if (process.env.DEV && module.hot) {
    module.hot.accept(['./auth'], () => {
      const newAuth = require('./auth').default
      Store.hotUpdate({ modules: { auth: newAuth } })
    })
    module.hot.accept(['./defaultstore'], () => {
      const newDefaultStore = require('./defaultstore').default
      Store.hotUpdate({
        modules: { defaultstore: newDefaultStore }
      })
    })
  }

  return Store
}
