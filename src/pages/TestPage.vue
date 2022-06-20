<template>
  <div>
    <div style="position: absolute;z-index: 999;">
      <el-button type="success" @click="addShp">click</el-button>
      <el-button type="success" @click="addShp2">click2</el-button>
      <el-button type="success" @click="addShp3">click3</el-button>
      <el-button type="success" @click="addShp4">click3</el-button>

    </div>
    <br><br>
    <div style="position:absolute;width:350px;top:200px;left:100px">
      <el-row type="flex" justify="space-between" align="middle">
        <span>过滤条件配置</span>
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
    </div>

    <div style="position:absolute;width:350px;top:400px;left:100px">
      <el-button @click="nowLayerIndex = 0;test()">test</el-button>
      <el-button @click="nowLayerIndex = 1">1</el-button>
      <el-button @click="nowLayerIndex = 2">2</el-button>
      <el-button @click="nowLayerIndex = 3">3</el-button>
    </div>

    <!-- <ConditionRender :layerSelect="layers[nowLayerIndex]" :tab="tab" @callback="callback"></ConditionRender> -->
    <!-- <MapboxView :shpShowList="shpList"></MapboxView> -->

    <div style="position:absolute;width:350px;top:400px;left:600px;display:flex">
      <el-input
        v-model="textField"
        placeholder="something"
      ></el-input>
      <el-popover
        ref="fieldPopover"
        placement="right"
        width="400"
        trigger="click"
      >
        <el-tabs>
          <el-tab-pane label="精灵图" style="overflow-y:scroll">
            <el-row type="flex" justify="start" style="flex-wrap:wrap;width:100%">
              <el-card class="spriteImage" v-for="(item,index) in sprite" :key="index">                
                <el-image
                  style="width: 100px; height: 100px"
                  :src = "reqUrl + item.webAddress"
                  fit="cover"
                  @click="handleSprite(item)"
                  >
                </el-image>
              </el-card>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="自定义">

          </el-tab-pane>          
        </el-tabs>

        <el-button
          type="text"
          icon="el-icon-s-unfold"
          slot="reference"
        ></el-button>
      </el-popover> 
    </div>

   
  </div>

</template>

<script>
// import MapboxView from "../components/MapboxView";
// import ConditionRender from "../components/ConditionRender"

export default {
  name: "TestPage",
  // components: {ConditionRender},
  // components: {MapboxView},
  data() {
    return {
      shpList: [],

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

      layers: [
        { 
          "id": 'line',
          "layout": {
            "line-cap": "butt1", //One of "butt", "round", "square"
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
        {
          "id": 'circle',
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
        {
          "id": 'fill',
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
      ],
      nowLayerIndex: 0,

      tab: 'line-color',

      textField: '',
      sprite:
      [
            {
              "id": "62ad321a48d8f9d460e94ae5",
              "originName": "cat",
              "storeName": "cat_62ad321a48d8f9d460e94ae4.png",
              "createTime": "2022-06-18 10:02:02 ",
              "webAddress": "/store/symbols/cat_62ad321a48d8f9d460e94ae4.png"
            },
            {
              "id": "62ab329048d8acac7319a4cd",
              "originName": "前方施工",
              "storeName": "前方施工_62ab327348d8acac7319a4cb.png",
              "createTime": "2022-06-16 21:39:28 ",
              "webAddress": "/store/symbols/前方施工_62ab327348d8acac7319a4cb.png"
            },
            {
              "id": "62ab329048d8acac7319a4ce",
              "originName": "右道封闭",
              "storeName": "右道封闭_62ab327448d8acac7319a4cc.png",
              "createTime": "2022-06-16 21:39:28 ",
              "webAddress": "/store/symbols/右道封闭_62ab327448d8acac7319a4cc.png"
            },
            {
              "id": "62a8aa7348d890da216e97f0",
              "originName": "锥形交通标志",
              "storeName": "锥形交通标志_62a8aa6748d890da216e97ef.png",
              "createTime": "2022-06-14 23:34:11 ",
              "webAddress": "/store/symbols/锥形交通标志_62a8aa6748d890da216e97ef.png"
            },
            {
              "id": "62a8aa7348d890da216e97f1",
              "originName": "左道封闭",
              "storeName": "左道封闭_62a8aa6548d890da216e97ee.png",
              "createTime": "2022-06-14 23:34:11 ",
              "webAddress": "/store/symbols/左道封闭_62a8aa6548d890da216e97ee.png"
            }
          ],
    }
  },
  created(){

  },
  methods: {

    addShp() {
      this.shpList.push({name: "111", type: "circle", nameId: "points_5w_623f0502c27f44598a295e2d"})
    },
    addShp2() {
      this.shpList.push({name: "222", type: "line", nameId: "chinaprovince_6242ed63c27f7c3c2e49e983"})
    },
    addShp3() {
      this.shpList.push({name: "333", type: "fill", nameId: "chinaprovince_6242ed63c27f7c3c2e49e983"})
    },
    addShp4() {
      this.shpList.push({name: "333", type: "fill", nameId: "chinaprovince_6242ed63c27f7c3c2e49e983"})
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

    },
    test(){
      console.log('layer',this.layers[0])
    },
      // for(let i in this.zoomValue){
      //   // 若zoom间不连续则插入
      //   if(i == this.zoomValue.length-1 && i - 23 <0){
      //     const Object = this.zoomValue[i];
      //     Object['zoom'] += 1;           
      //     console.log('2',Object);
      //     this.zoomValue.splice(i+1,0,Object);
      //     this.zoomEditIndex= i+1;
      //     break;
      //   }
      //   else if(this.zoomValue[i]['zoom'] - this.zoomValue[i-1]['zoom'] > 1){
      //     const Object = this.zoomValue[i];
      //     Object['zoom'] += 1; 
      //     console.log('1',Object);
      //     this.zoomValue.splice(i+1,0,Object);
      //     this.zoomEditIndex= i+1;
      //     break;
      //   }
      // }
    handleSprite(item){
      this.textField = item.originName;
      this.$refs.fieldPopover.doClose();
    },






  }
}
</script>

<style scoped>
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
.filterBox{
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.spriteImage{
    flex: 1;
    height: 120px;
    margin: 0 5px 5px 0; 
    background-color: #999;
    width: calc((100% - 20px) / 3);  
    min-width: calc((100% - 20px) / 3); 
    max-width: calc((100% - 20px) / 3); 
}
.spriteImage:nth-child(3n){
  margin-right: 0;
}

</style>