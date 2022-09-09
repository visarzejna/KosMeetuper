import io from 'socket.io-client'
import vuejsDatepicker from 'vuejs-datepicker'

const AppSocket = {
    install(Vue, options) {
        Vue.prototype.$socket = io(options.connection)
    }
}
export default AppSocket