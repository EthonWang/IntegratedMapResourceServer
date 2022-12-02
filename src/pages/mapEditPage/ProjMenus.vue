<template>
  <div class="menuPanel">
    <!-- 标题 -->
<!-- <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/Map/MyProject' }"><h2>项目工程</h2></el-breadcrumb-item>
  <el-breadcrumb-item><h2>{{ mapProjectInfo.name }}</h2></el-breadcrumb-item>
</el-breadcrumb>     -->
    <div class="menuTitle">
      <el-button 
        plain size="mini" 
        icon="el-icon-back" 
        title="返回项目工程"
        @click="toMyProject"
      ></el-button>
      <h2>{{ mapProjectInfo.name }}</h2>
      <el-button plain size="mini" icon="el-icon-back" style="visibility:hidden"></el-button>
    </div>
    <el-divider class="divider"></el-divider>
    <!-- 按钮组 -->
    <ProjButtons></ProjButtons>
    <ProjLayersNew></ProjLayersNew>
  </div>
</template>
<script>
// import requestApi from "@/api/requestApi";
import { mapState, mapActions, mapMutations } from "vuex";
import ProjButtons from "./ProjButtons.vue";
import ProjLayersNew from "./ProjLayersNew.vue";

export default {
  components: { ProjButtons,ProjLayersNew },
  name: "ProjMenus",
  props: ["", ""],
  data() {
    return {
      // 公共参数
      mapProjectId: "",
      layers: [],

      // 发布
      publicBoolean: false,
    };
  },
  computed: {
    ...mapState({}),
    // 切换到这种方式用于对computer进行set
    mapProjectInfo:{
      get(){
        return this.$store.state.mapProjectInfo;
      },
      set(val) {
        this.UPDATEPARM({ parm: "mapProjectInfo", value: val })
      }      
    },    
  },
  watch:{

  },
  mounted() {
    // 等初始组件信息加载完
    this.$bus.$on("init", (data) => {
      switch (data.type) {
        case "all":
        case "menu":
          this.infoInit();
          break;
        default:
          break;
      }
    });
  },
  methods: {
    // vuex
    ...mapActions({ updateParm: "update" }), //将 `this.updateParm(data)` 映射为 `this.$store.dispatch('update',data)`
    ...mapMutations({ UPDATEPARM: "UPDATE" }), //将 `this.UPDATEPARM(data)` 映射为 `this.$store.commit('UPDATE',data)`
    infoInit() {
      console.log('左菜单组件更新');
    },
    toMyProject(){
      let newUrl = this.$router.resolve({ path: '/Map/MyProject' });
      window.open(newUrl.href, "_blank");      
    }
  },
  beforeDestroy(){
    this.$bus.$off("init");
  }  
};
</script>

<style scoped>
.menuPanel {
  box-sizing: border-box;
  width: 330px;
  height: 100vh;
  border-right: 1px solid #dcdfe6;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menuTitle {
  width: 100%;
  display: flex;
  /* flex-direction: column; */
  justify-content: space-around;
  align-items: baseline;
}
</style>
