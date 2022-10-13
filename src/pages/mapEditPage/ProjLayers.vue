<template>
  <div style="width: 97% ">

    <div style="width: 90%;  display: flex;justify-content: space-between;    margin-left: 24px;">
      <el-switch
          :width="30"
          v-model="allLayerShow"
          @change="allLayerShowSwitchChange(allLayerShow)"
      >
      </el-switch>

      <el-button type="primary" size="mini" @click="addGroup">添加组
      </el-button>

      <el-popconfirm
          title="确定删除全部图层吗？"
          @confirm="allLayerDelete()"
      >
        <el-button slot="reference" type="info" size="mini">一键删除
        </el-button>
      </el-popconfirm>

    </div>

    <el-tree
        :data="layersTree"
        node-key="id"
        default-expand-all
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        :expand-on-click-node="false"
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag">

      <div class="custom-tree-node" style="width: 330px; display: flex;justify-content: space-between;"
           slot-scope="{ node, data }">

        <div style="display: flex;">
          <el-switch
              :width="30"
              style=" margin-top: 5px;  margin-right: 5px;"
              v-model="data.show"
              @click.stop.native="()=>{}"
              @change="showSwitchChange(data.show,data)"
          >
          </el-switch>
          <div v-if="data.nodeType=='layer'">
            <h4
                style="width: 130px;    text-overflow: ellipsis;    white-space: nowrap;    overflow: hidden;"
                :title="data.showName"
            >
              {{ data.showName }}
            </h4>
          </div>

          <div v-else class="projectTitle" v-show="data.id!=nowGroupId"  >
            <h4
                :title="data.showName"
                @click="nowGroupId = data.id">
              {{ data.showName }}
            </h4>
            <i class="el-icon-edit" @click="nowGroupId = data.id"></i>
          </div>
          <div v-show="data.id==nowGroupId" class="projectTitle">
            <el-input
                v-model="data.showName"
                size="mini"
                @change.stop.native="groupNameChange(data)"
            ></el-input>
            <i class="el-icon-check" @click="groupNameChange(data)"></i>
          </div>

        </div>

        <div v-if="data.nodeType=='layer'">

          <el-button
              size="mini"
              type="success"
              @click="handleLayerEdit(data)"
              icon="el-icon-edit"
              circle
              title="编辑图层"
              style="margin-left: 5px"
          >

          </el-button>

          <el-popconfirm
              title="确定删除该图层吗？"
              @confirm="handleLayerDelete(data)"
          >
            <el-button
                slot="reference"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                circle
                title="删除图层"
                style="margin-left: 5px"
            >
            </el-button>
          </el-popconfirm>

          <el-button
              v-if="data.type != 'background'"
              size="mini"
              slot="reference"
              type="primary"
              @click="openTemplateEdit(node,data)"
              icon="el-icon-s-grid"
              circle
              :title="'应用' + data.type+ '样式'"
              style="margin-left: 5px"
          >
          </el-button>
        </div>
        <div v-else>
          <el-popconfirm
              title="确定删除该组吗？"
              @confirm="handleGroupDelete(data)"
          >
            <el-button
                slot="reference"
                size="mini"

                icon="el-icon-minus"
                circle
                title="删除组"
                style="margin-left: 5px"
            >
            </el-button>
          </el-popconfirm>

        </div>
      </div>

    </el-tree>
  </div>
</template>
<script>
// import requestApi from "../../api/requestApi";
import {mapState, mapActions, mapMutations} from 'vuex'
import {nanoid} from 'nanoid'
import requestApi from "../../api/requestApi";

