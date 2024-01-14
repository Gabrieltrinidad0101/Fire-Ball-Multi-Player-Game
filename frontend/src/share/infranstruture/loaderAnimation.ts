export default class LoaderAnimation {
  private readonly loaderElement: HTMLElement | null
  private notShow: boolean = false
  constructor () {
    this.loaderElement = document.getElementById('LoadingFetch')
  }

  showAfter = (after: number): void => {
    setTimeout(() => {
      if (this.notShow) return
      this.loaderElement?.setAttribute('style', 'display:flex')
    }, after)
  }

  hide = (): void => {
    this.notShow = true
    this.loaderElement?.setAttribute('style', 'display:none')
  }
}
