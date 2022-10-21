<template>
  <header>
    <a href="#" class="logo"><h2>Mapbox管理台</h2></a>
    <ul class="navigation">
      <li>
        <router-link to="/Map/MyData"><h2>数据服务</h2></router-link>
      </li>
      <li>
        <router-link to="/Map/MyStyle"><h2>资源服务</h2></router-link>
      </li>      
      <li>
        <router-link to="/Map/MyProject"><h2>地图项目</h2></router-link>
      </li>
      <li>
        <router-link to="/Map/MyIntroduce"><h2>帮助</h2></router-link>
      </li>
<!--      <li>-->
<!--        <router-link target="_blank" to="/MapEditor"><h3>样式库</h3></router-link>-->
<!--      </li>-->
<!--      <li>-->
<!--        <router-link to="/Map/MyTest"><h3>测试</h3></router-link>-->
<!--      </li>-->
    </ul>

    <a href="#" style="visibility:hidden;" class="logo"><h2>Mapbox管理台</h2></a>

  </header>
</template> 

<script>
export default {
  data() {
    return {
      selectedIndex: 0,
    };
  },
  methods: {
    handleClick(index) {
      this.selectedIndex = index;
    },
  },
};
</script>

<style>
header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 8%);
  background: #3e7bc5;
  padding: 0px 100px;
  height: 75px;
  z-index: 1;
}
header .logo {
  position: relative;
  color: #ffffff;
  text-decoration: none;
  align-items: baseline; 
}
header .navigation {
  display: flex;
  justify-content: center;
  min-width: 450px;
}
header .navigation li {
  list-style: none;
  margin: 0 20px;
}
header .navigation li a {
  text-decoration: none;
  color: #ffffff;
  letter-spacing: 1px;
}

/* header .navigation li a:hover {
  color: #051dec !important;
} */

.router-link-active {
  color: #85ce61 !important;
}
</style>