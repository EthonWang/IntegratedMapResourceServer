<template>
  <div class="Container">
    <div id='features'></div>
    <!-- 右上角zoom坐标显示 -->
    <el-tag class="mapZoomLngLat" type="info">
      Zoom:{{ zoom }} &nbsp; LngLat:{{ showCenter }}
    </el-tag>
    <div class="leftBar">
      <div class="leftBarTitle">
        <h2>{{ mapProjectInfo.name }}</h2>
        <h3 style="margin: 1.2rem 0">编辑区</h3>
        <el-divider class="divider"></el-divider>
      </div>

      <div class="flexRowSpaceAround" style="width: 100%">
        <!--        打开shp选择框，添加shplayer数据-->
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
                      @click="handleAddShpLayer(scope.$index, scope.row)"
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
        <el-button type="success" slot="reference" @click="saveMap">保存地图</el-button>
        <el-button type="info" slot="reference" @click="test">test</el-button>
      </div>

      <!--      shp图层-->
      <el-divider class="divider">图层</el-divider>
      <div class="layerTable">
        <el-table :data="layers" ref="shpLayerTable" row-key="id" size="mini" @cell-click="handleLayerClick"
                  style="width: 100%">
          <el-table-column width="40">
            <template slot-scope="scope">
              <el-switch :width="30" v-model="scope.row.show" @change="handleLayerShowSwitchChange($event,scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
              label="类型"
              prop="type"
              min-width="60"
              show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
              label="名称"
              prop="id"
              min-width="100"
              show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="操作" min-width="115">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  type="success"
                  @click="handleLayerEdit(scope.$index, scope.row)"
                  icon="el-icon-edit"
                  circle
                  style="  margin-left: 5px;"
              >
              </el-button>
              <el-button
                  size="mini"
                  type="danger"
                  @click="handleLayerDelete(scope.$index, scope.row)"
                  icon="el-icon-delete"
                  circle
                  style="  margin-left: 5px;"
              >
              </el-button>
              <el-popover
                  placement="right"
                  width="200"
                  trigger="click">
                <el-select v-model="scope.row.type" placeholder="请选择"
                           @change="handleLayerStyleChange(scope.$index, scope.row)">
                  <el-option
                      v-for="item in [{value:'symbol',label:'图标(symbol)'},{value:'circle',label:'圆(circle)'}]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>

                <el-button
                    v-if="scope.row.type==='circle'||scope.row.type==='symbol'"
                    size="mini"
                    type="primary"
                    icon="el-icon-setting"
                    circle
                    style="  margin-left: 5px;"
                    slot="reference">
                </el-button>
              </el-popover>

            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!--    圆点图层编辑面板-->
    <div class="editBoard" v-if="editorShow=='circleEditorShow'">

      <el-tabs type="border-card" tab-position="left">
        <div class="editBoardTitle">
          <h2> {{ layers[nowLayerIndex]["id"] }}</h2>

          <i class="el-icon-close close-button" style="font-size: 22px" @click="handleCloseEditBoard"></i>
          <!--          <el-button icon="el-icon-close" circle></el-button>-->
        </div>

        <el-tab-pane label="颜色">
          <el-input v-model="layers[nowLayerIndex].paint['circle-color']"
                    @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-color',layers[nowLayerIndex].paint['circle-color'])"
                    placeholder="something"></el-input>
          <el-color-picker
              v-model="layers[nowLayerIndex].paint['circle-color']"
              @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-color',layers[nowLayerIndex].paint['circle-color'])"
              :predefine="predefineColors">
          </el-color-picker>


        </el-tab-pane>
        <el-tab-pane label="半径">
          <h3>半径（px）</h3>
          <el-input-number v-model="layers[nowLayerIndex].paint['circle-radius']"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-radius',layers[nowLayerIndex].paint['circle-radius'])"
                           :min="0" :max="99999"
                           size="medium"

                           label="描述文字">
          </el-input-number>


        </el-tab-pane>
        <el-tab-pane label="透明度">

          <h3>透明度</h3>
          <el-slider
              v-model="layers[nowLayerIndex].paint['circle-opacity']"
              :min=0
              :max=1
              :marks="{0:'0',0.5:'0.5',1:'1'}"
              @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-opacity',layers[nowLayerIndex].paint['circle-opacity'])"
              :step=0.1>
          </el-slider>
          <br>
          <el-input-number v-model="layers[nowLayerIndex].paint['circle-opacity']"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-opacity',layers[nowLayerIndex].paint['circle-opacity'])"
                           :min="0"
                           :max="1"
                           :step="0.1"
                           size="medium"
                           label="描述文字">
          </el-input-number>

        </el-tab-pane>
        <el-tab-pane label="边线颜色">
          <h3>边线颜色</h3>
          <el-input v-model="layers[nowLayerIndex].paint['circle-stroke-color']"
                    @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-stroke-color',layers[nowLayerIndex].paint['circle-stroke-color'])"
                    placeholder="something"></el-input>
          <el-color-picker
              v-model="layers[nowLayerIndex].paint['circle-stroke-color']"
              @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-stroke-color',layers[nowLayerIndex].paint['circle-stroke-color'])"
              :predefine="predefineColors">
          </el-color-picker>
        </el-tab-pane>
        <el-tab-pane label="边线宽度">
          <h3>边线宽度</h3>
          <el-input-number v-model="layers[nowLayerIndex].paint['circle-stroke-width']"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-stroke-width',layers[nowLayerIndex].paint['circle-stroke-width'])"
                           :min="0" :max="99999"
                           size="medium"
                           label="描述文字">
          </el-input-number>
        </el-tab-pane>
        <el-tab-pane label="边线透明度">
          <h3>边线透明度</h3>
          <el-slider
              v-model="layers[nowLayerIndex].paint['circle-stroke-opacity']"
              :min=0
              :max=1
              :marks="{0:'0',0.5:'0.5',1:'1'}"
              @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-stroke-opacity',layers[nowLayerIndex].paint['circle-stroke-opacity'])"
              :step=0.1>
          </el-slider>
          <br>
          <el-input-number v-model="layers[nowLayerIndex].paint['circle-stroke-opacity']"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-stroke-opacity',layers[nowLayerIndex].paint['circle-stroke-opacity'])"
                           :min="0"
                           :max="1"
                           :step="0.1"
                           size="medium"
                           label="描述文字">
          </el-input-number>
        </el-tab-pane>
        <el-tab-pane label="模糊">
          <h3>模糊度</h3>
          <el-slider
              v-model="layers[nowLayerIndex].paint['circle-blur']"
              :min=0
              :max=1
              :marks="{0:'0',0.5:'0.5',1:'1'}"
              @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-blur',layers[nowLayerIndex].paint['circle-blur'])"
              :step=0.1>
          </el-slider>
          <br>
          <el-input-number v-model="layers[nowLayerIndex].paint['circle-blur']"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-blur',layers[nowLayerIndex].paint['circle-blur'])"
                           :min="0"
                           :max="1"
                           :step="0.1"
                           size="medium"
                           label="描述文字">
          </el-input-number>
        </el-tab-pane>
        <el-tab-pane label="平移">
          <h3>平移</h3>
          <h4>x方向（px）：</h4>
          <el-input-number v-model="layers[nowLayerIndex].paint['circle-translate'][0]"
                           :step="1"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-translate',layers[nowLayerIndex].paint['circle-translate'])">
          </el-input-number>
          <h4>y方向（px）：</h4>
          <el-input-number v-model="layers[nowLayerIndex].paint['circle-translate'][1]"
                           :step="1"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-translate',layers[nowLayerIndex].paint['circle-translate'])">
          </el-input-number>
        </el-tab-pane>
        <el-tab-pane label="平移参考">
          <h3>平移参考</h3>
          <el-select v-model="layers[nowLayerIndex].paint['circle-translate-anchor']" placeholder="请选择"
                     @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-translate-anchor',layers[nowLayerIndex].paint['circle-translate-anchor'])">
            <el-option
                v-for="item in ['map','viewport']"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-tab-pane>

        <el-tab-pane label="倾斜对齐">
          <h3>倾斜对齐</h3>
          <el-select v-model="layers[nowLayerIndex].paint['circle-pitch-alignment']" placeholder="请选择"
                     @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-pitch-alignment',layers[nowLayerIndex].paint['circle-pitch-alignment'])">
            <el-option
                v-for="item in ['map','viewport']"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-tab-pane>
        <el-tab-pane label="倾斜缩放">
          <h3>倾斜缩放</h3>
          <el-select v-model="layers[nowLayerIndex].paint['circle-pitch-scale']" placeholder="请选择"
                     @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-pitch-scale',layers[nowLayerIndex].paint['circle-pitch-scale'])">
            <el-option
                v-for="item in ['map','viewport']"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-tab-pane>

      </el-tabs>
    </div>

    <!--    线图层编辑面板-->
    <div class="editBoard" v-if="editorShow=='lineEditorShow'">

      <el-tabs type="border-card" tab-position="left">
        <div class="editBoardTitle">
          <h2> {{ layers[nowLayerIndex]["id"] }}</h2>

          <i class="el-icon-close close-button" style="font-size: 22px" @click="handleCloseEditBoard"></i>
          <!--          <el-button icon="el-icon-close" circle></el-button>-->
        </div>

        <el-tab-pane label="颜色">
          <h3>线颜色</h3>
          <el-input v-model="layers[nowLayerIndex].paint['line-color']"
                    @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-color',layers[nowLayerIndex].paint['line-color'])"
                    placeholder="something"></el-input>
          <el-color-picker
              v-model="layers[nowLayerIndex].paint['line-color']"
              @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-color',layers[nowLayerIndex].paint['line-color'])"
              :predefine="predefineColors">
          </el-color-picker>


        </el-tab-pane>
        <el-tab-pane label="线宽">
          <h3>线宽（px）</h3>
          <el-input-number v-model="layers[nowLayerIndex].paint['line-width']"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-width',layers[nowLayerIndex].paint['line-width'])"
                           :min="0" :max="99999"
                           size="medium"
                           label="描述文字">
          </el-input-number>
        </el-tab-pane>
        <el-tab-pane label="透明度">
          <h3>透明度</h3>
          <el-slider
              v-model="layers[nowLayerIndex].paint['line-opacity']"
              :min=0
              :max=1
              :marks="{0:'0',0.5:'0.5',1:'1'}"
              @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-opacity',layers[nowLayerIndex].paint['line-opacity'])"
              :step=0.1>
          </el-slider>
          <br>
          <el-input-number v-model="layers[nowLayerIndex].paint['line-opacity']"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-opacity',layers[nowLayerIndex].paint['line-opacity'])"
                           :min="0"
                           :max="1"
                           :step="0.1"
                           size="medium"
                           label="描述文字">
          </el-input-number>


        </el-tab-pane>
        <el-tab-pane label="虚线">
          <h3>虚线</h3>
          <div class="flexRowSpaceAround"
               v-for="(item, index) in layers[nowLayerIndex].paint['line-dasharray']"
               :key="index"
               style="height: 40px;">
            <h4 v-if="index %2 ==0">实部:</h4>
            <h4 v-else>虚部:</h4>
            <el-input-number v-model="layers[nowLayerIndex].paint['line-dasharray'][index]"
                             @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-dasharray',layers[nowLayerIndex].paint['line-dasharray'])"
                             :min="0"
                             size="small"
                             label="描述文字">
            </el-input-number>

          </div>

          <el-button type="primary" round @click="layers[nowLayerIndex].paint['line-dasharray'].push(0,0)">添加虚线设置
          </el-button>
        </el-tab-pane>
        <el-tab-pane label="线间隙">
          <h3>线间隙宽度</h3>
          <el-input-number v-model="layers[nowLayerIndex].paint['line-gap-width']"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-gap-width',layers[nowLayerIndex].paint['line-gap-width'])"
                           :min="0" :max="99999"
                           size="medium"
                           label="描述文字">
          </el-input-number>
        </el-tab-pane>

        <el-tab-pane label="模糊">
          <h3>模糊度</h3>
          <el-slider
              v-model="layers[nowLayerIndex].paint['line-blur']"
              :min=0
              :max=1
              :marks="{0:'0',0.5:'0.5',1:'1'}"
              @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-blur',layers[nowLayerIndex].paint['line-blur'])"
              :step=0.1>
          </el-slider>
          <br>
          <el-input-number v-model="layers[nowLayerIndex].paint['line-blur']"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-blur',layers[nowLayerIndex].paint['line-blur'])"
                           :min="0"
                           :max="1"
                           :step="0.1"
                           size="medium"
                           label="描述文字">
          </el-input-number>
        </el-tab-pane>
        <el-tab-pane label="平移">
          <h3>平移</h3>
          <h4>x方向（px）：</h4>
          <el-input-number v-model="layers[nowLayerIndex].paint['line-translate'][0]"
                           :step="1"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-translate',layers[nowLayerIndex].paint['line-translate'])">
          </el-input-number>
          <h4>y方向（px）：</h4>
          <el-input-number v-model="layers[nowLayerIndex].paint['line-translate'][1]"
                           :step="1"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-translate',layers[nowLayerIndex].paint['line-translate'])">
          </el-input-number>
        </el-tab-pane>
        <el-tab-pane label="平移参考">
          <h3>平移参考</h3>
          <el-select v-model="layers[nowLayerIndex].paint['line-translate-anchor']" placeholder="请选择"
                     @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-translate-anchor',layers[nowLayerIndex].paint['line-translate-anchor'])">
            <el-option
                v-for="item in ['map','viewport']"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-tab-pane>
        <el-tab-pane label="偏移">
          <h3>偏移</h3>
          <el-input-number v-model="layers[nowLayerIndex].paint['line-offset']"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-offset',layers[nowLayerIndex].paint['line-offset'])"
                           :min="0" :max="99999"
                           size="medium"
                           label="描述文字">
          </el-input-number>
        </el-tab-pane>
        <el-tab-pane label="线帽">
          <h3>线帽</h3>
          <el-select v-model="layers[nowLayerIndex].layout['line-cap']" placeholder="请选择"
                     @change="handleLayoutChange(layers[nowLayerIndex]['id'],'line-cap',layers[nowLayerIndex].layout['line-cap'])">
            <el-option
                v-for="item in [{label:'平直 butt',value:'butt'},{label:'圆形 round',value:'round'},{label:'方形 square',value:'square'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-tab-pane>
        <el-tab-pane label="线连接">
          <h3>线连接</h3>
          <el-select v-model="layers[nowLayerIndex].layout['line-join']" placeholder="请选择"
                     @change="handleLayoutChange(layers[nowLayerIndex]['id'],'line-join',layers[nowLayerIndex].layout['line-join'])">
            <el-option
                v-for="item in [{label:'尖角 miter',value:'miter'},{label:'圆角 round',value:'round'},{label:'斜角 bevel',value:'bevel'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-tab-pane>


      </el-tabs>
    </div>

    <!--    面图层编辑面板-->
    <div class="editBoard" v-if="editorShow=='fillEditorShow'">

      <el-tabs type="border-card" tab-position="left">
        <div class="editBoardTitle">
          <h2> {{ layers[nowLayerIndex]["id"] }}</h2>

          <i class="el-icon-close close-button" style="font-size: 22px" @click="handleCloseEditBoard"></i>
          <!--          <el-button icon="el-icon-close" circle></el-button>-->
        </div>

        <el-tab-pane label="颜色">
          <h3>填充颜色</h3>
          <el-input v-model="layers[nowLayerIndex].paint['fill-color']"
                    @change="handlePaintChange(layers[nowLayerIndex]['id'],'fill-color',layers[nowLayerIndex].paint['fill-color'])"
                    placeholder="something"></el-input>
          <el-color-picker
              v-model="layers[nowLayerIndex].paint['fill-color']"
              @change="handlePaintChange(layers[nowLayerIndex]['id'],'fill-color',layers[nowLayerIndex].paint['fill-color'])"
              :predefine="predefineColors">
          </el-color-picker>
        </el-tab-pane>

        <el-tab-pane label="透明度">
          <h3>透明度</h3>
          <el-slider
              v-model="layers[nowLayerIndex].paint['fill-opacity']"
              :min=0
              :max=1
              :marks="{0:'0',0.5:'0.5',1:'1'}"
              @change="handlePaintChange(layers[nowLayerIndex]['id'],'fill-opacity',layers[nowLayerIndex].paint['fill-opacity'])"
              :step=0.1>
          </el-slider>
          <br>
          <el-input-number v-model="layers[nowLayerIndex].paint['fill-opacity']"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'fill-opacity',layers[nowLayerIndex].paint['fill-opacity'])"
                           :min="0"
                           :max="1"
                           :step="0.1"
                           size="medium"
                           label="描述文字">
          </el-input-number>
        </el-tab-pane>

        <el-tab-pane label="边线颜色">
          <h3>边线颜色</h3>
          <span>（该属性需要抗锯齿属性为true）</span>
          <el-input v-model="layers[nowLayerIndex].paint['fill-outline-color']"
                    @change="handlePaintChange(layers[nowLayerIndex]['id'],'fill-outline-color',layers[nowLayerIndex].paint['fill-outline-color'])"
                    placeholder="something"></el-input>
          <el-color-picker
              v-model="layers[nowLayerIndex].paint['fill-outline-color']"
              @change="handlePaintChange(layers[nowLayerIndex]['id'],'fill-outline-color',layers[nowLayerIndex].paint['fill-outline-color'])"
              :predefine="predefineColors">
          </el-color-picker>
        </el-tab-pane>

        <el-tab-pane label="平移">
          <h3>平移</h3>
          <h4>x方向（px）：</h4>
          <el-input-number v-model="layers[nowLayerIndex].paint['fill-translate'][0]"
                           :step="1"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'fill-translate',layers[nowLayerIndex].paint['fill-translate'])">
          </el-input-number>
          <h4>y方向（px）：</h4>
          <el-input-number v-model="layers[nowLayerIndex].paint['fill-translate'][1]"
                           :step="1"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'fill-translate',layers[nowLayerIndex].paint['fill-translate'])">
          </el-input-number>
        </el-tab-pane>
        <el-tab-pane label="平移参考">
          <h3>平移参考</h3>
          <el-select v-model="layers[nowLayerIndex].paint['fill-translate-anchor']" placeholder="请选择"
                     @change="handlePaintChange(layers[nowLayerIndex]['id'],'fill-translate-anchor',layers[nowLayerIndex].paint['fill-translate-anchor'])">
            <el-option
                v-for="item in ['map','viewport']"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-tab-pane>

        <el-tab-pane label="抗锯齿">
          <h3>抗锯齿</h3>
          <el-switch v-model="layers[nowLayerIndex].paint['fill-antialias']"
                     @change="handlePaintChange(layers[nowLayerIndex]['id'],'fill-antialias',layers[nowLayerIndex].paint['fill-antialias'])">
          </el-switch>
        </el-tab-pane>

      </el-tabs>
    </div>

    <!--    图标图层编辑面板-->
    <div class="editBoard" v-if="editorShow=='symbolEditorShow'">

      <el-tabs type="border-card" tab-position="left">
        <div class="editBoardTitle">
          <h2> {{ layers[nowLayerIndex]["id"] }}</h2>

          <i class="el-icon-close close-button" style="font-size: 22px" @click="handleCloseEditBoard"></i>
          <!--          <el-button icon="el-icon-close" circle></el-button>-->
        </div>

        <el-tab-pane label="图标">
          <h3>图标选择</h3>
          <el-table
              :data="symbolTableData"
              style="width: 200px">
            <el-table-column
                prop="originNmae"
                label="预览"
                width="50">
            </el-table-column>
            <el-table-column
                prop="originName"
                label="名称"
                width="100">
            </el-table-column>

            <el-table-column label="操作" width="50">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">使用</el-button>
              </template>
            </el-table-column>

          </el-table>
          <el-pagination
              small
              @current-change="handleCurrentChangeSymbol"
              :current-page="currentPageSymbol"
              :page-size="pageSizeSymbol"
              layout="total, prev, pager, next"
              :total="totalDataCountSymbol"
              class="flexRowCenter"
          >
          </el-pagination>
        </el-tab-pane>

        <el-tab-pane label="图标大小">
          <h3>图标大小</h3>
          <el-input-number v-model="layers[nowLayerIndex].layout['icon-size']"
                           @change="handleLayoutChange(layers[nowLayerIndex]['id'],'icon-size',layers[nowLayerIndex].layout['icon-size'])"
                           :min="0" :max="99999"
                           size="medium"
                           label="描述文字">
          </el-input-number>
        </el-tab-pane>

        <el-tab-pane label="透明度">
          <h3>透明度</h3>
          <el-slider
              v-model="layers[nowLayerIndex].paint['icon-opacity']"
              :min=0
              :max=1
              :marks="{0:'0',0.5:'0.5',1:'1'}"
              @change="handlePaintChange(layers[nowLayerIndex]['id'],'icon-opacity',layers[nowLayerIndex].paint['icon-opacity'])"
              :step=0.1>
          </el-slider>
          <br>
          <el-input-number v-model="layers[nowLayerIndex].paint['icon-opacity']"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'icon-opacity',layers[nowLayerIndex].paint['icon-opacity'])"
                           :min="0"
                           :max="1"
                           :step="0.1"
                           size="medium"
                           label="描述文字">
          </el-input-number>
        </el-tab-pane>


        <el-tab-pane label="平移">
          <h3>平移</h3>
          <h4>x方向（px）：</h4>
          <el-input-number v-model="layers[nowLayerIndex].paint['icon-translate'][0]"
                           :step="1"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'icon-translate',layers[nowLayerIndex].paint['icon-translate'])">
          </el-input-number>
          <h4>y方向（px）：</h4>
          <el-input-number v-model="layers[nowLayerIndex].paint['icon-translate'][1]"
                           :step="1"
                           @change="handlePaintChange(layers[nowLayerIndex]['id'],'icon-translate',layers[nowLayerIndex].paint['icon-translate'])">
          </el-input-number>
        </el-tab-pane>
        <el-tab-pane label="平移参考">
          <h3>平移参考</h3>
          <el-select v-model="layers[nowLayerIndex].paint['icon-translate-anchor']" placeholder="请选择">
            <el-option
                v-for="item in ['map','viewport']"
                :key="item"
                :label="item"
                :value="item"
                @change="handlePaintChange(layers[nowLayerIndex]['id'],'icon-translate-anchor',layers[nowLayerIndex].paint['icon-translate-anchor'])">
            </el-option>
          </el-select>
        </el-tab-pane>

        <el-tab-pane label="倾斜对齐">
          <h3>倾斜对齐</h3>
          <el-select v-model="layers[nowLayerIndex].paint['icon-pitch-alignment']" placeholder="请选择">
            <el-option
                v-for="item in ['auto','map','viewport']"
                :key="item"
                :label="item"
                :value="item"
                @change="handlePaintChange(layers[nowLayerIndex]['id'],'icon-pitch-alignment',layers[nowLayerIndex].paint['icon-pitch-alignment'])">
            </el-option>
          </el-select>
        </el-tab-pane>


      </el-tabs>
    </div>


    <div class="rightMap">
      <div id="map" class="mapStyle"></div>
    </div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import requestApi from "../api/requestApi";
