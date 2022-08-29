<template>
  <div class="myDataPage">



    <div class="main-content">

      <!--    shp文件管理-->
      <el-card class="box-card" style="margin-top: 10px">
        <div slot="header" class="clearfix">
          <h3>本地Shapefile管理</h3>
        </div>
        <div class="page-part">
          <div class="leftUpload">
            <el-divider content-position="center">Shapefile文件上传</el-divider>
<!--            单文件上传-->
<!--            <el-upload-->
<!--                name="file"-->
<!--                drag-->
<!--                :action="shpUploadUrl"-->
<!--                :on-success="handleShpUpSuccess"-->
<!--                accept=".zip"-->
<!--            >-->
<!--              <i class="el-icon-upload"></i>-->
<!--              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
<!--              <div class="el-upload__tip" slot="tip">tip: 将shp文件压缩(zip格式)后上传！zip名称与shp一致</div>-->
<!--            </el-upload>-->
            <br>
<!--            <el-button size="mini" @click="helloTest()">测试</el-button>-->
            <el-upload
                name="files"
                drag
                :action="multiShpUploadUrl"
                :on-success="handleMultiShpUpSuccess"
                accept=".zip"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">
                <h3>要求: 将一个或多个shp文件选中<strong>直接</strong>压缩(zip格式)</h3>
                <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;!!!不要嵌套文件夹!!!</h3>
              </div>
            </el-upload>


<!--            数据源编辑-->
            <!-- <el-button slot="reference" size="mini" type="success" @click="dataBaseShow= true" >添加数据库源</el-button>
            <el-dialog
              title="数据库源信息编辑"
              :visible.sync="dataBaseShow"
              width="30%"
              center>
              <el-form label-position="left" label-width="100px" :model="dataBaseInfo">
                <el-form-item
                  label="IP:"
                  :rules="{required: true, message: '请输入ip信息', trigger: 'blur'}">
                  <el-input v-model="dataBaseInfo.ip"></el-input>
                </el-form-item>
                <el-form-item
                  label="端口:"
                  :rules="{required: true, message: '请输入端口号', trigger: 'blur'}">
                  <el-input v-model="dataBaseInfo.port"></el-input>
                </el-form-item>
                <el-form-item
                  label="数据库名:"
                  :rules="{required: true, message: '请输入数据库名', trigger: 'blur'}">
                  <el-input v-model="dataBaseInfo.dbname"></el-input>
                </el-form-item>
                <el-form-item
                  label="用户名:"
                  :rules="{required: true, message: '请输入用户名', trigger: 'blur'}">
                  <el-input v-model="dataBaseInfo.userName"></el-input>
                </el-form-item>
                <el-form-item
                  label="密码:"
                  :rules="{required: true, message: '请输入密码', trigger: 'blur'}">
                  <el-input v-model="dataBaseInfo.password"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dataBaseShow = false">取 消</el-button>
                <el-button type="primary" @click="addDataSource">确 定</el-button>
              </span>
            </el-dialog>   -->
<!--            <el-table-->
<!--                :data="dataBaseList"-->
<!--                stripe :row-style="{height:'10px',padding:'0'}"-->
<!--                style="width: 100%"-->
<!--                height="300" >-->
<!--              <el-table-column-->
<!--                  prop="dbname"-->
<!--                  label="数据库源"-->
<!--                  width="200" >-->
<!--              </el-table-column>-->
<!--              <el-table-column label="操作" min-width="115">-->
<!--                <template slot-scope="scope">-->
<!--                  <el-popconfirm-->
<!--                      title="确定删除吗？" @confirm="dataBaseDelete(scope.row)">-->
<!--                    <el-button-->
<!--                        slot="reference"-->
<!--                        size="mini"-->
<!--                        type="danger"-->
<!--                        style="  margin-left: 5px;">删除-->
<!--                    </el-button>-->
<!--                  </el-popconfirm>-->

