// 对于dom节点的操作

export const addClass = (el, className) => {
  // 没有添加类才添加
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

export const removeClass = (el, className) => {
  el.classList.remove(className)
}
