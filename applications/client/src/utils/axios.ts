import axios from 'axios';

export const HTTP = axios.create({
  baseURL: '/api', 
  headers: {
      'Accepts': 'application/json',
      "Access-Control-Allow-Origin": '*',
  },
});