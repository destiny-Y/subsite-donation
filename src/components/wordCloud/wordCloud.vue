<template>
  <div class="container">
    <svg :width="width" :height="height" ref="test" @mousemove="listener($event)">
      <a class="fontA" :href="tag.href" v-for="(tag, index) in tags" :key="index" @mouseenter="mouseenter($event)" @mouseleave="mouseleave($event)">
        <text :x="tag.x" :y="tag.y" :fill="randomColor ? colors[index] : tag.color" :font-size="tag.size" :fill-opacity="(200 + tag.z) / 400">
          {{ tag.label }}
        </text>
      </a>
    </svg>
  </div>
</template>
<script>
export default {
  name: "word-cloud",
  props: {
    data: { // 示例数据 { label: "标题", href: "https://www.baidu.com/", size: 3, color: ''},
      type: Array,
      default: () => []
    },
    width: {
      type: Number,
      default: 700
    },
    height: {
      type: Number,
      default: 700
    },
    radiusX: { // X轴旋转半径
      type: Number,
      // default: 250
      default:450
    },
    radiusY: { // y轴旋转半径
      type: Number,
      // default: 250
      default:200
    },
    angleX: { // 球一帧绕x轴旋转的角度
      type: Number,
      default: 1.5
    },
    angleY: { // 球-帧绕y轴旋转的角度
      type: Number,
      default: 1.5
    },
    minSize: { // 最小字体大小, data内size是在最小字体大小基础上加
      type: Number,
      default: 16
    },
    maxSize: { // 最大字体大小
      type: Number,
      default: 44
    },
    randomColor: { // 需要字体颜色
      type: Boolean,
      default: false
    },
    needHover: { // 需要悬停
      type: Boolean,
      default: true
    },
    needSwerve: { // 是否根据鼠标位置转向
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tagsNum: 0, //标签数量
      radius: 200, // Y轴旋转半径，用于计算透明度
      speedX: null,
      speedY: null,
      tags: [],
      timer: null,
      colors: [], //存储颜色
    };
  },
  computed: {
    CX() {
      //球心x坐标
      return this.width / 2;
    },
    CY() {
      //球心y坐标
      return this.height / 2;
    },
  },
  watch: {
    data: {
      handler(newValue) {
        this.speedX = Math.PI / 360 / this.angleX
        this.speedY = Math.PI / 360 / this.angleY
        // 开始动画
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
        this.instData();
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    //初始化标签位置
    instData() {
      let tags = [];
      this.tagsNum = this.data.length;
      if (this.hasColor) {
        this.changeColors(this.tagsNum);
      }
      for (let i = 0; i < this.data.length; i++) {
        let tag = {};
        let k = -1 + (2 * (i + 1) - 1) / this.tagsNum;
        let a = Math.acos(k);
        let b = a * Math.sqrt(this.tagsNum * Math.PI); //计算标签相对于球心的角度
        tag.label = this.data[i].label;
        let size = this.minSize + this.data[i].size
        tag.size = size > this.maxSize ? this.maxSize : size;
        tag.x = this.CX + this.radiusX * Math.sin(a) * Math.cos(b); //根据标签角度求出标签的x,y,z坐标
        tag.y = this.CY + this.radiusY * Math.sin(a) * Math.sin(b);
        tag.z = this.radius * Math.cos(a);
        tags.push(tag);
      }
      this.tags = tags;
      this.timer = setInterval(() => {
        this.rotateX(this.speedX);
        this.rotateY(this.speedY);
      }, 65);
    },
    // 纵向
    rotateX(angleX) {
      var cos = Math.cos(angleX);
      var sin = Math.sin(angleX);
      for (let tag of this.tags) {
        var y1 = (tag.y - this.CY) * cos - tag.z * sin + this.CY;
        var z1 = tag.z * cos + (tag.y - this.CY) * sin;
        tag.y = y1;
        tag.z = z1;
      }
    },
    // 横向
    rotateY(angleY) {
      var cos = Math.cos(angleY);
      var sin = Math.sin(angleY);
      for (let tag of this.tags) {
        var x1 = (tag.x - this.CX) * cos - tag.z * sin + this.CX;
        var z1 = tag.z * cos + (tag.x - this.CX) * sin;
        tag.x = x1;
        tag.z = z1;
      }
    },
    // 监听鼠标方向
    listener(e) {
      if (!this.needSwerve) return;
      var x = e.clientX - this.CX;
      var y = e.clientY - this.CY;
      if (x * 0.0001 > 0 && y * 0.0001 > 0) {
        this.speedX = -Math.min(this.radiusX * 0.00002, x * 0.0002);
        this.speedY = -Math.min(this.radiusY * 0.00002, y * 0.0002);
      } else if (x * 0.0001 < 0 && y * 0.0001 < 0) {
        this.speedX = -Math.max(-this.radiusX * 0.00002, x * 0.0002);
        this.speedY = -Math.max(-this.radiusY * 0.00002, y * 0.0002);
      } else {
        this.speedX =
          x * 0.0001 > 0
            ? Math.min(this.radiusX * 0.00002, x * 0.0001)
            : Math.max(-this.radiusX * 0.00002, x * 0.0001);
        this.speedY =
          y * 0.0001 > 0
            ? Math.min(this.radiusY * 0.00002, y * 0.0001)
            : Math.max(-this.radiusY * 0.00002, y * 0.0001);
      }
    },
    // 鼠标进入文字
    mouseenter(e) {
      if (!this.needHover) return;
      // 修改透明度
      let doms = document.getElementsByClassName('fontA');
      for (let i = 0; i < doms.length; i++) {
        doms[i].childNodes[0].style.fillOpacity = '0.3';
      }
      e.target.childNodes[0].style.fillOpacity = 1;

      // 停止动画
      clearInterval(this.timer);
      this.timer = null;
    },

    // 鼠标离开文字
    mouseleave() {
      if (!this.needHover) return;
      // 修改透明度
      let doms = document.getElementsByClassName('fontA');
      for (let i = 0; i < doms.length; i++) {
        doms[i].childNodes[0].style.fillOpacity = '';
      }

      // 开始动画
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.timer = setInterval(() => {
        this.rotateX(this.speedX);
        this.rotateY(this.speedY);
      }, 65);
    },
    // 颜色
    changeColors(num) {
      //随机变色
      for (var i = 0; i < num; i++) {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        this.colors[i] = "rgb(" + r + "," + g + "," + b + ")";
      }
    },
  }
};
</script>


<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
  .fontA {
    font-weight: bold;
  }
}
</style>
