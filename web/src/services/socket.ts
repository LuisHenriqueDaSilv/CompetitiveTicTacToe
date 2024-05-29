import { io } from "socket.io-client"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
export default io(BACKEND_URL, { autoConnect: false })