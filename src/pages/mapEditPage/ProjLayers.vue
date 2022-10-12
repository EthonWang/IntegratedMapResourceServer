<template>
  <div style="width: 97% ">

    <div style="width: 97%;  display: flex;justify-content: space-between">
      <el-switch
          :width="30"
          v-model="allLayerShow"
          @change="allLayerShowSwitchChange()"
      >
      </el-switch>

      <el-button type="primary"  size="mini" @click="addGroup">添加组
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
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag">

      <div class="custom-tree-node" style="width: 330px; display: flex;justify-content: space-between;"
           slot-scope="{ node, data }">
        <div style="display: flex; " >
          <el-switch
              :width="30"
              style=" margin-top: 5px;  margin-right: 5px;"
              v-model="data.show"
              @change="handleLayerShowSwitchChange()"
          >
          </el-switch>

          <h4>{{ data.showName }}</h4>
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
          <el-button
              size="mini"
              type="danger"
              @click="handleLayerDelete(node,data)"
              icon="el-icon-delete"
              circle
              title="删除图层"
              style="margin-left: 5px"
          >
          </el-button>

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
          <el-button
              size="mini"
              @click="handleLayerDelete(node,data)"
              icon="el-icon-minus"
              circle
              title="删除组"
              style="margin-left: 5px"
          >
          </el-button>
        </div>
      </div>

    </el-tree>
  </div>
</template>
<script>
// import requestApi from "../../api/requestApi";
import {mapState,mapActions,mapMutations} from 'vuex'
import { nanoid } from 'nanoid'

