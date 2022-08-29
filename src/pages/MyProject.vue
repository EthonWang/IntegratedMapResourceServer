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
      <el-card class="project-item" v-for="(item,index) in mapProjectData" :key="item.date" shadow="hover">
        <el-image class="project-item-image" fit="contain" :src="item.mapImgUrl.mapImgUrl ? item.mapImgUrl.mapImgUrl : imgDefault"></el-image>
        <div>

          <el-row type="flex" align="middle" >
            <el-col :span="16"
              v-show="prjIndex != index "
              class="projectTitle"
              @click.native="prjIndex = index"
            >
              <h3 :title="item.name">{{item.name}}</h3>
              <i class="el-icon-edit"></i>
            </el-col>
            <el-col v-show="prjIndex === index" class="projectTitle">
              <el-input
                v-model="item.name"
                size="mini"
                @change="prjNameChange(item)"
              ></el-input>
              <i class="el-icon-check" @click="prjNameChange(item)"></i>
            </el-col>            
<!--            <el-tag :type="item.publicBoolean ? 'success':'info'">{{item.publicBoolean ? '已发布':'未发布'}}</el-tag>-->
            <el-col :offset="2" :span="6">
              <el-tag v-if="!item.publicBoolean" type="info">未发布</el-tag>              
            </el-col>

            <el-popover
                placement="right"
                title="链接地址"
                width="200"
                trigger="hover"
            >
              <el-link
                  type="primary"
                  :href="publishLink+item.id"
                  target="_blank"
                  :underline="false"
              >
                {{ publishLink+item.id }}
              </el-link>
              <el-tag
                  slot="reference"
                  v-if="item.publicBoolean"
              >
                已发布
              </el-tag>
            </el-popover>

          </el-row>


          <div class="time">{{ item.created }}</div>
          <div class="bts">
            <el-button size="mini" type="success" icon="el-icon-edit-outline" circle title="编辑"
                       @click="editMapProject(item)"></el-button>
            <el-button size="mini" type="info" icon="el-icon-document-copy" circle title="复制"
                       @click="copyMapProject(item)"></el-button>
            <el-button v-if="item.publicBoolean" size="mini" type="primary" plain icon="el-icon-close" circle title="取消发布"
                       @click="cancelPublicMap(item)"></el-button>  
            <el-button v-if="!item.publicBoolean" size="mini" type="primary" plain icon="el-icon-s-promotion" circle title="发布"
                       @click="publicMap(item)"></el-button> 
            <el-button size="mini" type="warning" icon="el-icon-refresh" circle title="更换发布链接"
                       @click="changeMapLink(item)"></el-button>                       
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
      imgDefault: require("../assets/imgs/map-icon.png"),
      prjIndex: -1,   //工程序号

      currentPage: 1,
      pageSize: 8,
      searchInput: "",
      publishLink:this.reqUrl + "/mapProject/getPublishedMap/"
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
            console.log("mapProjectData",res)
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

    prjNameChange(item){
      this.prjIndex = -1;
      requestApi
        .updateMapProject(JSON.parse(JSON.stringify(item)))
        .then((res) => {
          if(res.data.code === 0){
            console.log("改名成功！");
          }else{
            console.log("改名失败！",res);
          }
        })  
        .catch((err)=>{
        console.log(err);
        })    
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

    publicMap(item) {
      this.$confirm('确认发布地图, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        requestApi.publicMap(item.id)
            .then((res) => {
              if (res.data.code === 0) {
                this.getMapProjectList()
                this.$message.success("地图发布成功:" + item.name);
              } else {
                this.$message.info("地图发布失败");
              }
            })
            .catch((error) => {
              console.log(error);
            });
      }).catch(() => {
        this.$message.info("地图发布失败");
      });


    },

    cancelPublicMap(item) {
      this.$confirm('取消地图发布, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        requestApi.cancelPublicMap(item.id)
            .then((res) => {
              if (res.data.code === 0) {
                this.getMapProjectList()
                this.$message.success("取消地图发布成功:" + item.name);
              } else {
                this.$message.info("取消发布失败");
              }
            })
            .catch((error) => {
              console.log(error);
            });
      }).catch(() => {
        this.$message.info("取消发布失败");
      });


    },

    changeMapLink(item) {
      this.$confirm('确认更新发布链接, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        requestApi.changeMapLink(item.id)
            .then((res) => {
              if (res.data.code === 0) {
                this.getMapProjectList()
                this.$message.success("发布链接更新成功:" + item.name);
              } else {
                this.$message.info("发布链接更新失败");
              }
            })
            .catch((error) => {
              console.log(error);
            });
      }).catch(() => {
        this.$message.info("发布链接更新失败");
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
  padding-top:10px;
  width: 80%;
  height: calc(100vh - 300px);
  display: flex;
  justify-content: flex-start;
  /* align-content:center ; */
  flex-wrap: wrap;
  margin: 20px auto;
  overflow-y: scroll;
}

.project-item {
  height: calc(15vh + 150px);
  max-height: 380px;
  width: 18%;
  min-width: 200px;
  max-width: 250px;
  margin: 20px;
}

.project-item-image {
  width: 100%;
  height: 15vh;
}

.projectTitle{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 45px;
}
.projectTitle h3 {
  display: inline-block;
  margin: 10px 0px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.projectTitle .el-icon-edit {
  display: none;
}
.projectTitle:hover .el-icon-edit,.el-icon-check{
  display: block;
  cursor: pointer;
}
.projectTitle:hover h3 {
  cursor: pointer;
  color: #75b9ff;
}


.bts {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

</style>