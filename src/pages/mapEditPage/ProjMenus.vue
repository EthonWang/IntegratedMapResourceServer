<template>
  <div class="menuPanel">
    <!-- 标题 -->
    <div class="menuTitle">
      <h2>{{ mapProjectInfo.name }}</h2>
      <el-divider class="divider"></el-divider>
    </div>
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
      // mapProjectInfo: '',
      // layersName: '',

      // 发布
      publicBoolean: false,
    };
  },
  computed: {
    ...mapState({
      // mapProjectInfoProp: "mapProjectInfo",
      // layersNameProp: "layersName",
      // layersProp: "layers",
      // sourcesProp: "sources",
    }),
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
    this.$bus.$on("init", () => {
      this.infoInit();
    });
  },
  methods: {
    // vuex
    ...mapActions({ updateParm: "update" }), //将 `this.updateParm(data)` 映射为 `this.$store.dispatch('update',data)`
    ...mapMutations({ UPDATEPARM: "UPDATE" }), //将 `this.UPDATEPARM(data)` 映射为 `this.$store.commit('UPDATE',data)`
    infoInit() {
      // 初始化公共参数
      // this.mapProjectInfo = this.mapProjectInfoProp;
      // this.layersName = this.layersNameProp;
      // this.layers = this.layersProp;
      // this.sources = this.sourcesProp;
    },
  },
  beforeDestroy(){
    this.$bus.$off("init");
  }  
};
</script>

<style scoped>
.menuPanel {
  width: 330px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menuTitle {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
