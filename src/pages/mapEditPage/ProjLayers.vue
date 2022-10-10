<template>
  <div>

  </div>
</template>
<script>
// import requestApi from "../../api/requestApi";
import {mapState,mapActions,mapMutations} from 'vuex'

export default {
  name: "LayersList",
  props: [],
  data() {
    return{
      // vuex参数
      mapProjectInfo: '',
      layersName: '',
      layers: '',
      nowLayerIndex: 0,
      originStyle: {}
    }
  },
  computed:{
    ...mapState({mapProjectInfoProp:'mapProjectInfo',
                 layersNameProp:'layersName',
                 layersProp:'layers',
                 nowLayerIndexProp:'nowLayerIndex',
                 originStyleProp:'originStyle',
                 sourcesProp:'sources'}),    
  },   
  mounted() {
    // 等初始组件信息加载完
    this.$bus.$on("init",()=>{
      this.infoInit();
    })

  }, 
  methods:{
    // vuex
    ...mapActions({updateParm:'update'}),        //将 `this.updateParm(data)` 映射为 `this.$store.dispatch('update',data)`
    ...mapMutations({UPDATEPARM:'UPDATE'}),      //将 `this.UPDATEPARM(data)` 映射为 `this.$store.commit('UPDATE',data)`
    infoInit(){
      // 初始化vuex管理参数
      this.mapProjectInfo = this.mapProjectInfoProp;
      this.layersName = this.layersNameProp;
      this.layers = this.layersProp;
      this.nowLayerIndex = this.nowLayerIndexProp;
      this.originStyle = this.originStyleProp;
    },


    // #单图层操作
    // 单个图层开关
    handleLayerShowSwitchChange(val, row) {
      if (val) {
        this.handleLayoutChange(row.id, "visibility", "visible");
      } else {
        this.handleLayoutChange(row.id, "visibility", "none");
      }
    },   
    // 删除单图层
    handleLayerDelete(index, row) {
      console.log("ready delete layer:", row);
      // 先关闭图层样式编辑框，防止报错
      this.$bus.$emit("mapEdit",{type:'off'});
      let aimSource = row.source;
      let layerOriginName = row.originName;
      let layerid = row.id;
      this.layers.splice(index, 1);
      this.layersName.splice(index, 1);
      this.originStyle.splice(index, 1);
      this.layersNameObject[layerOriginName] -= 1;
      this.handleRemoveLayer(layerid);
      //如果没有layer使用source，则删除source
      if (this.layersNameObject[layerOriginName] === 0) {
        delete this.layersNameObject[layerOriginName];
        //mbTile不删除source，背景没有source
        if (row.sourceType != "mbTile" && row.type != "background") {
          this.handleRemoveSource(aimSource);
          delete this.sources[aimSource];
          for (let key in this.sourceNameObject) {
            if (this.sourceNameObject[key] === aimSource) {
              delete this.sourceNameObject[key];
              break;
            }
          }
          //source没有再使用时,删除后台的tileJson
          this.deleteTileJson(row.source);
        }
      }
      // vuex更新参数状态
      this.UPDATEPARM({parm:'layers',value:this.layers});
      this.UPDATEPARM({parm:'sources',value:this.sources});
      this.UPDATEPARM({parm:'layersName',value:this.layersName});
      this.UPDATEPARM({parm:'originStyle',value:this.originStyle});
      this.UPDATEPARM({parm:'layersNameObject',value:this.layersNameObject});
      this.UPDATEPARM({parm:'sourceNameObject',value:this.sourceNameObject});
    },     
   

    // #多图层操作
    // 一键添加
    allLayerShowSwitchChange(val) {
      for (let i in this.layers) {
        const item = this.layers[i];
        this.layers[i].show = val;
        this.handleLayerShowSwitchChange(val, item);
      }
    },   
    // 一键删除
    allLayerDelete(){
      // 先关闭图层样式编辑框，防止报错
      this.$bus.$emit("mapEdit",{type:'off'});      
      for (let i in this.layers) {
        let item = JSON.parse(JSON.stringify(this.layers[i]));
        let aimSource = item.source;
        let layerOriginName = item.originName;
        let layerid = item.id;
        this.layersNameObject[layerOriginName] -= 1;
        this.handleRemoveLayer(layerid);
        //如果没有layer使用source，则删除source
        if (this.layersNameObject[layerOriginName] === 0) {
          delete this.layersNameObject[layerOriginName];
          //mbTile不删除source，背景没有source
          if (item.sourceType != "mbTile" && item.type != "background") {
            this.handleRemoveSource(aimSource);
            delete this.sources[aimSource];
            for (let key in this.sourceNameObject) {
              if (this.sourceNameObject[key] === aimSource) {
                delete this.sourceNameObject[key];
                break;
              }
            }
            //source没有再使用时,删除后台的tileJson
            this.deleteTileJson(item.source);
          }
        }
      }
      // 循环完再进行视图数据初始化,避免循环中渲染。
      this.layers = [];
      this.layersName = [];
      this.originStyle = [];      

      // vuex更新参数状态
      this.UPDATEPARM({parm:'layers',value:this.layers});
      this.UPDATEPARM({parm:'sources',value:this.sources});
      this.UPDATEPARM({parm:'layersName',value:this.layersName});
      this.UPDATEPARM({parm:'originStyle',value:this.originStyle});
      this.UPDATEPARM({parm:'layersNameObject',value:this.layersNameObject});
      this.UPDATEPARM({parm:'sourceNameObject',value:this.sourceNameObject});      
    },



    // #对map组件方法的封装
    handleLayoutChange(layerName, key, value){
      const data = {
        type:'setLayout',
        layerName:layerName, 
        key:key, 
        value:value
      }
      this.$bus.$emit("map",data);
    },
    handlePaintChange(layerName, key, value){
      const data = {
        type:'setPaint',
        layerName:layerName, 
        key:key, 
        value:value
      }
      this.$bus.$emit("map",data);
    }, 
    handleRemoveSource(sourceName) {
      const data = {
        type:'removeSource',
        id:sourceName
      }
      this.$bus.$emit("map",data);
    },
    handleRemoveLayer(layerName) {
      const data = {
        type:'removeLayer',
        id:layerName
      }
      this.$bus.$emit("map",data);      
    },     
    // ##将地图定位到对应范围位置
    handleLayerClick(row) {
      const data = {
        type: 'mapFit',
        row: row,        // 点击的图层layer信息
      };
      this.$bus.$emit("map",data);
    },
    
    // #对地图样式编辑框组件的封装
    handleLayerEdit(index, row) {
      // 预先更新vuex参数给函数调用
      this.UPDATEPARM({parm:'nowLayerIndex',value:index});
      const data = {
        type:'open',
        layer:row,
      }
      this.$bus.$emit("mapEdit",data);
    }, 

    // 对样式模板组件的封装
    openTemplateEdit(index, row){
      // 预先更新vuex参数给函数调用
      this.UPDATEPARM({parm:'nowLayerIndex',value:index});
      const data = {
        type:'open',
        layer:row,
      }
      this.$bus.$emit("styleTemp",data);
    },
  }    
}
</script>

<style scoped>

</style>