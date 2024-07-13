import apiClient from '../utils/axios';

const codeblockService = {
  async getCodeblocks() {
    try {
      const response = await apiClient.get('/codeblock/', {});
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getCodeblocksById(id: number) {
    try {
      const response = await apiClient.get(`/codeblock/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default codeblockService;
