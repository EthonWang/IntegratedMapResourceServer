<template>
  <!-- 工程项目按钮框 -->
  <div class="flexRowSpaceAround" style="width: 100%">
    <!-- 添加数据 -->
    <el-popover placement="right" width="300" trigger="click">
      <el-tabs value="PG" @tab-click="dataBaseClick">
        <el-tab-pane label="PG" name="PG">
          <el-row type="flex" align="middle">
            <h4>数据库源:&nbsp;</h4>
            <el-select
              v-model="PgBaseSelect"
              placeholder="请选择"
              style="width: 80%"
              @change="PgBaseChange($event)"
            >
              <el-option
                v-for="item in dataBaseList"
                :key="item.name"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-row>
          <el-table :data="shpTableData" height="313">
            <el-table-column
              property="originName"
              width="220"
              show-overflow-tooltip
              label="名称"
            ></el-table-column>
            <el-table-column width="80" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleAddShpLayer(scope.$index, scope.row)"
                  >添加
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="PgBaseSelect == 'defaultPG'"
            small
            @current-change="handleCurrentChangeShp"
            :current-page="currentPageShp"
            :page-size="pageSizeShp"
            layout="total, prev, pager, next"
            :total="totalDataCountShp"
            class="flexRowCenter"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="mbTiles" name="mbTile">
          <el-row type="flex" align="middle">
            <h4>数据库源:&nbsp;</h4>
            <el-select
              v-model="mbTileSelect"
              placeholder="请选择"
              style="width: 73%"
              @change="mbTileChange($event)"
            >
              <el-option
                v-for="item in mbTileJsonList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option> </el-select
            >&nbsp;
            <el-button
              type="success"
              size="mini"
              circle
              title="添加样式模板"
              icon="el-icon-plus"
              @click="addMbTileStyleShow = true"
            ></el-button>
            <el-dialog
              :title="
                this.mbTileInfo.osmMbtilesBoolean
                  ? 'OSM样式添加'
                  : '样式添加'
              "
              :visible.sync="addMbTileStyleShow"
              width="30%"
              :modal="false"
              center
            >
              <el-form
                label-position="right"
                label-width="150px"
                :model="stylePatch"
              >
                <el-form-item label="样式名称">
                  <el-select
                    v-model="stylePatch.id"
                    placeholder="选择要添加的样式"
                  >
                    <el-option
                      v-for="item in mbTileStyleList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <el-row type="flex">
                <span></span>
              </el-row>
              <span slot="footer" class="dialog-footer">
                <el-button @click="addMbTileStyleShow = false"
                  >取 消</el-button
                >&nbsp;
                <el-button
                  slot="reference"
                  type="warning"
                  @click="
                    addAllStyles(styleLayers);
                    addMbTileStyleShow = false;
                  "
                  >全部添加</el-button
                >
              </span>
            </el-dialog>
          </el-row>
          <el-table v-if="!isStyle" :data="dataLayers" height="313">
            <el-table-column
              property="id"
              width="200"
              show-overflow-tooltip
              label="source"
            ></el-table-column>
            <el-table-column width="100">
              <template slot="header">
                <el-popconfirm
                  title="确定添加全部数据样式吗？"
                  @confirm="addAllSources(dataLayers)"
                >
                  <el-button slot="reference" type="warning" size="mini"
                    >全部添加</el-button
                  >
                </el-popconfirm>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleAddShpLayer(scope.$index, scope.row)"
                  >添加
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="TMS" name="TMS">
          <el-table
            :data="urlBase[dataBaseSelect]"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="名称">
            </el-table-column>
            <el-table-column width="80" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleAddShpLayer(scope.$index, scope.row)"
                  >添加
                </el-button>
              </template>
            </el-table-column>                  
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <el-button
        type="primary"
        size="mini"
        slot="reference"
        @click="addShpData"
        >添加数据</el-button
      >
    </el-popover>
    <el-button type="success" size="mini" @click="saveMap(true)">保存</el-button>
    <el-button
      v-if="!publicBoolean"
      type="warning"
      size="mini"
      @click="publicMap"
      >发布</el-button
    >
    <el-popover
      v-else
      placement="right"
      title="链接地址"
      width="200"
      trigger="hover"
    >
      <el-link
        type="primary"
        target="_blank"
        :underline="false"
        :href="reqUrl + '/mapProject/getPublishedMap/' + mapProjectId"
      >
        {{ reqUrl + "/mapProject/getPublishedMap/" + mapProjectId }}
      </el-link>
      <el-tag type="warning" slot="reference"> 已发布 </el-tag>
    </el-popover>
    <el-button
      type="danger"
      size="mini"
      @click="addBackground('multiPG', {})"
      >添加背景</el-button
    >
    <el-button type="primary" @click="test1">测试</el-button>
    <el-button type="primary" @click="test2">测试2</el-button>
    <el-button type="primary" @click="test3">测试3</el-button>
  </div>
