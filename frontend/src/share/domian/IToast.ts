export default interface IToast {
  sucess: (texto: string) => void
  error: (texto: string) => void
}
