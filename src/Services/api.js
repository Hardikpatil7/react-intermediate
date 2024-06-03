import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export const fetchStores = (params) => {
    return axios.get(`${API_BASE_URL}/stores`, { params });
  };

export const fetchCategories = async () => {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response;
};