</template>
<script>
import requestApi from "../../api/requestApi";
import {mapState,mapActions,mapMutations} from 'vuex'
import initTileJson from "@/assets/js/initTileJson";
import layerStyleProperties from "@/assets/js/layerStyleProperties";
import {renderSplit,filterSplit} from "@/serve/JsonToValue";

export default {
  name: "ProjButtons",
  props: [],
  data() {
    return{
      // 传递的参数
      sourceNameObject: {},      //检测source重复
      layersNameObject: {},      //检测重复  后端字段为nameObject
      layers: [],
      sources:{},
      layersName: [],
      mapProjectId: '',
      originStyle: [],
      // #添加数据
        // 公用参数
      dataBaseSelect: 'defaultPG',     //选中的数据源，PG默认为defaultPG
      dataBaseList: [],
        // PG服务
      PgBaseSelect: "defaultPG",
      pgShpList: [],
      shpTableData: [],      
      currentPageShp: 1,
      pageSizeShp: 5,
      searchInputShp: "",      
      totalDataCountShp: 0,
        // OSM服务
      mbTileSelect: "",     //储存所选mbTile的id
      dataLayers: [],       //metadata中的vector_layer
      mbTileJsonList: [],
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
      mbsource:{
                'water_name':'symbol',
                'transportation_name':'symbol',
                'aerodrome_label':'circle',
                'globallandcover':'circle',
                'mountain_peak':'circle',
                'housenumber':'circle',
                'poi':'circle',
                'place':'circle',
                'transportation':'line',
                'boundary':'line',
                'aeroway':'line',
                'waterway':'line',
                'park':'fill',
                'landuse':'fill',
                'landcover':'fill',
                'water':'fill',
                'building':'fill',
                },
        // TMS服务
      urlBase: { TERRAIN: [], TMS: [], WMTS: [] },

      // #发布
      publicBoolean: false,

    }  
  },
  computed:{
    ...mapState({sourceNameObjectProp:'sourceNameObject',
                 layersNameObjectProp:'layersNameObject',
                 layersProp:'layers',
                 layersNameProp:'layersName',
                 sourcesProp:'sources',
                 originStyleProp:'originStyle'})
  },   
  mounted() {
    // 等初始组件信息加载完
    this.$bus.$on("init",()=>{
      this.infoInit();
    })

  },     
  methods: {
    test1(){
      this.$bus.$emit("mapEdit",{type:'open',layer:this.layers[0]});
    },
    test2(){
      this.$bus.$emit("styleTemp",{type:'open',index:0,layer:this.layers[0]});
    },
    test3(){
      let a = renderSplit(
        {
					"base": 1.2,
					"stops": [
						[
							14,
							0.5
						],
						[
							20,
							10
						]
					]
				}        
      )
      let b = filterSplit(
        [
          "all",
          [
            "==",
            "brunnel",
            "tunnel"
          ],
          [
            "in",
            "class",
            "service",
            "track"
          ]
        ]       
      )
      console.log("测试",a,b);
    },
    // vuex
    ...mapActions({updateParm:'update'}),        //将 `this.updateParm(data)` 映射为 `this.$store.dispatch('update',data)`
    ...mapMutations({UPDATEPARM:'UPDATE'}),      //将 `this.UPDATEPARM(data)` 映射为 `this.$store.commit('UPDATE',data)`
    // 初始化数据
    infoInit(){
      // 初始化公共参数
      this.sourceNameObject = this.sourceNameObjectProp;      
      this.layersNameObject = this.layersNameObjectProp;      
      this.layers = this.layersProp;
      this.layersName = this.layersNameProp;   
      this.sources = this.sourcesProp;
      this.originStyle = this.originStyleProp;
      // 初始化其余参数
      this.mapProjectId = localStorage.getItem("mapProjectId");
    },
    // #添加数据
    // ·点击事件
    async addShpData() {
      if (this.mbTileSelect == "") {
        await this.getMbtilesList();
      } else {
        this.getStyleListById(this.mbTileSelect, false);
      }
      //依据所选的mbTile，获取对应的styleJson

      if (this.PgBaseSelect == "defaultPG") {
        requestApi
          .getShpList({
            asc: false,
            page: this.currentPageShp,
            pageSize: this.pageSizeShp,
            searchText: this.searchInputShp,
            sortField: "createTime",
          })
          .then((res) => {
            console.log("shpbase", res.data);
            this.shpTableData = res.data.data.content;
            this.totalDataCountShp = res.data.data.totalElements;
          })
          .catch((error) => {
            console.log(error);
          });
      }
      this.getPgList();
    },

    // ·数据源选择
    dataBaseClick(tab) {
      this.dataBaseSelect = tab.name == "PG" ? "defaultPG" : tab.name;
      console.log("dataBaseSelect", this.dataBaseSelect);
      switch(tab.name){
        case "TMS":
          this.getOutService();
          break;
      }
    },  

    // ·添加各类数据图层    
    async handleAddShpLayer(index, row) {
      //分类型进行创建shp的json入库并返回对应id
      console.log(this.dataBaseSelect);
      switch (this.dataBaseSelect) {
        case "defaultPG":
          this.addPgDefaultShp(index, row);
          break;
        case "multiPG":
          this.addPgMultiShp(index, row);
          break;
        case "cacheTile":
          this.addCacheShp(index, row);
          break;
        case "TMS":
          this.addTMS(index, row);
          break;          
        case "mbTile":
          if (!this.isStyle) {
            this.addDataMbTileShp(index, row);
          } else {
            if (row.type != "background") {
              this.addStyleMbTileShp(index, row);
            } else {
              this.addBackground("mbTile", row);
            }
          }
          break;
      }
      this.$bus.$emit("mapEdit",{type:'off'});
    },
    async addPgDefaultShp(index, row) {
      console.log("add pgDefault shp row: ", row);
      //判断该shp是否已添加
      if (
        !Object.prototype.hasOwnProperty.call(
          this.sourceNameObject,
          row.tableName
        )
      ) {
        let newTileJson = initTileJson;
        newTileJson.name = row.tableName;
        newTileJson.tiles = [
          this.reqUrl + "/mvt/" + row.tableName + "/{z}/{x}/{y}.pbf",
        ];
        let vector_layer = {
          description: "",
          fields: row.attrInfo,
          id: row.tableName,
        };
        newTileJson.vector_layers = [vector_layer];
        newTileJson.tileJsonType = this.dataBaseSelect;
        let res = await this.createTileJson(newTileJson);
        if (res.data.code !== 0) {
          console.log("添加source失败");
          return;
        }
        //添加source
        let sourceId = res.data.data.tileJsonId;
        let tileJsonUrl = this.reqUrl + "/getTileJson/" + sourceId + ".json";
        let newSourceJson = {
          sourceName: sourceId,
          sourceType: "vector",
          sourceUrl: tileJsonUrl,
        };
        this.addSourceToMap(true,newSourceJson);
        this.sources[newSourceJson.sourceName] = {
          type: newSourceJson.sourceType,
          url: newSourceJson.sourceUrl,
        };
        //记录shp图层和对应的id
        this.sourceNameObject[row.tableName] = sourceId;
      }
      //添加layer
      let geoType = row.geoType;
      if (row.geoType.indexOf("LINE") !== -1) {
        geoType = "line";
      } else if (row.geoType.indexOf("POLYGON") !== -1) {
        geoType = "fill";
      } else if (row.geoType.indexOf("POINT") !== -1) {
        geoType = "circle";
      } else {
        geoType = "symbol";
      }

      //前八个是自己用的属性
      let newLayer = {
        index: index,
        sourceType: "pgDefault", //记录数据来源类型，用于区别mbTlie的添加和删除
        show: true,
        originName: row.originName,
        showName: row.originName, //用于展示图层名字
        bounds: row.bounds,
        shpAttribute: typeof row.attrInfo != "undefined" ? row.attrInfo : [],
        attrValueSet: {},
        attrShowList: {},
        filterValueSet: {},
        nodeType: "layer", //组和图层区分
        id: row.originName,
        type: geoType,
        filter: ["all"],
        layout: JSON.parse(
          JSON.stringify(layerStyleProperties[geoType].layout)
        ), //防止同类型图层样式改变间影响
        maxzoom: 22,
        metadata: {"mapbox:type":"pgDefault"},
        minzoom: 0,
        paint: JSON.parse(JSON.stringify(layerStyleProperties[geoType].paint)),
        source: this.sourceNameObject[row.tableName], //通过记录的source名字与id对应，拿到sourceId
        "source-layer": row.tableName,
      };

      if (geoType !== "symbol") {
        newLayer.paint[geoType + "-color"] =
          "#" + Math.random().toString(16).substr(2, 6);
      }

      if (
        !Object.prototype.hasOwnProperty.call(
          this.layersNameObject,
          newLayer.originName
        )
      ) {
        this.layersNameObject[newLayer.originName] = 1;
      } else {
        this.layersNameObject[newLayer.originName] += 1;
        newLayer.id =
          row.originName + this.layersNameObject[newLayer.originName];
        newLayer.showName =
          row.originName + this.layersNameObject[newLayer.originName];
      }
      this.layers.unshift(newLayer);
      this.layersName.unshift(newLayer.id);
      this.originStyle.unshift({
        paint: newLayer.paint,
        layout: newLayer.layout,
      });
      this.addLayerToMap(true,newLayer);
      // 更新vuex参数
      this.UPDATEPARM({parm:'layers',value:this.layers});
      this.UPDATEPARM({parm:'sources',value:this.sources});
      this.UPDATEPARM({parm:'layersName',value:this.layersName});
      this.UPDATEPARM({parm:'originStyle',value:this.originStyle});
      this.UPDATEPARM({parm:'sourceNameObject',value:this.sourceNameObject});
      this.UPDATEPARM({parm:'layersNameObject',value:this.layersNameObject});

    },
    async addPgMultiShp(index, row) {
      console.log("add pgMulti shp row: ", row);
      //判断该shp是否已添加
      if (
        !Object.prototype.hasOwnProperty.call(
          this.sourceNameObject,
          row.originName
        )
      ) {
        let newTileJson = initTileJson;
        newTileJson.name = row.originName;
        newTileJson.tiles = [
          this.reqUrl +
            "/multiPgSource/" +
            this.mutiPgInfo.ip +
            "/" +
            this.mutiPgInfo.port +
            "/" +
            this.mutiPgInfo.name +
            "/" +
            row.originName +
            "/{z}/{x}/{y}.pbf",
        ];
        let vector_layer = {
          description: "",
          fields: row.attrInfo,
          id: row.originName,
        };
        newTileJson.vector_layers = [vector_layer];
        newTileJson.tileJsonType = this.dataBaseSelect;
        let res = await this.createTileJson(newTileJson);
        if (res.data.code !== 0) {
          console.log("添加source失败");
          return;
        }
        //添加source
        let sourceId = res.data.data.tileJsonId;
        let tileJsonUrl = this.reqUrl + "/getTileJson/" + sourceId + ".json";
        let newSourceJson = {
          sourceName: sourceId,
          sourceType: "vector",
          sourceUrl: tileJsonUrl,
        };
        this.addSourceToMap(true,newSourceJson);
        this.sources[newSourceJson.sourceName] = {
          type: newSourceJson.sourceType,
          url: newSourceJson.sourceUrl,
        };
        //记录shp图层和对应的id
        this.sourceNameObject[row.id] = sourceId;
      }
      //添加layer
      let geoType = row.geoType;
      if (row.geoType.indexOf("LINE") !== -1) {
        geoType = "line";
      } else if (row.geoType.indexOf("POLYGON") !== -1) {
        geoType = "fill";
      } else if (row.geoType.indexOf("POINT") !== -1) {
        geoType = "circle";
      } else {
        geoType = "symbol";
      }
      console.log("originname:", row.originName);
      //前九个是自己用的属性
      let newLayer = {
        index: index,
        sourceType: "pgMulti", //记录数据来源类型，用于区别mbTlie的添加和删除
        show: true,
        originName: row.originName,
        showName: row.originName, //用于展示图层名字
        bounds: row.bounds,
        shpAttribute: typeof row.attrInfo != "undefined" ? row.attrInfo : [],
        mutiPgInfo: this.mutiPgInfo, //用来记录多源pg信息
        attrValueSet: {},
        attrShowList: {},
        filterValueSet: {},
        nodeType: "layer", //组和图层区分
        id: row.originName,
        type: geoType,
        filter: ["all"],
        layout: JSON.parse(
          JSON.stringify(layerStyleProperties[geoType].layout)
        ),
        maxzoom: 22,
        metadata: {"mapbox:type":"pgMulti"},
        minzoom: 0,
        paint: JSON.parse(JSON.stringify(layerStyleProperties[geoType].paint)),
        source: this.sourceNameObject[row.id], //添加的sourceId
        "source-layer": row.originName,
      };

      if (geoType !== "symbol") {
        newLayer.paint[geoType + "-color"] =
          "#" + Math.random().toString(16).substr(2, 6);
      }

      if (
        !Object.prototype.hasOwnProperty.call(
          this.layersNameObject,
          newLayer.originName
        )
      ) {
        this.layersNameObject[newLayer.originName] = 1;
      } else {
        this.layersNameObject[newLayer.originName] += 1;
        newLayer.id =
          row.originName + this.layersNameObject[newLayer.originName];
        newLayer.showName =
          row.originName + this.layersNameObject[newLayer.originName];
      }
      this.layers.unshift(newLayer);
      this.layersName.unshift(newLayer.id);
      this.originStyle.unshift({
        paint: newLayer.paint,
        layout: newLayer.layout,
      });
      this.addLayerToMap(true,newLayer);
      // 更新vuex参数
      this.UPDATEPARM({parm:'layers',value:this.layers});
      this.UPDATEPARM({parm:'sources',value:this.sources});
      this.UPDATEPARM({parm:'layersName',value:this.layersName});
      this.UPDATEPARM({parm:'originStyle',value:this.originStyle});
      this.UPDATEPARM({parm:'sourceNameObject',value:this.sourceNameObject});
      this.UPDATEPARM({parm:'layersNameObject',value:this.layersNameObject});      
    },
    async addDataMbTileShp(index, row) {
      console.log("add mbDate shp row: ", row);
      let name = this.mbTileJsonList[this.mbTileSelectIndex].name;
      //判断该shp是否已添加
      if (
        !Object.prototype.hasOwnProperty.call(
          this.sourceNameObject,
          name //mbtile的souce都是一个,用该json的名字来统计记录
        )
      ) {
        //添加mbTile的shp图层时，相关json已经入库
            // json写法
        let sourceId = this.mbTileInfo.tileJsonId;
        let tileJsonUrl = this.reqUrl + "/getTileJson/" + sourceId + ".json";  
        let newSourceJson = {
          sourceName: sourceId,
          sourceType: "vector",
          sourceUrl: tileJsonUrl,
        };         
        console.log('请求数据：',newSourceJson);
        this.addSourceToMap(true,newSourceJson);        
        this.sources[newSourceJson.sourceName] = {
          type: newSourceJson.sourceType,
          url: newSourceJson.sourceUrl,
        };
        //记录shp图层和对应的id
        this.sourceNameObject[name] = sourceId;
      }    

      //前八个是自己用的属性
      let geoType = this.mbsource[row.id];
      let newLayer = {
        index: index,
        sourceType: "mbTile", //记录数据来源类型，用于区别mbTlie的添加和删除
        show: true,
        originName: row.id,
        showName: row.id, //用于展示图层名字
        shpAttribute: [],
        attrValueSet: {},
        attrShowList: {},
        filterValueSet: {},
        nodeType: "layer", //组和图层区分
        id: row.id,
        type: geoType,
        filter: ["all"],
        layout: JSON.parse(
          JSON.stringify(layerStyleProperties[geoType].layout)
        ),
        maxzoom: typeof row["maxzoom"] != "undefined" ? row["maxzoom"] : 22,
        metadata: {"mapbox:type":'mbSource',"mapbox:isOSM":this.mbTileInfo.osmMbtilesBoolean,"mapbox:source":row.id},
        minzoom: typeof row["minzoom"] != "undefined" ? row["minzoom"] : 0,
        paint: JSON.parse(JSON.stringify(layerStyleProperties[geoType].paint)),
        source: this.sourceNameObject[name], //通过记录的source名字与id对应，拿到sourceId
        "source-layer": row.id,
      };

      if (geoType !== "symbol") {
        newLayer.paint[geoType + "-color"] =
          "#" + Math.random().toString(16).substr(2, 6);
      }

      if (
        !Object.prototype.hasOwnProperty.call(
          this.layersNameObject,
          newLayer.originName
        )
      ) {
        this.layersNameObject[newLayer.originName] = 1;
      } else {
        this.layersNameObject[newLayer.originName] += 1;
        newLayer.id = row.id + this.layersNameObject[newLayer.originName];
        newLayer.showName = row.id + this.layersNameObject[newLayer.originName];
      }
      this.layers.unshift(newLayer);
      this.layersName.unshift(newLayer.id);
      this.originStyle.unshift({
        paint: newLayer.paint,
        layout: newLayer.layout,
      });
      this.addLayerToMap(true,newLayer);
      // 更新vuex参数
      this.UPDATEPARM({parm:'layers',value:this.layers});
      this.UPDATEPARM({parm:'sources',value:this.sources});
      this.UPDATEPARM({parm:'layersName',value:this.layersName});
      this.UPDATEPARM({parm:'originStyle',value:this.originStyle});
      this.UPDATEPARM({parm:'sourceNameObject',value:this.sourceNameObject});
      this.UPDATEPARM({parm:'layersNameObject',value:this.layersNameObject});      
    },
    async addStyleMbTileShp(index, row) {
      console.log("add mbStyle shp row: ", row);
      let name = this.mbTileJsonList[this.mbTileSelectIndex].name;
      //判断该shp是否已添加
      if (
        !Object.prototype.hasOwnProperty.call(
          this.sourceNameObject,
          name //mbtile的souce都是一个,用该json的名字来统计记录
        )
      ) {
        //添加mbTile的shp图层时，相关json已经入库
            // json写法
        let sourceId = this.mbTileInfo.tileJsonId;
        let tileJsonUrl = this.reqUrl + "/getTileJson/" + sourceId + ".json";  
        let newSourceJson = {
          sourceName: sourceId,
          sourceType: "vector",
          sourceUrl: tileJsonUrl,
        };         
        console.log('请求数据：',newSourceJson);
        this.addSourceToMap(true,newSourceJson);        
        this.sources[newSourceJson.sourceName] = {
          type: newSourceJson.sourceType,
          url: newSourceJson.sourceUrl,
        };
        //记录shp图层和对应的id
        this.sourceNameObject[name] = sourceId;
      }
      // 添加layer styleJson有对应属性,按对应类型添加，并对已有属性进行替换
      const newLayout = layerStyleProperties[row.type].layout;
      if ("layout" in row) {
        for (let key in row.layout) {
          newLayout[key] = row.layout[key];
        }
      }
      const newPaint = layerStyleProperties[row.type].paint;
      if ("paint" in row) {
        for (let key in row.paint) {
          newPaint[key] = row.paint[key];
        }
      }

      //前八个是自己用的属性
      let geoType = row.type;
      let newLayer = {
        index: index,
        sourceType: "mbTile", //记录数据来源类型，用于区别是否为mbTlie，mbtile图层sourceJson不删除
        show: true,
        originName: row.id,
        showName: row.id, //用于展示图层名字
        shpAttribute: [],
        attrValueSet: {},
        attrShowList: {},
        filterValueSet: {},
        nodeType: "layer", //组和图层区分
        id: row.id,
        type: geoType,
        filter: typeof row["filter"] != "undefined" ? row["filter"] : ["all"],
        layout: JSON.parse(JSON.stringify(newLayout)),
        maxzoom: typeof row["maxzoom"] != "undefined" ? row["maxzoom"] : 22,
        metadata: {"mapbox:type":'mbStyle',"mapbox:isOSM":this.mbTileInfo.osmMbtilesBoolean,"mapbox:source":row['source-layer']},
        minzoom: typeof row["minzoom"] != "undefined" ? row["minzoom"] : 0,
        paint: JSON.parse(JSON.stringify(newPaint)),
        source: this.sourceNameObject[name], //通过记录的source名字与id对应，拿到sourceId
        "source-layer": row["source-layer"],
      };

      if (
        !Object.prototype.hasOwnProperty.call(
          this.layersNameObject,
          newLayer.originName
        )
      ) {
        this.layersNameObject[newLayer.originName] = 1;
      } else {
        this.layersNameObject[newLayer.originName] += 1;
        newLayer.id = row.id + this.layersNameObject[newLayer.originName];
        newLayer.showName = row.id + this.layersNameObject[newLayer.originName];
      }
      this.layers.unshift(newLayer);
      this.layersName.unshift(newLayer.id);
      this.originStyle.unshift({
        paint: newLayer.paint,
        layout: newLayer.layout,
      });
      this.addLayerToMap(true,newLayer);
      // 更新vuex参数
      this.UPDATEPARM({parm:'layers',value:this.layers});
      this.UPDATEPARM({parm:'sources',value:this.sources});
      this.UPDATEPARM({parm:'layersName',value:this.layersName});
      this.UPDATEPARM({parm:'originStyle',value:this.originStyle});
      this.UPDATEPARM({parm:'sourceNameObject',value:this.sourceNameObject});
      this.UPDATEPARM({parm:'layersNameObject',value:this.layersNameObject});      
    },
    async addTMS(index, row) {
      console.log("add TMS shp row: ", row);
      //判断该shp是否已添加
      if (
        !Object.prototype.hasOwnProperty.call(
          this.sourceNameObject,
          row.id
        )
      ) {
        let newTileJson = initTileJson;
        newTileJson.name = row.name;
        newTileJson.tiles = [
          row.url
        ];
        let vector_layer = {
          description: "",
          fields: "",
          id: row.id,
        };
        newTileJson.vector_layers = [vector_layer];
        newTileJson.tileJsonType = this.dataBaseSelect;
        let res = await this.createTileJson(newTileJson);
        if (res.data.code !== 0) {
          console.log("添加source失败");
          return;
        }
        //添加source
        let sourceId = res.data.data.tileJsonId;     
        let tileJsonUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
        let newSourceJson = {
          sourceName: sourceId,
          sourceType: "raster",
          sourceUrl: tileJsonUrl,
        };
        // Raster添加
        this.addSourceToMap(false,newSourceJson)     
        // 记录shp图层和对应的id        
        this.sources[newSourceJson.sourceName] = {
          type: newSourceJson.sourceType,
          tiles: [newSourceJson.sourceUrl],
          tileSize: 256
        };
        this.sourceNameObject[row.id] = sourceId;
      }
      //添加layer
      //前八个是自己用的属性
      let newLayer = {
        index: index,
        sourceType: "TMS", //记录数据来源类型，用于区别mbTlie的添加和删除
        show: true,
        originName: "",
        showName: row.name, //用于展示图层名字
        attrValueSet: {},
        attrShowList: {},
        filterValueSet: {},
        nodeType: "layer", //组和图层区分
        id: row.id,
        type: "raster",
        maxzoom: 22,
        metadata: {"mapbox:type":"TMS"},
        minzoom: 0,
        source: this.sourceNameObject[row.id], //通过记录的source名字与id对应，拿到sourceId
      };
      if (
        !Object.prototype.hasOwnProperty.call(
          this.layersNameObject,
          newLayer.originName
        )
      ) {
        this.layersNameObject[newLayer.name] = 1;
      } else {
        this.layersNameObject[newLayer.name] += 1;
        newLayer.id =
          row.name + this.layersNameObject[newLayer.name];
        newLayer.showName =
          row.name + this.layersNameObject[newLayer.name];
      }
      this.layers.unshift(newLayer);
      this.layersName.unshift(newLayer.id);
      this.addLayerToMap(true,newLayer);
      // 更新vuex参数
      this.UPDATEPARM({parm:'layers',value:this.layers});
      this.UPDATEPARM({parm:'sources',value:this.sources});
      this.UPDATEPARM({parm:'layersName',value:this.layersName});
      this.UPDATEPARM({parm:'sourceNameObject',value:this.sourceNameObject});
      this.UPDATEPARM({parm:'layersNameObject',value:this.layersNameObject});      
    },  
    addBackground(sourceType, row) {
      const index = this.layers.length;       // 判断是否有图层，有则添加在最后一位，否则直接添加
      const newLayout = layerStyleProperties["background"].layout;
      const newPaint = layerStyleProperties["background"].paint;
      // style文件中的background图层
      if (sourceType == "mbTile") {
        if ("layout" in row) {
          for (let key in row.layout) {
            newLayout[key] = row.layout[key];
          }
        }
        if ("paint" in row) {
          for (let key in row.paint) {
            newPaint[key] = row.paint[key];
          }
        }
      }
      const backLayer = {
        index: index,
        sourceType: sourceType, //记录数据来源类型，用于区别mbTlie的添加和删除
        show: true,
        originName: "background",
        showName: "背景", //用于展示图层名字
        shpAttribute: [],
        attrValueSet: {},
        attrShowList: {},
        filterValueSet: {},
        id: "背景",
        type: "background",
        paint: newPaint,
        layout: newLayout,
        metadata: {
          "mapbox:type":"background",
        },
      };
      if (sourceType != "mbTile") {
        backLayer.paint["background-color"] =
          "#" + Math.random().toString(16).substr(2, 6);
      }
      if (
        !Object.prototype.hasOwnProperty.call(
          this.layersNameObject,
          "background"
        )
      ) {
        this.layersNameObject["background"] = 1;
      } else {
        this.layersNameObject["background"] += 1;
        backLayer.id = "背景" + this.layersNameObject["background"];
        backLayer.showName = "背景" + this.layersNameObject["background"];
      }
      this.layers.push(backLayer);
      this.layersName.push(backLayer.id);
      if (!index) {
        this.addLayerToMap(true,backLayer); //没有图层直接按默认添加
      } else {
        const val = {
          id : this.layers[index - 1].id,
          layer : backLayer
        }
        this.addLayerToMap(false,val)
        // map.addLayer(backLayer, this.layers[index - 1].id); //有图层则背景添加在最底层
      }
      // 更新vuex参数
      this.UPDATEPARM({parm:'layers',value:this.layers})          
      this.UPDATEPARM({parm:'layersName',value:this.layersName})          
      this.UPDATEPARM({parm:'layersNameObject',value:this.layersNameObject})

    },    
    // 保存地图
    saveMap(flag) {
      // 由MapPanel组件执行
      this.$bus.$emit("map",{type:'save',flag:flag})
    },    
    // 发布项目
    publicMap() {
      this.$confirm("确认发布地图, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.publicBoolean = true;
          this.saveMap(false);
        })
        .then(() => {
          requestApi
            .publicMap(this.mapProjectId)
            .then((res) => {
              if (res.data.code === 0) {
                this.$message.success("地图发布成功");
              } else {
                this.publicBoolean = false;
                this.$message.info("地图发布失败");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message.info("地图发布失败");
        });
    },          
    // 添加所有styleJson图层
    addAllStyles(List) {
      for (let i in List) {
        let item = List[i];
        console.log("item", item);
        if (
          item["source"] != "natural_earth_shaded_relief" &&
          item["type"] != "raster" &&
          item["type"] != "background"
        ) {
          this.addStyleMbTileShp(i, item);
        } else if (item["type"] == "background") {
          this.addBackground("mbTile", item);
        }
      }
      console.log("添加所有styleJson图层");
    },
    addAllSources(List) {
      for (let i in List) {
        let item = List[i];
        this.addDataMbTileShp(i, item);
      }
      console.log("添加所有styleJson图层");
    }, 
    //生成tilejson和mbTileJson
    async createTileJson(initTileJson) {
      let data = "";
      if (this.dataBaseSelect != "mbTile") {
        data = await requestApi.createTileJson(initTileJson);
      } else {
        data = await requestApi.createMbTilesJson(initTileJson);
      }
      return data;
    }, 
    deleteTileJson(tileJsonId) {
      requestApi
        .deleteTileJson(tileJsonId)
        .then((res) => {
          console.log("delete tileJson: ", res);
        })
        .catch((error) => {
          console.log(error);
        });
    },    
    //向地图添加数据源source
    addSourceToMap(flag,newSource) {
      if(flag){
        const data = {
          type:'addSource1',
          source: newSource
        }
        this.$bus.$emit("map",data);
      }else{
        const data = {
          type:'addSource2',
          source: newSource
        }        
        this.$bus.$emit("map",data);
      }
    },
    //向地图添加layer
    addLayerToMap(flag,val) {
      if(flag){
        const data = {
          type:'addLayer1',
          layer: val
        }
        this.$bus.$emit("map",data);
      }else{
        // flag=false表示添加在指定图层后
        const data = {
          type:'addLayer2',
          id: val.id,
          layer: val.layer
        }        
        this.$bus.$emit("map",data);
      }      
    },           

    // ·PG服务
    // 选择PG服务
    PgBaseChange(val) {
      let index = 0;      //val表示选择的value值
      //获取select选择内容的下标
      this.pgShpList.forEach((e, ind) => {
        if (e.id == val) {
          index = ind;
        }
      });
      //更改pg数据库源，同时修改dataBaseSelect类型
      this.dataBaseSelect =
        this.PgBaseSelect == "defaultPG" ? "defaultPG" : "multiPG";
      if (this.PgBaseSelect != "defaultPG") {
        this.shpTableData = this.pgShpList[index].dataInfo;
        this.mutiPgInfo = this.pgShpList[index]; //用于展示IP、端口信息
      } else {
        this.addShpData();
      }
    },    
    // 获取默认pg的shp列表
    getPgList() {
      requestApi
        .getPgList()
        .then((res) => {
          this.dataBaseList = res.data.data;
          this.dataBaseList.unshift({ name: "defaultPG", id: "defaultPG" });
          console.log("pgList", this.dataBaseList);
        })
        .catch((error) => {
          console.log(error);
        });
    },    
    // PG列表切换相关
    handleCurrentChangeShp(val) {
      this.currentPageShp = val;
      if (this.PgBaseSelect != "defaultPG") {
        this.PgBaseChange();
      } else {
        this.addShpData();
      }
    },    
    
    // ·OSM服务
    getMbtilesList() {
      requestApi.getMbtilesList().then((res) => {
        if (res.data.data.length != 0) {
          this.mbTileJsonList = res.data.data;
          console.log("mbTileJsonList", this.mbTileJsonList);
          //mbTiles先默认为第一个osm数据
          this.mbTileSelect = this.mbTileJsonList[0].id;
          this.mbTileInfo = this.mbTileJsonList[0];
          this.getTileJsonById(this.mbTileInfo.tileJsonId);
          this.getStyleListById(this.mbTileSelect, false);
          console.log("dataLayers", this.dataLayers);
        }
      });
    },   
    // 获取mbTile的styleJson列表
    getStyleListById(id, isCallBack) {
      // OSM数据样式
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
              if (isCallBack) {   // 暂定
                // 等getStyleListById执行完得到mbTileStyleList数据
                console.log("dataLayers", this.mbTileStyleList);
                if (this.templateStyleSelect == "") {
                  this.templateStyleSelect = this.mbTileStyleList[0].id; //先默认为第一个
                  this.templateStyleJson = this.mbTileStyleList[0]; //先默认为第一个
                  this.tempStyleLayers = this.templateStyleJson.layers;
                }
              }
            } 
            else {
              this.mbTileStyleList = [];
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } 
      else {
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
              if (isCallBack) {   // 暂定
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
    // 获取对应metadataJson
    getTileJsonById(id){
      requestApi
        .getTileJson(id)
        .then((res) => {
          this.mbTileJson = res.data;
          this.dataLayers = res.data.vector_layers;
          console.log('tileJson',this.mbTileJson);
        })
        .catch((error) => {
          console.log(error);
        });
    },       

      // TMS服务
    getOutService() {
      requestApi
        .getThirdPartSourceList(this.dataBaseSelect)
        .then((res) => {
          if (res.data.code == 0) {
            this.urlBase[this.dataBaseSelect] = res.data.data;
          } else {
            console.log(res.data.csg);
          }
          console.log("urlBase",this.urlBase);
        })
        .catch((err) => {
          console.log(err);
        });
    },    
  }
}
</script>

<style scoped>

</style>