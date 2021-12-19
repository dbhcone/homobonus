import axios from 'axios';

const HEADERS = {
    'Content-Type': 'application/json',
};

const GET = async (endpoint: string, headers?: any) => {
    return axios.get(endpoint, { headers: {...headers, ...HEADERS} });
};

const POST = async (endpoint: string, data?: any, headers?: any) => {
    return axios.post(endpoint, data, { headers: {...headers, ...HEADERS} });
};

const PATCH = async (endpoint: string, data: any, headers?: any) => {
    return axios.patch(endpoint, data, { headers: {...headers, ...HEADERS} });
};

const DELETE = async (endpoint: string, headers?: any) => {
    return axios.delete(endpoint, { headers: {...headers, ...HEADERS} });
};
export { GET, POST, PATCH, DELETE };
