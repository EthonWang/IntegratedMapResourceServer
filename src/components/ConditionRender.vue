<template>
  <div class="box" >
    <el-row v-if="menuButtonShow">
      <el-button v-if="!attribute.includes('translate-anchor') && !attribute.includes('pitch-alignment') && !attribute.includes('pitch-scale') && !attribute.includes('gradient')" 
                 :disabled="attribute == 'fill-outline-color' && layer['paint']['fill-antialias'] == false" class="menuButton" plain @click="zoomOpen">按级别范围设置样式</el-button>
      <!-- data范围popover样式 若两个popover都是用v-popover会出错-->
      <el-popover
        placement="right"
        width="400"
        trigger="click">
        <span>筛选字段</span>
        <el-table :data="dataOptions.filter(data => !search || data.value.toLowerCase().includes(search.toLowerCase()))" 
                  :cell-style="{textAlign:'left'}" @row-click="menuButtonShow = false;dataShow = true">          
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
        <el-button v-if="!attribute.includes('translate-anchor') && !attribute.includes('pitch-alignment') && !attribute.includes('pitch-scale') && !attribute.includes('cap') && !attribute.includes('dasharray') && !attribute.includes('antialias') && attribute.slice(-9) != 'translate' && !attribute.includes('gradient')"  
                   :disabled="attribute == 'fill-outline-color' && layer['paint']['fill-antialias'] == false" slot="reference" class="menuButton" plain @click="dataOpen">按数据范围设置样式</el-button>
      </el-popover>  
      <!-- 属性条件popover样式 -->
      <el-popover
        placement="right"
        width="400"
        trigger="click">
        <span>选择字段</span>
        <el-table :data="attributeList.filter(data => !search || data.column_name.toLowerCase().includes(search.toLowerCase()))" 
                  :cell-style="{textAlign:'left'}" class="attList" @row-click="menuButtonShow = false;attributeShow = true">                                 
          <el-table-column
            prop="column_name"
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
        <el-button v-if="!attribute.includes('translate-anchor') && !attribute.includes('pitch-alignment') && !attribute.includes('pitch-scale') && !attribute.includes('cap') && !attribute.includes('dasharray') && !attribute.includes('antialias') && attribute.slice(-9) != 'translate' && attribute.slice(-9) != 'translate' && !attribute.includes('gradient')"
                   :disabled="attribute == 'fill-outline-color' && layer['paint']['fill-antialias'] == false" slot="reference" class="menuButton" plain>按属性条件设置样式</el-button>
      </el-popover>            
      <el-button v-if="!attribute.includes('translate-anchor') && !attribute.includes('pitch-alignment') && !attribute.includes('pitch-scale') && !attribute.includes('cap') && !attribute.includes('dasharray') && !attribute.includes('antialias') && attribute.slice(-9) != 'translate' && !attribute.includes('join')  && !attribute.includes('gradient')" 
                 class="menuButton" plain @click="menuButtonShow = false;formulaShow = true"
                 :disabled="attribute == 'fill-outline-color' && layer['paint']['fill-antialias'] == false">按表达式设置样式</el-button>
      <el-button class="menuButton" plain @click="reset('close')">重置</el-button>
    </el-row>
    <!-- zoom编辑框 -->
    <el-row v-if="zoomShow">
      <el-button v-if="isNum || attribute.slice(-9) == 'translate' || attribute.includes('color')" style="margin-bottom:10px;padding-left:10px;padding-right:50%;width:100%;" @click="rateEditShow = true">
        <span>变化率：&nbsp;&nbsp;</span>{{Rate}}
      </el-button>        
      <el-dialog
        :visible.sync="rateEditShow"
        width="30%"
        center :close-on-click-modal = false
        :modal= false :show-close= false>
        <span>变化率：</span>&nbsp;&nbsp;
        <el-select v-model="Rate1" placeholder="插值类型" style="width:73%">
          <el-option
            v-for="item in [{value: 'linear',label: 'linear'},{value: 'exponential',label: 'exponential'},{value: 'cubic-bezier',label: 'cubic-bezier'}]"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> 
        <el-row>{{rateContent[Rate]}}</el-row>               
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="rateEditShow = false">取 消</el-button> -->
          <el-button type="primary" @click="rateEditShow = false;Rate = Rate1">确 定</el-button>
        </span>            
      </el-dialog> 
      <el-table
        ref="tableList"
        :data="zoomValue"
        style="width: 100%"
        class="tableCondition"
        :row-class-name="tableRowClassName"
        @row-click="handleZoomEdit"
        >
        <el-table-column
          prop="zoom"
          label="缩放"
          width="80%">
        </el-table-column>
        <el-table-column
          :label="tabName[attribute]"
          width="120%">         
          <template slot-scope="scope">
            <el-row v-if="attribute.includes('color')">
              <div class="el-icon-s-grid" :style="{'color': scope.row.value}"></div>
              <span style="margin-left: 10px">{{ scope.row.value }}</span>
            </el-row>
            <el-row v-if="attribute.includes('radius')||attribute.includes('width')||attribute.includes('blur')||attribute.includes('gap-width')||attribute.includes('offset')">
              <span style="margin-left: 10px">{{ scope.row.value }}&nbsp;px</span>
            </el-row>                       
            <el-row v-if="attribute.includes('opacity')||attribute.includes('translate')||attribute.includes('dasharray')||attribute.includes('line-cap')|| attribute.includes('join')||attribute.includes('fill-antialias')||attribute.includes('gradient')">
              <span style="margin-left: 10px">{{ scope.row.value }}</span>
            </el-row>            
            <el-row v-if="attribute.includes('height')||attribute.includes('base')">
              <span style="margin-left: 10px">{{ scope.row.value }}&nbsp;meters</span>
            </el-row>
            <!-- <el-row v-else>
              <span style="margin-left: 10px">{{ scope.row.value }}</span>
            </el-row>                -->
          </template> 
        </el-table-column>
      </el-table>
      <el-button
        type = "text"
        @click="zoomInsert"
      >+ 增加zoom级别条件
      </el-button>
      <el-dialog
        title="zoom条件编辑"
        :visible.sync="zoomEditShow"
        width="30%"
        :show-close = false
        center :close-on-click-modal = false
        :modal= false>
        <el-row>
          <el-input v-model="zoomValue[zoomEditIndex].zoom"
                    placeholder="something" style="width:80%">
            <template slot="prepend" body-style="padding:0">zoom:</template>
          </el-input>              
        </el-row>
        <br>
        <el-row v-if="attribute.includes('color')" style="display:flex">         
          <el-input v-model="zoomValue[zoomEditIndex].value"
                    placeholder="something" style="width:80%">
            <template slot="prepend" >color:&nbsp;</template>
          </el-input>
          <el-color-picker
              v-model="zoomValue[zoomEditIndex].value"
              :predefine="predefineColors">
          </el-color-picker>               
        </el-row>
        <el-row v-if="attribute.includes('opacity')" style="display:flex"> 
          <el-input v-model="zoomValue[zoomEditIndex].value"
                    placeholder="something" style="width:80%">
            <template slot="prepend" body-style="padding:0">{{tabName[attribute]}}:</template>
          </el-input>                  
        </el-row>        
        <el-row v-if="attribute.includes('radius')||attribute.includes('width')||attribute.includes('blur')||attribute.includes('gap-width')||attribute.includes('offset')"> 
          <el-input v-model="zoomValue[zoomEditIndex].value"
                    placeholder="something" style="width:80%">
            <template slot="prepend" body-style="padding:0">{{tabName[attribute]}}:</template>
            <template slot="append">px</template>
          </el-input>                  
        </el-row>
        <el-row v-if="attribute.includes('height')||attribute.includes('base')"> 
          <el-input v-model="zoomValue[zoomEditIndex].value"
                    placeholder="something" style="width:80%">
            <template slot="prepend" body-style="padding:0">{{tabName[attribute]}}:</template>
            <template slot="append">meters</template>
          </el-input>                  
        </el-row>        
        <el-row v-if="attribute.includes('translate')"> 
          <el-input v-model="zoomValue[zoomEditIndex].value[0]"
                    placeholder="something" style="width:80%">
            <template slot="prepend" body-style="padding:0">x轴方向平移:</template>
            <template slot="append">px</template>
          </el-input> 
          <br><br>                 
          <el-input v-model="zoomValue[zoomEditIndex].value[1]"
                    placeholder="something" style="width:80%">
            <template slot="prepend" body-style="padding:0">y轴方向平移:</template>
            <template slot="append">px</template>
          </el-input>           
        </el-row>        
        <el-row v-if="attribute.includes('dasharray')"> 
          <el-row class="zoomDasharray">
            <div class="flexRowSpaceAround"
                v-for="(item, index) in zoomValue[zoomEditIndex].value"
                :key="index"
                style="height: 40px;">
              <h4 v-if="index %2 ==0">实部:</h4>
              <h4 v-else>虚部:</h4>
              <el-input-number v-model="zoomValue[zoomEditIndex].value[index]"
                              :min="0"
                              size="small"
                              label="描述文字">
              </el-input-number>&nbsp;
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="zoomValue[zoomEditIndex].value.splice(index,1)"></el-button>
            </div>
          </el-row>  
          <el-button type="primary" round size="mini" @click="layer.paint['line-dasharray'].push(0)">添加虚线设置
          </el-button>                           
        </el-row>        
        <el-row v-if="attribute.includes('line-cap') || attribute.includes('join')" type="flex" align= "middle" > 
          <h4>{{tabName[attribute]}}:&nbsp;</h4>
          <el-select v-model="zoomValue[zoomEditIndex].value" placeholder="请选择">
            <el-option
                v-for="item in [{label:'平直 butt',value:'butt'},{label:'圆形 round',value:'round'},{label:'方形 square',value:'square'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>                                  
        </el-row> 
        <el-row v-if="attribute.includes('join')" type="flex" align= "middle" > 
          <h4>{{tabName[attribute]}}:&nbsp;</h4>
          <el-select v-model="zoomValue[zoomEditIndex].value" placeholder="请选择">
            <el-option
                v-for="item in [{label:'尖角 miter',value:'miter'},{label:'圆角 round',value:'round'},{label:'斜角 bevel',value:'bevel'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>                                  
        </el-row>         
        <el-row v-if="attribute.includes('fill-antialias') || attribute.includes('gradient')" style="display:flex"> 
          <el-switch v-model="zoomValue[zoomEditIndex].value">
          </el-switch>                           
        </el-row>         
                 
        <span slot="footer" class="dialog-footer">
          <el-button @click="zoomEditDelete">删除</el-button>
          <el-button type="primary" @click="zoomEditFirm">确 定</el-button>
        </span>            
      </el-dialog>      
    </el-row>
    <!-- data编辑框 -->
    <el-row v-if="dataShow">
      <el-button v-if="isNum || attribute.slice(-9) == 'translate' || attribute.includes('color')" style="margin-bottom:10px;padding-left:10px;padding-right:50%;width:100%;" @click="rateEditShow = true">
        <span>变化率：&nbsp;&nbsp;</span>{{Rate}}
      </el-button> 
      <el-dialog
        :visible.sync="rateEditShow"
        width="30%"
        center :close-on-click-modal = false
        :modal= false :show-close= false>
        <span>变化率：</span>&nbsp;&nbsp;
        <el-select v-model="Rate1" placeholder="插值类型" style="width:73%">
          <el-option
            v-for="item in [{value: 'linear',label: 'linear'},{value: 'exponential',label: 'exponential'},{value: 'cubic-bezier',label: 'cubic-bezier'}]"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> 
        <el-row>{{rateContent[Rate]}}</el-row>               
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="rateEditShow = false">取 消</el-button> -->
          <el-button type="primary" @click="rateEditShow = false;Rate = Rate1">确 定</el-button>
        </span>            
      </el-dialog> 
      <el-table
        ref="tableList"
        :data="zoomValue"
        style="width: 100%"
        class="tableCondition"
        :row-class-name="tableRowClassName"
        @row-click="handleZoomEdit"
        >
        <el-table-column
          prop="zoom"
          label="缩放"
          width="80%">
        </el-table-column>
        <el-table-column
          :label="tabName[attribute]"
          width="120%">         
          <template slot-scope="scope">
            <el-row v-if="attribute.includes('color')">
              <div class="el-icon-s-grid" :style="{'color': scope.row.value}"></div>
              <span style="margin-left: 10px">{{ scope.row.value }}</span>
            </el-row>
            <el-row v-if="attribute.includes('radius')||attribute.includes('width')||attribute.includes('blur')||attribute.includes('gap-width')||attribute.includes('offset')">
              <span style="margin-left: 10px">{{ scope.row.value }}&nbsp;px</span>
            </el-row>                       
            <el-row v-if="attribute.includes('opacity')||attribute.includes('translate')||attribute.includes('dasharray')||attribute.includes('line-cap')|| attribute.includes('join')||attribute.includes('fill-antialias')||attribute.includes('height')">
              <span style="margin-left: 10px">{{ scope.row.value }}</span>
            </el-row>            
            <el-row v-if="attribute.includes('height')">
              <span style="margin-left: 10px">{{ scope.row.value }}&nbsp;meters</span>
            </el-row>
            <!-- <el-row v-else>
              <span style="margin-left: 10px">{{ scope.row.value }}</span>
            </el-row>                -->
          </template> 
        </el-table-column>
      </el-table>
      <el-button
        type = "text"
        @click="zoomInsert"
      >+ 增加zoom级别条件
      </el-button>
      <el-dialog
        title="zoom条件编辑"
        :visible.sync="zoomEditShow"
        width="30%"
        :show-close = false
        center :close-on-click-modal = false
        :modal= false>
        <el-row>
          <el-input v-model="zoomValue[zoomEditIndex].zoom"
                    placeholder="something" style="width:80%">
            <template slot="prepend" body-style="padding:0">zoom:</template>
          </el-input>              
        </el-row>
        <br>
        <el-row v-if="attribute.includes('color')" style="display:flex">         
          <el-input v-model="zoomValue[zoomEditIndex].value"
                    placeholder="something" style="width:80%">
            <template slot="prepend" >color:&nbsp;</template>
          </el-input>
          <el-color-picker
              v-model="zoomValue[zoomEditIndex].value"
              :predefine="predefineColors">
          </el-color-picker>               
        </el-row>
        <el-row v-if="attribute.includes('opacity')" style="display:flex"> 
          <el-input v-model="zoomValue[zoomEditIndex].value"
                    placeholder="something" style="width:80%">
            <template slot="prepend" body-style="padding:0">{{tabName[attribute]}}:</template>
          </el-input>                  
        </el-row>        
        <el-row v-if="attribute.includes('radius')||attribute.includes('width')||attribute.includes('blur')||attribute.includes('gap-width')||attribute.includes('offset')"> 
          <el-input v-model="zoomValue[zoomEditIndex].value"
                    placeholder="something" style="width:80%">
            <template slot="prepend" body-style="padding:0">{{tabName[attribute]}}:</template>
            <template slot="append">px</template>
          </el-input>                  
        </el-row>
        <el-row v-if="attribute.includes('translate')"> 
          <el-input v-model="zoomValue[zoomEditIndex].value[0]"
                    placeholder="something" style="width:80%">
            <template slot="prepend" body-style="padding:0">x轴方向平移:</template>
            <template slot="append">px</template>
          </el-input> 
          <br><br>                 
          <el-input v-model="zoomValue[zoomEditIndex].value[1]"
                    placeholder="something" style="width:80%">
            <template slot="prepend" body-style="padding:0">y轴方向平移:</template>
            <template slot="append">px</template>
          </el-input>           
        </el-row>        
        <el-row v-if="attribute.includes('dasharray')"> 
          <el-row class="zoomDasharray">
            <div class="flexRowSpaceAround"
                v-for="(item, index) in zoomValue[zoomEditIndex].value"
                :key="index"
                style="height: 40px;">
              <h4 v-if="index %2 ==0">实部:</h4>
              <h4 v-else>虚部:</h4>
              <el-input-number v-model="zoomValue[zoomEditIndex].value[index]"
                              :min="0"
                              size="small"
                              label="描述文字">
              </el-input-number>&nbsp;
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="zoomValue[zoomEditIndex].value.splice(index,1)"></el-button>
            </div>
          </el-row>  
          <el-button type="primary" round size="mini" @click="layer.paint['line-dasharray'].push(0)">添加虚线设置
          </el-button>                           
        </el-row>        
        <el-row v-if="attribute.includes('line-cap') || attribute.includes('join')" type="flex" align= "middle" > 
          <h4>{{tabName[attribute]}}:&nbsp;</h4>
          <el-select v-model="zoomValue[zoomEditIndex].value" placeholder="请选择">
            <el-option
                v-for="item in [{label:'平直 butt',value:'butt'},{label:'圆形 round',value:'round'},{label:'方形 square',value:'square'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>                                  
        </el-row> 
        <el-row v-if="attribute.includes('fill-antialias')" style="display:flex"> 
          <el-switch v-model="zoomValue[zoomEditIndex].value">
          </el-switch>                           
        </el-row>         
                 
        <span slot="footer" class="dialog-footer">
          <el-button @click="zoomEditDelete">删除</el-button>
          <el-button type="primary" @click="zoomEditFirm">确 定</el-button>
        </span>            
      </el-dialog>             
    </el-row>
    <el-row v-if="attributeShow">3</el-row>
    <el-row v-if="formulaShow">4</el-row>

    <el-button v-if="!menuButtonShow" class="menuButton" plain @click="reset('open')">重置</el-button>
    <el-button class="menuButton" plain @click="test">test</el-button>


  </div>
