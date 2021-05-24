// 数组存储相关逻辑，包括喜欢歌单
import storage from 'good-storage'

// 插入函数
const insertIntoArray = (arr, val, compare, maxLen) => {
  const index = arr.findIndex(compare)
  if (index > -1) {
    return
  }

  arr.unshift(val)

  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

const deleteFromArray = (arr, compare) => {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
  return arr
}

// 保存函数， compare为判断数据是否在原数据数组中
export function save (item, key, compare, maxLen) {
  const items = storage.get(key, [])

  insertIntoArray(items, item, compare, maxLen)
  storage.set(key, items)
  return items
}

// 移除函数
export function remove (key, compare) {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

export function load (key) {
  return storage.get(key, [])
}
