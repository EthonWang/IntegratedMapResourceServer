<template>
  <div class="box">
    <el-row v-if="menuButtonShowList[attribute] && conditionShow">
      <el-button
        v-if="
          !attribute.includes('translate-anchor') &&
          !attribute.includes('pitch-alignment') &&
          !attribute.includes('pitch-scale') &&
          !attribute.includes('gradient') &&
          !attribute.includes('rotation-alignment')
        "
        :disabled="
          attribute == 'fill-outline-color' &&
          layer['paint']['fill-antialias'] == false
        "
        class="menuButton"
        plain
        @click="zoomOpen"
        >按级别范围设置样式</el-button
      >
      <!-- data范围popover样式 若两个popover都是用v-popover会出错-->
      <el-popover placement="right" width="400" trigger="click">
        <span>筛选字段</span>
        <el-table
          :data="
            propertyList.filter(
              (data) =>
                !search ||
                data.column_data.toLowerCase().includes(search.toLowerCase())
            )
          "
          row-key="id"
          :cell-style="{ textAlign: 'left' }"
          @row-click="dataOpen"
          height="250"
        >
          <el-table-column prop="column_name" align="right">
            <template slot="header">
              <el-input
                v-model="dataSearch"
                size="mini"
                placeholder="搜索"
                prefix-icon="el-icon-search"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-button
          v-if="
            !attribute.includes('translate-anchor') &&
            !attribute.includes('pitch-alignment') &&
            !attribute.includes('pitch-scale') &&
            !attribute.includes('cap') &&
            !attribute.includes('dasharray') &&
            !attribute.includes('antialias') &&
            attribute.slice(-9) != 'translate' &&
            !attribute.includes('gradient') &&
            !attribute.includes('allow-overlap') &&
            !attribute.includes('placement') &&
            !attribute.includes('optional') && 
            !attribute.includes('padding') && 
            !attribute.includes('icon-translate') && 
            !attribute.includes('text-line-height') && 
            !attribute.includes('text-translate') &&
            !attribute.includes('rotation-alignment') &&
            !attribute.includes('heatmap-opacity') 
          "
          :disabled="
            attribute == 'fill-outline-color' &&
            layer['paint']['fill-antialias'] == false
          "
          slot="reference"
          class="menuButton"
          plain
          >按数据范围设置样式</el-button
        >
      </el-popover>
      <!-- 属性条件popover样式 -->
      <el-popover placement="right" width="400" trigger="click">
        <span>选择属性</span>
        <el-table
          :data="
            propertyList.filter(
              (data) =>
                !search ||
                data.column_name.toLowerCase().includes(search.toLowerCase())
            )
          "
          row-key="id"
          :cell-style="{ textAlign: 'left' }"
          class="attList"
          @row-click="propOpen"
          height="250"
        >
          <el-table-column prop="column_name" align="right">
            <template slot="header">
              <el-input
                v-model="search"
                size="mini"
                placeholder="搜索"
                prefix-icon="el-icon-search"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-button
          v-if="
            !attribute.includes('translate-anchor') &&
            !attribute.includes('pitch-alignment') &&
            !attribute.includes('pitch-scale') &&
            !attribute.includes('cap') &&
            !attribute.includes('dasharray') &&
            !attribute.includes('antialias') &&
            attribute.slice(-9) != 'translate' &&
            attribute.slice(-9) != 'translate' &&
            !attribute.includes('gradient') &&
            !attribute.includes('allow-overlap') &&
            !attribute.includes('placement') &&
            !attribute.includes('optional') && 
            !attribute.includes('padding') && 
            !attribute.includes('icon-translate') && 
            !attribute.includes('text-line-height') && 
            !attribute.includes('text-translate') &&
            !attribute.includes('rotation-alignment') &&
            !attribute.includes('heatmap-opacity') 
          "
          :disabled="
            attribute == 'fill-outline-color' &&
            layer['paint']['fill-antialias'] == false
          "
          slot="reference"
          class="menuButton"
          plain
          >按属性条件设置样式</el-button
        >
      </el-popover>
      <el-button
        v-if="
          !attribute.includes('translate-anchor') &&
          !attribute.includes('pitch-alignment') &&
          !attribute.includes('pitch-scale') &&
          !attribute.includes('cap') &&
          !attribute.includes('dasharray') &&
          !attribute.includes('antialias') &&
          attribute.slice(-9) != 'translate' &&
          !attribute.includes('join') &&
          !attribute.includes('gradient') &&
          !attribute.includes('allow-overlap') &&
          !attribute.includes('placement') &&
          !attribute.includes('optional') && 
          !attribute.includes('padding') && 
          !attribute.includes('icon-translate') && 
          !attribute.includes('text-line-height') && 
          !attribute.includes('text-translate') &&
          !attribute.includes('rotation-alignment')
        "
        class="menuButton"
        plain
        @click="formulaOpen"
        :disabled="
          attribute == 'fill-outline-color' &&
          layer['paint']['fill-antialias'] == false
        "
        >按表达式设置样式</el-button
      >
      <el-button class="menuButton" plain @click="reset('close')"
        >重置</el-button
      >
    </el-row>
    <!-- zoom编辑框 -->
    <el-row v-if="zoomShow">
      <el-button
        v-if="
          isNum ||
          attribute.slice(-9) == 'translate' ||
          attribute.includes('color')
        "
        style="
          margin-bottom: 10px;
          padding-left: 10px;
          padding-right: 50%;
          width: 100%;
        "
        @click="zoomRateShow = true"
      >
        <span>变化率：&nbsp;&nbsp;</span>{{ zoomRate }}
      </el-button>
      <el-dialog
        :visible.sync="zoomRateShow"
        width="30%"
        center
        :close-on-click-modal="false"
        :modal="false"
        :show-close="false"
      >
        <span>变化率：</span>&nbsp;&nbsp;
        <el-select v-model="zoomRate" placeholder="插值类型" style="width: 73%">
          <el-option
            v-for="item in [
              { value: 'linear', label: 'linear' },
              { value: 'step', label: 'step' },
              { value2: 'exponential', label2: 'exponential' },
              { value2: 'cubic-bezier', label2: 'cubic-bezier' },
            ]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-row>{{ rateContent[zoomRate] }}</el-row>
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="zoomRateShow = false">取 消</el-button> -->
          <el-button
            type="primary"
            @click="
              zoomRateShow = false;
              zoomRender();
            "
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <el-table
        ref="tableList"
        :data="zoomValue"
        style="width: 100%"
        class="tableCondition"
        :row-class-name="tableRowClassName"
        @row-click="handleDialogEdit"
      >
        <el-table-column prop="zoom" label="缩放" width="80%">
        </el-table-column>
        <el-table-column :label="tabName[attribute]" width="120%">
          <template slot-scope="scope">
            <el-row v-if="attribute.includes('color')">
              <div
                class="el-icon-s-grid"
                :style="{ color: scope.row.value }"
              ></div>
              <span style="margin-left: 10px">{{ scope.row.value }}</span>
            </el-row>
            <el-row
              v-if="
                attribute.includes('radius') ||
                (attribute.includes('width')&&!attribute.includes('max')) ||
                attribute.includes('blur') ||
                attribute.includes('gap-width') ||
                attribute.includes('line-offset') ||
                attribute.includes('padding') 
              "
            >
              <span style="margin-left: 10px"
                >{{ scope.row.value }}&nbsp;px</span
              >
            </el-row>
            <el-row
              v-if="
                attribute.includes('opacity') ||
                attribute.includes('translate') ||
                attribute.includes('dasharray') ||
                attribute.includes('line-cap') ||
                attribute.includes('join') ||
                attribute.includes('fill-antialias') ||
                attribute.includes('gradient') ||
                attribute.includes('icon-image') ||
                attribute.includes('size') ||
                attribute.includes('optional') ||
                attribute.includes('ignore-placement') ||
                attribute.includes('allow-overlap') ||
                attribute.includes('icon-anchor') ||
                attribute.includes('icon-field') ||
                attribute.includes('symbol-placement') ||
                attribute.includes('text-justify') ||
                attribute.includes('text-anchor') ||
                attribute.includes('icon-offset') ||
                attribute.includes('text-offset') ||
                attribute.includes('text-transform') ||
                attribute.includes('weight') ||
                attribute.includes('intensity') 

              "
            >
              <span style="margin-left: 10px">{{ scope.row.value }}</span>
            </el-row>
            <el-row
              v-if="attribute.includes('text-letter-spacing') || 
                    attribute.includes('text-line-height') ||
                    attribute.includes('text-max-width')"
            >
              <span style="margin-left: 10px"
                >{{ scope.row.value }}&nbsp;em</span
              >
            </el-row>            
            <el-row
              v-if="attribute.includes('fill-extrusion-height') || attribute.includes('base')"
            >
              <span style="margin-left: 10px"
                >{{ scope.row.value }}&nbsp;meters</span
              >
            </el-row>
            <el-row
              v-if="attribute.includes('rotate')"
            >
              <span style="margin-left: 10px"
                >{{ scope.row.value }}&nbsp;deg</span
              >
            </el-row>
            <!-- <el-row v-else>
              <span style="margin-left: 10px">{{ scope.row.value }}</span>
            </el-row>                -->
          </template>
        </el-table-column>
      </el-table>
      <el-button type="text" @click="zoomInsert">+ 增加zoom级别条件 </el-button>
      <el-dialog
        title="zoom条件编辑"
        :visible.sync="zoomEditShow"
        width="30%"
        :show-close="false"
        center
        :close-on-click-modal="false"
        :modal="false"
      >
        <el-row>
          <el-input
            v-model="zoomValue[zoomEditIndex].zoom"
            placeholder="something"
            style="width: 100%"
          >
            <template slot="prepend" body-style="padding:0">zoom:</template>
          </el-input>
        </el-row>
        <br />
        <el-row v-if="attribute.includes('color')" type="flex">
          <el-input
            v-model="zoomValue[zoomEditIndex].value"
            placeholder="something"
            style="width: 100%"
          >
            <template slot="prepend">color:&nbsp;</template>
          </el-input>
          <el-color-picker
            v-model="zoomValue[zoomEditIndex].value"
            :predefine="predefineColors"
          >
          </el-color-picker>
        </el-row>
        <el-row v-if="attribute.includes('opacity')||attribute.includes('weight')||attribute.includes('intensity')" type="flex">
          <el-input
            v-model="zoomValue[zoomEditIndex].value"
            placeholder="something"
            style="width: 100%"
          >
            <template slot="prepend" body-style="padding:0"
              >{{ tabName[attribute] }}:</template
            >
          </el-input>
        </el-row>
        <el-row
          v-if="
            attribute.includes('radius') ||
            (attribute.includes('width')&&!attribute.includes('max')) ||
            attribute.includes('blur') ||
            attribute.includes('gap-width') ||
            attribute.includes('line-offset') ||
            attribute.includes('padding') || 
            attribute.includes('size')
          "
        >
          <el-input
            v-model="zoomValue[zoomEditIndex].value"
            placeholder="something"
            style="width: 100%"
          >
            <template slot="prepend" body-style="padding:0"
              >{{ tabName[attribute] }}:</template
            >
            <template slot="append">px</template>
          </el-input>
        </el-row>
        <el-row
          v-if="attribute.includes('fill-extrusion-height') || attribute.includes('base')"
        >
          <el-input
            v-model="zoomValue[zoomEditIndex].value"
            placeholder="something"
            style="width: 100%"
          >
            <template slot="prepend" body-style="padding:0"
              >{{ tabName[attribute] }}:</template
            >
            <template slot="append">meters</template>
          </el-input>
        </el-row>
        <el-row
          v-if="attribute.includes('rotate')"
        >
          <el-input
            v-model="zoomValue[zoomEditIndex].value"
            placeholder="something"
            style="width: 100%"
          >
            <template slot="prepend" body-style="padding:0"
              >{{ tabName[attribute] }}:</template
            >
            <template slot="append">deg</template>
          </el-input>
        </el-row>
        <el-row
          v-if="attribute.includes('text-letter-spacing') || attribute.includes('text-line-height') || attribute.includes('text-max-width')"
        >
          <el-input
            v-model="zoomValue[zoomEditIndex].value"
            placeholder="something"
            style="width: 100%"
          >
            <template slot="prepend" body-style="padding:0"
              >{{ tabName[attribute] }}:</template
            >
            <template slot="append">em</template>
          </el-input>
        </el-row>
        <el-row v-if="attribute.includes('translate') || attribute.includes('icon-offset') || attribute.includes('text-offset')">
          <el-input
            v-model="zoomValue[zoomEditIndex].value[0]"
            placeholder="something"
            style="width: 100%"
          >
            <template slot="prepend" body-style="padding:0"
              >x轴方向平移:</template
            >
            <template v-if="attribute.includes('translate')" slot="append">px</template>
            <template v-if="attribute.includes('icon-offset')" slot="append">iconsize</template>
            <template v-if="attribute.includes('text-offset')" slot="append">em</template>
          </el-input>
          <br /><br />
          <el-input
            v-model="zoomValue[zoomEditIndex].value[1]"
            placeholder="something"
            style="width: 100%"
          >
            <template slot="prepend" body-style="padding:0"
              >y轴方向平移:</template
            >
            <template v-if="attribute.includes('translate')" slot="append">px</template>
            <template v-if="attribute.includes('icon-offset')" slot="append">iconsize</template>
            <template v-if="attribute.includes('text-offset')" slot="append">em</template>
          </el-input>

        </el-row>
        <el-row v-if="attribute.includes('dasharray')">
          <el-row class="zoomDasharray">
            <div
              class="flexRowSpaceAround"
              v-for="(item, index) in zoomValue[zoomEditIndex].value"
              :key="index"
              style="height: 40px"
            >
              <h4 v-if="index % 2 == 0">实部:</h4>
              <h4 v-else>虚部:</h4>
              <el-input-number
                v-model="zoomValue[zoomEditIndex].value[index]"
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
                @click="zoomValue[zoomEditIndex].value.splice(index, 1)"
              ></el-button>
            </div>
          </el-row>
          <el-button
            type="primary"
            round
            size="mini"
            @click="layer.paint['line-dasharray'].push(0)"
            >添加虚线设置
          </el-button>
        </el-row>
        <el-row
          v-if="attribute.includes('line-cap') || 
                attribute.includes('join') || 
                attribute.includes('icon-anchor') || 
                attribute.includes('symbol-placement') || 
                attribute.includes('text-justify') || 
                attribute.includes('text-anchor') ||
                attribute.includes('text-transform')"
          type="flex"
          align="middle"
        >
          <h4>{{ tabName[attribute] }}:&nbsp;</h4>
          <el-select
            v-if="attribute.includes('line-cap')"
            v-model="zoomValue[zoomEditIndex].value"
            placeholder="请选择"
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
          <el-select
            v-if="attribute.includes('join')"
            v-model="zoomValue[zoomEditIndex].value"
            placeholder="请选择"
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
          <el-select
            v-if="attribute.includes('icon-anchor') || attribute.includes('text-anchor')"
            v-model="zoomValue[zoomEditIndex].value"
            placeholder="请选择"
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
          <el-select
            v-if="attribute.includes('text-justify')"
            v-model="zoomValue[zoomEditIndex].value"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ['auto', 'center', 'right', 'left']"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>           
          <el-select
            v-if="attribute.includes('symbol-placement')"
            v-model="zoomValue[zoomEditIndex].value"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ['point', 'line', 'line-center']"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>           
          <el-select
            v-if="attribute.includes('text-transform')"
            v-model="zoomValue[zoomEditIndex].value"
            placeholder="请选择"
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
        <el-row
          v-if="
            attribute.includes('fill-antialias') ||
            attribute.includes('gradient') ||
            attribute.includes('optional') ||
            attribute.includes('ignore-placement') ||
            attribute.includes('allow-overlap')
          "
          type="flex"
        >
          <span>{{tabName[attribute]}} :</span> &nbsp;&nbsp;&nbsp;&nbsp;
          <el-switch v-model="zoomValue[zoomEditIndex].value"> </el-switch>
        </el-row>
        <el-row v-if="attribute.includes('icon-image')" type="flex">
          <el-input
            v-model="zoomValue[zoomEditIndex].value"
            placeholder="something"
          >
            <template slot="prepend" body-style="padding:0">
              图标 :
            </template>          
          </el-input>
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
                  @click.native="spriteSelect(item,'zoom')"
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
                      @click="iconSelect(item,'zoom')"
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

        <span slot="footer" class="dialog-footer">
          <el-button @click="zoomEditDelete">删除</el-button>
          <el-button type="primary" @click="zoomEditFirm">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
    <!-- data编辑框 -->
    <el-row v-if="dataShow">
      <el-button
        v-if="
          isNum ||
          attribute.slice(-9) == 'translate' ||
          attribute.includes('color')
        "
        style="
          margin-bottom: 10px;
          padding-left: 10px;
          padding-right: 50%;
          width: 100%;
        "
        @click="dataRateShow = true"
      >
        <span>变化率：&nbsp;&nbsp;</span>{{ dataRate }}
      </el-button>
      <el-dialog
        :visible.sync="dataRateShow"
        width="30%"
        center
        :close-on-click-modal="false"
        :modal="false"
        :show-close="false"
      >
        <span>变化率：</span>&nbsp;&nbsp;
        <el-select v-model="dataRate" placeholder="插值类型" style="width: 73%">
          <el-option
            v-for="item in [
              { value: 'linear', label: 'linear' },
              { value: 'step', label: 'step' },
              { value2: 'exponential', label2: 'exponential' },
              { value2: 'cubic-bezier', label2: 'cubic-bezier' },
            ]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-row>{{ rateContent[dataRate] }}</el-row>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="
              dataRateShow = false;
              dataEditFirm();
            "
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <el-table
        ref="tableList"
        :data="dataValue"
        style="width: 100%"
        class="tableCondition"
        :row-class-name="tableRowClassName"
        @row-click="handleDialogEdit"
      >
        <el-table-column prop="data" :label="dataSelect" width="80%">
        </el-table-column>
        <el-table-column :label="tabName[attribute]" width="120%">
          <template slot-scope="scope">
            <el-row v-if="attribute.includes('color')">
              <div
                class="el-icon-s-grid"
                :style="{ color: scope.row.value }"
              ></div>
              <span style="margin-left: 10px">{{ scope.row.value }}</span>
            </el-row>
            <el-row
              v-if="
                attribute.includes('radius') ||
                (attribute.includes('width')&&!attribute.includes('max')) ||
                attribute.includes('blur') ||
                attribute.includes('gap-width') ||
                attribute.includes('line-offset')
              "
            >
              <span style="margin-left: 10px"
                >{{ scope.row.value }}&nbsp;px</span
              >
            </el-row>
            <el-row
              v-if="
                attribute.includes('opacity') ||
                attribute.includes('translate') ||
                attribute.includes('dasharray') ||
                attribute.includes('line-cap') ||
                attribute.includes('join') ||
                attribute.includes('fill-antialias') ||
                attribute.includes('height') ||
                attribute.includes('icon-image') ||
                attribute.includes('size') ||
                attribute.includes('icon-anchor') ||
                attribute.includes('text-transform') ||
                attribute.includes('text-anchor') ||
                attribute.includes('text-offset') ||
                attribute.includes('icon-offset') ||
                attribute.includes('text-justify') ||
                attribute.includes('rotate') ||
                attribute.includes('weight') ||
                attribute.includes('intensity')
              "
            >
              <span style="margin-left: 10px">{{ scope.row.value }}</span>
            </el-row>
            <el-row
              v-if="attribute.includes('text-letter-spacing') || 
                    attribute.includes('text-line-height') ||
                    attribute.includes('text-max-width')"
            >
              <span style="margin-left: 10px"
                >{{ scope.row.value }}&nbsp;em</span
              >
            </el-row>             
            <el-row v-if="attribute.includes('height')">
              <span style="margin-left: 10px"
                >{{ scope.row.value }}&nbsp;meters</span
              >
            </el-row>
            <!-- <el-row v-else>
              <span style="margin-left: 10px">{{ scope.row.value }}</span>
            </el-row>                -->
          </template>
        </el-table-column>
      </el-table>
      <el-button type="text" @click="dataInsert">+ 增加data级别条件 </el-button>
      <el-dialog
        title="data范围编辑"
        :visible.sync="dataEditShow"
        width="30%"
        :show-close="false"
        center
        :close-on-click-modal="false"
        :modal="false"
      >
        <el-row type="flex" justify="space-around" align="middle">
          <span>{{ dataSelect }}:</span>
          <el-slider
            v-model="dataValue[dataEditIndex].data"
            :min="dataRange.min"
            :max="dataRange.max"
            style="width: 80%"
          ></el-slider>
        </el-row>
        <br />
        <el-row v-if="attribute.includes('color')" style="display: flex">
          <el-input
            v-model="dataValue[dataEditIndex].value"
            placeholder="something"
            style="width: 80%"
          >
            <template slot="prepend">color:&nbsp;</template>
          </el-input>
          <el-color-picker
            v-model="dataValue[dataEditIndex].value"
            :predefine="predefineColors"
          >
          </el-color-picker>
        </el-row>
        <el-row v-if="attribute.includes('opacity')||attribute.includes('weight')||attribute.includes('intensity')" style="display: flex">
          <el-input
            v-model="dataValue[dataEditIndex].value"
            placeholder="something"
            style="width: 80%"
          >
            <template slot="prepend" body-style="padding:0"
              >{{ tabName[attribute] }}:</template
            >
          </el-input>
        </el-row>
        <el-row
          v-if="
            attribute.includes('radius') ||
            (attribute.includes('width')&&!attribute.includes('max')) ||
            attribute.includes('blur') ||
            attribute.includes('gap-width') ||
            attribute.includes('line-offset') || 
            attribute.includes('size')
          "
        >
          <el-input
            v-model="dataValue[dataEditIndex].value"
            placeholder="something"
            style="width: 80%"
          >
            <template slot="prepend" body-style="padding:0"
              >{{ tabName[attribute] }}:</template
            >
            <template slot="append">px</template>
          </el-input>
        </el-row>
        <el-row
          v-if="attribute.includes('rotate')"
        >
          <el-input
            v-model="dataValue[dataEditIndex].value"
            placeholder="something"
            style="width: 100%"
          >
            <template slot="prepend" body-style="padding:0"
              >{{ tabName[attribute] }}:</template
            >
            <template slot="append">deg</template>
          </el-input>
        </el-row>
        <el-row
          v-if="attribute.includes('text-letter-spacing') || attribute.includes('text-max-width')"
        >
          <el-input
            v-model="dataValue[dataEditIndex].value"
            placeholder="something"
            style="width: 100%"
          >
            <template slot="prepend" body-style="padding:0"
              >{{ tabName[attribute] }}:</template
            >
            <template slot="append">em</template>
          </el-input>
        </el-row>   
        <el-row v-if="attribute.includes('translate') || attribute.includes('icon-offset') || attribute.includes('text-offset')">
          <el-input
            v-model="dataValue[dataEditIndex].value[0]"
            placeholder="something"
            style="width: 100%"
          >
            <template slot="prepend" body-style="padding:0"
              >x轴方向平移:</template
            >
            <template v-if="attribute.includes('translate')" slot="append">px</template>
            <template v-if="attribute.includes('icon-offset')" slot="append">iconsize</template>
            <template v-if="attribute.includes('text-offset')" slot="append">em</template>
          </el-input>
          <br /><br />
          <el-input
            v-model="dataValue[dataEditIndex].value[1]"
            placeholder="something"
            style="width: 100%"
          >
            <template slot="prepend" body-style="padding:0"
              >y轴方向平移:</template
            >
            <template v-if="attribute.includes('translate')" slot="append">px</template>
            <template v-if="attribute.includes('icon-offset')" slot="append">iconsize</template>
            <template v-if="attribute.includes('text-offset')" slot="append">em</template>
          </el-input>

        </el-row>
        <el-row v-if="attribute.includes('dasharray')">
          <el-row class="dataDasharray">
            <div
              class="flexRowSpaceAround"
              v-for="(item, index) in dataValue[dataEditIndex].value"
              :key="index"
              style="height: 40px"
            >
              <h4 v-if="index % 2 == 0">实部:</h4>
              <h4 v-else>虚部:</h4>
              <el-input-number
                v-model="dataValue[dataEditIndex].value[index]"
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
                @click="dataValue[dataEditIndex].value.splice(index, 1)"
              ></el-button>
            </div>
          </el-row>
          <el-button
            type="primary"
            round
            size="mini"
            @click="layer.paint['line-dasharray'].push(0)"
            >添加虚线设置
          </el-button>
        </el-row>
        <el-row
          v-if="attribute.includes('line-cap') || 
                attribute.includes('join') || 
                attribute.includes('icon-anchor') || 
                attribute.includes('text-anchor') || 
                attribute.includes('text-transform') || 
                attribute.includes('text-justify')"
          type="flex"
          align="middle"
        >
          <h4>{{ tabName[attribute] }}:&nbsp;</h4>
          <el-select
            v-if="attribute.includes('line-cap')"
            v-model="dataValue[dataEditIndex].value"
            placeholder="请选择"
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
          <el-select
            v-if="attribute.includes('join')"
            v-model="dataValue[dataEditIndex].value"
            placeholder="请选择"
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
          <el-select
            v-if="attribute.includes('icon-anchor') || attribute.includes('text-anchor')"
            v-model="dataValue[dataEditIndex].value"
            placeholder="请选择"
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
          <el-select
            v-if="attribute.includes('text-justify')"
            v-model="dataValue[dataEditIndex].value"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ['auto', 'center', 'right', 'left']"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>           
          <el-select
            v-if="attribute.includes('text-transform')"
            v-model="dataValue[dataEditIndex].value"
            placeholder="请选择"
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
        <el-row
          v-if="attribute.includes('fill-antialias')"
          style="display: flex"
        >
          <el-switch v-model="dataValue[dataEditIndex].value"> </el-switch>
        </el-row>
        <el-row v-if="attribute.includes('icon-image')" type="flex">
          <el-input
            v-model="dataValue[dataEditIndex].value"
            placeholder="something"
          >
            <template slot="prepend" body-style="padding:0">
              图标 :
            </template>          
          </el-input>
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
                  @click.native="spriteSelect(item,'data')"
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
                      @click="iconSelect(item,'data')"
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

        <span slot="footer" class="dialog-footer">
          <el-button @click="dataEditDelete">删除</el-button>
          <el-button type="primary" @click="dataEditFirm">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
    <!-- 属性编辑框 -->
    <el-row v-if="propertyShow">
      <el-table
        :data="propValue"
        style="width: 100%"
        class="tableCondition"
        :row-class-name="tableRowClassName"
        @row-click="handleDialogEdit"
        tooltip-effect="dark"
      >
        <el-table-column
          prop="prop"
          :label="propSelect"
          width="80%"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          :label="tabName[attribute]"
          width="120%"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-row v-if="attribute.includes('color')">
              <div
                class="el-icon-s-grid"
                :style="{ color: scope.row.value }"
              ></div>
              <span style="margin-left: 10px">{{ scope.row.value }}</span>
            </el-row>
            <el-row
              v-if="
                attribute.includes('radius') ||
                (attribute.includes('width')&&!attribute.includes('max')) ||
                attribute.includes('blur') ||
                attribute.includes('gap-width') ||
                attribute.includes('line-offset') ||
                attribute.includes('size') 
              "
            >
              <span style="margin-left: 10px"
                >{{ scope.row.value }}&nbsp;px</span
              >
            </el-row>
            <el-row
              v-if="
                attribute.includes('opacity') ||
                attribute.includes('translate') ||
                attribute.includes('dasharray') ||
                attribute.includes('line-cap') ||
                attribute.includes('join') ||
                attribute.includes('fill-antialias') ||
                attribute.includes('height') ||
                attribute.includes('icon-image') ||
                attribute.includes('rotate') ||
                attribute.includes('icon-anchor') ||
                attribute.includes('text-anchor') ||
                attribute.includes('text-offset') ||
                attribute.includes('icon-offset') ||                
                attribute.includes('text-transform') ||
                attribute.includes('text-justify') ||
                attribute.includes('weight') ||
                attribute.includes('intensity')
              "
            >
              <span style="margin-left: 10px">{{ scope.row.value }}</span>
            </el-row>
            <el-row
              v-if="attribute.includes('text-letter-spacing') || 
                    attribute.includes('text-line-height') ||
                    attribute.includes('text-max-width')"
            >
              <span style="margin-left: 10px"
                >{{ scope.row.value }}&nbsp;em</span
              >
            </el-row>             
            <el-row v-if="attribute.includes('height')">
              <span style="margin-left: 10px"
                >{{ scope.row.value }}&nbsp;meters</span
              >
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="text" @click="propInsert">+ 增加prop级别条件 </el-button>
      <el-dialog
        title="属性条件编辑"
        :visible.sync="propEditShow"
        width="30%"
        :show-close="false"
        center
        :close-on-click-modal="false"
        :modal="false"
      >
        <el-row v-if="propEditIndex != 0" style="margin-bottom: 10px">
          <el-popover
            ref="propValuePopover"
            placement="right"
            width="400"
            trigger="focus"
          >
            <el-row type="flex" justify="space-between">
              <el-col :span="18">
                <!-- <el-tag
                  v-for="tag in propValueFilter[propEditIndex]"
                  :key="tag[propSelect]"
                  :closable="true"
                  @close="handleTagClose(tag)"
                >
                  {{ tag[propSelect] }}
                </el-tag> -->
              </el-col>
              <el-col :span="4">
                <el-button size="mini" type="primary" @click="propFilterConfirm"
                  >确定</el-button
                >
              </el-col>
            </el-row>
            <br />
            <el-input
              v-model="propSearch"
              size="mini"
              placeholder="搜索"
              prefix-icon="el-icon-search"
              @change="propValueListInit"
            >
            </el-input>
            <br />
            <el-table
              ref="multiplePropTable"
              :data="propValueList"
              @selection-change="propFilterChange"
              :row-key="getRowKey"
              :cell-style="{ textAlign: 'left' }"
              height="250"
            >
              <el-table-column type="selection" width="50" > </el-table-column>
              <el-table-column :prop="propSelect" align="right">
              </el-table-column>
            </el-table>
            <el-pagination
              background
              @current-change="handleCurrentChange"
              :current-page="propNowPage"
              :page-size="10"
              layout="prev, pager, next"
              :total="allpropValueListLength"
            >
            </el-pagination>
          </el-popover>
          <el-input
            :value="propValue[propEditIndex].prop"
            v-popover:propValuePopover
            placeholder="something"
            style="width: 80%"
          >
            <template slot="prepend" body-style="padding:0"
              >{{ propSelect }}:</template
            >
          </el-input>
        </el-row>
        <el-row v-if="attribute.includes('color')" style="display: flex">
          <el-input
            v-model="propValue[propEditIndex].value"
            placeholder="something"
            style="width: 80%"
          >
            <template slot="prepend">color:&nbsp;</template>
          </el-input>
          <el-color-picker
            v-model="propValue[propEditIndex].value"
            :predefine="predefineColors"
          >
          </el-color-picker>
        </el-row>
        <el-row v-if="attribute.includes('opacity')||attribute.includes('weight')||attribute.includes('intensity')" style="display: flex">
          <el-input
            v-model="propValue[propEditIndex].value"
            placeholder="something"
            style="width: 80%"
          >
            <template slot="prepend" body-style="padding:0"
              >{{ tabName[attribute] }}:</template
            >
          </el-input>
        </el-row>
        <el-row
          v-if="
            attribute.includes('radius') ||
            (attribute.includes('width')&&!attribute.includes('max')) ||
            attribute.includes('blur') ||
            attribute.includes('gap-width') ||
            attribute.includes('line-offset') || 
            attribute.includes('size')
          "
        >
          <el-input
            v-model="propValue[propEditIndex].value"
            placeholder="something"
            style="width: 80%"
          >
            <template slot="prepend" body-style="padding:0"
              >{{ tabName[attribute] }}:</template
            >
            <template slot="append">px</template>
          </el-input>
        </el-row>
        <el-row
          v-if="attribute.includes('rotate')"
        >
          <el-input
            v-model="propValue[propEditIndex].value"
            placeholder="something"
            style="width: 100%"
          >
            <template slot="prepend" body-style="padding:0"
              >{{ tabName[attribute] }}:</template
            >
            <template slot="append">deg</template>
          </el-input>
        </el-row>
        <el-row
          v-if="attribute.includes('text-letter-spacing') || attribute.includes('text-max-width')"
        >
          <el-input
            v-model="propValue[propEditIndex].value"
            placeholder="something"
            style="width: 100%"
          >
            <template slot="prepend" body-style="padding:0"
              >{{ tabName[attribute] }}:</template
            >
            <template slot="append">em</template>
          </el-input>
        </el-row>                
        <el-row v-if="attribute.includes('translate') || attribute.includes('icon-offset') || attribute.includes('text-offset')">
          <el-input
            v-model="propValue[propEditIndex].value[0]"
            placeholder="something"
            style="width: 100%"
          >
            <template slot="prepend" body-style="padding:0"
              >x轴方向平移:</template
            >
            <template v-if="attribute.includes('translate')" slot="append">px</template>
            <template v-if="attribute.includes('icon-offset')" slot="append">iconsize</template>
            <template v-if="attribute.includes('text-offset')" slot="append">em</template>
          </el-input>
          <br /><br />
          <el-input
            v-model="propValue[propEditIndex].value[1]"
            placeholder="something"
            style="width: 100%"
          >
            <template slot="prepend" body-style="padding:0"
              >y轴方向平移:</template
            >
            <template v-if="attribute.includes('translate')" slot="append">px</template>
            <template v-if="attribute.includes('icon-offset')" slot="append">iconsize</template>
            <template v-if="attribute.includes('text-offset')" slot="append">em</template>
          </el-input>

        </el-row>
        <el-row v-if="attribute.includes('dasharray')">
          <el-row class="zoomDasharray">
            <div
              class="flexRowSpaceAround"
              v-for="(item, index) in propValue[propEditIndex].value"
              :key="index"
              style="height: 40px"
            >
              <h4 v-if="index % 2 == 0">实部:</h4>
              <h4 v-else>虚部:</h4>
              <el-input-number
                v-model="propValue[propEditIndex].value[index]"
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
                @click="propValue[propEditIndex].value.splice(index, 1)"
              ></el-button>
            </div>
          </el-row>
          <el-button
            type="primary"
            round
            size="mini"
            @click="layer.paint['line-dasharray'].push(0)"
            >添加虚线设置
          </el-button>
        </el-row>
        <el-row
          v-if="attribute.includes('line-cap') || 
                attribute.includes('join') || 
                attribute.includes('icon-anchor') || 
                attribute.includes('text-anchor') || 
                attribute.includes('text-transform') || 
                attribute.includes('text-justify')"
          type="flex"
          align="middle"
        >
          <h4>{{ tabName[attribute] }}:&nbsp;</h4>
          <el-select
            v-if="attribute.includes('line-cap')"
            v-model="propValue[propEditIndex].value"
            placeholder="请选择"
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
          <el-select
            v-if="attribute.includes('join')"
            v-model="propValue[propEditIndex].value"
            placeholder="请选择"
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
          <el-select
            v-if="attribute.includes('icon-anchor') || attribute.includes('text-anchor')"
            v-model="propValue[propEditIndex].value"
            placeholder="请选择"
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
          <el-select
            v-if="attribute.includes('text-justify')"
            v-model="propValue[propEditIndex].value"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ['auto', 'center', 'right', 'left']"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>           
          <el-select
            v-if="attribute.includes('text-transform')"
            v-model="propValue[propEditIndex].value"
            placeholder="请选择"
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
        <el-row
          v-if="attribute.includes('fill-antialias')"
          style="display: flex"
        >
          <el-switch v-model="propValue[propEditIndex].value"> </el-switch>
        </el-row>
        <el-row 
          v-if="attribute.includes('icon-image')" type="flex">
          <el-input
            v-model="propValue[propEditIndex].value"
            placeholder="something"
          >
            <template slot="prepend" body-style="padding:0">
              图标 :
            </template>          
          </el-input>
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
                  @click.native="spriteSelect(item,'prop')"
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
                      @click="iconSelect(item,'prop')"
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

        <span slot="footer" class="dialog-footer">
          <el-button :disabled="propEditIndex == 0" @click="propEditDelete"
            >删除</el-button
          >
          <el-button
            v-if="propEditIndex != 0"
            type="primary"
            @click="propEditFirm"
            :disabled="propValue[propEditIndex].prop.length == 0"
            >确 定</el-button
          >
          <el-button
            v-if="propEditIndex == 0"
            type="primary"
            @click="propEditFirm"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-row>
    <!-- 公式编辑框 -->
    <el-row v-if="formulaShow">
      <el-input
        type="textarea"
        :autosize="{ minRows: 2 }"
        placeholder="请输入内容:[]"
        v-model="formulaValue"
      ></el-input>
      <el-button type="success" @click="formulaRender">渲染</el-button>
    </el-row>

    <el-button
      v-if="!menuButtonShowList[attribute]"
      class="menuButton"
      plain
      @click="reset('open')"
      >重置</el-button
    >
    <el-button class="menuButton" plain @click="test">test</el-button>
  </div>
