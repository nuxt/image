import { $Img } from '../types'
import { useNuxtApp } from '#imports'

export const useImage = () => {
  return useNuxtApp().$img as $Img
}
