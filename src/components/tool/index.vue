<template>
  <div class="tool">
    <ul>
      <li>
        <img class="toolimage" src="../../assets/images/phone.png" />
        <div class="call" style="padding: 4px">023-61750853（白天）023-61758071（夜间）</div>
      </li>
      <li>
        <img class="toolimage" src="../../assets/images/wechat.png" />
        <div class="codebox"><img class="codesImg" src="../../assets/images/cqgzh.png" /></div>
      </li>
      <li @click="backTop">
        <img class="toolimage" src="../../assets/images/backtop.png" />
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
  
  /**
   * 返回页面顶部
   */
  const backTop = () => {
    let timer = null as any;
    if (document.documentElement.scrollTop <= 0) {
      clearTimeout(timer);
      return false;
    }
    document.documentElement.scrollTop -= 50;
    timer = setTimeout(backTop, 10);
  };
</script>
<style lang="less" scoped>
@publicColor:#19C2D1;
.tool {
  position: fixed;
  top: 800px;
  right: 29px;
  z-index: 1000;
  li {
    list-style: none;
    padding: 1px 0;
    cursor: pointer;
    width: 40px;
    height: 40px;
    margin: 3px;
    background-color: @publicColor;
    position: relative;
  }
  div {
    position: absolute;
    right: 0;
    top: 0;
    height: 40px;
    width: 0;
    transition: all 0.4s;
    z-index: -1;
  }
  .toolimage {
    width: 15px;
    height: 15px;
    display: block;
    margin: 15px auto;
  }
  .call {
    font-size: 16px;
    color: #fff;
    text-align: center;
    font-weight: 700;
    padding: 12px 0;
    overflow: hidden;
  }
  .codebox {
    display: none;
    .codesImg {
      width: 100px;
      height: 100px;
    }
  }
  li:hover .call {
    width: 200px;
    overflow: hidden;
    background-color: @publicColor;
    opacity: 1;
  }

  li:hover .codebox {
    width: 100px;
    height: 100px;
    display: block;
  }
  li:hover .call,
  li:hover .codebox {
    margin-right: 45px;
  }
} 
</style>