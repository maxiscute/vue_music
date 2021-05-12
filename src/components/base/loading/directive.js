import { createApp } from 'vue'
import Loading from './loading'
import { addClass, removeClass } from '@/assets/js/dom'

// 使加载框可以居中style样式
const styleList = ['fixed', 'relative', 'absolute']

// base.scss中定义，使position: relative
const relativeCls = 'g-relativeCls'

const loadingDirective = {
  mounted (el, binding) {
    const app = createApp(Loading)
    // loading组件实例
    const instance = app.mount(document.createElement('div'))
    // 保存到el上，方便其他地方挂载
    el.instance = instance

    // 传入的动态参数，用于显示加载时的提示
    const loadingMsg = binding.arg
    if (typeof loadingMsg !== 'undefined') {
      instance.setLoadingMsg(loadingMsg)
    }

    if (binding.value) {
      append(el)
    }
  },
  updated (el, binding) {
    // 传入的动态参数，用于显示加载时的提示
    const loadingMsg = binding.arg
    if (typeof loadingMsg !== 'undefined') {
      el.instance.setLoadingMsg(loadingMsg)
    }
    // loading 前后值不同，需要添加/删除擦欧总
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

const append = (el) => {
  const style = getComputedStyle(el)
  // 如果三种position掩饰都没有，就动态添加relative
  if (styleList.indexOf(style.position) === -1) {
    addClass(el, relativeCls)
  }
  el.appendChild(el.instance.$el)
}

const remove = (el) => {
  removeClass(el, relativeCls)
  el.removeChild(el.instance.$el)
}

export default loadingDirective
