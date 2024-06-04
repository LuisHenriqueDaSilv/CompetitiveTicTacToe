import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
export const axiosClient = axios.create({ baseURL: BACKEND_URL })

// Usar apenas em desenvolvimento: 
export function sleep(ms = 2000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
axiosClient.interceptors.request.use(async (response) => {
  await sleep()
  return response
})