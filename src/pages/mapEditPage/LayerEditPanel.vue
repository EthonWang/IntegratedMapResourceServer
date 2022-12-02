<template>
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
      @click="nameEditOpen"
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
        @change="nameConfirm"
        @input="nameCheck"
        :class="isRepeate ? 'test' : ''"
        :style="{
          'border-color': isRepeate ? 'red' : {},
          color: 'red',
          width: '200px',
        }"
      >
        <i
          v-if="isRepeate"
          slot="suffix"
          class="el-icon-warning"
          title="名称重复"
          style="color: red; font-size: 15px"
        >
        </i>
      </el-input>
      <i class="el-icon-check" @click="nameConfirm"></i>
    </div>

    <el-tabs value="first">
      <el-tab-pane label="样式设置" name="first">
        <!--    圆点图层编辑面板-->
        <el-tabs
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
                show-alpha
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
                show-alpha
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
                v-model="layers[nowLayerIndex].paint['circle-translate-anchor']"
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
                v-model="layers[nowLayerIndex].paint['circle-pitch-alignment']"
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
                show-alpha
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
                  v-model="layers[nowLayerIndex].paint['line-dasharray'][index]"
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
                size="mini"
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
          <el-tab-pane label="图案填充" name="twelve">
            <h3>图标选择</h3>
            &nbsp;
            <span v-if="!menuButtonShowList['line-pattern']">{{
              menuShowList["line-pattern"]
            }}</span>
            <br />
            <el-row
              v-if="menuButtonShowList['line-pattern']"
              style="display: flex; margin-top: 10px"
            >
              <el-input
                v-model="layers[nowLayerIndex].paint['line-pattern']"
                @change="
                  handlePaintChange(
                    layers[nowLayerIndex]['id'],
                    'line-pattern',
                    layers[nowLayerIndex].paint['line-pattern']
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
                <el-tabs @tab-click="imgSourceChange">
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
                      <div style="width: 400px; display: flex; flex-wrap: wrap">
                        <div
                          v-for="(item, key, index) in spriteJsonSelect"
                          :key="index"
                          :title="key"
                          @click="clickSprite('line-pattern', key, index)"
                          class="spriteCard"
                          body-style="padding:0"
                          :style="{
                            padding: 0,
                            width: item.width + 30 + 'px',
                            height: item.height + 30 + 'px',
                            cursor: 'pointer',
                          }"
                        >
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
                          @click="iconSelect('line-pattern',item)"
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
              tab="line-pattern"
              @callback="callback"
            ></ConditionRender>
          </el-tab-pane> 
        </el-tabs>
        <!--    面图层编辑面板-->
        <el-tabs
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
                show-alpha
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
                show-alpha
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
          <el-tab-pane label="图案填充" name="twelve">
            <h3>图标选择</h3>
            &nbsp;
            <span v-if="!menuButtonShowList['fill-pattern']">{{
              menuShowList["fill-pattern"]
            }}</span>
            <br />
            <el-row
              v-if="menuButtonShowList['fill-pattern']"
              style="display: flex; margin-top: 10px"
            >
              <el-input
                v-model="layers[nowLayerIndex].paint['fill-pattern']"
                @change="
                  handlePaintChange(
                    layers[nowLayerIndex]['id'],
                    'fill-pattern',
                    layers[nowLayerIndex].paint['fill-pattern']
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
                <el-tabs @tab-click="imgSourceChange">
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
                      <div style="width: 400px; display: flex; flex-wrap: wrap">
                        <div
                          v-for="(item, key, index) in spriteJsonSelect"
                          :key="index"
                          :title="key"
                          @click="clickSprite('fill-pattern', key, index)"
                          class="spriteCard"
                          body-style="padding:0"
                          :style="{
                            padding: 0,
                            width: item.width + 30 + 'px',
                            height: item.height + 30 + 'px',
                            cursor: 'pointer',
                          }"
                        >
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
                          @click="iconSelect('fill-pattern',item)"
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
              tab="fill-pattern"
              @callback="callback"
            ></ConditionRender>
          </el-tab-pane> 
        </el-tabs>
        <!--    三维面图层编辑面板-->
        <el-tabs
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
                show-alpha
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
                v-model="layers[nowLayerIndex].paint['fill-extrusion-opacity']"
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
                v-model="layers[nowLayerIndex].paint['fill-extrusion-opacity']"
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
            <!-- Expressions方式渲染 -->
            <el-row
              v-if="
                menuButtonShowList['fill-extrusion-height'] &&
                layers[nowLayerIndex].paint['fill-extrusion-height']
                  .constructor !== Object
              "
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
            <!-- Functions方式渲染 -->
            <el-row
              v-if="
                layers[nowLayerIndex].paint['fill-extrusion-height']
                  .constructor === Object
              "
              style="margin-top: 10px"
            >
              <el-row
                type="flex"
                style="align-items: center; margin-bottom: 5px"
              >
                <el-col :span="8">
                  <span>渲染属性:</span>
                </el-col>
                <el-col :span="16">
                  <el-select
                    v-model="
                      layers[nowLayerIndex].paint['fill-extrusion-height']
                        .property
                    "
                    placeholder="请选择渲染属性"
                    @change="
                      handlePaintChange(
                        layers[nowLayerIndex]['id'],
                        'fill-extrusion-height',
                        {
                          property:
                            layers[nowLayerIndex].paint['fill-extrusion-height']
                              .property,
                          type: layers[nowLayerIndex].paint[
                            'fill-extrusion-height'
                          ].type,
                        }
                      )
                    "
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="渲染高度"
                      placement="right"
                    >
                      <el-option
                        label="render_height"
                        value="render_height"
                      ></el-option>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="最小渲染高度"
                      placement="right"
                    >
                      <el-option
                        label="render_min_height"
                        value="render_min_height"
                      ></el-option>
                    </el-tooltip>
                  </el-select>
                </el-col>
              </el-row>
              <el-row type="flex" style="align-items: center">
                <el-col :span="8">
                  <span>渲染类型:</span>
                </el-col>
                <el-col :span="16">
                  <el-select
                    v-model="
                      layers[nowLayerIndex].paint['fill-extrusion-height'].type
                    "
                    placeholder="请选择渲染类型"
                    @change="
                      handlePaintChange(
                        layers[nowLayerIndex]['id'],
                        'fill-extrusion-height',
                        {
                          property:
                            layers[nowLayerIndex].paint['fill-extrusion-height']
                              .property,
                          type: layers[nowLayerIndex].paint[
                            'fill-extrusion-height'
                          ].type,
                        }
                      )
                    "
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="一致型（将输入值作为输出值）"
                      placement="right"
                    >
                      <el-option label="identity" value="identity"></el-option>
                    </el-tooltip>
                    <!-- <el-tooltip class="item" effect="dark" content="指数连续型（在断点之间生成插值）" placement="right">
                      <el-option label="exponential" value="exponential"></el-option>
                    </el-tooltip>                    
                    <el-tooltip class="item" effect="dark" content="间隔型（输出值刚好小于输入值的一系列输出，呈阶梯状）" placement="right">
                      <el-option label="interval" value="interval"></el-option>
                    </el-tooltip>                    
                    <el-tooltip class="item" effect="dark" content="分类型（将和输入值一致的输出）" placement="right">
                      <el-option label="categorical" value="categorical"></el-option>
                    </el-tooltip>                     -->
                  </el-select>
                </el-col>
              </el-row>
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
            <!-- Expressions方式渲染 -->
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
            <!-- Functions方式渲染 -->
            <el-row
              v-if="
                layers[nowLayerIndex].paint['fill-extrusion-base']
                  .constructor === Object
              "
              style="margin-top: 10px"
            >
              <el-row
                type="flex"
                style="align-items: center; margin-bottom: 5px"
              >
                <el-col :span="8">
                  <span>渲染属性:</span>
                </el-col>
                <el-col :span="16">
                  <el-select
                    v-model="
                      layers[nowLayerIndex].paint['fill-extrusion-base']
                        .property
                    "
                    placeholder="请选择渲染属性"
                    @change="
                      handlePaintChange(
                        layers[nowLayerIndex]['id'],
                        'fill-extrusion-base',
                        {
                          property:
                            layers[nowLayerIndex].paint['fill-extrusion-base']
                              .property,
                          type: layers[nowLayerIndex].paint[
                            'fill-extrusion-base'
                          ].type,
                        }
                      )
                    "
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="渲染高度"
                      placement="right"
                    >
                      <el-option
                        label="render_height"
                        value="render_height"
                      ></el-option>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="最小渲染高度"
                      placement="right"
                    >
                      <el-option
                        label="render_min_height"
                        value="render_min_height"
                      ></el-option>
                    </el-tooltip>
                  </el-select>
                </el-col>
              </el-row>
              <el-row type="flex" style="align-items: center">
                <el-col :span="8">
                  <span>渲染类型:</span>
                </el-col>
                <el-col :span="16">
                  <el-select
                    v-model="
                      layers[nowLayerIndex].paint['fill-extrusion-base'].type
                    "
                    placeholder="请选择渲染类型"
                    @change="
                      handlePaintChange(
                        layers[nowLayerIndex]['id'],
                        'fill-extrusion-base',
                        {
                          property:
                            layers[nowLayerIndex].paint['fill-extrusion-base']
                              .property,
                          type: layers[nowLayerIndex].paint[
                            'fill-extrusion-base'
                          ].type,
                        }
                      )
                    "
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="一致型（将输入值作为输出值）"
                      placement="right"
                    >
                      <el-option label="identity" value="identity"></el-option>
                    </el-tooltip>
                    <!-- <el-tooltip class="item" effect="dark" content="指数连续型（在断点之间生成插值）" placement="right">
                      <el-option label="exponential" value="exponential"></el-option>
                    </el-tooltip>                    
                    <el-tooltip class="item" effect="dark" content="间隔型（输出值刚好小于输入值的一系列输出，呈阶梯状）" placement="right">
                      <el-option label="interval" value="interval"></el-option>
                    </el-tooltip>                    
                    <el-tooltip class="item" effect="dark" content="分类型（将和输入值一致的输出）" placement="right">
                      <el-option label="categorical" value="categorical"></el-option>
                    </el-tooltip>                     -->
                  </el-select>
                </el-col>
              </el-row>
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
                  layers[nowLayerIndex].paint['fill-extrusion-translate-anchor']
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
        <!--    图标标注图层编辑面板-->
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
        <!-- 图标 -->
        <el-tabs
          class="symbolBox"
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
                <el-tabs @tab-click="imgSourceChange">
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
                      <div style="width: 400px; display: flex; flex-wrap: wrap">
                        <div
                          v-for="(item, key, index) in spriteJsonSelect"
                          :key="index"
                          :title="key"
                          @click="clickSprite('icon', key, index)"
                          class="spriteCard"
                          body-style="padding:0"
                          :style="{
                            padding: 0,
                            width: item.width + 30 + 'px',
                            height: item.height + 30 + 'px',
                            cursor: 'pointer',
                          }"
                        >
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
                          @click="iconSelect('icon',item)"
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
                v-model="layers[nowLayerIndex].layout['icon-ignore-placement']"
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
        <!-- 标注 -->
        <el-tabs
          class="symbolBox"
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
              style="display: flex; margin: 10px 0"
            >
              <el-input
                v-model="textField"
                @change="
                  handleTextField(
                    layers[nowLayerIndex]['id'],
                    'text-field',
                    $event
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
                <el-input
                  v-model="textFieldSearch"
                  size="mini"
                  placeholder="搜索"
                  prefix-icon="el-icon-search"
                />
                <!-- 非mbTile -->
                <el-table
                  v-if="!isMbTile"
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
                  max-height="400"
                  @row-click="fieldSelect"
                  :show-header="false"
                >
                  <el-table-column prop="column_name" align="right">
                    <template slot="header">
                      <!-- <el-input
                        v-model="textFieldSearch"
                        size="mini"
                        placeholder="搜索"
                        prefix-icon="el-icon-search"
                      /> -->
                    </template>
                  </el-table-column>
                </el-table>
                <!-- mbTile -->
                <el-table
                  v-if="isMbTile"
                  :data="
                    filterOptions.filter(
                      (data) =>
                        !textFieldSearch ||
                        data['attribute']
                          .toLowerCase()
                          .includes(textFieldSearch.toLowerCase())
                    )
                  "
                  :cell-style="{ textAlign: 'left' }"
                  max-height="400"
                  @row-click="fieldSelect"
                  :show-header="false"
                >
                  <el-table-column prop="attribute" align="right">
                    <template slot="header">
                      <!-- <el-input
                        v-model="textFieldSearch"
                        size="mini"
                        placeholder="搜索"
                        prefix-icon="el-icon-search"
                      /> -->
                    </template>
                  </el-table-column>
                  <el-table-column align="right">
                    <template slot-scope="scope">
                      <div
                        v-if="
                          scope.row.type != 'number' &&
                          scope.row.values.length == 0
                        "
                        style="color: #d0cece"
                      >
                        Unknowns
                      </div>
                      <div
                        v-else-if="
                          scope.row.type != 'number' &&
                          scope.row.values.length > 0
                        "
                        style="color: #d0cece"
                      >
                        {{ scope.row.values.length + " values" }}
                      </div>
                      <div v-else style="color: #d0cece">
                        {{ scope.row.min + "-" + scope.row.max }}
                      </div>
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
            <span v-if="menuButtonShowList['text-field']"
              >注：多个属性间默认用','连接，若要属性换行显示用'&'连接</span
            >
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
                show-alpha
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
                v-model="textFont"
                @change="
                  handleTextFont(
                    layers[nowLayerIndex]['id'],
                    'text-font',
                    $event
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
                <el-input
                  v-model="fontSearch"
                  size="mini"
                  placeholder="搜索"
                  prefix-icon="el-icon-search"
                >
                </el-input>
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
                  :show-header="false"
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
                      <!-- <el-input
                        v-model="fontSearch"
                        size="mini"
                        placeholder="搜索"
                        prefix-icon="el-icon-search"
                      >
                      </el-input> -->
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
                v-model="layers[nowLayerIndex].layout['text-ignore-placement']"
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
                show-alpha
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
                show-alpha
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
              <el-color-picker show-alpha
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
          <el-form-item v-if="layers[nowLayerIndex]['metadata']['mapbox:type'].includes('PG')" label="数据源类型">
            <span>{{ layers[nowLayerIndex]["metadata"]['mapbox:type'] == 'multiPG' ? '远程PG' : '本地PG' }}</span>
          </el-form-item>
          <el-form-item v-if="layers[nowLayerIndex]['metadata']['mapbox:type'] == 'multiPG'" label="数据库">
            <span>{{ layers[nowLayerIndex]["mutiPgInfo"].name }}</span>
          </el-form-item>
          <!-- mbTile数据要更换的数据源 -->
          <el-form-item v-if="!layers[nowLayerIndex]['metadata']['mapbox:type'].includes('PG')" label="数据源类型">
            <span
              v-if="!isSourceEdit"
            >{{ layers[nowLayerIndex]["source"].slice(0,layers[nowLayerIndex]["source"].lastIndexOf('_'))+'(mbTile)' }}</span>
            <el-select 
              v-if="isSourceEdit"
              @change="sourceSelect($event,layers[nowLayerIndex]['metadata']['mapbox:type'])"
              v-model="sourceObject['tileJsonId']" size="mini">
              <el-option
                v-for="item in sourceObject['option']"
                :key="item.id"
                :label="item.name"
                :value="item.tileJsonId">
              </el-option>
            </el-select>            
            <el-button v-if="!isSourceEdit" type="text" icon="el-icon-setting" style="margin-left:5px" @click="sourceInit(layers[nowLayerIndex])"></el-button>
            <el-button v-if="isSourceEdit" type="text" icon="el-icon-check" style="margin-left:5px" @click="sourceChange(layers[nowLayerIndex])"></el-button>
          </el-form-item>
          <el-form-item v-if="layers[nowLayerIndex]['metadata']['mapbox:type'] == 'mbStyle'" label="样式文件">
            <span>{{ layers[nowLayerIndex]['manageInfo']['layerKey'].slice(layers[nowLayerIndex]['manageInfo']['layerKey'].lastIndexOf('_')+1,layers[nowLayerIndex]['manageInfo']['layerKey'].indexOf('#')) }}</span>
          </el-form-item>          
          <el-form-item v-if="!layers[nowLayerIndex]['metadata']['mapbox:type'].includes('PG')" label="数据图层">
            <span>{{ layers[nowLayerIndex]["source-layer"] }}</span>
          </el-form-item>
          <!-- PG数据要更换的数据源 -->
          <el-form-item v-if="layers[nowLayerIndex]['metadata']['mapbox:type'].includes('PG')" label="数据图层">
            <span
              v-if="!isSourceEdit"
            >{{ layers[nowLayerIndex]["source"].slice(0,layers[nowLayerIndex]["source"].lastIndexOf('_')) }}</span>
            <!-- 本地PG -->
            <el-select 
              v-if="isSourceEdit&&layers[nowLayerIndex]['metadata']['mapbox:type']=='defaultPG'"
              v-model="sourceObject['tileJsonId']" size="mini"
              @change="sourceSelect($event,layers[nowLayerIndex]['metadata']['mapbox:type'])">
              <el-option
                v-for="item in sourceObject['option']"
                :key="item.id"
                :label="item.originName"
                :value="item.tilejsonId">
              </el-option>
            </el-select>  
            <!-- 远程PG -->
            <el-select 
              v-if="isSourceEdit&&layers[nowLayerIndex]['metadata']['mapbox:type']!='defaultPG'"
              v-model="sourceObject['tileJsonId']" size="mini"
              value-key="originName"
              @change="sourceSelect($event,layers[nowLayerIndex]['metadata']['mapbox:type'])"              
              >
              <el-option
                v-for="item in sourceObject['option']"
                :key="item.originName"
                :label="item.originName"
                :value="item">
              </el-option>
            </el-select>                          
            <el-button v-if="!isSourceEdit" type="text" icon="el-icon-setting" style="margin-left:5px" @click="sourceInit(layers[nowLayerIndex])"></el-button>
            <el-button v-if="isSourceEdit" type="text" icon="el-icon-check" style="margin-left:5px" @click="sourceChange(layers[nowLayerIndex])"></el-button>
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
        <!-- 筛选 -->
        <el-row
          v-if="layers[nowLayerIndex].metadata['mapbox:type'] != 'background'"
        >
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
              <!-- 非mbTile -->
              <el-select
                v-if="!isMbTile"
                :span="2"
                clearable
                v-model="filterCondition[index]['option']"
                placeholder="请选择"
                size="small"
                @change="filterValueInit($event, index)"
              >
                <el-option
                  v-for="item in filterOptions"
                  :key="item['column_name']"
                  :label="item['column_name']"
                  :value="item['column_name']"
                >
                </el-option>
              </el-select>
              <!-- mbTile -->
              <el-select
                v-if="isMbTile"
                :span="2"
                clearable
                v-model="filterCondition[index]['option']"
                placeholder="请选择"
                size="small"
                @change="filterValueInit($event, index)"
              >
                <el-option
                  v-for="item in filterOptions"
                  :key="item['attribute']"
                  :label="item['attribute']"
                  :value="item['attribute']"
                >
                  <!-- 属性名 -->
                  <span style="float: left; margin-right: 20px">{{
                    item.attribute
                  }}</span>
                  <!-- 三种类型补充 -->
                  <span
                    v-if="item.type != 'number' && item.values.length == 0"
                    style="float: right; color: #8492a6; font-size: 13px"
                    >Unkonws
                  </span>
                  <span
                    v-else-if="item.type != 'number' && item.values.length > 0"
                    style="float: right; color: #8492a6; font-size: 13px"
                    >{{ item.values.length + " values" }}
                  </span>
                  <span
                    v-else
                    style="float: right; color: #8492a6; font-size: 13px"
                    >{{ item.min + "-" + item.max }}
                  </span>
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-select
                v-model="filterCondition[index]['type']"
                placeholder="=="
                size="small"
                clearable
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
                v-model="filterCondition[index]['value']"
                @change="filterChange($event, filterHasValues)"
                :placeholder="filterHasValues ? '' : '请输入数组'"
                size="small"
                clearable
              >
                <template>
                  <i class="el-icon-circle-plus"></i>
                </template>
              </el-input>
            </el-col>
            <!-- 占位用 -->
            <el-col v-if="!filterHasValues" :span="2"></el-col>
            <!-- 有筛选值可选 -->
            <el-popover
              v-if="filterHasValues"
              placement="right"
              width="400"
              trigger="click"
            >
              <el-button
                size="mini"
                type="primary"
                @click="filterConfirm"
                style="position: absolute; top: 24px; z-index: 100"
                >筛选
              </el-button>
              <!-- 非mbTiles -->
              <el-row v-if="!isMbTile">
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
                  max-height="400"
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
              </el-row>
              <!-- mbTiles -->
              <el-row v-if="isMbTile">
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
                  max-height="400"
                >
                  <!-- <el-table-column type="selection"> </el-table-column> -->
                  <el-table-column
                    :prop="filterOptionSelectList[index]"
                    label="label"
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
              </el-row>
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
</template>
<script>
import requestApi from "@/api/requestApi";
import { mapState, mapActions, mapMutations } from "vuex";
import ConditionRender from "../../components/ConditionRender.vue";
import layerStyleProperties from "@/assets/js/layerStyleProperties";
import filedValue from "@/assets/js/field_value.js";
import { filterSplit, textSplit } from "@/serve/JsonToValue";
import { nameIndex } from "@/serve/interpolation";
import initTileJson from "@/assets/js/initTileJson";
import { nanoid } from 'nanoid';

export default {
  name: "LayerEditPanel",
  components: { ConditionRender },
  props: [],
  data() {
    return {
      // vuex参数
      // mapProjectInfo: "",
      // layers: "",
      // nowLayerIndex: 0,
      // originStyle: {},
      // spritePath: "",

      // 公共参数
      editorShow: "",
      glyphsPath: "",
      isMbTile: false,
      mbSourceLayer: "",
      layerSource: "", // 用于判断当前图层的数据源，依据图层的matadata属性中的'mapbox:type'属性
      // 分为mbStyle、mbSource、primary
      menuButtonShowList: {}, // 记录图层编辑框下每个tab的显示情况,如{'circle-color':true}
      menuShowList: {}, // 记录图层编辑框下的标签显示，如{'circle-color':zoomRang}标签
      predefineColors: [
        // 颜色选取框
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
      ],
      textField: "", // 不同于mapbox基于[get,'name'],这里采用{name},textField用于展示name
      textFont: "", // 不同于mapbox基于["Roboto Regular", "Open Sans Regular"],这里采用textFont用于展示"Roboto Regular,Open Sans Regular"

      // 精灵图
      spriteClassList: [],
      spriteNameSelect: "", // 从连接中截取的项目精灵图名
      symbolTableData: [],
      currentPageSymbol: 1,
      pageSizeSymbol: 5,
      searchInputSymbol: "",
      totalDataCountSymbol: 0,
      spriteList: [],
      spriteJsonSelect: {},
      spritePngSelect: "",
      spriteItemList: [],

      // 字体
      fontList: [],
      fontSearch: "",
      textFieldSearch: "",

      //编辑框
      isSymbol: true,
      nameEdit: false,
      symbolColor: ["#43aaf5", "#838da8"],
      nameElse: [], // 除了在编辑图层的其余图层名列表
      nameOrigin: "", // 图层编辑前的名称，用于命名重复时更换回初始值
      isRepeate: false,

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

      // #数据源配置
      isSourceEdit: false,
      sourceObject: {options:[],option:{},sourceId_old:'',sourceId_new:'',name:'',tileJsonId:'',type:''},    // 将需要更换source的操作数据进行统一管理
      geoTypeChange: {circle:'POINT',line:'LINE',fill:'POLYGON',symbol:'SYMBOL'},
      typeContent: {        // 记录各个类型要展示的信息
        defaultPG: ["originName","tilejsonId"],
        multiPG: ["originName","geoType"],
        mbSource: ["name","tileJsonId"],
        mbStyle: ["name","tileJsonId"],
        TMS: ["name","url"],
      },      

      // #过滤条件配置
      filterWay: "all",
      filterValueShow: "",
      // filterCondition: [{ option: "", type: "==", value: '' }],
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
      filterValue: [], // 全部单个筛选值列表的集合
      filterValueSelect: [], //分页信息显示
      // filterValueInput: [""],
      // multipleSelection: [],
      nowFilterIndex: 0,
      // 非mbTile筛选值列表
      filterSearch: "",
      filterSearchPage: 1,
      pageSizeFilter: 10,
      totalDataCountFilter: 0,
      // mbTile筛选值列表
      filterHasValues: true, // mbTile中筛选属性无筛选值或num太多
    };
  },
  computed: {
    ...mapState({
      // mapProjectInfoProp: "mapProjectInfo",
      // layersProp: "layers",
      // spritePathProp: "spritePath",
      // nowLayerIndexProp: "nowLayerIndex",
    }),

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
    nowLayerIndex: {
      get() {
        return this.$store.state.nowLayerIndex;
      },
      set(val) {
        this.UPDATEPARM({ parm: "nowLayerIndex", value: val });
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
    // 本组件内需要的属性
    layersName: function () {
      let List = [];
      this.layers.forEach((item) => {
        List.push(item.showName);
      });
      return List;
    },
    // sourceNameObject: function () {
    //   let List = {};
    //   for(let item in this.sources){
    //     let start = this.sources[item].url.lastIndexOf('/');
    //     let end = this.sources[item].url.lastIndexOf('.');
    //     let id = this.sources[item].url.slice(start+1,end);
    //     List[item] = id;
    //   }
    //   return List;
    // }, 
    // layersNameObject: function () {
    //   let List = {};
    //   for(let item in this.layers){
    //     let start = this.sources[item].url.lastIndexOf('/');
    //     let end = this.sources[item].url.lastIndexOf('.');
    //     let id = this.sources[item].url.slice(start+1,end);
    //     List[item] = id;
    //   }
    //   return List;
    // }, 
  },
  mounted() {
    // 等初始组件信息加载完
    this.$bus.$on("init", (data) => {
      switch (data.type) {
        case "all":
        case "editor":
          this.infoInit();
          console.log('editor初始化',data.type);
          break;
        default:
          break;
      }
    });
    // 同ConditionRender组件的通信
    this.$bus.$on("show", (data) => {
      //多级渲染显示
      if (data["param4"]) {
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
        this.$nextTick(() => {
          this.menuButtonShowList[value1] = value2;
          console.log("测试", value1, this.menuButtonShowList[value1]);
        });
      }
    });
    this.$bus.$on("mapEdit", (data) => {
      switch (data.type) {
        case "off": // data:{type:''}
          // this.$bus.$emit('main',{type:'reload',name:'editor'});   // 整个组件渲染，在上一级组件MapEditMain中使用
          this.editorShow = "";     // 仅使dom关闭，组件没刷新，生命周期没更新
          break;
        case "open": // data:{type:'',index:'',layer:''}      #需要index是用于将修改后的layer更新到对应的layers中
          this.handleLayerEdit(data.index, data.layer);
          break;
      }
    });
  },
  methods: {
    // vuex
    ...mapActions({ updateParm: "update" }), //将 `this.updateParm(data)` 映射为 `this.$store.dispatch('update',data)`
    ...mapMutations({ UPDATEPARM: "UPDATE" }), //将 `this.UPDATEPARM(data)` 映射为 `this.$store.commit('UPDATE',data)`

    // 初始化相关参数
    infoInit() {
      // 初始化vuex管理参数
      this.spritePath = this.mapProjectInfo.sprite;
      this.glyphsPath = this.mapProjectInfo.glyphs;
      const end = this.spritePath.lastIndexOf("/");
      this.spriteNameSelect = this.spritePath.substring(15, end);
      // 精灵图JSON和png
      if (this.spriteNameSelect != "mpx_sprite") {
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
          });
        this.spritePngSelect =
          this.reqUrl +
          "/store/sprites/" +
          this.spriteNameSelect +
          "/" +
          "sprite.png";
      }
      this.spriteInit();
    },
    // #总体函数
    // 打开图层样式编辑面板
    async handleLayerEdit(index, row) {
      console.log("now edit layer: row", row);
      // #信息预处理
      // 判断当前页面数据是否为mbtile,以及是否为osm数据
      this.nowLayerIndex = index;
      const datatype = row["metadata"]["mapbox:type"];
      switch (datatype) {
        case "mbSource":
          this.layerSource = "mbSource";
          this.mbSourceLayer = row["source-layer"];
          this.isMbTile = true;
          break;
        case "mbStyle":
          this.layerSource = "mbStyle";
          this.mbSourceLayer = row["source-layer"];
          this.isMbTile = true;
          break;
        case "TMS":
          this.layerSource = "TMS";
          break;
        default:
          this.layerSource = "primary";
          break;
      }
      // 先关闭模板样式编辑框避免冲突
      const data = {
        type: "off",
      };
      this.$bus.$emit("styleTemp", data);
      //先关闭，否则组件不会初始化
      this.editorShow = "";
      //设置属性编辑界面的展示情况
      this.menuButtonShowList = row.attrShowList;
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
          this.getFontList();
        } else if (row.type === "heatmap") {
          this.editorShow = "heatMapEditorShow";
        } else {
          this.editorShow = "backgroundEditorShow";
        }
        this.menuButtonShowList = []; // 若不是读取之前保存的项目，menuButtonShowList由ConditionRender组件渲染传送过来
      });
      // 初始化筛选的属性值列表(mbTile和非mbTile类)
      if (this.isMbTile) {
        let List = filedValue.filter(
          (data) => data.layer == this.mbSourceLayer
        );
        this.filterOptions = List[0].attributes;
      } else {
        this.filterOptions =
          typeof row["shpAttribute"] != "undefined" ? row["shpAttribute"] : [];
      }
      //filter赋值
      if (
        JSON.stringify(row.filterValueSet) != "{}" // 已经有保存
      ) {
        this.filterCondition = row.filterValueSet["filterCondition"];
        this.filterValue = row.filterValueSet["filterValue"];
        this.filterOptionSelectList =
          row.filterValueSet["filterOptionSelectList"];
        this.filterValueSelect = row.filterValueSet["filterValueSelect"];
        this.filterWay = row.filterValueSet["filterWay"];
      }
      // filterValueSet为空表示未设置筛选或者采用mbTile的style样式
      else if (row.filter.length > 1) {
        // 定位到使用style样式的情况
        // 使用模板采用filterHasValues = false的形式
        this.filterHasValues = false;
        const Object = filterSplit(row.filter);
        this.filterCondition = Object.filterConditon;
        this.filterWay = Object.filterWay;
        this.filterOptionSelectList = Object.filterOptionSelectList;
      }
      // #等图层数据处理完毕再加载相关参数初始化
      // 字段标注
      if ("text-field" in this.layers[this.nowLayerIndex].layout) {
        const text = JSON.parse(
          JSON.stringify(this.layers[this.nowLayerIndex].layout["text-field"])
        );
        const end = text.lastIndexOf("}");
        this.textField = this.layers[this.nowLayerIndex].layout[
          "text-field"
        ].substring(1, end);
        this.textField = textSplit(text);
      }
      // 字体
      if ("text-field" in this.layers[this.nowLayerIndex].layout) {
        const fonts = JSON.parse(
          JSON.stringify(this.layers[this.nowLayerIndex].layout["text-font"])
        );
        this.textFont = fonts.join(",");
      }
    },
    // 关闭图层样式编辑面板
    handleCloseEditBoard() {
      this.editorShow = "";
    },

    // #图层编辑相关
    nameEditOpen() {
      this.nameElse = this.layersName.filter(
        (data) => data != this.layers[this.nowLayerIndex]["showName"]
      );
      this.nameOrigin = JSON.parse(
        JSON.stringify(this.layers[this.nowLayerIndex]["showName"])
      );
      this.nameEdit = true;
    },
    // 核对图层名是否正确
    nameCheck(val) {
      if (this.nameElse.indexOf(val) != -1) {
        // 有重复
        this.isRepeate = true;
      } else {
        this.isRepeate = false;
      }
    },
    nameConfirm() {
      if (this.isRepeate) {
        this.layers[this.nowLayerIndex]["showName"] = this.nameOrigin;
        this.isRepeate = false;
        this.nameEdit = false;
      } else {
        this.nameEdit = false;
      }
    },

    // #图标
    // 获取自定义图标列表
    getSymbolList() {
      console.log('cchuafauh');
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
      // 将固定的数据用于组件访问
      localStorage.setItem(
        "symbolTableData",
        JSON.stringify(this.symbolTableData)
      );
    },
    // 设置字体标注字段
    handleTextField(id, prop, value) {
      // 先更新mapbox再更新本地layers
      value = value.replaceAll("，", ","); // 将误输入的中文'，'替换为英文','
      let result = "";
      let textList = [];
      if (value.indexOf(",") > -1) {
        // "name:latin,name:nonlatin"=>"{name:latin} {name:nonlatin}"
        textList = value.split(",");
        textList.forEach((element, index, arr) => {
          arr[index] = "{" + element + "}";
        });
        result = textList.join(" ");
      } else if (value.indexOf("&") > -1) {
        // "name:latin&name:nonlatin"=>"{name:latin}&{name:nonlatin}"
        textList = value.split("&");
        textList.forEach((element, index, arr) => {
          arr[index] = "{" + element + "}";
        });
        result = textList.join("\\n");
      } else {
        // "name:latin"=>"{name:latin}"
        result = "{" + value + "}";
      }
      this.handleLayoutChange(id, prop, result);
      this.layers[this.nowLayerIndex].layout["text-field"] = result;
    },
    // 设置字体
    handleTextFont(id, prop, value) {
      // 先更新mapbox再更新本地layers
      value = value.replaceAll("，", ","); // 将误输入的中文'，'替换为英文','
      let result = value.split(","); // "Roboto Regular,Open Sans Regular"=>["Roboto Regular", "Open Sans Regular"]
      result = ["literal", result];
      this.handleLayoutChange(id, prop, result);
      this.layers[this.nowLayerIndex].layout["text-field"] = result;
      console.log("传递结果", result);
    },

    // 自定义图标
    handleCurrentChangeSymbol(val) {
      this.currentPageSymbol = val;
      this.getSymbolList();
    },
    // 获取字体列表
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
    // 图片相关
    imgSourceChange(val){
      console.log(val.index);
      if(val.index == 1){
        console.log('chufale ');
        this.getSymbolList();
      }
    },
    iconSelect(type,item) {
      this.$refs.iconPopover.doClose();
      this.loadAndAddImg(
        this.reqUrl + "/symbol/getSymbolById/" + item.id,
        item.originName
      );
      if(type.includes('pattern')){
        this.layers[this.nowLayerIndex].paint[type] = item.originName;
        this.handlePaintChange(
          this.layers[this.nowLayerIndex]["id"],
          type,
          item.originName
        );        
      }else{ 
        this.layers[this.nowLayerIndex].layout["icon-image"] = item.originName;
        this.handleLayoutChange(
          this.layers[this.nowLayerIndex]["id"],
          "icon-image",
          item.originName
        );
      }     
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
          if (this.spriteNameSelect != "mpx_sprite") {
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
          // 更新vuex再保存
          this.$bus.$emit("map", { type: "save", flag: false });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消切换",
          });
        });
    },
    clickSprite(item, key, index) {
      if(item.includes('pattern')){
        this.layers[this.nowLayerIndex].paint[item] = key;
        this.handlePaintChange(
          this.layers[this.nowLayerIndex]["id"],
          item,
          key
        );        
      }else{
        this.layers[this.nowLayerIndex].layout["icon-image"] = key;
        this.handleLayoutChange(
          this.layers[this.nowLayerIndex]["id"],
          "icon-image",
          key
        );
      }
      this.$refs.iconPopover.doClose();
      console.log("当前点击的精灵图信息", item, key, index);
    },
    spriteInit() {
      requestApi
        .getSpriteList()
        .then((res) => {
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
      let type = this.isMbTile ? "attribute" : "column_name";
      this.textField = row[type];
      this.layers[this.nowLayerIndex].layout["text-field"] =
        "{" + row[type] + "}";
      this.$refs.fieldPopover.doClose();
      this.handleLayoutChange(
        this.layers[this.nowLayerIndex]["id"],
        "text-field",
        this.layers[this.nowLayerIndex].layout["text-field"]
      );
      console.log(
        "text-field",
        this.layers[this.nowLayerIndex].layout["text-field"]
      );
      // 更新vuex参数
      this.UPDATEPARM({ parm: "layers", value: this.layers });
    },
    fontSelect(row) {
      this.textFont = row.name;
      this.layers[this.nowLayerIndex].layout["text-font"] = [row.name];
      this.$refs.fontPopover.doClose();
      this.handleLayoutChange(
        this.layers[this.nowLayerIndex]["id"],
        "text-font",
        this.layers[this.nowLayerIndex].layout["text-font"]
      );
      // 更新vuex参数
      this.UPDATEPARM({ parm: "layers", value: this.layers });
    },

    // # 数据编辑相关
    // 切换图层
    layerTypeChange(val) {
      //先改参数再更新图层，打开图层编辑框
      console.log("change layer type to", val);
      this.layers[this.nowLayerIndex].paint = JSON.parse(
        JSON.stringify(layerStyleProperties[val].paint)
      );
      this.layers[this.nowLayerIndex].layout = JSON.parse(
        JSON.stringify(layerStyleProperties[val].layout)
      );
      let aimLayer = JSON.parse(
        JSON.stringify(this.layers[this.nowLayerIndex])
      );
      this.handleRemoveLayer(aimLayer.id);
      if (this.nowLayerIndex === 0) {
        this.addLayerToMap(true, aimLayer, true);
      } else {
        const data = {
          id: this.layers[this.nowLayerIndex - 1].id,
          layer: aimLayer,
        };
        this.addLayerToMap(false, data, true);
      }
      this.handleLayerEdit(this.nowLayerIndex, aimLayer);
      this.UPDATEPARM({ parm: "layers", value: this.layers });
    },
    // filter功能
    filterValueInit(val, index) {
      //更新筛选条件的列表
      this.filterOptionSelectList.splice(
        index,
        0,
        this.filterCondition[index].option
      );
      // 非mbTile
      if (!this.isMbTile) {
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
      } else {
        console.log("触发了");
        // mbTile(按照numer和string类型区分)
        const object = this.filterOptions.filter(
          (data) => data.attribute == val
        )[0]; // 获取field_value中当前筛选属性的对象(筛选以数组呈现)
        let length = null;
        let List = [];
        let item = {};
        switch (object.type) {
          case "number":
            length = object.max - object.min;
            if (length < 20) {
              for (let i = object.min; i <= object.max; i++) {
                // 按照非mbTiles样式添加
                item = {};
                item[val] = i;
                List.push(item);
              }
              this.filterValue.splice([this.nowFilterIndex], 0, List);
              this.filterValueSelect = this.filterValue[this.nowFilterIndex];
              this.filterHasValues = true;
            } else {
              this.filterHasValues = false;
            }
            break;
          case "string":
            length = object.values.length;
            if (length > 0) {
              object.values.forEach((data) => {
                item = {};
                item[val] = data;
                List.push(item);
              });
              this.filterValue.splice([this.nowFilterIndex], 0, List);
              this.filterValueSelect = this.filterValue[this.nowFilterIndex];
              this.filterHasValues = true;
            } else {
              this.filterHasValues = false;
            }
            break;
        }
        console.log(
          "filterValueSelect",
          this.filterValueSelect,
          this.filterOptionSelectList[index]
        );
      }
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
    },
    filterRemove(index) {
      this.filterCondition.splice(index, 1);
      if (this.filterCondition.length < 1) {
        const id = this.layers[this.nowLayerIndex].id;
        this.setFilterToMap(id, null);
        this.layers[this.nowLayerIndex]["filter"] = ["all"];
        this.UPDATEPARM({ parm: "layers", value: this.layers });
      }
    },
    handleFilter(row) {
      if (!this.isMbTile) {
        this.filterCondition[this.nowFilterIndex].value =
          row[this.filterOptionSelectList[this.nowFilterIndex]];
      } else {
        this.filterCondition[this.nowFilterIndex].value =
          row[this.filterOptionSelectList[this.nowFilterIndex]];
      }
    },
    filterConfirm(list) {
      let judge = this.filterWay;
      const filters = [judge];
      for (let i = 0; i < this.filterCondition.length; i++) {
        const filter = [];
        filter.push(this.filterCondition[i].type);
        filter.push(["get", this.filterCondition[i].option]);
        //
        if (this.filterHasValues) {
          filter.push(this.filterCondition[i].value);
        } else {
          filter.push(...list);
        }
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
        filterWay: this.filterWay,
      };
      // 更新vuex
      this.UPDATEPARM({ parm: "layers", value: this.layers });
    },
    // input框更换filter值
    filterChange(val, hasValue) {
      // 只有不包含值才触发
      let list = [];
      if (!hasValue) {
        if (val.includes(",")) {
          list = val.split(",");
        } else {
          list = [val];
        }
      }
      this.filterConfirm(list);
    },

    // #数据源设置相关
    sourceInit(layer){
      // 初始化参数
      console.log('sourceNameObject',this.sourceNameObject);

      this.sourceObject = {options:[],option:{},sourceId_old:'',sourceId_new:'',name:'',tileJsonId:'',type:''};
      let type =  layer['metadata']['mapbox:type'];
      let dataName = ('mutiPgInfo' in layer) ? layer['mutiPgInfo']['name']: '';
      let layerType = this.geoTypeChange[layer.type];       // 点线面类型
      // 对sourceObject内容进行赋值
      this.sourceObject['tileJsonId'] = type == 'multiPG' ? 
      JSON.parse(JSON.stringify(layer.source.slice(0,layer.source.lastIndexOf('_')))) : 
      JSON.parse(JSON.stringify(this.sourceNameObject[layer.source]));      // select组件会自动识别是否为列表的value值，然后显示label

      this.sourceObject['sourceId_old'] = JSON.parse(JSON.stringify(layer.source));      
      this.sourceObject['name'] = JSON.parse(JSON.stringify(layer.source.slice(0,layer.source.lastIndexOf('_'))));
      this.sourceObject['type'] = JSON.parse(JSON.stringify(layer.metadata['mapbox:type']));
      if(type == 'defaultPG'){
        requestApi.getShpList({
          asc: false,
          page: 1,
          shpPageSize: 10,
          searchText: "",
          sortField: "createTime",
        })
        .then((res) => {
          console.log("shpDataList", res.data,layerType);
          this.sourceObject['option'] = res.data.data.content.filter(
            data => data.geoType.indexOf(layerType) != -1
          );
        })
        .catch((error) => {
          console.log("查询shp失败", error);
        });
      }
      else if(type == 'multiPG'){
        requestApi.getPgList()
        .then((res) => {
          console.log("数据库源:", res,layerType);
          let List = res.data.data.filter(
            data => data.name == dataName
          );
          this.sourceObject['option'] = List[0].dataInfo.filter(
            data => data.geoType.indexOf(layerType) != -1
          );
        })
        .catch((error) => {
          console.log(error);
        });
      }
      else if(type.includes('mb')){
        requestApi.getMbtilesList()
        .then((res) => {
          console.log("mbtile数据:", res);
          this.sourceObject['option'] = res.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
      }
      else if(type == 'TMS'){
        requestApi.getThirdPartSourceList("TMS")
        .then((res) => {
          if (res.data.code == 0) {
            this.sourceObject['option'] = res.data.data;

          } else {
            console.log(res.data.csg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      }
      this.isSourceEdit = true;
    },
    sourceSelect(val,type){
      // 筛选出所选的图层
      let List = this.sourceObject.option.filter(data=>
        data[this.typeContent[type][1]] == val || data == val
      )
      switch (type){
        case 'defaultPG':
          this.sourceObject['sourceId_new'] = `${List[0].tableName}#defaultPG`;
          this.sourceObject['option'] = List[0];
          break
        case 'multiPG':
          this.sourceObject['sourceId_new'] = `${List[0].originName}_#multiPG`;
          this.sourceObject['option'] = List[0];
          break
        case 'mbSource':
        case 'mbStyle':
          this.sourceObject['sourceId_new'] = `${List[0].name}_#meta`;
          this.sourceObject['option'] = List[0];
          break
      }
      this.sourceObject['name'] = JSON.parse(JSON.stringify(List[0][this.typeContent[type][0]]));
    },
    async sourceChange(layer){
      let originName = JSON.parse(JSON.stringify(layer.source.slice(0,layer.source.lastIndexOf('_'))));
      // 只有source变化才执行替换操作
      if(this.sourceObject.name != originName){
        await this.sourceReplace();
        this.isSourceEdit=false;
        this.sourceObject = {options:[],option:{},sourceId_old:'',sourceId_new:'',name:'',tileJsonId:'',type:''};   // 将需要更换source的操作数据进行统一管理
      }else{
        this.isSourceEdit=false;
        this.sourceObject = {options:[],option:{},sourceId_old:'',sourceId_new:'',name:'',tileJsonId:'',type:''};   // 将需要更换source的操作数据进行统一管理
      }
    },
    async sourceReplace(){
      let item = JSON.parse(JSON.stringify(this.sourceObject));
      let layer = JSON.parse(JSON.stringify(this.layers[this.nowLayerIndex]));
      // 先删除mapbox中的图层，才能对source进行更改（本地layers进行更新不进行删除）
      this.handleRemoveLayer(layer.id)
      // 添加source
      if(!(item.sourceId_new in this.sourceObject)){
        // 准备source信息
        if(item.type == 'multiPG'){
          let newTileJson = initTileJson;
          newTileJson.name = item.tileJsonId.originName;
          let mutiPgInfo = layer.mutiPgInfo;   // 替换的是同一个数据库中的图层，故数据库信息一致 
          newTileJson.tiles = [
            this.reqUrl +
              "/multiPgSource/" +
              mutiPgInfo.ip +
              "/" +
              mutiPgInfo.port +
              "/" +
              mutiPgInfo.name +
              "/" +
              item.tileJsonId.originName +
              "/{z}/{x}/{y}.pbf",
          ];
          let vector_layer = {
            description: "",
            fields: item.tileJsonId.attrInfo,
            id: item.tileJsonId.originName,
          };
          newTileJson.vector_layers = [vector_layer];
          newTileJson.tileJsonType = 'multiPG';
          requestApi.createTileJson(initTileJson)
            .then(res=>{
              if (res.data.code !== 0) {
                console.log("添加source失败");
              }else{
                item.tileJsonId = res.data.data.tileJsonId;
              }
            });          
        }        
        // 添加source
        let sourceJsonId = item.tileJsonId; // defaultPG在上传shp的同时生成json，并把id记录在shp表中
        let tileJsonUrl =
          this.reqUrl + "/getTileJson/" + sourceJsonId + ".json";
        let newSourceJson = {
          sourceName: item.sourceId_new,
          sourceType: "vector",
          sourceUrl: tileJsonUrl,
        };
        this.sources[newSourceJson.sourceName] = {
          type: newSourceJson.sourceType,
          url: newSourceJson.sourceUrl,
        };
        //记录shp图层和对应的id
        this.sourceNameObject[item['sourceId_new']] = sourceJsonId;
        await this.addSourceToMap(true, newSourceJson);
      }
      // 删除旧source
      let layerKey = layer.manageInfo.layerKey;
      let sourceKey = layer.manageInfo.sourceKey;
      // 没有其余图层使用该source
      if(this.layersNameObject[layerKey] == 1){
        delete this.sources[sourceKey];
        await this.handleRemoveSource(layer.source);
        //只有multiPG删除source的tileJson
        if (layer.metadata['mapbox:type'] == "multiPG") {
          let sourceJsonId = JSON.parse(JSON.stringify(this.sourceNameObject[sourceKey]));
          //source没有再使用时,删除后台的tileJson(防止未保存，将删除Json的步骤放到保存中执行)
          // this.deleteTileJson(layer.source);
          this.tileJsonList.push(sourceJsonId);
        }
        delete this.sourceNameObject[sourceKey];                
      }
      // 替换layer信息    
      let result = JSON.parse(
        JSON.stringify(
          nameIndex(this.layers, layerKey, item.name, this.layersNameObject)
        )
      );
      this.layersNameObject = result.object;
      this.layers[this.nowLayerIndex].showName = result.show;
      this.layers[this.nowLayerIndex].source = item['sourceId_new'];
      if(item.type == 'defaultPG'){
        let name = item['sourceId_new'].slice(0,item['sourceId_new'].indexOf('#'));
        this.layers[this.nowLayerIndex]['source-layer'] = name;         // `${row.tableName}#defaultPG`
        this.layers[this.nowLayerIndex]['shpAttribute'] = typeof item.option.attrInfo != "undefined" ? item.option.attrInfo : [];         // `${row.tableName}#defaultPG`
        this.layers[this.nowLayerIndex]['bounds'] = item.option.bounds;
        this.layers[this.nowLayerIndex]['id'] = item.name + "_" + nanoid(5);
      }
      else if(item.type == 'multiPG'){
        let name = item['sourceId_new'].slice(0,item['sourceId_new'].indexOf('_#'));     // row.originName + "_#multiPG"
        this.layers[this.nowLayerIndex]['source-layer'] = name;
        this.layers[this.nowLayerIndex]['shpAttribute'] = typeof item.option.attrInfo != "undefined" ? item.option.attrInfo : [];         // `${row.tableName}#defaultPG`
        this.layers[this.nowLayerIndex]['bounds'] = item.option.bounds;
        this.layers[this.nowLayerIndex]['id'] = item.name + "_" + nanoid(5);        
      }
      // mbTile数据的
      if (this.nowLayerIndex === 0) {
        this.addLayerToMap(true, this.layers[this.nowLayerIndex], true);
      } else {
        const data = {
          id: this.layers[this.nowLayerIndex - 1].id,
          layer: this.layers[this.nowLayerIndex],
        };
        this.addLayerToMap(false, data, true);
      }
    }, 


    // #对ConditionRender组件的方法通信
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

    // #对map组件的封装
    handleRemoveLayer(layerName) {
      const data = {
        type: "removeLayer",
        id: layerName,
      };
      this.$bus.$emit("map", data);
    },
    // 向地图添加layer
    addLayerToMap(flag, val, isReplace, patternProp) {
      console.log('模式',patternProp);
      if(!patternProp){
        delete val['line-pattern'];
        delete val['fill-pattern'];
        console.log('现在的',val);
      }
      if (flag) {
        const data = {
          type: "addLayer1",
          layer: val,
          isReplace: isReplace, // 当图层替换时，不需要对图层树进行更改(用isReplace进行判断)
        };
        this.$bus.$emit("map", data);
      } else {
        // flag=false表示添加在指定图层后
        const data = {
          type: "addLayer2",
          id: val.id,
          layer: val.layer,
          isReplace: isReplace,
        };
        this.$bus.$emit("map", data);
      }
    },
    //向地图添加数据源source
    addSourceToMap(flag, newSource) {
      if (flag) {
        const data = {
          type: "addSource1",
          source: newSource,
        };
        this.$bus.$emit("map", data);
      } else {
        const data = {
          type: "addSource2",
          source: newSource,
        };
        this.$bus.$emit("map", data);
      }
    },  
    handleRemoveSource(sourceName) {
      const data = {
        type: 'removeSource',
        id: sourceName
      }
      this.$bus.$emit("map", data);
    },      
    handleLayoutChange(layerName, key, value) {
      const data = {
        type: "setLayout",
        layerName: layerName,
        key: key,
        value: value,
      };
      this.$bus.$emit("map", data);
    },
    handlePaintChange(layerName, key, value) {
      const data = {
        type: "setPaint",
        layerName: layerName,
        key: key,
        value: value,
      };
      this.$bus.$emit("map", data);
    },
    handleZoomChange(layerName, min, max) {
      const data = {
        type: "setZoom",
        layerName: layerName,
        min: min,
        max: max,
      };
      this.$bus.$emit("map", data);
    },
    // 设置对地图进行筛选
    setFilterToMap(id, filter) {
      const data = {
        type: "setFilter",
        id: id,
        filter: filter,
      };
      this.$bus.$emit("map", data);
    },
    // 添加图标
    loadAndAddImg(url, name) {
      const data = {
        type: "loadAndAddImg",
        url: url,
        name: name,
      };
      this.$bus.$emit("map",data);
    },
  },
  beforeDestroy() {
    this.$bus.$off("init");
    this.$bus.$off("show");
    this.$bus.$off("mapEdit");
  },
};
</script>

<style scoped>
/* 编辑框样式 */
.editBoard {
  display: flex;
  height: 100%;
  width: 350px;
  position: absolute;
  top: 0;
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
.test {
  border-color: red !important;
}
</style>
