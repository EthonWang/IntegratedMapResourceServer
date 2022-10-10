<template>
  <div>

  </div>
</template>
<script>
import requestApi from "@/api/requestApi";
import {mapState,mapActions,mapMutations} from 'vuex'

export default {
  name: "LayerEditPanel",
  props: [],
  data() {
    return{
      // vuex参数
      mapProjectInfo: '',
      layersName: '',
      layers: '',
      nowLayerIndex: 0,
      originStyle: {},          //图层初始样式，用于应用类型样式后还原样式，注意图层顺序改变时及时更改

      // 公共参数
      stylesBoxShow: false,
      layerSource: '',          // 用于判断当前图层的数据源，依据图层的matadata属性中的'mapbox:type'属性
                                // 分为mbStyle、mbSource、primary
      styleTypeSelect: "",
      //类型样式列表
      typeStyleBase: {
        circle: [],
        line: [],
        fill: [],
        "fill-extrusion": [],
        symbol: [],
      },
      //mbTile模板样式
      templateStyleSelect: "", //mbTile模板的styleJson选择
      templateStyleJson: {},
      templateStyleSelectIndex: 0, //  记录选择的数据下标
      tempStyleLayers: [],

      //mbtile
      mbTileJsonList: [],
      mbTileSelect: "", //储存所选mbTile的id数据
      mbTileSelectIndex: 0, //  记录选择的数据下标
      mbTileInfo: {},   // mbTile存在数据库中的信息，tileJsonId记录描述信息
      mbTileJson: {},   // 通过tileJsonId获取的描述信息
      mbJsonSource: {
        mbtiles1: "mbtilesSource1",
        mbtiles2: "mbtilesSource2",
        mbtiles3: "mbtilesSource3",
        mbtiles4: "mbtilesSource4",
      },
      stylePatch: { id: "" },
      // mbTileEditShow: false,     //功能移出，暂不用
      addMbTileStyleShow: false,
      mbTileEditInfo: { mbTilesJsonFile: null }, //作为对象，为之后上传文件加其余字段做准备
      //mbTile样式功能
      isStyle: false, //初始mbtile默认添加的是vector_layer数据,true表示为添加style样式
      mbTileStyleSelect: "", //储存所选的mbtile的样式id
      mbTileStyleList: [],
      mbTileStyleJson: {},
      mbTileStyleSelectIndex: 0, //  记录选择的数据下标
      styleLayers: [],
      mbTileStyleEditShow: false,
      mbTileStyleInfo: { mapStyleFile: null, tileJsonId: "" },
      layerType: [
        "circle",
        "line",
        "fill",
        "fill-extrusion",
        "symbol",
        "background",
        "heatmap",
      ],
    }
  },
  computed:{
    ...mapState({mapProjectInfoProp:'mapProjectInfo',
                 layersNameProp:'layersName',
                 layersProp:'layers',
                 nowLayerIndexProp:'nowLayerIndex',
                 originStyleProp:'originStyle',}),  
  },  
  mounted(){   
    // 等初始组件信息加载完
    this.$bus.$on("init",()=>{
      this.infoInit();
    })   
    this.$bus.$on("styleTemp",(data)=>{
      switch (data.type) {
        case 'off':                  // data:{type:''}
          this.stylesBoxShow = false;
          break;
        case 'open':                 // data:{type:'',layerName:'',key:'',value:''}
          this.handleLayerEdit(data.layerName,data.key,data.value);
          break;
      }
    })    
    this.spriteInit();
  },
  methods:{
    // vuex
    ...mapActions({updateParm:'update'}),        //将 `this.updateParm(data)` 映射为 `this.$store.dispatch('update',data)`
    ...mapMutations({UPDATEPARM:'UPDATE'}),      //将 `this.UPDATEPARM(data)` 映射为 `this.$store.commit('UPDATE',data)`

    // 初始化相关参数
    infoInit(){
      // 初始化vuex管理参数
      this.mapProjectInfo = this.mapProjectInfoProp;
      this.layersName = this.layersNameProp;
      this.layers = this.layersProp;
      this.nowLayerIndex = this.nowLayerIndexProp;
      this.originStyle = this.originStyleProp;
    },  
    openTemplateEdit(layer) {
      // 先关闭图层编辑框避免冲突
      this.$bus.$emit('mapEdit',{type:'off'});
      this.editorShow = false;
      // 判断当前页面数据是否为mbtile,以及是否为osm数据
      const datatype = layer['metadata']['mapbox:type'];
      switch(datatype){
        case 'mbSource':
          this.layerSource = 'mbSource';
          break;
        case 'mbStyle':
          this.layerSource = 'mbStyle';
          break;
        case 'TMS':
          this.layerSource = 'TMS';
          break;
        default:
          this.layerSource = 'primary';
          break;   
      }
      this.styleTypeSelect = layer.type;
      const type = layer.type;
      this.getTypeStyleList(type);
      this.getOsmMbList();
      this.stylesBoxShow = true;
    },   
    //获取地图的类型样式列表
    getTypeStyleList(type) {
      requestApi
        .getTypeStyleList(type)
        .then((res) => {
          if (res.data.code == 0) {
            this.typeStyleBase[type] = res.data.data;
            console.log("typeStyleBase", this.typeStyleBase);
          } else {
            console.log(res.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },     
    //获取osm数据和非osm数据的mbTiles列表
    getOsmMbList() {
      requestApi
        .getMbtilesList()
        .then((res) => {
          if (res.data.data.length != 0) {
            const mbOriginList = res.data.data;
            this.mbTileJsonList = mbOriginList.filter(
              (data) => !data.osmMbtilesBoolean
            ); //获取非mbTiles源数据列表
            this.mbTileJsonList.unshift({
              id: "OSM",
              name: "OSM (OpenStreetMap)",
            }); //首位添加OSM数据
            this.mbTileSelect = JSON.parse(
              JSON.stringify(this.mbTileJsonList[0].id)
            );
            this.getStyleListById(this.mbTileSelect, true); //初始化第一个mbtile包含的样式数据
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 获取mbTile的styleJson列表
    getStyleListById(id, isCallBack) {
      if (this.mbTileInfo.osmMbtilesBoolean || id == "OSM") {
        requestApi
          .getOsmStyleTemplateList()
          .then((res) => {
            if (res.data.data.length != 0) {
              this.mbTileStyleList = res.data.data;
              console.log("mbTileStyleList", this.mbTileStyleList);
              //mbTileStyle先默认为第一个数据
              this.mbTileStyleSelect = this.mbTileStyleList[0].id;
              this.mbTileStyleJson = this.mbTileStyleList[0];
              this.styleLayers = this.mbTileStyleJson.layers;
              if (isCallBack) {
                // 等getStyleListById执行完得到mbTileStyleList数据
                console.log("dataLayers", this.mbTileStyleList);
                if (this.templateStyleSelect == "") {
                  this.templateStyleSelect = this.mbTileStyleList[0].id; //先默认为第一个
                  this.templateStyleJson = this.mbTileStyleList[0]; //先默认为第一个
                  this.tempStyleLayers = this.templateStyleJson.layers;
                }
              }
            } else {
              this.mbTileStyleList = [];
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        requestApi
          .getStyleListById(id)
          .then((res) => {
            if (res.data.data.length != 0) {
              this.mbTileStyleList = res.data.data;
              console.log("mbTileStyleList", this.mbTileStyleList);
              //mbTileStyle先默认为第一个数据
              this.mbTileStyleSelect = this.mbTileStyleList[0].id;
              this.mbTileStyleJson = this.mbTileStyleList[0];
              this.styleLayers = this.mbTileStyleJson.layers;
              if (isCallBack) {
                // 等getStyleListById执行完得到mbTileStyleList数据
                console.log("dataLayers", this.mbTileStyleList);
                if (this.templateStyleSelect == "") {
                  this.templateStyleSelect = this.mbTileStyleList[0].id; //先默认为第一个
                  this.templateStyleJson = this.mbTileStyleList[0]; //先默认为第一个
                  this.tempStyleLayers = this.templateStyleJson.layers;
                }
              }
            } else {
              this.mbTileStyleList = [];
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },    
         
  }
}
</script>

<style scoped>

</style>