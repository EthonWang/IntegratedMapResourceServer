<template>
  <div>
    <!-- 右上角zoom坐标显示 -->
    <el-tag class="mapZoomLngLatBox" type="info"
    >Zoom:{{ currentZoom }} &nbsp; LngLat:{{ currentLngLat }}
    <i class="mapbox-gl-draw_line"></i>
    <el-button @click="drawtangle">1
    </el-button>
    <!-- <el-button @click="test">2
    </el-button> -->
    </el-tag>    
    <div id="map" class="rightBox"></div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css"
import DrawRectangle from "@/utils/DrawRectangle";
import layerStyleProperties from "@/assets/js/layerStyleProperties";
import { mapMutations } from "vuex";
import requestApi from "../../api/requestApi";

var map = null;
var draw = null;
export default {
  name: 'MapContainer',
  data(){
    return{
      // 经纬坐标
      currentZoom:  111,
      currentLngLat: 222,

      // 筛选的地物属性

    }
  },
  methods: {
    // test
    test(){
      console.log('style:',map.getStyle());
      let List = map.getStyle().layers.map((item)=>{
        if(item.id == 'demo1'){return false}
        return item.id
      });
      console.log('list:',List);
      // map.setLayout('visibility')
    },


    // vuex
    ...mapMutations({ UPDATEPARM: "UPDATE" }), //将 `this.UPDATEPARM(data)` 映射为 `this.$store.commit('UPDATE',data)`

    initMapbox() {
      mapboxgl.accessToken =
          "pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg";

      map = new mapboxgl.Map({
        container: "map", // container ID
        style: 'mapbox://styles/mapbox/streets-v11',
        // style:"http://127.0.0.1/api/v1/styles/3eada7e0ae4411ec8cb88b1eae413f21/draft?access_token=tk.fb799200ae8311ec8cb88b1eae413f21",
        // style:"https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg",
        // style:this.reqUrl + "/mapServer/626a592bc27f00a2b6b029f1",
        // center: [-122.486052, 37.830348], // starting position [lng, lat]
        // zoom: 7, // starting zoom
      });
      // draw = new MapboxDraw({
      //   displayControlsDefault: false,
      //   controls: {
      //     polygon: true,
      //     trash: true,
      //   },
      //   defaultMode: 'draw_polygon'
      // });

      let modes = MapboxDraw.modes;
      modes.draw_rectangle = DrawRectangle;
      //添加工具
      draw = new MapboxDraw({
        modes: modes,
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },        
      });
      map.addControl(draw);

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
      // 全局缩放
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
      //绑定事件
      map.on("zoom", () => {
        this.currentZoom = map.getZoom().toFixed(2);
      });
      map.on("load",()=>{
        let that = this;

        const canvas = map.getCanvasContainer();
 
        // Variable to hold the starting xy coordinates
        // when `mousedown` occured.
        let start;
          
        // Variable to hold the current xy coordinates
        // when `mousemove` or `mouseup` occurs.
        let current;
          
        // Variable for the draw box element.
        let box;

        // Set `true` to dispatch the event before other functions
        // call it. This is necessary for disabling the default map
        // dragging behaviour.
        canvas.addEventListener('mousedown', mouseDown, true);
        
        // Return the xy coordinates of the mouse position
        function mousePos(e) {
          const rect = canvas.getBoundingClientRect();
          return new mapboxgl.Point(
          e.clientX - rect.left - canvas.clientLeft,
          e.clientY - rect.top - canvas.clientTop
          );
        }
        
        function mouseDown(e) {
          // Continue the rest of the function if the shiftkey is pressed.
          if (!(e.shiftKey && e.button === 0)) return;
          
          // Disable default drag zooming when the shift key is held down.
          map.dragPan.disable();
          
          // Call functions for the following events
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
          document.addEventListener('keydown', onKeyDown);
          
          // Capture the first xy coordinates
          start = mousePos(e);
        }
        
        function onMouseMove(e) {
          // Capture the ongoing xy coordinates
          current = mousePos(e);
          
          // Append the box element if it doesnt exist
          if (!box) {
          box = document.createElement('div');
          box.classList.add('boxdraw');
          canvas.appendChild(box);
          }
          
          const minX = Math.min(start.x, current.x),
          maxX = Math.max(start.x, current.x),
          minY = Math.min(start.y, current.y),
          maxY = Math.max(start.y, current.y);
          
          // Adjust width and xy position of the box element ongoing
          const pos = `translate(${minX}px, ${minY}px)`;
          box.style.transform = pos;
          box.style.width = maxX - minX + 'px';
          box.style.height = maxY - minY + 'px';
        }
        
        function onMouseUp(e) {
          // Capture xy coordinates
          finish([start, mousePos(e)]);
        }
        
        function onKeyDown(e) {
          // If the ESC key is pressed
          if (e.keyCode === 27) finish();
        }
        
        function finish(bbox) {
          // Remove these events now that finish has been called.
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('keydown', onKeyDown);
          document.removeEventListener('mouseup', onMouseUp);
          
          if (box) {
          box.parentNode.removeChild(box);
          box = null;
          }
          
          // If bbox exists. use this value as the argument for `queryRenderedFeatures`
          if (bbox) {
          const features = map.queryRenderedFeatures(bbox, {
          layers: ['demo']
          });
          
          if (features.length >= 1000) {
          return window.alert('Select a smaller number of features');
          }
          
          // Run through the selected features and set a filter
          // to match features with unique FIPS codes to activate
          // the `counties-highlighted` layer.
          const gids = features.map((feature) => feature.properties.gid);
          map.setFilter('demo2', ['in', 'gid', ...gids]);
          that.updateFeatureList(features);
          }
          
          map.dragPan.enable();    
        }    
      
      })
    },


    // #添加数据
    addShp(row){
      // 添加source
      let sourceJsonId = row.tilejsonId; // defaultPG在上传shp的同时生成json，并把id记录在shp表中
        let tileJsonUrl =
          this.reqUrl + "/getTileJson/" + sourceJsonId + ".json";
        let newSourceJson = {
          sourceName: row.originName,
          sourceType: "vector",
          sourceUrl: tileJsonUrl,
        };
        this.addSourceToMap(newSourceJson);     
      // 添加layer
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
      let newLayer = {
        bounds: row.bounds,
        id: 'demo',
        type: geoType,
        filter: ["all"],
        layout: JSON.parse(
          JSON.stringify(layerStyleProperties[geoType].layout)
        ), //防止同类型图层样式改变间影响
        maxzoom: 22,
        minzoom: 0,
        paint: JSON.parse(JSON.stringify(layerStyleProperties[geoType].paint)),
        source: row.originName, //通过记录的source名字与id对应，拿到sourceId
        "source-layer": row.tableName,
      }; 
      // 属性预处理
      newLayer.paint[geoType + "-color"] = 'rgba(25, 122, 217, 1)';
      if(geoType === 'fill'){       // 面之间的交界线
        newLayer.paint[geoType + "-outline-color"] = "rgba(255, 255, 255, 1)";
      }
      if(['line','fill'].indexOf(newLayer.type) != -1){delete newLayer.paint[`${newLayer.type}-pattern`]}         
      map.addLayer(newLayer); //默认添加  

      // 跳转到地物 
      if ("bounds" in row) {
        const bbox = [
          [row.bounds[0] + 0, row.bounds[1] + 0],
          [row.bounds[2] + 0, row.bounds[3] + 0],
        ];
        map.fitBounds(bbox, {
          duration: 500,
          padding: { top: 10, bottom: 25, left: 15, right: 5 },
        });
      }

      let layerTest = JSON.parse(JSON.stringify(newLayer));
      layerTest.filter = ['in', 'gid', ''];
      layerTest.paint[geoType + "-color"] = '#6e599f';
      layerTest.id = 'demo2';
      
      map.addLayer(layerTest);
    },
    drawtangle(){
      draw.changeMode("draw_rectangle");
    },
    updateFeatureList(features){
      console.log('features',features);
      this.dataList = [];
      features.forEach(feature => {
        let featureInfo = {};
        featureInfo['geoType'] = feature.layer.type;
        featureInfo['gid'] = feature.properties.gid;
        featureInfo['geom'] = feature.properties.geom;
        featureInfo['b2d'] = feature.properties.b2d;
        featureInfo['name'] = feature.layer.source;     // source以originName
        let List = [];
        for(let item in feature.properties){
          if(['b2d','gid','geom'].includes(item)){
            continue;
          }           
          let object = {};
          object['attr'] = item;
          object['value'] = feature.properties[item];
          List.push(object);
        }
        featureInfo['info'] = List;
        this.dataList.push(featureInfo);
      });
      console.log('list',this.dataList);
    },
    getGeoJson(features){
      let gids = features.map((item)=>item.properties.gid);
      let name = features[0].layer.source;      // 暂时是对一个shp做处理
      requestApi.getGeoJson({
        tableName:name,
        gids:gids
      })
      .then((res)=>{
        let object = res.data.data;
        this.dataList.forEach(item=>{
          item['bounds'] = object.bounds;
          item['geojson'] = object.geojson;
        })
      })
    },

    // mapbox相关API
    addSourceToMap(data){
      switch(data.sourceType){
        case 'vector':
          map.addSource(data.sourceName, {
            type: data.sourceType,
            url: data.sourceUrl,
          });           
          break;
        case 'geojson':
          map.addSource(data.sourceName, {
            type: data.sourceType,
            data: data.sourceUrl
          });          
          break;
      }
    }


  },
  computed: {
    dataList: {     // [geoType:"",gid:"",geom:"",b2d:"",info:[{attr:"",value:""}]];
      get() {
        return this.$store.state.dataList;
      },
      set(val) {
        this.UPDATEPARM({ parm: "dataList", value: val });
      },
    },
  },
  created () {
  },
  mounted () {
    this.initMapbox();
    this.$bus.$on("map", (data) => {
      switch (data.type) {
        case "addShp":                  // data:{type:'',value:''}
          this.addShp(data.value)
          break;
        case "fitBounds":
          map.fitBounds(data.value, {   // data:{type:'',value:''}
            duration: 500,
            padding: { top: 10, bottom: 25, left: 15, right: 5 },
          });
          break;
        case "deleteFeature":           // data:{type:'',value:map}
          map.setFilter('demo2',['in','gid',...data.value])
          break;
      }      
    })

  },  
}
</script>

<style lang="scss" scoped>
@import "./map.scss";
</style>