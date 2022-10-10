<template>
  <div class="mainPage">
    <ProjMenus></ProjMenus>
    <LayerEditPanel></LayerEditPanel>
    <!-- <StyleTemplate></StyleTemplate> -->
    <MapPanel></MapPanel>
  </div>  
</template>

<script>
import LayerEditPanel from "./LayerEditPanel.vue"; 
import MapPanel from "./MapPanel.vue"; 
// import StyleTemplate from "./StyleTemplate.vue"; 
import ProjMenus from "./ProjMenus.vue"; 
import requestApi from "@/api/requestApi";
import {mapActions,mapMutations} from 'vuex'
export default {
  components: { ProjMenus,MapPanel,LayerEditPanel },
  data() {
    return{
      // 项目工程参数
      mapProjectId: '',
      mapProjectInfo: '',

      // 地图相关信息
      zoom: 6,
      center: "119,32",
      spritePath: "",
      glyphsPath: "",
      sources: {},
      layers: [],      
      layersNameObject: {}, //检测重复  后端字段为layerTree
      layersName: [], //加载的图层id集合，用于展示图层按index的排列
      sourceNameObject: {}, //检测source重复

      // 样式模板
      originStyle: [],

      // 精灵图
      spriteNameSelect: '',

      // 发布
      publicBoolean: false,

    }
  },
  computed:{
  },
  mounted() {
    // this.$bus.$on("show", (data) => {
    //   //多级渲染显示
    //   if (data.param4) {
    //     switch (data.param4) {
    //       case "zoom":
    //         this.menuShowList[data.param1] = "Zoom Range";
    //         break;
    //       case "data":
    //         this.menuShowList[data.param1] = "Data Range";
    //         break;
    //       case "prop":
    //         this.menuShowList[data.param1] = "Data Condition";
    //         break;
    //       case "formula":
    //         this.menuShowList[data.param1] = "Expression";
    //         break;
    //     }
    //   }
    //   //编辑框初始化先获取所有tab的显示情况，单个tab修改时子组件给父组件传递单个tab变化值,params3用于保存attrValueSet
    //   if (data.param2 === 0) {
    //     this.menuButtonShowList = data.param1;
    //     this.layers[this.nowLayerIndex].attrShowList = data.param1;
    //     this.attrValueSet = data.param3;
    //   } else {
    //     const value1 = data.param1;
    //     const value2 = data.param2;
    //     this.menuButtonShowList[value1] = value2;
    //     this.layers[this.nowLayerIndex].attrShowList[value1] = value2;
    //     if (value2) {
    //       this.attrValueSet[value1] = "primary";
    //     }
    //   }
    // });
    this.mapProjectId = this.$route.params.mapProjectId;
    localStorage.setItem("mapProjectId", this.mapProjectId);
    this.getMapProjectInfo();
  },  
  methods:{
    // vuex
    ...mapActions({updateParm:'update'}),        //将 `this.updateParm(data)` 映射为 `this.$store.dispatch('update',data)`
    ...mapMutations({UPDATEPARM:'UPDATE'}),      //将 `this.UPDATEPARM(data)` 映射为 `this.$store.commit('UPDATE',data)`
    // #项目信息初始化
    getMapProjectInfo() {
      requestApi
        .getMapProjectById(this.mapProjectId)
        .then((res) => {
          this.mapProjectInfo = res.data.data;
          console.log("mapProjectInfo:", this.mapProjectInfo);
          // 初始项目参数
          this.center = this.mapProjectInfo.center.split(",");
          this.zoom = this.mapProjectInfo.zoom;
          this.spritePath = this.mapProjectInfo.sprite;
          const end = this.spritePath.lastIndexOf("/");
          this.spriteNameSelect = this.spritePath.substring(15, end);
          if (this.spriteNameSelect != "") {
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
                console.log("精灵图json", this.spriteJsonSelect);
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
          this.layersNameObject =
            JSON.stringify(this.mapProjectInfo.layerTree) == "{}"
              ? {}
              : this.mapProjectInfo.layerTree.layersNameObject;
          this.sourceNameObject =
            JSON.stringify(this.mapProjectInfo.layerTree) == "{}"
              ? {}
              : this.mapProjectInfo.layerTree.sourceNameObject;
          this.publicBoolean = this.mapProjectInfo.publicBoolean;
          for (const item of this.layers) {
            this.layersName.push(item.id);
            if (item.type != "background") {
              this.originStyle.push({
                paint: item["paint"],
                layout: item["layout"],
              });
            }
          }
          // 将相关参数放入vuex管理
          this.UPDATEPARM({parm:'mapProjectInfo',value:this.mapProjectInfo})          
          this.UPDATEPARM({parm:'layers',value:this.layers});
          this.UPDATEPARM({parm:'layersName',value:this.layersName});
          this.UPDATEPARM({parm:'layersNameObject',value:this.layersNameObject});
          this.UPDATEPARM({parm:'sourceNameObject',value:this.sourceNameObject});
          this.UPDATEPARM({parm:'originStyle',value:this.originStyle});
          document.title = "地图项目" + this.mapProjectInfo.name;

          // 加载完参数，其他组件开始初始化
          this.$bus.$emit("init");
        })
        .catch((error) => {
          console.log(error);
        });
    },   

  }    
}
</script>

<style scoped>
.mainPage{
  position: relative;
  width: 100%;
}
</style>