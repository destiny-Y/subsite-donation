class Monitor {
  private oldScript: string[] = []

  private newScript: string[] = []

  private oldEtag: string | null = null

  private newEtag: string | null = null

  dispatch: Record<string, (() => void)[]> = {}

  private stop = false

  constructor() {
    this.init()
  }

  async init() {
    console.log('初始化')
    const html: string = await this.getHtml()
    this.oldScript = this.parserScript(html)
    this.oldEtag = await this.getEtag()
  }
  // 获取html
  async getHtml() {
    const html = await fetch('/').then((res) => res.text())
    return html
  }
  // 获取etag是否变化
  async getEtag() {
    const res = await fetch('/')
    // return res.headers.get('etag')
    return res.headers.get('Etag')
  }
  // 解析script标签
  parserScript(html: string) {
    const reg = /<script(?:\s+[^>]*)?>(.*?)<\/script\s*>/gi
    return html.match(reg) as string[]
  }
  // 订阅
  on(key: 'update', fn: () => void) {
    ;(this.dispatch[key] || (this.dispatch[key] = [])).push(fn)
    return this
  }
  // 停止
  pause() {
    this.stop = !this.stop
  }

  get value() {
    return {
      oldEtag: this.oldEtag,
      newEtag: this.newEtag,
      oldScript: this.oldScript,
      newScript: this.newScript,
    }
  }
  // 两层对比有任一个变化即可
  compare() {
    if (this.stop) return
    const oldLen = this.oldScript.length
    const newLen = Array.from(
      new Set(this.oldScript.concat(this.newScript))
    ).length
    if (this.oldEtag !== this.newEtag || newLen !== oldLen) {
      this.dispatch.update.forEach((fn) => {
        fn()
      })
    }
  }
  // 检查更新 
  async check() {
    const newHtml = await this.getHtml()
    this.newScript = this.parserScript(newHtml)
    this.newEtag = await this.getEtag()
    this.compare()
  }
}

export const monitor = new Monitor()