export default {
  name: "LayersList",
  props: [],
  data() {
    return {
      // vuex参数
      mapProjectInfo: '',
      layersName: '',
      layers: '',
      sources: '',
      nowLayerIndex: 0,
      originStyle: {},

      allLayerShow: true,

      layersTree: [],

      groupIds: [],
      nowGroupId:""

    }
  },
  computed: {
    ...mapState({
      mapProjectInfoProp: 'mapProjectInfo',
      layersNameProp: 'layersName',
      layersProp: 'layers',
      nowLayerIndexProp: 'nowLayerIndex',
      originStyleProp: 'originStyle',
      sourcesProp: 'sources',
      layersTreeProp: 'layersTree',
      sourceNameObjectProp: 'sourceNameObject',
      layersNameObjectProp: 'layersNameObject'
    }),
  },
  mounted() {
    // 等初始组件信息加载完
    this.$bus.$on("init", () => {
      this.infoInit();
    })

    this.$bus.$on("map", (data) => {
      switch (data.type) {
        case 'addLayer1':           // data:{type:'',layer:{}}
          if (data.drag == undefined)
            this.addLayerToTree(data.layer)
          break;
        case 'addLayer2':           // data:{type:'',id:'',layer:{}}  添加在指定图层后
          if (data.drag == undefined)
            this.addLayerToTree(data.layer)
          break;
      }
    })

  },
  methods: {
    // vuex
    ...mapActions({updateParm: 'update'}),        //将 `this.updateParm(data)` 映射为 `this.$store.dispatch('update',data)`
    ...mapMutations({UPDATEPARM: 'UPDATE'}),      //将 `this.UPDATEPARM(data)` 映射为 `this.$store.commit('UPDATE',data)`
    infoInit() {
      // 初始化vuex管理参数
      this.mapProjectInfo = this.mapProjectInfoProp;
      this.layersName = this.layersNameProp;
      this.layers = this.layersProp;
      this.sources = this.sourcesProp;
      this.nowLayerIndex = this.nowLayerIndexProp;
      this.originStyle = this.originStyleProp;
      this.layersTree = this.layersTreeProp
      this.layersNameObject = this.layersNameObjectProp
      this.sourceNameObject = this.sourceNameObjectProp

      // for (let i = 0; i < this.layers.length; i++) {
      //   let layer=this.layers[i]
      //   let groupId=layer["metadata"]["mapbox:group"]
      //   if(groupId==undefined){
      //     this.layersTreeData.push(layer)
      //   }else{
      //     if(this.groupIds.indexOf(groupId)==-1){
      //       let groupNode={}
      //       groupNode["id"]=groupId
      //       groupNode["showName"]=this.mapProjectInfo["metadata"]["mapbox:group"][groupId][name]
      //       groupNode["nodeType"]="group"
      //       groupNode["children"]=[layer]
      //       this.layersTreeData.push(groupNode)
      //     }else {
      //       for (let j = 0; j <  this.layersTreeData; j++) {
      //         let node= this.layersTreeData[j]
      //         if(node["nodeType"]=="group"&&node["id"]==groupId){
      //           let children=node["children"]
      //           children.push(layer)
      //         }
      //       }
      //     }
      //   }
      //
      //   // let node={
      //   //
      //   // }
      //
      // }
    },

    addLayerToTree(layerData) {
      this.layersTree.unshift(layerData)
      this.UPDATEPARM({parm: 'layersTree', value: this.layersTree});
    },

    showSwitchChange(val, row) {
      if (row.nodeType == "group") {
        this.groupLayerShowChange(val, row)
      } else {
        this.handleLayerShowSwitchChange(val, row)
      }
    },

    groupLayerShowChange(val, row) {
      let layers = row.children
      for (const layer of layers) {
        layer.show = val
        this.handleLayerShowSwitchChange(val, layer)
      }
    },

    // 单个图层开关
    handleLayerShowSwitchChange(val, row) {
      if (val) {
        this.handleLayoutChange(row.id, "visibility", "visible");

      } else {
        this.handleLayoutChange(row.id, "visibility", "none");
      }
      let index = this.getLayerIndexFromTree(row.id)
      this.layers[index]["show"] = val
      this.UPDATEPARM({parm: 'layers', value: this.layers});
    },
    // 删除单图层
    handleLayerDelete(row) {
      console.log("ready delete layer:", row);
      this.deleteLayerFromTree(row)
      let index = this.getLayerIndexFromTree(row["id"])
      // 先关闭图层样式编辑框，防止报错
      this.$bus.$emit("mapEdit", {type: 'off'});
      let aimSource = row.source;
      let layerOriginName = row.originName;
      let layerid = row.id;
      this.layers.splice(index, 1);
      this.layersName.splice(index, 1);
      this.originStyle.splice(index, 1);
      this.layersNameObject[layerOriginName] -= 1;
      this.handleRemoveLayer(layerid);
      //如果没有layer使用source，则删除source
      if (this.layersNameObject[layerOriginName] === 0) {
        delete this.layersNameObject[layerOriginName];
        //mbTile不删除source，背景没有source
        if (row.sourceType != "mbTile" && row.type != "background") {
          this.handleRemoveSource(aimSource);
          delete this.sources[aimSource];
          for (let key in this.sourceNameObject) {
            if (this.sourceNameObject[key] === aimSource) {
              delete this.sourceNameObject[key];
              break;
            }
          }
          //source没有再使用时,删除后台的tileJson
          this.deleteTileJson(row.source);
        }
      }
      // vuex更新参数状态
      this.UPDATEPARM({parm: 'layers', value: this.layers});
      this.UPDATEPARM({parm: 'sources', value: this.sources});
      this.UPDATEPARM({parm: 'layersName', value: this.layersName});
      this.UPDATEPARM({parm: 'originStyle', value: this.originStyle});
      this.UPDATEPARM({parm: 'layersNameObject', value: this.layersNameObject});
      this.UPDATEPARM({parm: 'sourceNameObject', value: this.sourceNameObject});
    },

    deleteTileJson(tileJsonId) {
      requestApi
          .deleteTileJson(tileJsonId)
          .then((res) => {
            console.log("delete tileJson: ", res);
          })
          .catch((error) => {
            console.log(error);
          });
    },

    deleteLayerFromTree(aimLayerData) {
      for (let i = 0; i < this.layersTree.length; i++) {
        let node = this.layersTree[i]
        if (node.nodeType == "group") {
          let children = node.children
          for (let j = 0; j < children.length; j++) {
            if (aimLayerData.id == children[j].id) {
              this.layersTree[i].children.splice(j, 1);
            }
          }
        } else if (aimLayerData.id == node.id) {
          this.layersTree.splice(i, 1);
        }
      }
      this.UPDATEPARM({parm: 'layersTree', value: this.layersTree});
    },

    handleGroupDelete(data) {
      let groupIndex = this.layersTree.indexOf(data)
      const children = JSON.parse(JSON.stringify(data.children));
      for (let i = 0; i < children.length; i++) {
        this.handleLayerDelete(children[i])
      }
      this.layersTree.splice(groupIndex, 1);
      this.UPDATEPARM({parm: 'layersTree', value: this.layersTree});
    },

    // #多图层操作
    // 全部图层的显示隐藏
    allLayerShowSwitchChange(val) {
      for (let i = 0; i < this.layersTree.length; i++) {
        let node = this.layersTree[i]
        let children = node["children"]
        if (children) {
          for (let j = 0; j < children.length; j++) {
            this.layersTree[i]["children"][j]["show"] = val
          }
        }
        this.layersTree[i]["show"] = val
      }

      for (let i in this.layers) {
        this.layers[i].show = val;
        // this.handleLayerShowSwitchChange(val, item);
        if (val) {
          this.handleLayoutChange(this.layers[i].id, "visibility", "visible");
        } else {
          this.handleLayoutChange(this.layers[i].id, "visibility", "none");
        }
      }
      this.UPDATEPARM({parm: 'layers', value: this.layers});

    },
    // 一键删除
    allLayerDelete() {
      // 先关闭图层样式编辑框，防止报错
      this.$bus.$emit("mapEdit", {type: 'off'});
      for (let i in this.layers) {
        let item = JSON.parse(JSON.stringify(this.layers[i]));
        let aimSource = item.source;
        let layerOriginName = item.originName;
        let layerid = item.id;
        this.layersNameObject[layerOriginName] -= 1;
        this.handleRemoveLayer(layerid);
        //如果没有layer使用source，则删除source
        if (this.layersNameObject[layerOriginName] === 0) {
          delete this.layersNameObject[layerOriginName];
          //mbTile不删除source，背景没有source
          if (item.sourceType != "mbTile" && item.type != "background") {
            this.handleRemoveSource(aimSource);
            delete this.sources[aimSource];
            for (let key in this.sourceNameObject) {
              if (this.sourceNameObject[key] === aimSource) {
                delete this.sourceNameObject[key];
                break;
              }
            }
            //source没有再使用时,删除后台的tileJson
            this.deleteTileJson(item.source);
          }
        }
      }
      // 循环完再进行视图数据初始化,避免循环中渲染。
      this.layers = [];
      this.layersName = [];
      this.originStyle = [];
      this.layersTree = []

      // vuex更新参数状态
      this.UPDATEPARM({parm: 'layers', value: this.layers});
      this.UPDATEPARM({parm: 'sources', value: this.sources});
      this.UPDATEPARM({parm: 'layersName', value: this.layersName});
      this.UPDATEPARM({parm: 'originStyle', value: this.originStyle});
      this.UPDATEPARM({parm: 'layersNameObject', value: this.layersNameObject});
      this.UPDATEPARM({parm: 'sourceNameObject', value: this.sourceNameObject});
      this.UPDATEPARM({parm: 'layersTree', value: this.layersTree});
    },

    // #对map组件方法的封装
    handleLayoutChange(layerName, key, value) {
      const data = {
        type: 'setLayout',
        layerName: layerName,
        key: key,
        value: value
      }
      this.$bus.$emit("map", data);
    },
    handlePaintChange(layerName, key, value) {
      const data = {
        type: 'setPaint',
        layerName: layerName,
        key: key,
        value: value
      }
      this.$bus.$emit("map", data);
    },
    handleRemoveSource(sourceName) {
      const data = {
        type: 'removeSource',
        id: sourceName
      }
      this.$bus.$emit("map", data);
    },
    handleRemoveLayer(layerName) {
      const data = {
        type: 'removeLayer',
        id: layerName
      }
      this.$bus.$emit("map", data);
    },
    // ##将地图定位到对应范围位置
    handleLayerClick(row) {
      const data = {
        type: 'mapFit',
        row: row,        // 点击的图层layer信息
      };
      this.$bus.$emit("map", data);
    },

    // #对地图样式编辑框组件的封装
    handleLayerEdit(layerData) {
      let index = this.getLayerIndexFromTree(layerData["id"])
      console.log("nowlayer", layerData, index)
      // 预先更新vuex参数给函数调用
      this.UPDATEPARM({parm: 'nowLayerIndex', value: index});
      const data = {
        type: 'open',
        layer: layerData,
      }
      this.$bus.$emit("mapEdit", data);
    },

    // 对样式模板组件的封装
    openTemplateEdit(index, row) {
      // 预先更新vuex参数给函数调用
      this.UPDATEPARM({parm: 'nowLayerIndex', value: index});
      const data = {
        type: 'open',
        layer: row,
      }
      this.$bus.$emit("styleTemp", data);
    },

    handleDragStart(node) {
      console.log('drag start', node);
    },
    handleDragEnter(draggingNode, dropNode) {
      console.log('tree drag enter: ', dropNode.data.showName);
    },
    handleDragLeave(draggingNode, dropNode) {
      console.log('tree drag leave: ', dropNode.data.showName);
    },
    handleDragOver(draggingNode, dropNode) {
      console.log('tree drag over: ', dropNode.data.showName);
    },
    handleDragEnd(draggingNode, dropNode, dropType) {
      console.log('tree drag end: ', dropNode && dropNode.data.showName, dropType);
    },
    handleDrop(draggingNode, dropNode, dropType) {
      console.log('tree drop: ', draggingNode, dropNode, dropType);
      if (draggingNode.data.nodeType == "layer") {
        this.handleLayerDrag(draggingNode)
      } else {
        this.handleGroupDrag(draggingNode)
      }
    },

    handleLayerDrag(draggingNode) {
      let nowLayerIndex = -1
      let newLayers = []

      for (let i = 0; i < this.layersTree.length; i++) {
        let node = this.layersTree[i]
        if (node.nodeType == "group") {
          for (let j = 0; j < node.children.length; j++) {
            newLayers.push(node.children[j])
            if (node.children[j].id == draggingNode.data.id) {
              nowLayerIndex = newLayers.length - 1
            }
          }
        } else {
          newLayers.push(node)
          if (node.id == draggingNode.data.id) {
            nowLayerIndex = newLayers.length - 1
          }
        }
      }

      this.layers = newLayers
      this.UPDATEPARM({parm: 'layers', value: this.layers});

      this.handleRemoveLayer(draggingNode.data.id)
      if (nowLayerIndex == 0) {
        this.$bus.$emit("map", {
          type: 'addLayer1',
          drag: true,
          layer: draggingNode.data
        });
      } else {
        this.$bus.$emit("map", {
          type: 'addLayer2',
          id: this.layers[nowLayerIndex - 1].id,
          drag: true,
          layer: draggingNode.data
        });
      }
    },

    handleGroupDrag(draggingNode) {
      let newLayers = []
      for (let i = 0; i < this.layersTree.length; i++) {
        let node = this.layersTree[i]
        if (node.nodeType == "group") {
          for (let j = 0; j < node.children.length; j++) {
            newLayers.push(node.children[j])
          }
        } else {
          newLayers.push(node)
        }
      }
      this.layers = newLayers
      this.UPDATEPARM({parm: 'layers', value: this.layers});

      let layerNodes = draggingNode.data.children
      for (let layerNode of layerNodes) {
        this.handleRemoveLayer(layerNode.id)
        let nowLayerIndex = this.getLayerIndexFromTree(layerNode.id)

        if (nowLayerIndex == 0) {
          this.$bus.$emit("map", {
            type: 'addLayer1',
            drag: true,
            layer: layerNode
          });
        } else {
          this.$bus.$emit("map", {
            type: 'addLayer2',
            id: this.layers[nowLayerIndex - 1].id,
            drag: true,
            layer: layerNode
          });
        }

      }


    },

    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.nodeType == "layer" && type == "inner") {
        return false
      } else if (draggingNode.data.nodeType == "group" && type == "inner") {
        return false
      } else if (draggingNode.data.nodeType == "group" && dropNode.level == 2) {
        return false
      } else {
        return true
      }
    },

    allowDrag(draggingNode) {
      draggingNode
      return true;
    },

    append(data) {
      const newChild = {id: data.id++, label: 'test', children: []};
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      data.children.push(newChild);
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },

    addGroup() {
      let groupNode = {}
      groupNode["id"] = nanoid()
      groupNode["showName"] = "组"
      groupNode["nodeType"] = "group"
      groupNode["children"] = []
      groupNode["show"] = true
      this.layersTree.unshift(groupNode)
      this.UPDATEPARM({parm: 'layersTree', value: this.layersTree});
    },

    getLayerIndexFromTree(layerId) {
      for (let i = 0, len = this.layers.length; i < len; i++) {
        if (this.layers[i]["id"] == layerId)
          return i
      }
    },
    groupNameChange(data){
      data
      this.nowGroupId = -1;
    }

  }
}
</script>

<style scoped>
/deep/ .el-tree-node__content {
  height: 40px;
}
.projectTitle{
  max-width: 130px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: flex;align-items: center;
}

.projectTitle .el-icon-edit {
  display: none;
}
.projectTitle:hover .el-icon-edit,.el-icon-check{
  display: block;
  cursor: pointer;
}
.projectTitle:hover h4 {
  cursor: pointer;
  color: #75b9ff;
}
</style>