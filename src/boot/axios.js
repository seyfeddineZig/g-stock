import Vue from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'
// We create our own axios instance and set a custom base URL.
// Note that if we wouldn't set any config here we do not need
// a named export, as we could just `import axios from 'axios'`
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5500/api/'
})

// for use inside Vue files through this.$axios
Vue.prototype.$axios = axiosInstance

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('TOKEN')
    if (token) {
      config.headers.token = `${token}`
    }

    return config
  },

  error => {
    return Promise.reject(error)
  }
)

function errorResponseHandler (error) {
  const response = error.response
  Notify.create({
    type: 'negative',
    position: 'bottom-right',
    timeout: 1500,
    message: response.data.message
  })
}

// apply interceptor on response
axiosInstance.interceptors.response.use(
  response => response,
  errorResponseHandler
)

// Here we define a named export
// that we can later use inside .js files:
export { axiosInstance }
