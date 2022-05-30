<template>
  <div style="width: 100%">
    <div class="search-box-project">
      <el-button type="primary" icon="el-icon-document-add" @click="addNewMapProject">新建项目</el-button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <el-input
          placeholder="请输入搜索内容"
          prefix-icon="el-icon-search"
          v-model="searchInput"
          @keyup.enter.native="getMapProjectList()"
      >
      </el-input>
      &nbsp;&nbsp;
      <el-button type="success" icon="el-icon-search" @click="getMapProjectList()">搜索</el-button>

    </div>

    <div class="projectsBox">
      <el-card class="project-item" v-for="(item) in mapProjectData" :key="item.date" shadow="hover">
        <img class="project-item-image" src="../assets/imgs/map-icon.png">
        <div>

          <h3 class="project-name" :title="item.name">{{ item.name }}</h3>

          <div class="time">{{ item.created }}</div>
          <div class="bts">

            <el-button size="mini" type="success" icon="el-icon-edit-outline" circle title="编辑"
                       @click="editMapProject(item)"></el-button>

            <el-button size="mini" type="primary" icon="el-icon-document-copy" circle title="复制"
                       @click="copyMapProject(item)"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" circle title="删除"
                       @click="deleteMapProjectById(item)"></el-button>
          </div>

        </div>
      </el-card>
    </div>
    <div style="width: 80vw;margin: 0 auto">
      <el-divider></el-divider>
    </div>

    <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[8, 16, 24, 32]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="mapProjectTotal"
        class="flexRowCenter"
    >
    </el-pagination>


  </div>

</template>

<script>

import requestApi from "../api/requestApi";
// import initProjectJson from "../assets/js/initMapProjectJson";
// import config from "../config";

export default {
  data() {
    return {
      mapProjectData: [],
      mapProjectTotal: 0,
      mapProjectNames: {},

      currentPage: 1,
      pageSize: 8,
      searchInput: ""
    }
  },

  mounted() {
    this.getMapProjectList()
  },
  methods: {

    getMapProjectList() {
      requestApi.getMapProjectList({
        asc: false,
        page: this.currentPage,
        pageSize: this.pageSize,
        searchText: this.searchInput,
        sortField: "created",
      })
          .then((res) => {
            let data = res.data.data
            console.log(res)
            this.mapProjectData = data.content
            this.mapProjectTotal = data.totalElements
          })
          .catch((error) => {
            console.log(error);
          });
    },

    addNewMapProject() {
      this.$prompt('请输入项目名称', '新建项目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        let newProject = {
          mapProjectName: value
        }
        requestApi.createNewMapProject(newProject)
            .then((res) => {
              if (res.data.code === 0) {
                this.$message.success("项目创建成功:" + value);
                this.getMapProjectList()
              }
            })
            .catch((error) => {
              console.log(error);
            });
      }).catch(() => {
        this.$message.info("取消新建项目");
      });


    },

    editMapProject(item) {
      let mapProjectId = item.id
      let newUrl=this.$router.resolve({path: `/MapEditor/${mapProjectId}`})
      window.open(newUrl.href, '_blank');

    },

    copyMapProject(item) {
      this.$prompt('请输入新项目名称', '复制项目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: item.name + "_copy"
      }).then(({value}) => {
        let copyInfo = {
          aimMapProjectName: value,
          originMapProjectId: item.id
        }
        requestApi.copyMapProject(copyInfo)
            .then((res) => {
              if (res.data.code === 0) {
                this.$message.success("项目复制成功:" + value);
                this.getMapProjectList()
              }
            })
            .catch((error) => {
              console.log(error);
            });

      }).catch(() => {
        this.$message.info("取消新建项目");
      });
    },

    deleteMapProjectById(item) {
      this.$confirm('确认删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        requestApi.deleteMapProjectById(item.id)
            .then((res) => {
              if (res.data.code === 0) {
                this.getMapProjectList()
                this.$message.success("成功删除:" + item.mapProjectName);
              } else {
                this.$message.info("取消删除");
              }
            })
            .catch((error) => {
              console.log(error);
            });
      }).catch(() => {
        this.$message.info("取消删除");
      });


    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.getMapProjectList();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getMapProjectList();
    },


  }


}
</script>


<style>
.search-box-project {
  width: 50%;
  margin: 20px auto 0px auto;
  display: flex;
  justify-content: center;
}

.projectsBox {
  width: 80%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: 0px auto;
}

.project-item {
  width: 20%;
  min-width: 200px;
  max-width: 250px;
  margin: 25px;
}

.project-item-image {
  width: 100%;
}

.project-name {
  margin: 10px 0px;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}


.bts {
  display: flex;
  justify-content: flex-end;
  margin-top: 6px;
}

</style>