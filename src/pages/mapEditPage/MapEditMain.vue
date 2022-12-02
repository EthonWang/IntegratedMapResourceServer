<template>
  <div class="mainPage" v-if="showList['main']">
    <ProjMenus></ProjMenus>
    <LayerEditPanel v-if="showList['editor']"></LayerEditPanel>
    <StyleTemplate v-if="showList['style']"></StyleTemplate>
    <MapPanel v-if="showList['map']"></MapPanel>
  </div>
</template>

<script>
import LayerEditPanel from "./LayerEditPanel.vue";
import MapPanel from "./MapPanel.vue";
import StyleTemplate from "./StyleTemplate.vue";
import ProjMenus from "./ProjMenus.vue";
import requestApi from "@/api/requestApi";
import { mapState, mapActions, mapMutations } from "vuex";
import projInit from "@/serve/parameterInit";
export default {
  name: 'MapEditMain',
  components: { ProjMenus, MapPanel, LayerEditPanel, StyleTemplate },
  data() {
    return {
      // 全局参数
      showList:{main:true,editor:true,style:true,map:true},   // 控制组件显示，用于组件刷新
      projectShow: true,
      editorShow: true,
      styleShow: true,

      // 项目工程参数
      mapProjectId: "",
      mapProjectInfo: "",

      // 地图相关信息
      zoom: 6,
      center: "119,32",
      spritePath: "",
      glyphsPath: "",
      sources: {},
      layers: [],
      layersTree: [],
      layersNameObject: {}, //检测重复  后端字段为nameObject
      sourceNameObject: {}, //检测source重复

      // 样式模板
      originStyle: [],

      // 精灵图
      spriteNameSelect: "",

      // 发布
      publicBoolean: false,
    };
  },
  computed: {
    ...mapState({}),
  },
  mounted() {
    this.mapProjectId = this.$route.params.mapProjectId;
    localStorage.setItem("mapProjectId", this.mapProjectId);
    this.getMapProjectInfo();
    this.$bus.$on("main",(data)=>{
      switch (data.type){
        case 'reload':        // {type:'',name:''}      name有[main,menu,editor,style,map]
          this.reload(data.name);
      }
    });
  },
  methods: {
    // vuex
    ...mapActions({ updateParm: "update" }), //将 `this.updateParm(data)` 映射为 `this.$store.dispatch('update',data)`
    ...mapMutations({ UPDATEPARM: "UPDATE" }), //将 `this.UPDATEPARM(data)` 映射为 `this.$store.commit('UPDATE',data)`
    // #项目信息初始化
    getMapProjectInfo() {
      requestApi
        .getMapProjectById(this.mapProjectId)
        .then((res) => {
          this.mapProjectInfo = res.data.data;
          console.log("mapProjectInfo:", this.mapProjectInfo);
          // 初始项目参数
          this.center = this.mapProjectInfo.center;
          this.zoom = this.mapProjectInfo.zoom;
          this.spritePath = this.mapProjectInfo.sprite;
          const end = this.spritePath.lastIndexOf("/");
          this.spriteNameSelect = this.spritePath.substring(15, end);
          if (this.spriteNameSelect != "mpx_sprite") {
            const url =
              this.reqUrl +
              "/store/sprites/" +
              this.spriteNameSelect +
              "/" +
              "sprite.json";
            fetch(url)
              .then((res) => {
                return res.json();
              })
              .then((json) => {
                this.spriteJsonSelect = json;
              });
            this.spritePngSelect =
              this.reqUrl +
              "/store/sprites/" +
              this.spriteNameSelect +
              "/" +
              "sprite.png";
          }
          this.glyphsPath = this.mapProjectInfo.glyphs;
          this.sources = this.mapProjectInfo.sources;
          this.layers = this.mapProjectInfo.layers;
          this.layersTree = this.mapProjectInfo.layersTree;
          this.layersNameObject =
            JSON.stringify(this.mapProjectInfo.nameObject) == "{}"
              ? {}
              : this.mapProjectInfo.nameObject.layersNameObject;
          this.sourceNameObject =
            JSON.stringify(this.mapProjectInfo.nameObject) == "{}"
              ? {}
              : this.mapProjectInfo.nameObject.sourceNameObject;
          this.publicBoolean = this.mapProjectInfo.publicBoolean;
          for (const item of this.layers) {
            if (item.type != "background") {
              this.originStyle.push({
                paint: item["paint"],
                layout: item["layout"],
              });
            }
          }
          let sourceKeyList = Object.keys(this.sources);
          console.log("source的列表",sourceKeyList,!sourceKeyList[0].indexOf('_'));
          if(this.mapProjectInfo.layers.length > 0 && this.mapProjectInfo.nameObject == "{}" && sourceKeyList[0].indexOf('_') == -1){
            let object = projInit(this.layers,this.sources,this.layersTree);
            console.log("初始化结果",object);
            // this.layers = object.layerRes;
            // this.sources = object.sourceRes;
            // this.layersNameObject = object.layerObj;
            // this.sourceNameObject = object.sourceObj;
          }
          // 将相关参数放入vuex管理
          this.UPDATEPARM({
            parm: "mapProjectInfo",
            value: this.mapProjectInfo,
          });
          this.UPDATEPARM({ parm: "layers", value: this.layers });
          this.UPDATEPARM({ parm: "sources", value: this.sources });
          this.UPDATEPARM({
            parm: "layersNameObject",
            value: this.layersNameObject,
          });
          this.UPDATEPARM({
            parm: "sourceNameObject",
            value: this.sourceNameObject,
          });
          this.UPDATEPARM({ parm: "originStyle", value: this.originStyle });
          this.UPDATEPARM({ parm: "layersTree", value: this.layersTree });
          this.UPDATEPARM({ parm: "publicBoolean", value: this.publicBoolean });
          document.title = "地图项目" + this.mapProjectInfo.name;

          // 加载完参数，其他组件开始初始化
          this.$bus.$emit("init");
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 用于组件刷新
    reload(name){
      this.showList[name] = false;
      this.$nextTick(()=>{
        this.showList[name] = true;
        if(name == 'main'){
          this.getMapProjectInfo();   // 本组件不刷新，内部组件刷新,要刷新本组件时触发初始化函数
        }
      })
    },
  },
  beforeDestroy() {
    this.$bus.$off("main");
  },  
};
</script>

<style scoped>
.mainPage {
  position: relative;
  width: 100%;
}
</style>
