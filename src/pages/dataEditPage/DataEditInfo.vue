<template>
  <div class="leftBox">
    <!-- 标题区 -->
    <div class="leftBoxTitle">
      <el-button 
        plain size="mini" 
        icon="el-icon-back" 
        title="返回项目工程"
        @click="toMyProject"
      ></el-button>
      <h2>编辑区</h2>
      <el-button plain size="mini" icon="el-icon-back" style="visibility:hidden"></el-button>      
    </div>
    <!-- 数据编辑按钮区 -->
    <el-row class="btnGroup" type="flex" justify="space-around" style="width:100%;align-item:center">
      <!-- 添加shplayer数据 -->
      <el-col :span="5" :offset="3">
        <el-button type="text" size="mini" @click="addData">添加数据</el-button>
      </el-col>
      <el-col :span="15">
        <el-button-group style="width:100%">
          <el-button round type="primary" icon="el-icon-location-outline" style="width:30%" title="绘制点"></el-button>
          <el-button round type="primary" icon="el-icon-minus" style="width:30%" title="绘制线"></el-button>
          <el-button round type="primary" icon="fa fa-square" style="width:30%" title="绘制面"></el-button>
        </el-button-group>
      </el-col>    
    </el-row>
    <el-dialog
      title="导入数据"
      :visible.sync="dataImportShow"
      width="30%"
      center>
      <el-table :data="shpTableData" max-height="300" width="100%">
        <el-table-column
          property="originName"
          min-width="30"
          show-overflow-tooltip
          label="名称"
        ></el-table-column>
        <el-table-column min-width="10" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleAddShpLayer(scope.row)"
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
      <el-button>上传数据</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dataImportShow = false">取 消</el-button>
        <!-- <el-button type="primary" @click="dataImportShow = false">确 定</el-button> -->
      </span>
    </el-dialog>  
    <!-- 图层展示区 -->
    <el-divider>数据信息</el-divider>
    <!-- 数据条目概览 -->
    <div class="columnHeight" v-if="!isInfo&&dataList.length > 0" style="width:100%">
      <el-row class="dataList" v-for="(item, index) in dataList" :key="index" type="flex" justify="space-between">
        <el-tag 
          class="tagInfo" type="info" 
          @click.native="showDataInfo(index)"
        >
          <i :class="iconList[item.geoType]"></i>
          <span>{{`${item.gid}(${item.name})`}}</span>
        </el-tag>
        <el-button-group>
          <el-button round type="text" icon="el-icon-aim" size="mini" title="定位目标" @click="zoomToFeature(index)"></el-button>
          <el-button round type="text" icon="el-icon-delete" size="mini" title="删除目标" @click="deleteFeature(index)"></el-button>
        </el-button-group>
      </el-row>
    </div>
    <!-- 数据属性信息表 -->
    <div class="dataInfo" v-if="isInfo&&dataList.length > 0">
      <el-row type="flex">
        <el-tag class="tagInfo" type="info">
          <i :class="iconList[dataList[dataSelectIndex].geoType]"></i>
          <span>{{dataList[dataSelectIndex].gid}}</span>          
        </el-tag>
        <el-row type="flex" justify="end">
          <el-button round type="text" icon="el-icon-back" size="mini" title="概览" @click="backToItems"></el-button>
          <el-button round type="text" icon="el-icon-aim" size="mini" title="定位目标"></el-button>
          <el-button round type="text" icon="el-icon-delete" size="mini" title="删除目标" @click="deleteFeature(dataSelectIndex)"></el-button>
        </el-row>
      </el-row>
      <el-table class="columnHeight" :data="isDataEdit ? dataInfoBackup : dataList[dataSelectIndex]['info']" size="mini" style="width: 100%">
        <el-table-column
          label="属性"
          min-width="20"
          show-overflow-tooltip
          prop="attr"
        >
          <!-- <template slot-scope="scope">
            <el-input
              v-if="isDataEdit"
              v-model="scope.row.attr"
            >
            </el-input>
            <div v-show="!isDataEdit">{{scope.row.attr}}</div>
          </template> -->
        </el-table-column>
        <el-table-column
          label="属性值"
          min-width="30"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-input
              v-if="isDataEdit"
              v-model="scope.row.value"
            >
            </el-input>
            <div v-show="!isDataEdit">{{scope.row.value}}</div>
          </template>        
        </el-table-column>
        <el-table-column label="操作" min-width="10">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="deleteProperty(scope.$index)"
              icon="el-icon-delete"
            >
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-button-group class="btnInfoEdit">
        <el-button round type="primary" plain size="mini" icon="el-icon-plus" @click="addProperty">添加属性</el-button>
        <el-button v-if="!isDataEdit" round type="primary" plain icon="el-icon-edit" size="mini" @click="editProperty">编辑</el-button>
        <el-button v-if="isDataEdit" round type="primary" plain icon="el-icon-close" size="mini" @click="cancelEditProperty">取消</el-button>
        <el-button v-if="isDataEdit" round type="primary" plain icon="el-icon-document-checked" size="mini" @click="saveProperties">保存</el-button>
      </el-button-group>
    </div> 
    <el-empty v-if="dataList.length < 1" description="添加数据选取范围，显示属性"></el-empty>
  </div>
