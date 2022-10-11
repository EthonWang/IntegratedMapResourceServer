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
import requestApi from "../api/requestApi";
import {mapState,mapActions,mapMutations} from 'vuex'
var map = null;
export default {
  name: "LayersList",
  props: ["",""],
  data() {
    return{
      // 公共参数
      mapProjectInfo: '',
      layers:[],
      layersName: [],      
      // 地图参数
      zoom: 6,
      center: "119,32",
      showCenter: '',
    }
  },
  computed:{
    ...mapState(['mapProjectInfo','layersName','layers']),
  },  
  mounted(){
    // 等初始组件信息加载完
    this.$bus.$on("init",()=>{
      this.infoInit();
    })    
    this.$bus.$on("map",(data)=>{
      console.log(data);
    })
  },
  methods:{
    // vuex
    ...mapActions({updateParm:'update'}),        //将 `this.updateParm(data)` 映射为 `this.$store.dispatch('update',data)`
    ...mapMutations({UPDATEPARM:'UPDATE'}),      //将 `this.UPDATEPARM(data)` 映射为 `this.$store.commit('UPDATE',data)`

    // 初始化参数
    infoInit(){
      this.zoom = this.mapProjectInfo.zoom;
      this.sources = this.mapProjectInfo.sources;
      this.layers = this.mapProjectInfo.layers;
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
        map.getCanvas().style.cursor = "pointer";

        this.showCenter =
          "(" +
          String(e.lngLat.lng.toFixed(5)) +
          "，" +
          String(e.lngLat.lat.toFixed(5)) +
          ")";
      });

      //选中某元素
      // map.on('mouseenter',this.layersName,  function (e) {
      // map.getCanvas().style.cursor = 'pointer';
      // console.log("eeeeeeeeee gid:", e);
      //   console.log("eeeeeeeeee gid:", e.features[0].properties.gid);
      //   console.log("属性:", e.features)
      // });

      // Change it back to a pointer when it leaves.
      map.on("mouseleave", this.layersName, function () {
        map.getCanvas().style.cursor = "";
      });

      //点击元素事件
      map.on("click", this.layersName, (e) => {
        //点击范围
        const bbox = [
          [e.point.x - 5, e.point.y - 5],
          [e.point.x + 5, e.point.y + 5],
        ];
        // Find features intersecting the bounding box.
        const selectedFeatures = map.queryRenderedFeatures(bbox, {
          layers: this.layersName,
        });
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

          var index = this.layersName.indexOf(feature.layer["id"]);
          container.appendChild(item).className = "item";
          item.appendChild(iconBox).className = "iconBox";
          item.appendChild(colorBox).className = "colorBox";
          item.appendChild(item_name).className = "item_name";
          item_name.innerHTML = this.layers[index].showName; //显示的是showName
          item_name.title = this.layers[index].showName;

          //根据index获取相关图层信息
          const color_name = feature.layer.type + "-" + "color";
          colorBox.style.setProperty(
            "background-color",
            feature.layer.paint[color_name]
          );
          this.addItemEvent(item, this.layers[index], index);
        }

        console.log("selectedFeatures", selectedFeatures);

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setDOMContent(container)
          .addTo(map);
      });

      map.on("load", function () {
        map.loadImage(
          // this.reqUrl+"/store/symbols/右道封闭_62ab327448d8acac7319a4cc.png",
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/400px-Cat_silhouette.svg.png",
          function (error, image) {
            if (error) throw error;
            map.addImage("cat", image);
          }
        );
      });
    },    
    //数据回来后初始化地图
    initMapWithData() {
      console.log("initMapWithData");

      let initStyle = {
        version: 8,
        sources: {},
        layers: [],
        sprite: this.reqUrl + this.spritePath,
        glyphs: this.reqUrl + this.glyphsPath,
      };
      console.log("initstyle", initStyle);
      map.setStyle(initStyle).on("load", () => {
        map.setZoom(this.zoom);
        map.setCenter(this.center);
        //需要按字符串来保存坐标
        this.center = this.center.join(",");

        for (let i in this.sources) {
          let newSource = {
            sourceName: i,
            sourceType: this.sources[i].type,
            sourceUrl: this.sources[i].url,
          };
          this.addSourceToMap(newSource);
        }

        for (let i = this.layers.length - 1; i >= 0; i--) {
          this.addLayerToMap(this.layers[i]);
        }
      });
    },    
  }
}
</script>

<style scoped>

</style>