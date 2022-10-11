<template>
  <div class="Container">
    <div id="features"></div>
    <!-- 右上角zoom坐标显示 -->
    <el-tag class="mapZoomLngLat" type="info">
      Zoom:{{ zoom }} &nbsp; LngLat:{{ showCenter }}
    </el-tag>
    <!-- 左部菜单栏 -->
    <div class="leftBar">
      <div class="leftBarTitle">
        <h2>{{ mapProjectInfo.name }}</h2>
        <!-- <h3 style="margin: 1.2rem 0;height:400px">编辑区</h3> -->
        <el-divider class="divider"></el-divider>
      </div>
      <div class="flexRowSpaceAround" style="width: 100%">
        <!--        打开shp选择框，添加shplayer数据-->
        <div>
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
                      v-for="item in pgShpList"
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
                      <!-- <el-button type="primary" @click="addAllStyles(styleLayers)"
                        >确 定</el-button
                      > -->
                    </span>
                  </el-dialog>
                  <!-- 该功能移到数据服务 -->
                  <!-- <el-button
                    type="success"
                    size="mini"
                    circle 
                    icon="el-icon-plus"
                    @click="mbTileEditShow = true"
                  ></el-button>                    
                  <el-dialog
                    title="mbTile信息编辑"
                    :visible.sync="mbTileEditShow"
                    width="30%"
                    :modal="false"
                    center
                  >
                    <el-form
                      label-position="left"
                      label-width="100px"
                      :model="mbTileEditInfo"
                      id="myForm"
                      enctype="multipart/form-data"
                      name="fileinfo"
                      action=""
                      target="uploadFrame"
                    >
                      <el-form-item
                        label="文件:"
                        :rules="{
                          required: true,
                          message: '请选择文件',
                          trigger: 'blur',
                        }"
                      >
                        <input type="file" ref="mbFile" />
                      </el-form-item>
                    </el-form>
                    <iframe
                      id="uploadFrame"
                      name="uploadFrame"
                      style="display: none"
                    ></iframe>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="mbTileEditShow = false"
                        >取 消</el-button
                      >
                      <el-button type="primary" @click="addMbTileData"
                        >确 定</el-button
                      >
                    </span>
                  </el-dialog> -->
                </el-row>
                <!-- <el-button type="primary" @click="test1(true)">test1</el-button>
                <el-button type="primary" @click="test1(false)">test2</el-button> -->
                <!-- <br />
                <el-row type="flex" align="middle">
                  <h4>特定样式:&nbsp;</h4>
                  <el-select
                    v-model="mbTileStyleSelect"
                    placeholder="请选择"
                    :disabled="!isStyle"
                    style="width: 73%"
                    @change="mbTileStyleChange($event)"
                  >
                    <el-option
                      v-for="item in mbTileStyleList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option> </el-select
                  >&nbsp;
                  <el-switch
                    v-model="isStyle"
                    @change="useMbtileStyle($event)"
                  >
                  </el-switch>&nbsp;                  
                  <el-button
                    type="success"
                    size="mini"
                    circle
                    icon="el-icon-plus"
                    @click="mbTileStyleEditShow = true"
                  ></el-button>
                  <el-dialog
                    title="mbTile地图样式信息添加"
                    :visible.sync="mbTileStyleEditShow"
                    width="30%"
                    :modal="false"
                    center
                  >
                    <el-form
                      label-position="left"
                      label-width="100px"
                      :model="mbTileStyleInfo"
                      id="myForm"
                      enctype="multipart/form-data"
                      name="fileinfo"
                      action=""
                      target="uploadFrame"
                    >
                      <el-form-item
                        label="文件:"
                        :rules="{
                          required: true,
                          message: '请选择文件',
                          trigger: 'blur',
                        }"
                      >
                        <input type="file" ref="mbStyleFile" />
                      </el-form-item>
                    </el-form>
                    <iframe
                      id="uploadFrame"
                      name="uploadFrame"
                      style="display: none"
                    ></iframe>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="mbTileStyleEditShow = false"
                        >取 消</el-button
                      >
                      <el-button type="primary" @click="addMbStyleData"
                        >确 定</el-button
                      >
                    </span>
                  </el-dialog>                  
                </el-row> -->
                <!-- dataLayer -->
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
                        <!-- <i slot="reference" class="el-icon-refresh-left iconBtn" title="返回原样式"></i> -->

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
                <!-- styleLayer -->
                <!-- <el-table v-if="isStyle" :data="styleLayers.filter(data => (layerType.indexOf(data['type']) > 0))" height="313">
                  <el-table-column
                    property="id"
                    width="200"
                    show-overflow-tooltip
                    label="style"
                  ></el-table-column>
                  <el-table-column width="100">
                    <template slot="header">
                      <el-popconfirm
                        title="确定添加全部图层样式吗？"
                        @confirm="addAllStyles(styleLayers)"
                      >
                        <el-button slot="reference" type="warning" size="mini">全部添加</el-button>
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
                </el-table> -->
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
        </div>
        <!-- <el-button-group size="mini"> -->
        <el-button type="success" size="mini" @click="saveMap">保存</el-button>
        <!-- <el-button type="success" size="mini">暂存</el-button>
        </el-button-group> -->
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
      </div>
      <!--      图层列表-->
      <el-divider class="divider">图层</el-divider>
      <div class="layerTable">
        <el-switch
          :width="30"
          style="position: absolute; left: 10px; top: 8px; z-index: 100"
          v-model="allLayerShow"
          @change="allLayerShowSwitchChange($event)"
        >
        </el-switch>
        <el-table
          :data="layers"
          ref="shpLayerTable"
          row-key="id"
          size="mini"
          height="calc(100vh - 170px)"
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
            prop="showName"
            min-width="100"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="操作" min-width="115">
            <template slot="header">
              <el-popconfirm
                title="确定删除全部图层吗？"
                @confirm="allLayerDelete()"
              >
                <el-button slot="reference" type="info" size="mini"
                  >一键删除</el-button
                >
              </el-popconfirm>
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                @click="handleLayerEdit(scope.$index, scope.row)"
                icon="el-icon-edit"
                circle
                title="编辑图层"
                style="margin-left: 5px"
              >
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleLayerDelete(scope.$index, scope.row)"
                icon="el-icon-delete"
                circle
                title="删除图层"
                style="margin-left: 5px"
              >
              </el-button>
              <!-- <el-popover placement="right" width="250" trigger="click">
                <el-row type="flex" justify="end">
                  <el-button type="primary" size="mini" @click="returnOriginStyle">返回原样式</el-button>
                </el-row>
                <el-table :data="typeStyleBase[scope.row.type]" height="313">
                  <el-table-column
                    property="description"
                    width="170"
                    show-overflow-tooltip
                    :label="scope.row.type + '样式'"
                  ></el-table-column>
                  <el-table-column width="80" label="操作">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="primary"
                        @click="addTypeStyle(scope.row)"
                        >应用
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>                -->
              <el-button
                v-if="scope.row.type != 'background'"
                size="mini"
                slot="reference"
                type="primary"
                @click="openTemplateEdit(scope.$index, scope.row)"
                icon="el-icon-s-grid"
                circle
                :title="'应用' + scope.row['type'] + '样式'"
                style="margin-left: 5px"
              >
              </el-button>
              <!-- </el-popover> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <el-button @click="test1">test</el-button> -->
    </div>
    <!-- 模板样式库 -->
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
              @click.native="addTypeStyle(item)"
            >
              <el-popconfirm
                title="确定删除吗？"
                @confirm="tempCardDelete(item.id)"
              >
                <i
                  class="el-icon-remove-outline tempDeleBtn"
                  slot="reference"
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
                <!-- 非mbSource样式 -->
                <el-table
                  v-if="layerSource != 'mbSource'"
                  :data="
                    tempStyleLayers.filter(
                      (data) => data.type == styleTypeSelect
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
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 样式编辑框 -->
    <div
      class="editBoard"
      v-if="
        editorShow == 'circleEditorShow' ||
        editorShow == 'lineEditorShow' ||
        editorShow == 'fillEditorShow' ||
        editorShow == 'symbolEditorShow' ||
        editorShow == 'fillExtrusionEditorShow' ||
        editorShow == 'backgroundEditorShow' ||
        editorShow == 'heatMapEditorShow'
      "
    >
      <div
        v-show="nameEdit === false"
        class="editBoardTitle"
        @click="nameEdit = true"
      >
        <div :title="layers[nowLayerIndex]['showName']">
          {{ layers[nowLayerIndex]["showName"] }}
        </div>
        <i class="el-icon-edit"></i>
      </div>
      <div v-show="nameEdit === true" class="editBoardTitle">
        <el-input
          v-model="layers[nowLayerIndex]['showName']"
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
              </el-row>leaveTab
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
                      style="height: 400px; overflow-y: scroll"
                    >
                      <el-row>
                        <el-select
                          v-model="spriteNameSelect"
                          placeholder="请选择精灵图"
                          @change="spriteChange"
                        >
                          <el-option
                            v-for="item in spriteClassList"
                            :key="item"
                            :label="item"
                            :value="item"
                          >
                          </el-option> </el-select
                        >&nbsp;
                        <div
                          style="width: 400px; display: flex; flex-wrap: wrap"
                        >
                          <div
                            v-for="(item, key, index) in spriteJsonSelect"
                            :key="index"
                            :title="key"
                            @click="clickSprite(item, key, index)"
                            class="spriteCard"
                            body-style="padding:0"
                            :style="{
                              padding: 0,
                              width: item.width + 30 + 'px',
                              height: item.height + 30 + 'px',
                              cursor: 'pointer',
                            }"
                          >
                            <!-- <el-checkbox
                              v-if="isSpriteEdit" class="spriteCheck"
                              v-model="deleteSelect[index]"
                              @change="spriteCheckChange($event,key)">
                            </el-checkbox> -->
                            <div
                              :style="{
                                'background-image': `url(${spritePngSelect})`,
                                width: item.width + 'px',
                                height: item.height + 'px',
                                'background-position':
                                  '-' + item.x + 'px -' + item.y + 'px',
                              }"
                            ></div>
                          </div>
                        </div>
                      </el-row>

                      <!--                      <el-col-->
                      <!--                        class="cursor"-->
                      <!--                        v-for="(item, index) in spriteList"-->
                      <!--                        :key="index"-->
                      <!--                        @click.native="spriteSelect(item)"-->
                      <!--                      >-->
                      <!--                        {{ item }}-->
                      <!--                      </el-col>-->
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
                      <template slot-scope="scope">
                        <span
                          :style="{
                            'font-family': scope.row.name,
                          }"
                        >
                          {{ scope.row.name }}</span
                        >
                      </template>

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
            v-if="editorShow == 'backgroundEditorShow'"
            type="border-card"
            value="first"
            tab-position="left"
          >
            <el-tab-pane label="颜色" name="first">
              <h3>填充颜色</h3>
              &nbsp;
              <el-row style="display: flex; margin-top: 10px">
                <el-color-picker
                  v-model="layers[nowLayerIndex].paint['background-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'background-color',
                      layers[nowLayerIndex].paint['background-color']
                    )
                  "
                  :predefine="predefineColors"
                >
                </el-color-picker>
                <el-input
                  v-model="layers[nowLayerIndex].paint['background-color']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'background-color',
                      layers[nowLayerIndex].paint['background-color']
                    )
                  "
                  placeholder="something"
                ></el-input>
              </el-row>
              <el-divider></el-divider>
            </el-tab-pane>
            <el-tab-pane label="不透明度" name="second">
              <h3>不透明度</h3>
              &nbsp;
              <el-row style="margin-top: 10px">
                <el-slider
                  v-model="layers[nowLayerIndex].paint['background-opacity']"
                  :min="0"
                  :max="1"
                  :marks="{ 0: '0', 0.5: '0.5', 1: '1' }"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'background-opacity',
                      layers[nowLayerIndex].paint['background-opacity']
                    )
                  "
                  :step="0.1"
                >
                </el-slider>
                <br />
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['background-opacity']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'background-opacity',
                      layers[nowLayerIndex].paint['background-opacity']
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
            </el-tab-pane>
          </el-tabs>
          <!-- 热力图 -->
          <el-tabs
            :before-leave="leaveTab"
            v-if="editorShow == 'heatMapEditorShow'"
            type="border-card"
            value="first"
            tab-position="left"
          >
            <!-- <el-tab-pane label="颜色" name="first">
              <h3>热力图颜色渲染</h3>
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
            </el-tab-pane> -->
            <el-tab-pane label="不透明度" name="second">
              <h3>不透明度</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['heatmap-opacity']">{{
                menuShowList["heatmap-opacity"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['heatmap-opacity']"
                style="margin-top: 10px"
              >
                <el-slider
                  v-model="layers[nowLayerIndex].paint['heatmap-opacity']"
                  :min="0"
                  :max="1"
                  :marks="{ 0: '0', 0.5: '0.5', 1: '1' }"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'heatmap-opacity',
                      layers[nowLayerIndex].paint['heatmap-opacity']
                    )
                  "
                  :step="0.1"
                >
                </el-slider>
                <br />
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['heatmap-opacity']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'heatmap-opacity',
                      layers[nowLayerIndex].paint['heatmap-opacity']
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
                tab="heatmap-opacity"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="半径" name="third">
              <h3>半径</h3>
              &nbsp;
              <span v-if="!menuButtonShowList['heatmap-radius']">{{
                menuShowList["heatmap-radius"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['heatmap-radius']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['heatmap-radius']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'heatmap-radius',
                      layers[nowLayerIndex].paint['heatmap-radius']
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
                tab="heatmap-radius"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="权重" name="forth">
              <h3>权重</h3>
              &nbsp;
              <br />
              <span v-if="!menuButtonShowList['heatmap-weight']">{{
                menuShowList["heatmap-weight"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['heatmap-weight']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['heatmap-weight']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'heatmap-weight',
                      layers[nowLayerIndex].paint['heatmap-weight']
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
                tab="heatmap-weight"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
            <el-tab-pane label="密度" name="fifth">
              <h3>密度</h3>
              &nbsp;
              <br />
              <span v-if="!menuButtonShowList['heatmap-intensity']">{{
                menuShowList["heatmap-intensity"]
              }}</span>
              <el-row
                v-if="menuButtonShowList['heatmap-intensity']"
                style="display: flex; margin-top: 10px"
              >
                <el-input-number
                  v-model="layers[nowLayerIndex].paint['heatmap-intensity']"
                  @change="
                    handlePaintChange(
                      layers[nowLayerIndex]['id'],
                      'heatmap-intensity',
                      layers[nowLayerIndex].paint['heatmap-intensity']
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
                tab="heatmap-intensity"
                @callback="callback"
              ></ConditionRender>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>

        <el-tab-pane
          v-if="editorShow != 'backgroundEditorShow'"
          label="数据设置"
          name="second"
        >
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
                    { value: 'heatmap', label: '热力图(heatmap)' },
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
          <el-row v-if="layers[nowLayerIndex].metadata['mapbox:type'] == 'mbStyle'">
            <el-row type="flex" justify="space-between" align="middle">
              <h4>过滤条件配置</h4>
              &nbsp;
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
          </el-row>
          <h4>显示级别配置</h4>
          <el-form label-position="top">
            <el-form-item label="最小级别">
              <el-slider
                :max="layers[nowLayerIndex]['maxzoom']"
                :min="parseInt(0)"
                v-model="layers[nowLayerIndex]['minzoom']"
                @change="
                  handleZoomChange(
                    layers[nowLayerIndex]['id'],
                    layers[nowLayerIndex]['minzoom'],
                    layers[nowLayerIndex]['maxzoom']
                  )
                "
                show-input
              >
              </el-slider>
            </el-form-item>
            <el-form-item label="最大级别">
              <el-slider
                :max="parseInt(22)"
                :min="layers[nowLayerIndex]['minzoom']"
                v-model="layers[nowLayerIndex]['maxzoom']"
                @change="
                  handleZoomChange(
                    layers[nowLayerIndex]['id'],
                    layers[nowLayerIndex]['minzoom'],
                    layers[nowLayerIndex]['maxzoom']
                  )
                "
                show-input
              >
              </el-slider>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <i class="el-icon-close close-button" @click="handleCloseEditBoard"></i>
    </div>
    <!-- 地图容器 -->
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
// import streets from "../assets/js/streets-v8-test.js";
// import style from "../assets/js/style.js";
// import filedValue from "../assets/js/field_value.js";
// import colorFormat from "../assets/js/colorFormat.js";
// import myConfig from "../config";

import Sortable from "sortablejs";
import ConditionRender from "../components/ConditionRender";
// import Vue from "vue";

var map = null;

export default {
  components: { ConditionRender },
  data() {
    return {
      imgDefault: require("../assets/imgs/map-icon.png"),

      //添加shp数据时列表
      multiShpTable: [],
      //#
      dataBaseSelect: "defaultPG", //用于数据库类型判断(四种)
      pgShpList: [],
      shpTableData: [],
      PgBaseSelect: "defaultPG",
      currentPageShp: 1,
      pageSizeShp: 5,
      searchInputShp: "",
      totalDataCountShp: 0,

      addSourceShow: true,
      publishLink: "",
      dataLayers: [],
      mutiPgInfo: "",
      allLayerShow: true,

      //mbtile
      mbTileJsonList: [],
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
      // tmsList: [],
      urlBase: { TERRAIN: [], TMS: [], WMTS: [] },

      //左侧shp图层树
      layersNameObject: {}, //检测重复  后端字段为nameObject
      layersName: [], //加载的图层id集合，用于展示图层按index的排列
      sourceNameObject: {}, //检测source重复

      //类型样式框
      stylesBoxShow: false,
      styleTypeSelect: "",
      //类型样式列表
      typeStyleBase: {
        circle: [],
        line: [],
        fill: [],
        "fill-extrusion": [],
        symbol: [],
      },
      originStyle: [], //图层初始样式，用于应用类型样式后还原样式，注意图层顺序改变时及时更改
      //mbTile模板样式
      templateStyleSelect: "", //mbTile模板的styleJson选择
      templateStyleJson: {},
      templateStyleSelectIndex: 0, //  记录选择的数据下标
      tempStyleLayers: [],
      layerSource: '',      // 用于判断当前图层的数据源，依据图层的matadata属性中的'mapbox:type'属性，有primary,osm,mbCustom


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
      canvasSrc: "", //画布转换为图片的地址
      publicBoolean: false,

      //图标图层样式
      textField: "",
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

      //编辑框
      menuButtonShowList: [], //由列表来记录图层编辑框下每个tab的显示情况
      menuShowList: [], //由列表来记录图层编辑框下的标签显示，例如zoomRang标签
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
      // filterCondition: [{ option: "", type: "==", value: 0 }],
      filterCondition: [],
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
      filterValueSelect: [], //分页信息显示
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
      spriteNameSelect: "",
      spriteJsonSelect: {},
      spritePngSelect: "",
      spriteClassList: [],
      spriteItemList: [],
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
    this.spriteInit();
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
          const end = this.spritePath.lastIndexOf("/");
          this.spriteNameSelect = this.spritePath.substring(15, end);
          if (this.spriteNameSelect != "") {
            const url =
              this.reqUrl +
              "/store/sprites/" +
              this.spriteNameSelect +
              "/" +
              "sprite.json";
            fetch(url)
              .then((res) => {
                return res.json();
              })
              .then((json) => {
                this.spriteJsonSelect = json;
                console.log("精灵图json", this.spriteJsonSelect);
              });
            this.spritePngSelect =
              this.reqUrl +
              "/store/sprites/" +
              this.spriteNameSelect +
              "/" +
              "sprite.png";
          }
          this.glyphsPath = this.mapProjectInfo.glyphs;
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
          this.publicBoolean = this.mapProjectInfo.publicBoolean;
          this.createEmptyMap();
          this.initMapWithData();
          for (const item of this.layers) {
            this.layersName.push(item.id);
            if (item.type != "background") {
              this.originStyle.push({
                paint: item["paint"],
                layout: item["layout"],
              });
            }
          }
          document.title = "地图项目" + this.mapProjectInfo.name;
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

    saveMap() {
      //现将画布内容转为png图片当做工程封面
      this.canvasSrc = map.getCanvas().toDataURL("image/png");
      const { lng, lat } = map.getCenter();
      this.center = lng + "," + lat;
      this.zoom = map.getZoom();
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
          this.mapProjectInfo.nameObject = {
            layersNameObject: this.layersNameObject,
            sourceNameObject: this.sourceNameObject,
          };
          // this.mapProjectInfo.glyphs = this.reqUrl+"/store/fonts/{fontstack}/{range}.pbf";
          // this.mapProjectInfo.sprite = this.reqUrl+"/store/sprites/mpx_sprite/sprite";
          requestApi
            .updateMapProject(JSON.stringify(this.mapProjectInfo))
            .then(() => {
              this.$message.success("保存成功!");
              //保存截图到工程字段
              requestApi
                .createMapImg({
                  imgUrl: this.canvasSrc,
                  mapProjectId: this.mapProjectId,
                })
                .then(() => {})
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
    },
    publish() {
      // this.publishLink = myConfig.requestUrl+'/mapServer/'+this.mapProjectId;
      // this.publishLink = this.reqUrl + "/mapProject/getPublishedMap/" + this.mapProjectId;
      this.publishLink =
        this.reqUrl + "/mapProject/getPublishedMap/" + this.mapProjectId;
    },

    publicMap() {
      this.$confirm("确认发布地图, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.saveMap();
        })
        .then(() => {
          requestApi
            .publicMap(this.mapProjectId)
            .then((res) => {
              if (res.data.code === 0) {
                this.publicBoolean = true;
                this.$message.success("地图发布成功");
              } else {
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
    addBackground(sourceType, row) {
      const index = this.layers.length;
      const newLayout = layerStyleProperties["background"].layout;
      const newPaint = layerStyleProperties["background"].paint;
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
        this.addLayerToMap(backLayer); //没有图层直接按默认添加
      } else {
        map.addLayer(backLayer, this.layers[index - 1].id); //有图层则背景添加在最底层
      }
    },


    async addMbTileData() {
      // 阻止发生默认行为
      let formData = new FormData();
      //input的type为file,输入的文件在files属性里
      let file = this.$refs.mbFile.files[0];
      this.mbTileEditInfo.mbTilesJsonFile = file;
      formData.append("mbTilesJsonFile", file);
      // formData.append("mbTilesJsonName", this.mbTileEditInfo.mbTilesJsonName); //暂时不用上传name
      console.log("表单信息：", this.mbTileEditInfo);
      this.mbTileEditShow = false;
      await this.onUpload(true, formData);
      await this.getMbtilesList(); //加载数据后更新tileJsonList，注：但现在没触发
    },
    async addMbStyleData() {
      // 阻止发生默认行为
      let formData = new FormData();
      //input的type为file,输入的文件在files属性里
      let file = this.$refs.mbStyleFile.files[0];
      this.mbTileStyleInfo.mapStyleFile = file;
      formData.append("mapStyleFile", file);
      formData.append("tileJsonId", this.mbTileSelect);
      console.log("表单信息：", this.mbTileStyleInfo);
      this.mbTileStyleEditShow = false;
      await this.onUpload(false, formData);
      await this.getStyleListById(this.mbTileSelect, false); //加载数据后更新styleList，注：但现在没触发
    },


    // 获取不同类型来源的tileJson列表
    getTileJsonList(type) {
      requestApi
        .getTileJsonList(type)
        .then((res) => {
          if (res.data.data.length != 0) {
            switch (type) {
              // mbtiles换新接口
              // case "mbTile":
              //   this.mbTileJsonList = res.data.data;
              //   console.log("mbTileJsonList", this.mbTileJsonList);
              //   //mbTiles先默认为第一个osm数据
              //   this.mbTileSelect = this.mbTileJsonList[0].id;
              //   this.dataLayers = this.mbTileJsonList[0].vector_layers;
              //   this.getStyleListById(this.mbTileSelect);
              //   break;
              default:
                console.log("tileJsonList", res.data.data);
                break;
            }
          }
        })
        .catch((error) => {
          console.log(error);
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
            ); //获取非mbTiles源数据列表
            this.mbTileJsonList.unshift({
              id: "OSM",
              name: "OSM (OpenStreetMap)",
            }); //首位添加OSM数据
            this.mbTileSelect = JSON.parse(
              JSON.stringify(this.mbTileJsonList[0].id)
            );
            this.getStyleListById(this.mbTileSelect, true); //初始化第一个mbtile包含的样式数据
            // console.log('dataLayers',this.dataLayers);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 获取mbTile的styleJson列表
    getStyleListById(id, isCallBack) {
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
              if (isCallBack) {
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
      } else {
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
              if (isCallBack) {
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

    // 上传文件
    onUpload(status, formData) {
      if (status) {
        fileApi
          .mbTileUpload(formData)
          .then(() => {
            this.$message.success("mbTile数据上传成功！");
          })
          .catch((e) => {
            this.$message.error(e.message);
          });
      } else {
        fileApi
          .mbStyleUpload(formData)
          .then(() => {
            this.$message.success("style数据上传成功！");
          })
          .catch((e) => {
            this.$message.error(e.message);
          });
      }
    },

    async mbTileChange(val) {
      let index = 0;
      this.mbTileJsonList.forEach((e, ind) => {
        if (e.id == val) {
          index = ind;
          this.mbTileSelectIndex = ind;
        }
      });
      this.mbTileInfo = this.mbTileJsonList[index];
      this.mbTileSelect = this.mbTileJsonList[index].id;
      this.getTileJsonById(this.mbTileInfo.tileJsonId);
      await this.getStyleListById(this.mbTileSelect, false);
    },
    //获取选定的styleJson和对应layers
    mbTileStyleChange(val) {
      let index = 0;
      this.mbTileStyleList.forEach((e, ind) => {
        if (e.id == val) {
          index = ind;
          this.mbTileStyleSelectIndex = ind;
        }
      });
      this.mbTileStyleJson = this.mbTileStyleList[index];
      this.styleLayers = this.mbTileStyleJson.layers;
    },
    //用于mbTile的source和layer的json切换
    useMbtileStyle(val) {
      if (val) {
        this.styleLayers = this.mbTileStyleJson.layers;
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
          const currRow2 = _this.originStyle.splice(oldIndex, 1)[0];
          _this.layers.splice(newIndex, 0, currRow);
          _this.originStyle.splice(newIndex, 0, currRow2); //在保持原来样式的同时更改顺序
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
      this.layersName = [];
      for (const item of this.layers) {
        this.layersName.push(item.id);
      }
    },

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
      this.editorShow = "";
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
        sourceType: "pgDefault", //记录数据来源类型，用于区别mbTlie的添加和删除
        show: true,
        originName: row.originName,
        showName: row.originName, //用于展示图层名字
        bounds: row.bounds,
        shpAttribute: typeof row.attrInfo != "undefined" ? row.attrInfo : [],
        attrValueSet: {},
        attrShowList: {},
        filterValueSet: {},
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
      this.addLayerToMap(newLayer);
    },
    async addPgMultiShp(index, row) {
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
      this.addLayerToMap(newLayer);
    },
    async addDataMbTileShp(index, row) {
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
        this.addSourceToMap(newSourceJson);        
            //  直接请求pbf
        // let tileJsonUrl =
        //   this.reqUrl +
        //   "/" +
        //   this.mbJsonSource[this.mbTileInfo.classification] +
        //   "/" +
        //   this.mbTileInfo.name +
        //   "/{z}/{x}/{y}.pbf";
        // let newSourceJson = {
        //   sourceName: sourceId,
        //   sourceType: "vector",
        //   sourceUrl: tileJsonUrl,
        // };
        // map.addSource(newSourceJson.sourceName, {
        //   type: newSourceJson.sourceType,
        //   tiles: [newSourceJson.sourceUrl],
        // });
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
      this.addLayerToMap(newLayer);
    },
    async addStyleMbTileShp(index, row) {
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
        this.addSourceToMap(newSourceJson);        
            //  直接请求pbf        
        // let tileJsonUrl =
        //   this.reqUrl +
        //   "/" +
        //   this.mbJsonSource[this.mbTileInfo.classification] +
        //   "/" +
        //   this.mbTileInfo.name +
        //   "/{z}/{x}/{y}.pbf";
        // let newSourceJson = {
        //   sourceName: sourceId,
        //   sourceType: "vector",
        //   sourceUrl: tileJsonUrl,
        // };
        // map.addSource(newSourceJson.sourceName, {
        //   type: newSourceJson.sourceType,
        //   tiles: [newSourceJson.sourceUrl],
        // });
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
      this.addLayerToMap(newLayer);
    },
    async addTMS(index, row) {
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
        // let tileJsonUrl = this.reqUrl + "/getTileJson/" + sourceId + ".json";
        // let newSourceJson = {
        //   sourceName: sourceId,
        //   sourceType: "raster",
        //   sourceUrl: tileJsonUrl,
        // };
        // map.addSource(newSourceJson.sourceName, {
        //   type: newSourceJson.sourceType,
        //   url: newSourceJson.sourceUrl,
        //   tileSize: 256
        // });
        // this.addSourceToMap(newSourceJson);
            //  直接请求pbf        
        let tileJsonUrl = 	
"https://tile.openstreetmap.org/{z}/{x}/{y}.png";
        let newSourceJson = {
          sourceName: sourceId,
          sourceType: "raster",
          sourceUrl: tileJsonUrl,
        };
        map.addSource(newSourceJson.sourceName, {
          type: newSourceJson.sourceType,
          tiles: [newSourceJson.sourceUrl],
          tileSize: 256
        });        
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
      this.addLayerToMap(newLayer);
    },    
    //添加所有styleJson图层
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
      // 先关闭模板样式编辑框避免冲突
      this.stylesBoxShow = false;
      this.nowLayerIndex = index;
      //先关闭，否则组件不会初始化
      this.editorShow = "";
      // 判断当前页面数据是否为mbtile,以及是否为osm数据
      const datatype = this.layers[this.nowLayerIndex]['metadata']['mapbox:type'];
      switch(datatype){
        case 'primary':
          this.layerSource = 'primary';
          break;
        case 'mbSource':
          this.layerSource = 'mbSource';
          break;
        case 'mbStyle':
          this.layerSource = 'mbStyle';
          break;
      }      
      //设置属性编辑界面的展示情况
      this.menuButtonShowList = this.layers[this.nowLayerIndex].attrShowList;
      this.menuShowList = JSON.parse(JSON.stringify(this.menuButtonShowList)); //先获取包含各个tab的列表
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
        } else if (row.type === "symbol") {
          this.editorShow = "symbolEditorShow";
          this.getSymbolList();
          this.getFontList();
        } else if (row.type === "heatmap") {
          this.editorShow = "heatMapEditorShow";
        } else {
          this.editorShow = "backgroundEditorShow";
        }
        this.menuButtonShowList = [];
      });
      this.filterOptions =
        typeof this.layers[this.nowLayerIndex]["shpAttribute"] != "undefined"
          ? this.layers[this.nowLayerIndex]["shpAttribute"]
          : [];
      //filter赋值
      if (
        JSON.stringify(this.layers[this.nowLayerIndex].filterValueSet) != "{}"
      ) {
        this.filterCondition =
          this.layers[this.nowLayerIndex].filterValueSet["filterCondition"];
        this.filterValue =
          this.layers[this.nowLayerIndex].filterValueSet["filterValue"];
        this.filterOptionSelectList =
          this.layers[this.nowLayerIndex].filterValueSet[
            "filterOptionSelectList"
          ];
        this.filterValueSelect =
          this.layers[this.nowLayerIndex].filterValueSet["filterValueSelect"];
      }
    },

    //回撤到原来样式
    returnOriginStyle() {
      const style = this.originStyle[this.nowLayerIndex];
      const aimLayer = this.layers[this.nowLayerIndex];
      aimLayer.paint = JSON.parse(JSON.stringify(style.paint));
      aimLayer.layout = JSON.parse(JSON.stringify(style.layout));
      console.log("应用完图层样式", aimLayer);
      this.handleRemoveLayer(aimLayer.id);
      if (this.nowLayerIndex === 0) {
        this.addLayerToMap(aimLayer);
      } else {
        map.addLayer(aimLayer, this.layers[this.nowLayerIndex - 1].id);
      }
    },
    async openTemplateEdit(index, row) {
      // 先关闭图层编辑框避免冲突
      this.editorShow = false;
      this.nowLayerIndex = index;
      // 判断当前页面数据是否为mbtile,以及是否为osm数据
      const datatype = this.layers[this.nowLayerIndex]['metadata']['mapbox:type'];
      switch(datatype){
        case 'primary':
          this.layerSource = 'primary';
          break;
        case 'mbSource':
          this.layerSource = 'mbSource';
          break;
        case 'mbStyle':
          this.layerSource = 'mbStyle';
          break;
      }

      this.styleTypeSelect = row.type;
      const type = row.type;
      this.getTypeStyleList(type);
      // await this.getMbtilesList();
      this.getOsmMbList();
      this.stylesBoxShow = true;
    },
    //添加选中图层至样式库
    createTypeStyle(layer) {
      console.log("layer", layer);
      const canvasSrc = map.getCanvas().toDataURL("image/png");
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
        this.addLayerToMap(aimLayer);
      } else {
        map.addLayer(aimLayer, this.layers[this.nowLayerIndex - 1].id);
      }
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
        this.addLayerToMap(aimLayer);
      } else {
        map.addLayer(aimLayer, this.layers[this.nowLayerIndex - 1].id);
      }
      //更新图层编辑框样式
      this.handleLayerEdit(this.nowLayerIndex, aimLayer);
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
      this.originStyle.splice(index, 1);
      this.layersNameObject[layerOriginName] -= 1;
      this.handleRemoveLayer(layerid);

      //如果没有layer使用source，则删除source
      if (this.layersNameObject[layerOriginName] === 0) {
        delete this.layersNameObject[layerOriginName];
        //mbTile不删除source，背景没有source
        if (row.sourceType != "mbTile" && row.type != "background") {
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
      aimLayer.paint = JSON.parse(
        JSON.stringify(layerStyleProperties[val].paint)
      );
      aimLayer.layout = JSON.parse(
        JSON.stringify(layerStyleProperties[val].layout)
      );
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
    spriteChange() {
      this.$confirm(
        "切换精灵图必须保存地图项目，且已使用的其他精灵图图标将不可用，是否保存地图并切换精灵图？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }
      )
        .then(() => {
          if (this.spriteNameSelect != "") {
            const url =
              this.reqUrl +
              "/store/sprites/" +
              this.spriteNameSelect +
              "/" +
              "sprite.json";
            fetch(url)
              .then((res) => {
                return res.json();
              })
              .then((json) => {
                this.spriteJsonSelect = json;
                console.log("精灵图json", this.spriteJsonSelect);
              });
            this.spritePngSelect =
              this.reqUrl +
              "/store/sprites/" +
              this.spriteNameSelect +
              "/" +
              "sprite.png";
          }
          this.spritePath =
            "/store/sprites/" + this.spriteNameSelect + "/sprite";
          this.saveMap();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消切换",
          });
        });
    },
    clickSprite(item, key, index) {
      this.layers[this.nowLayerIndex].layout["icon-image"] = key;
      this.handleLayoutChange(
        this.layers[this.nowLayerIndex]["id"],
        "icon-image",
        key
      );
      console.log("当前点击的精灵图信息", item, key, index);
    },
    spriteInit() {
      requestApi
        .getSpriteList()
        .then((res) => {
          console.log(res);
          this.spriteClassList = res.data.data;

          // this.spriteNameSelect = this.spriteClassList[0];
        })
        .catch((err) => {
          console.log(err);
        });
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
      console.log("layersName", this.layersName);
      if (this.nowLayerIndex > 0) {
        const source = map.getSource(this.layers[this.nowLayerIndex]["source"]);
        console.log("source:", source);
      }
      const style = map.getStyle();
      console.log("style:", style);
      const row = this.layers[this.nowLayerIndex];
      if ("bounds" in row) {
        const bbox = [
          [row.bounds[0] + 0, row.bounds[1] + 0],
          [row.bounds[2] + 0, row.bounds[3] + 0],
        ];
        // const center = [Number((row.bounds[0]+row.bounds[2])/2),Number((row.bounds[1]+row.bounds[3])/2)]
        // this.$nextTick(()=>{
        //   map.setCenter(center);
        // });
        map.fitBounds(bbox, {
          duration: 500,
          padding: { top: 10, bottom: 25, left: 15, right: 5 },
        });
      }
      // const center = [Number((row.bounds[0]+row.bounds[2])/2),Number((row.bounds[1]+row.bounds[3])/2)]

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
    //全局开关
    allLayerShowSwitchChange(val) {
      for (let i in this.layers) {
        const item = this.layers[i];
        this.layers[i].show = val;
        this.handleLayerShowSwitchChange(val, item);
      }
    },

    async allLayerDelete() {
      this.editorShow = "";

      for (let i in this.layers) {
        let item = JSON.parse(JSON.stringify(this.layers[i]));
        let aimSource = item.source;
        let layerOriginName = item.originName;
        let layerid = item.id;
        this.layersNameObject[layerOriginName] -= 1;
        this.handleRemoveLayer(layerid);
        //如果没有layer使用source，则删除source
        if (this.layersNameObject[layerOriginName] === 0) {
          delete this.layersNameObject[layerOriginName];
          //mbTile不删除source，背景没有source
          if (item.sourceType != "mbTile" && item.type != "background") {
            this.handleRemoveSource(aimSource);
            delete this.sources[aimSource];
            for (let key in this.sourceNameObject) {
              if (this.sourceNameObject[key] === aimSource) {
                delete this.sourceNameObject[key];
                break;
              }
            }
            //source没有再使用时,删除后台的tileJson
            this.deleteTileJson(item.source);
          }
        }
      }
      // 循环完再进行视图数据初始化,避免循环中渲染。
      this.layers = [];
      this.layersName = [];
      this.originStyle = [];
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
    handleZoomChange(layerName, min, max) {
      console.log("zoom:", layerName, min, max);
      map.setLayerZoomRange(layerName, min, max);
    },
    //为item添加同handleLayerEdit相同的方法
    addItemEvent(item, feature, index) {
      //因为item是html元素，在其事件中this指向该元素无法获取vue的实例属性和方法
      let _this = this;
      item.onclick = function test() {
        _this.handleLayerEdit(index, feature);
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
        this.layers[this.nowLayerIndex]["filter"] = ["all"];
      }
    },
    handleFilter(row) {
      this.filterCondition[this.nowFilterIndex].value =
        row[this.filterOptionSelectList[this.nowFilterIndex]];
    },
    filterConfirm() {
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
      console.log("筛选结果", id, filters);
      //更改添加上的filter样式
      this.setFilterToMap(id, filters);
      //更改自定义的layers中filter样式
      this.layers[this.nowLayerIndex]["filter"] = filters;
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
    // test1(val) {
      // const features = map.querySourceFeatures("62fb9590abf4b6e7a4f6d517",{sourceLayer:"place"});
      // console.log("features",features);
      // if(val){
      //   this.dataLayers = streets.vector_layers;
      // }else{
        // this.styleLayers = style.layers;
        // this.addAllStyles(style.layers)
      // }
    // },
    // 待删除
    //添加数据库相关
    //打开shp选择框
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
    getPgList() {
      requestApi
        .getPgList()
        .then((res) => {
          this.pgShpList = res.data.data;
          this.pgShpList.unshift({ name: "defaultPG", id: "defaultPG" });
          console.log("pgList", this.pgShpList);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 
    handleCurrentChangeShp(val) {
      this.currentPageShp = val;
      if (this.PgBaseSelect != "defaultPG") {
        this.PgBaseChange();
      } else {
        this.addShpData();
      }
    },
    PgBaseChange(val) {
      //val表示选择的value值
      let index = 0;
      //获取select选择内容的下标
      this.pgShpList.forEach((e, ind) => {
        if (e.id == val) {
          index = ind;
        }
      });
      //更改pg数据库源，同时修改dataBaseSelect类型
      this.dataBaseSelect =
        this.PgBaseSelect == "defaultPG" ? "defaultPG" : "multiPG";
      console.log("PgBaseSelect2", this.PgBaseSelect);
      if (this.PgBaseSelect != "defaultPG") {
        this.shpTableData = this.pgShpList[index].dataInfo;
        this.mutiPgInfo = this.pgShpList[index]; //用于展示IP、端口信息
      } else {
        this.addShpData();
      }
    },           
    getMbtilesList() {
      requestApi.getMbtilesList().then((res) => {
        console.log(res);
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
    dataBaseClick(tab) {
      this.dataBaseSelect = tab.name == "PG" ? "defaultPG" : tab.name;
      console.log("dataBaseSelect", this.dataBaseSelect);
      switch(tab.name){
        case "TMS":
          this.getOutService();
          break;
      }
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
  },
};
</script>

<style>
/* 精灵图单元格 */
.spriteCard {
  width: 400px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.spriteCard:hover {
  border-radius: 4px;
  background-color: #57575a;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3);
}
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
  position: relative;
  width: 100%;
  height: calc(100vh - 170px);
  /* overflow-y: scroll; */
}
/* .layerTable::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
} */
/* 样式框样式 */
.stylesBox {
  /* display: flex; */
  background-color: white;
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
  height: 100%;
  width: 350px;
  position: absolute;
  margin-left: 330px;
  z-index: 99;
}
/* 样式框标题 */
.stylesBoxTitle {
  height: 40px;
  border-bottom: 1px #dcdfe6;
  /* background-color: ; */
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
  left: 170px;
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
  padding-left: 10px;
  border-left: 1px solid #e4e7ed;
  border-right: 1px solid #e4e7ed;
  padding-right: 50px;
  /*justify-content: right;*/
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
  width: 320px;
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
  display: flex;
  margin: 1px 0;
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
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
/* 图标按钮样式 */
.iconBtn:hover {
  cursor: pointer;
  color: #409eff;
}
</style>
