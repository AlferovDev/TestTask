<template>
  <div>
    <h1>Список недвижимости</h1>
    <input
      type="text"
      v-model="searchTerm"
      placeholder="Поиск по адресу..."
    />
    <button @click="clearFilter">Очистить фильтры</button>
    <table border="1">
      <thead>
        <tr>
          <th>Адрес</th>
          <th>Город</th>
          <th>Тип</th>
          <th>Цена</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(property, index) in filteredProperties" :key="index">
          <td v-html="highlightMatch(property.address, searchTerm)"></td>
          <td>{{ property.city }}</td>
          <td>{{ property.type }}</td>
          <td>{{ property.price }}</td>
          <td>
            <button @click="filterByCity(property.city)">⚙️</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">  
import { ref, onMounted, computed, watch } from 'vue';  
import { useDataStore } from '../stores/modules/api';  
import debounce from 'lodash.debounce';  
import type { Estate } from '../types/Estate';  

const dataStore = useDataStore();  
const data = ref<Estate[]>([]);  
const originalData = ref<Estate[]>([]);  
const searchTerm = ref<string>('');  
const selectedCity = ref<string | null>(null);   
const searchResultsCache = new Map<string, Estate[]>(); 


const updateData = (newData: Estate[]) => {  
  data.value = newData;  
};  

const initializeData = () => {  
  updateData(dataStore.data);  
  originalData.value = [...dataStore.data];  
};  

const performSearch = async (term: string) => {  
  if (searchResultsCache.has(term)) {  
    updateData(searchResultsCache.get(term)!);
    return;  
  }  

  await dataStore.searchData(term);  

  const results = dataStore.data;   
  searchResultsCache.set(term, results);   
  updateData(results);  
};  

const debouncedSearch = debounce(performSearch, 300);   

watch(searchTerm, (newTerm) => {  
  if (newTerm) {  
    selectedCity.value = null;  
    updateData(originalData.value);   
    debouncedSearch(newTerm);   
  } else {  
    updateData(originalData.value);   
  }  
});  
 
const clearFilter = () => {  
  searchTerm.value = '';  
  selectedCity.value = null;  
  updateData(originalData.value);  
};  


const filterByCity = (city: string) => {  
  if (searchTerm.value) {  
    updateData(originalData.value);  
  }  
  dataStore.filterByCity(city);  
  selectedCity.value = city;   
};  

const filteredProperties = computed<Estate[]>(() => {  
  if (!selectedCity.value && !searchTerm.value) {  
      return originalData.value;  
  }  

  return originalData.value.filter(property => {  
      const matchesCity = !selectedCity.value || property.city === selectedCity.value;  
      const matchesSearchTerm = !searchTerm.value || property.address.toLowerCase().includes(searchTerm.value.toLowerCase());  
      return matchesCity && matchesSearchTerm;  
  });  
});  
  
const highlightMatch = (text: string, term: string): string => {  
  if (!term) return text;  
  const regex = new RegExp(`(${term})`, 'gi');   
  return text.replace(regex, '<span style="background-color: yellow;">\$1</span>');   
};  

onMounted(async () => {  
  await dataStore.getData();  
  initializeData();  
});  

</script>
<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: left;
}

button {
  cursor: pointer;
}

input {
  margin-bottom: 10px;
}
</style>
