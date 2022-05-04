<template>
  <div class="Container">
    <!-- 右上角zoom坐标显示 -->
    <el-tag class="mapZoomLngLat" type="info"
    >Zoom:{{ currentZoom }} &nbsp; LngLat:{{ currentLngLat }}
    </el-tag
    >
    <div class="leftBar">
      <div class="leftBarTitle">
        <h1 style="margin: 1.2rem 0">编辑区</h1>
        <el-divider class="divider"></el-divider>
      </div>

      <div class="flewRowSpaceAround" style="width: 100%">
        <!--        添加shplayer数据-->
        <div>
          <el-popover
              placement="right"
              width="250"
              trigger="click">
            <el-table :data="shpTableData">
              <el-table-column property="originName" width="170" show-overflow-tooltip label="名称"></el-table-column>
              <el-table-column width="80" label="操作">
                <template slot-scope="scope">
                  <el-button
                      size="mini"
                      type="primary"
                      @click="handleEdit(scope.$index, scope.row)"
                  >添加
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
                small
                @current-change="handleCurrentChangeShp"
                :current-page="currentPageShp"
                :page-size="pageSizeShp"
                layout="total, prev, pager, next"
                :total="totalDataCountShp"
                class="flexRowCenter"
            >
            </el-pagination>
            <el-button type="primary" slot="reference" @click="addShpData">添加数据</el-button>
          </el-popover>
        </div>
        <el-button size="mini" @click="handleSelect">切换底图</el-button>
        <el-button size="mini" @click="addMyLayer">添加图层</el-button>
        <el-button size="mini" @click="removeMyLayer">移除图层</el-button>
      </div>

      <!--      shp图层-->
      <el-divider class="divider">图层</el-divider>
      <div class="layerTable">
        <el-table :data="layerTableData" size="mini" style="width: 100%">
          <el-table-column width="50">
            <template slot-scope="scope">
              <el-switch :width="30" v-model="scope.row.isShow">

              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
              label="类型"
              prop="type"
              min-width="50"
              show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
              label="名称"
              prop="name"
              min-width="150"
              show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  type="success"
                  @click="handleEdit(scope.$index, scope.row)"
                  icon="el-icon-edit"
                  circle
              >
              </el-button
              >
              <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  icon="el-icon-delete"
                  circle
              >
              </el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>


    </div>

    <div class="rightMap">
      <div id="map" class="mapStyle"></div>
    </div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import requestApi from "../api/requestApi";