</template>
<script>
export default {
  name: 'ConditionRender',
  props: ['layerSelect','tab'],
  data () {
    return {
      //渲染方式显示设置
      zoomShow: false,
      dataShow: false,
      attributeShow: false,
      formulaShow: false,
      menuButtonShow: true,

      //所用参数
      layer: this.layerSelect, 
      layoutOrpaint: '', 
      attribute: this.tab,           //重新赋值可以对父组件传来的参数进行修改
      search: '',
      layerOrigin: [],
      zoomValueOrigin: [],
      attributeList: [],
      //添加新属性，要更新下列属性
      tabName: {'circle-color':'颜色','circle-radius':'半径','circle-opacity':'透明度','circle-stroke-color':'边线颜色','circle-stroke-width':'边线宽度','circle-stroke-opacity':'边线不透明度','circle-blur':'模糊','circle-translate':'平移','circle-translate-anchor':'平移参考','circle-pitch-alignment':'倾斜对齐','circle-pitch-scale':'倾斜缩放',
                'line-color':'颜色','line-width':'线宽','line-opacity':'不透明度','line-dasharray':'虚线','line-gap-width':'线间隙','line-blur':'模糊','line-translate':'平移','line-translate-anchor':'平移参考','line-offset':'偏移','line-cap':'线帽','line-join':'线连接',
                'fill-color':'颜色','fill-opacity':'不透明度','fill-outline-color':'边线颜色','fill-translate':'平移','fill-translate-anchor':'平移参考','fill-antialias':'抗锯齿',
                'fill-extrusion-color':'颜色','fill-extrusion-height':'高度','fill-extrusion-base':'底部高度','fill-extrusion-opacity':'不透明度','fill-extrusion-translate':'平移','fill-extrusion-translate-anchor':'平移参考','fill-extrusion-vertical-gradient':'渐变填充'},
      numAttribute: ['circle-radius','circle-opacity','circle-stroke-opacity','circle-stroke-width','circle-stroke-opacity','circle-blur','line-width','line-opacity','line-gap-width','line-blur','line-offset','fill-opacity','fill-extrusion-height','fill-extrusion-base','fill-extrusion-opacity'],
      arrayAttribute: ['circle-translate','line-translate','fill-translate','fill-extrusion-translate'],     //'line-dasharray'另外提出

      isNum: false,
      isArray: false,

      //zoom范围条件
      colorInit: '',
      zoomValue: [{zoom:0},{zoom:24}],    //先不设置value属性，不同地物属性value类型不同
      zoomEditShow: false,
      zoomEditIndex: 0,
      zoomCondition: [],       //是否需要interpolate渲染

      //data范围条件
      dataOptions: [{'value':'z-index'}],

      //attribute范围条件
      attributeOptions: [{'value':'z-index'}],      


      //插值类型
      value: '',
      Rate: '',
      Rate1: 'linear',
      rateEditShow: false,
      rateContent: {linear:'线性：在刚好小于和刚好大于输入的停止点对之间进行线性插值。',exponential:'指数：在小于和大于输入的停靠点之间以指数方式插值。','cubic-bezier':'贝塞尔曲线：使用由给定控制点定义的三次贝塞尔曲线进行插值。'},

      //默认数据
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585'],      
      valueDefault: {
        line: {
          "layout": {
            "line-cap": "butt2", //One of "butt", "round", "square"
            "line-join": "miter",  //One of "bevel", "round", "miter"
            "line-miter-limit": 2,
            "line-round-limit": 1.05,
            "visibility":"visible",
            // "line-sort-key":999
          },
          "paint": {
            "line-blur": 0,
            "line-color":"#000000",
            "line-dasharray": [],
            "line-gap-width": 0,
            // "line-gradient":"",  //ignore  Requires source to be "geojson".
            "line-offset": 0,
            "line-opacity": 1,
            // "line-pattern": "",  //ignore  Optional resolvedImage.
            "line-translate": [0,0],
            "line-translate-anchor": "map", //One of "map", "viewport".
            "line-width": 1,
          }
        },
        circle: {
          "layout": {
            "visibility": "visible", //One of "visible", "none"
            // "circle-sort-key":999,
          },
          "paint": {
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
          }
        },
        fill: {
          "layout": {
            "visibility": "visible", //One of "visible", "none"
            // "fill-sort-key":999
          },
          "paint": {
            "fill-antialias": true,
            "fill-color": "#000000",
            "fill-opacity": 1,
            "fill-outline-color": "#000000",
            //"fill-pattern":''  //ignore  Optional resolvedImage.
            "fill-translate": [0, 0],
            "fill-translate-anchor": "map", // One of "map", "viewport"
          }
        }        
      },
    }
  },
  methods: {
    initInfo(){
      // 保留原样式用于重置,
      if(this.layerOrigin == ''){
        this.layerOrigin = JSON.parse(JSON.stringify(this.layerSelect));
      }
      // console.log("layerOrigin:",this.layerOrigin);
      // console.log("attribute:",this.attribute);
      // 判断样式tab属于layout还是paint
      if (Object.prototype.hasOwnProperty.call(this.layer.layout, this.attribute)) {
        this.layoutOrpaint = 'layout';
      }      
      else if (Object.prototype.hasOwnProperty.call(this.layer.paint, this.attribute)) {
        this.layoutOrpaint = 'paint';
      }  
      else{
        this.$message('数据layout和paint属性有误');
      }
      const valueOrigin1 = JSON.parse(JSON.stringify(this.layerSelect[this.layoutOrpaint][this.attribute]));
      const valueOrigin2 = JSON.parse(JSON.stringify(this.layerSelect[this.layoutOrpaint][this.attribute]));
      this.zoomValue[0].value = valueOrigin1;
      this.zoomValue[1].value = valueOrigin2;
      this.zoomValueOrigin =  JSON.parse(JSON.stringify(this.zoomValue));
      // console.log("zoomValue:",this.zoomValue);
      // 判断样式属性值为数字还是文本
      this.isNum = this.numAttribute.indexOf(this.attribute) == -1 ? false : true;
      this.isArray = this.arrayAttribute.indexOf(this.attribute) == -1 ? false : true;
      this.attributeList = this.layer.shpAttribute;
      console.log('att',this.attributeList)

    },    
    reset(val){
      this.$confirm('是否重置当前设置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 内部重置按钮功能
        if(val === 'open'){
          this.menuButtonShow = true;
          // zoom相关
          [this.zoomShow,this.dataShow,this.attributeShow,this.formulaShow] = [false];
          this.$bus.$emit("show",this.menuButtonShow);
          // 初始化zoomValue为刚加载的值
          const value2 = this.zoomValueOrigin;
          this.zoomValue = value2;  
          // 将父组件传来的参数设为原来的值
          const value1 = this.zoomValueOrigin[0]['value'];   
          this.layer[this.layoutOrpaint][this.attribute] = value1;                       
          this.zoomEditIndex = 0;
        }
        // 外部重置按钮功能
        else if(val === 'close'){
        // 设置为默认样式,使用const保证之后不会赋予另外的对象
          const value1 = this.layerOrigin[this.layoutOrpaint][this.attribute];   
          this.layer[this.layoutOrpaint][this.attribute] = value1;           
        } 


        //向父组件传递要修改的参数
        this.handleValue();
        this.$message({
          type: 'success',
          message: '重置样式成功!',
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        }); 
      });      
    }, 
    handleValue(){
      const value = this.layer[this.layoutOrpaint][this.attribute];
      console.log('value:',value)
      this.$emit("callback",this.layoutOrpaint,this.attribute,value);      
    },

    //对zoom变化各行进行处理
    zoomOpen(){
      this.menuButtonShow = false;
      this.zoomShow = true;
      this.zoomEditShow = true;
      this.Rate = 'linear';
      this.$bus.$emit("show",this.menuButtonShow);
      // 再初始化下组件信息
      this.initInfo();
    },
    dataOpen(){
      this.menuButtonShow = false;
      this.dataShow = true;
      this.dataEditShow = true;
      this.Rate = 'linear';
      this.$bus.$emit("show",this.menuButtonShow);
      // 再初始化下组件信息
      this.initInfo();
    },    
    tableRowClassName({row,rowIndex}){
      row.index = rowIndex;
    },
    zoomInsert(){
      for(let i in this.zoomValue){
        if(i == 0){
          continue;
        }
        // 若zoom间不连续则插入
        else if(this.zoomValue[i]['zoom'] - this.zoomValue[i-1]['zoom'] > 1){
          let zoom = Number(this.zoomValue[i-1]['zoom']) + 1;
          let value = this.zoomValue[i-1]['value'];
          const Object = {zoom:zoom,value:value}; 
          this.zoomValue.splice(i,0,Object);
          this.zoomEditIndex= i;
          break;
        }
        else if(i == this.zoomValue.length-1 && i - 23 < 0){
          let zoom = Number(this.zoomValue[i]['zoom']) + 1;
          let value = this.zoomValue[i]['value'];
          const Object = {zoom:zoom,value:value};          
          this.zoomEditIndex= Number(i)+1;
          this.zoomValue.splice(Number(i)+1,0,Object);
      console.log('zoomValuei:',this.zoomValue);
      console.log('zoomEditIndexi:',this.zoomEditIndex);
          break;
        }
      }
      // this.zoomValue.unshift(this.zoomValue[0]);
      this.zoomEditShow= true;
    },
    handleZoomEdit(row){
      //zoomEditShow设置成数组，dialog不会正常关闭
      // this.zoomEditShow = ['true',0];
      this.zoomEditShow = true;
      this.zoomEditIndex = row.index;
      console.log('row:',row);
      console.log('zoomEditIndex:',this.zoomEditIndex);
      console.log('zoomValue:',this.zoomValue);
    },
    zoomEditDelete(){
      // console('zoomEditIndex:',this.zoomEditIndex);
      // console.log('zoomValue:');
      // 关闭编辑框要在删除之前，因为删除后涉及到zoomValue的地方会查询zoomEditIndex的内容进行更新
      this.zoomEditShow = false;
      this.zoomValue.splice(this.zoomEditIndex,1);
      // 防止更新内容出错
      if(this.zoomEditIndex != 0)
        {this.zoomEditIndex = Number(this.zoomEditIndex) - 1;
      }
      //判断，执行类似重置按钮的功能
      if(this.zoomValue.length == 1){
        this.menuButtonShow = true;
        [this.zoomShow,this.dataShow,this.attributeShow,this.formulaShow] = [false];
        this.$bus.$emit("show",this.menuButtonShow);
        const value2 = this.zoomValueOrigin;
        this.zoomValue = value2;  
        const value1 = this.zoomValueOrigin[0]['value'];   
        this.layer[this.layoutOrpaint][this.attribute] = value1;          
      }
    },
    zoomEditFirm(){
      this.zoomEditShow = false;
      let Object = this.zoomValue[this.zoomEditIndex];
      let num = Object.zoom;
      this.zoomValue.splice(this.zoomEditIndex,1)
      // console.log('Object',Object)
      // console.log('num:',num);

      for(let i in this.zoomValue){
        //js的var是弱类型，默认是string类型，10>2不成立
        if((num - this.zoomValue[i].zoom) < 0 ){
          this.zoomValue.splice(i,0,Object);
          // console.log('num:',num);
          // console.log('this.zoomColor[i].zoom:',this.zoomColor[i].zoom);          
          break;
        }        
        if(i == this.zoomValue.length-1){
          console.log('i:',i);
          this.zoomValue.push(Object);
          break;
        }
      }
      //重置列表排序
      // this.$refs.tableList.sort('zoom', 'ascending')
      // console.log('zoom:',this.zoomColor)

      // 设置多级显示
      let zoomCondition1 = ["interpolate",[this.Rate],['zoom']];
      let zoomCondition2 = ["step",["zoom"]];
      let value = [];
      if(this.Rate == 'linear' || this.Rate == 'exponential'){
        for(let i in this.zoomValue){
          zoomCondition1.push(Number(this.zoomValue[i]['zoom']));          
          //js默认为string类型
          if(this.isNum){
            zoomCondition1.push(Number(this.zoomValue[i]['value']));
            value = zoomCondition1;
            console.log('num',this.isNum)
          }
          else if(this.attribute.includes('color')){
            zoomCondition1.push(this.zoomValue[i]['value']);
            value = zoomCondition1;
            console.log('color')
          }
          else if(this.isArray){
            let value1 = parseInt(this.zoomValue[i]['value'][0]);
            let value2 = parseInt(this.zoomValue[i]['value'][1]);          
            this.zoomValue[i]['value'][0] = JSON.parse(JSON.stringify(value1));
            this.zoomValue[i]['value'][1] = JSON.parse(JSON.stringify(value2));
            zoomCondition1.push(['literal',[value1,value2]]);
            value = zoomCondition1;
            console.log('array',value1,value2)
          }             
        }
      }
      if(this.Rate == 'step' || (!this.isNum && !this.isArray)){
        for(let i in this.zoomValue){
          i == 0 || zoomCondition2.push(Number(this.zoomValue[i]['zoom'])); //step的zoom=0时，只加载value
          if(this.attribute.includes('dasharray')){
            const value1 = parseInt(this.zoomValue[i]['value'][0]);
            const value2 = parseInt(this.zoomValue[i]['value'][1]);          
            this.zoomValue[i]['value'][0] = value1;
            this.zoomValue[i]['value'][1] = value2;
            zoomCondition2.push(['literal',[value1,value2]]);
            value = zoomCondition2;
            console.log('dasharray')
          }           
          else{
            zoomCondition2.push(this.zoomValue[i]['value']);
            value = zoomCondition2;
            console.log('text')
          }
        }         
      }
      console.log('zoomCondition:',value);      
      this.$emit("callback",this.layoutOrpaint,this.attribute,value);      

      // this.zoomRender(this.layer[this.nowLayerIndex].id,'fill-color',)
    },
    zoomRender(){

    },

    test(){
      // console.log(tab, event);
      this.menuButtonShow = true;
      [this.zoomShow,this.dataShow,this.attributeShow,this.formulaShow] = [false];
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

    }   
  },
  created () {
    // this.initInfo();
  },
  mounted () {

  },
}
</script>
<style scoped>
.box{
  width:200px;
  padding: 0px 10px 10px 0px; 
  }
.menuButton{
  width: 100%;
  margin: 5px 0;
  padding: 12px 0;
}
.box .el-table--fit{
  box-sizing: content-box;
  border: 1px solid #dcdfe6;
  border-bottom: none;
  border-radius: 4px;
}
.zoomDasharray{
  height: 150px;
  overflow-y: scroll;
}
.zoomDasharray::-webkit-scrollbar{
  width: 0; height: 0; color: transparent; 
}
/* 属性条件table滚动条 */
.attList .el-table__body{
  height: 10vh;
}
/* .attList .el-table__body-wrapper.is-scrolling-none{

} */
</style>