export default {
  name: "LayersList",
  props: [],
  data() {
    return{
      // vuex参数
      mapProjectInfo: '',
      layersName: '',
      layers: '',
      nowLayerIndex: 0,
      originStyle: {},

      allLayerShow:true,

      layersTree: [],

      groupIds:[]

    }
  },
  computed:{
    ...mapState({mapProjectInfoProp:'mapProjectInfo',
                 layersNameProp:'layersName',
                 layersProp:'layers',
                 nowLayerIndexProp:'nowLayerIndex',
                 originStyleProp:'originStyle',
                 sourcesProp:'sources',
                 layersTreeProp:'layersTree'}),
  },   
  mounted() {
    // 等初始组件信息加载完
    this.$bus.$on("init",()=>{
      this.infoInit();
    })

    this.$bus.$on("map",(data)=>{
      switch (data.type) {
        case 'addLayer1':           // data:{type:'',layer:{}}
          this.addLayer(data.layer)
          break;
        case 'addLayer2':           // data:{type:'',id:'',layer:{}}  添加在指定图层后
          this.addLayer(data.layer)
          break;
      }
    })

  }, 
  methods:{
    // vuex
    ...mapActions({updateParm:'update'}),        //将 `this.updateParm(data)` 映射为 `this.$store.dispatch('update',data)`
    ...mapMutations({UPDATEPARM:'UPDATE'}),      //将 `this.UPDATEPARM(data)` 映射为 `this.$store.commit('UPDATE',data)`
    infoInit(){
      // 初始化vuex管理参数
      this.mapProjectInfo = this.mapProjectInfoProp;
      this.layersName = this.layersNameProp;
      this.layers = this.layersProp;
      this.nowLayerIndex = this.nowLayerIndexProp;
      this.originStyle = this.originStyleProp;
      this.layersTree=this.layersTreeProp

      console.log("layers",this.layers)
      console.log("mapProjectInfo",this.mapProjectInfo)





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

    addLayer(layerData){
      this.layersTree.unshift(layerData)
      this.UPDATEPARM({parm:'layersTree',value:this.layersTree});
      console.log(this.layersTree)
    },


    // #单图层操作
    // 单个图层开关
    handleLayerShowSwitchChange(val, row) {
      if (val) {
        this.handleLayoutChange(row.id, "visibility", "visible");
      } else {
        this.handleLayoutChange(row.id, "visibility", "none");
      }
    },   
    // 删除单图层
    handleLayerDelete(index, row) {
      console.log("ready delete layer:", row);
      // 先关闭图层样式编辑框，防止报错
      this.$bus.$emit("mapEdit",{type:'off'});
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
      this.UPDATEPARM({parm:'layers',value:this.layers});
      this.UPDATEPARM({parm:'sources',value:this.sources});
      this.UPDATEPARM({parm:'layersName',value:this.layersName});
      this.UPDATEPARM({parm:'originStyle',value:this.originStyle});
      this.UPDATEPARM({parm:'layersNameObject',value:this.layersNameObject});
      this.UPDATEPARM({parm:'sourceNameObject',value:this.sourceNameObject});
    },     
   

    // #多图层操作
    // 一键添加
    allLayerShowSwitchChange(val) {
      for (let i in this.layers) {
        const item = this.layers[i];
        this.layers[i].show = val;
        this.handleLayerShowSwitchChange(val, item);
      }
    },   
    // 一键删除
    allLayerDelete(){
      // 先关闭图层样式编辑框，防止报错
      this.$bus.$emit("mapEdit",{type:'off'});      
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

      // vuex更新参数状态
      this.UPDATEPARM({parm:'layers',value:this.layers});
      this.UPDATEPARM({parm:'sources',value:this.sources});
      this.UPDATEPARM({parm:'layersName',value:this.layersName});
      this.UPDATEPARM({parm:'originStyle',value:this.originStyle});
      this.UPDATEPARM({parm:'layersNameObject',value:this.layersNameObject});
      this.UPDATEPARM({parm:'sourceNameObject',value:this.sourceNameObject});      
    },



    // #对map组件方法的封装
    handleLayoutChange(layerName, key, value){
      const data = {
        type:'setLayout',
        layerName:layerName, 
        key:key, 
        value:value
      }
      this.$bus.$emit("map",data);
    },
    handlePaintChange(layerName, key, value){
      const data = {
        type:'setPaint',
        layerName:layerName, 
        key:key, 
        value:value
      }
      this.$bus.$emit("map",data);
    }, 
    handleRemoveSource(sourceName) {
      const data = {
        type:'removeSource',
        id:sourceName
      }
      this.$bus.$emit("map",data);
    },
    handleRemoveLayer(layerName) {
      const data = {
        type:'removeLayer',
        id:layerName
      }
      this.$bus.$emit("map",data);      
    },     
    // ##将地图定位到对应范围位置
    handleLayerClick(row) {
      const data = {
        type: 'mapFit',
        row: row,        // 点击的图层layer信息
      };
      this.$bus.$emit("map",data);
    },
    
    // #对地图样式编辑框组件的封装
    handleLayerEdit(index,layerData) {
      let index=this.getLayerIndexFromTree(layerData["id"])
      console.log("nowlayer",layerData,index)
      // 预先更新vuex参数给函数调用
      // this.UPDATEPARM({parm:'nowLayerIndex',value:index});
      const data = {
        type:'open',
        layer:layerData,
        index:index
      }
      this.$bus.$emit("mapEdit",data);
    }, 

    // 对样式模板组件的封装
    openTemplateEdit(index, row){
      // 预先更新vuex参数给函数调用
      this.UPDATEPARM({parm:'nowLayerIndex',value:index});
      const data = {
        type:'open',
        layer:row,
      }
      this.$bus.$emit("styleTemp",data);
    },

    handleDragStart(node) {
      console.log('drag start', node);
    },
    handleDragEnter(draggingNode, dropNode) {
      console.log('tree drag enter: ', dropNode.label);
    },
    handleDragLeave(draggingNode, dropNode) {
      console.log('tree drag leave: ', dropNode.label);
    },
    handleDragOver(draggingNode, dropNode) {
      console.log('tree drag over: ', dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType);
      console.log('data', this.data);
    },
    handleDrop(draggingNode, dropNode, dropType) {
      console.log('tree drop: ', dropNode.label, dropType);
    },
    allowDrop(draggingNode, dropNode, type) {
      console.log(draggingNode, dropNode, type)
      return !(dropNode.data.nodeType == "layer" && type == "inner");

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

    addGroup(){
      let groupNode={}
      groupNode["id"]=nanoid()
      groupNode["showName"]="组"
      groupNode["nodeType"]="group"
      groupNode["children"]=[]
      this.layersTree.unshift(groupNode)
      this.UPDATEPARM({parm:'layersTree',value:this.layersTree});
      console.log("layersTree",this.layersTree)
    },

    getLayerIndexFromTree(layerId){
      for (let i = 0,len=this.layers.length; i < len ; i++) {
        if(this.layers[i]["id"]==layerId){
          return i
        }
      }
    }
  }    
}
</script>

<style scoped>
/deep/ .el-tree-node__content {
  height: 40px;
}
</style>