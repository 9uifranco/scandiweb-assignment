import axios from 'axios';

const currentProtocol = window.location.protocol;
const host = import.meta.env.VITE_BACKEND_BASE_URL;
const baseURL = `${currentProtocol}//${host}`;

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
