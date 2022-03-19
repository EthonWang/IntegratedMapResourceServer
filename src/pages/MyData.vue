<template>
  <div class="myDataPage" style="">
    <div class="leftUpload">
      <el-divider content-position="center">文件上传</el-divider>
      <el-upload
        name="file"
        drag
        :action="fileUploadUrl"
        :on-success="handleUpSuccess"
        accept=".zip"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">tip:不支持文件夹上传！</div>
      </el-upload>
      <el-button size="mini" @click="helloTest()">测试</el-button>
    </div>
    <el-divider class="deviderHeight" direction="vertical"></el-divider>
    <div class="rightContent">
      <el-divider content-position="center">文件管理</el-divider>

      <el-table :data="fileTableData" stripe style="width: 100%">
        <el-table-column
          prop="originName"
          label="名称"
          min-width="300"
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
              >预览</el-button
            >
            <el-button size="mini" @click="handleDownload(scope.row.id)"
              >下载</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteFile(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-divider></el-divider>

      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalDataCount"
        class="flexRowCenter"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { myDataApi } from "../api/requestApi";
import config from "../config";
export default {
  data() {
    return {
      fileUploadUrl: config.requestUrl + "uploadFile",

      fileTableData: [],
      currentPage: 1,
      pageSize: 10,
      totalDataCount: 0,
      searchInput: "",
    };
  },

  mounted() {
    this.getDataList();
  },
  methods: {
    helloTest() {
      myDataApi
        .requestTest()
        .then(() => {
          console.log("aaaa");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getDataList() {
      myDataApi
        .getDataList({
          asc: false,
          page: this.currentPage,
          pageSize: this.PageSize,
          searchText: this.searchInput,
          sortField: "uploadDate",
        })
        .then((res) => {
          console.log(res.data);
          this.fileTableData = res.data.data.content;
          this.totalDataCount = res.data.data.totalElements;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    handleUpSuccess(res) {
      if (res.code != 0) {
        this.$message.error("shp上传成功但导入数据库失败！");
      } else {
        this.$message.success("shp成功上传");
      }
      this.getDataList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDataList();
    },

    handleDeleteFile(val) {
      myDataApi
        .deleteFileById(val)
        .then(() => {
          
          console.log("aaaa"+val);
                this.getDataList();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style>
.myDataPage {
  display: flex;
  padding: 2rem;
}

.deviderHeight {
  height: inherit;
  min-width: 1px;
}
.leftUpload {
  width: 360px;
}
.rightContent {
  width: 100%;
  overflow: auto;
}
</style>