import layerStyleProperties from "../assets/js/layerStyleProperties";
import Sortable from "sortablejs";

var map = null;

export default {
  data() {
    return {

      //添加shp数据时列表
      shpTableData: [],
      currentPageShp: 1,
      pageSizeShp: 5,
      searchInputShp: "",
      totalDataCountShp: 0,

      //左侧shp图层树
      layersNameObject: {}, //检测重复  后端字段为layerTree

      //mapbox地图
      mapProjectInfo: {},
      mapProjectId: "", //地图项目id
      zoom: 6,
      center: "119,32",
      showCenter: "119,32",
      sources: {},
      layers: [],

      nowLayerIndex: 0,
      editorShow: '',

      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585'],

      //图标数据
      symbolTableData:[],
      currentPageSymbol: 1,
      pageSizeSymbol: 5,
      searchInputSymbol: "",
      totalDataCountSymbol: 0,



    };
  },
  mounted() {
    this.mapProjectId = this.$route.params.mapProjectId
    this.getMapProjectInfo()

    //layer拖动排序
    this.initSort();
  },

  methods: {
    test() {
      console.log("cccc")
      map.setLayoutProperty("map_points", "circle-sort-key", 99999);
      let pt = map.getLayoutProperty('map_points', 'circle-sort-key');
      console.log("pt sort key", pt)
    },
    getMapProjectInfo() {
      requestApi.getMapProjectById(this.mapProjectId)
          .then((res) => {
            this.mapProjectInfo = res.data.data
            console.log(this.mapProjectInfo);
            this.center = this.mapProjectInfo.center.split(',')
            this.zoom = this.mapProjectInfo.zoom
            this.sources = this.mapProjectInfo.sources
            this.layers = this.mapProjectInfo.layers.layers
            this.layersNameObject = this.mapProjectInfo.layerTree
            this.createEmptyMap()
            this.initMapWithData()
          })
          .catch((error) => {
            console.log(error);
          });
    },

    //创建空地图
    createEmptyMap() {
      mapboxgl.accessToken =
          "pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg";

      map = new mapboxgl.Map({
        container: "map",
        // glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",

        // style: "mapbox://styles/mapbox/streets-v11", // style URL
        // center: this.center,
        // zoom: this.zoom,
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

      //zoom
      map.on("zoom", () => {
        this.zoom = map.getZoom().toFixed(2);
      });

      //center
      map.on("mousemove", (e) => {
        // this.center =
        //     String(e.lngLat.lng.toFixed(8)) +
        //     "," +
        //     String(e.lngLat.lat.toFixed(8));
        this.center = String(e.lngLat.lng) + "," + String(e.lngLat.lat)
        this.showCenter = String(e.lngLat.lng.toFixed(5)) + "," + String(e.lngLat.lat.toFixed(5))
      });

      //选中某元素
      map.on('mouseenter', 're', function (e) {
        map.getCanvas().style.cursor = 'pointer';
        console.log("eeeeeeeeee gid:", e.features[0].properties.gid);
      });

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 're', function () {
        map.getCanvas().style.cursor = '';
      });


      // map.on("load", () => {
      //
      //   //添加mapbox示例数据
      //   map.addLayer({
      //     id: "terrain-data",
      //     type: "line",
      //     source: {
      //       type: "vector",
      //       url: "mapbox://mapbox.mapbox-terrain-v2",
      //     },
      //     "source-layer": "contour",
      //     layout: {
      //       "line-join": "round",
      //       "line-cap": "round",
      //     },
      //     paint: {
      //       "line-color": "#ff69b4",
      //       "line-width": 1,
      //     },
      //   });
      // });
    },

    //数据回来后初始化地图
    initMapWithData() {
      console.log("initMapWithData");

      map.setZoom(this.zoom)
      map.setCenter(this.center)

      for (let i in this.sources) {
        let newSource = {
          sourceName: i,
          sourceType: this.sources[i].type,
          sourceTiles: this.sources[i].tiles,
        }
        this.addSourceToMap(newSource)
      }

      for (let i = this.layers.length - 1; i >= 0; i--) {
        this.addLayerToMap(this.layers[i])
      }
    },

    saveMap() {
      this.$confirm('是否保存地图?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        for (let i in this.layers) {
          this.layers[i].layout.visibility = this.layers[i].show ? "visible" : "none"
        }

        this.mapProjectInfo.zoom = this.zoom
        this.mapProjectInfo.center = this.center.toString()
        this.mapProjectInfo.sources = this.sources
        this.mapProjectInfo.layers = {layers: this.layers}
        this.mapProjectInfo.layerTree = this.layersNameObject

        requestApi.updateMapProject(JSON.stringify(this.mapProjectInfo))
            .then(() => {
              this.$message.success('保存成功!');
            })
            .catch((error) => {
              console.log(error);
            });
      }).catch(() => {
        this.$message.info("取消保存");
      });
    },

    //打开shp选择框
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

    handleCurrentChangeShp(val) {
      this.currentPageShp = val;
      this.addShpData();
    },

    initSort() {
      const tbody = this.$refs.shpLayerTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      const _this = this
      Sortable.create(tbody, {
        draggable: ".el-table__row",
        animation: 150,
        onEnd({newIndex, oldIndex}) {
          _this.handleCloseEditBoard()
          const currRow = _this.layers.splice(oldIndex, 1)[0]
          _this.layers.splice(newIndex, 0, currRow)
          _this.handleShowSortChange(newIndex)
        }
      })
    },


    handleShowSortChange(newIndex) {
      let aimLayer = this.layers[newIndex];
      this.handleRemoveLayer(aimLayer.id)
      if (newIndex === 0) {
        map.addLayer(aimLayer)
      } else {
        map.addLayer(aimLayer, this.layers[newIndex - 1].id)
      }
    },

    //向shp树添加shp,即source,同时添加shplayer
    handleAddShpLayer(index, row) {
      console.log(row)
      let newSource = {
        sourceName: row.tableName,
        sourceType: "vector",
        sourceTiles: ["http://172.21.212.63:8991/mvt/" + row.tableName + "/{z}/{x}/{y}.pbf"],
      }
      if (!Object.prototype.hasOwnProperty.call(this.sources, newSource.sourceName)) {
        this.sources[newSource.sourceName] = {
          type: newSource.sourceType,
          tiles: newSource.sourceTiles,
        }
        this.addSourceToMap(newSource)
      }
      let geoType = row.geoType

      if (row.geoType.indexOf("LINE") !== -1) {
        geoType = "line"
      } else if (row.geoType.indexOf("POLYGON") !== -1) {
        geoType = "fill"
      } else {
        geoType = "circle"
      }

      let newLayer = {
        index: index,
        show: true,
        originName: row.originName,
        id: row.originName,
        type: geoType,
        filter: ["all"],
        layout: layerStyleProperties[geoType].layout,
        maxzoom: 22,
        metadata: "",
        minzoom: 0,
        paint: layerStyleProperties[geoType].paint,
        source: newSource.sourceName,
        "source-layer": "default"
      }
      if (geoType !== "symbol") {
        newLayer.paint[geoType + "-color"] = "#" + Math.random().toString(16).substr(2, 6)
      }

      if (!Object.prototype.hasOwnProperty.call(this.layersNameObject, newLayer.originName)) {
        this.layersNameObject[newLayer.originName] = 1
      } else {
        this.layersNameObject[newLayer.originName] += 1
        newLayer.id = row.originName + this.layersNameObject[newLayer.originName]
      }

      this.layers.unshift(newLayer)
      this.addLayerToMap(newLayer)
    },

    //向地图添加数据源source
    addSourceToMap(newSource) {
      console.log("add new source：" + newSource.sourceName)

      map.addSource(newSource.sourceName, {
        type: newSource.sourceType,
        tiles: newSource.sourceTiles,
      })
    },

    //向地图添加layer
    addLayerToMap(newLayer) {
      console.log("add new layer：" + newLayer.id)
      map.addLayer(newLayer)
    },

    loadAndAddImg(imgUrl, imgName) {
      map.loadImage(imgUrl, (error, image) => {
        if (error) throw error;
        map.addImage(imgName, image);
      })
    },

    handleLayerEdit(index, row) {
      console.log(index, row)
      this.nowLayerIndex = index
      if (row.type === "line") {
        this.editorShow = 'lineEditorShow'
      } else if (row.type === "fill") {
        this.editorShow = 'fillEditorShow'
      } else if (row.type === "circle") {
        this.editorShow = 'circleEditorShow'
      } else {
        this.editorShow = "symbolEditorShow"
        this.getSymbolList()
      }
    },

    handleCloseEditBoard() {
      this.editorShow = ''
    },

    handleLayerDelete(index, row) {
      index, row
      this.editorShow=""
      let aimSource = row.source
      let layerOriginName = row.originName
      let layerid = row.id
      this.layers.splice(index, 1)
      this.layersNameObject[layerOriginName] -= 1
      this.handleRemoveLayer(layerid)
      if (this.layersNameObject[layerOriginName] === 0) {
        delete this.layersNameObject[layerOriginName]
        this.handleRemoveSource(aimSource)
        delete this.sources[aimSource]
      }
    },

    handleLayerStyleChange(index, row) {
      index, row
      console.log("row: ",row)
      // map.removeLayer(row.id);
      //
      // let newLayer=row
      //
      //
      // if (index === 0) {
      //   map.addLayer(aimLayer)
      // } else {
      //   map.addLayer(aimLayer, this.layers[newIndex - 1].id)
      // }
    },

    getSymbolList(){
      requestApi.getSymbolList({
        asc: false,
        page: this.currentPageSymbol,
        pageSize: this.pageSizeSymbol,
        searchText: this.searchInputSymbol,
        sortField: "createTime",
      })
          .then((res) => {
            console.log(res.data);
            this.symbolTableData = res.data.data.content;
            this.totalDataCountSymbol = res.data.data.totalElements;
          })
          .catch((error) => {
            console.log(error);
          });
    },

    handleCurrentChangeSymbol(val){
      this.currentPageSymbol=val
      this.getSymbolList()
    },

    handleLayerClick(row) {
      console.log(row)
      // if (row.type === "circle") {
      //   this.pointEditorShow = !this.pointEditorShow;
      // }
    },

    handleLayerShowSwitchChange(val, row) {
      if (val) {
        this.handleLayoutChange(row.id, "visibility", "visible")
      } else {
        this.handleLayoutChange(row.id, "visibility", "none")
      }
    },

    handleRemoveSource(sourceName) {
      map.removeSource(sourceName);
    },

    handleRemoveLayer(layerName) {
      map.removeLayer(layerName);
    },

    handleLayoutChange(layerName, key, value) {
      console.log("layout:", layerName, key, value)
      map.setLayoutProperty(layerName, key, value);
    },

    handlePaintChange(layerName, key, value) {
      console.log("paint:", layerName, key, value)
      map.setPaintProperty(layerName, key, value);
    }

  },
};
</script>

<style>

#temp-features {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  overflow: auto;
  background: rgba(255, 255, 255, 0.8);
}

.Container {
  width: 100%;
  height: 100%;
  display: flex;
}

.leftBar {
  min-width: 330px;
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

.editBoard {
  display: flex;
  height: 100%;
  width: 350px;
  position: absolute;
  margin-left: 330px;
  z-index: 99;
}

.editBoardTitle {
  display: flex;
  justify-content: space-between;
}

.close-button:hover {
  cursor: pointer;
  color: Red;
}

.editBoard .el-tabs--border-card > .el-tabs__header {
  background-color: rgb(255, 255, 255);
  width: 100px;
}

.editBoard .el-tabs--border-card {
  box-shadow: none;
}

.editBoard .el-tabs--left.el-tabs--border-card .el-tabs__item.is-left {
  text-align: left;
  padding: 0px 10px;
  /*margin: 10px 0px;*/
}

.editBoard .el-tabs--border-card > .el-tabs__content {
  margin: 5px 10px 0px 0px;
  width: 200px;
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