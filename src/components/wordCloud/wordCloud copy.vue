<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface AnimateElement extends HTMLElement {
  animateInfo: {
    scale?: number
    x?: number
    y?: number
    z?: number
  }
  prevAnimateInfo: {
    scale?: number
    x?: number
    y?: number
    z?: number
  }
}

const container = ref<HTMLElement>()
let randomAnimate: RandomAnimate

class RandomAnimate {
  container: HTMLElement | null = null
  items: AnimateElement[] = []
  minScale = 0.9
  scaleInterval = 10000 // 缩放间隔
  xInterval = 40000 // 横向位移速度
  yInterval = 40000 // 纵向位移速度
  animateInterval = 16 // 动画间隔 16ms
  index = 1
  animationFrame: number | undefined
  restartTimer: number | undefined
  mutationObserver: MutationObserver | undefined

  constructor(container: HTMLElement) {
    this.container = container
    this.init()
  }

  init() {
    this.container!.style.position = 'relative'
    this.createMutation()
  }

  createMutation() {
    this.mutationObserver = new MutationObserver(function (mutationRecords) {
      mutationRecords.forEach((record) => {
        const { addedNodes, removedNodes } = record
        if (addedNodes.length) {
          randomAnimate.add(
            Array.from(addedNodes).filter(
              (node) => node.nodeType === 1
            ) as AnimateElement[]
          )
        }
        if (removedNodes.length) {
          randomAnimate.remove(
            Array.from(removedNodes).filter(
              (node) => node.nodeType === 1
            ) as AnimateElement[]
          )
        }
      })
    })

    this.mutationObserver.observe(container.value!, {
      childList: true,
      attributes: false
    })
  }

  add(items: AnimateElement | AnimateElement[]) {
    items = Array.isArray(items) ? items : [items]
    items.forEach((item: AnimateElement) => {
      item.style.position = 'absolute'
      item.style.left = '0px'
      item.style.top = '0px'
      item.animateInfo = {}
      item.prevAnimateInfo = {} // 上一状态，用来判断移动方向与缩放状态
      this.setScale(item)
      this.setPosition(item)
      this.setHover(item)
      this.render(item)
    })
    this.items.push(...items)
  }

  remove(item: AnimateElement | AnimateElement[]) {
    if (Array.isArray(item)) {
      item.forEach((i) => {
        this.remove(i)
      })
    } else {
      // item.parentElement!.removeChild(item)
      const index = this.items.indexOf(item)
      if (index > -1) {
        this.items.splice(index, 1)
      }
    }
  }

  setScale(item: AnimateElement) {
    const maxZ = this.items.length * 100
    const minScale = this.minScale
    const { animateInfo, prevAnimateInfo } = item
    if (!animateInfo.scale) {
      animateInfo.scale = Math.random() * (1 - minScale) + minScale
    } else {
      const scaleInterval = this.scaleInterval
      const scaleStep = ((1 - minScale) / scaleInterval) * this.animateInterval
      const _animate = JSON.parse(JSON.stringify(animateInfo))

      let direction
      if (prevAnimateInfo.scale) {
        direction =
          animateInfo.scale > prevAnimateInfo.scale ||
            animateInfo.scale === minScale
            ? 1
            : -1
      } else {
        direction = Math.random() > 0.5 ? 1 : -1 // 随机开始放大或缩小
      }

      if (direction > 0) {
        // 放大
        animateInfo.scale += scaleStep
        if (animateInfo.scale > 1) {
          animateInfo.scale = 1
        }
      } else {
        // 缩小
        animateInfo.scale -= scaleStep
        if (animateInfo.scale < minScale) {
          animateInfo.scale = minScale
        }
      }
      item.prevAnimateInfo.scale = _animate.scale
    }
    animateInfo.z = ~~(((animateInfo.scale - minScale) / (1 - minScale)) * maxZ)
  }

  setPosition(item: AnimateElement) {
    const maxX = this.container!.clientWidth - item.clientWidth
    const maxY = this.container!.clientHeight - item.clientHeight
    const { animateInfo, prevAnimateInfo } = item
    const _animate = JSON.parse(JSON.stringify(animateInfo))

    if (animateInfo.x === undefined) {
      animateInfo.x = Math.random() * maxX
      animateInfo.y = Math.random() * maxY
    } else {
      let { xInterval, yInterval, animateInterval } = this
      // xInterval = xInterval - Math.random() * 15000
      // yInterval = yInterval - Math.random() * 15000
      const xStep = (maxX / xInterval) * animateInterval
      const yStep = (maxY / yInterval) * animateInterval

      let directionX, directionY

      if (prevAnimateInfo.x === undefined) {
        directionX = Math.random() > 0.5 ? 1 : -1 // 随机开始向左或向右
        directionY = Math.random() > 0.5 ? 1 : -1 // 随机开始向上或向下
      } else {
        directionX =
          animateInfo.x > prevAnimateInfo.x || animateInfo.x === 0 ? 1 : -1
        directionY =
          animateInfo.y! > prevAnimateInfo.y! || animateInfo.y === 0 ? 1 : -1
      }

      if (directionX > 0) {
        // 向右
        animateInfo.x += xStep
        if (animateInfo.x > maxX) {
          animateInfo.x = maxX
        }
      } else {
        // 向左
        animateInfo.x -= xStep
        if (animateInfo.x < 0) {
          animateInfo.x = 0
        }
      }

      if (directionY > 0) {
        // 向下
        animateInfo.y! += yStep
        if (animateInfo.y! > maxY) {
          animateInfo.y = maxY
        }
      } else {
        // 向上
        animateInfo.y! -= yStep
        if (animateInfo.y! < 0) {
          animateInfo.y = 0
        }
      }

      item.prevAnimateInfo.x = _animate.x
      item.prevAnimateInfo.y = _animate.y
    }
  }

  setHover(item: AnimateElement) {
    item.addEventListener('mouseenter', () => {
      this.stop()
      clearTimeout(this.restartTimer)
      item.style.zIndex = this.items.length * 10000 + ''
      item.style.transform = item.style.transform.replace(
        /scale((\d+.?\d*))/,
        'scale(1)'
      )
    })
    item.addEventListener('mouseleave', () => {
      item.style.zIndex = item.animateInfo.z + ''
      item.style.transform = item.style.transform.replace(
        /scale((\d+.?\d*))/,
        `scale(${item.animateInfo.scale})`
      )
      this.restartTimer = (setTimeout(() => {
        this.start()
      }, 300) as any)
    })
  }

  render(item: AnimateElement) {
    const { x = 10, y = 10, z, scale } = item.animateInfo
    item.style.zIndex = z + ''
    item.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
  }

  stop() {
    this.animationFrame && window.cancelAnimationFrame(this.animationFrame)
  }

  start() {
    this.items.forEach((item: AnimateElement) => {
      this.setScale(item)
      this.setPosition(item)
      this.render(item)
    })
    this.animationFrame = window.requestAnimationFrame(() => {
      this.start()
    })
  }

  destroy() {
    this.stop()
    this.items = []
    this.container = null
    this.mutationObserver && this.mutationObserver.disconnect()
  }
}

function init() {
  randomAnimate = new RandomAnimate(container.value!)
  const items = Array.from(container.value!.children) as AnimateElement[]
  randomAnimate.add(items)
  randomAnimate.start()
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  randomAnimate.destroy()
})
</script>
<template>
  <div class="word-cloud-container" ref="container">
    <slot></slot>
  </div>
</template>
<style lang="less" scoped>
.word-cloud-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
