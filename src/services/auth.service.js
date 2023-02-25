import axios from "axios"
import config from "../config.js"
const API_URL = config.AUTH_API_URL

const login = (app, email, password) => {
    return axios
        .post(`${API_URL}/login`, {
            app,
            email,
            password,
        })
        .then(response => {
            return response
        })
        .catch(error => {
            return error.response
        })
}

export default {
    login
}