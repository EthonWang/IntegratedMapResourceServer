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

      <!--      图层列表-->
      <el-divider class="divider">图层</el-divider>
      <div class="layerTable">
        <el-table :data="layers" ref="shpLayerTable" row-key="id" size="mini" @cell-click="handleLayerClick()"
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

    <div class="editBoard" v-if="editorShow=='circleEditorShow' || editorShow=='lineEditorShow' || editorShow=='fillEditorShow' || editorShow=='symbolEditorShow'">
      <div v-show="nameEdit === false" class="editBoardTitle" @click="nameEdit = true">
        <div> {{ layers[nowLayerIndex]['id'] }}</div>
        <i class="el-icon-edit"></i>
      </div>
      <div v-show="nameEdit === true" class="editBoardTitle" >
        <el-input v-model="layers[nowLayerIndex]['id']" size="mini" @change="nameEdit=false"></el-input>
        <i class="el-icon-check" @click="nameEdit=false"></i>
      </div>
      <el-tabs value="first">
        <el-tab-pane label="样式设置" name="first">
        <!--    圆点图层编辑面板-->
          <el-tabs :before-leave='leaveTab' v-if="editorShow=='circleEditorShow'" type="border-card" value="first" tab-position="left">
            <el-tab-pane label="颜色" name="first">
              <h3>颜色</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="display:flex;margin-top:10px">
                <el-color-picker
                    v-model="layers[nowLayerIndex].paint['circle-color']"
                    @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-color',layers[nowLayerIndex].paint['circle-color'])"
                    :predefine="predefineColors">
                </el-color-picker>
                <el-input v-model="layers[nowLayerIndex].paint['circle-color']"
                          @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-color',layers[nowLayerIndex].paint['circle-color'])"
                          placeholder="something" style="width:50%"></el-input>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='circle-color' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="半径" name="second">
              <h3>半径（px）</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="display:flex;margin-top:10px">
                <el-input-number v-model="layers[nowLayerIndex].paint['circle-radius']"
                                @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-radius',layers[nowLayerIndex].paint['circle-radius'])"
                                :min="0" :max="99999"
                                size="medium"

                                label="描述文字">
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='circle-radius' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="透明度" name="third">
              <h3>透明度</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="margin-top:10px">
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
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='circle-opacity' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="边线颜色" name="forth">
              <h3>边线颜色</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="display:flex;margin-top:10px">
                <el-input v-model="layers[nowLayerIndex].paint['circle-stroke-color']"
                          @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-stroke-color',layers[nowLayerIndex].paint['circle-stroke-color'])"
                          placeholder="something"></el-input>
                <el-color-picker
                    v-model="layers[nowLayerIndex].paint['circle-stroke-color']"
                    @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-stroke-color',layers[nowLayerIndex].paint['circle-stroke-color'])"
                    :predefine="predefineColors">
                </el-color-picker>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='circle-stroke-color' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="边线宽度" name="fifth">
              <h3>边线宽度</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="display:flex;margin-top:10px">
                <el-input-number v-model="layers[nowLayerIndex].paint['circle-stroke-width']"
                                @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-stroke-width',layers[nowLayerIndex].paint['circle-stroke-width'])"
                                :min="0" :max="99999"
                                size="medium"
                                label="描述文字">
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='circle-stroke-width' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="边线透明度" name="sixth">
              <h3>边线透明度</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="margin-top:10px">
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
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='circle-stroke-opacity' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="模糊" name="seventh">
              <h3>模糊度</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow">
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
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='circle-blur' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="平移" name="eighth">
              <h3>平移</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="margin-top:10px;display:flex">
                <h4>x轴(px):&nbsp;</h4>
                <el-input-number v-model="layers[nowLayerIndex].paint['circle-translate'][0]"
                                :step="1"
                                @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-translate',layers[nowLayerIndex].paint['circle-translate'])">
                </el-input-number>
              </el-row>
              <el-row v-if="menuButtonShow" style="display:flex">
                <h4>y轴(px):&nbsp;</h4>
                <el-input-number v-model="layers[nowLayerIndex].paint['circle-translate'][1]"
                                :step="1"
                                @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-translate',layers[nowLayerIndex].paint['circle-translate'])">
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='circle-translate' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="平移参考" name="ninth">
              <h3>平移参考</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="display:flex;margin-top:10px">
              <el-select v-model="layers[nowLayerIndex].paint['circle-translate-anchor']" placeholder="请选择"
                        @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-translate-anchor',layers[nowLayerIndex].paint['circle-translate-anchor'])">
                <el-option
                    v-for="item in ['map','viewport']"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='circle-translate-anchor' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="倾斜对齐" name="tentn">
              <h3>倾斜对齐</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="display:flex;margin-top:10px">
                <el-select v-model="layers[nowLayerIndex].paint['circle-pitch-alignment']" placeholder="请选择"
                          @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-pitch-alignment',layers[nowLayerIndex].paint['circle-pitch-alignment'])">
                  <el-option
                      v-for="item in ['map','viewport']"
                      :key="item"
                      :label="item"
                      :value="item">
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='circle-pitch-alignment' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="倾斜缩放" name="eleven">
              <h3>倾斜缩放</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="display:flex;margin-top:10px">
                <el-select v-model="layers[nowLayerIndex].paint['circle-pitch-scale']" placeholder="请选择"
                          @change="handlePaintChange(layers[nowLayerIndex]['id'],'circle-pitch-scale',layers[nowLayerIndex].paint['circle-pitch-scale'])">
                  <el-option
                      v-for="item in ['map','viewport']"
                      :key="item"
                      :label="item"
                      :value="item">
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='circle-pitch-scale' @callback="callback"></ConditionRender>
            </el-tab-pane>

          </el-tabs>
        <!--    线图层编辑面板-->
          <el-tabs :before-leave='leaveTab' v-if="editorShow=='lineEditorShow'" type="border-card" value="first" tab-position="left">
            <el-tab-pane label="颜色" name="first">
              <h3>线颜色</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="display:flex;margin-top:10px">
                <el-color-picker
                    v-model="layers[nowLayerIndex].paint['line-color']"
                    @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-color',layers[nowLayerIndex].paint['line-color'])"
                    :predefine="predefineColors">
                </el-color-picker>
                <el-input v-model="layers[nowLayerIndex].paint['line-color']"
                          @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-color',layers[nowLayerIndex].paint['line-color'])"
                          placeholder="something"></el-input>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='line-color' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="线宽" name="second">
              <h3>线宽（px）</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="display:flex;margin-top:10px">
                <el-input-number v-model="layers[nowLayerIndex].paint['line-width']"
                                @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-width',layers[nowLayerIndex].paint['line-width'])"
                                :min="0" :max="99999"
                                size="medium"
                                label="描述文字">
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='line-width' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="透明度" name="third">
              <h3>透明度</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="margin-top:10px">
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
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='line-opacity' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="虚线" name="forth">
              <h3>虚线</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="layers[nowLayerIndex].paint['line-dasharray'].length == 0" style="margin-top:10px">
                <el-col class="displayBox">未设置过滤条件</el-col>
              </el-row>
              <el-row v-if="menuButtonShow" style="margin-top:10px">
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
                  </el-input-number>&nbsp;
                  <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="layers[nowLayerIndex].paint['line-dasharray'].splice(index,1)"></el-button>
                </div>
                <el-button type="primary" round @click="layers[nowLayerIndex].paint['line-dasharray'].push(0)">添加虚线设置
                </el-button>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='line-dasharray' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="线间隙" name="fifth">
              <h3>线间隙宽度</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="display:flex;margin-top:10px">
                <el-input-number v-model="layers[nowLayerIndex].paint['line-gap-width']"
                                @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-gap-width',layers[nowLayerIndex].paint['line-gap-width'])"
                                :min="0" :max="99999"
                                size="medium"
                                label="描述文字">
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='line-gap-width' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="模糊" name="sixth">
              <h3>模糊度</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow">
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
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='line-blur' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="平移" name="seventh">
              <h3>平移</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="margin-top:10px;display:flex">
                <h4>x轴(px):&nbsp;</h4>
                <el-input-number v-model="layers[nowLayerIndex].paint['line-translate'][0]"
                                :step="1"
                                @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-translate',layers[nowLayerIndex].paint['line-translate'])">
                </el-input-number>
              </el-row>
              <el-row v-if="menuButtonShow" style="display:flex">
                <h4>y轴(px):&nbsp;</h4>
                <el-input-number v-model="layers[nowLayerIndex].paint['line-translate'][1]"
                                :step="1"
                                @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-translate',layers[nowLayerIndex].paint['line-translate'])">
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='line-translate' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="平移参考" name="eighth">
              <h3>平移参考</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="display:flex;margin-top:10px">
                <el-select v-model="layers[nowLayerIndex].paint['line-translate-anchor']" placeholder="请选择"
                          @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-translate-anchor',layers[nowLayerIndex].paint['line-translate-anchor'])">
                  <el-option
                      v-for="item in ['map','viewport']"
                      :key="item"
                      :label="item"
                      :value="item">
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='line-translate-anchor' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="偏移" name="ninth">
              <h3>偏移</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="display:flex;margin-top:10px">
                <el-input-number v-model="layers[nowLayerIndex].paint['line-offset']"
                                @change="handlePaintChange(layers[nowLayerIndex]['id'],'line-offset',layers[nowLayerIndex].paint['line-offset'])"
                                :min="0" :max="99999"
                                size="medium"
                                label="描述文字">
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='line-offset' @callback="callback"></ConditionRender>

            </el-tab-pane>
            <el-tab-pane label="线帽" name="tentn">
              <h3>线帽</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="display:flex;margin-top:10px">
                <el-select v-model="layers[nowLayerIndex].layout['line-cap']" placeholder="请选择"
                          @change="handleLayoutChange(layers[nowLayerIndex]['id'],'line-cap',layers[nowLayerIndex].layout['line-cap'])">
                  <el-option
                      v-for="item in [{label:'平直 butt',value:'butt'},{label:'圆形 round',value:'round'},{label:'方形 square',value:'square'}]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='line-cap' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="线连接" name="eleven">
              <h3>线连接</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="display:flex;margin-top:10px">
                <el-select v-model="layers[nowLayerIndex].layout['line-join']" placeholder="请选择"
                          @change="handleLayoutChange(layers[nowLayerIndex]['id'],'line-join',layers[nowLayerIndex].layout['line-join'])">
                  <el-option
                      v-for="item in [{label:'尖角 miter',value:'miter'},{label:'圆角 round',value:'round'},{label:'斜角 bevel',value:'bevel'}]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='line-join' @callback="callback"></ConditionRender>
            </el-tab-pane>


          </el-tabs>
        <!--    面图层编辑面板-->
          <el-tabs :before-leave='leaveTab' v-if="editorShow=='fillEditorShow'" type="border-card" value="first" tab-position="left">
            <el-tab-pane label="颜色" name="first">
              <h3>填充颜色</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="display:flex;margin-top:10px">
                <el-input v-model="layers[nowLayerIndex].paint['fill-color']"
                          @change="handlePaintChange(layers[nowLayerIndex]['id'],'fill-color',layers[nowLayerIndex].paint['fill-color'])"
                          placeholder="something"></el-input>
                <el-color-picker
                    v-model="layers[nowLayerIndex].paint['fill-color']"
                    @change="handlePaintChange(layers[nowLayerIndex]['id'],'fill-color',layers[nowLayerIndex].paint['fill-color'])"
                    :predefine="predefineColors">
                </el-color-picker>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='fill-color' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="透明度" name="second">
              <h3>透明度</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="margin-top:10px">
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
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='fill-opacity' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="边线颜色" name="third">
              <h3>边线颜色</h3>&nbsp;
              <br>
              <span v-if="!menuButtonShow">Zoom Range</span>
              <span style="font-size:10px;color:#909399">（该属性需要抗锯齿属性为true）</span>
              <el-row v-if="menuButtonShow && layers[nowLayerIndex].paint['fill-antialias']" style="display:flex;margin-top:10px">
              <el-input v-model="layers[nowLayerIndex].paint['fill-outline-color']"
                        @change="handlePaintChange(layers[nowLayerIndex]['id'],'fill-outline-color',layers[nowLayerIndex].paint['fill-outline-color'])"
                        placeholder="something"></el-input>
              <el-color-picker
                  v-model="layers[nowLayerIndex].paint['fill-outline-color']"
                  @change="handlePaintChange(layers[nowLayerIndex]['id'],'fill-outline-color',layers[nowLayerIndex].paint['fill-outline-color'])"
                  :predefine="predefineColors">
              </el-color-picker>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='fill-outline-color' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="平移" name="forth">
              <h3>平移</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="margin-top:10px;display:flex">
                <h4>x轴(px):&nbsp;</h4>
                <el-input-number v-model="layers[nowLayerIndex].paint['fill-translate'][0]"
                                :step="1"
                                @change="handlePaintChange(layers[nowLayerIndex]['id'],'fill-translate',layers[nowLayerIndex].paint['fill-translate'])">
                </el-input-number>
              </el-row>
              <el-row v-if="menuButtonShow" style="display:flex">
                <h4>y轴(px):&nbsp;</h4>
                <el-input-number v-model="layers[nowLayerIndex].paint['fill-translate'][1]"
                                :step="1"
                                @change="handlePaintChange(layers[nowLayerIndex]['id'],'fill-translate',layers[nowLayerIndex].paint['fill-translate'])">
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='fill-translate' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="平移参考" name="fifth">
              <h3>平移参考</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="display:flex;margin-top:10px">
                <el-select v-model="layers[nowLayerIndex].paint['fill-translate-anchor']" placeholder="请选择"
                          @change="handlePaintChange(layers[nowLayerIndex]['id'],'fill-translate-anchor',layers[nowLayerIndex].paint['fill-translate-anchor'])">
                  <el-option
                      v-for="item in ['map','viewport']"
                      :key="item"
                      :label="item"
                      :value="item">
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='fill-translate-anchor' @callback="callback"></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="抗锯齿">
              <h3>抗锯齿</h3>&nbsp;
              <span v-if="!menuButtonShow">Zoom Range</span>
              <el-row v-if="menuButtonShow" style="margin-top:10px;display:flex">
                <el-switch v-model="layers[nowLayerIndex].paint['fill-antialias']"
                          @change="handlePaintChange(layers[nowLayerIndex]['id'],'fill-antialias',layers[nowLayerIndex].paint['fill-antialias'])">
                </el-switch>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender :layerSelect="layers[nowLayerIndex]" tab='fill-antialias' @callback="callback"></ConditionRender>
            </el-tab-pane>

          </el-tabs>
        <!--    图标图层编辑面板-->
          <el-tabs :before-leave='leaveTab' v-if="editorShow=='symbolEditorShow'" type="border-card" value="first" tab-position="left">
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
        </el-tab-pane>
        <el-tab-pane label="数据设置" name="second">
          <h4>数据源配置</h4>
          <el-form label-position= "right" label-width= 100px>
            <el-form-item label="数据源">
              <span>{{ layers[nowLayerIndex]["source"] }}</span>
            </el-form-item>
            <el-form-item label="数据源图层">
              <span>{{ layers[nowLayerIndex]["source-layer"] }}</span>
            </el-form-item>
            <el-form-item label="图层名称">
              <span>{{ layers[nowLayerIndex]["name"] }}</span>
            </el-form-item>
            <el-form-item label="图层类型">
              <el-select v-model="layers[this.nowLayerIndex].type" placeholder="请选择图层类型">
                <el-option
                  v-for="item in [{value: 'circle',label: '圆(circle)'},{value: 'symbol',label: '符号(symbol)'},{value: 'line',label: '线(line)'},{value: 'fill',label: '填充(fill)'},{value: 'fill-extrusion',label: '三维填充(fill-extrusion)'}]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-divider></el-divider>
          <el-row type="flex" justify="space-between" align="middle">
            <h4>过滤条件配置</h4>
            <el-select v-model="filterWay" placeholder="请选择" size="small">
              <el-option
                v-for="item in [{value: 'and',label: '满足所有条件'},{value: 'or',label: '满足任意条件'},{value: '!',label: '不满足任意条件'},]"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-row>
          <br>
          <el-row v-for="(item,index) in filterCondition" :key="index" class="filterBox" >
            <el-button type="text" icon="el-icon-remove-outline" @click="filterCondition.splice(index,1)"></el-button>
            <el-col :span="6">
              <el-select :span="2" v-model="filterCondition[index]['options']" placeholder="请选择" size="small">
                <el-option
                  v-for="item in filterOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-select v-model="filterCondition[index]['type']" placeholder="==" size="small">
                <el-option
                  v-for="item in filterTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="10">
              <el-input placeholder="" v-model="filterValueInput[0]" size="small" clearable>
                <template>
                  <i class="el-icon-circle-plus"></i>
                </template>
              </el-input>
            </el-col>
            <el-popover
              placement="right"
              width="400"
              trigger="click">
              <el-row type="flex" justify="space-between">
                <el-col :span="18">
                  <el-tag
                    v-for="tag in filterValueSelect"
                    :key="tag.value"
                    :closable = true
                    @close="handleTagClose(tag)"
                    >
                    {{tag.value}}
                  </el-tag>
                </el-col>
                <el-col :span="4">
                  <el-button size="mini" type="primary" @click="filterSearch">确定</el-button>
                </el-col>
              </el-row>

              <el-table :data="filterValue.filter(data => !search || data.value.toLowerCase().includes(search.toLowerCase()))"
                        @selection-change="handleSelectionChange" row-key="id" :cell-style="{textAlign:'left'}">
                <el-table-column
                  type="selection"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="value"
                  align="right">
                  <template slot="header" >
                    <el-input
                      v-model="search"
                      size="mini"
                      placeholder="搜索"
                      prefix-icon="el-icon-search" />
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="text" icon="el-icon-circle-plus" slot="reference" @click="handleFilterValue(item,index)"></el-button>
            </el-popover>
          </el-row>
          <el-col v-if="filterCondition == []" class="displayBox">未设置过滤条件</el-col>
          <el-button type="text" icon="el-icon-circle-plus-outline"
          @click="filterCondition.push({options:'',type:'==',value:''})">添加过滤条件</el-button>
          <el-divider></el-divider>
          <h4>显示级别配置</h4>
          <el-form label-position="top">
            <el-form-item label="最小级别">
              <el-slider
                :max="layers[nowLayerIndex]['maxzoom']"
                :min="zoomRange[0]"
                v-model="layers[nowLayerIndex]['minzoom']"
                show-input >
              </el-slider>
            </el-form-item>
            <el-form-item label="最大级别">
              <el-slider
                :max="zoomRange[1]"
                :min="layers[nowLayerIndex]['minzoom']"
                v-model="layers[nowLayerIndex]['maxzoom']"
                show-input >
              </el-slider>
            </el-form-item>
          </el-form>
        </el-tab-pane>

      </el-tabs>
      <i class="el-icon-close close-button" @click="handleCloseEditBoard"></i>
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
import initTileJson from "../assets/js/initTileJson";
import myConfig from "../config";

