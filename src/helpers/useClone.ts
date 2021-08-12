import { ref, Ref } from 'vue';

export function useClone(original: any): any {
  const clone = JSON.parse(JSON.stringify(original));
  return {
    clone
  };
}
