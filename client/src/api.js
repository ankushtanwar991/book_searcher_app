import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

export const searchBooks = async (query, category, author, page = 1, size = 10) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/search`, {
      query,
      category: category || undefined,
      author: author || undefined,
      page,
      size,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addBook = async (book) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/books`, book);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/books/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