import Sortable from "sortablejs";
import ConditionRender from "../components/ConditionRender"

var map = null;

export default {
  components: {ConditionRender},
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
      layersName: [], //加载的图层id集合，用于展示图层按index的排列
      sourceNameObject:{}, //检测source重复

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
      nameEdit: false,


      //编辑框
      menuButtonShowList: [],
      menuButtonShow: true,

      //插值类型
      value: '',
      Rate: 'linear',
      Rate1: 'linear',
      rateEditShow: false,
      rateContent: {linear:'线性：在刚好小于和刚好大于输入的停止点对之间进行线性插值。',exponential:'指数：在小于和大于输入的停靠点之间以指数方式插值。','cubic-bezier':'贝塞尔曲线：使用由给定控制点定义的三次贝塞尔曲线进行插值。'},

      //过滤条件配置
      filterWay: "满足所有条件",
      filterCondition: [{option:'',type:'==',value:[]}],
      filterOptions: [{value:'',label:''},],
      filterTypes: [{value:'==',label:'=='},{value:'!=',label:'!='},{value:'>',label:'>'},{value:'>=',label:'>='},{value:'<',label:'<'},{value:'<=',label:'<='},{value:'in',label:'in'},{value:'!in',label:'!in'},{value:'has',label:'has'},{value:'!has',label:'!has'}],
      filterValue: [{value:'a',id:'a'},{value:'2',id:'2'},{value:'3',id:'3'},{value:'4',id:'4'},{value:'5',id:'5'},{value:'6'},{value:'7',id:'7'},{value:'8',id:'8'},{value:'9',id:'9'}],
      filterValueInput: [''],
      filterValueSelect: [],
      multipleSelection: [],
      nowFilterIndex: 0,
      search: '',

      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585'],

      //图标数据
      symbolTableData: [],
      currentPageSymbol: 1,
      pageSizeSymbol: 5,
      searchInputSymbol: "",
      totalDataCountSymbol: 0,


    };
  },
  mounted() {
    this.$bus.$on("show",(data)=>{this.menuButtonShow = data;console.log('转换:',this.menuButtonShow)})
    this.mapProjectId = this.$route.params.mapProjectId
    this.getMapProjectInfo()

    //layer拖动排序
    this.initSort();
  },
  beforeDestroy(){
    this.$bus.$off("show");
  },
  methods: {
    async test() {

      let newTileJson = initTileJson
      newTileJson.name = "aaa123"
      newTileJson.tiles = [""]

      let res = await this.createTileJson(newTileJson)
      if (res.data.code === 0) {
        return
      }

      console.log("wait")
      console.log(res)
      console.log("aaaa")
      let sourceId = res.data.data.tileJsonId
      let tileJsonUrl = myConfig.requestUrl + "/getTileJson/" + sourceId
      console.log("tileJsonUrl: ", tileJsonUrl)
    },

    getMapProjectInfo() {
      requestApi.getMapProjectById(this.mapProjectId)
          .then((res) => {
            this.mapProjectInfo = res.data.data
            console.log("mapProjectInfo:", this.mapProjectInfo);
            this.center = this.mapProjectInfo.center.split(',')
            this.zoom = this.mapProjectInfo.zoom
            this.sources = this.mapProjectInfo.sources
            this.layers = this.mapProjectInfo.layers
            this.layersNameObject = this.mapProjectInfo.layerTree
            this.createEmptyMap()
            this.initMapWithData()
            for (const i in this.layers) {
              this.layersName.push(this.layers[i].id)
            }
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
        this.center = String(e.lngLat.lng) + "," + String(e.lngLat.lat)
        this.showCenter = String(e.lngLat.lng.toFixed(5)) + "," + String(e.lngLat.lat.toFixed(5))
      });

      //选中某元素
      map.on('mouseenter',this.layersName,  function (e) {
        map.getCanvas().style.cursor = 'pointer';
        // console.log("eeeeeeeeee gid:", e);
        console.log("eeeeeeeeee gid:", e.features[0].properties.gid);
        console.log("属性:", e.features)
      });

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', this.layersName, function () {
        map.getCanvas().style.cursor = '';
      });

      //点击元素事件
      map.on('click', this.layersName, (e) => {
        //点击范围
        const bbox = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5]
        ];
        // Find features intersecting the bounding box.
        const selectedFeatures = map.queryRenderedFeatures(bbox, {
        layers: this.layersName
        });
        var container = window.document.createElement('div');
        container.className = "container";
        var nameList = [];

        for (const i in selectedFeatures) {
          let feature = selectedFeatures[i];
          if(nameList.indexOf(feature.layer.id) === -1){
            nameList.push(feature.layer.id);
          }else{
            continue  //避免相同图层元素重复展现
          }
          //为popup添加DOM元素
          let item = window.document.createElement('div');
          var item_name = window.document.createElement('div');
          let colorBox = window.document.createElement('div');

          container.appendChild(item).className = "item";
          item.appendChild(colorBox).className = "colorBox";
          item.appendChild(item_name).className = "item_name";
          item_name.innerHTML = feature.layer.id;

          var index = this.layersName.indexOf(feature.layer.id);

          //根据index获取相关图层信息
          const color_name = feature.layer.type+'-'+'color';
          colorBox.style.setProperty('background-color',this.layers[index].paint[color_name]);

          this.addItemEvent(item,feature,index);

        }

        console.log('selectedFeatures',selectedFeatures)

        new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setDOMContent(container)
        .addTo(map);
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
          sourceUrl: this.sources[i].url,
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
        this.mapProjectInfo.center = this.center
        this.mapProjectInfo.sources = this.sources
        // this.mapProjectInfo.layers = {layers: this.layers}
        this.mapProjectInfo.layers = this.layers
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
      //更改顺序后更新
      for (const i in this.layers) {
        this.layersName[i] = this.layers[i].id
      }

    },

    //向shp树添加shp,即source,同时添加shplayer
    async handleAddShpLayer(index, row) {
      console.log("add shp row: ", row)
      //旧source写法
      // let newSource = {
      //   sourceName: row.tableName,
      //   sourceType: "vector",
      //   sourceTiles: ["http://172.21.212.63:8991/mvt/" + row.tableName + "/{z}/{x}/{y}.pbf"],
      // }
      // if (!Object.prototype.hasOwnProperty.call(this.sources, newSource.sourceName)) {
      //   this.sources[newSource.sourceName] = {
      //     type: newSource.sourceType,
      //     tiles: newSource.sourceTiles,
      //   }
      //   this.addSourceToMap(newSource)
      // }

      //如果没有添加过source则添加
      if (!Object.prototype.hasOwnProperty.call(this.sourceNameObject, row.tableName)) {
        let newTileJson = initTileJson
        newTileJson.name = row.tableName
        newTileJson.tiles = [myConfig.requestUrl + "/mvt/" + row.tableName + "/{z}/{x}/{y}.pbf"]
        let vector_layer={
              "description": "",
              "fields": row.attrInfo,
              "id": row.tableName,
            }
        newTileJson.vector_layers=[vector_layer]

        let res = await this.createTileJson(newTileJson)
        if (res.data.code !== 0) {
          console.log("添加source失败")
          return
        }
        let sourceId = res.data.data.tileJsonId

        let tileJsonUrl = myConfig.requestUrl + "/getTileJson/" + sourceId + ".json"
        let newSourceJson = {
          "sourceName": sourceId,
          "sourceType": "vector",
          "sourceUrl": tileJsonUrl
        }
        this.addSourceToMap(newSourceJson)
        this.sources[newSourceJson.sourceName]={
          type:newSourceJson.sourceType,
          url:newSourceJson.sourceUrl
        }
        this.sourceNameObject[row.tableName] = sourceId
      }

      let geoType = row.geoType
      if (row.geoType.indexOf("LINE") !== -1) {
        geoType = "line"
      } else if (row.geoType.indexOf("POLYGON") !== -1) {
        geoType = "fill"
      } else {
        geoType = "circle"
      }

      //前四个是自己用的属性
      let newLayer = {
        index: index,
        show: true,
        originName: row.originName,
        shpAttribute:row.attrInfo,
        id: row.originName,
        type: geoType,
        filter: ["all"],
        layout: layerStyleProperties[geoType].layout,
        maxzoom: 22,
        metadata: "",
        minzoom: 0,
        paint: layerStyleProperties[geoType].paint,
        source: this.sourceNameObject[row.tableName], //通过记录的source名字与id对应，拿到sourceId
        // "source-layer": "default"
        "source-layer":row.tableName
        // "source-layer":"my22"
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
      this.layersName.unshift(newLayer.id)
      this.addLayerToMap(newLayer)
    },


    //生成tilejson
    async createTileJson(initTileJson) {
      let data = await requestApi.createTileJson(initTileJson)
      return data
    },

    deleteTileJson(tileJsonId) {

      requestApi.deleteTileJson(tileJsonId)
          .then((res)=>{
            console.log("delete tileJson: ",res)
          })
          .catch((error) => {
            console.log(error);
          });
    },

    //向地图添加数据源source
    addSourceToMap(newSource) {
      console.log("add new source：", newSource)

      //旧写法
      // map.addSource(newSource.sourceName, {
      //   type: newSource.sourceType,
      //   tiles: newSource.sourceTiles,
      // })

      //tileJson写法
      map.addSource(newSource.sourceName, {
        type: newSource.sourceType,
        url: newSource.sourceUrl,
      })
    },

    //向地图添加layer
    addLayerToMap(newLayer) {
      console.log("add new layer：", newLayer)
      map.addLayer(newLayer)
    },

    loadAndAddImg(imgUrl, imgName) {
      map.loadImage(imgUrl, (error, image) => {
        if (error) throw error;
        map.addImage(imgName, image);
      })
    },

    handleLayerEdit(index, row) {
      console.log("now edit layer: index, row",index, row)
      this.nowLayerIndex = index
      console.log(index, row)
      this.nowLayerIndex = index;
      this.zoomRange = [this.layers[this.nowLayerIndex].minzoom,this.layers[this.nowLayerIndex].maxzoom]
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
      this.menuButtonShowList = [];
    },

    handleCloseEditBoard() {
      this.editorShow = ''
    },

    handleLayerDelete(index, row) {
      console.log("ready delete layer:", row)
      this.editorShow = ""
      let aimSource = row.source
      let layerOriginName = row.originName
      let layerid = row.id
      this.layers.splice(index, 1)
      this.layersName.splice(index, 1)
      this.layersNameObject[layerOriginName] -= 1
      this.handleRemoveLayer(layerid)

      //如果没有layer使用source，则删除source
      if (this.layersNameObject[layerOriginName] === 0) {
        delete this.layersNameObject[layerOriginName]
        this.handleRemoveSource(aimSource)
        delete this.sources[aimSource]
        for(let key in this.sourceNameObject){
          if(this.sourceNameObject[key]===aimSource){
            delete this.sourceNameObject[key]
            break
          }
        }
        //source没有再使用时,删除后台的tileJson
        this.deleteTileJson(row.source)
      }

    },

    handleLayerStyleChange(index, row) {
      index, row
      console.log("row: ", row)
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

    getSymbolList() {
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

    handleCurrentChangeSymbol(val) {
      this.currentPageSymbol = val
      this.getSymbolList()
    },

    handleLayerClick() {
      console.log(this.layers);
      map.flyTo({
        center:[101.34948058466824,32.22862318628209]
      });
      // var render =
      //   [
      //   "interpolate",
      //   ["exponential", 0.5],
      //   ["zoom"],
      //   2,
      //   "#e2714b",
      //   5,
      //   "#eee695"
      //   ];
      // this.handlePaintChange('ChinaProvince','fill-color',render)
      // this.layers[3].paint['fill-color'] = 0
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
    },

    addItemEvent(item,feature,index){
      //因为item是html元素，在其事件中this指向该元素无法获取vue的实例属性和方法
      let _this = this;
      item.onclick = function test(){
        _this.nowLayerIndex = index;
        if (feature.layer.type === "line") {
          _this.editorShow = 'lineEditorShow';
        } else if (feature.layer.type === "fill") {
          _this.editorShow = 'fillEditorShow';
        } else if (feature.layer.type === "circle") {
          _this.editorShow = 'circleEditorShow';
        } else {
          _this.editorShow = "symbolEditorShow";
          _this.getSymbolList()
        }
      };
    },

    //添加筛选框用户输入的value
    handleFilterValue(item,index){
      this.nowFilterIndex = index;
      //filterValueInput第一个绑定input内容，后面依次记录每次内容
      this.filterValueInput[0] != '' && this.filterValueInput.push(this.filterValueInput[0])
      this.filterValueInput[0] != '' && this.filterValueSelect.push({value:this.filterValueInput[0]});
      console.log('item',item,index)
    },
    //更新用户选中的筛选信息
    handleSelectionChange(val){
      console.log(val)
      this.multipleSelection = val
      console.log('this.filterValueSelect:',this.filterValueSelect);
      this.update();
      // console.log('this.multipleSelection:',this.multipleSelection);
    },
    update(){
      // this.filterValueSelect = [];
      for (const i in this.filterValueInput) {
        i != 0 && this.filterValueSelect.push({value:this.filterValueInput[i]});
      }
      for (const i in this.multipleSelection) {
        this.filterValueSelect.push(this.multipleSelection[i])
      }
    },
    handleTagClose(tag){
      this.filterValueSelect.splice(this.filterValueSelect.indexOf(tag), 1);
      this.filterValueInput = '';
      console.log('tag',tag)
    },
    filterSearch(){
      this.filterCondition[this.nowFilterIndex].value = this.filterValueSelect;
      console.log('filterCondition:',this.filterCondition);
    },
    callback(layoutOrpaint,attribute,value){
      console.log("layoutOrpaint1:",layoutOrpaint);
      console.log("attribute1:",attribute);
      console.log("value1:",value);
      this.layers[this.nowLayerIndex][layoutOrpaint][attribute] = value;
      console.log("layers:",this.layers[this.nowLayerIndex]);
      const id = this.layers[this.nowLayerIndex]['id']
      layoutOrpaint == 'layout' && this.handleLayoutChange(id,attribute,value);
      layoutOrpaint == 'paint' && this.handlePaintChange(id,attribute,value);
    },
    leaveTab(activeName, oldActiveName){
      console.log('activeName',activeName);
      console.log('oldActiveName',oldActiveName);
    },
    test1(){
      console.log('layer',this.layers[0])
    },





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
h3{
  margin: 0;
  display: inline-block;
}
h4{
  margin: 5px 0;
  white-space:nowrap
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

/* 编辑框样式 */
.editBoard {
  display: flex;
  height: 100%;
  width: 350px;
  position: absolute;
  margin-left: 330px;
  z-index: 99;
}

.el-icon-close.close-button{
  font-size: 22px;
  position:absolute;
  right:10px;
  height:40px;
  line-height: 40px;
}
/* 编辑框文本名框 */
.editBoardTitle {
  position: absolute;
  font-weight: bold;
  width: 140px;
  left: 20px;
  top: 0;
  height: 40px;
  line-height: 40px;
  z-index: 1;
  /* background-color: #4264fb; */
  display: flex;
  align-items: center;
}
.editBoardTitle div{
  display:inline-block;
  width:120px;
  height: 40px;
  white-space:nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

}
.editBoardTitle .el-icon-edit{
  display: none;
}
.editBoardTitle:hover .el-icon-edit{
  display: block;
  cursor: pointer;
}
.editBoardTitle:hover div{
  cursor:pointer;
  color: #75b9ff;
}

.close-button:hover {
  cursor: pointer;
  color: Red;
}
/* 编辑框导航条tabs */
.editBoard .el-tabs__header.is-top{
  background-color: rgb(255, 255, 255);
  width: 300px;
  margin: 0;
  border-left: 1px solid #e4e7ed;
  border-right: 1px solid #e4e7ed;
  padding-right: 50px;
  justify-content: right;
  display: flex;
}
.el-tabs__item{
  padding: 0 10px;
}

.editBoard .el-tabs__header.is-top .el-tabs__nav-wrap.is-top{
  text-align: left;

}
/* 样式设置tabs导航条样式 */
.editBoard .el-tabs--border-card > .el-tabs__header {
  background-color: rgb(255, 255, 255);
  width: 100px;
  height: calc(100vh - 42px);
}

.editBoard .el-tabs--border-card {
  box-shadow: none;
}

.editBoard .el-tabs--left.el-tabs--border-card .el-tabs__item.is-left {
  text-align: left;
  padding: 0px 10px;
  /*margin: 10px 0px;*/
}
/* 样式设置tab内容框样式 */
.editBoard .el-tabs--border-card > .el-tabs__content {
  /* margin: 5px 10px 0px 0px; */
  width: 209px;
  height: calc(100vh - 82px);
  overflow-y: scroll;
}
/* 数据设置tabs内容框样式 */
.editBoard .el-tabs.el-tabs--top > .el-tabs__content > .el-tab-pane:nth-child(2){
  width: 310px;
  height: calc(100vh - 81px);
  background-color: white;
  padding: 20px;
  border: 1px solid #e4e7ed;
  overflow-y: scroll;
}
/* 隐藏样式和数据设置的滚动条 */
.editBoard .el-tabs.el-tabs--top > .el-tabs__content > .el-tab-pane:nth-child(2)::-webkit-scrollbar
,.editBoard .el-tabs--border-card > .el-tabs__content::-webkit-scrollbar
{ width: 0; height: 0; color: transparent; }
/* 属性框样式 */
.tableCondition .el-table__body-wrapper.is-scrolling-none:hover{
  cursor:pointer;
  background-color: #4264fb;
}
/* 数据源配置form */
.editBoard .el-form.el-form--label-right > .el-form-item{
  margin: 0;

}
.editBoard .el-form.el-form--label-right > .el-form-item .el-form-item__content{
  white-space:nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.editBoard .el-divider--horizontal{
  margin: 12px 0;
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

.displayBox{
  width: 100%;
  border: 1px dashed #d3d3d3;
  border-radius: 5px;
  text-align: center;
  /* 将该元素禁用 */
  pointer-events: none;
}

.mapStyle {
  width: 100%;
  height: 100%;
}

.divider {
  margin: 12px 0;
}

/* popup样式 */
.container{
  width: 150px;
  /* height: 30px; */
}
.item{
  color: black;
  border-radius: 5px;
  white-space:nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item:hover{
  color: #4264fb;
  background-color: #e0e7eb;
  cursor:pointer;
}
.colorBox{
  width: 18px;
  height: 18px;
  /* background-color: red; */
  float: left;
  display: inline-block;
  border-radius: 5px;
  margin: 1px;
}
.item_name{
  margin-left: 30px;
}
/* 未设置过滤条件框样式 */
.displayBox{
  width: 100%;
  padding: 10px;
  border: 1px dashed #d3d3d3;
  border-radius: 5px;
  text-align: center;
  /* 将该元素禁用 */
  pointer-events: none;
  color: #d3d3d3;
}
/* 筛选条件框样式 */
.filterBox{
  display:flex;
  justify-content:space-between;
  align-items:center;
}
</style>