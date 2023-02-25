import axios from "axios"
import config from "../config.js"
const API_URL = config.SOCIAL_API

const applyJobNotification = async (params) => {
    return axios
        .post(`${API_URL}/contact/apply-job-notification`, params)
        .then(response => {
            return response
        })
        .catch(error => {
            return error.response
        })
}

export default{
    applyJobNotification
}