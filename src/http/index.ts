import axios from "axios";


export const httpClient = axios.create({ baseURL: 'http://localhost:8000/api/v1/' })

const httpAdmin = axios.create({ baseURL: 'http://localhost:8000/api/v2/' })

export default httpAdmin

