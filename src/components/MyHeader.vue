<template>
  <header>
    <a href="#" class="logo"><h2>Mapbox</h2></a>
    <ul class="navigation">
      <li>
        <router-link to="/Map/MyData"><h3>我的数据</h3></router-link>
      </li>
      <li>
        <router-link to="/Map/MyProject"><h3>我的项目</h3></router-link>
      </li>
      <li>
        <router-link target="_blank" to="/MapEditor"><h3>临时地图编辑</h3></router-link>
      </li>
      <li>
        <router-link to="/Map/MyTest"><h3>测试</h3></router-link>
      </li>
    </ul>
    <div>wyjq</div>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 8%);
  background: rgba(255, 255, 255, 1);
  padding: 0px 100px;
  height: 60px;
}
header .logo {
  position: relative;
  color: rgb(0, 0, 0);
  text-decoration: none;
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
  color: rgb(0, 0, 0);
  letter-spacing: 1px;
}

/* header .navigation li a:hover {
  color: #051dec !important;
} */

.router-link-active {
  color: rgb(17 101 184) !important;
}
</style>