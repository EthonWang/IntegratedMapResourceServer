<template>
  <div>
    <!-- 右上角zoom坐标显示 -->
    <el-tag class="mapZoomLngLat" type="info">
      Zoom:{{ zoom }} &nbsp; LngLat:{{ showCenter }}
    </el-tag>
    <div id="map" class="mapStyle"></div>
  </div>
</template>
<script>
import mapboxgl from "mapbox-gl";
import requestApi from "@/api/requestApi";
import { mapState, mapActions, mapMutations } from "vuex";
var map = null;
export default {
  name: "MapPanel",
  data() {
    return {

      // 项目参数
      glyphsPath: "",
      canvasSrc: "",
      layerIdList: [],

      // 地图参数
      zoom: 6,
      center: "119,32",
      showCenter: "",
      // popup样式
      layerIcon: {
        circle: "fa fa-circle",
        line: "fa fa-window-minimize",
        fill: "fa fa-square",
        symbol: "fa fa-font",
        "fill-extrusion": "fa fa-cube",
        heatmap: "fa fa-fire",
        raster: "fa fa-photo",
        hillshade: "	fa fa-area-chart",
      },
    };
  },
  computed: {
    ...mapState({}),
    // 切换到这种方式用于对computer进行set
    mapProjectInfo: {
      get() {
        return this.$store.state.mapProjectInfo;
      },
      set(val) {
        this.UPDATEPARM({ parm: "mapProjectInfo", value: val });
      },
    },
    layers: {
      get() {
        return this.$store.state.layers;
      },
      set(val) {
        this.UPDATEPARM({ parm: "layers", value: val });
      },
    },
    layersTree: {
      get() {
        return this.$store.state.layersTree;
      },
      set(val) {
        this.UPDATEPARM({ parm: "layers", value: val });
      },
    },
    sources: {
      get() {
        return this.$store.state.sources;
      },
      set(val) {
        this.UPDATEPARM({ parm: "sources", value: val });
      },
    },
    spritePath: {
      get() {
        return this.$store.state.spritePath;
      },
      set(val) {
        this.UPDATEPARM({ parm: "spritePath", value: val });
      },
    },
    tileJsonList: {
      get() {
        return this.$store.state.tileJsonList;
      },
      set(val) {
        this.UPDATEPARM({ parm: "tileJsonList", value: val });
      },
    },
    layersNameObject: {
      get() {
        return this.$store.state.layersNameObject;
      },
      set(val) {
        this.UPDATEPARM({ parm: "layersNameObject", value: val });
      },
    },
    sourceNameObject: {
      get() {
        return this.$store.state.sourceNameObject;
      },
      set(val) {
        this.UPDATEPARM({ parm: "sourceNameObject", value: val });
      },
    },
  },
  watch: {
    // 组件自用
    layers:{ 
      deep:true,
      handler:function(val){
        // 清空layerIdList数组但不能改变的内存地址，防止map事件绑定的图层数组不响应
        this.layerIdList.length = 0;
        val.forEach(element => {
          // if(this.layerIdList.indexOf(element.id) == -1){
            this.layerIdList.push(element.id);
          // }
        });    
      }
    }
  },
  mounted() {
    // 等初始组件信息加载完
    this.$bus.$on("init", (data) => {
      switch (data.type) {
        case "all":
        case "map":
          this.infoInit();
          break;
        default:
          break;
      }
    });
    // mapbox相关地图操作
    this.$bus.$on("map", (data) => {
      switch (data.type) {
        case "setLayout": // data:{type:'',layerName:'',key:'',value:''}
          this.handleLayoutChange(data.layerName, data.key, data.value);
          break;
        case "setPaint": // data:{type:'',layerName:'',key:'',value:''}
          this.handlePaintChange(data.layerName, data.key, data.value);
          break;
        case "setZoom": // data:{type:'',layerName:'',min:'',max:''}
          this.handleZoomChange(data.layerName, data.min, data.max);
          break;
        case "addLayer1": // data:{type:'',layer:{},(isReplace)}        addLayer同时在图层树组件中触发
          this.addLayerToMap(true, data.layer);
          break;
        case "addLayer2": // data:{type:'',id:'',layer:{},(isReplace)}  添加在指定图层后(添加背景,更换指定图层样式)，isReplace表示替换图层，不对目录树做修改，即在图层树组件响应事件不做修改
          this.addLayerToMap(false, data);
          break;
        case "addSource1": // data:{type:'',source:{}}  tileJson写法
          this.addSourceToMap(true, data.source);
          break;
        case "addSource2": // data:{type:'',source:{}}  Raster写法
          this.addSourceToMap(false, data.source);
          break;
        case "removeLayer": // data:{type:'',id:''}
          map.removeLayer(data.id);
          break;
        case "removeSource": // data:{type:'',id:''}
          map.removeSource(data.id);
          break;
        case "setFilter": // data:{type:'',id:'',filter:{}}
          this.setFilterToMap(data.id, data.filter);
          break;
        case "save": // data:{type:''，flag:''}    flag为true是正常保存，false是不弹出提示框（发布走的链接）
          this.saveMap(data.flag);
          break;
        case "mapFit": // data:{type:'',row:{}}
          this.handleLayerClick(data.row);
          break;
        case "canvasSrc": // data:{type:''}   截图地图保存至localstorage
          this.setCanvasSrc();
          break;
        case "loadAndAddImg": // data:{type:'',url:'',name:''}
          map.loadImage(data.url, (error, image) => {
            if (error) throw error;
            map.addImage(data.name, image);
          });
          break;
        default:
          break;
      }
    });
    console.log('map组件初始化了');

  },
  methods: {
    // vuex
    ...mapActions({ updateParm: "update" }), //将 `this.updateParm(data)` 映射为 `this.$store.dispatch('update',data)`
    ...mapMutations({ UPDATEPARM: "UPDATE" }), //将 `this.UPDATEPARM(data)` 映射为 `this.$store.commit('UPDATE',data)`

    // 初始化参数
    infoInit() {
      // 初始化公共参数
      this.mapProjectId = localStorage.getItem("mapProjectId");
      this.zoom = this.mapProjectInfo.zoom;
      // this.sources = this.mapProjectInfo.sources;
      // this.layers = this.mapProjectInfo.layers;
      this.glyphsPath = this.mapProjectInfo.glyphs;
      this.spritePath = this.mapProjectInfo.sprite;
      this.layersNameObject =
        JSON.stringify(this.mapProjectInfo.nameObject) == "{}"
          ? {}
          : this.mapProjectInfo.nameObject.layersNameObject;
      this.sourceNameObject =
        JSON.stringify(this.mapProjectInfo.nameObject) == "{}"
          ? {}
          : this.mapProjectInfo.nameObject.sourceNameObject;
      this.createEmptyMap();
      this.initMapWithData();
    },

    // 创建空地图
    createEmptyMap() {
      mapboxgl.accessToken =
        "pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg";
      map = new mapboxgl.Map({
        container: "map",
        preserveDrawingBuffer: true, //为true，则可以使用map.getCanvas().toDataURL()转为PNG
      });

      // 添加比例尺
      var scale = new mapboxgl.ScaleControl({
        maxWidth: 120,
        unit: "imperial",
      });
      map.addControl(scale);
      scale.setUnit("metric");

      // 添加控件缩放按钮和一个指南针.
      var nav = new mapboxgl.NavigationControl();
      map.addControl(nav, "top-right");

      // 添加全局缩放
      map.addControl(new mapboxgl.FullscreenControl());

      //添加定位控件
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        })
      );

      //zoom
      map.on("zoom", () => {
        this.zoom = map.getZoom().toFixed(2);
      });

      //center
      map.on("mousemove", (e) => {
        this.showCenter =
          "(" +
          String(e.lngLat.lng.toFixed(5)) +
          "，" +
          String(e.lngLat.lat.toFixed(5)) +
          ")";
      });
      //选中某元素
      // map.on('mouseenter',layerIdList,  function (e) {
      // console.log("eeeeeeeeee gid:", e);
      // });
      // #注：通过对layerIdList进行浅拷贝，来响应图层的变化
      //center
      map.on("mousemove", this.layerIdList,() => {
        map.getCanvas().style.cursor = "pointer";
      });      
      // Change it back to a pointer when it leaves.
      map.on("mouseleave", this.layerIdList, function () {
        map.getCanvas().style.cursor = "";
      });       
      // 点击事件
      map.on("click",this.layerIdList, (e) => {
        //点击范围
        const bbox = [
          [e.point.x - 5, e.point.y - 5],
          [e.point.x + 5, e.point.y + 5],
        ];
        // Find features intersecting the bounding box.
        const selectedFeatures = map.queryRenderedFeatures(bbox, {
          layers: this.layerIdList,
        });
        console.log("selectedFeatures", selectedFeatures);
        var container = window.document.createElement("div");
        container.className = "container";
        var nameList = [];

        for (const i in selectedFeatures) {
          let feature = selectedFeatures[i];
          if (nameList.indexOf(feature.layer.id) === -1) {
            nameList.push(feature.layer.id);
          } else {
            continue; //避免相同图层元素重复展现
          }
          //为popup添加DOM元素
          let item = window.document.createElement("div");
          var item_name = window.document.createElement("div");
          let colorBox = window.document.createElement("div");
          let iconBox = window.document.createElement("div");
          let iconItem = window.document.createElement("i");
          iconBox.appendChild(iconItem);
          if (feature.layer.type != "background") {
            iconItem.className = this.layerIcon[feature.layer.type];
          }

          let aimLayer = this.layers.filter(item=>(
            item.id == feature.layer["id"]
          ))
          var index = this.layerIdList.indexOf(feature.layer["id"]);
          container.appendChild(item).className = "item";
          item.appendChild(iconBox).className = "iconBox";
          item.appendChild(colorBox).className = "colorBox";
          item.appendChild(item_name).className = "item_name";
          item_name.innerHTML = aimLayer[0].showName; //显示的是showName
          item_name.title = aimLayer[0].showName;

          //根据index获取相关图层信息
          const color_name = feature.layer.type + "-" + "color";
          colorBox.style.setProperty(
            "background-color",
            feature.layer.paint[color_name]
          );
          this.addItemEvent(item, aimLayer[0], index);
        }
        // 弹出框控件
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setDOMContent(container)
          .addTo(map);
      });      
      console.log('地图初始化');
    },
    // 数据回来后初始化地图
    initMapWithData() {
      let initStyle = {
        version: 8,
        sources: {},
        layers: [],
        sprite: this.reqUrl + this.spritePath, // 设置精灵图访问接口，mapbox会自动请求json和png
        glyphs: this.reqUrl + this.glyphsPath, // 设置字体访问接口，mapbox会自动请求
      };
      console.log("initstyle", initStyle);

      map.setStyle(initStyle).on("load", () => {
        map.setZoom(this.zoom);
        let center = this.center.split(',');
        map.setCenter(center);
        // 添加source
        for (let i in this.sources) {
          let newSource = {
            sourceName: i,
            sourceType: this.sources[i].type,
            sourceUrl: this.sources[i].url,
          };
          this.addSourceToMap(true, newSource);
        }
        // 添加layer
        for (let i = this.layers.length - 1; i >= 0; i--) {
          this.addLayerToMap(true, this.layers[i]);
        }
      });
    },
    deleteTileJson(){
      this.tileJsonList.forEach(element=>{
        console.log('删除的图层id：',element);
        requestApi
            .deleteTileJson(element)
            .then((res) => {
              console.log("delete tileJson: ", res);
            })
            .catch((error) => {
              console.log(error);
            });        
      })
      this.tileJsonList = [];
    },
    // #地图api
    //向地图添加数据源source
    addSourceToMap(flag, newSource) {
      console.log("add new source：", newSource);
      if (flag) {
        //tileJson写法
        map.addSource(newSource.sourceName, {
          type: newSource.sourceType,
          url: newSource.sourceUrl,
        });
      } else {
        // Raster添加方法
        map.addSource(newSource.sourceName, {
          type: newSource.sourceType,
          tiles: [newSource.sourceUrl],
          tileSize: 256,
        });
      }
    },
    // 向地图添加layer
    addLayerToMap(flag, data) {
      if (flag) {
        let layer = JSON.parse(JSON.stringify(data));
        delete layer.paint[`${layer.type}-pattern`];         
        console.log("add new layer：", data);
        map.addLayer(layer); //默认添加
      } else {
        //value:{index:'',layer:{}}
        let layer = JSON.parse(JSON.stringify(data.layer));
        let id = JSON.parse(JSON.stringify(data.id));
        delete layer.paint[`${layer.type}-pattern`];          
        console.log("add new layer：", data.layer);
        map.addLayer(layer, id); //添加在对应图层之前
      }
    },
    //设置对地图进行筛选
    setFilterToMap(id, filter) {
      console.log("set filters：", id, filter);
      map.setFilter(id, filter);
    },
    // 修改layout属性
    handleLayoutChange(layerName, key, value) {
      console.log("layout:", layerName, key, value);
      map.setLayoutProperty(layerName, key, value);
    },
    // 修改paint属性
    handlePaintChange(layerName, key, value) {
      // 当为pattern属性，且值为空时，删除mapbox中的图层和pattern属性重新加载
      if(key.includes('pattern') && value == ''){
        let index = this.layers.findIndex(item => item.id == layerName);
        let aimLayer = JSON.parse(JSON.stringify(this.layers[index]));
        delete aimLayer.paint[key];
        map.removeLayer(layerName);
        if(index){
          map.addLayer(aimLayer);
        }else{
          map.addLayer(aimLayer,this.layers[index-1].id)
        }
      }else{
        map.setPaintProperty(layerName, key, value);
      }
      console.log("paint:", layerName, key, value);
    },
    // 修改zoom显示范围
    handleZoomChange(layerName, min, max) {
      console.log("zoom:", layerName, min, max);
      map.setLayerZoomRange(layerName, min, max);
    },

    // 为item添加同handleLayerEdit相同的方法
    addItemEvent(item, feature, index) {
      //因为item是html元素，在其事件中this指向该元素无法获取vue的实例属性和方法\
      let _this = this;
      item.onclick = async function test() {
        // 实现编辑面板的handleLayerEdit(index, feature);
        const data = {
          type: "open",
          index: index,
          layer: feature,
        };
        await _this.$bus.$emit('main',{type:'reload',name:'editor'});
        // 等editor组件加载完成   
        setTimeout(() => {
          _this.$bus.$emit("mapEdit", data);            // 先打开图层编辑框，但会对layers进行修改进而影响layersTree使tree组件更新
          _this.$bus.$emit("layerTree", { type: "highLight", id: feature.id });   // 因为tree组件会更新，所以要等刷新完再进行高亮显示
        }, 0);              
      };
    },
    setCanvasSrc() {
      const canvasSrc = map.getCanvas().toDataURL("image/png");
      localStorage.setItem("canvasSrc", canvasSrc);
    },

    // #其余组件函数
    // 保存项目
    saveMap(flag) {
      //现将画布内容转为png图片当做工程封面
      this.canvasSrc = map.getCanvas().toDataURL("image/png");
      const { lng, lat } = map.getCenter();
      this.center = lng + "," + lat;
      this.zoom = map.getZoom();
      for (let i in this.layers) {
        this.layers[i].layout.visibility = this.layers[i].show
          ? "visible"
          : "none";
      }
      // 变动的参数需要重新赋值
      this.mapProjectInfo.zoom = this.zoom;
      this.mapProjectInfo.center = this.center;
      this.mapProjectInfo.sprite = this.spritePath;
      this.mapProjectInfo.glyphs = this.glyphsPath;
      this.mapProjectInfo.sources = this.sources;
      if (!flag) {
        // 发布走的接口，否则保存初始的publicBoolean
        this.mapProjectInfo.publicBoolean = true; // 在按钮组件中publicBoolean已经设置为true
      }
      this.mapProjectInfo.layers = this.layers;
      this.mapProjectInfo.layersTree = this.layersTree;
      this.mapProjectInfo.nameObject = {
        layersNameObject: this.layersNameObject,
        sourceNameObject: this.sourceNameObject,
      };
      if (flag) {
        this.$confirm("是否保存地图?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            console.log('保存的信息',this.mapProjectInfo);
            requestApi
              .updateMapProject(JSON.stringify(this.mapProjectInfo))
              .then(() => {
                this.$message.success("保存成功!");
                //保存截图到工程字段
                requestApi.createMapImg({
                    imgUrl: this.canvasSrc,
                    mapProjectId: this.mapProjectId,
                  })
                  .then(() => {
                    this.deleteTileJson();
                  })
                  .then(() => {
                    this.$bus.$emit('main',{type:'reload',name:'main'});      // 刷新页面
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch(() => {
            this.$message.info("取消保存");
          });
      } else {
        // 发布链接走的接口，不需要提示
        requestApi
          .updateMapProject(JSON.stringify(this.mapProjectInfo))
          .then(() => {
            //保存截图到工程字段
            requestApi
              .createMapImg({
                imgUrl: this.canvasSrc,
                mapProjectId: this.mapProjectId,
              })
              .then(() => {
                this.deleteTileJson();
                // requestApi
                //   .publicMap(id)
                //   .then((res) => {
                //     if (res.data.code === 0) {
                //       this.$message.success("地图发布成功:" + this.mapProjectInfo.name);
                //     } else {
                //       this.$message.info("地图发布失败");
                //     }
                //   })
                //   .catch((error) => {
                //     console.log(error);
                //   });                
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    // 原先table行(按钮)点击事件
    handleLayerClick(row) {
      // 用于控制台信息查看
      console.log("layers:", this.layers);
      console.log("layersTree", this.$store.state.layersTree);
      if (row.type != "background") {
        // 背景没有source
        const source = map.getSource(row["source"]);
        console.log("source:", source);
      }
      const style = map.getStyle();
      console.log("style:", style);
      // 图层切换到对应位置
      // const row = this.layers[this.nowLayerIndex];
      if ("bounds" in row) {
        const bbox = [
          [row.bounds[0] + 0, row.bounds[1] + 0],
          [row.bounds[2] + 0, row.bounds[3] + 0],
        ];
        map.fitBounds(bbox, {
          duration: 500,
          padding: { top: 10, bottom: 25, left: 15, right: 5 },
        });
        // const center = [Number((row.bounds[0]+row.bounds[2])/2),Number((row.bounds[1]+row.bounds[3])/2)]
        // this.$nextTick(()=>{
        //   map.setCenter(center);
        // });
        // map.flyTo({
        //   center: [113.32948058466824, 23.19862318628209],
        // });
      }
    },
  },
  beforeDestroy() {
    this.$bus.$off("init");
    this.$bus.$off("map");
  },
};
</script>

<style scoped>
/* 图标控件 */
.mapZoomLngLat {
  position: absolute;
  top: 10px;
  right: 60px;
  z-index: 99;
  background-color: #ffffff !important;
  font-size: 13px;
}
.mapStyle {
  position: absolute;
  top: 0;
  margin-left: 330px;
  width: calc(100vw - 330px);
  height: 100vh;
}

/* popup样式 */
.container {
  width: 200px;
  /* height: 30px; */
}
.item {
  display: flex;
  margin: 2px 0;
  justify-content: left;
  align-items: center;
  color: black;
  border-radius: 5px;
}
.item:hover {
  color: #4264fb;
  background-color: #e0e7eb;
  cursor: pointer;
}
.iconBox {
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.colorBox {
  width: 18px;
  height: 18px;
  display: inline-block;
  border: rgba(211, 211, 211, 0.6) 1px solid;
  border-radius: 5px;
  margin: 0 2px;
}
.item_name {
  /* margin-left: 30px; */
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