<!--                </template>-->
<!--              </el-table-column>-->
<!--            </el-table>-->
          </div>
          <el-divider class="deviderHeight" direction="vertical"></el-divider>
          <div class="rightContent">
            <el-divider content-position="center">Shapefile文件管理</el-divider>
            <div class="search-box-data">
              <el-input
                  placeholder="请输入搜索内容"
                  prefix-icon="el-icon-search"
                  v-model="shpSearchInput"
                  @keyup.enter.native="getShpDataList()"
              >
              </el-input>
              &nbsp;&nbsp;
              <el-button type="success" icon="el-icon-search" @click="getShpDataList()">搜索</el-button>
            </div>

            <el-table :data="shpTableData" stripe row-key="id" style="width: 100%">
              <el-table-column
                  prop="originName"
                  label="名称"
                  min-width="200"
                  show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                  prop="fileSize"
                  label="文件大小"
                  show-overflow-tooltip
                  min-width="100px"
              >
              </el-table-column>
<!--              <el-table-column-->
<!--                  prop="srid"-->
<!--                  label="坐标系"-->
<!--                  show-overflow-tooltip-->
<!--                  min-width="100px"-->
<!--              >-->
<!--              </el-table-column>-->
              <el-table-column
                  prop="geoType"
                  label="类型"
                  show-overflow-tooltip
                  min-width="100px"
              >
              </el-table-column>
              <el-table-column
                  prop="createTime"
                  label="上传时间"
                  show-overflow-tooltip
                  min-width="230px"
              ></el-table-column>
              <el-table-column label="操作" show-overflow-tooltip min-width="300px">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handlePreview(scope.row.id)"
                  >预览
                  </el-button
                  >
                  <el-button size="mini" @click="handleDownload(scope.row.id)"
                  >下载
                  </el-button
                  >
                  <el-button size="mini" @click="cacheItemPre = scope.row;cacheShow = true"
                  >预缓存
                  </el-button
                  >
                  <el-button
                      size="mini"
                      type="danger"
                      @click="handleDeleteShp(scope.row.id)"
                  >删除
                  </el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-dialog
                title="数据库源信息编辑"
                :visible.sync="cacheShow"
                width="30%"
                center>
              <el-form label-position="right" label-width="100px" :model="cacheItem">
                <el-form-item
                    label="name:"
                    :rules="{required: true, message: '请输入ip信息', trigger: 'blur'}">
                  <el-input v-model="cacheItem.ip"></el-input>
                </el-form-item>
                <el-form-item
                    label="描述:">
                  <el-input v-model="cacheItem.description"></el-input>
                </el-form-item>
                <el-form-item
                    label="层级范围:">
                  <el-slider
                      v-model="cacheItem.range"
                      range
                      :max="22">
                  </el-slider>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
            <el-button @click="cacheShow = false">取 消</el-button>
            <el-button type="primary" @click="handleCache">确 定</el-button>
          </span>
            </el-dialog>
            <el-divider></el-divider>

            <el-pagination
                background
                @size-change="handleShpSizeChange"
                @current-change="handleShpCurrentChange"
                :current-page="shpCurrentPage"
                :page-sizes="[10, 20, 30]"
                :page-size="shpPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="shpTotalDataCount"
                class="flexRowCenter"
            >
            </el-pagination>
          </div>
        </div>
      </el-card>

      <!--    PostgreSQL源管理-->
      <el-card class="box-card" style="margin-top: 10px">
        <div slot="header" class="clearfix">
          <h3>PostgreSQL源</h3>
        </div>
        <el-table
            :data="dataBaseList"
            stripe :row-style="{height:'10px',padding:'0'}"
            style="width: 100%"
            height="300" >
          <el-table-column
              prop="dbname"
              label="数据库源"
               >
          </el-table-column>
          <el-table-column
              prop="ip"
              label="IP"
               >
          </el-table-column>
          <el-table-column
              prop="port"
              label="PORT"
               >
          </el-table-column>
          <el-table-column
              prop="userName"
              label="用户名"
               >
          </el-table-column>
          <el-table-column
              prop="password"
              label="密码"
              >
          </el-table-column>
          <el-table-column label="操作" min-width="115">
            <template slot-scope="scope">
              <el-popconfirm
                  title="确定删除吗？" @confirm="dataBaseDelete(scope.row)">
                <el-button
                    slot="reference"
                    size="mini"
                    type="danger"
                    style="  margin-left: 5px;">删除
                </el-button>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!--    mbtiles-->
      <el-card class="box-card" style="margin-top: 10px">
        <div slot="header" class="clearfix">
          <h3>MbTiles源</h3>
        </div>
        <el-table
            :data="mbtilesTableData"
            stripe :row-style="{height:'10px',padding:'0'}"
            style="width: 100%"
            height="300" >
          <el-table-column
              prop="name"
              label="名称"
          >
          </el-table-column>
          <el-table-column
              prop="url"
              label="位置"
          >
          </el-table-column>
        </el-table>
      </el-card>

      <!--    字体文件-->
      <el-card class="box-card" style="margin-top: 10px">
        <div slot="header" class="clearfix">
          <h3>字体文件</h3>
        </div>
        <el-table
            :data="fontTableData"
            stripe :row-style="{height:'10px',padding:'0'}"
            style="width: 100%"
            height="300" >
          <el-table-column

              label="字体名称"
          >
            <template slot-scope="scope">
                <span>{{scope.row}}</span>
            </template>
          </el-table-column>

