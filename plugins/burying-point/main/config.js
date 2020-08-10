import UA from 'ua-device' // 使用ua-device库，build后体积增加近150KB，一个用于解析UA来得到用户终端信息的JS库
const host = process.env.NODE_ENV === 'development'
class Con {
  constructor(cookieName) {
    this.queueData = [] // 队列上报数据
    this.DAY = 86400000 // 一天的毫秒数
    this.win = window
    this.doc = document
    this.scr = window.screen
    this.nav = navigator
    this.ua = navigator.userAgent
    this.protocol =
      window.location.protocol === 'https:' ? 'https://' : 'http://'
    this.host = `http://${host ? 'localhost:3001' : '121.42.13.92:3001'}/api/bp` // 上报地址，根据项目情况配置
    this.baseUrl = `${this.protocol}${this.host}`
    this.cookieName = cookieName // cookie名称，前后端需要协商定义
    this.year = 365
    this.whiteList = []
    this.uaOutput = new UA(this.ua) // 解析ua
    this.totalTime = 0
    this.stayTime = 10000 // 触发间隔5秒
    this.compress = true
  }
  // 静态方法，单例
  static getInstance(cookieName = 'bp_did') {
    if (!this.instance) {
      this.instance = new Con(cookieName)
    }
    return this.instance
  }
}

export default Con.getInstance()
