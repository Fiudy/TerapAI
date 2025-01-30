import axios from "axios"

export const baseUrl = axios.create({
    baseURL: "https://api.openai.com/v1/chat"
})