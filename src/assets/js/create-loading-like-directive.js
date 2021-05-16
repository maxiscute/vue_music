// 一个加载样式组件
import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

// 使加载框可以居中style样式
const styleList = ['fixed', 'relative', 'absolute']

// base.scss中定义，使position: relative
const relativeCls = 'g-relativeCls'

export default function createLoadingLikeDirective (Component) {
  const append = (el) => {
    const name = Component.name
    const style = getComputedStyle(el)
    // 如果三种position掩饰都没有，就动态添加relative
    if (styleList.indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }
    el.appendChild(el[name].instance.$el)
  }

  const remove = (el) => {
    const name = Component.name
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }

  return {
    mounted (el, binding) {
      const app = createApp(Component)
      // 组件实例
      const instance = app.mount(document.createElement('div'))
      const name = Component.name
      if (!el[name]) {
        el[name] = {}
      }
      // 保存到el上，方便其他地方挂载
      el[name].instance = instance

      // 传入的动态参数，用于显示加载时的提示
      const loadingMsg = binding.arg
      if (typeof loadingMsg !== 'undefined') {
        instance.setTitle(loadingMsg)
      }

      if (binding.value) {
        append(el)
      }
    },
    updated (el, binding) {
      // 传入的动态参数，用于显示加载时的提示
      const loadingMsg = binding.arg
      const name = Component.name
      if (typeof loadingMsg !== 'undefined') {
        el[name].instance.setTitle(loadingMsg)
      }
      // 前后值不同，需要添加/删除
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }
}