</template>
<script>
import requestApi from "../../api/requestApi";
import { mapMutations } from "vuex";

export default {
  name: 'DataEditInfo',
  data () {
    return {
      // #全局参数
      isInfo: false,      // 数据概览和数据信息面板间切换
      iconList: {circle:"el-icon-location-outline",line:"el-icon-minus",fill:"fa fa-square"},
            
      // #添加参数
      dataImportShow: false,
      // shp列表展示
      shpTableData: [],
      currentPageShp: 1,
      pageSizeShp: 10,
      searchInputShp: "",
      totalDataCountShp: 0,


      // #数据条目概览
      // dataList: [{geoValue:'245.3km²',geoType:'MULTIPOLYGON'},{geoValue:'(89.8,98.6)',geoType:'POINT'},{geoValue:'12.4km',geoType:'MULTILINESTRING'}],
      dataSelectIndex: 0,

      // #数据信息 
      // dataInfoList: [
      //   [ 
      //     {attr:'name',value:'青海'},
      //     {attr:'shape_leng',value:'59.5622945458'},
      //     {attr:'shape_area',value:'71.3630238755'},
      //     {attr:'code',value:'63'}
      //   ],
      //   [
      //     {attr:'name',value:'青海'},
      //     {attr:'shape_leng',value:'59.5622945458'},
      //     {attr:'shape_area',value:'71.3630238755'},
      //     {attr:'code',value:'63'}
      //   ]
      //   ],
      isDataEdit: false,          // 控制信息面板编辑 
      dataInfoBackup: [],         // 备份所选信息，用于编辑
    }
  },
  methods: {
    // vuex
    ...mapMutations({ UPDATEPARM: "UPDATE" }), //将 `this.UPDATEPARM(data)` 映射为 `this.$store.commit('UPDATE',data)`


    // #标题区
    toMyProject(){
      let newUrl = this.$router.resolve({ path: '/Map/MyProject' });
      window.open(newUrl.href, "_blank");        
    },    

    // #数据添加
    addData(){
      this.getShpList();
      this.dataImportShow = true;
    },
    getShpList() {
      requestApi
        .getShpList({
          asc: false,
          page: this.currentPageShp,
          pageSize: this.pageSizeShp,
          searchText: this.searchInputShp,
          sortField: "createTime",
        })
        .then((res) => {
          this.shpTableData = res.data.data.content;
          this.totalDataCountShp = res.data.data.totalElements;
        })
        .catch((error) => {
          console.log(error);
        });
    },    
    handleCurrentChangeShp(val){
      this.currentPageShp = val;
      this.getShpList();
    },

    // #数据概览
    showDataInfo(index){
      this.isInfo = !this.isInfo;
      this.dataSelectIndex = index;
    },
    zoomToFeature(index){
      let bounds = this.dataList[index].b2d;
      let box = [[bounds[0], bounds[1]],[bounds[2], bounds[3]]];
      this.$bus.$emit("map",{type:'fitBounds',value:box});
    },
    deleteFeature(index){
      if(this.isInfo){              //  在信息展示界面退回概览
        this.isInfo = !this.isInfo;
      }
      this.dataList.splice(index,1);
      const gids = this.dataList.length > 0 ? this.dataList.map((feature) => feature.gid) : '';
      this.$bus.$emit("map",{type:"deleteFeature",value:gids});
    },

    // 数据信息展示
    editProperty(){       // 作为编辑开始模板
      this.dataInfoBackup = JSON.parse(JSON.stringify(this.dataList[this.dataSelectIndex]['info']));    // 备份原始数据
      this.isDataEdit = true;
    },
    cancelEditProperty(){
      this.isDataEdit = false;
      this.dataInfoBackup = JSON.parse(JSON.stringify(this.dataList[this.dataSelectIndex]['info']));
    },
    deleteProperty(index){
      this.dataList[this.dataSelectIndex]['info'].splice(index,1);
    },
    addProperty(){
      if(!this.isDataEdit){       
        this.editProperty();
      }
      this.dataInfoBackup.push({attr:null,value:null});
    },
    saveProperties(){
      this.dataList[this.dataSelectIndex]['info'] = JSON.parse(JSON.stringify(this.dataInfoBackup));
      this.isDataEdit = false;
    },
    backToItems(){
      if(this.isDataEdit){
        this.$confirm('是否要保存属性值修改?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.saveProperties();
          this.isInfo = false;
        }).catch(() => {
          this.cancelEditProperty();
          this.isInfo = false;
        });
      }else{
        this.isInfo = false;
      }
    },
    handleAddShpLayer(row){
      this.$bus.$emit('map',{type:'addShp',value:row});
      this.dataImportShow = false;

    },

  },
  computed: {
    dataList: {         // [geoType:"",gid:"",geom:"",b2d:"",info:[{attr:"",value:""}]];
      get() {
        return this.$store.state.dataList;
      },
      set(val) {
        this.UPDATEPARM({ parm: "dataList", value: val });
      },
    },
  },  
  created () {
  },
  mounted () {

  },
}
</script>
<style lang="scss" scoped>
@import "./css.scss"
</style>
