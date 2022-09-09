import  axiosInstance  from "@/services/axios"

export default {
    namespaced: true,

    state: {
        meetups: {
            data: [],
            count: null,
        },
        threads: {
            data: [],
            count: null,
        },
        posts: {
            data: [],
            count: null,
        }
    },
    actions: {
        fetchUserStats({commit}){
            return axiosInstance('/api/v1/users/me/activity')
                .then(res => {
                    const stats = res.data
                    commit('setStats', stats)
                    return stats
                })
        }
    },
    mutations: {
        setStats (state, stats) {
            Object.assign(state, {}, stats)
        }
    }
}