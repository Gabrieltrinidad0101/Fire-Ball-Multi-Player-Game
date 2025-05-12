import type IToast from '../domain/IToast'
import { toast } from 'react-toastify'

export const Toast: IToast = {
  success: (texto: string) => { toast.success(texto.toLocaleUpperCase()) },
  error: (texto: string) => { toast.error(texto.toLocaleUpperCase()) }
}
