import { ref, watch } from 'vue';
import axios from 'axios';
import { useAxios } from '@vueuse/integrations/useAxios';
const api = import.meta.env.VITE_API_URL || '/api';
const instance = axios.create({ baseURL: api });

export function useApi(endpoint: string) {
  const create = (entity) => {
    return { data, isFinished } = useAxios(`${endpoint}`, { method: 'POST', data:  entity}, instance);
  }
  const read = () => {
    const entity = ref([]);
    const { data } = useAxios(endpoint, instance);
    watch(data, (newValue, _) => {
      if (newValue && newValue.data) {
        entity.value = newValue.data;
      }
    })
    return entity;
  }
  const destroy = (id: number) => {
    const { data } = useAxios(`${endpoint}/${id}`, { method: 'DELETE' }, instance);
    return data 
  }
  const update = (entity) => {
    const id = entity.id;
    return { data, isFinished } = useAxios(`${endpoint}/${id}`, { method: 'PUT', data:  entity}, instance);
  }

  return { create, read, update, destroy };
}