<template>
  <header>
    <a href="#" class="logo">Mapbox</a>
    <ul class="navigation">
      <li>
        <router-link to="/Map/MyData">我的数据</router-link>
      </li>
      <li>
        <router-link to="/Map/MyProject">我的项目</router-link>
      </li>
      <li>
        <router-link target="_blank" to="/MapEditor">临时地图编辑</router-link>
      </li>
    </ul>
    <div>asdasd</div>
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
  box-shadow: 0 0.2rem 0.4rem 0 rgb(0 0 0 / 8%);
  background: rgba(255, 255, 255, 1);
  padding: 0px 10rem;
  height: 6rem;
}
header .logo {
  position: relative;
  font-size: 2.5rem;
  color: rgb(0, 0, 0);
  text-decoration: none;
  font-weight: 600;
}
header .navigation {
  display: flex;
  justify-content: center;
  min-width: 45rem;
}
header .navigation li {
  list-style: none;
  margin: 0 2rem;
}
header .navigation li a {
  text-decoration: none;
  color: rgb(0, 0, 0);
  font-weight: 600;
  letter-spacing: 0.1rem;
  font-size: 2rem;
}
/* header .navigation li a:hover {
  color: #051dec !important;
} */

.router-link-active {
  color: rgb(17 101 184) !important;
}
</style>