</template>
<script>
import requestApi from "../api/requestApi";
export default {
  name: "ConditionRender",
  props: ["layerSelect", "tab"],
  data() {
    return {
      //渲染方式显示设置
      zoomShow: false,
      dataShow: false,
      propertyShow: false,
      formulaShow: false,
      menuButtonShow: true,
      menuButtonShowList: {},

      //所用参数
      layer: this.layerSelect,
      layoutOrpaint: "",
      attribute: this.tab, //重新赋值可以对父组件传来的参数进行修改
      search: "",
      layerOrigin: [],
      zoomValueOrigin: [],
      propValueOrigin: [],
      dataValueOrigin: [],
      formValueOrigin: [],
      propertyList: [],
      conditionShow: true,

      //全局参数
      spriteList: [],
      fontList: [],
      symbolTableData: [],


      //添加新属性，要更新下列属性
      tabName: {
        "circle-color": "颜色",
        "circle-radius": "半径",
        "circle-opacity": "透明度",
        "circle-stroke-color": "边线颜色",
        "circle-stroke-width": "边线宽度",
        "circle-stroke-opacity": "边线不透明度",
        "circle-blur": "模糊",
        "circle-translate": "平移",
        "circle-translate-anchor": "平移参考",
        "circle-pitch-alignment": "倾斜对齐",
        "circle-pitch-scale": "倾斜缩放",
        "line-color": "颜色",
        "line-width": "线宽",
        "line-opacity": "不透明度",
        "line-dasharray": "虚线",
        "line-gap-width": "线间隙",
        "line-blur": "模糊",
        "line-translate": "平移",
        "line-translate-anchor": "平移参考",
        "line-offset": "偏移",
        "line-cap": "线帽",
        "line-join": "线连接",
        "fill-color": "颜色",
        "fill-opacity": "不透明度",
        "fill-outline-color": "边线颜色",
        "fill-translate": "平移",
        "fill-translate-anchor": "平移参考",
        "fill-antialias": "抗锯齿",
        "fill-extrusion-color": "颜色",
        "fill-extrusion-height": "高度",
        "fill-extrusion-base": "底部高度",
        "fill-extrusion-opacity": "不透明度",
        "fill-extrusion-translate": "平移",
        "fill-extrusion-translate-anchor": "平移参考",
        "fill-extrusion-vertical-gradient": "渐变填充",
        "icon-image": "图标",
        "icon-size": "图标大小",
        "icon-opacity": "不透明度",
        "icon-allow-overlap": "允许压盖",
        "icon-ignore-placement": "忽略放置",
        "icon-optional": "图标可选",
        "icon-padding": "内边距",
        "icon-offset": "偏移",
        "icon-translate": "平移",
        "icon-translate-anchor": "平移参考",
        "icon-anchor": "图标锚点",
        "icon-rotate": "旋转角度",
        "icon-pitch-alignment": "倾斜对齐",
        "icon-rotation-alignment": "旋转对齐",
        "icon-height": "图标高度",
        "text-field": "标注字段",
        "text-color": "颜色",
        "text-opacity": "不透明度",
        "text-font": "字体",
        "text-size": "字体大小",
        "symbol-placement": "放置位置",
        "text-anchor": "标注锚点",
        "text-justify": "文本对齐",
        "text-letter-spacing": "字符间距",
        "text-line-height": "行高",
        "text-max-width": "最大宽度",
        "text-allow-overlap": "允许压盖",
        "text-ignore-placement": "忽略放置",
        "text-optional": "标注可选",
        "text-transform": "大小写转换",
        "text-padding": "内边距",
        "text-offset": "偏移",
        "text-translate": "平移",
        "text-rotate": "旋转角度",
        "text-pitch-alignment": "倾斜角度",
        "text-rotation-alignment": "旋转对齐",
        "text-halo-color": "掩膜颜色",
        "text-halo-width": "掩膜宽度",
        "text-halo-blur": "掩膜模糊",
        "background-color": "背景色",
        "background-opacity": "不透明度",
        "heatmap-opacity": "不透明度",
        "heatmap-radius": "半径",
        "heatmap-weight": "权重",
        "heatmap-intensity": "密度"
        
        
      },
      numAttribute: [
        "circle-radius",
        "circle-opacity",
        "circle-stroke-opacity",
        "circle-stroke-width",
        "circle-stroke-opacity",
        "circle-blur",
        "line-width",
        "line-opacity",
        "line-gap-width",
        "line-blur",
        "line-offset",
        "fill-opacity",
        "fill-extrusion-height",
        "fill-extrusion-base",
        "fill-extrusion-opacity",
        "icon-size",
        "text-size",
        "icon-opacity",
        "icon-rotate",
        "text-opacity",
        "icon-padding",
        "text-letter-spacing",
        "text-line-height",
        "text-max-width",
        "text-padding",
        "text-rotate",
        "text-halo-width",
        "text-halo-blur",
        "background-opacity",
        "heatmap-opacity",
        "heatmap-radius",
        "heatmap-weight",
        "heatmap-intensity",

      ],  //该列表用于渲染时候进行属性判断
      arrayAttribute: [
        "circle-translate",
        "line-translate",
        "fill-translate",
        "fill-extrusion-translate",
        "icon-offset",
        "text-offset",
        "icon-translate",
        "text-translate",
      ], //'line-dasharray'另外提出
      onlyZoom: [
        "icon-allow-overlap",
        "icon-ignore-placement",
        "icon-optional",
        "icon-padding",
        "icon-translate",
        "symbol-placement",
        "text-line-height",
        "text-allow-overlap",
        "text-ignore-placement",
        "text-optional",
        "text-padding",
        "text-translate"
      ],

      isNum: false,
      isArray: false,

      //zoom范围条件
      colorInit: "",
      zoomValue: [{ zoom: 0 }, { zoom: 24 }], //先不设置value属性，不同地物属性value类型不同
      zoomEditShow: false,
      zoomEditIndex: 0,
      zoomCondition: [], //是否需要interpolate渲染
      zoomRate: "linear",
      zoomRateShow: false,

      //data范围条件
      dataValue: [{ data: 0 }, { data: 0 }],
      dataRange: { min: 0, max: 0 },
      dataSearch: "",
      dataSelect: "",
      datalength: 2,
      dataInsertIndex: 1,
      dataRateShow: false,
      dataRate: "linear",
      dataEditShow: false,
      dataEditIndex: 0,
      dataCondition: [],

      //property范围条件
      propValue: [{ prop: "default" }, { prop: "" }],
      allpropValueListLength: 0,
      propEditShow: false,
      propEditIndex: 1,
      propSelect: "",
      propValueFilter: [],
      propValueList: [],
      propSearch: "区",
      propNowPage: 1,
      propdisable: false,
      //prop多选
      propTableChecked : [], // 选中数据
      multipleSelectionAll: new Map(), //所有选中的数据包含跨页数据      


      //表达式渲染
      formulaValue: "",

      //插值类型
      value: "",
      // rateContent: {linear:'线性：在刚好小于和刚好大于输入的停止点对之间进行线性插值。',exponential:'指数：在小于和大于输入的停靠点之间以指数方式插值。','cubic-bezier':'贝塞尔曲线：使用由给定控制点定义的三次贝塞尔曲线进行插值。',step:'通过评估由输入和输出值对定义的分段常数函数，产生离散的阶梯式结果。'},
      rateContent: {
        linear: "线性：在刚好小于和刚好大于输入的停止点对之间进行线性插值。",
        step: "通过评估由输入和输出值对定义的分段常数函数，产生离散的阶梯式结果。",
      },

      //默认数据
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
      ],
      valueDefault: {
        line: {
          layout: {
            "line-cap": "butt2", //One of "butt", "round", "square"
            "line-join": "miter", //One of "bevel", "round", "miter"
            "line-miter-limit": 2,
            "line-round-limit": 1.05,
            visibility: "visible",
            // "line-sort-key":999
          },
          paint: {
            "line-blur": 0,
            "line-color": "#000000",
            "line-dasharray": [],
            "line-gap-width": 0,
            // "line-gradient":"",  //ignore  Requires source to be "geojson".
            "line-offset": 0,
            "line-opacity": 1,
            // "line-pattern": "",  //ignore  Optional resolvedImage.
            "line-translate": [0, 0],
            "line-translate-anchor": "map", //One of "map", "viewport".
            "line-width": 1,
          },
        },
        circle: {
          layout: {
            visibility: "visible", //One of "visible", "none"
            // "circle-sort-key":999,
          },
          paint: {
            "circle-blur": 0,
            "circle-color": "#000000",
            "circle-opacity": 1,
            "circle-pitch-alignment": "viewport", //One of "map", "viewport"
            "circle-pitch-scale": "map", //One of "map", "viewport"
            "circle-radius": 5,
            "circle-stroke-color": "#000000",
            "circle-stroke-opacity": 1,
            "circle-stroke-width": 0,
            "circle-translate": [0, 0],
            "circle-translate-anchor": "map", // One of "map", "viewport"
          },
        },
        fill: {
          layout: {
            visibility: "visible", //One of "visible", "none"
            // "fill-sort-key":999
          },
          paint: {
            "fill-antialias": true,
            "fill-color": "#000000",
            "fill-opacity": 1,
            "fill-outline-color": "#000000",
            //"fill-pattern":''  //ignore  Optional resolvedImage.
            "fill-translate": [0, 0],
            "fill-translate-anchor": "map", // One of "map", "viewport"
          },
        },
      },
    };
  },
  methods: {
    initInfo() {
      // 初始化页面参数
      this.spriteList = JSON.parse(localStorage.getItem('spriteList'));
      this.symbolTableData = JSON.parse(localStorage.getItem('symbolTableData'));
      this.fontList = JSON.parse(localStorage.getItem('fontList'));

      // 保留原样式用于重置,
      if (this.layerOrigin == "") {
        this.layerOrigin = JSON.parse(JSON.stringify(this.layer));
      }
      // 判断样式tab属于layout还是paint
      if (
        Object.prototype.hasOwnProperty.call(this.layer.layout, this.attribute)
      ) {
        this.layoutOrpaint = "layout";
      } else if (
        Object.prototype.hasOwnProperty.call(this.layer.paint, this.attribute)
      ) {
        this.layoutOrpaint = "paint";
      } else {
        this.$message("数据layout和paint属性有误");
        console.log("no this attribute：", this.attribute, this.layer.layout);
      }
      // 初始化属性表
      this.propertyList = this.layer.shpAttribute;
      // 初始化tab显示列表
      for (let tab in this.layer["paint"]) {
        if(this.layer.attrValueSet[tab] == 'primary' || !(this.attribute in this.layer.attrValueSet)){
          this.menuButtonShowList[tab] = true;
          this.layer.attrValueSet[tab] = 'primary';   //若之前未有存档，则初始化为primary
        }else{
          this.menuButtonShowList[tab] = false;
        }
      }
      for (let tab in this.layer["layout"]) {
        if(this.layer.attrValueSet[tab] == 'primary' || !(this.attribute in this.layer.attrValueSet)){
          this.menuButtonShowList[tab] = true;
          this.layer.attrValueSet[tab] = 'primary';
        }else{
          this.menuButtonShowList[tab] = false;
        }
      }
      // 判断样式属性值为数字还是文本
      this.isNum =
        this.numAttribute.indexOf(this.attribute) == -1 ? false : true;
      this.isArray =
        this.arrayAttribute.indexOf(this.attribute) == -1 ? false : true;
      //初次传递整个导航条的显示情况，依据param2判断是否单个tab显示切换
      this.$bus.$emit("show", { param1: this.menuButtonShowList, param2: 0 ,param3:this.layer.attrValueSet});
      if(this.layer.attrValueSet[this.attribute] != 'primary'){
        switch(this.layer.attrValueSet[this.attribute].type){
          //赋初始值
          case 'zoom':
            console.log('zoom变换读取原数据:',this.layer.attrValueSet[this.attribute].value)
            this.zoomValue = this.layer.attrValueSet[this.attribute].value.zoomValue;
            this.zoomRate = this.layer.attrValueSet[this.attribute].value.zoomRate;
            this.zoomValueOrigin = this.layer.attrValueSet[this.attribute].value.zoomValueOrigin;

            this.menuButtonShowList[this.attribute] = false;
            this.$bus.$emit("show", { param1: this.attribute, param2: false, param4: 'zoom'});
            this.zoomShow = true;          
            break
          case 'data':
            console.log('data变换读取原数据:',this.layer.attrValueSet[this.attribute].value)
            this.dataValue = this.layer.attrValueSet[this.attribute].value.dataValue;
            this.dataRange = this.layer.attrValueSet[this.attribute].value.dataRange;
            this.dataSelect = this.layer.attrValueSet[this.attribute].value.dataSelect;
            this.datalength = this.layer.attrValueSet[this.attribute].value.datalength;
            this.dataInsertIndex = this.layer.attrValueSet[this.attribute].value.dataInsertIndex;
            this.dataRate = this.layer.attrValueSet[this.attribute].value.dataRate;
            this.dataValueOrigin = this.layer.attrValueSet[this.attribute].value.dataValueOrigin;

            this.menuButtonShowList[this.attribute] = false;
            this.$bus.$emit("show", { param1: this.attribute, param2: false, param4: 'data'});
            this.dataShow = true;              
            break
          case 'prop':
            console.log('prop变换读取原数据:',this.layer.attrValueSet[this.attribute].value)
            this.propValue = this.layer.attrValueSet[this.attribute].value.propValue;
            this.propSelect = this.layer.attrValueSet[this.attribute].value.propSelect;
            this.propValueFilter = this.layer.attrValueSet[this.attribute].value.propValueFilter;
            this.propValueList = this.layer.attrValueSet[this.attribute].value.propValueList;
            this.propValueOrigin = this.layer.attrValueSet[this.attribute].value.propValueOrigin;

            this.menuButtonShowList[this.attribute] = false;
            this.$bus.$emit("show", { param1: this.attribute, param2: false, param4: 'prop'});
            this.propertyShow = true; 
            break
          case 'formula':
            console.log('formula变换读取原数据:',this.layer.attrValueSet[this.attribute].value)
            this.formulaValue = this.layer.attrValueSet[this.attribute].value.formulaValue;
            this.formValueOrigin = this.layer.attrValueSet[this.attribute].value.formValueOrigin;

            this.menuButtonShowList[this.attribute] = false;
            this.$bus.$emit("show", { param1: this.attribute, param2: false, param4: 'formula'});
            this.formulaShow = true;             
            
            break
          default:
            return null;
        }
      }
      //判断编辑图层是否为mbTile
      if(this.layer["shpAttribute"] == 'undefined' || this.layer["shpAttribute"] == null){
        this.conditionShow = false;
      }
    },
    reset(val) {
      this.$confirm("是否重置当前设置?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.menuBtnReset(val);
          this.$message({
            type: "success",
            message: "重置样式成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重置",
          });
          console.log("reset失败");
        });
    },
    menuBtnReset(val) {
      // 内部重置按钮功能
      if (val === "open") {
        console.log("attr", this.menuButtonShowList);
        //在一个图层中，属性的显示情况和值同时存储
        this.menuButtonShowList[this.attribute] = true;
        this.layer.attrValueSet[this.attribute] = 'primary';
        this.$bus.$emit("show", { param1: this.attribute, param2: true });
        // zoom相关
        if (this.zoomShow) {
          this.zoomShow = false;
          // 初始化zoomValue为刚加载的值
          const value2 = this.zoomValueOrigin;
          this.zoomValue = value2;
          // 将父组件传来的参数设为原来的值
          const value1 = this.zoomValueOrigin[0]["value"];
          this.layer[this.layoutOrpaint][this.attribute] = value1;
          this.zoomEditIndex = 0;
        }
        //data相关
        else if (this.dataShow) {
          this.dataShow = false;
          // 初始化dataValue为刚加载的值
          const value2 = this.dataValueOrigin;
          this.dataValue = value2;
          // 将父组件传来的参数设为原来的值
          const value1 = this.dataValueOrigin[0]["value"];
          this.layer[this.layoutOrpaint][this.attribute] = value1;
          this.dataEditIndex = 0;
          this.dataInsertIndex = 1;
          console.log("this.dataShow");
        }
        //属性相关
        else if (this.propertyShow) {
          this.propertyShow = false;
          // 初始化propValue为刚加载的值
          console.log("proporigin", this.propValueOrigin);
          const value2 = this.propValueOrigin;
          this.propValue = value2;
          // 将父组件传来的参数设为原来的值
          const value1 = this.propValueOrigin[0]["value"];
          this.layer[this.layoutOrpaint][this.attribute] = value1;
          this.propEditIndex = 1;
        }
        //公式相关
        else if (this.formulaShow) {
          this.formulaShow = false;
          console.log("this.formulaShow");
        }
      }
      // 外部重置按钮功能
      else if (val === "close") {
        // 设置为默认样式,使用const保证之后不会赋予另外的对象
        const value1 = this.layerOrigin[this.layoutOrpaint][this.attribute];
        this.layer[this.layoutOrpaint][this.attribute] = value1;
      }
      //向父组件传递要修改的参数
      const value = this.layer[this.layoutOrpaint][this.attribute];
      const parameters = 'primary';
      this.$emit("callback", this.layoutOrpaint, this.attribute, value, parameters);
    },

    //条件渲染相同功能
    handleDialogEdit(row) {
      console.log("row", row);
      if ("zoom" in row) {
        //zoomEditShow设置成数组，dialog不会正常关闭
        // this.zoomEditShow = ['true',0];
        this.zoomEditShow = true;
        this.zoomEditIndex = row.index;
        console.log("row:", row);
        console.log("zoomEditIndex:", this.zoomEditIndex);
        console.log("zoomValue:", this.zoomValue);
      } else if ("data" in row) {
        this.dataEditIndex = row.index;
        this.dataEditShow = true;
        console.log("row:", row);
      } else if ("prop" in row) {
        this.propEditIndex = row.index;
        this.propEditShow = true;
        console.log("row:", row);
      } else if ("condition" in row) {
        console.log("row:", row);
      }
    },
    handleCurrentChange(currentPage) {
      this.propNowPage = currentPage;
      this.propValueListInit();
      this.$nextTick(() => {
        // this.component.chartBind.alDeviceManage 是上次选中的数据
        // 对当前页进行数据回显
        console.log("multipleSelectionAll",this.multipleSelectionAll)
          for(let [,value] of this.multipleSelectionAll) {
            value.forEach(row=>{
              this.propValueList.forEach(item => {
                if( row.id == item.id ) 
                  this.$refs.multiplePropTable.toggleRowSelection(item, true);
              });
            })
          }
          // 当前页选中数据存储在Map中
          // this.multipleSelectionAll.set(this.propNowPage, this.tableChecked);
          // 将其他页面选中数据存储在Map中
          // if ( type == 'init') this.findOthertarget();
      });    
    },
    //对zoom变化各行进行处理
    zoomOpen() {
      //初始化zoom条件渲染的参数   转换赋值，避免赋值的对象间相互影响
      const valueOrigin1 = this.layer[this.layoutOrpaint][this.attribute];
      const valueOrigin2 = this.layer[this.layoutOrpaint][this.attribute];
      this.zoomValue[0].value = JSON.parse(JSON.stringify(valueOrigin1));
      this.zoomValue[1].value = JSON.parse(JSON.stringify(valueOrigin2));
      this.zoomValueOrigin = JSON.parse(JSON.stringify(this.zoomValue));

      //先初始化参数，再打开相关编辑面板
      this.menuButtonShowList[this.attribute] = false;
      this.$bus.$emit("show", { param1: this.attribute, param2: false, param4:'zoom'});
      this.zoomShow = true;
      this.zoomEditShow = true;
    },
    dataOpen(row) {
      //初始化data范围渲染的参数
      console.log("datarow", row);
      const valueOrigin1 = this.layer[this.layoutOrpaint][this.attribute];
      const valueOrigin2 = this.layer[this.layoutOrpaint][this.attribute];
      this.dataValue[0].value = JSON.parse(JSON.stringify(valueOrigin1));
      this.dataValue[1].value = JSON.parse(JSON.stringify(valueOrigin2));
      this.dataValueOrigin = JSON.parse(JSON.stringify(this.dataValue));
      this.dataSelect = row.column_name;
      this.getDataRange();
      //先初始化参数，再打开相关编辑面板
      this.menuButtonShowList[this.attribute] = false;
      this.$bus.$emit("show", { param1: this.attribute, param2: false, param4:'data'});
      this.dataShow = true;
      this.dataEditShow = true;
    },
    propOpen(row) {
      this.propSelect = row.column_name;
      this.propValueListInit();
      //初始化prop条件渲染的参数
      const valueOrigin1 = this.layer[this.layoutOrpaint][this.attribute];
      const valueOrigin2 = this.layer[this.layoutOrpaint][this.attribute];
      this.propValue[0].value = JSON.parse(JSON.stringify(valueOrigin1));
      this.propValue[1].value = JSON.parse(JSON.stringify(valueOrigin2));
      this.propValueOrigin = JSON.parse(JSON.stringify(this.propValue));
      //先初始化参数，再打开相关编辑面板
      this.menuButtonShowList[this.attribute] = false;
      this.$bus.$emit("show", { param1: this.attribute, param2: false, param4:'prop'});
      this.propertyShow = true;
      this.propEditShow = true;
    },
    formulaOpen() {
      this.menuButtonShowList[this.attribute] = false;
      this.$bus.$emit("show", { param1: this.attribute, param2: false, param4:'formula'});
      this.formulaShow = true;
    },

    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    zoomInsert() {
      for (let i in this.zoomValue) {
        if (i == 0) {
          continue;
        }
        // 若zoom间不连续则插入
        else if (
          this.zoomValue[i]["zoom"] - this.zoomValue[i - 1]["zoom"] >
          1
        ) {
          let zoom = Number(this.zoomValue[i - 1]["zoom"]) + 1;
          const value = JSON.parse(JSON.stringify(this.zoomValue[i - 1]["value"]));
          const Object = { zoom: zoom, value: value };
          this.zoomValue.splice(i, 0, Object);
          this.zoomEditIndex = i;
          break;
        } else if (i == this.zoomValue.length - 1 && i - 23 < 0) {
          let zoom = Number(this.zoomValue[i]["zoom"]) + 1;
          const value = JSON.parse(JSON.stringify(this.zoomValue[i]["value"]));
          const Object = { zoom: zoom, value: value };
          this.zoomEditIndex = Number(i) + 1;
          this.zoomValue.splice(Number(i) + 1, 0, Object);
          console.log("zoomValuei:", this.zoomValue);
          console.log("zoomEditIndexi:", this.zoomEditIndex);
          break;
        }
      }
      // this.zoomValue.unshift(this.zoomValue[0]);
      this.zoomEditShow = true;
    },
    zoomEditDelete() {
      // console('zoomEditIndex:',this.zoomEditIndex);
      // console.log('zoomValue:');
      // 关闭编辑框要在删除之前，因为删除后涉及到zoomValue的地方会查询zoomEditIndex的内容进行更新
      this.zoomEditShow = false;
      this.zoomValue.splice(this.zoomEditIndex, 1);
      // 防止更新内容出错
      if (this.zoomEditIndex != 0) {
        this.zoomEditIndex = Number(this.zoomEditIndex) - 1;
      }
      //判断，执行类似重置按钮的功能
      if (this.zoomValue.length == 1) {
        this.menuButtonShowList[this.attribute] = true;
        [this.zoomShow, this.dataShow, this.propertyShow, this.formulaShow] = [
          false,
        ];
        this.$bus.$emit("show", { param1: this.attribute, param2: true });
        const value2 = this.zoomValueOrigin;
        this.zoomValue = value2;
        const value1 = this.zoomValueOrigin[0]["value"];
        this.layer[this.layoutOrpaint][this.attribute] = value1;
      } else {
        this.zoomRender();
      }
    },
    zoomEditFirm() {
      this.zoomEditShow = false;
      let Object = this.zoomValue[this.zoomEditIndex];
      let num = Object.zoom;
      this.zoomValue.splice(this.zoomEditIndex, 1);
      // console.log('Object',Object)
      // console.log('num:',num);

      for (let i in this.zoomValue) {
        //js的var是弱类型，默认是string类型，10>2不成立
        if (num - this.zoomValue[i].zoom < 0) {
          this.zoomValue.splice(i, 0, Object);
          // console.log('num:',num);
          // console.log('this.zoomColor[i].zoom:',this.zoomColor[i].zoom);
          break;
        }
        if (i == this.zoomValue.length - 1) {
          console.log("i:", i);
          this.zoomValue.push(Object);
          break;
        }
      }
      //zoom渲染
      this.zoomRender();
      //重置列表排序
      // this.$refs.tableList.sort('zoom', 'ascending')
      // console.log('zoom:',this.zoomColor)
    },
    zoomRender() {
      // 设置多级显示
      let zoomCondition1 = ["interpolate", [this.zoomRate], ["zoom"]];
      let zoomCondition2 = ["step", ["zoom"]];
      let value = [];
      if (this.zoomRate == "linear" || this.zoomRate == "exponential") {
        for (let i in this.zoomValue) {
          zoomCondition1.push(Number(this.zoomValue[i]["zoom"]));
          //js默认为string类型
          if (this.isNum) {
            this.zoomValue[i]["value"] = Number(this.zoomValue[i]["value"])
            zoomCondition1.push(this.zoomValue[i]["value"]);
            value = zoomCondition1;
            console.log("num", this.isNum);
          } else if (this.attribute.includes("color")) {
            zoomCondition1.push(this.zoomValue[i]["value"]);
            value = zoomCondition1;
            console.log("color");
          } else if (this.isArray) {
            this.zoomValue[i]["value"][0] = Number(this.zoomValue[i]["value"][0]);
            this.zoomValue[i]["value"][1] = Number(this.zoomValue[i]["value"][1]);
            let value1 = this.zoomValue[i]["value"][0];
            let value2 = this.zoomValue[i]["value"][1];
            zoomCondition1.push(["literal", [value1, value2]]);
            value = zoomCondition1;
            console.log("array", value1, value2);
          }
        }
      }
      if (
        this.zoomRate == "step" ||
        (!this.isNum && !this.isArray && !this.attribute.includes("color"))
      ) {
        for (let i in this.zoomValue) {
          i == 0 || zoomCondition2.push(Number(this.zoomValue[i]["zoom"])); //step的zoom=0时，只加载value
          if (this.attribute.includes("dasharray")) {
            const value1 = parseInt(this.zoomValue[i]["value"][0]);
            const value2 = parseInt(this.zoomValue[i]["value"][1]);
            this.zoomValue[i]["value"][0] = value1;
            this.zoomValue[i]["value"][1] = value2;
            zoomCondition2.push(["literal", [value1, value2]]);
            value = zoomCondition2;
            console.log("dasharray");
          } else {
            zoomCondition2.push(this.zoomValue[i]["value"]);
            value = zoomCondition2;
            console.log("text");
          }
        }
      }
      console.log("zoomCondition:", value);
      const parameters = {
        value:{zoomValue:this.zoomValue,zoomRate:this.zoomRate,zoomValueOrigin:this.zoomValueOrigin},
        type:'zoom'};
      this.$emit("callback", this.layoutOrpaint, this.attribute, value, parameters);
    },

    //data变化处理
    dataInsert() {
      //按顺序插入中值
      const index = 2 * Number(this.dataInsertIndex) - 1;
      const value = JSON.parse(JSON.stringify(this.dataValue[index - 1].value));
      const data =
        (Number(this.dataValue[index - 1].data) +
          Number(this.dataValue[index].data)) /
        2;
      this.dataValue.splice(index, 0, { data: data, value: value });
      this.dataInsertIndex = this.dataInsertIndex + 1;
      if (this.dataInsertIndex == this.datalength) {
        this.datalength = this.dataValue.length;
        this.dataInsertIndex = 1;
      }
    },
    dataEditFirm() {
      this.dataEditShow = false;
      //根据data值，进行数据的排序
      let Object = this.dataValue[this.dataEditIndex];
      let num = Object.data;
      this.dataValue.splice(this.dataEditIndex, 1);      
      for (let i in this.dataValue) {
        //js的var是弱类型，默认是string类型，10>2不成立
        if (num - this.dataValue[i].data < 0) {
          this.dataValue.splice(i, 0, Object);
          break;
        }
        if (i == this.dataValue.length - 1) {
          console.log("i:", i);
          this.dataValue.push(Object);
          break;
        }
      }      
      // 设置多级显示
      let dataCondition1 = [
        "interpolate",
        [this.dataRate],
        ["get", this.dataSelect],
      ];
      let dataCondition2 = ["step", ["get", this.dataSelect]];
      let value = [];
      if (this.dataRate == "linear" || this.dataRate == "exponential") {
        for (let i in this.dataValue) {
          dataCondition1.push(Number(this.dataValue[i]["data"]));
          //js默认为string类型
          if (this.isNum) {
            dataCondition1.push(Number(this.dataValue[i]["value"]));
            value = dataCondition1;
            console.log("num", this.isNum);
          } else if (this.attribute.includes("color")) {
            dataCondition1.push(this.dataValue[i]["value"]);
            value = dataCondition1;
            console.log("color");
          } else if (this.isArray) {
            let value1 = Number(this.dataValue[i]["value"][0]);
            let value2 = Number(this.dataValue[i]["value"][1]);
            this.dataValue[i]["value"][0] = JSON.parse(JSON.stringify(value1));
            this.dataValue[i]["value"][1] = JSON.parse(JSON.stringify(value2));
            dataCondition1.push(["literal", [value1, value2]]);
            value = dataCondition1;
            console.log("array", value1, value2);
          }
        }
      }
      if (
        this.dataRate == "step" ||
        (!this.isNum && !this.isArray && !this.attribute.includes("color"))
      ) {
        for (let i in this.dataValue) {
          if(this.isNum){
            this.dataValue[i]["data"] = Number(this.dataValue[i]["data"]);
          }
          i == 0 || dataCondition2.push(this.dataValue[i]["data"]); //step的data=0时，只加载value
          if (this.attribute.includes("dasharray")) {
            if(this.isNum){
              this.dataValue[i]["value"][0] = Number(this.dataValue[i]["value"][0]);
              this.dataValue[i]["value"][1] = Number(this.dataValue[i]["value"][1]);
            }            
            const value1 = this.dataValue[i]["value"][0];
            const value2 = this.dataValue[i]["value"][1];
            this.dataValue[i]["value"][0] = value1;
            this.dataValue[i]["value"][1] = value2;
            dataCondition2.push(["literal", [value1, value2]]);
            value = dataCondition2;
            console.log("dasharray");
          } else if(this.attribute.includes("image")){
            dataCondition2.push(this.dataValue[i]["value"]);
            value = dataCondition2;
            console.log("text");
          }else {
            if(this.isNum){
              this.dataValue[i]["value"] = Number(this.dataValue[i]["value"]);
            }            
            dataCondition2.push(this.dataValue[i]["value"]);
            value = dataCondition2;
            console.log("num");
          }
        }
      }
      const parameters = 
        {value:{dataValue:this.dataValue,dataRange:this.dataRange,dataSelect:this.dataSelect,dataValueOrigin:this.dataValueOrigin,
         datalength:this.datalength,dataInsertIndex:this.dataInsertIndex,dataRate:this.dataRate},type:'data'};
      this.$emit("callback", this.layoutOrpaint, this.attribute, value, parameters);
    },
    getDataRange() {
      if(this.layer.sourceType == "pgDefault"){
        requestApi
          .getMaxMinAttrValue({
            attrName: this.dataSelect,
            shpTableName: this.layer["source-layer"],
          })
          .then((res) => {
            const value = res.data.data;
            this.dataRange = {
              min: parseFloat(value.min.toFixed(2)),
              max: parseFloat(value.max.toFixed(2)),
            };
            this.dataValue[0].data = parseFloat(value.min);
            this.dataValue[1].data = parseFloat(value.max);
            console.log("datarange", this.dataRange);
          })
          .catch((err) => {
            console.log("err", err);
          });
      }else if(this.layer.sourceType == "pgMulti"){
        requestApi
          .getMaxMinAttrMultiPg(this.layer.mutiPgInfo.ip,this.layer.mutiPgInfo.port,{
            attrName: this.dataSelect,
            shpTableName: this.layer["source-layer"],
          })
          .then((res) => {
            const value = res.data.data;
            this.dataRange = {
              min: parseFloat(value.min.toFixed(2)),
              max: parseFloat(value.max.toFixed(2)),
            };
            this.dataValue[0].data = parseFloat(value.min);
            this.dataValue[1].data = parseFloat(value.max);
            console.log("datarange", this.dataRange);
          })
          .catch((err) => {
            console.log("err", err);
          });        
      }

    },
    dataEditDelete() {
      this.dataEditShow = false;
      this.dataValue.splice(this.dataEditIndex, 1);
      // 防止更新内容出错
      if (this.dataEditIndex != 0) {
        this.dataEditIndex = Number(this.dataEditIndex) - 1;
      }
      //判断，执行类似重置按钮的功能
      if (this.dataValue.length == 1) {
        this.dataEditIndex = 1;
        this.menuButtonShowList[this.attribute] = true;
        [this.dataShow, this.dataShow, this.dataertyShow, this.formulaShow] = [
          false,
        ];
        this.$bus.$emit("show", { param1: this.attribute, param2: true });
        const value2 = this.dataValueOrigin;
        this.dataValue = value2;
        const value1 = this.dataValueOrigin[0]["value"];
        console.log("dataValueOrigin:", this.dataValueOrigin);

        this.layer[this.layoutOrpaint][this.attribute] = value1;
      } else {
        this.dataEditFirm();
      }
    },

    //propperty变化处理
    handleTagClose(tag) {
      this.propValueFilter[this.propEditIndex].splice(
        this.propValueFilter[this.propEditIndex].indexOf(tag),
        1
      );
      console.log("tag", tag);
      console.log("propValue:", this.propValueFilter);
    },
    propValueListInit() {
      if(this.layer.sourceType == "pgDefault"){
        requestApi
          .getAttrValue({
            aimAttrName: this.propSelect,
            aimShpTableName: this.layer["source-layer"],
            page: this.propNowPage,
            pageSize: 10,
            searchText: this.propSearch,
            sort: "asc",
          })
          .then((res) => {
            console.log("res", res);
            this.propValueList = res.data.data.attrValue;
            this.allpropValueListLength = res.data.data.featureCount;
            console.log("propValueList", this.propValueList);
          })
          .catch((error) => {
            console.log(error);
          });
      }else if(this.layer.sourceType == "pgMulti"){
        requestApi
          .getAttrValueMultiPg(this.layer.mutiPgInfo.ip,this.layer.mutiPgInfo.port,{
            aimAttrName: this.propSelect,
            aimShpTableName: this.layer["source-layer"],
            page: this.propNowPage,
            pageSize: 10,
            searchText: this.propSearch,
            sort: "asc",
          })
          .then((res) => {
            console.log("res", res);
            this.propValueList = res.data.data.attrValue;
            this.allpropValueListLength = res.data.data.featureCount;
            console.log("propValueList", this.propValueList);
          })
          .catch((error) => {
            console.log(error);
          });
      }        

    },
    propInsert() {
      this.propValue.push({ prop: "" });
      this.propEditIndex = this.propValue.length - 1;
      this.propEditShow = true;
    },
    propEditDelete() {
      this.propEditShow = false;
      this.propValue.splice(this.propEditIndex, 1);
      this.propValueFilter.splice(this.propEditIndex, 1);
      // 防止更新内容出错
      if (this.propEditIndex != 0) {
        this.propEditIndex = Number(this.propEditIndex) - 1;
      }
      //判断，执行类似重置按钮的功能
      if (this.propValue.length == 1) {
        this.propEditIndex = 1;
        this.menuButtonShowList[this.attribute] = true;
        [this.propShow, this.dataShow, this.propertyShow, this.formulaShow] = [
          false,
        ];
        this.$bus.$emit("show", { param1: this.attribute, param2: true });
        const value2 = this.propValueOrigin;
        this.propValue = value2;
        const value1 = this.propValueOrigin[0]["value"];
        this.layer[this.layoutOrpaint][this.attribute] = value1;
      } else {
        this.propEditFirm();
      }
    },
    propEditFirm() {
      this.propEditShow = false;
      // let propCondition = ["case",["match",["get",this.propSelect],['坝尾广东省汕头市龙湖区'],true,false,'#00CED1'],this.propValue[0].value];
      //属性条件渲染
      let value = ["case"];
      let num = 1;
      console.log("propValueFilter", this.propValueFilter);
      for (let i in this.propValueFilter) {
        let template = ["match", ["get", this.propSelect], [], true, false];
        for (let j in this.propValueFilter[i]) {
          const value1 = this.propValueFilter[i][j][this.propSelect];
          template[2].push(value1);
        }
        // 第一步 添加条件
        value.push(template);
        // 第二步 添加参数值
        if(this.isNum){
          this.propValue[num].value = Number(this.propValue[num].value);
        }
        //数组和其他类型不同形式
        let results = this.propValue[num].value;
        if(this.isArray){
          let value1 = Number(this.propValue[i]["value"][0]);
          let value2 = Number(this.propValue[i]["value"][1]);
          this.propValue[i]["value"][0] = JSON.parse(JSON.stringify(value1));
          this.propValue[i]["value"][1] = JSON.parse(JSON.stringify(value2));
          results = ["literal", [value1, value2]];
        }          
        value.push(results);
        num++;
      }
      //数字类型
      if(this.isNum){
        this.propValue[0].value = Number(this.propValue[0].value);
      }
      let resultDefault = this.propValue[0].value;
      //数组类型
      if(this.isArray){
        let value1 = Number(this.propValue[0]["value"][0]);
        let value2 = Number(this.propValue[0]["value"][1]);
        this.propValue[0]["value"][0] = JSON.parse(JSON.stringify(value1));
        this.propValue[0]["value"][1] = JSON.parse(JSON.stringify(value2));
        resultDefault = ["literal", [value1, value2]];
        this.propValue[0]["value"] = Number(this.propValue[0].value);
      }      
      value.push(resultDefault);
      const parameters = {
        value:{propValue:this.propValue,propSelect:this.propSelect,propValueFilter:this.propValueFilter,
        propValueList:this.propValueList,propValueOrigin:this.propValueOrigin},
        type:'prop'}
      this.$emit("callback", this.layoutOrpaint, this.attribute, value, parameters);
    },
    propFilterChange(val) {
      this.propValueFilter[this.propEditIndex] = val;
      this.multipleSelectionAll.set(this.propNowPage,val);
      console.log("select", val);
    },
    selectall(selection){
      console.log("selection:",selection)
    },
    getRowKey(row){
      return row.id
    },
    //将选中的filter值更新到propValue中
    propFilterConfirm() {
      this.$refs.propValuePopover.doClose();
      let string = "";
      for (let i in this.propValueFilter[this.propEditIndex]) {
        const value =
          this.propValueFilter[this.propEditIndex][i][this.propSelect];
        if (i == 0) {
          string = value;
        } else {
          string = string + "," + value;
        }
      }
      this.propValue[this.propEditIndex].prop = string;
      console.log("propValue", this.propValue);
    },
    //将input框添加的内容更新到propFilter中,暂不加此功能
    // propInputChange(val){
    //   if(val.endsWith(',')){val = val.substr(0,val.length-1)}
    //   this.propValueFilter[this.propEditIndex] = val.split(",");
    // },

    //表达式功能
    formulaRender() {
      var a = this.formulaValue.replaceAll(" ", "");
      var b = a.replaceAll("\n", "");
      //查找字符串中()和[]的内容
      var reg1 = new RegExp(/\([^)]*\)/g);
      var reg2 = new RegExp(/\[[^)]*\]/g);
      var circleList = b.match(reg1);
      var squareList = b.match(reg2);
      var c = b.replaceAll(reg1, "@");
      var d = c.replaceAll(reg2, "!");
      var e = d.replaceAll(",", "。");
      for (let i in circleList) {
        e = e.replace(/@/, circleList[i]);
        console.log("e1", e);
        console.log("circleList", circleList[i]);
      }
      for (let i in squareList) {
        e = e.replace(/!/, squareList[i]);
        console.log("e2", e);
        console.log("squareList", squareList[i]);
      }

      var array = [];
      var start = 0;
      var end = 0;
      while (e.indexOf("。", start) != -1) {
        start = end + 1;
        end = e.indexOf("。", start);
        let f = e.slice(start, end);
        if (!f.includes("'") && !f.includes('"')) {
          f = Number(f);
        }
        f = f.replaceAll('"', "'");
        array.push(f);
      }
      console.log("array", array);

      const value = e.split('。');
      const parameters = {value:{formulaValue:this.formulaValue,formValueOrigin:this.formValueOrigin},type:'formula'}
      console.log('formulaValue2',value);
      this.$emit("callback",this.layoutOrpaint,this.attribute,value, parameters);
    },

    //图标层
    spriteSelect(item,type) {
      switch(type){
        case 'zoom':
          this.zoomValue[this.zoomEditIndex].value = item;
          break
        case 'data':
          this.dataValue[this.dataEditIndex].value = item;
          break
        case 'prop':
          this.propValue[this.propEditIndex].value = item;
          break
      }
      this.$refs.iconPopover.doClose();
    },
    iconSelect(item) {
      this.zoomValue[this.zoomEditIndex].value = item.originName;
      this.$refs.iconPopover.doClose();     
    },    

    test() {
      // console.log(tab, event);
      this.menuButtonShowList[this.attribute] = true;
      [this.zoomShow, this.dataShow, this.propertyShow, this.formulaShow] = [
        false,
      ];
      // console.log('layer',this.layer)
      //       const value = [
      // 'interpolate',
      // ['exponential', 0.5],
      // ['zoom'],
      // 2,
      // '#D9D3C9',
      // 3,
      // '#ffd700'
      // ]
      // const value = '#1E90FF';
      // this.$emit("callback",'paint','circle-color',value);
    },
  },
  created() {
    this.initInfo();
  },
  mounted() {},
};
</script>
<style scoped>
.box {
  width: 200px;
  padding: 0px 10px 10px 0px;
}
.menuButton {
  width: 100%;
  margin: 5px 0;
  padding: 12px 0;
}
.box .el-table--fit {
  box-sizing: content-box;
  border: 1px solid #dcdfe6;
  border-bottom: none;
  border-radius: 4px;
}
.zoomDasharray {
  height: 150px;
  overflow-y: scroll;
}
.zoomDasharray::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
/* 属性条件table滚动条 */
/* .attList .el-table__body{
  height: 10vh;
} */
/* .attList .el-table__body-wrapper.is-scrolling-none{

} */
</style>