<!--          <el-table-column label="操作" min-width="115">-->
<!--            <template slot-scope="scope">-->
<!--              <el-popconfirm-->
<!--                  title="确定删除吗？" @confirm="dataBaseDelete(scope.row)">-->
<!--                <el-button-->
<!--                    slot="reference"-->
<!--                    size="mini"-->
<!--                    type="danger"-->
<!--                    style="  margin-left: 5px;">删除-->
<!--                </el-button>-->
<!--              </el-popconfirm>-->

<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>
      </el-card>

      <!--    <el-divider></el-divider>-->
      <!--    图标文件管理-->
      <!--    <div class="page-part">-->
      <!--      <div class="leftUpload">-->
      <!--        <el-divider content-position="center">图标文件上传</el-divider>-->
      <!--        <el-upload-->
      <!--            class="upload-demo"-->
      <!--            name="symbolFile"-->
      <!--            drag-->
      <!--            :action="symbolUploadUrl"-->
      <!--            :on-success="handleSymbolUpSuccess"-->
      <!--            accept=".svg, .png, .jpg"-->
      <!--            multiple>-->
      <!--          <i class="el-icon-upload"></i>-->
      <!--          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
      <!--          <div class="el-upload__tip" slot="tip">支持svg、png、jpg</div>-->
      <!--        </el-upload>-->
      <!--      </div>-->
      <!--      <el-divider class="deviderHeight" direction="vertical"></el-divider>-->
      <!--      <div class="rightContent">-->
      <!--        <el-divider content-position="center">图标文件管理</el-divider>-->
      <!--        <div class="search-box-data">-->
      <!--          <el-input-->
      <!--              placeholder="请输入搜索内容"-->
      <!--              prefix-icon="el-icon-search"-->
      <!--              v-model="symbolSearchInput"-->
      <!--              @keyup.enter.native="getSymbolList()"-->
      <!--          >-->
      <!--          </el-input>-->
      <!--          &nbsp;&nbsp;-->
      <!--          <el-button type="success" icon="el-icon-search" @click="getSymbolList()">搜索</el-button>-->
      <!--        </div>-->

      <!--        <el-table :data="symbolTableData" stripe row-key="id" style="width: 100%">-->
      <!--          <el-table-column-->
      <!--              prop="originName"-->
      <!--              label="名称"-->
      <!--              min-width="250"-->
      <!--              show-overflow-tooltip-->
      <!--          >-->
      <!--          </el-table-column>-->
      <!--          <el-table-column-->
      <!--              prop="createTime"-->
      <!--              label="上传时间"-->
      <!--              show-overflow-tooltip-->
      <!--              min-width="230px"-->
      <!--          ></el-table-column>-->
      <!--          <el-table-column label="操作" show-overflow-tooltip min-width="230px">-->
      <!--            <template slot-scope="scope">-->
      <!--              <el-button size="mini" @click="handlePreview(scope.row.id)"-->
      <!--              >预览-->
      <!--              </el-button>-->
      <!--              <el-button-->
      <!--                  size="mini"-->
      <!--                  type="danger"-->
      <!--                  @click="handleDeleteSymbol(scope.row.id)"-->
      <!--              >删除-->
      <!--              </el-button>-->
      <!--            </template>-->
      <!--          </el-table-column>-->
      <!--        </el-table>-->
      <!--        <el-divider></el-divider>-->

      <!--        <el-pagination-->
      <!--            background-->
      <!--            @size-change="handleSymbolSizeChange"-->
      <!--            @current-change="handleSymbolCurrentChange"-->
      <!--            :current-page="symbolCurrentPage"-->
      <!--            :page-sizes="[10, 20, 30]"-->
      <!--            :page-size="symbolPageSize"-->
      <!--            layout="total, sizes, prev, pager, next, jumper"-->
      <!--            :total="symbolTotalDataCount"-->
      <!--            class="flexRowCenter"-->
      <!--        >-->
      <!--        </el-pagination>-->
      <!--      </div>-->

      <!--    </div>-->
    </div>


  </div>
