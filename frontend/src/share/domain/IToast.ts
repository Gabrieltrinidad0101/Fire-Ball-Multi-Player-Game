export default interface IToast {
  success: (texto: string) => void
  error: (texto: string) => void
}
