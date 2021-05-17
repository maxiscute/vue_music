// 工具函数

// 随机播放列表
export function shuffleArray (source) {
  console.log('shuffleArray')
  console.log('source', source)
  const arr = source.slice()
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

// 获得指定最大值中随机数
const getRandomInt = (max) => {
  return Math.floor(Math.random() * (max + 1))
}

// 交换数组元素
const swap = (arr, i, j) => {
  const tmp = arr[i]
  arr[i] = arr[j]
  arr[j] = tmp
}
