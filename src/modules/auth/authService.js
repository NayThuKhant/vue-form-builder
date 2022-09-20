import api from "@/libs/axios"
// import Cookies from "js-cookie"

const endpoints = {
  login: "auth/login"
}

const authService = {
  login: async (params) => {
    try {
      const result = await api.post(endpoints.login, params)
      return result.data
    } catch {
      return null
    }
  },
  logout: () => {}
}

export { authService }
