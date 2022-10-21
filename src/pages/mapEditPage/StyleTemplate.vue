<template>
    <div v-if="stylesBoxShow" class="stylesBox">
      <el-row type="flex" align="middle" class="stylesBoxTitle">
        <h4 style="margin: 10px; color: #409eff">可视化模板</h4>
        &nbsp;
        <el-popconfirm title="确认返回原样式吗？" @confirm="returnOriginStyle">
          <i
            slot="reference"
            class="el-icon-refresh-left iconBtn"
            title="返回原样式"
          ></i>
        </el-popconfirm>
        <i
          class="el-icon-upload iconBtn"
          style="margin: 0 5px"
          title="将该图层模板上传到样式库"
          @click="createTypeStyle(layers[nowLayerIndex])"
        ></i>
        <i
          class="el-icon-close close-button"
          @click="stylesBoxShow = false"
        ></i>
      </el-row>
      <el-collapse accordion class="templateCol" value="first">
        <el-collapse-item name="first">
          <template slot="title">
            <h4 style="margin-left: 10px">自定义样式库</h4>
            &nbsp;
            <!-- <i class="el-icon-circle-plus iconBtn"></i> -->
          </template>
          <el-row
            type="flex"
            justify="start"
            style="flex-wrap: wrap; border-top: 1px solid #ebeef5"
          >
            <el-card
              v-for="(item, index) in typeStyleBase[styleTypeSelect]"
              :key="index"
              class="templateCard cursor"
              shadow="hover"
              @click.stop.native="addTypeStyle(item)"
            >
              <el-popconfirm
                title="确定删除吗？"
                @confirm="tempCardDelete(item.id)"
              >
                <i
                  class="el-icon-remove-outline tempDeleBtn"
                  slot="reference"
                  @click.stop
                ></i>
              </el-popconfirm>
              <el-image
                style="
                  width: 100%;
                  height: 110px;
                  border-bottom: 1px solid #dcdfe6;
                "
                :src="item.styleImgUrl.ImgUrl"
                fit="fill"
              ></el-image>
              <el-row
                type="flex"
                align="middle"
                justify="center"
                class="tempCardName"
              >
                <span>{{ item.description }}</span>
              </el-row>
            </el-card>
          </el-row>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            <h4 style="margin-left: 10px">mbTile样式库</h4>
            &nbsp;
            <!-- <i class="el-icon-circle-plus iconBtn"></i> -->
          </template>
          <el-collapse accordion value="first">
            <el-collapse-item
              v-for="(item, index) in mbTileJsonList"
              :key="index"
            >
              <template slot="title">
                <h4 style="margin-left: 20px; color: #9e9399">
                  {{ item.name }}
                </h4>
                &nbsp;
              </template>
              <el-row class="mbTileCollapse">
                <el-row type="flex" align="middle">
                  <h4>特定样式:</h4>
                  &nbsp;
                  <el-select
                    v-model="templateStyleSelect"
                    placeholder="请选择"
                    style="width: 73%"
                    @change="templateStyleChange($event)"
                  >
                    <el-option
                      v-for="item in mbTileStyleList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-row>
                <!-- 非mbTile样式 -->
                <el-table
                  v-if="layerSource != 'mbSource'&&layerSource != 'mbStyle'"
                  :data="
                    tempStyleLayers.filter(
                      (data) => data.type == styleTypeSelect
                    )
                  "
                  height="600"
                >
                  <el-table-column
                    property="id"
                    width="200"
                    show-overflow-tooltip
                    label="style"
                  ></el-table-column>
                  <el-table-column width="120">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="primary"
                        @click="addMbTileToSelf(scope.row)"
                        >应用样式
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- mbSource样式 -->
                <el-table
                  v-if="layerSource == 'mbSource'"
                  :data="
                    tempStyleLayers.filter(
                      (data) => data['source-layer'] == layers[nowLayerIndex]['originName']
                    )
                  "
                  height="600"
                >
                  <el-table-column
                    property="id"
                    width="210"
                    show-overflow-tooltip
                    label="style"
                  ></el-table-column>
                  <el-table-column width="100">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="primary"
                        @click="addMbTileToSelf(scope.row)"
                        >应用样式
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-table
                  v-if="layerSource == 'mbStyle'"
                  :data="
                    tempStyleLayers.filter(
                      (data) => data['source-layer'] == layers[nowLayerIndex]['source-layer']
                    )
                  "
                  height="600"
                >
                  <el-table-column
                    property="id"
                    width="210"
                    show-overflow-tooltip
                    label="style"
                  ></el-table-column>
                  <el-table-column width="100">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="primary"
                        @click="addMbTileToSelf(scope.row)"
                        >应用样式
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>
      </el-collapse>
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
      // mapProjectInfo: '',
      // layersName: '',
      // layers: '',
      // nowLayerIndex: 0,
      // originStyle: {},          //图层初始样式，用于应用类型样式后还原样式，注意图层顺序改变时及时更改

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
      mbTileJsonList: [],     // 构造方式为先获取非OSM的mbTile信息，之后再开头添加OSM
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
      mbTileStyleSelect: "", //储存对应mbtile下style的id
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
    ...mapState({
      // mapProjectInfoProp:'mapProjectInfo',
      // layersNameProp:'layersName',
      // layersProp:'layers',
      // nowLayerIndexProp:'nowLayerIndex',
      // originStyleProp:'originStyle',
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
    layers:{
      get(){
        return this.$store.state.layers;
      },
      set(val) {
        this.UPDATEPARM({ parm: "layers", value: val })
      }      
    },
    layersName:{
      get(){
        return this.$store.state.layersName;
      },
      set(val) {
        this.UPDATEPARM({ parm: "layersName", value: val })
      }      
    },
    nowLayerIndex:{
      get(){
        return this.$store.state.nowLayerIndex;
      },
      set(val) {
        this.UPDATEPARM({ parm: "nowLayerIndex", value: val })
      }      
    },    
    originStyle:{
      get(){
        return this.$store.state.originStyle;
      },
      set(val) {
        this.UPDATEPARM({ parm: "originStyle", value: val })
      }      
    },     
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
        case 'open':                 // data:{type:'',index:'',layer:''}    #需要index是用于将修改后的layer更新到对应的layers中
          this.openTemplateEdit(data.index,data.layer);
          break;
      }
    })    
  },
  methods:{
    // vuex
    ...mapActions({updateParm:'update'}),        //将 `this.updateParm(data)` 映射为 `this.$store.dispatch('update',data)`
    ...mapMutations({UPDATEPARM:'UPDATE'}),      //将 `this.UPDATEPARM(data)` 映射为 `this.$store.commit('UPDATE',data)`

    // 初始化相关参数
    infoInit(){
      // 初始化vuex管理参数
      // this.mapProjectInfo = this.mapProjectInfoProp;
      // this.layersName = this.layersNameProp;
      // this.layers = this.layersProp;
      // this.nowLayerIndex = this.nowLayerIndexProp;
      // this.originStyle = this.originStyleProp;

    },  
    openTemplateEdit(index,layer) {
      // 先关闭图层编辑框避免冲突
      this.$bus.$emit('mapEdit',{type:'off'});
      // 更新nowLayerIndex
      this.UPDATEPARM({parm:'nowLayerIndex',value:index});
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
      const type = layer.type;              // 点线面等类型
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
            );  // 获取非mbTiles源数据列表
            this.mbTileJsonList.unshift({
              id: "OSM",
              name: "OSM (OpenStreetMap)",
            }); // 首位添加OSM数据
            this.mbTileSelect = JSON.parse(
              JSON.stringify(this.mbTileJsonList[0].id)
            );  // 默认选中第一个
            this.getStyleListById(this.mbTileSelect); //初始化第一个mbtile包含的样式数据
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 获取mbTile的styleJson列表
    getStyleListById(id) {
      if (id == "OSM") {        // 获取OSM下的style列表
        requestApi
          .getOsmStyleTemplateList()
          .then((res) => {
            if (res.data.data.length != 0) {
              this.mbTileStyleList = res.data.data;
              console.log("mbTileStyleList", this.mbTileStyleList);
                // 等getStyleListById执行完得到mbTileStyleList数据
              if (this.templateStyleSelect == "") {
                this.templateStyleSelect = this.mbTileStyleList[0].id; //先默认为第一个
                this.templateStyleJson = this.mbTileStyleList[0]; //先默认为第一个
                this.tempStyleLayers = this.templateStyleJson.layers;
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
              // 等getStyleListById执行完得到mbTileStyleList数据
              if (this.templateStyleSelect == "") {
                this.templateStyleSelect = this.mbTileStyleList[0].id; //先默认为第一个
                this.templateStyleJson = this.mbTileStyleList[0]; //先默认为第一个
                this.tempStyleLayers = this.templateStyleJson.layers;
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
    //回撤到原来样式
    returnOriginStyle() {
      const style = this.originStyle[this.nowLayerIndex];
      // 浅拷贝，layer对应layer会受aimLayer改变而改变
      const aimLayer = this.layers[this.nowLayerIndex];
      console.log('style',style,this.nowLayerIndex);   
      aimLayer.paint = JSON.parse(JSON.stringify(style.paint));
      aimLayer.layout = JSON.parse(JSON.stringify(style.layout));
      console.log("应用完图层样式", aimLayer);
      this.handleRemoveLayer(aimLayer.id);
      if (this.nowLayerIndex === 0) {
        this.addLayerToMap(true,aimLayer,true);
      } else {
        this.addLayerToMap(false,{id:this.layers[this.nowLayerIndex - 1].id,layer:aimLayer},true);
      }
      this.UPDATEPARM({parm:'layers',value:this.layers});
    },
    //添加选中图层至样式库
    createTypeStyle(layer) {
      console.log("layer", this.layers,this.nowLayerIndex);
      this.$bus.$emit("map",{type:'canvasSrc'});
      setTimeout(() => {
        // const canvasSrc = map.getCanvas().toDataURL("image/png");
        const canvasSrc = localStorage.getItem("canvasSrc");
        const body = {
          layout: layer.layout,
          paint: layer.paint,
          type: this.styleTypeSelect,
          styleImgUrl: { ImgUrl: canvasSrc },
          description: "",
        };
        this.$prompt("请输入样式名称", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(({ value }) => {
            body.description = value;
            requestApi.createTypeStyle(body).then((res) => {
              this.$message.success(res.data.data);
              this.getTypeStyleList(this.styleTypeSelect);
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消样式上传",
            });
          });
      }, 500);
    },
    // 删除自定义模板样式
    tempCardDelete(id) {
      requestApi
        .deleteTypeStyle(id)
        .then((res) => {
          this.$message.success(res.data.data);
          this.getTypeStyleList(this.styleTypeSelect);
        })
        .catch(() => {
          this.$message.info("删除失败");
        });
    },
    // 切换样式模板中的style
    templateStyleChange(val) {
      let index = 0;
      this.mbTileStyleList.forEach((e, ind) => {
        if (e.id == val) {
          index = ind;
          this.templateStyleSelectIndex = ind;
        }
      });
      this.templateStyleJson = this.mbTileStyleList[index];
      this.tempStyleLayers = this.templateStyleJson.layers;
    },
    //添加对应的类型样式
    addTypeStyle(row) {
      //先更新原样式
      let aimLayer = this.layers[this.nowLayerIndex];
      this.originStyle[this.nowLayerIndex].paint = JSON.parse(
        JSON.stringify(aimLayer.paint)
      );
      this.originStyle[this.nowLayerIndex].layout = JSON.parse(
        JSON.stringify(aimLayer.layout)
      );
      aimLayer.paint = JSON.parse(JSON.stringify(row.paint));
      aimLayer.layout = JSON.parse(JSON.stringify(row.layout));
      console.log("应用完图层样式", aimLayer);
      this.handleRemoveLayer(aimLayer.id);
      if (this.nowLayerIndex === 0) {
        this.addLayerToMap(true,aimLayer,true);
      } else {
        this.addLayerToMap(false,{id:this.layers[this.nowLayerIndex - 1].id,layer:aimLayer},true);
      }
      // 更新vuex
      this.UPDATEPARM({parm:'layers',value:this.layers});
      this.UPDATEPARM({parm:'originStyle',value:this.originStyle});
    },
    //给自己数据添加mbTile样式，不需要filter属性
    addMbTileToSelf(row) {
      //只替换paint和layout的相关属性
      console.log("row", row);
      //先更新原样式
      let aimLayer = this.layers[this.nowLayerIndex];
      this.originStyle[this.nowLayerIndex].paint = JSON.parse(
        JSON.stringify(aimLayer.paint)
      );
      this.originStyle[this.nowLayerIndex].layout = JSON.parse(
        JSON.stringify(aimLayer.layout)
      );
      if ("layout" in row) {
        for (let key in row.layout) {
          aimLayer.layout[key] = JSON.parse(JSON.stringify(row.layout[key]));
        }
      }
      if ("paint" in row) {
        for (let key in row.paint) {
          aimLayer.paint[key] = JSON.parse(JSON.stringify(row.paint[key]));
        }
      }
      //先改参数再更新图层，打开图层编辑框
      console.log(
        "apply",
        row,
        "style to",
        this.layers[this.nowLayerIndex].originName
      );
      console.log("应用完Mbtile图层样式", aimLayer);
      this.handleRemoveLayer(aimLayer.id);
      if (this.nowLayerIndex === 0) {
        this.addLayerToMap(true,aimLayer,true);
      } else {
        this.addLayerToMap(false,{id:this.layers[this.nowLayerIndex - 1].id,layer:aimLayer},true);
      }
      //更新图层编辑框样式
      this.$bus.$emit("mapEdit",{type:'open',index:this.nowLayerIndex,layer:aimLayer});
      // this.handleLayerEdit(this.nowLayerIndex, aimLayer);
      // 更新vuex
      this.UPDATEPARM({parm:'layers',value:this.layers});
      this.UPDATEPARM({parm:'originStyle',value:this.originStyle});      
    },    


    // #对map组件的封装
    handleRemoveLayer(layerName) {
      const data = {
        type:'removeLayer',
        id:layerName
      }
      this.$bus.$emit("map",data);      
    },  
    //向地图添加layer
    addLayerToMap(flag, val, isReplace) {
      if (flag) {
        const data = {
          type: "addLayer1",
          layer: val,
          isReplace: isReplace        // 当图层时替换时，不需要对图层树进行更改(用isReplace进行判断)
        };
        this.$bus.$emit("map", data);
      } else {
        // flag=false表示添加在指定图层后
        const data = {
          type: "addLayer2",
          id: val.id,
          layer: val.layer,
          isReplace: isReplace
        };
        this.$bus.$emit("map", data);
      }
    },             

         
  },
  beforeDestroy(){
    this.$bus.$off("init");
    this.$bus.$off("styleTemp");
  }  
}
</script>

<style scoped>
/* 样式框样式 */
.stylesBox {
  position: absolute;
  top: 0;
  background-color: white;
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
  height: 100vh;
  width: 350px;
  margin-left: 330px;
  z-index: 99;
}
/* 样式框标题 */
.stylesBoxTitle {
  height: 40px;
  border-bottom: 1px #dcdfe6;
  /* background-color: ; */
}
.stylesBoxTitle .iconBtn{
  font-size: 20px;
}
/* 模板折叠框样式 */
.templateCol .el-collapse-item__wrap:nth-child(1) {
  max-height: 550px;
  overflow-y: scroll;
}
.templateCol .el-collapse-item__wrap:nth-child(2) {
  max-height: calc(100vh - 200px);
  overflow-y: hidden;
}
.templateCol .el-collapse-item__wrap::-webkit-scrollbar {
  width: 0px;
}
/* 模板展示框样式 */
.templateCard {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  height: 150px;
  width: 150px;
  margin: 5px 10px;
}
.templateCard .el-card__body {
  padding: 0;
}
/* 模板名称样式 */
.tempCardName {
  padding: 0 25px;
}
.tempCardName span {
  width: 100px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
/* 样式删除按钮 */
.tempDeleBtn {
  position: absolute;
  color: #dcdfe6;
  font-size: 20px;
  right: 2px;
  top: 120px;
  z-index: 1;
}
.tempDeleBtn:hover {
  color: red;
}
/* mbTile折叠框内容样式 */
.mbTileCollapse {
  width: 100%;
  padding: 10px 0px 00px 20px;
  border-top: 1px solid #dcdfe6;
}
</style>