import { useNuxtApp } from '#imports'

export const useImage = () => {
  return useNuxtApp().$img
}
