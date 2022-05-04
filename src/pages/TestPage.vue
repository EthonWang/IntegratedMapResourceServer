<template>
  <div>
    <div style="position: absolute;z-index: 999;">
      <el-button type="success" @click="addShp">click</el-button>
      <el-button type="success" @click="addShp2">click2</el-button>
      <el-button type="success" @click="addShp3">click3</el-button>
      <el-button type="success" @click="addShp4">click3</el-button>

    </div>
    <MapboxView :shpShowList="shpList"></MapboxView>
  </div>

</template>

<script>
import MapboxView from "../components/MapboxView";

export default {
  name: "TestPage",
  components: {MapboxView},
  data() {
    return {
      shpList: [],
    }
  },
  methods: {
    addShp() {
      this.shpList.push({name: "111", type: "circle", nameId: "points_5w_623f0502c27f44598a295e2d"})
    },
    addShp2() {
      this.shpList.push({name: "222", type: "line", nameId: "chinaprovince_6242ed63c27f7c3c2e49e983"})
    },
    addShp3() {
      this.shpList.push({name: "333", type: "fill", nameId: "chinaprovince_6242ed63c27f7c3c2e49e983"})
    },
    addShp4() {
      this.shpList.push({name: "333", type: "fill", nameId: "chinaprovince_6242ed63c27f7c3c2e49e983"})
    },



  }
}
</script>

<style scoped>

</style>