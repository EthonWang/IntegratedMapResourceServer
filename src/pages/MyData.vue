<template>
  <div class="myDataPage">
    <!--    shp文件管理-->
    <div class="page-part">
      <div class="leftUpload">
        <el-divider content-position="center">Shapefile文件上传</el-divider>
        <el-upload
            name="file"
            drag
            :action="shpUploadUrl"
            :on-success="handleShpUpSuccess"
            accept=".zip"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">tip: 将shp文件压缩(zip格式)后上传！zip名称与shp一致</div>
        </el-upload>
        <el-button size="mini" @click="helloTest()">测试</el-button>
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
              min-width="250"
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
          <el-table-column
              prop="srid"
              label="坐标系"
              show-overflow-tooltip
              min-width="100px"
          >
          </el-table-column>
          <el-table-column
              prop="geoType"
              label="类型"
              show-overflow-tooltip
              min-width="100px"
          >
          </el-table-column>
          <el-table-column
              prop="uploadDate"
              label="上传时间"
              show-overflow-tooltip
              min-width="230px"
          ></el-table-column>
          <el-table-column label="操作" show-overflow-tooltip min-width="230px">
            <template slot-scope="scope">
              <el-button size="mini" @click="handlePreview(scope.row.id)"
              >预览
              </el-button
              >
              <el-button size="mini" @click="handleDownload(scope.row.id)"
              >下载
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
    <el-divider></el-divider>

    <!--    图标文件管理-->
    <div class="page-part">
      <div class="leftUpload">
        <el-divider content-position="center">图标文件上传</el-divider>
        <el-upload
            class="upload-demo"
            name="symbolFile"
            drag
            :action="symbolUploadUrl"
            :on-success="handleSymbolUpSuccess"
            accept=".svg, .png, .jpg"
            multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">支持svg、png、jpg</div>
        </el-upload>
      </div>
      <el-divider class="deviderHeight" direction="vertical"></el-divider>
      <div class="rightContent">
        <el-divider content-position="center">图标文件管理</el-divider>
        <div class="search-box-data">
          <el-input
              placeholder="请输入搜索内容"
              prefix-icon="el-icon-search"
              v-model="symbolSearchInput"
              @keyup.enter.native="getSymbolList()"
          >
          </el-input>
          &nbsp;&nbsp;
          <el-button type="success" icon="el-icon-search" @click="getSymbolList()">搜索</el-button>
        </div>

        <el-table :data="symbolTableData" stripe row-key="id" style="width: 100%">
          <el-table-column
              prop="originName"
              label="名称"
              min-width="250"
              show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
              prop="createTime"
              label="上传时间"
              show-overflow-tooltip
              min-width="230px"
          ></el-table-column>
          <el-table-column label="操作" show-overflow-tooltip min-width="230px">
            <template slot-scope="scope">
              <el-button size="mini" @click="handlePreview(scope.row.id)"
              >预览
              </el-button>
              <el-button
                  size="mini"
                  type="danger"
                  @click="handleDeleteSymbol(scope.row.id)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-divider></el-divider>

        <el-pagination
            background
            @size-change="handleSymbolSizeChange"
            @current-change="handleSymbolCurrentChange"
            :current-page="symbolCurrentPage"
            :page-sizes="[10, 20, 30]"
            :page-size="symbolPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="symbolTotalDataCount"
            class="flexRowCenter"
        >
        </el-pagination>
      </div>

    </div>

  </div>
</template>

<script>
import requestApi from "../api/requestApi";
import config from "../config";
// import Sortable from 'sortablejs'

export default {
  data() {
    return {
      shpUploadUrl: config.requestUrl + "/shp/uploadShp",
      symbolUploadUrl: config.requestUrl + "/symbol/uploadSymbol",

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
    };
  },

  mounted() {
    this.getShpDataList();
    this.getSymbolList();
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

    getShpDataList() {
      requestApi.getShpList({
        asc: false,
        page: this.shpCurrentPage,
        shpPageSize: this.shpPageSize,
        searchText: this.shpSearchInput,
        sortField: "uploadDate",
      })
          .then((res) => {
            console.log(res.data);
            this.shpTableData = res.data.data.content;
            this.shpTotalDataCount = res.data.data.totalElements;
          })
          .catch((error) => {
            console.log(error);
          });
    },

    handleShpUpSuccess(res) {
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
          config.requestUrl + "/shp/downloadShp?shpId=" + shpId;
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
  },
}
;
</script>

<style>
.myDataPage {
  display: flex;
  flex-direction: column;
  padding: 20px;
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