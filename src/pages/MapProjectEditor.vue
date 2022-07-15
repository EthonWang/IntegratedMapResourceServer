<template>
  <div class="Container">
    <div id="features"></div>
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
          <el-popover placement="right" width="250" trigger="click">
            <el-tabs value="PG" @tab-click="dataBaseClick">
              <el-tab-pane label="PG" name="PG">
                <el-row type="flex" align="middle">
                  <h4>数据库源:&nbsp;</h4>
                  <el-select
                    v-model="PgBaseSelect"
                    placeholder="请选择"
                    style="width: 73%"
                    @change="PgBaseChange($event)"
                  >
                    <el-option
                      v-for="item in dataBaseList"
                      :key="item.dbname"
                      :label="item.dbname"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-row>
                <el-table :data="shpTableData" height="313">
                  <el-table-column
                    property="originName"
                    width="170"
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
              <el-tab-pane label="mbTile" name="mbTile">
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
                    </el-option>
                  </el-select>&nbsp;
                  <el-button type="success" size="mini" circle icon="el-icon-plus" @click="mbTileEditShow=true"></el-button>
                  <el-dialog
                    title="mbTile信息编辑"
                    :visible.sync="mbTileEditShow"
                    width="30%" :modal="false"
                    center>
                    <el-form label-position="left" label-width="100px" :model="mbTileEditInfo" id="myForm" enctype="multipart/form-data" name="fileinfo" action="" target="uploadFrame">
                      <el-form-item 
                        label="文件:"
                        :rules="{required: true, message: '请选择文件', trigger: 'blur'}">                       
                        <input type="file" ref="mbFile">
                      </el-form-item>
                      <el-form-item 
                        label="文件名:"
                        :rules="{required: true, message: '请输入文件名', trigger: 'blur'}">
                        <el-input v-model="mbTileEditInfo.mbTilesJsonName"></el-input>
                      </el-form-item>                                  
                    </el-form>   
                    <iframe id="uploadFrame" name="uploadFrame" style="display:none;"></iframe>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="mbTileEditShow = false">取 消</el-button>
                      <el-button type="primary" @click="addMbTileData">确 定</el-button>
                    </span>
                  </el-dialog>                   
                </el-row>                
                <el-table :data="dataLayers" height="313">
                  <el-table-column
                    property="id"
                    width="170"
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
              </el-tab-pane>
            </el-tabs>

            <el-button type="primary" size="mini" slot="reference" @click="addShpData"
              >添加数据</el-button
            >
          </el-popover>
        </div>
        <el-button type="success" size="mini" slot="reference" @click="saveMap"
          >保存地图</el-button
        >
        <el-popover
          placement="right"
          title="链接地址"
          width="200"
          trigger="click"
        >
          <el-link
            type="primary"
            :href="publishLink"
            target="_blank"
            :underline="false"
            >{{ publishLink }}</el-link
          >
          <el-button type="warning" size="mini" slot="reference" @click="publish"
            >发布</el-button
          >
        </el-popover>
        <!-- <el-button type="success" size="mini" @click="addBackground">添加背景</el-button> -->
      </div>

      <!--      图层列表-->
      <el-divider class="divider">图层</el-divider>
      <div class="layerTable">
        <el-table
          :data="layers"
          ref="shpLayerTable"
          row-key="id"
          size="mini"
          @row-click="handleLayerClick()"
          style="width: 100%"
        >
          <el-table-column width="40">
            <template slot-scope="scope">
              <el-switch
                :width="30"
                v-model="scope.row.show"
                @change="handleLayerShowSwitchChange($event, scope.row)"
              >
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
                style="margin-left: 5px"
              >
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleLayerDelete(scope.$index, scope.row)"
                icon="el-icon-delete"
                circle
                style="margin-left: 5px"
              >
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-button @click="test1">test</el-button>
    </div>

    <div
      class="editBoard"
      v-if="
        editorShow == 'circleEditorShow' ||
        editorShow == 'lineEditorShow' ||
        editorShow == 'fillEditorShow' ||
        editorShow == 'symbolEditorShow' ||
        editorShow == 'fillExtrusionEditorShow'
      "
    >
      <div
        v-show="nameEdit === false"
        class="editBoardTitle"
        @click="nameEdit = true"
      >
        <div>{{ layers[nowLayerIndex]["originName"] }}</div>
        <i class="el-icon-edit"></i>
      </div>
      <div v-show="nameEdit === true" class="editBoardTitle">
        <el-input
          v-model="layers[nowLayerIndex]['originName']"
          size="mini"
          @change="nameEdit = false"
        ></el-input>
        <i class="el-icon-check" @click="nameEdit = false"></i>
      </div>
      <el-tabs value="first">
        <el-tab-pane label="样式设置" name="first">
          <!--    圆点图层编辑面板-->
          <el-tabs
            :before-leave="leaveTab"
            v-if="editorShow == 'circleEditorShow'"
            type="border-card"
            value="first"
            tab-position="left"
          >
            <el-tab-pane label="颜色" name="first">
              <h3>颜色</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['circle-color']">{{
                menuShowList["circle-color"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['circle-color']"
                style="display: flex; margin-top: 10px"
              >
                <el-color-picker
                  v-model="layers[nowLayerIndex].paint['circle-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'circle-color',
                      layers[nowLayerIndex].paint['circle-color']
                    )
                  "
                  :predefine="predefineColors"
                >
                </el-color-picker>
                <el-input
                  v-model="layers[nowLayerIndex].paint['circle-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'circle-color',
                      layers[nowLayerIndex].paint['circle-color']
                    )
                  "
                  placeholder="something"
                ></el-input>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="circle-color"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="半径" name="second">
              <h3>半径（px）</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['circle-radius']">{{
                menuShowList["circle-radius"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['circle-radius']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['circle-radius']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'circle-radius',
                      layers[nowLayerIndex].paint['circle-radius']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="circle-radius"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="不透明度" name="third">
              <h3>不透明度</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['circle-opacity']">{{
                menuShowList["circle-opacity"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['circle-opacity']"
                style="margin-top: 10px"
              >
                <el-slider
                  v-model="layers[nowLayerIndex].paint['circle-opacity']"
                  :min="0"
                  :max="1"
                  :marks="{ 0: '0', 0.5: '0.5', 1: '1' }"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'circle-opacity',
                      layers[nowLayerIndex].paint['circle-opacity']
                    )
                  "
                  :step="0.1"
                >
                </el-slider>
                <br />
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['circle-opacity']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'circle-opacity',
                      layers[nowLayerIndex].paint['circle-opacity']
                    )
                  "
                  :min="0"
                  :max="1"
                  :step="0.1"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="circle-opacity"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="边线颜色" name="forth">
              <h3>边线颜色</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['circle-stroke-color']">{{
                menuShowList["circle-stroke-color"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['circle-stroke-color']"
                style="display: flex; margin-top: 10px"
              >
                <el-input
                  v-model="layers[nowLayerIndex].paint['circle-stroke-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'circle-stroke-color',
                      layers[nowLayerIndex].paint['circle-stroke-color']
                    )
                  "
                  placeholder="something"
                ></el-input>
                <el-color-picker
                  v-model="layers[nowLayerIndex].paint['circle-stroke-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'circle-stroke-color',
                      layers[nowLayerIndex].paint['circle-stroke-color']
                    )
                  "
                  :predefine="predefineColors"
                >
                </el-color-picker>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="circle-stroke-color"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="边线宽度" name="fifth">
              <h3>边线宽度</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['circle-stroke-width']">{{
                menuShowList["circle-stroke-width"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['circle-stroke-width']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['circle-stroke-width']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'circle-stroke-width',
                      layers[nowLayerIndex].paint['circle-stroke-width']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="circle-stroke-width"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="边线不透明度" name="sixth">
              <h3>边线不透明度</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['circle-stroke-opacity']">{{
                menuShowList["circle-stroke-opacity"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['circle-stroke-opacity']"
                style="margin-top: 10px"
              >
                <el-slider
                  v-model="layers[nowLayerIndex].paint['circle-stroke-opacity']"
                  :min="0"
                  :max="1"
                  :marks="{ 0: '0', 0.5: '0.5', 1: '1' }"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'circle-stroke-opacity',
                      layers[nowLayerIndex].paint['circle-stroke-opacity']
                    )
                  "
                  :step="0.1"
                >
                </el-slider>
                <br />
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['circle-stroke-opacity']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'circle-stroke-opacity',
                      layers[nowLayerIndex].paint['circle-stroke-opacity']
                    )
                  "
                  :min="0"
                  :max="1"
                  :step="0.1"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="circle-stroke-opacity"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="模糊" name="seventh">
              <h3>模糊度</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['circle-blur']">{{
                menuShowList["circle-blur"]
              }}</span>
              <el-row v-if="menuButtonShowList['circle-blur']">
                <el-slider
                  v-model="layers[nowLayerIndex].paint['circle-blur']"
                  :min="0"
                  :max="1"
                  :marks="{ 0: '0', 0.5: '0.5', 1: '1' }"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'circle-blur',
                      layers[nowLayerIndex].paint['circle-blur']
                    )
                  "
                  :step="0.1"
                >
                </el-slider>
                <br />
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['circle-blur']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'circle-blur',
                      layers[nowLayerIndex].paint['circle-blur']
                    )
                  "
                  :min="0"
                  :max="1"
                  :step="0.1"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="circle-blur"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="平移" name="eighth">
              <h3>平移</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['circle-translate']">{{
                menuShowList["circle-translate"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['circle-translate']"
                style="margin-top: 10px; display: flex"
              >
                <h4>x轴(px):&nbsp;</h4>
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['circle-translate'][0]"
                  :step="1"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'circle-translate',
                      layers[nowLayerIndex].paint['circle-translate']
                    )
                  "
                >
                </el-input-number>
              </el-row>
              <el-row
                v-if="menuButtonShowList['circle-translate']"
                style="display: flex"
              >
                <h4>y轴(px):&nbsp;</h4>
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['circle-translate'][1]"
                  :step="1"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'circle-translate',
                      layers[nowLayerIndex].paint['circle-translate']
                    )
                  "
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="circle-translate"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="平移参考" name="ninth">
              <h3>平移参考</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['circle-translate-anchor']">{{
                menuShowList["circle-translate-anchor"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['circle-translate-anchor']"
                style="display: flex; margin-top: 10px"
              >
                <el-select
                  v-model="
                    layers[nowLayerIndex].paint['circle-translate-anchor']
                  "
                  placeholder="请选择"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'circle-translate-anchor',
                      layers[nowLayerIndex].paint['circle-translate-anchor']
                    )
                  "
                >
                  <el-option
                    v-for="item in ['map', 'viewport']"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="circle-translate-anchor"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="倾斜对齐" name="tentn">
              <h3>倾斜对齐</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['circle-pitch-alignment']">{{
                menuShowList["circle-pitch-alignment"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['circle-pitch-alignment']"
                style="display: flex; margin-top: 10px"
              >
                <el-select
                  v-model="
                    layers[nowLayerIndex].paint['circle-pitch-alignment']
                  "
                  placeholder="请选择"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'circle-pitch-alignment',
                      layers[nowLayerIndex].paint['circle-pitch-alignment']
                    )
                  "
                >
                  <el-option
                    v-for="item in ['map', 'viewport']"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="circle-pitch-alignment"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="倾斜缩放" name="eleven">
              <h3>倾斜缩放</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['circle-pitch-scale']">{{
                menuShowList["circle-pitch-scale"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['circle-pitch-scale']"
                style="display: flex; margin-top: 10px"
              >
                <el-select
                  v-model="layers[nowLayerIndex].paint['circle-pitch-scale']"
                  placeholder="请选择"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'circle-pitch-scale',
                      layers[nowLayerIndex].paint['circle-pitch-scale']
                    )
                  "
                >
                  <el-option
                    v-for="item in ['map', 'viewport']"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="circle-pitch-scale"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
          </el-tabs>
          <!--    线图层编辑面板-->
          <el-tabs
            :before-leave="leaveTab"
            v-if="editorShow == 'lineEditorShow'"
            type="border-card"
            value="first"
            tab-position="left"
          >
            <el-tab-pane label="颜色" name="first">
              <h3>线颜色</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['line-color']">{{
                menuShowList["line-color"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['line-color']"
                style="display: flex; margin-top: 10px"
              >
                <el-color-picker
                  v-model="layers[nowLayerIndex].paint['line-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'line-color',
                      layers[nowLayerIndex].paint['line-color']
                    )
                  "
                  :predefine="predefineColors"
                >
                </el-color-picker>
                <el-input
                  v-model="layers[nowLayerIndex].paint['line-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'line-color',
                      layers[nowLayerIndex].paint['line-color']
                    )
                  "
                  placeholder="something"
                ></el-input>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="line-color"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="线宽" name="second">
              <h3>线宽（px）</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['line-width']">{{
                menuShowList["line-width"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['line-width']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['line-width']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'line-width',
                      layers[nowLayerIndex].paint['line-width']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="line-width"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="不透明度" name="third">
              <h3>不透明度</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['line-opacity']">{{
                menuShowList["line-opacity"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['line-opacity']"
                style="margin-top: 10px"
              >
                <el-slider
                  v-model="layers[nowLayerIndex].paint['line-opacity']"
                  :min="0"
                  :max="1"
                  :marks="{ 0: '0', 0.5: '0.5', 1: '1' }"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'line-opacity',
                      layers[nowLayerIndex].paint['line-opacity']
                    )
                  "
                  :step="0.1"
                >
                </el-slider>
                <br />
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['line-opacity']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'line-opacity',
                      layers[nowLayerIndex].paint['line-opacity']
                    )
                  "
                  :min="0"
                  :max="1"
                  :step="0.1"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="line-opacity"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="虚线" name="forth">
              <h3>虚线</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['line-dasharray']">{{
                menuShowList["line-dasharray"]
              }}</span>
              <el-row
                v-if="layers[nowLayerIndex].paint['line-dasharray'].length == 0"
                style="margin-top: 10px"
              >
                <el-col class="displayBox">未设置过滤条件</el-col>
              </el-row>
              <el-row
                v-if="menuButtonShowList['line-dasharray']"
                style="margin-top: 10px"
              >
                <div
                  class="flexRowSpaceAround"
                  v-for="(item, index) in layers[nowLayerIndex].paint[
                    'line-dasharray'
                  ]"
                  :key="index"
                  style="height: 40px"
                >
                  <h4 v-if="index % 2 == 0">实部:</h4>
                  <h4 v-else>虚部:</h4>
                  <el-input-number
                    v-model="
                      layers[nowLayerIndex].paint['line-dasharray'][index]
                    "
                    @change="
                      handlePaintChange(
                        layers[nowLayerIndex]['id'],
                        'line-dasharray',
                        layers[nowLayerIndex].paint['line-dasharray']
                      )
                    "
                    :min="0"
                    size="small"
                    label="描述文字"
                  >
                  </el-input-number
                  >&nbsp;
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    circle
                    @click="
                      layers[nowLayerIndex].paint['line-dasharray'].splice(
                        index,
                        1
                      )
                    "
                  ></el-button>
                </div>
                <el-button
                  type="primary"
                  round
                  @click="layers[nowLayerIndex].paint['line-dasharray'].push(0)"
                  >添加虚线设置
                </el-button>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="line-dasharray"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="线间隙" name="fifth">
              <h3>线间隙宽度</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['line-gap-width']">{{
                menuShowList["line-gap-width"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['line-gap-width']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['line-gap-width']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'line-gap-width',
                      layers[nowLayerIndex].paint['line-gap-width']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="line-gap-width"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="模糊" name="sixth">
              <h3>模糊度</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['line-blur']">{{
                menuShowList["line-blur"]
              }}</span>
              <el-row v-if="menuButtonShowList['line-blur']">
                <el-slider
                  v-model="layers[nowLayerIndex].paint['line-blur']"
                  :min="0"
                  :max="1"
                  :marks="{ 0: '0', 0.5: '0.5', 1: '1' }"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'line-blur',
                      layers[nowLayerIndex].paint['line-blur']
                    )
                  "
                  :step="0.1"
                >
                </el-slider>
                <br />
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['line-blur']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'line-blur',
                      layers[nowLayerIndex].paint['line-blur']
                    )
                  "
                  :min="0"
                  :max="1"
                  :step="0.1"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="line-blur"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="平移" name="seventh">
              <h3>平移</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['line-translate']">{{
                menuShowList["line-translate"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['line-translate']"
                style="margin-top: 10px; display: flex"
              >
                <h4>x轴(px):&nbsp;</h4>
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['line-translate'][0]"
                  :step="1"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'line-translate',
                      layers[nowLayerIndex].paint['line-translate']
                    )
                  "
                >
                </el-input-number>
              </el-row>
              <el-row
                v-if="menuButtonShowList['line-translate']"
                style="display: flex"
              >
                <h4>y轴(px):&nbsp;</h4>
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['line-translate'][1]"
                  :step="1"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'line-translate',
                      layers[nowLayerIndex].paint['line-translate']
                    )
                  "
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="line-translate"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="平移参考" name="eighth">
              <h3>平移参考</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['line-translate-anchor']">{{
                menuShowList["line-translate-anchor"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['line-translate-anchor']"
                style="display: flex; margin-top: 10px"
              >
                <el-select
                  v-model="layers[nowLayerIndex].paint['line-translate-anchor']"
                  placeholder="请选择"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'line-translate-anchor',
                      layers[nowLayerIndex].paint['line-translate-anchor']
                    )
                  "
                >
                  <el-option
                    v-for="item in ['map', 'viewport']"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="line-translate-anchor"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="偏移" name="ninth">
              <h3>偏移</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['line-offset']">{{
                menuShowList["line-offset"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['line-offset']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['line-offset']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'line-offset',
                      layers[nowLayerIndex].paint['line-offset']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="line-offset"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="线帽" name="tentn">
              <h3>线帽</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['line-cap']">{{
                menuShowList["line-cap"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['line-cap']"
                style="display: flex; margin-top: 10px"
              >
                <el-select
                  v-model="layers[nowLayerIndex].layout['line-cap']"
                  placeholder="请选择"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'line-cap',
                      layers[nowLayerIndex].layout['line-cap']
                    )
                  "
                >
                  <el-option
                    v-for="item in [
                      { label: '平直 butt', value: 'butt' },
                      { label: '圆形 round', value: 'round' },
                      { label: '方形 square', value: 'square' },
                    ]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="line-cap"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="线连接" name="eleven">
              <h3>线连接</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['line-join']">{{
                menuShowList["line-join"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['line-join']"
                style="display: flex; margin-top: 10px"
              >
                <el-select
                  v-model="layers[nowLayerIndex].layout['line-join']"
                  placeholder="请选择"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'line-join',
                      layers[nowLayerIndex].layout['line-join']
                    )
                  "
                >
                  <el-option
                    v-for="item in [
                      { label: '尖角 miter', value: 'miter' },
                      { label: '圆角 round', value: 'round' },
                      { label: '斜角 bevel', value: 'bevel' },
                    ]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="line-join"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
          </el-tabs>
          <!--    面图层编辑面板-->
          <el-tabs
            :before-leave="leaveTab"
            v-if="editorShow == 'fillEditorShow'"
            type="border-card"
            value="first"
            tab-position="left"
          >
            <el-tab-pane label="颜色" name="first">
              <h3>填充颜色</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['fill-color']">{{
                menuShowList["fill-color"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['fill-color']"
                style="display: flex; margin-top: 10px"
              >
                <el-color-picker
                  v-model="layers[nowLayerIndex].paint['fill-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-color',
                      layers[nowLayerIndex].paint['fill-color']
                    )
                  "
                  :predefine="predefineColors"
                >
                </el-color-picker>
                <el-input
                  v-model="layers[nowLayerIndex].paint['fill-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-color',
                      layers[nowLayerIndex].paint['fill-color']
                    )
                  "
                  placeholder="something"
                ></el-input>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-color"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="不透明度" name="second">
              <h3>不透明度</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['fill-opacity']">{{
                menuShowList["fill-opacity"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['fill-opacity']"
                style="margin-top: 10px"
              >
                <el-slider
                  v-model="layers[nowLayerIndex].paint['fill-opacity']"
                  :min="0"
                  :max="1"
                  :marks="{ 0: '0', 0.5: '0.5', 1: '1' }"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-opacity',
                      layers[nowLayerIndex].paint['fill-opacity']
                    )
                  "
                  :step="0.1"
                >
                </el-slider>
                <br />
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['fill-opacity']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-opacity',
                      layers[nowLayerIndex].paint['fill-opacity']
                    )
                  "
                  :min="0"
                  :max="1"
                  :step="0.1"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-opacity"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="边线颜色" name="third">
              <h3>边线颜色</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['fill-outline-color']">{{
                menuShowList["fill-outline-color"]
              }}</span>
              <br />
              <span style="font-size: 10px; color: #909399"
                >（该属性需要抗锯齿属性为true）</span
              >
              <el-row
                v-if="
                  menuButtonShowList['fill-outline-color'] &&
                  layers[nowLayerIndex].paint['fill-antialias']
                "
                style="display: flex; margin-top: 10px"
              >
                <el-input
                  v-model="layers[nowLayerIndex].paint['fill-outline-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-outline-color',
                      layers[nowLayerIndex].paint['fill-outline-color']
                    )
                  "
                  placeholder="something"
                ></el-input>
                <el-color-picker
                  v-model="layers[nowLayerIndex].paint['fill-outline-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-outline-color',
                      layers[nowLayerIndex].paint['fill-outline-color']
                    )
                  "
                  :predefine="predefineColors"
                >
                </el-color-picker>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-outline-color"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="平移" name="forth">
              <h3>平移</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['fill-translate']">{{
                menuShowList["fill-translate"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['fill-translate']"
                style="margin-top: 10px; display: flex"
              >
                <h4>x轴(px):&nbsp;</h4>
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['fill-translate'][0]"
                  :step="1"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-translate',
                      layers[nowLayerIndex].paint['fill-translate']
                    )
                  "
                >
                </el-input-number>
              </el-row>
              <el-row
                v-if="menuButtonShowList['fill-translate']"
                style="display: flex"
              >
                <h4>y轴(px):&nbsp;</h4>
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['fill-translate'][1]"
                  :step="1"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-translate',
                      layers[nowLayerIndex].paint['fill-translate']
                    )
                  "
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-translate"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="平移参考" name="fifth">
              <h3>平移参考</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['fill-translate-anchor']">{{
                menuShowList["fill-translate-anchor"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['fill-translate-anchor']"
                style="display: flex; margin-top: 10px"
              >
                <el-select
                  v-model="layers[nowLayerIndex].paint['fill-translate-anchor']"
                  placeholder="请选择"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-translate-anchor',
                      layers[nowLayerIndex].paint['fill-translate-anchor']
                    )
                  "
                >
                  <el-option
                    v-for="item in ['map', 'viewport']"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-translate-anchor"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="抗锯齿" name="sixth">
              <h3>抗锯齿</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['fill-antialias']">{{
                menuShowList["fill-antialias"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['fill-antialias']"
                style="margin-top: 10px; display: flex"
              >
                <el-switch
                  v-model="layers[nowLayerIndex].paint['fill-antialias']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-antialias',
                      layers[nowLayerIndex].paint['fill-antialias']
                    )
                  "
                >
                </el-switch>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-antialias"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
          </el-tabs>
          <!--    三维面图层编辑面板-->
          <el-tabs
            :before-leave="leaveTab"
            v-if="editorShow == 'fillExtrusionEditorShow'"
            type="border-card"
            value="first"
            tab-position="left"
          >
            <el-tab-pane label="颜色" name="first">
              <h3>填充颜色</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['fill-extrusion-color']">{{
                menuShowList["fill-extrusion-color"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['fill-extrusion-color']"
                style="display: flex; margin-top: 10px"
              >
                <el-color-picker
                  v-model="layers[nowLayerIndex].paint['fill-extrusion-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-color',
                      layers[nowLayerIndex].paint['fill-extrusion-color']
                    )
                  "
                  :predefine="predefineColors"
                >
                </el-color-picker>
                <el-input
                  v-model="layers[nowLayerIndex].paint['fill-extrusion-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-color',
                      layers[nowLayerIndex].paint['fill-extrusion-color']
                    )
                  "
                  placeholder="something"
                ></el-input>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-extrusion-color"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="不透明度" name="second">
              <h3>不透明度</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['fill-extrusion-opacity']">{{
                menuShowList["fill-extrusion-opacity"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['fill-extrusion-opacity']"
                style="margin-top: 10px"
              >
                <el-slider
                  v-model="
                    layers[nowLayerIndex].paint['fill-extrusion-opacity']
                  "
                  :min="0"
                  :max="1"
                  :marks="{ 0: '0', 0.5: '0.5', 1: '1' }"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-opacity',
                      layers[nowLayerIndex].paint['fill-extrusion-opacity']
                    )
                  "
                  :step="0.1"
                >
                </el-slider>
                <br />
                <el-input-number
                  v-model="
                    layers[nowLayerIndex].paint['fill-extrusion-opacity']
                  "
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-opacity',
                      layers[nowLayerIndex].paint['fill-extrusion-opacity']
                    )
                  "
                  :min="0"
                  :max="1"
                  :step="0.1"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-extrusion-opacity"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="高度" name="third">
              <h3>高度</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['fill-extrusion-height']">{{
                menuShowList["fill-extrusion-height"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['fill-extrusion-height']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['fill-extrusion-height']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-height',
                      layers[nowLayerIndex].paint['fill-extrusion-height']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-extrusion-height"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="底部高度" name="forth">
              <h3>底部高度</h3>
              &nbsp;
              <br />
              <span v-if="!menuButtonShowList['fill-extrusion-base']">{{
                menuShowList["fill-extrusion-base"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['fill-extrusion-base']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['fill-extrusion-base']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-base',
                      layers[nowLayerIndex].paint['fill-extrusion-base']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-extrusion-base"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="平移" name="fifth">
              <h3>平移</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['fill-extrusion-translate']">{{
                menuShowList["fill-extrusion-translate"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['fill-extrusion-translate']"
                style="margin-top: 10px; display: flex"
              >
                <h4>x轴(px):&nbsp;</h4>
                <el-input-number
                  v-model="
                    layers[nowLayerIndex].paint['fill-extrusion-translate'][0]
                  "
                  :step="1"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-translate',
                      layers[nowLayerIndex].paint['fill-extrusion-translate']
                    )
                  "
                >
                </el-input-number>
              </el-row>
              <el-row
                v-if="menuButtonShowList['fill-extrusion-translate']"
                style="display: flex"
              >
                <h4>y轴(px):&nbsp;</h4>
                <el-input-number
                  v-model="
                    layers[nowLayerIndex].paint['fill-extrusion-translate'][1]
                  "
                  :step="1"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-translate',
                      layers[nowLayerIndex].paint['fill-extrusion-translate']
                    )
                  "
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-extrusion-translate"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="平移参考" name="sixth">
              <h3>平移参考</h3>
              &nbsp;
              <span
                v-if="!menuButtonShowList['fill-extrusion-translate-anchor']"
                >{{ menuShowList["fill-extrusion-translate-anchor"] }}</span
              >
              <el-row
                v-if="menuButtonShowList['fill-extrusion-translate-anchor']"
                style="display: flex; margin-top: 10px"
              >
                <el-select
                  v-model="
                    layers[nowLayerIndex].paint[
                      'fill-extrusion-translate-anchor'
                    ]
                  "
                  placeholder="请选择"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-translate-anchor',
                      layers[nowLayerIndex].paint[
                        'fill-extrusion-translate-anchor'
                      ]
                    )
                  "
                >
                  <el-option
                    v-for="item in ['map', 'viewport']"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-extrusion-translate-anchor"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="渐变填充" name="seven">
              <h3>渐变填充</h3>
              &nbsp;
              <span
                v-if="!menuButtonShowList['fill-extrusion-vertical-gradient']"
                >{{ menuShowList["fill-extrusion-vertical-gradient"] }}</span
              >
              <el-row
                v-if="menuButtonShowList['fill-extrusion-vertical-gradient']"
                style="margin-top: 10px; display: flex"
              >
                <el-switch
                  v-model="
                    layers[nowLayerIndex].paint[
                      'fill-extrusion-vertical-gradient'
                    ]
                  "
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-vertical-gradient',
                      layers[nowLayerIndex].paint[
                        'fill-extrusion-vertical-gradient'
                      ]
                    )
                  "
                >
                </el-switch>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-extrusion-vertical-gradient"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
          </el-tabs>
          <!--    图标图层编辑面板-->
          <div v-if="editorShow == 'symbolEditorShow'" class="symbolSort">
            <span
              type="text"
              @click="symbolChange('icon')"
              :style="{ color: symbolColor[0] }"
              >图标</span
            >
            <span
              type="text"
              @click="symbolChange('tag')"
              :style="{ color: symbolColor[1] }"
              >标注</span
            >
          </div>
          <el-tabs
            class="symbolBox"
            :before-leave="leaveTab"
            v-if="editorShow == 'symbolEditorShow'"
            v-show="isSymbol"
            type="border-card"
            value="first"
            tab-position="left"
          >
            <el-tab-pane label="图标" name="first">
              <h3>图标选择</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['icon-image']">{{
                menuShowList["icon-image"]
              }}</span>
              <br />
              <el-row
                v-if="menuButtonShowList['icon-image']"
                style="display: flex; margin-top: 10px"
              >
                <el-input
                  v-model="layers[nowLayerIndex].layout['icon-image']"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'icon-image',
                      layers[nowLayerIndex].layout['icon-image']
                    )
                  "
                  placeholder="something"
                ></el-input>
                <el-popover
                  ref="iconPopover"
                  placement="right"
                  width="400"
                  trigger="click"
                >
                  <el-tabs>
                    <el-tab-pane
                      label="精灵图"
                      style="height: 200px; overflow-y: scroll"
                    >
                      <el-col
                        class="cursor"
                        v-for="(item, index) in spriteList"
                        :key="index"
                        @click.native="spriteSelect(item)"
                      >
                        {{ item }}
                      </el-col>
                    </el-tab-pane>
                    <el-tab-pane label="自定义">
                      <el-row
                        type="flex"
                        justify="start"
                        style="flex-wrap: wrap; width: 100%"
                      >
                        <el-card
                          class="spriteImage"
                          v-for="(item, index) in symbolTableData"
                          :key="index"
                        >
                          <el-image
                            style="width: 100px; height: 100px"
                            :src="reqUrl + item.webAddress"
                            fit="cover"
                            class="cursor"
                            @click="iconSelect(item)"
                          >
                          </el-image>
                        </el-card>
                      </el-row>
                    </el-tab-pane>
                  </el-tabs>

                  <el-button
                    type="text"
                    icon="el-icon-s-unfold"
                    slot="reference"
                  ></el-button>
                </el-popover>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="icon-image"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="图标大小">
              <h3>图标大小</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['icon-size']">{{
                menuShowList["icon-size"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['icon-size']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].layout['icon-size']"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'icon-size',
                      layers[nowLayerIndex].layout['icon-size']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="icon-size"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="不透明度">
              <h3>不透明度</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['icon-opacity']">{{
                menuShowList["icon-opacity"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['icon-opacity']"
                style="margin-top: 10px"
              >
                <el-slider
                  v-model="layers[nowLayerIndex].paint['icon-opacity']"
                  :min="0"
                  :max="1"
                  :marks="{ 0: '0', 0.5: '0.5', 1: '1' }"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'icon-opacity',
                      layers[nowLayerIndex].paint['icon-opacity']
                    )
                  "
                  :step="0.1"
                >
                </el-slider>
                <br />
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['icon-opacity']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'icon-opacity',
                      layers[nowLayerIndex].paint['icon-opacity']
                    )
                  "
                  :min="0"
                  :max="1"
                  :step="0.1"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="icon-opacity"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="允许压盖">
              <h3>允许压盖</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['icon-allow-overlap']">{{
                menuShowList["icon-allow-overlap"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['icon-allow-overlap']"
                style="margin-top: 10px; display: flex"
              >
                <el-switch
                  v-model="layers[nowLayerIndex].layout['icon-allow-overlap']"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'icon-allow-overlap',
                      layers[nowLayerIndex].layout['icon-allow-overlap']
                    )
                  "
                >
                </el-switch>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="icon-allow-overlap"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="忽略放置">
              <h3>忽略放置</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['icon-ignore-placement']">{{
                menuShowList["icon-ignore-placement"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['icon-ignore-placement']"
                style="margin-top: 10px; display: flex"
              >
                <el-switch
                  v-model="
                    layers[nowLayerIndex].layout['icon-ignore-placement']
                  "
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'icon-ignore-placement',
                      layers[nowLayerIndex].layout['icon-ignore-placement']
                    )
                  "
                >
                </el-switch>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="icon-ignore-placement"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="图标可选">
              <h3>图标可选</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['icon-optional']">{{
                menuShowList["icon-optional"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['icon-optional']"
                style="margin-top: 10px; display: flex"
              >
                <el-switch
                  v-model="layers[nowLayerIndex].layout['icon-optional']"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'icon-optional',
                      layers[nowLayerIndex].layout['icon-optional']
                    )
                  "
                >
                </el-switch>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="icon-optional"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="内边距">
              <h3>内边距（px）</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['icon-padding']">{{
                menuShowList["icon-padding"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['icon-padding']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].layout['icon-padding']"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'icon-padding',
                      layers[nowLayerIndex].layout['icon-padding']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="icon-padding"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="偏移">
              <h3>偏移（iconsize）</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['icon-offset']">{{
                menuShowList["icon-offset"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['icon-offset']"
                style="margin-top: 10px; display: flex"
              >
                <h4>x轴:&nbsp;</h4>
                <el-input-number
                  v-model="layers[nowLayerIndex].layout['icon-offset'][0]"
                  :step="1"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'icon-offset',
                      layers[nowLayerIndex].layout['icon-offset']
                    )
                  "
                >
                </el-input-number>
              </el-row>
              <el-row
                v-if="menuButtonShowList['icon-offset']"
                style="display: flex"
              >
                <h4>y轴:&nbsp;</h4>
                <el-input-number
                  v-model="layers[nowLayerIndex].layout['icon-offset'][1]"
                  :step="1"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'icon-offset',
                      layers[nowLayerIndex].layout['icon-offset']
                    )
                  "
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="icon-offset"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="平移">
              <h3>平移</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['icon-translate']">{{
                menuShowList["icon-translate"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['icon-translate']"
                style="margin-top: 10px; display: flex"
              >
                <h4>x轴(px):&nbsp;</h4>
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['icon-translate'][0]"
                  :step="1"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'icon-translate',
                      layers[nowLayerIndex].paint['icon-translate']
                    )
                  "
                >
                </el-input-number>
              </el-row>
              <el-row
                v-if="menuButtonShowList['icon-translate']"
                style="display: flex"
              >
                <h4>y轴(px):&nbsp;</h4>
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['icon-translate'][1]"
                  :step="1"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'icon-translate',
                      layers[nowLayerIndex].paint['icon-translate']
                    )
                  "
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="icon-translate"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="平移参考">
              <h3>平移参考</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['icon-translate-anchor']">{{
                menuShowList["icon-translate-anchor"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['icon-translate-anchor']"
                style="margin-top: 10px; display: flex"
              >
                <el-select
                  v-model="layers[nowLayerIndex].paint['icon-translate-anchor']"
                  placeholder="请选择"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'icon-translate-anchor',
                      layers[nowLayerIndex].paint['icon-translate-anchor']
                    )
                  "
                >
                  <el-option
                    v-for="item in ['map', 'viewport']"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="icon-translate-anchor"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="图标锚点">
              <h3>图标锚点</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['icon-anchor']">{{
                menuShowList["icon-anchor"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['icon-anchor']"
                style="margin-top: 10px; display: flex"
              >
                <el-select
                  v-model="layers[nowLayerIndex].layout['icon-anchor']"
                  placeholder="请选择"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'icon-anchor',
                      layers[nowLayerIndex].layout['icon-anchor']
                    )
                  "
                >
                  <el-option
                    v-for="item in [
                      'center',
                      'left',
                      'right',
                      'top',
                      'bottom',
                      'top-left',
                      'top-right',
                      'bottom-left',
                      'bottom-right',
                    ]"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="icon-anchor"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="旋转角度">
              <h3>旋转角度（deg）</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['icon-rotate']">{{
                menuShowList["icon-rotate"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['icon-rotate']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].layout['icon-rotate']"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'icon-rotate',
                      layers[nowLayerIndex].layout['icon-rotate']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="icon-rotate"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="倾斜对齐">
              <h3>倾斜对齐</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['icon-pitch-alignment']">{{
                menuShowList["icon-pitch-alignment"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['icon-pitch-alignment']"
                style="margin-top: 10px; display: flex"
              >
                <el-select
                  v-model="layers[nowLayerIndex].layout['icon-pitch-alignment']"
                  placeholder="请选择"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'icon-pitch-alignment',
                      layers[nowLayerIndex].layout['icon-pitch-alignment']
                    )
                  "
                >
                  <el-option
                    v-for="item in ['auto', 'map', 'viewport']"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="icon-pitch-alignment"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="旋转对齐">
              <h3>旋转对齐</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['icon-rotation-alignment']">{{
                menuShowList["icon-rotation-alignment"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['icon-rotation-alignment']"
                style="margin-top: 10px; display: flex"
              >
                <el-select
                  v-model="
                    layers[nowLayerIndex].layout['icon-rotation-alignment']
                  "
                  placeholder="请选择"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'icon-rotation-alignment',
                      layers[nowLayerIndex].layout['icon-rotation-alignment']
                    )
                  "
                >
                  <el-option
                    v-for="item in ['auto', 'map', 'viewport']"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="icon-rotation-alignment"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
          </el-tabs>

          <el-tabs
            class="symbolBox"
            :before-leave="leaveTab"
            v-if="editorShow == 'symbolEditorShow'"
            v-show="!isSymbol"
            type="border-card"
            value="first"
            tab-position="left"
          >
            <el-tab-pane label="标注字段" name="first">
              <h3>标注字段</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-field']">{{
                menuShowList["text-field"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-field']"
                style="display: flex; margin-top: 10px"
              >
                <el-input
                  v-model="textField"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'text-field',
                      ['get', textField]
                    )
                  "
                  placeholder="something"
                ></el-input>
                <el-popover
                  ref="fieldPopover"
                  placement="right"
                  width="400"
                  trigger="click"
                >
                  <el-table
                    :data="
                      filterOptions.filter(
                        (data) =>
                          !textFieldSearch ||
                          data['column_name']
                            .toLowerCase()
                            .includes(textFieldSearch.toLowerCase())
                      )
                    "
                    :cell-style="{ textAlign: 'left' }"
                    height="400"
                    @row-click="fieldSelect"
                  >
                    <el-table-column prop="column_name" align="right">
                      <template slot="header">
                        <el-input
                          v-model="textFieldSearch"
                          size="mini"
                          placeholder="搜索"
                          prefix-icon="el-icon-search"
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button
                    type="text"
                    icon="el-icon-s-unfold"
                    slot="reference"
                  ></el-button>
                </el-popover>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-field"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="颜色">
              <h3>颜色</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-color']">{{
                menuShowList["text-color"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-color']"
                style="display: flex; margin-top: 10px"
              >
                <el-color-picker
                  v-model="layers[nowLayerIndex].paint['text-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'text-color',
                      layers[nowLayerIndex].paint['text-color']
                    )
                  "
                  :predefine="predefineColors"
                >
                </el-color-picker>
                <el-input
                  v-model="layers[nowLayerIndex].paint['text-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'text-color',
                      layers[nowLayerIndex].paint['text-color']
                    )
                  "
                  placeholder="something"
                ></el-input>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-color"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="不透明度">
              <h3>不透明度</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-opacity']">{{
                menuShowList["text-opacity"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-opacity']"
                style="margin-top: 10px"
              >
                <el-slider
                  v-model="layers[nowLayerIndex].paint['text-opacity']"
                  :min="0"
                  :max="1"
                  :marks="{ 0: '0', 0.5: '0.5', 1: '1' }"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'text-opacity',
                      layers[nowLayerIndex].paint['text-opacity']
                    )
                  "
                  :step="0.1"
                >
                </el-slider>
                <br />
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['text-opacity']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'text-opacity',
                      layers[nowLayerIndex].paint['text-opacity']
                    )
                  "
                  :min="0"
                  :max="1"
                  :step="0.1"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-opacity"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="字体">
              <h3>字体</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-font']">{{
                menuShowList["text-font"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-font']"
                style="display: flex; margin-top: 10px"
              >
                <el-input
                  v-model="layers[nowLayerIndex].layout['text-font'][0]"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'text-font',
                      layers[nowLayerIndex].layout['text-font']
                    )
                  "
                  placeholder="something"
                ></el-input>
                <el-popover
                  ref="fontPopover"
                  placement="right"
                  width="400"
                  trigger="click"
                >
                  <el-table
                    :data="
                      fontList.filter(
                        (data) =>
                          !fontSearch ||
                          (data['name']
                            .toLowerCase()
                            .includes(fontSearch.toLowerCase()) &&
                            data.type == 'offline')
                      )
                    "
                    :cell-style="{ textAlign: 'left' }"
                    height="400"
                    @row-click="fontSelect"
                  >
                    <el-table-column prop="name">
                      <template slot="header">
                        <el-input
                          v-model="fontSearch"
                          size="mini"
                          placeholder="搜索"
                          prefix-icon="el-icon-search"
                        >
                        </el-input>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button
                    type="text"
                    icon="el-icon-s-unfold"
                    slot="reference"
                  ></el-button>
                </el-popover>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-font"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="字体大小">
              <h3>字体大小（px）</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-size']">{{
                menuShowList["text-size"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-size']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].layout['text-size']"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'text-size',
                      layers[nowLayerIndex].layout['text-size']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-size"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="放置位置">
              <h3>放置位置</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['symbol-placement']">{{
                menuShowList["symbol-placement"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['symbol-placement']"
                style="margin-top: 10px; display: flex"
              >
                <el-select
                  v-model="layers[nowLayerIndex].layout['symbol-placement']"
                  placeholder="请选择"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'symbol-placement',
                      layers[nowLayerIndex].layout['symbol-placement']
                    )
                  "
                >
                  <el-option
                    v-for="item in ['point', 'line', 'line-center']"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="symbol-placement"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="图标锚点">
              <h3>图标锚点</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-anchor']">{{
                menuShowList["text-anchor"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-anchor']"
                style="margin-top: 10px; display: flex"
              >
                <el-select
                  v-model="layers[nowLayerIndex].layout['text-anchor']"
                  placeholder="请选择"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'text-anchor',
                      layers[nowLayerIndex].layout['text-anchor']
                    )
                  "
                >
                  <el-option
                    v-for="item in [
                      'center',
                      'left',
                      'right',
                      'top',
                      'bottom',
                      'top-left',
                      'top-right',
                      'bottom-left',
                      'bottom-right',
                    ]"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-anchor"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="文本对齐">
              <h3>文本对齐</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-justify']">{{
                menuShowList["text-justify"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-justify']"
                style="margin-top: 10px; display: flex"
              >
                <el-select
                  v-model="layers[nowLayerIndex].layout['text-justify']"
                  placeholder="请选择"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'text-justify',
                      layers[nowLayerIndex].layout['text-justify']
                    )
                  "
                >
                  <el-option
                    v-for="item in ['auto', 'center', 'right', 'left']"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-justify"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="字符边距">
              <h3>字符边距（em）</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-letter-spacing']">{{
                menuShowList["text-letter-spacing"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-letter-spacing']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].layout['text-letter-spacing']"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'text-letter-spacing',
                      layers[nowLayerIndex].layout['text-letter-spacing']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-letter-spacing"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="行高">
              <h3>行高（em）</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-line-height']">{{
                menuShowList["text-line-height"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-line-height']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].layout['text-line-height']"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'text-line-height',
                      layers[nowLayerIndex].layout['text-line-height']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-line-height"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="最大宽度">
              <h3>最大宽度（em）</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-max-width']">{{
                menuShowList["text-max-width"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-max-width']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].layout['text-max-width']"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'text-max-width',
                      layers[nowLayerIndex].layout['text-max-width']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-max-width"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="允许压盖">
              <h3>允许压盖</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-allow-overlap']">{{
                menuShowList["text-allow-overlap"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-allow-overlap']"
                style="margin-top: 10px; display: flex"
              >
                <el-switch
                  v-model="layers[nowLayerIndex].layout['text-allow-overlap']"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'text-allow-overlap',
                      layers[nowLayerIndex].layout['text-allow-overlap']
                    )
                  "
                >
                </el-switch>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-allow-overlap"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="忽略放置">
              <h3>忽略放置</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-ignore-placement']">{{
                menuShowList["text-ignore-placement"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-ignore-placement']"
                style="margin-top: 10px; display: flex"
              >
                <el-switch
                  v-model="
                    layers[nowLayerIndex].layout['text-ignore-placement']
                  "
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'text-ignore-placement',
                      layers[nowLayerIndex].layout['text-ignore-placement']
                    )
                  "
                >
                </el-switch>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-ignore-placement"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="标注可选">
              <h3>标注可选</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-optional']">{{
                menuShowList["text-optional"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-optional']"
                style="margin-top: 10px; display: flex"
              >
                <el-switch
                  v-model="layers[nowLayerIndex].layout['text-optional']"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'text-optional',
                      layers[nowLayerIndex].layout['text-optional']
                    )
                  "
                >
                </el-switch>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-optional"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="大小写转换">
              <h3>大小写转换</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-transform']">{{
                menuShowList["text-transform"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-transform']"
                style="margin-top: 10px; display: flex"
              >
                <el-select
                  v-model="layers[nowLayerIndex].layout['text-transform']"
                  placeholder="请选择"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'text-transform',
                      layers[nowLayerIndex].layout['text-transform']
                    )
                  "
                >
                  <el-option
                    v-for="item in ['none', 'uppercase', 'lowercase']"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-transform"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="内边距">
              <h3>内边距（px）</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-padding']">{{
                menuShowList["text-padding"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-padding']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].layout['text-padding']"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'text-padding',
                      layers[nowLayerIndex].layout['text-padding']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-padding"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="偏移">
              <h3>偏移(em)</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-offset']">{{
                menuShowList["text-offset"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-offset']"
                style="margin-top: 10px; display: flex"
              >
                <h4>x轴:&nbsp;</h4>
                <el-input-number
                  v-model="layers[nowLayerIndex].layout['text-offset'][0]"
                  :step="1"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'text-offset',
                      layers[nowLayerIndex].layout['text-offset']
                    )
                  "
                >
                </el-input-number>
              </el-row>
              <el-row
                v-if="menuButtonShowList['text-offset']"
                style="display: flex"
              >
                <h4>y轴:&nbsp;</h4>
                <el-input-number
                  v-model="layers[nowLayerIndex].layout['text-offset'][1]"
                  :step="1"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'text-offset',
                      layers[nowLayerIndex].layout['text-offset']
                    )
                  "
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-offset"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="平移">
              <h3>平移(px)</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-translate']">{{
                menuShowList["text-translate"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-translate']"
                style="margin-top: 10px; display: flex"
              >
                <h4>x轴(px):&nbsp;</h4>
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['text-translate'][0]"
                  :step="1"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'text-translate',
                      layers[nowLayerIndex].paint['text-translate']
                    )
                  "
                >
                </el-input-number>
              </el-row>
              <el-row
                v-if="menuButtonShowList['text-translate']"
                style="display: flex"
              >
                <h4>y轴(px):&nbsp;</h4>
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['text-translate'][1]"
                  :step="1"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'text-translate',
                      layers[nowLayerIndex].paint['text-translate']
                    )
                  "
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-translate"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="旋转角度">
              <h3>旋转角度（deg）</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-rotate']">{{
                menuShowList["text-rotate"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-rotate']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].layout['text-rotate']"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'text-rotate',
                      layers[nowLayerIndex].layout['text-rotate']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-rotate"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="倾斜对齐">
              <h3>倾斜对齐</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-pitch-alignment']">{{
                menuShowList["text-pitch-alignment"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-pitch-alignment']"
                style="margin-top: 10px; display: flex"
              >
                <el-select
                  v-model="layers[nowLayerIndex].layout['text-pitch-alignment']"
                  placeholder="请选择"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'text-pitch-alignment',
                      layers[nowLayerIndex].layout['text-pitch-alignment']
                    )
                  "
                >
                  <el-option
                    v-for="item in ['auto', 'map', 'viewport']"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-pitch-alignment"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="旋转对齐">
              <h3>旋转对齐</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-rotation-alignment']">{{
                menuShowList["text-rotation-alignment"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-rotation-alignment']"
                style="margin-top: 10px; display: flex"
              >
                <el-select
                  v-model="
                    layers[nowLayerIndex].layout['text-rotation-alignment']
                  "
                  placeholder="请选择"
                  @change="
                    handleLayoutChange(
                      layers[nowLayerIndex]['id'],
                      'text-rotation-alignment',
                      layers[nowLayerIndex].layout['text-rotation-alignment']
                    )
                  "
                >
                  <el-option
                    v-for="item in ['auto', 'map', 'viewport']"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-rotation-alignment"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="掩膜颜色">
              <h3>颜色</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-halo-color']">{{
                menuShowList["text-halo-color"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-halo-color']"
                style="display: flex; margin-top: 10px"
              >
                <el-color-picker
                  v-model="layers[nowLayerIndex].paint['text-halo-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'text-halo-color',
                      layers[nowLayerIndex].paint['text-halo-color']
                    )
                  "
                  :predefine="predefineColors"
                >
                </el-color-picker>
                <el-input
                  v-model="layers[nowLayerIndex].paint['text-halo-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'text-halo-color',
                      layers[nowLayerIndex].paint['text-halo-color']
                    )
                  "
                  placeholder="something"
                ></el-input>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-halo-color"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="掩膜宽度">
              <h3>掩膜宽度（px）</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-halo-width']">{{
                menuShowList["text-halo-width"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-halo-width']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['text-halo-width']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'text-halo-width',
                      layers[nowLayerIndex].paint['text-halo-width']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-halo-width"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="掩膜模糊">
              <h3>掩膜模糊（px）</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['text-halo-blur']">{{
                menuShowList["text-halo-blur"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['text-halo-blur']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['text-halo-blur']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'text-halo-blur',
                      layers[nowLayerIndex].paint['text-halo-blur']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="text-halo-blur"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
          </el-tabs>
          <!-- 背景图层编辑面板 -->
          <el-tabs
            :before-leave="leaveTab"
            v-if="editorShow == 'fillExtrusionEditorShow'"
            type="border-card"
            value="first"
            tab-position="left"
          >
            <el-tab-pane label="颜色" name="first">
              <h3>填充颜色</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['fill-extrusion-color']">{{
                menuShowList["fill-extrusion-color"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['fill-extrusion-color']"
                style="display: flex; margin-top: 10px"
              >
                <el-color-picker
                  v-model="layers[nowLayerIndex].paint['fill-extrusion-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-color',
                      layers[nowLayerIndex].paint['fill-extrusion-color']
                    )
                  "
                  :predefine="predefineColors"
                >
                </el-color-picker>
                <el-input
                  v-model="layers[nowLayerIndex].paint['fill-extrusion-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-color',
                      layers[nowLayerIndex].paint['fill-extrusion-color']
                    )
                  "
                  placeholder="something"
                ></el-input>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-extrusion-color"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="不透明度" name="second">
              <h3>不透明度</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['fill-extrusion-opacity']">{{
                menuShowList["fill-extrusion-opacity"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['fill-extrusion-opacity']"
                style="margin-top: 10px"
              >
                <el-slider
                  v-model="
                    layers[nowLayerIndex].paint['fill-extrusion-opacity']
                  "
                  :min="0"
                  :max="1"
                  :marks="{ 0: '0', 0.5: '0.5', 1: '1' }"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-opacity',
                      layers[nowLayerIndex].paint['fill-extrusion-opacity']
                    )
                  "
                  :step="0.1"
                >
                </el-slider>
                <br />
                <el-input-number
                  v-model="
                    layers[nowLayerIndex].paint['fill-extrusion-opacity']
                  "
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-opacity',
                      layers[nowLayerIndex].paint['fill-extrusion-opacity']
                    )
                  "
                  :min="0"
                  :max="1"
                  :step="0.1"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-extrusion-opacity"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="高度" name="third">
              <h3>高度</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['fill-extrusion-height']">{{
                menuShowList["fill-extrusion-height"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['fill-extrusion-height']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['fill-extrusion-height']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-height',
                      layers[nowLayerIndex].paint['fill-extrusion-height']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-extrusion-height"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="底部高度" name="forth">
              <h3>底部高度</h3>
              &nbsp;
              <br />
              <span v-if="!menuButtonShowList['fill-extrusion-base']">{{
                menuShowList["fill-extrusion-base"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['fill-extrusion-base']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['fill-extrusion-base']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-base',
                      layers[nowLayerIndex].paint['fill-extrusion-base']
                    )
                  "
                  :min="0"
                  :max="99999"
                  size="medium"
                  label="描述文字"
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-extrusion-base"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="平移" name="fifth">
              <h3>平移</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['fill-extrusion-translate']">{{
                menuShowList["fill-extrusion-translate"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['fill-extrusion-translate']"
                style="margin-top: 10px; display: flex"
              >
                <h4>x轴(px):&nbsp;</h4>
                <el-input-number
                  v-model="
                    layers[nowLayerIndex].paint['fill-extrusion-translate'][0]
                  "
                  :step="1"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-translate',
                      layers[nowLayerIndex].paint['fill-extrusion-translate']
                    )
                  "
                >
                </el-input-number>
              </el-row>
              <el-row
                v-if="menuButtonShowList['fill-extrusion-translate']"
                style="display: flex"
              >
                <h4>y轴(px):&nbsp;</h4>
                <el-input-number
                  v-model="
                    layers[nowLayerIndex].paint['fill-extrusion-translate'][1]
                  "
                  :step="1"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-translate',
                      layers[nowLayerIndex].paint['fill-extrusion-translate']
                    )
                  "
                >
                </el-input-number>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-extrusion-translate"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="平移参考" name="sixth">
              <h3>平移参考</h3>
              &nbsp;
              <span
                v-if="!menuButtonShowList['fill-extrusion-translate-anchor']"
                >{{ menuShowList["fill-extrusion-translate-anchor"] }}</span
              >
              <el-row
                v-if="menuButtonShowList['fill-extrusion-translate-anchor']"
                style="display: flex; margin-top: 10px"
              >
                <el-select
                  v-model="
                    layers[nowLayerIndex].paint[
                      'fill-extrusion-translate-anchor'
                    ]
                  "
                  placeholder="请选择"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-translate-anchor',
                      layers[nowLayerIndex].paint[
                        'fill-extrusion-translate-anchor'
                      ]
                    )
                  "
                >
                  <el-option
                    v-for="item in ['map', 'viewport']"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-extrusion-translate-anchor"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="渐变填充" name="seven">
              <h3>渐变填充</h3>
              &nbsp;
              <span
                v-if="!menuButtonShowList['fill-extrusion-vertical-gradient']"
                >{{ menuShowList["fill-extrusion-vertical-gradient"] }}</span
              >
              <el-row
                v-if="menuButtonShowList['fill-extrusion-vertical-gradient']"
                style="margin-top: 10px; display: flex"
              >
                <el-switch
                  v-model="
                    layers[nowLayerIndex].paint[
                      'fill-extrusion-vertical-gradient'
                    ]
                  "
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'fill-extrusion-vertical-gradient',
                      layers[nowLayerIndex].paint[
                        'fill-extrusion-vertical-gradient'
                      ]
                    )
                  "
                >
                </el-switch>
              </el-row>
              <el-divider></el-divider>
              <ConditionRender
                :layerSelect="layers[nowLayerIndex]"
                tab="fill-extrusion-vertical-gradient"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>

        <el-tab-pane label="数据设置" name="second">
          <h4>数据源配置</h4>
          <el-form label-position="right" label-width="100px">
            <el-form-item label="数据源">
              <span>{{ layers[nowLayerIndex]["source"] }}</span>
            </el-form-item>
            <el-form-item label="数据源图层">
              <span>{{ layers[nowLayerIndex]["source-layer"] }}</span>
            </el-form-item>
            <el-form-item label="图层名称">
              <span>{{ layers[nowLayerIndex]["originName"] }}</span>
            </el-form-item>
            <el-form-item label="图层类型">
              <el-select
                v-model="layers[nowLayerIndex].type"
                placeholder="请选择图层类型"
                @change="layerTypeChange"
              >
                <el-option
                  v-for="item in [
                    { value: 'circle', label: '圆(circle)' },
                    { value: 'symbol', label: '符号(symbol)' },
                    { value: 'line', label: '线(line)' },
                    { value: 'fill', label: '填充(fill)' },
                    {
                      value: 'fill-extrusion',
                      label: '三维填充(fill-extrusion)',
                    },
                    { value: 'background', label: '背景(background)' },
                  ]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-divider></el-divider>
          <el-row type="flex" justify="space-between" align="middle">
            <h4>过滤条件配置</h4>
            <el-select v-model="filterWay" placeholder="请选择" size="small">
              <el-option
                v-for="item in [
                  { value: 'all', label: '满足所有条件' },
                  { value: 'any', label: '满足任意条件' },
                  { value: 'none', label: '不满足任意条件' },
                ]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-row>
          <br />
          <el-row
            v-for="(item, index) in filterCondition"
            :key="index"
            class="filterBox"
          >
            <el-button
              type="text"
              icon="el-icon-remove-outline"
              @click="filterRemove(index)"
            ></el-button>
            <el-col :span="6">
              <el-select
                :span="2"
                v-model="filterCondition[index]['option']"
                placeholder="请选择"
                size="small"
                @change="filterValueInit(index)"
              >
                <el-option
                  v-for="item in filterOptions"
                  :key="item['column_name']"
                  :label="item['column_name']"
                  :value="item['column_name']"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-select
                v-model="filterCondition[index]['type']"
                placeholder="=="
                size="small"
              >
                <el-option
                  v-for="item in filterTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="10">
              <el-input
                placeholder=""
                v-model="filterCondition[index]['value']"
                size="small"
                clearable
              >
                <template>
                  <i class="el-icon-circle-plus"></i>
                </template>
              </el-input>
            </el-col>
            <el-popover placement="right" width="400" trigger="click">
              <el-button
                size="mini"
                type="primary"
                @click="filterConfirm"
                style="position: absolute; top: 24px; z-index: 100"
                >筛选
              </el-button>
              <el-table
                :data="
                  filterValueSelect.filter(
                    (data) =>
                      !filterSearch ||
                      data[filterOptionSelectList[index]]
                        .toLowerCase()
                        .includes(filterSearch.toLowerCase())
                  )
                "
                @row-click="handleFilter"
                row-key="id"
                :highlight-current-row="true"
                :cell-style="{ textAlign: 'left' }"
                height="300"
              >
                <el-table-column
                  :prop="filterOptionSelectList[index]"
                  align="right"
                >
                </el-table-column>
                <el-table-column align="right">
                  <template slot="header">
                    <el-input
                      v-model="filterSearch"
                      size="mini"
                      placeholder="搜索"
                      prefix-icon="el-icon-search"
                    />
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                small
                @current-change="handleCurrentChangeFilter"
                :current-page="filterSearchPage"
                :page-size="pageSizeFilter"
                layout="total, prev, pager, next"
                :total="totalDataCountFilter"
                class="flexRowCenter"
              >
              </el-pagination>
              <el-button
                type="text"
                icon="el-icon-circle-plus"
                slot="reference"
                @click="handleFilterValue(item, index)"
              ></el-button>
            </el-popover>
          </el-row>
          <el-col v-if="filterCondition.length < 1" class="displayBox"
            >未设置过滤条件</el-col
          >
          <el-button
            type="text"
            icon="el-icon-circle-plus-outline"
            @click="
              filterCondition.push({ options: '', type: '==', value: '' })
            "
            >添加过滤条件</el-button
          >
          <el-divider></el-divider>
          <h4>显示级别配置</h4>
          <el-form label-position="top">
            <el-form-item label="最小级别">
              <el-slider
                :max="layers[nowLayerIndex]['maxzoom']"
                :min="zoomRange[0]"
                v-model="layers[nowLayerIndex]['minzoom']"
                show-input
              >
              </el-slider>
            </el-form-item>
            <el-form-item label="最大级别">
              <el-slider
                :max="zoomRange[1]"
                :min="layers[nowLayerIndex]['minzoom']"
                v-model="layers[nowLayerIndex]['maxzoom']"
                show-input
              >
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
import fileApi from "../api/fileApi";
import layerStyleProperties from "../assets/js/layerStyleProperties";
import initTileJson from "../assets/js/initTileJson";
import layerStyle from "../assets/js/layerStyleProperties";
// import myConfig from "../config";

import Sortable from "sortablejs";
import ConditionRender from "../components/ConditionRender";
// import Datajson from "../assets/js/liberty";
// import Vue from "vue";

var map = null;

export default {
  components: { ConditionRender },
  data() {
    return {
      //添加shp数据时列表
      shpTableData: [],
      multiShpTable: [],
      dataBaseList: [],
      mbTileJsonList: [],
      mbTileSelect: "",     //储存所选mbTile的id数据
      mbTileSelectIndex: 0,   //  记录选择的数据下标
      mbTileJson: {},
      PgBaseSelect: "defaultPG",
      dataBaseSelect: "defaultPG", //用于数据库类型判断(四种)
      currentPageShp: 1,
      pageSizeShp: 5,
      searchInputShp: "",
      totalDataCountShp: 0,
      addSourceShow: true,
      publishLink: "",
      dataLayers: [],
      mutiPgInfo: "",
      mbTileEditShow: false,
      mbTileEditInfo: {mbTilesJsonFile:null,mbTilesJsonName:""},

      //左侧shp图层树
      layersNameObject: {}, //检测重复  后端字段为layerTree
      layersName: [], //加载的图层id集合，用于展示图层按index的排列
      sourceNameObject: {}, //检测source重复

      //mapbox地图
      mapProjectInfo: {},
      mapProjectId: "", //地图项目id
      zoom: 6,
      center: "119,32",
      showCenter: "119,32",
      spritePath: "",
      glyphsPath: "",
      sources: {},
      layers: [],
      nowLayerIndex: 0,

      //图标图层样式
      textField: "",

      //编辑框
      menuButtonShowList: [], //由列表来记录图层编辑框下每个tab的显示情况
      menuShowList: [], //由列表来记录图层编辑框下那个渲染按钮打开
      editorShow: "",
      isSymbol: true,
      nameEdit: false,
      symbolColor: ["#43aaf5", "#838da8"],

      //插值类型
      value: "",
      Rate: "linear",
      Rate1: "linear",
      rateEditShow: false,
      rateContent: {
        linear: "线性：在刚好小于和刚好大于输入的停止点对之间进行线性插值。",
        exponential: "指数：在小于和大于输入的停靠点之间以指数方式插值。",
        "cubic-bezier":
          "贝塞尔曲线：使用由给定控制点定义的三次贝塞尔曲线进行插值。",
      },

      //文字
      fontSearch: "",
      textFieldSearch: "",

      //过滤条件配置
      filterWay: "all",
      filterCondition: [{ option: "", type: "==", value: 0 }],
      filterOptions: [],
      filterOptionSelectList: [],
      filterTypes: [
        { value: "==", label: "==" },
        { value: "!=", label: "!=" },
        { value: ">", label: ">" },
        { value: ">=", label: ">=" },
        { value: "<", label: "<" },
        { value: "<=", label: "<=" },
        { value: "in", label: "in" },
        { value: "!in", label: "!in" },
        { value: "has", label: "has" },
        { value: "!has", label: "!has" },
      ],
      filterValue: [],
      filterValueSelect: [],      //分页信息显示
      // filterValueInput: [""],
      // multipleSelection: [],
      nowFilterIndex: 0,
      filterSearch: "",
      filterSearchPage: 1,
      pageSizeFilter: 10,
      totalDataCountFilter: 0,

      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
      ],

      //图标数据
      symbolTableData: [],
      currentPageSymbol: 1,
      pageSizeSymbol: 5,
      searchInputSymbol: "",
      totalDataCountSymbol: 0,
      fontList: [],
      spriteList: [],
    };
  },
  mounted() {
    this.$bus.$on("show", (data) => {
      //多级渲染显示
      if (data.param4) {
        switch (data.param4) {
          case "zoom":
            this.menuShowList[data.param1] = "Zoom Range";
            break;
          case "data":
            this.menuShowList[data.param1] = "Data Range";
            break;
          case "prop":
            this.menuShowList[data.param1] = "Data Condition";
            break;
          case "formula":
            this.menuShowList[data.param1] = "Expression";
            break;
        }
      }
      //编辑框初始化先获取所有tab的显示情况，单个tab修改时子组件给父组件传递单个tab变化值,params3用于保存attrValueSet
      if (data.param2 === 0) {
        this.menuButtonShowList = data.param1;
        this.layers[this.nowLayerIndex].attrShowList = data.param1;
        this.attrValueSet = data.param3;
      } else {
        const value1 = data.param1;
        const value2 = data.param2;
        this.menuButtonShowList[value1] = value2;
        this.layers[this.nowLayerIndex].attrShowList[value1] = value2;
        if (value2) {
          this.attrValueSet[value1] = "primary";
        }
      }
    });
    this.mapProjectId = this.$route.params.mapProjectId;
    this.getMapProjectInfo();
    this.getDataSourceList();

    //layer拖动排序
    this.initSort();
  },
  beforeDestroy() {
    this.$bus.$off("show");
  },
  methods: {
    change(e) {
      this.fontSearch = "a";
      // this.$forceUpdate()
      console.log("e", e);
    },
    async test() {
      let newTileJson = initTileJson;
      newTileJson.name = "aaa123";
      newTileJson.tiles = [""];

      let res = await this.createTileJson(newTileJson);
      if (res.data.code === 0) {
        return;
      }

      console.log("wait");
      console.log(res);
      console.log("aaaa");
      let sourceId = res.data.data.tileJsonId;
      // let tileJsonUrl = myConfig.requestUrl + "/getTileJson/" + sourceId
      let tileJsonUrl = this.reqUrl + "/getTileJson/" + sourceId;
      console.log("tileJsonUrl: ", tileJsonUrl);
    },

    getMapProjectInfo() {
      requestApi
        .getMapProjectById(this.mapProjectId)
        .then((res) => {
          this.mapProjectInfo = res.data.data;
          console.log("mapProjectInfo:", this.mapProjectInfo);
          this.center = this.mapProjectInfo.center.split(",");
          this.zoom = this.mapProjectInfo.zoom;
          this.spritePath = this.mapProjectInfo.sprite;
          this.glyphsPath = this.mapProjectInfo.glyphs;
          this.sources = this.mapProjectInfo.sources;
          this.layers = this.mapProjectInfo.layers;
          this.layersNameObject = this.mapProjectInfo.layerTree;
          this.createEmptyMap();
          this.initMapWithData();
          for (const i in this.layers) {
            this.layersName.push(this.layers[i].id);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getDataSourceList() {
      requestApi
        .getDataSourceList()
        .then((res) => {
          this.dataBaseList = res.data.data;
          this.dataBaseList.unshift({ dbname: "defaultPG", id: "defaultPG" });
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
      map.on("mousemove", this.layersName, (e) => {
        map.getCanvas().style.cursor = "pointer";

        this.center = String(e.lngLat.lng) + "," + String(e.lngLat.lat);
        this.showCenter =
          String(e.lngLat.lng.toFixed(5)) +
          "," +
          String(e.lngLat.lat.toFixed(5));
      });

      //选中某元素
      // map.on('mouseenter',this.layersName,  function (e) {
      //   map.getCanvas().style.cursor = 'pointer';
      //   // console.log("eeeeeeeeee gid:", e);
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

          container.appendChild(item).className = "item";
          item.appendChild(colorBox).className = "colorBox";
          item.appendChild(item_name).className = "item_name";
          item_name.innerHTML = feature.layer.id;

          var index = this.layersName.indexOf(feature.layer["originName"]);

          //根据index获取相关图层信息
          const color_name = feature.layer.type + "-" + "color";
          colorBox.style.setProperty(
            "background-color",
            this.layers[index].paint[color_name]
          );

          this.addItemEvent(item, feature, index);
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

    saveMap() {
      this.$confirm("是否保存地图?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          for (let i in this.layers) {
            this.layers[i].layout.visibility = this.layers[i].show
              ? "visible"
              : "none";
          }

          this.mapProjectInfo.zoom = this.zoom;
          this.mapProjectInfo.center = this.center;
          this.mapProjectInfo.sprite = this.spritePath;
          this.mapProjectInfo.glyphs = this.glyphsPath;
          this.mapProjectInfo.sources = this.sources;
          // this.mapProjectInfo.layers = {layers: this.layers}
          this.mapProjectInfo.layers = this.layers;
          this.mapProjectInfo.layerTree = this.layersNameObject;
          // this.mapProjectInfo.glyphs = this.reqUrl+"/store/fonts/{fontstack}/{range}.pbf";
          // this.mapProjectInfo.sprite = this.reqUrl+"/store/sprites/mpx_sprite/sprite";

          requestApi
            .updateMapProject(JSON.stringify(this.mapProjectInfo))
            .then(() => {
              this.$message.success("保存成功!");
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message.info("取消保存");
        });
    },
    publish() {
      // this.publishLink = myConfig.requestUrl+'/mapServer/'+this.mapProjectId;
      this.publishLink = this.reqUrl + "/mapServer/" + this.mapProjectId;
    },
    addBackground() {
      const backLayer = {
        id: "背景",
        type: "background",
        paint: {
          "background-color": "rgba(255,255,255,0)",
        },
        layout: {
          visibility: "visible",
        },
        metadata: {
          "mapbox:group": "92ca48f13df25",
        },
      };
      if (
        !Object.prototype.hasOwnProperty.call(
          this.layersNameObject,
          "background"
        )
      ) {
        this.layersNameObject["background"] = 1;
      } else {
        this.layersNameObject["background"] += 1;
        backLayer.id = "背景" + this.layersNameObject;
      }
      this.layers.push(backLayer);
      this.layersName.push(backLayer.id);
      this.addLayerToMap(backLayer);
    },

    //添加数据库相关
    //打开shp选择框
    addShpData() {
      requestApi.getTileJsonList('mbTile')
        .then((res)=>{
          this.mbTileJsonList = res.data.data;
          console.log("mbTileJsonList",this.mbTileJsonList);
          //mbTiles先默认为第一个osm数据
          this.mbTileSelect = this.mbTileJsonList[0].id;
          this.dataLayers = this.mbTileJsonList[0].vector_layers
        })
        .catch((error) => {
          console.log(error);
        })
      
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
    },
    addMbTileData(){
      // 阻止发生默认行为
      let formData = new FormData()
      //input的type为file,输入的文件在files属性里
      let file = this.$refs.mbFile.files[0]
      this.mbTileEditInfo.mbTilesJsonFile = file;
      formData.append('mbTilesJsonFile',file)
      formData.append('mbTilesJsonName',this.mbTileEditInfo.mbTilesJsonName)     
      console.log("表单信息：",this.mbTileEditInfo)
      this.onUpload(formData)  
      this.mbTileEditShow = false;
    },
    // 上传文件
    onUpload (formData) {
        fileApi.postUpload(formData).then(() => {
            this.$message.success("mbTile数据上传成功！")
        }).catch((e) => {
            this.$message.error(e.message)
        })
    }, 
    PgBaseChange(val) {
      //val表示选择的value值
      let index = 0;
      //获取select选择内容的下标
      this.dataBaseList.forEach((e,ind)=>{
        if(e.id == val){
          index = ind;
        }
      })
      //更改pg数据库源，同时修改dataBaseSelect类型
      this.dataBaseSelect = this.PgBaseSelect == 'defaultPG' ? 'defaultPG' : 'multiPG';
      console.log("PgBaseSelect2", this.PgBaseSelect);
      if (this.PgBaseSelect != "defaultPG") {
        this.shpTableData = this.dataBaseList[index].dataInfo;
        this.mutiPgInfo = this.dataBaseList[index]  //用于展示IP、端口信息
      } else {
        this.addShpData();
      }
    },
    mbTileChange(val) {
      let index = 0;
      this.mbTileJsonList.forEach((e,ind)=>{
        if(e.id == val){
          index = ind;
          this.mbTileSelectIndex = ind;
        }
      })
      //更改pg数据库源，同时修改dataBaseSelect类型
      this.mbTileJson = this.mbTileJsonList[index]
      this.dataLayers = this.mbTileJson.vector_layers

    },    
    dataBaseClick(tab) {
      this.dataBaseSelect = tab.name == 'PG' ? 'defaultPG' : tab.name;
      console.log("dataBaseSelect", this.dataBaseSelect);
    },

    handleCurrentChangeShp(val) {
      this.currentPageShp = val;
      if (this.PgBaseSelect != "defaultPG") {
        this.PgBaseChange();
      } else {
        this.addShpData();
      }
    },

    initSort() {
      const tbody = this.$refs.shpLayerTable.$el.querySelectorAll(
        ".el-table__body-wrapper > table > tbody"
      )[0];
      const _this = this;
      Sortable.create(tbody, {
        draggable: ".el-table__row",
        animation: 150,
        onEnd({ newIndex, oldIndex }) {
          _this.handleCloseEditBoard();
          const currRow = _this.layers.splice(oldIndex, 1)[0];
          _this.layers.splice(newIndex, 0, currRow);
          _this.handleShowSortChange(newIndex);
        },
      });
    },

    handleShowSortChange(newIndex) {
      let aimLayer = this.layers[newIndex];
      this.handleRemoveLayer(aimLayer.id);
      if (newIndex === 0) {
        map.addLayer(aimLayer);
      } else {
        map.addLayer(aimLayer, this.layers[newIndex - 1].id);
      }
      const stylejson2 = map.getStyle();
      console.log("stylejson2", stylejson2);
      //更改顺序后更新
      for (const i in this.layers) {
        this.layersName[i] = this.layers[i].id;
      }
    },

    //向shp树添加shp,即source,同时添加shplayer
    // async handleAddShpLayer(index, row) {
    //   console.log("add shp row: ", row);
    //   //旧source写法
    //   // let newSource = {
    //   //   sourceName: row.tableName,
    //   //   sourceType: "vector",
    //   //   sourceTiles: [this.reqUrl+"/mvt/" + row.tableName + "/{z}/{x}/{y}.pbf"],
    //   // }
    //   // if (!Object.prototype.hasOwnProperty.call(this.sources, newSource.sourceName)) {
    //   //   this.sources[newSource.sourceName] = {
    //   //     type: newSource.sourceType,
    //   //     tiles: newSource.sourceTiles,
    //   //   }
    //   //   this.addSourceToMap(newSource)
    //   // }

    //   //如果没有添加过source则添加
    //   if (
    //     !Object.prototype.hasOwnProperty.call(
    //       this.sourceNameObject,
    //       row.tableName
    //     )
    //   ) {
    //     let newTileJson = initTileJson;
    //     newTileJson.name = row.tableName;
    //     // if(this.PgBaseSelect == 'defaultPG'){
    //     //   newTileJson.tiles = [myConfig.requestUrl + "/mvt/" + row.tableName + "/{z}/{x}/{y}.pbf"]
    //     // }else{
    //     //   newTileJson.tiles = ["/MultiSource/" + myConfig.requestUrl + "//" + row.tableName + "/{z}/{x}/{y}.pbf"]
    //     // }
    //     if (this.dataBaseSelect == "mbTile") {
    //       newTileJson.tiles = [
    //         "https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=XAapkmkXQpx839NCfnxD",
    //       ];
    //     } else if (this.PgBaseSelect == "defaultPG") {
    //       newTileJson.tiles = [
    //         this.reqUrl + "/mvt/" + row.tableName + "/{z}/{x}/{y}.pbf",
    //       ];
    //     } else {
    //       newTileJson.tiles = [
    //         "/MultiSource/" +
    //           this.reqUrl +
    //           "//" +
    //           row.tableName +
    //           "/{z}/{x}/{y}.pbf",
    //       ];
    //     }
    //     if (this.dataBaseSelect == "mbTile") {
    //       newTileJson.vector_layers = this.dataLayers;
    //     } else {
    //       let vector_layer = {
    //         description: "",
    //         fields: row.attrInfo,
    //         id: row.tableName,
    //       };
    //       newTileJson.vector_layers = [vector_layer];
    //     }

    //     let res = await this.createTileJson(newTileJson);
    //     if (res.data.code !== 0) {
    //       console.log("添加source失败");
    //       return;
    //     }
    //     let sourceId = res.data.data.tileJsonId;

    //     // let tileJsonUrl = myConfig.requestUrl + "/getTileJson/" + sourceId + ".json"
    //     let tileJsonUrl = this.reqUrl + "/getTileJson/" + sourceId + ".json";
    //     let newSourceJson = {
    //       sourceName: sourceId,
    //       sourceType: "vector",
    //       sourceUrl: tileJsonUrl,
    //     };
    //     this.addSourceToMap(newSourceJson);
    //     this.sources[newSourceJson.sourceName] = {
    //       type: newSourceJson.sourceType,
    //       url: newSourceJson.sourceUrl,
    //     };
    //     if (this.dataBaseSelect == "mbTile") {
    //       this.sourceNameObject[this.dataLayers.id] = sourceId;
    //     } else {
    //       this.sourceNameObject[row.tableName] = sourceId;
    //     }
    //   }

    //   let geoType = row.geoType;
    //   if (row.geoType.indexOf("LINE") !== -1) {
    //     geoType = "line";
    //   } else if (row.geoType.indexOf("POLYGON") !== -1) {
    //     geoType = "fill";
    //   } else {
    //     geoType = "circle";
    //   }

    //   //前八个是自己用的属性
    //   let newLayer = {
    //     index: index,
    //     sourceType: "mbTile",     //记录数据来源类型，用于区别mbTlie的添加和删除
    //     show: true,
    //     originName: row.originName,
    //     shpAttribute: row.attrInfo,
    //     attrValueSet: {},
    //     attrShowList: {},
    //     filterValueSet: {},
    //     id: row.originName,
    //     type: geoType,
    //     filter: ["all"],
    //     layout: layerStyleProperties[geoType].layout,
    //     maxzoom: 22,
    //     metadata: "",
    //     minzoom: 0,
    //     paint: layerStyleProperties[geoType].paint,
    //     source: this.sourceNameObject[row.tableName], //通过记录的source名字与id对应，拿到sourceId
    //     // "source-layer": "default"
    //     "source-layer": row.tableName,
    //     // "source-layer":"my22"
    //   };

    //   if (geoType !== "symbol") {
    //     newLayer.paint[geoType + "-color"] =
    //       "#" + Math.random().toString(16).substr(2, 6);
    //   }

    //   if (
    //     !Object.prototype.hasOwnProperty.call(
    //       this.layersNameObject,
    //       newLayer.originName
    //     )
    //   ) {
    //     this.layersNameObject[newLayer.originName] = 1;
    //   } else {
    //     this.layersNameObject[newLayer.originName] += 1;
    //     newLayer.id =
    //       row.originName + this.layersNameObject[newLayer.originName];
    //   }
    //   this.layers.unshift(newLayer);
    //   this.layersName.unshift(newLayer.id);
    //   this.addLayerToMap(newLayer);
    // },
    async handleAddShpLayer(index, row) {
      console.log("add shp row: ", row);
      //分类型进行创建shp的json入库并返回对应id
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
        case "mbTile":
          this.addMbTileShp(index, row);
          break;
      }
    },
    async addPgDefaultShp(index, row) {
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
          this.addSourceToMap(newSourceJson);
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
        sourceType: "pgDefault",     //记录数据来源类型，用于区别mbTlie的添加和删除
        show: true,
        originName: row.originName,
        shpAttribute: row.attrInfo,
        attrValueSet: {},
        attrShowList: {},
        filterValueSet: {},
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
        "source-layer": row.tableName,
        // "source-layer":"my22"
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
      }
      this.layers.unshift(newLayer);
      this.layersName.unshift(newLayer.id);
      this.addLayerToMap(newLayer);      
    },
    async addPgMultiShp(index, row) {
      //判断该shp是否已添加
      if (
        !Object.prototype.hasOwnProperty.call(
          this.sourceNameObject,
          row.id
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
          this.addSourceToMap(newSourceJson);
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
      console.log("originname:",row.originName)
      //前九个是自己用的属性
      let newLayer = {
        index: index,
        sourceType: "pgMulti",     //记录数据来源类型，用于区别mbTlie的添加和删除
        show: true,
        originName: row.originName,
        shpAttribute: row.attrInfo,
        mutiPgInfo: this.mutiPgInfo,    //用来记录多源pg信息
        attrValueSet: {},
        attrShowList: {},
        filterValueSet: {},
        id: row.originName,
        type: geoType,
        filter: ["all"],
        layout: layerStyleProperties[geoType].layout,
        maxzoom: 22,
        metadata: "",
        minzoom: 0,
        paint: layerStyleProperties[geoType].paint,
        source: this.sourceNameObject[row.id],      //添加的sourceId
        // "source-layer": "default"
        "source-layer": row.originName,
        // "source-layer":"my22"
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
      }
      this.layers.unshift(newLayer);
      this.layersName.unshift(newLayer.id);
      this.addLayerToMap(newLayer);      
    },    
    async addMbTileShp(index,row){
      let name = this.mbTileJsonList[this.mbTileSelectIndex].name
      //判断该shp是否已添加
      if (
        !Object.prototype.hasOwnProperty.call(
          this.sourceNameObject,
          name    //mbtile的souce都是一个,用该json的名字来统计记录
        )
      ) {      
          //添加mbTile的shp图层时，相关json已经入库
          let sourceId = this.mbTileSelect;
          let tileJsonUrl = this.reqUrl + "/getTileJson/" + sourceId + ".json";
          let newSourceJson = {
            sourceName: sourceId,
            sourceType: "vector",
            sourceUrl: tileJsonUrl,
          };
          this.addSourceToMap(newSourceJson);
          this.sources[newSourceJson.sourceName] = {
            type: newSourceJson.sourceType,
            url: newSourceJson.sourceUrl,
          };
          //记录shp图层和对应的id
          this.sourceNameObject[name] = sourceId;  
      }    
      //添加layer
      // let newLayerout = layerStyleProperties[row.type].layout;
      // if('layout' in row){
      //   for(let key in row.layout){
      //     newLayerout[key] = row.layout[key]
      //   }
      // }
      // let newPaint = layerStyleProperties[row.type].paint;
      // if('paint' in row){
      //   for(let key in row.paint){
      //     newPaint[key] = row.paint[key]
      //   }
      // }

      //前八个是自己用的属性
      let geoType = "circle"
      let newLayer = {
        index: index,
        sourceType: "mbTile",     //记录数据来源类型，用于区别mbTlie的添加和删除
        show: true,
        originName: row.id,
        shpAttribute: row.attrInfo,
        attrValueSet: {},
        attrShowList: {},
        filterValueSet: {},
        id: row.id,
        type: geoType,
        filter: ["all"],
        layout: layerStyleProperties[geoType].layout,
        maxzoom: 22,
        metadata: "",
        minzoom: 0,
        paint: layerStyleProperties[geoType].paint,
        source: this.sourceNameObject[name], //通过记录的source名字与id对应，拿到sourceId
        // "source-layer": "default"
        "source-layer": row.id,
        // "source-layer":"my22"
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
          row.id + this.layersNameObject[newLayer.originName];
      }
      this.layers.unshift(newLayer);
      this.layersName.unshift(newLayer.id);
      this.addLayerToMap(newLayer);          
    },

    //生成tilejson和mbTileJson
    async createTileJson(initTileJson) {
      let data = "";
      if(this.dataBaseSelect != "mbTile"){
        data = await requestApi.createTileJson(initTileJson);
      }else{
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
    addSourceToMap(newSource) {
      console.log("add new source：", newSource);

      //旧写法
      // map.addSource(newSource.sourceName, {
      //   type: newSource.sourceType,
      //   tiles: newSource.sourceTiles,
      // })

      //tileJson写法
      map.addSource(newSource.sourceName, {
        type: newSource.sourceType,
        url: newSource.sourceUrl,
      });
    },

    //向地图添加layer
    addLayerToMap(newLayer) {
      console.log("add new layer：", newLayer);
      map.addLayer(newLayer);
    },

    loadAndAddImg(imgUrl, imgName) {
      map.loadImage(imgUrl, (error, image) => {
        if (error) throw error;
        map.addImage(imgName, image);
      });
    },

    //设置对地图进行筛选
    setFilterToMap(id, filter) {
      console.log("set filters：", id, filter);
      map.setFilter(id, filter);
    },

    handleLayerEdit(index, row) {
      console.log("now edit layer: index, row", index, row);
      this.nowLayerIndex = index;
      this.zoomRange = [
        this.layers[this.nowLayerIndex].minzoom,
        this.layers[this.nowLayerIndex].maxzoom,
      ];
      //先关闭，否则组件不会初始化
      this.editorShow = "";
      //设置属性编辑界面的展示情况
      this.menuButtonShowList = this.layers[this.nowLayerIndex].attrShowList;
      this.menuShowList = JSON.parse(JSON.stringify(this.menuButtonShowList));
      //短时间vue会集中处理，因此要等编辑框关闭，dom渲染完再处理
      this.$nextTick(() => {
        if (row.type === "line") {
          this.editorShow = "lineEditorShow";
        } else if (row.type === "fill") {
          this.editorShow = "fillEditorShow";
        } else if (row.type === "circle") {
          this.editorShow = "circleEditorShow";
        } else if (row.type === "fill-extrusion") {
          this.editorShow = "fillExtrusionEditorShow";
          console.log("显示:fill-extrusion", this.editorShow);
        } else {
          this.editorShow = "symbolEditorShow";
          this.getSymbolList();
          this.getFontList();
        }
        this.menuButtonShowList = [];
      });
      this.filterOptions = this.layers[this.nowLayerIndex]["shpAttribute"];
    },

    handleCloseEditBoard() {
      this.editorShow = "";
    },

    handleLayerDelete(index, row) {
      console.log("ready delete layer:", row);
      this.editorShow = "";
      let aimSource = row.source;
      let layerOriginName = row.originName;
      let layerid = row.id;
      this.layers.splice(index, 1);
      this.layersName.splice(index, 1);
      this.layersNameObject[layerOriginName] -= 1;
      this.handleRemoveLayer(layerid);

      //mbTile不删除source
      if(row.sourceType != "mbTile"){
        //如果没有layer使用source，则删除source
        if (this.layersNameObject[layerOriginName] === 0) {
          delete this.layersNameObject[layerOriginName];
          this.handleRemoveSource(aimSource);
          delete this.sources[aimSource];
          for (let key in this.sourceNameObject) {
            if (this.sourceNameObject[key] === aimSource) {
              delete this.sourceNameObject[key];
              break;
            }
          }
          //source没有再使用时,删除后台的tileJson
          this.deleteTileJson(row.source);
        }
      }
    },

    layerTypeChange(val) {
      //先改参数再更新图层，打开图层编辑框
      console.log("change layer type to", val);
      let aimLayer = this.layers[this.nowLayerIndex];
      aimLayer.paint = layerStyle[val].paint;
      // aimLayer.paint = {};
      aimLayer.layout = layerStyle[val].layout;
      // aimLayer.layout = {
      //   "icon-image": "cat",
      //   "icon-size": 0.25,
      // };
      console.log("layer", aimLayer);
      this.handleRemoveLayer(aimLayer.id);
      if (this.nowLayerIndex === 0) {
        this.addLayerToMap(aimLayer);
      } else {
        map.addLayer(aimLayer, this.layers[this.nowLayerIndex - 1].id);
      }
      this.handleLayerEdit(this.nowLayerIndex, aimLayer);
    },

    //图标图层相关
    getSymbolList() {
      requestApi
        .getSymbolList({
          asc: false,
          page: this.currentPageSymbol,
          pageSize: this.pageSizeSymbol,
          searchText: this.searchInputSymbol,
          sortField: "createTime",
        })
        .then((res) => {
          console.log("SymbolList:", res.data);
          this.symbolTableData = res.data.data.content;
          this.totalDataCountSymbol = res.data.data.totalElements;
        })
        .catch((error) => {
          console.log(error);
        });
      this.spriteList = map.listImages();
      // 将固定的数据用于组件访问
      localStorage.setItem("spriteList", JSON.stringify(this.spriteList));
      localStorage.setItem(
        "symbolTableData",
        JSON.stringify(this.symbolTableData)
      );
    },
    getFontList() {
      requestApi
        .getFontList()
        .then((res) => {
          for (let i in res.data.data) {
            this.fontList.push({
              name: res.data.data[i],
              type: "offline",
            });
          }
          console.log("fontList", this.fontList);
          localStorage.setItem("fontList", JSON.stringify(this.fontList));
        })
        .catch((error) => {
          console.log(error);
        });
    },
    iconSelect(item) {
      this.layers[this.nowLayerIndex].layout["icon-image"] = item.originName;
      this.$refs.iconPopover.doClose();

      this.loadAndAddImg(
        this.reqUrl + "/symbol/getSymbolById/" + item.id,
        item.originName
      );
      this.handleLayoutChange(
        this.layers[this.nowLayerIndex]["id"],
        "icon-image",
        this.layers[this.nowLayerIndex].layout["icon-image"]
      );
    },
    spriteSelect(item) {
      console.log("spriteclick");
      this.layers[this.nowLayerIndex].layout["icon-image"] = item;
      this.$refs.iconPopover.doClose();
      this.handleLayoutChange(
        this.layers[this.nowLayerIndex]["id"],
        "icon-image",
        this.layers[this.nowLayerIndex].layout["icon-image"]
      );
    },
    symbolChange(val) {
      if (val == "icon") {
        this.symbolColor = ["#43aaf5", "#838da8"];
        this.isSymbol = true;
      } else {
        this.symbolColor = ["#838da8", "#43aaf5"];
        this.isSymbol = false;
      }
    },
    fieldSelect(row) {
      this.textField = row.column_name;
      this.$refs.fieldPopover.doClose();
      // const tem = [
      //   "format",
      //   ["get", "gid"],
      //   {
      //     "text-font": ["literal", ["Open Sans Regular"]],
      //     "text-color": "#FF0000",
      //     "font-scale": 0.8,
      //   },
      // // ];
      // this.layers[this.nowLayerIndex].layout["text-field"] = tem;
      // this.handleLayoutChange(
      //   this.layers[this.nowLayerIndex]["id"],
      //   "text-field",
      //   tem
      // );
      this.layers[this.nowLayerIndex].layout["text-field"] = [
        "get",
        this.textField,
      ];
      this.handleLayoutChange(
        this.layers[this.nowLayerIndex]["id"],
        "text-field",
        ["get", this.textField]
      );
      console.log(
        "text-field",
        this.layers[this.nowLayerIndex].layout["text-field"]
      );
    },
    fontSelect(row) {
      this.layers[this.nowLayerIndex].layout["text-font"][0] = row.name;
      this.$refs.fontPopover.doClose();
      this.handleLayoutChange(
        this.layers[this.nowLayerIndex]["id"],
        "text-font",
        this.layers[this.nowLayerIndex].layout["text-font"]
      );
    },

    handleCurrentChangeSymbol(val) {
      this.currentPageSymbol = val;
      this.getSymbolList();
    },

    handleLayerClick() {
      console.log("layers:", this.layers);
      const source = map.getSource(this.layers[this.nowLayerIndex]["source"]);
      console.log("source:", source);
      const style = map.getStyle();
      console.log("style:", style);

      // map.flyTo({
      //   center: [113.32948058466824, 23.19862318628209],
      // });
    },

    handleLayerShowSwitchChange(val, row) {
      if (val) {
        this.handleLayoutChange(row.id, "visibility", "visible");
      } else {
        this.handleLayoutChange(row.id, "visibility", "none");
      }
    },

    handleRemoveSource(sourceName) {
      map.removeSource(sourceName);
    },

    handleRemoveLayer(layerName) {
      map.removeLayer(layerName);
    },

    handleLayoutChange(layerName, key, value) {
      console.log("layout:", layerName, key, value);
      map.setLayoutProperty(layerName, key, value);
    },

    handlePaintChange(layerName, key, value) {
      console.log("paint:", layerName, key, value);
      map.setPaintProperty(layerName, key, value);
    },
    //为item添加同handleLayerEdit相同的方法
    addItemEvent(item, feature, index) {
      //因为item是html元素，在其事件中this指向该元素无法获取vue的实例属性和方法
      let _this = this;
      item.onclick = function test() {
        _this.editorShow = "";
        _this.$nextTick(() => {
          _this.nowLayerIndex = index;
          _this.zoomRange = [
            _this.layers[index].minzoom,
            _this.layers[index].maxzoom,
          ];
          if (feature.layer.type === "line") {
            _this.editorShow = "lineEditorShow";
          } else if (feature.layer.type === "fill") {
            _this.editorShow = "fillEditorShow";
          } else if (feature.layer.type === "circle") {
            _this.editorShow = "circleEditorShow";
          } else if (feature.layer.type === "fill-extrusion") {
            _this.editorShow = "fillExtrusionEditorShow";
          } else {
            _this.editorShow = "symbolEditorShow";
            _this.getSymbolList();
          }
          _this.menuButtonShowList = [];
        });
      };
    },

    filterValueInit(index) {
      //更新筛选条件的列表
      this.filterOptionSelectList.splice(
        index,
        0,
        this.filterCondition[index].option
      );
      requestApi
        .getAttrValue({
          aimAttrName: this.filterCondition[this.nowFilterIndex].option,
          aimShpTableName: this.layers[this.nowLayerIndex]["source-layer"],
          page: this.filterSearchPage,
          pageSize: 10,
          searchText: this.filterSearch,
          sort: "asc",
        })
        .then((res) => {
          console.log("filterlist", res);
          this.filterValue.splice(
            [this.nowFilterIndex],
            0,
            res.data.data.attrValue
          );
          this.filterValueSelect = this.filterValue[this.nowFilterIndex];
          this.totalDataCountFilter = res.data.data.featureCount;
          console.log("filterValue", this.filterValue);
          console.log("filtertotal", this.totalDataCountFilter);
          console.log("filterValueSelect", this.filterValueSelect);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    handleCurrentChangeFilter(val) {
      this.filterSearchPage = val;
      requestApi
        .getAttrValue({
          aimAttrName: this.filterCondition[this.nowFilterIndex].option,
          aimShpTableName: this.layers[this.nowLayerIndex]["source-layer"],
          page: this.filterSearchPage,
          pageSize: 10,
          searchText: this.filterSearch,
          sort: "asc",
        })
        .then((res) => {
          console.log("res", res);
          this.filterValueSelect = res.data.data.attrValue;
          this.totalDataCountFilter = res.data.data.featureCount;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //添加筛选框用户输入的value
    handleFilterValue(item, index) {
      console.log("filter", index, item);
      this.nowFilterIndex = index;
      //filterValueInput第一个绑定input内容，后面依次记录每次内容
      // this.filterValueInput[0] != "" &&
      //   this.filterValueInput.push(this.filterValueInput[0]);
      // this.filterValueInput[0] != "" &&
      //   this.filterValueSelect.push({ value: this.filterValueInput[0] });
      // console.log("item", item, index);
    },
    //更新用户选中的筛选信息
    // handleSelectionChange(val) {
    //   console.log(val);
    //   this.multipleSelection = val;
    //   console.log("this.filterValueSelect:", this.filterValueSelect);
    //   this.update();
    //   console.log('this.multipleSelection:',this.multipleSelection);
    // },
    // update() {
    ////   this.filterValueSelect = [];
    //   for (const i in this.filterValueInput) {
    //     i != 0 &&
    //       this.filterValueSelect.push({ value: this.filterValueInput[i] });
    //   }
    //   for (const i in this.multipleSelection) {
    //     this.filterValueSelect.push(this.multipleSelection[i]);
    //   }
    // },
    // handleTagClose(tag) {
    //   this.filterValueSelect.splice(this.filterValueSelect.indexOf(tag), 1);
    //   this.filterValueInput = "";"get","gid"
    //   console.log("tag", tag);
    // },
    filterRemove(index) {
      this.filterCondition.splice(index, 1);
      if (this.filterCondition.length < 1) {
        const id = this.layers[this.nowLayerIndex].id;
        this.setFilterToMap(id, null);
      }
    },
    handleFilter(row) {
      this.filterCondition[this.nowFilterIndex].value =
        row[this.filterOptionSelectList[this.nowFilterIndex]];
    },
    filterConfirm() {
      console.log("筛选条件：", this.filterCondition);
      console.log("筛选条件1：", this.filterWay);
      let judge = this.filterWay;
      const filters = [judge];
      for (let i = 0; i < this.filterCondition.length; i++) {
        const filter = [];
        filter.push(this.filterCondition[i].type);
        filter.push(["get", this.filterCondition[i].option]);
        filter.push(this.filterCondition[i].value);
        if (judge == "none") {
          filters.push(!filter);
        } else {
          filters.push(filter);
        }
      }
      const id = this.layers[this.nowLayerIndex].id;
      console.log("condition", id, filters);
      this.setFilterToMap(id, filters);
      this.layers[this.nowLayerIndex].filterValueSet = {
        filterCondition: this.filterCondition,
        filterValue: this.filterValue,
        filterOptionSelectList: this.filterOptionSelectList,
        filterValueSelect: this.filterValueSelect,
      };
    },
    callback(layoutOrpaint, attribute, value, parameters) {
      console.log("layoutOrpaint1:", layoutOrpaint);
      console.log("attribute1:", attribute);
      console.log("value1:", value);
      this.layers[this.nowLayerIndex][layoutOrpaint][attribute] = value;
      const id = this.layers[this.nowLayerIndex]["id"];
      layoutOrpaint == "layout" &&
        this.handleLayoutChange(id, attribute, value);
      layoutOrpaint == "paint" && this.handlePaintChange(id, attribute, value);
      this.attrValueSet[attribute] = parameters;
      console.log("parameters1:", this.attrValueSet[attribute]);
    },
    leaveTab(activeName, oldActiveName) {
      console.log("activeName", activeName, this.menuButtonShowList);
      console.log("oldActiveName", oldActiveName, this.menuButtonShowList);
    },
    test1() {
      // var data = {
      //     "geometry": {
      //         "type": "Point",
      //         "coordinates": [113.32948058466824,23.19862318628209]
      //     },
      //     "type": "Feature",
      //     "properties": {
      //         "col1": "学史可以看成败、鉴得失、知兴替；",
      //         "col2": "学诗可以情飞扬、志高昂、人灵秀；",
      //         "col3": "学伦理可以知廉耻、懂荣辱、辨是非。",
      //     }
      // }
      // map.addSource('test_source', {
      //     type: "geojson",
      //     data: data
      // });
      // map.addLayer({
      //     "id": 'test_layer',
      //     "type": "symbol",
      //     "minzoom": 0,
      //     "maxzoom": 22,
      //     "source": 'test_source',
      //     "layout": {
      //         "text-field": ["format", ["get", "col1"], {
      //             "text-font": ["literal", ["Open Sans Regular"]],
      //             "text-color": '#FF0000',
      //             "font-scale": 0.8
      //         },
      //         "\n", {},
      //         ["get", "col2"], {
      //             "text-font": ["literal", ["DIN Offc Pro Italic"]],
      //             "text-color": '#000000',
      //             "font-scale": 0.8
      //         },
      //         "\n", {},
      //         ["get", "col3"], {
      //             "text-font": ["literal", ["Arial Unicode MS Regular"]],
      //             "text-color": '#0000FF',
      //             "font-scale": 0.8
      //         }],
      //         "text-size": 16,
      //         "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
      //         "text-offset": [0, 0],
      //         "text-anchor": "left",
      //         "text-justify": "left",
      //         "text-max-width": 20,
      //         "text-allow-overlap": false,
      //     }
      // });
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
h3 {
  margin: 0;
  display: inline-block;
}
h4 {
  margin: 5px 0;
  white-space: nowrap;
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

.el-icon-close.close-button {
  font-size: 22px;
  position: absolute;
  right: 10px;
  height: 40px;
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
.editBoardTitle div {
  display: inline-block;
  width: 120px;
  height: 40px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.editBoardTitle .el-icon-edit {
  display: none;
}
.editBoardTitle:hover .el-icon-edit {
  display: block;
  cursor: pointer;
}
.editBoardTitle:hover div {
  cursor: pointer;
  color: #75b9ff;
}

.close-button:hover {
  cursor: pointer;
  color: Red;
}
/* 编辑框导航条tabs */
.editBoard .el-tabs__header.is-top {
  background-color: rgb(255, 255, 255);
  width: 300px;
  margin: 0;
  border-left: 1px solid #e4e7ed;
  border-right: 1px solid #e4e7ed;
  padding-right: 50px;
  justify-content: right;
  display: flex;
}
.el-tabs__item {
  padding: 0 10px;
}

.editBoard .el-tabs__header.is-top .el-tabs__nav-wrap.is-top {
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
/* 删除导航条前后箭头 */
.editBoard
  .el-tabs__header.is-left
  .el-tabs__nav-wrap.is-scrollable.is-left
  .el-tabs__nav-prev,
.editBoard
  .el-tabs__header.is-left
  .el-tabs__nav-wrap.is-scrollable.is-left
  .el-tabs__nav-next {
  display: none;
}
.editBoard .el-tabs__header.is-left .el-tabs__nav-wrap.is-scrollable.is-left {
  padding: 0px;
}
/* 样式设置tab内容框样式 */
.editBoard .el-tabs--border-card > .el-tabs__content {
  /* margin: 5px 10px 0px 0px; */
  width: 209px;
  height: calc(100vh - 82px);
  overflow-y: scroll;
}
/* 图标编辑框导航条 */
.symbolSort {
  position: absolute;
  display: flex;
  width: 100px;
  height: 40px;
  left: 0px;
  border: 1px solid #d1dbe5;
  justify-content: space-around;
  align-items: center;
  z-index: 10000;
}
.symbolSort span {
  font-size: 14px;
}
.symbolSort span:hover {
  cursor: pointer;
}
.symbolBox .el-tabs__nav-scroll {
  margin-top: 40px;
  overflow: scroll;
  height: calc(100vh - 42px - 40px);
}
/* 数据设置tabs内容框样式 */
.editBoard
  .el-tabs.el-tabs--top
  > .el-tabs__content
  > .el-tab-pane:nth-child(2) {
  width: 310px;
  height: calc(100vh - 81px);
  background-color: white;
  padding: 20px;
  border: 1px solid #e4e7ed;
  overflow-y: scroll;
}
/* 隐藏样式和数据设置的滚动条 */
.symbolBox .el-tabs__nav-scroll::-webkit-scrollbar,
.editBoard
  .el-tabs.el-tabs--top
  > .el-tabs__content
  > .el-tab-pane:nth-child(2)::-webkit-scrollbar,
.editBoard .el-tabs--border-card > .el-tabs__content::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
/* 属性框样式 */
.tableCondition .el-table__body-wrapper.is-scrolling-none:hover {
  cursor: pointer;
  background-color: #f5f7fa;
}
/* 数据源配置form */
.editBoard .el-form.el-form--label-right > .el-form-item {
  margin: 0;
}
.editBoard
  .el-form.el-form--label-right
  > .el-form-item
  .el-form-item__content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.editBoard .el-divider--horizontal {
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

.displayBox {
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
.container {
  width: 150px;
  /* height: 30px; */
}
.item {
  color: black;
  border-radius: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item:hover {
  color: #4264fb;
  background-color: #e0e7eb;
  cursor: pointer;
}
.colorBox {
  width: 18px;
  height: 18px;
  /* background-color: red; */
  float: left;
  display: inline-block;
  border-radius: 5px;
  margin: 1px;
}
.item_name {
  margin-left: 30px;
}
/* 未设置过滤条件框样式 */
.displayBox {
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
.filterBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 图标图层 */
/* 图标框 */
.spriteImage {
  flex: 1;
  height: 120px;
  margin: 0 5px 5px 0;
  background-color: #999;
  width: calc((100% - 20px) / 3);
  min-width: calc((100% - 20px) / 3);
  max-width: calc((100% - 20px) / 3);
}
.spriteImage:nth-child(3n) {
  margin-right: 0;
}

/* 鼠标hover变为指状 */
.cursor:hover {
  cursor: pointer;
}
</style>
