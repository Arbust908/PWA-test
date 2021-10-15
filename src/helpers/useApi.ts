import { ref, watch } from 'vue';
import axios from 'axios';
import { useAxios } from '@vueuse/integrations/useAxios';
const api = import.meta.env.VITE_API_URL || '/api';
const instance = axios.create({ baseURL: api });

/**
 *
 * @param endpoint toma un string con la ruta de la api
 * @returns objeto con las funciones del CRUD
 */
export function useApi(endpoint: string) {
    /**
     *
     * @param entity toma un objeto con la entidad a crear
     * @returns objeto con la entidad creada y el estado de la petición
     */
    const create = (entity: any) => {
        const { data, isFinished } = useAxios(`${endpoint}`, { method: 'POST', data: entity }, instance);

        return { data, isFinished };
    };
    /**
     * TODO: Implementar que si le paso un Id lo traiga. hoy se puede hacer si le paso un ID al endpoint
     * @returns objeto con la entidad
     */
    const read = () => {
        const entity = ref([]);
        const { data } = useAxios(endpoint, instance);
        watch(data, (newValue) => {
            if (newValue && newValue.data) {
                entity.value = newValue.data;
            }
        });

        return entity;
    };
    /**
     *
     * @param entity toma un objeto con la entidad a actualizar
     * @returns objeto con la entidad actualizada y el estado de la petición
     */
    const update = (entity: any) => {
        const id = entity.id;
        const { data, isFinished } = useAxios(`${endpoint}/${id}`, { method: 'PUT', data: entity }, instance);

        return { data, isFinished };
    };
    /**
     *
     * @param id toma un string con el id de la entidad a borrar
     * @returns objeto con la entidad borrada
     */
    const destroy = (id: number) => {
        const { data } = useAxios(`${endpoint}/${id}`, { method: 'DELETE' }, instance);

        return data;
    };

    return { create, read, update, destroy };
}
