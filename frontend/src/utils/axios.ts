import axios from 'axios';
import { backendUrl } from './constants';

const apiClient = axios.create({
  baseURL: backendUrl,
});

export default apiClient;