var map = null;
export default {


  data() {
    return {
      projectId: "", //地图项目id

      currentZoom: "9",
      currentLngLat: "119, 32",


      layerTableData: [],//当前添加的图层shp
      layerShowShpList: [""],//当前显示的图层

      //添加shp数据时列表
      shpTableData: [],
      currentPageShp: 1,
      pageSizeShp: 5,
      searchInputShp: "",
      totalDataCountShp: 0,

    };
  },
  mounted() {
    // this.initMap();
    this.initMapbox();
  },

  methods: {


    initMapbox() {
      mapboxgl.accessToken =
          "pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg";

      map = new mapboxgl.Map({
        container: "map", // container ID
        // style: 'mapbox://styles/mapbox/streets-v11',
        // style:"http://127.0.0.1/api/v1/styles/3eada7e0ae4411ec8cb88b1eae413f21/draft?access_token=tk.fb799200ae8311ec8cb88b1eae413f21",
        // style:"https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg",
        style:"http://172.21.212.63:8991/mapServer/626a592bc27f00a2b6b029f1",
        // center: [-122.486052, 37.830348], // starting position [lng, lat]
        // zoom: 7, // starting zoom
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
            // map.addSource("112233", {
            //   type: "vector",
            //   tiles: ["http://172.21.212.63:8991/mvt/points_5w_623f05d8c27fed7dbdc52207/{z}/{x}/{y}.pbf"],
            // });
            map.addSource("testMapLine", {
              type: "vector",
              tiles: ["http://172.21.212.63:8995/mvt/map_lines_625984a8c27fe412a844025c/{z}/{x}/{y}.pbf?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTEifQ.Ne6qdHY2XgpBNQ74MeO-23ZyF0OahH-AHMbrXqhKlwU"]
            });
            map.addSource("testMapPoint", {
              type: "vector",
              tiles: ["http://172.21.212.63:8995/mvt/outlet_955a104f_e489_4f38_a449_a750d8d052e3/{z}/{x}/{y}.pbf?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTEifQ.Ne6qdHY2XgpBNQ74MeO-23ZyF0OahH-AHMbrXqhKlwU"]
            });

            map.addSource("testMapPolygon", {
              type: "vector",
              tiles: ["http://172.21.212.63:8995/mvt/mask_e40dd61b_ed2e_4cb6_b9df_9d30eed9bcb7/{z}/{x}/{y}.pbf?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTEifQ.Ne6qdHY2XgpBNQ74MeO-23ZyF0OahH-AHMbrXqhKlwU"]
            });

            map.addSource("testPointJson", {
              type: "geojson",
              // data: "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_ports.geojson"
              data:"http://localhost:8999/model/getShpJsonData?shpJsonPath=%2FSWAT%2FData%2FVisualization%2FTestData%2FshpJson%2FshpJson.json"
            });


            // map.addSource("postgis-tiles", {
            //   type: "vector",
            //   // tiles: ["http://172.21.212.63:8991/mvt/map_lines_623e7508c27f63cd63da3930/{z}/{x}/{y}.pbf"],
            //   url: "http://127.0.0.1/api/v1/tilesets/73f03020ae4511ec8cb88b1eae413f21.json?access_token=tk.3b9fc070ae9811ec8cb88b1eae413f21"
            // });

            //线测试
            // map.addLayer({
            //   id: "testMapLineLayer",
            //   type: "line",
            //   source: "testMapLine",
            //   // ST_AsMVT() uses 'default' as layer name
            //   "source-layer": "default",
            //   minzoom: 0,
            //   maxzoom: 22,
            //   paint: {
            //     "line-opacity": 0.7,
            //     "line-color": "red",
            //     "line-width": 1,
            //   },
            // });

            //点测试
            // map.addLayer({
            //   id: "testMapPointLayer",
            //   type: "circle",
            //   source: "testMapPoint",
            //   // ST_AsMVT() uses 'default' as layer name
            //   "source-layer": "default",
            //   minzoom: 0,
            //   maxzoom: 22,
            //   paint: {
            //     "circle-color": "blue",
            //     "circle-radius": 20,
            //   },
            // });

            // //面测试
            // map.addLayer({
            //   id: "testMapPolygonLayer",
            //   type: "fill",
            //   source: "testMapPolygon",
            //   // ST_AsMVT() uses 'default' as layer name
            //   "source-layer": "default",
            //   minzoom: 0,
            //   maxzoom: 22,
            //   paint: {
            //     'fill-color': '#5a3fc0',
            //     'fill-opacity': 0.3
            //   },
            // });

            //json点测试
            // map.addLayer({
            //   id: "testPointJsonLayer",
            //   type: "circle",
            //   source: "testPointJson",
            //   // ST_AsMVT() uses 'default' as layer name
            //   // "source-layer": "default",
            //   minzoom: 0,
            //   maxzoom: 22,
            //   paint: {
            //     "circle-color": "red",
            //     "circle-radius": 10,
            //   },
            // });



            map.loadImage(
                // 'https://docs.mapbox.com/mapbox-gl-js/assets/cat.png',
                'http://172.21.212.63:8991/symbol/getSymbolById/6269393bc27f445784fdd7a0',
                (error, image) => {

                  if (error) throw error;

                  map.addImage('cat', image);

                  map.addSource('point', {
                    'type': 'geojson',
                    'data': {
                      'type': 'FeatureCollection',
                      'features': [
                        {
                          'type': 'Feature',
                          'geometry': {
                            'type': 'Point',
                            'coordinates': [-77.4144, 25.0759]
                          }
                        }
                      ]
                    }
                  });

// Add a layer to use the image to represent the data.
                  map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'point', // reference the data source
                    'layout': {
                      'icon-image': 'cat', // reference the image
                      'icon-size': 0.5
                    }
                  });
                }
            );

            // map.addLayer({
            //   "id": "route",
            //   "type": "line",
            //   "source": {
            //     "type": "geojson",
            //     "data": {
            //       "type": "Feature",
            //       "properties": {},
            //       "geometry": {
            //         "type": "LineString",
            //         "coordinates": [
            //           [-122.48369693756104, 37.83381888486939],
            //           [-122.48348236083984, 37.83317489144141],
            //           [-122.48339653015138, 37.83270036637107],
            //           [-122.48356819152832, 37.832056363179625],
            //           [-122.48404026031496, 37.83114119107971],
            //           [-122.48404026031496, 37.83049717427869],
            //           [-122.48348236083984, 37.829920943955045],
            //           [-122.48356819152832, 37.82954808664175],
            //           [-122.48507022857666, 37.82944639795659],
            //           [-122.48610019683838, 37.82880236636284],
            //           [-122.48695850372314, 37.82931081282506],
            //           [-122.48700141906738, 37.83080223556934],
            //           [-122.48751640319824, 37.83168351665737],
            //           [-122.48803138732912, 37.832158048267786],
            //           [-122.48888969421387, 37.83297152392784],
            //           [-122.48987674713133, 37.83263257682617],
            //           [-122.49043464660643, 37.832937629287755],
            //           [-122.49125003814696, 37.832429207817725],
            //           [-122.49163627624512, 37.832564787218985],
            //           [-122.49223709106445, 37.83337825839438],
            //           [-122.49378204345702, 37.83368330777276]
            //         ]
            //       }
            //     }
            //   },
            //   "layout": {
            //     "line-join": "round",
            //     "line-cap": "round"
            //   },
            //   "paint": {
            //     "line-color": "#888",
            //     "line-width": 8
            //   }
            // });


            // map.addLayer({
            //   id: "postgis-tiles-line-layer",
            //   type: "line",
            //   source: "postgis-tiles",
            //   // ST_AsMVT() uses 'default' as layer name
            //   "source-layer": "map_lines",
            //   minzoom: 0,
            //   maxzoom: 22,
            //   paint: {
            //     "line-opacity": 0.7,
            //     "line-color": "red",
            //     "line-width": 1,
            //   },
            // });

            //添加mapbox示例数据
            // map.addLayer({
            //   id: "terrain-data",
            //   type: "line",
            //   source: {
            //     type: "vector",
            //     url: "mapbox://mapbox.mapbox-terrain-v2",
            //   },
            //   "source-layer": "contour",
            //   layout: {
            //     "line-join": "round",
            //     "line-cap": "round",
            //   },
            //   paint: {
            //     "line-color": "#ff69b4",
            //     "line-width": 1,
            //   }
            // });

          });
    },
    addMyLayer() {
      console.log("asda");
      // map.addSource("postgis-tiles2", {
      //   type: "vector",
      //   tiles: ["http://172.21.212.63:8991/mvt/points_5w_623f05d8c27fed7dbdc52207/{z}/{x}/{y}.pbf"],
      //   // url:"http://127.0.0.1/api/v1/tilesets/73f03020ae4511ec8cb88b1eae413f21.json?access_token=tk.3b9fc070ae9811ec8cb88b1eae413f21"
      // }),

      map.addLayer({
        id: "wqeqweq",
        type: "circle",
        source: "112233",
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


    addPolygonLayer() {
      console.log("asda");
      map.addSource("postgis-tiles3", {
        type: "vector",
        tiles: ["http://172.21.212.63:8991/mvt/map_multipolygons/{z}/{x}/{y}.pbf"],
      }),
          map.addLayer({
            id: "postgis-tiles-polygon-layer",
            type: "fill",
            source: "postgis-tiles3",
            // ST_AsMVT() uses 'default' as layer name
            "source-layer": "default",
            minzoom: 0,
            maxzoom: 22,
            paint: {
              'fill-color': '#5a3fc0',
              'fill-opacity': 0.3
            },
          });
    },

    removeMyLayer() {
      if (map.getLayer("postgis-tiles-point-layer")) {
        map.removeLayer("postgis-tiles-point-layer");
        map.removeSource("postgis-tiles2");
      }
    },
    addShpData() {
      requestApi.getShpList({
        asc: false,
        page: this.currentPageShp,
        pageSize: this.pageSizeShp,
        searchText: this.searchInputShp,
        sortField: "uploadDate",
      })
          .then((res) => {
            console.log(res.data);
            this.shpTableData = res.data.data.content;
            this.totalDataCountShp = res.data.data.totalElements;
          })
          .catch((error) => {
            console.log(error);
          });
    },
    handleSelect() {
      map.setStyle("mapbox://styles/mapbox/" + "satellite-v9");
    },

    handleCurrentChangeShp(val) {
      this.currentPageShp = val;
      this.getShpList();
    }

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
  min-width: 400px;
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

.layerTable {
  width: 100%;
}

.rightMap {
  width: 100%;
}

.mapZoomLngLat {
  position: absolute;
  top: 10px;
  right: 60px;
  z-index: 99;
  background-color: #ffffff !important;
  font-size: 13px;
}

.mapStyle {
  width: 100%;
  height: 100%;
}

.divider {
  margin: 12px 0;
}
</style>