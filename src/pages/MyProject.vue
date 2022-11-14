<template>
  <div style="width: 100%">
    <div class="search-box-project">
      <el-button
        type="primary"
        icon="el-icon-document-add"
        @click="addNewMapProject"
        >新建项目</el-button
      >
      &nbsp;&nbsp;&nbsp;&nbsp;
      <el-upload
        :limit="1"
        action
        ref="upload"
        accept=".json"
        :on-change="importFile"
        :auto-upload="false"
        :show-file-list="false"
        list-type="multipart/form-data"
      >
        <el-button slot="trigger" type="primary" icon="el-icon-upload"
          >导入项目</el-button
        >
      </el-upload>
      <el-input
        placeholder="请输入搜索内容"
        prefix-icon="el-icon-search"
        v-model="searchInput"
        @keyup.enter.native="getMapProjectList()"
        style="margin: 0 20px"
      >
      </el-input>
      <el-button
        type="success"
        icon="el-icon-search"
        @click="getMapProjectList()"
        >搜索</el-button
      >
    </div>
    <el-dialog
      title="项目导入"
      :visible.sync="importEditorShow"
      width="750px"
      :modal="false"
      center
    >
      <el-table :data="sources" style="width: 100%" max-height="600px" :header-cell-style="{background:'#f4f3f9',color:'#606266'}">
        <el-table-column label="原数据源" width="100">
          <template slot-scope="scope">
            <el-tag :type="typeContent[scope.row.type][0]">{{
              typeContent[scope.row.type][1]
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="数据名称"
          width="150"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column label="本地数据" width="200">
          <template slot-scope="scope">
            <!-- 非multiPG类 -->
            <el-select
              v-if="scope.row.newType != 'multiPG'"
              v-model="scope.row.jsonId"
              clearable
              @change="selectPG(dataList[scope.row.newType],scope.row.jsonId,scope.row.newType,scope.$index)"
              :placeholder="typeContent[scope.row.newType][2]"
            >
              <el-option
                v-for="item in dataList[scope.row.newType]"
                :key="item.id"
                :label="item[typeContent[scope.row.newType][3]]"
                :value="item[typeContent[scope.row.newType][4]]"
              >
              </el-option>
            </el-select>
            <!-- multiPG类，选择数据库 -->
            <el-select
              v-if="scope.row.newType == 'multiPG'"
              v-model="scope.row.dataBase"
              @change="dataBaseSelect(scope.$index,$event)"
              clearable
              :placeholder="typeContent[scope.row.newType][2]"
            >
              <el-option
                v-for="(item,index) in dataList[scope.row.newType]"
                :key="item.id"
                :label="item[typeContent[scope.row.newType][3]]"
                :value="index"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="上传数据/选择远程数据源" width="200">
          <template slot-scope="scope">
            <!-- 允许defaultPG类型添加数据 -->
            <el-upload
              v-if="scope.row.newType == 'defaultPG'"
              :action="reqUrl+'/shp/uploadMultiShp'"
              :on-success="handleMultiShpUpSuccess"
              ref="shpUpload"
              accept=".zip"
              :auto-upload="false"
              list-type="multipart/form-data"
              :disabled="scope.row.jsonId !== ''"
            >
              <el-button
                slot="trigger"
                :disabled="scope.row.jsonId !== ''"
                size="small"
                type="primary"
                >选取文件</el-button
              >
            </el-upload>            
            <!-- multiPG数据选择 -->
            <el-select
              v-if="scope.row.newType == 'multiPG'"
              :disabled="scope.row.dataBase === ''"
              v-model="scope.row.jsonId"
              clearable
              @change="selectPG(multiDataBase[scope.$index],scope.row.jsonId,scope.row.newType,scope.$index)"
              value-key="originName"
              placeholder="请选择远程PG数据"
            >
              <el-option
                v-for="item in multiDataBase[scope.$index]"
                :key="item.originName"
                :label="item.originName"
                :value="item"
              >
              </el-option>
            </el-select>            
            <div v-if="!scope.row.newType.includes('PG')">
              <i class="el-icon-info"></i>&nbsp;
              <span>请在数据服务中添加</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="切换" width="50">
          <template slot-scope="scope">
            <el-tooltip 
              effect="dark" 
              :content="scope.row.newType != 'defaultPG' ? '切换至本地PG' : '切换至远程PG'" 
              placement="right">
              <el-button 
                v-if="scope.row.newType.includes('PG')" 
                type="text" 
                icon="el-icon-refresh"
                @click="changePG(scope.row.newType,scope.$index)"
                >
            </el-button>
            </el-tooltip>
          </template>
        </el-table-column>        
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="importEditorShow = false">取 消</el-button>&nbsp;
        <el-button slot="reference" type="warning" @click="importConfirm"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <div class="projectsBox">
      <el-card
        class="project-item"
        v-for="(item, index) in mapProjectData"
        :key="item.date"
        shadow="hover"
      >
        <el-image
          @click="editMapProject1(item)"
          class="project-item-image"
          style="cursor: pointer"
          fit="contain"
          :src="
            item.mapImgUrl.mapImgUrl ? item.mapImgUrl.mapImgUrl : imgDefault
          "
        ></el-image>
        <div>
          <el-row type="flex" align="middle">
            <el-col
              :span="16"
              v-show="prjIndex != index"
              class="projectTitle"
              @click.native="prjIndex = index"
            >
              <h3 :title="item.name">{{ item.name }}</h3>
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
              trigger="click"
            >
              <el-link
                type="primary"
                :href="publishLink + item.id"
                target="_blank"
                :underline="false"
              >
                {{ publishLink + item.id }}
              </el-link>
              <el-tag
                slot="reference"
                style="cursor: pointer"
                v-if="item.publicBoolean"
              >
                查看发布链接
              </el-tag>
            </el-popover>
          </el-row>

          <div class="time">{{ item.created }}</div>
          <div class="bts">
            <el-button
              size="mini"
              type="success"
              icon="el-icon-edit-outline"
              circle
              title="编辑"
              @click="editMapProject1(item)"
            ></el-button>
            <!-- <el-button size="mini" type="success" icon="el-icon-edit-outline" circle title="编辑"
                       @click="editMapProject(item)"></el-button> -->
            <el-button
              size="mini"
              type="info"
              icon="el-icon-document-copy"
              circle
              title="复制"
              @click="copyMapProject(item)"
            ></el-button>
            <el-button
              v-if="item.publicBoolean"
              size="mini"
              type="primary"
              plain
              icon="el-icon-close"
              circle
              title="取消发布"
              @click="cancelPublicMap(item)"
            ></el-button>
            <el-button
              v-if="!item.publicBoolean"
              size="mini"
              type="primary"
              plain
              icon="el-icon-s-promotion"
              circle
              title="发布"
              @click="publicMap(item)"
            ></el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-refresh"
              circle
              title="更换发布链接"
              @click="changeMapLink(item)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              title="删除"
              @click="deleteMapProjectById(item)"
            ></el-button>
            <el-button
              size="mini"
              icon="el-icon-download"
              circle
              title="导出项目"
              @click="exportMapProjectInfo(item)"
            ></el-button>
          </div>
        </div>
      </el-card>
    </div>
    <div style="width: 80vw; margin: 0 auto">
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
import FileSaver from "file-saver";
// import jsonInfo from "../assets/js/project";
import { fileImport } from "@/serve/interpolation";
import initTileJson from "@/assets/js/initTileJson";

// import initProjectJson from "../assets/js/initMapProjectJson";
// import config from "../config";

export default {
  data() {
    return {
      mapProjectData: [],
      mapProjectTotal: 0,
      mapProjectNames: {},
      imgDefault: require("../assets/imgs/map-icon.png"),
      prjIndex: -1, //工程序号

      // 导入项目
      importEditorShow: false,
      uploadFile: null,
      // uploadFile: jsonInfo,
      sources: [],          // [{name:'',type:'',sourceId:'',jsonId:'',newType:'', newSourceInfo(sourceId,source-layer):[]}],用于替换为本地source
      typeContent: {        // 记录各个类型要展示的信息
        defaultPG: ["primary","本地PG","请选择本地PG数据","originName","tilejsonId"],
        multiPG: ["success","远程PG","请选择远程PG数据库","name","geoType"],
        mbTile: ["warning","mbTile","请选择mbTile数据","name","tileJsonId"],
        TMS: ["info","TMS","请选择TMS数据","name","url"],
      },
      multiDataBase: [],    // 所选远程PG的
      dataList: { defaultPG: [], multiPG: [], mbTile: [], TMS: [] },
      uploadFileUrl: {},

      currentPage: 1,
      pageSize: 8,
      searchInput: "",
      publishLink: this.reqUrl + "/mapProject/getPublishedMap/",
    };
  },

  mounted() {
    document.title = "地图项目";
    this.getMapProjectList();
    // this.importInfoInit();
  },
  methods: {
    getMapProjectList() {
      requestApi
        .getMapProjectList({
          asc: false,
          page: this.currentPage,
          pageSize: this.pageSize,
          searchText: this.searchInput,
          sortField: "created",
        })
        .then((res) => {
          let data = res.data.data;
          console.log("mapProjectData", res);
          this.mapProjectData = data.content;
          this.mapProjectTotal = data.totalElements;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    addNewMapProject() {
      this.$prompt("请输入项目名称", "新建项目", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          let newProject = {
            mapProjectName: value,
          };
          requestApi
            .createNewMapProject(newProject)
            .then((res) => {
              if (res.data.code === 0) {
                this.$message.success("项目创建成功:" + value);
                this.getMapProjectList();
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message.info("取消新建项目");
        });
    },

    editMapProject(item) {
      let mapProjectId = item.id;
      let newUrl = this.$router.resolve({ path: `/MapEditor/${mapProjectId}` });
      window.open(newUrl.href, "_blank");
    },
    editMapProject1(item) {
      let mapProjectId = item.id;
      let newUrl = this.$router.resolve({ path: `/MapEdit/${mapProjectId}` });
      window.open(newUrl.href, "_blank");
    },

    prjNameChange(item) {
      this.prjIndex = -1;
      requestApi
        .updateMapProject(JSON.parse(JSON.stringify(item)))
        .then((res) => {
          if (res.data.code === 0) {
            console.log("改名成功！");
          } else {
            console.log("改名失败！", res);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    copyMapProject(item) {
      this.$prompt("请输入新项目名称", "复制项目", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: item.name + "_copy",
      })
        .then(({ value }) => {
          let copyInfo = {
            aimMapProjectName: value,
            originMapProjectId: item.id,
          };
          requestApi
            .copyMapProject(copyInfo)
            .then((res) => {
              if (res.data.code === 0) {
                this.$message.success("项目复制成功:" + value);
                this.getMapProjectList();
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message.info("取消新建项目");
        });
    },

    publicMap(item) {
      this.$confirm("确认发布地图, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          requestApi
            .publicMap(item.id)
            .then((res) => {
              if (res.data.code === 0) {
                this.getMapProjectList();
                this.$message.success("地图发布成功:" + item.name);
              } else {
                this.$message.info("地图发布失败");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message.info("地图发布失败");
        });
    },

    cancelPublicMap(item) {
      this.$confirm("取消地图发布, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          requestApi
            .cancelPublicMap(item.id)
            .then((res) => {
              if (res.data.code === 0) {
                this.getMapProjectList();
                this.$message.success("取消地图发布成功:" + item.name);
              } else {
                this.$message.info("取消发布失败");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message.info("取消发布失败");
        });
    },

    changeMapLink(item) {
      this.$confirm("确认更新发布链接, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          requestApi
            .changeMapLink(item.id)
            .then((res) => {
              if (res.data.code === 0) {
                this.getMapProjectList();
                this.$message.success("发布链接更新成功:" + item.name);
              } else {
                this.$message.info("发布链接更新失败");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message.info("发布链接更新失败");
        });
    },

    deleteMapProjectById(item) {
      this.$confirm("确认删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          requestApi
            .deleteMapProjectById(item.id)
            .then((res) => {
              if (res.data.code === 0) {
                this.getMapProjectList();
                this.$message.success("成功删除:" + item.name);
              } else {
                this.$message.info("取消删除");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    exportMapProjectInfo(item) {
      let content = JSON.stringify(item);
      let blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, `${item.name}.json`);
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.getMapProjectList();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getMapProjectList();
    },

    // #导入地图
    importFile(file) {
      let reader = new FileReader();
      reader.readAsText(file.raw, "UTF-8");
      reader.onload = (e) => {
        this.uploadFile = null;
        this.uploadFile = JSON.parse(e.target.result);
        this.importInfoInit();
        console.log("读取的文件", this.uploadFile);
      };
    },
    // 对文件的sources进行识别
    async importInfoInit() {
      // 先初始化工程参数
      let typeList = [];
      this.sources = [];
      for (let item in this.uploadFile.sources) {
        let name = item.slice(0, item.lastIndexOf("_"));
        let type = item.slice(item.indexOf("#") + 1);
        type = type == "meta" ? "mbTile" : type;
        typeList.push(type);
        let object = { name: name, type: type, sourceId: item, jsonId: "", newType: type, newSourceInfo: [] };
        if(type.includes('PG')){     // 远程PG要先选数据库，之后本地和远程shp可能交叉使用，故本地pg也添加dataBase字段
          object['dataBase'] = "";
        }
        this.sources.push(object);
      }
      console.log("sources", this.sources);
      this.dataList = await this.dataInfoInit(typeList);
      this.importEditorShow = true;
    },
    // 初始化本地数据信息
    async dataInfoInit(typeList) {
      console.log("信息初始化", typeList);
      let List = { defaultPG: [], multiPG: [], mbTile: [], TMS: [] };
      List["defaultPG"] = await requestApi
        .getShpList({
          asc: false,
          page: 1,
          shpPageSize: 10,
          searchText: "",
          sortField: "createTime",
        })
        .then((res) => {
          console.log("shpDataList", res.data);
          return res.data.data.content;
        })
        .catch((error) => {
          console.log("查询shp失败", error);
        });
      List["multiPG"] = await requestApi
        .getPgList()
        .then((res) => {
          console.log("数据库源:", res);
          return res.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
      List["mbTile"] = await requestApi
        .getMbtilesList()
        .then((res) => {
          return res.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
      List["TMS"] = await requestApi
        .getThirdPartSourceList("TMS")
        .then((res) => {
          if (res.data.code == 0) {
            return res.data.data;
          } else {
            console.log(res.data.csg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      // if(typeList.indexOf('defaultPG') != -1){
      //   console.log('defaultPG');
      //   List['defaultPG'] = await requestApi
      //     .getShpList({
      //       asc: false,
      //       page: 1,
      //       shpPageSize: 10,
      //       searchText: '',
      //       sortField: "createTime",
      //     })
      //     .then((res) => {
      //       console.log("shpDataList", res.data);
      //       return res.data.data.content;
      //     })
      //     .catch((error) => {
      //       console.log("查询shp失败", error);
      //     });
      // }
      // else if(typeList.indexOf('multiPG') != -1){
      //   console.log('defaultPG');
      //   List['multiPG'] = await requestApi
      //     .getPgList()
      //     .then((res) => {
      //       console.log("数据库源:", res);
      //       return res.data.data;
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //     });
      // }
      // else if(typeList.indexOf('mbTile') != -1){
      //   console.log('defaultPG');
      //   await requestApi
      //     .getMbtilesList()
      //     .then((res) => {
      //       List['mbTile'] = res.data.data;
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //     });
      // }
      // else if(typeList.indexOf('TMS') != -1){
      //   console.log('defaultPG');
      //   await requestApi
      //     .getThirdPartSourceList(this.outUrlItem)
      //     .then((res) => {
      //       if (res.data.code == 0) {
      //         List['TMS'] = res.data.data;
      //       } else {
      //         console.log(res.data.csg);
      //       }
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
      // }
      console.log("List", List);

      return List;
    },
    // 远程PG数据库选择
    dataBaseSelect(rowIndex,optionIndex){
      if(optionIndex !== ''){
        this.multiDataBase[rowIndex] = this.dataList['multiPG'][optionIndex]['dataInfo'];
      }
    },
    // 更换PG数据
    selectPG(dataList,val,type,index){
      // 只有PG数据需要修改sourceId和source-layer
      if(type.includes('PG')){
        if(val !== ''){
          let List = dataList.filter(item => 
            item[this.typeContent[type][4]] == val||item == val
          )
          // 使用newSourceInfo管理sourceid和source-layer
          switch(type){
            case 'defaultPG':
              this.sources[index].newSourceInfo = [`${List[0].tableName}#defaultPG`,List[0].tableName];
              break
            case 'multiPG':
              this.sources[index].newSourceInfo = [`${List[0].originName}_#multiPG`,List[0].originName];
              break
          }
        }
      }
      console.log("PG",this.sources[index],this.dataList['multiPG'][this.sources[index]['dataBase']]);
    },
    // PG类型切换
    changePG(type,index){
      this.sources[index].jsonId = "";
      this.sources[index].newSourceInfo = [];
      this.sources[index].dataBase = "";
      this.sources[index].newType = type != 'defaultPG' ? 'defaultPG' : 'multiPG';
    },
    // 替换为本地信息，进行本地项目构建
    async importConfirm() {
      this.sources.forEach(item =>{
        // multiPG需要生成tileJson
        if(item.newType == 'multiPG'){
          let newTileJson = initTileJson;
          newTileJson.name = item.jsonId.originName;
          let mutiPgInfo = this.dataList['multiPG'][item['dataBase']];
          newTileJson.tiles = [
            this.reqUrl +
              "/multiPgSource/" +
              mutiPgInfo.ip +
              "/" +
              mutiPgInfo.port +
              "/" +
              mutiPgInfo.name +
              "/" +
              item.jsonId.originName +
              "/{z}/{x}/{y}.pbf",
          ];
          let vector_layer = {
            description: "",
            fields: item.jsonId.attrInfo,
            id: item.jsonId.originName,
          };
          newTileJson.vector_layers = [vector_layer];
          newTileJson.tileJsonType = 'multiPG';
          requestApi.createTileJson(initTileJson)
            .then(res=>{
              if (res.data.code !== 0) {
                console.log("添加source失败");
              }else{
                item.jsonId = res.data.data.tileJsonId;
              }
            });
        }
      })
      let file = await fileImport(this.sources,this.uploadFile);
      console.log('file',file);
      requestApi.importProject(file).then((res) => {
        console.log(res);
        if (res.data.msg == "Success") {
          this.$message.success(res.data.data);
          this.importEditorShow = false;
          this.getMapProjectList();
        } else {
          this.$message.danger(res.data.msg);
        }
      });
    },
    // 上传本地数据
    async handleMultiShpUpSuccess(res) {
      if (res.code != 0) {
        this.$message.error("shp上传成功但导入数据库失败！");
      } else {
        this.$message.success("shp成功上传");
      }
      this.dataList["defaultPG"] = await requestApi
        .getShpList({
          asc: false,
          page: 1,
          shpPageSize: 10,
          searchText: "",
          sortField: "createTime",
        })
        .then((res) => {
          console.log("shpDataList", res.data);
          return res.data.data.content;
        })
        .catch((error) => {
          console.log("查询shp失败", error);
        });
    },    
  },
};
</script>

<style scoped>
.search-box-project {
  width: 50%;
  margin: 20px auto 0px auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.projectsBox {
  padding-top: 10px;
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

.projectTitle {
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
.projectTitle:hover .el-icon-edit,
.el-icon-check {
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

/* 导入项目框 */
</style>