</template>

<script>
import requestApi from "../api/requestApi";
// import config from "../config";
// import Sortable from 'sortablejs'

export default {
  data() {
    return {
      // shpUploadUrl: config.requestUrl + "/shp/uploadShp",
      // symbolUploadUrl: config.requestUrl + "/symbol/uploadSymbol",
      shpUploadUrl: this.reqUrl + "/shp/uploadShp",
      multiShpUploadUrl: this.reqUrl + "/shp/uploadMultiShp",
      symbolUploadUrl: this.reqUrl + "/symbol/uploadSymbol",
      dataBaseInfo: {ip:'',dbname:'',userName:'',password:'',port:''},
      dataBaseShow: false,
      dataBaseList: [],
      //缓存
      cacheShow: false,
      cacheItemPre: {},
      cacheItem: {name:'',description:'',range:[0,22]},
      //shp页
      shpTableData: [],
      shpCurrentPage: 1,
      shpPageSize: 10,
      shpTotalDataCount: 0,
      shpSearchInput: "",

      //图标页
      symbolTableData: [],
      symbolCurrentPage: 1,
      symbolPageSize: 10,
      symbolTotalDataCount: 0,
      symbolSearchInput: "",

      //字体数据
      fontTableData:[],

      //mbtiles数据源
      mbtilesTableData:[]
    };
  },

  mounted() {
    this.getShpDataList();
    this.getSymbolList();
    this.getDataSourceList();
    this.getFontList();
    this.getMbtilesSourceList();

    // this.rowDrop()
  },
  methods: {
    // rowDrop() {
    //   const tbody = document.querySelector('.el-table__body-wrapper tbody')
    //   console.log("tbody", tbody)
    //   const _this = this
    //   Sortable.create(tbody, {
    //     draggable: ".el-table__row",
    //     onEnd({newIndex, oldIndex}) {
    //       console.log(newIndex, oldIndex)
    //       const currRow = _this.shpTableData.splice(oldIndex, 1)[0]
    //       console.log("currow:", currRow)
    //       _this.shpTableData.splice(newIndex, 0, currRow)
    //     }
    //   })
    // },
    helloTest() {
      requestApi.requestTest()
          .then(() => {
            console.log("aaaa");
          })
          .catch((error) => {
            console.log(error);
          });
    },
    addDataSource(){
      requestApi.addDataSource(this.dataBaseInfo)
        .then((res) => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
        })
      this.getDataSourceList();
      this.dataBaseShow = false;
    },
    getShpDataList() {
      requestApi.getShpList({
        asc: false,
        page: this.shpCurrentPage,
        shpPageSize: this.shpPageSize,
        searchText: this.shpSearchInput,
        sortField: "createTime",
      })
          .then((res) => {
            console.log('shpDataList',res.data);
            this.shpTableData = res.data.data.content;
            this.shpTotalDataCount = res.data.data.totalElements;
          })
          .catch((error) => {
            console.log('shp失败',error);
          });
    },
    getDataSourceList(){
      requestApi.getDataSourceList()
          .then((res) => {
            console.log('数据库源:',res)
            this.dataBaseList = res.data.data;
          })
          .catch((error) => {
            console.log(error);
          });
    },
    dataBaseDelete(row){
      console.log('111',row.id);
      requestApi.deleteSourceById(row.id)
        .then((res)=>{
            console.log(res)
        })
        .catch((error) => {
          console.log(error);
        }); 
      this.getDataSourceList();     
      
    },

    handleShpUpSuccess(res) {
      if (res.code != 0) {
        this.$message.error("shp上传成功但导入数据库失败！");
      } else {
        this.$message.success("shp成功上传");
      }
      this.getShpDataList();
    },

    handleMultiShpUpSuccess(res) {
      if (res.code != 0) {
        this.$message.error("shp上传成功但导入数据库失败！");
      } else {
        this.$message.success("shp成功上传");
      }
      this.getShpDataList();
    },


    handleShpSizeChange(val) {
      this.shpPageSize = val;
      this.getShpDataList();
    },

    handleShpCurrentChange(val) {
      this.shpCurrentPage = val;
      this.getShpDataList();
    },

    handleDeleteShp(val) {
      this.$confirm('确认删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        requestApi.deleteShp(val)
            .then(() => {
              this.$message.success("删除成功!");
              this.getShpDataList();
            })
            .catch((error) => {
              console.log(error);
            });

      }).catch(() => {
        this.$message.info("取消删除");
      });
    },

    handleDownload(shpId) {
      window.location.href =
      // config.requestUrl + "/shp/downloadShp?shpId=" + shpId;
          this.reqUrl + "/shp/downloadShp?shpId=" + shpId;
    },

    handleCache(){
      const fields = [];
      for(let item of this.cacheItemPre.attrInfo){
        fields.push(item.column)
      }

      let createTileCacheDTO = {
        "description": this.cacheItem.description,
        "name": this.cacheItemPre.id,
        "vector_layers": [
          {
            "bounds": this.cacheItemPre.bounds,
            "field": fields,
            "id": this.cacheItemPre.id,
            "maxzoom": this.cacheItem.range[1],
            "minzoom": this.cacheItem.range[0]
          }
        ]        
      };
      requestApi.createTileCache(createTileCacheDTO)
        .then((res)=>{
            console.log(res)
        })
        .catch((error) => {
          console.log(error);
        }); 
    },


    //图标部分
    getSymbolList() {
      requestApi.getSymbolList({
        asc: false,
        page: this.symbolCurrentPage,
        shpPageSize: this.symbolPageSize,
        searchText: this.symbolSearchInput,
        sortField: "createTime",
      })
          .then((res) => {
            console.log(res.data);
            this.symbolTableData = res.data.data.content;
            this.symbolTotalDataCount = res.data.data.totalElements;
          })
          .catch((error) => {
            console.log(error);
          });
    },


    handleSymbolUpSuccess(res) {
      if (res.code != 0) {
        this.$message.error("Symbol上传失败！");
      } else {
        this.$message.success("Symbol成功上传");
      }
      this.getSymbolList();
    },

    handleSymbolSizeChange(val) {
      this.symbolPageSize = val;
      this.getSymbolList();
    },

    handleSymbolCurrentChange(val) {
      this.symbolCurrentPage = val;
      this.getSymbolList();
    },

    handleDeleteSymbol(val) {
      this.$confirm('确认删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        requestApi.deleteSymbol(val)
            .then(() => {
              this.$message.success("删除成功!");
              this.getSymbolList();
            })
            .catch((error) => {
              console.log(error);
            });

      }).catch(() => {
        this.$message.info("取消删除");
      });
    },


    //字体
    getFontList(){
      requestApi.getFontList()
          .then((res) => {
            this.fontTableData=res.data.data
          })
          .catch((error) => {
            console.log(error);
          });
    },

    //mbtiles源
    getMbtilesSourceList(){
      requestApi.getMbtilesSourceList()
          .then((res) => {
            this.mbtilesTableData=res.data.data
          })
          .catch((error) => {
            console.log(error);
          });
    }

  },
}
;
</script>

<style>
.myDataPage {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-content{
  width: 80%;
  min-width: 1200px;
  margin-bottom: 200px;
}

.page-part {
  display: flex;
}

.deviderHeight {
  height: inherit;
  min-width: 1px;
}

.search-box-data {
  display: flex;
  justify-content: space-between;
  width: 70%;
  margin: 0 auto;
}

.leftUpload {
  width: 360px;
}

.rightContent {
  width: 100%;
  overflow: auto;
}
</style>