import api from "@/libs/axios"
import qs from "qs"

const endpoints = {
  user: "https://dummyjson.com/users"
}

const service = {
  getAll: async (params) => {
    try {
      const result = await api.get(endpoints.user, {
        params: params,
        paramsSerializer: (params) => {
          return qs.stringify(params)
        }
      })
      return result.data
    } catch {
      return null
    }
  },
  getOne: async (params) => {
    try {
      const result = await api.get(`${endpoints.user}/${params.id}`)
      return result.data
    } catch {
      return null
    }
  },
  update: async (params) => {
    const result = await api.put(`${endpoints.user}/${params.id}`, params)
    return result.data
  },
  add: async (params) => {
    const result = await api.post(endpoints.user, params)
    return result.data
  },
  delete: async (params) => {
    try {
      const result = await api.delete(`${endpoints.user}/${params.id}`)
      return result.data
    } catch {
      return null
    }
  }
}

export { service }
