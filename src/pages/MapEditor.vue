<template>
  <div class="Container">
    <!-- 右上角zoom坐标显示 -->
    <el-tag class="mapZoomLngLat" type="info"
      >Zoom:{{ currentZoom }} &nbsp; LngLat:{{ currentLngLat }}</el-tag
    >
    <div class="leftBar">
      <div class="leftBarTitle">
        <h1 style="margin: 1.2rem 0">编辑区</h1>
        <el-divider class="divider"></el-divider>
      </div>

      <div class="flexRowCenter">
        <el-button>添加数据</el-button>
        <el-button @click="handleSelect">切换底图</el-button>
      </div>

      <el-divider class="divider">图层</el-divider>
      <el-table :data="layerTableData" size="mini" style="width: 100%">
        <el-table-column
          label="类型"
          prop="type"
          width="50"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="名称"
          prop="name"
          width="200"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-button @click="addMyLayer">添加图层</el-button>
      <el-button @click="removeMyLayer">移除图层</el-button>
    </div>

    <div class="rightMap">
      <div id="map" class="mapStyle"></div>
    </div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
var map = null;
export default {
  mounted() {
    this.initMapbox();
  },

  data() {
    return {
      currentZoom: "9",
      currentLngLat: "119, 32",

      layerTableData: [{ type: "aaa", name: "china" }],

      showShpList: [""],
    };
  },
  methods: {
    initMapbox() {
      mapboxgl.accessToken =
        "pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg";

      map = new mapboxgl.Map({
        container: "map", // container ID
        style: "mapbox://styles/mapbox/streets-v11", // style URL
        center: [119, 32], // starting position [lng, lat]
        zoom: 9, // starting zoom
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

      map.on("mousemove", (e) => {
        this.currentLngLat =
          String(e.lngLat.lng.toFixed(5)) +
          "," +
          String(e.lngLat.lat.toFixed(5));
      }),
        map.on("load", () => {
          map.addSource("postgis-tiles", {
            type: "vector",
            tiles: ["http://172.21.213.15:8991/mvt/lines_pg/{z}/{x}/{y}.pbf"],
          }),
            map.addLayer({
              id: "postgis-tiles-line-layer",
              type: "line",
              source: "postgis-tiles",
              // ST_AsMVT() uses 'default' as layer name
              "source-layer": "default",
              minzoom: 0,
              maxzoom: 22,
              paint: {
                "line-opacity": 0.7,
                "line-color": "red",
                "line-width": 1,
              },
            });

          //添加mapbox示例数据
          map.addLayer({
            id: "terrain-data",
            type: "line",
            source: {
              type: "vector",
              url: "mapbox://mapbox.mapbox-terrain-v2",
            },
            "source-layer": "contour",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#ff69b4",
              "line-width": 1,
            },
          });
        });
    },
    addMyLayer() {
      console.log("asda");
      map.addSource("postgis-tiles2", {
        type: "vector",
        tiles: ["http://172.21.213.15:8991/mvt/points_5w/{z}/{x}/{y}.pbf"],
      }),
        map.addLayer({
          id: "postgis-tiles-point-layer",
          type: "circle",
          source: "postgis-tiles2",
          // ST_AsMVT() uses 'default' as layer name
          "source-layer": "default",
          minzoom: 0,
          maxzoom: 22,
          paint: {
            "circle-color": "blue",
            "circle-radius": 4,
          },
        });
    },
    removeMyLayer() {
      if (map.getLayer("postgis-tiles-point-layer")) {
        map.removeLayer("postgis-tiles-point-layer");
        map.removeSource("postgis-tiles2");
      }
    },

    handleSelect() {
      map.setStyle("mapbox://styles/mapbox/" + "satellite-v9");
    },
  },
};
</script>

<style>
.Container {
  width: 100%;
  height: 100%;
  display: flex;
}
.leftBar {
  min-width: 40rem;
  display: flex;
  /* border: 2px solid black; */
  flex-direction: column;
  align-items: center;
}

.leftBarTitle {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rightMap {
  width: 100%;
}

.mapZoomLngLat {
  position: absolute;
  top: 1rem;
  right: 6rem;
  z-index: 99;
  opacity: 0.9;
  font-size: 1.3rem;
}

.mapStyle {
  width: 100%;
  height: 100%;
}

.divider {
  margin: 1.2rem 0;
}
</style>