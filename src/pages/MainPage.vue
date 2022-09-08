<template>
  <div class="mainPage">
    <MyHeader />
    <router-view></router-view>
    <!-- <Footer /> -->
  </div>  
</template>

<script>
import MyHeader from "../components/MyHeader.vue";
export default {
  components: { MyHeader },
}
</script>

<style>
.mainPage{
      width: 100%;
}
</style>