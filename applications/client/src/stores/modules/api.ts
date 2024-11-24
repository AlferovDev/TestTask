import { defineStore } from 'pinia';
import { HTTP } from '../../utils/axios.ts';
import type { Estate } from '../../types/Estate.ts';  

export const useDataStore = defineStore('data', {
  state: () => ({
    data: [] as Estate[],
  }),
  actions: {
    async getData(): Promise<void> {
      try {
        const response = await HTTP.get<Estate[]>('/estates');
        this.data = response.data;
        console.log('data', this.data);
      } catch (error) {
        console.log('an error occured ' + error);
      }
    },
    
    async filterByCity(city: string): Promise<void> {
      try {
        const response = await HTTP.get<Estate[]>(`/estates?city=${city}`);
        this.data = response.data;
      } catch (error) {
        console.log('an error occured'+ error);
      }
    },
    async searchData(param: string): Promise<void> {
      try {
        const response = await HTTP.get<Estate[]>(`/estates?search=${param}`);
        this.data = response.data;
      } catch (error) {
        console.log('an error occured'+ error);
      }
    }
  },
});
