<template>
  <div style="width: 100% ">

    <div class="treeGroupBtns">
      <div>
        <el-button 
          style="margin-right:2px"
          type="text" 
          :icon="collapseIcon"
          @click="allGroupClose"
        ></el-button>
        <el-switch
            :width="30"
            v-model="allLayerShow"
            @change="allLayerShowSwitchChange(allLayerShow)"
        >
        </el-switch>
      </div>
      <div class="treeBtns">
        <!-- 图层搜索功能 -->
        <!-- <el-popover
          ref="searchPopover"
          placement="top-start"
          width="200"
          trigger="click">
          <el-input v-model="nameSearch" placeholder="请输入图层名"></el-input>
          <el-button type="primary" slot="reference">1</el-button>
        </el-popover> -->
        <el-button 
          class="treeBtn"
          type="text" plain
          icon="el-icon-files" 
          title="添加组"
          @click="addGroup">
        </el-button>
        <el-button 
          class="treeBtn"
          type="text" plain
          icon="el-icon-document-copy" 
          title="复制图层"
          @click="copyLayer">
        </el-button>
        <el-popconfirm
            title="确定删除全部图层吗？"
            @confirm="allLayerDelete()"
        >
          <el-button 
            slot="reference" 
            class="treeBtn"
            type="text" plain
            icon="el-icon-delete"
            size="mini"
            title="一键删除">
          </el-button>
        </el-popconfirm>
      </div>
    </div>

    <div @click.stop class="treeBox">
      <el-tree
          :key="treeKey"
          :data="layersTree"
          node-key="id"
          ref="tree"
          id="classTree"
          default-expand-all
          @node-drop="handleDrop"
          :highlight-current="true"
          :expand-on-click-node="false"
          draggable
          @node-click="handleNodeClick"
          :allow-drop="allowDrop">

        <div class="custom-tree-node" style="width: 100%; display: flex;justify-content: space-between;"
            slot-scope="{ node, data }">
          <!-- 图层的信息显示 -->
          <div style="display: flex;">
            <!-- 开关 -->
            <el-switch
                :width="30"
                style=" margin-top: 5px;  margin-right: 5px;"
                v-model="data.show"
                @click.stop.native="()=>{}"
                @change="showSwitchChange(data.show,data)"
            >
            </el-switch>
            <!-- 图标 -->
            <div class="nameLayer" type="flex" align-items="baseline">
              <i v-if="data.nodeType=='layer'" :class="layerIcon[data.type]" class="iconStyle"></i>
              <!-- 图层名 -->
              <div v-if="data.nodeType=='layer'">
                <h4
                    style="width: 130px;    text-overflow: ellipsis;    white-space: nowrap;    overflow: hidden;"
                    :title="data.showName"
                >
                  {{ data.showName }}
                </h4>
              </div>
              <!-- 组名 -->
              <div v-else class="projectTitle" v-show="data.id!=nowGroupId"  >
                <h4
                    :title="data.showName"
                    @click="nowGroupId = data.id">
                  {{ data.showName }}
                </h4>
                <i class="el-icon-edit" @click="nowGroupId = data.id"></i>
              </div>
            </div>
            <!-- 组名编辑 -->
            <div v-show="data.id==nowGroupId" class="projectTitle">
              <el-input
                  v-model="data.showName"
                  size="mini"
                  @change.stop.native="nowGroupId = -1;"
              ></el-input>
              <i class="el-icon-check" @click="nowGroupId = -1;"></i>
            </div>
          </div>
          <!-- 图层的按钮 -->
          <div 
            v-if="data.nodeType=='layer'"
            class="layerBtnGroup"
          >

            <el-button
                size="mini"
                type="success"
                @click.stop="handleLayerEdit(data)"
                icon="el-icon-edit"
                circle
                title="编辑图层"
                style="margin-left: 5px"
            >

            </el-button>

            <el-popconfirm
                title="确定删除该图层吗？"
                @confirm="deleteLayerFromTree(data,node)"
            >
              <el-button
                  slot="reference"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  circle @click.stop
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
                @click.stop="openTemplateEdit(data)"
                icon="el-icon-s-grid"
                circle
                :title="'应用' + data.type+ '样式'"
                style="margin-left: 5px"
            >
            </el-button>
          </div>
          <!-- 组的按钮 -->
          <div v-else>
            <el-popconfirm
                title="确定删除该组吗？"
                @confirm="deleteGroupFromTree(data,node)"
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
  </div>
</template>
<script>
// import requestApi from "../../api/requestApi";
import {mapActions, mapMutations, mapState} from 'vuex'
import {nanoid} from 'nanoid'
import requestApi from "../../api/requestApi";
import { nameIndex } from "@/serve/interpolation";

export default {
  name: "ProjLayersNew",
  props: [],
  data() {
    return {
      // 全局参数
      nameSearch: '',       // 图层搜索
      allGroupExpand: true,
      collapseIcon: 'el-icon-caret-bottom',
      allLayerShow: true,
      treeKey:0,    // 用于目录树组件强制渲染


      groupIds: [],
      nowGroupId:"",

      //图标图层样式
      layerIcon: {
        circle: "fa fa-circle",
        line: "fa fa-window-minimize",
        fill: "fa fa-square",
        symbol: "fa fa-font",
        "fill-extrusion": "fa fa-cube",
        heatmap: "fa fa-fire",
        raster: "fa fa-photo",
        hillshade: "	fa fa-area-chart",
      },
    }
  },
  computed: {
    ...mapState({}),
    // 切换到这种方式用于对computer进行set
    sourceNameObject:{
      get(){
        return this.$store.state.sourceNameObject;
      },
      set(val) {
        this.UPDATEPARM({ parm: "sourceNameObject", value: val })
      }      
    },
    layersNameObject:{
      get(){
        return this.$store.state.layersNameObject;
      },
      set(val) {
        this.UPDATEPARM({ parm: "layersNameObject", value: val })
      }      
    },
    layers:{
      get(){
        return this.$store.state.layers;
      },
      set(val) {
        this.UPDATEPARM({ parm: "layers", value: val })
      }      
    },
    sources:{
      get(){
        return this.$store.state.sources;
      },
      set(val) {
        this.UPDATEPARM({ parm: "sources", value: val })
      }      
    },
    originStyle:{
      get(){
        return this.$store.state.originStyle;
      },
      set(val) {
        this.UPDATEPARM({ parm: "originStyle", value: val })
      }      
    },    
    layersTree:{
      get(){
        return this.$store.state.layersTree;
      },
      set(val) {
        this.UPDATEPARM({ parm: "layersTree", value: val })
      }      
    },    
    nowLayerIndex:{
      get(){
        return this.$store.state.nowLayerIndex;
      },
      set(val) {
        this.UPDATEPARM({ parm: "nowLayerIndex", value: val })
      }      
    },    
    mapProjectInfo:{
      get(){
        return this.$store.state.mapProjectInfo;
      },
      set(val) {
        this.UPDATEPARM({ parm: "mapProjectInfo", value: val })
      }      
    },    
    tileJsonList:{
      get(){
        return this.$store.state.tileJsonList;
      },
      set(val) {
        this.UPDATEPARM({ parm: "tileJsonList", value: val })
      }      
    },    
  },
  watch:{
    layers:{
      deep:true,
      handler:function (layers){
        layers.forEach((layer)=>{
          const aimLayer = JSON.parse(JSON.stringify(layer));
          for (let i = 0; i < this.layersTree.length; i++) {
            let node=this.layersTree[i];
            if(node.nodeType=="group"){
              for (let k = 0; k < node.children.length; k++)
                if(node.children[k].id==aimLayer.id)
                  node.children[k]=aimLayer
            }
            else{
              if(node.id==aimLayer.id){
                this.layersTree[i]=aimLayer
              }
            }
          }
        })
        // 等计算完再进行数组件渲染
        this.$nextTick(()=>{
          this.treeKey += 1;
        }) 
        console.log("update tree")
      }
    },
    

    // layersTree:function (layersTree){
    //   // this.layersTree=layersTree
    //   this.layers=this.createLayersFromTree()
    //   this.UPDATEPARM({parm: 'layers', value: this.layers});
    //   console.log("update layer",layersTree,this.layers)
    // }

  },
  mounted() {
    // 等初始组件信息加载完
    this.$bus.$on("init", (data) => {
      switch (data.type) {
        case "all":
          this.infoInit();
          break;
        default:
          break;
      }
    })

    // 当地图组件添加图层时，更新图层树
    this.$bus.$on("map", (data) => {
      switch (data.type) {
        case 'addLayer1':           // data:{type:'',layer:{}}
          if(data.isReplace == undefined){
            if (data.drag == undefined)
              this.addLayerToTree(data.layer)
          }
          break;
        case 'addLayer2':           // data:{type:'',id:'',layer:{}}  添加在指定图层后
          if(data.isReplace == undefined){
            if (data.drag == undefined)
              this.addLayerToTree(data.layer)
          }
          break;
      }
    })
    
    this.$bus.$on("layerTree", (data) => {
      switch (data.type) {
        case 'highLight':              // data:{type:'',id:''}
          this.highLightNode(data.id);
          break;
        case 'groups':                  // data:{type:'',groups:{}}
          this.addGroups(data.groups)
      }   
    })
  },
  methods: {  
    // vuex
    ...mapActions({updateParm: 'update'}),        //将 `this.updateParm(data)` 映射为 `this.$store.dispatch('update',data)`
    ...mapMutations({UPDATEPARM: 'UPDATE'}),      //将 `this.UPDATEPARM(data)` 映射为 `this.$store.commit('UPDATE',data)`
    infoInit() {
      console.log('目录树组件更新');
      // // 由layers生成layersTree
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
      // }
    },

    addLayerToTree(layerData) {
      let groupId = '';      // 默认为'',除style外其余的
      if(layerData.metadata['mapbox:type'] == 'mbStyle'){
        groupId = layerData.metadata['mapbox:group'] || '1';   // 有组则赋组，没有则设为1
      }
      if(groupId.length > 1){           // 有分组信息，添加在改组最前
        let index = this.layersTree.findIndex(
          (currentValue)=>currentValue.nodeType == 'group'&&currentValue.id == groupId) 
        if(index !== -1){
          this.layersTree[index].children.unshift(layerData);
        }else{
          console.log('分组信息错误')
        }
      }
      else if(groupId.length == 1){     // 没有分组的图层，因为是按顺序添加，所以添加在第一个有图层的组之前
        let index = this.layersTree.findIndex(
          (currentValue)=>('children' in currentValue) && currentValue['children'].length !== 0)
          console.log('未分组图层',index);
        this.layersTree.splice(index,0,layerData) 
      }
      else{       // 除style外的其余添加方式
        let index = 0 ;
        if(layerData.type === 'background'){      // 背景图层添加在最后
          index = this.layersTree.length;
        }      
        this.layersTree.splice(index,0,layerData);
      }
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

    // #单图层操作
    // 单个图层开关
    handleLayerShowSwitchChange(val, row) {
      if (val) {
        this.handleLayoutChange(row.id, "visibility", "visible");
      } else {
        this.handleLayoutChange(row.id, "visibility", "none");
      }
      let index = this.getLayerIndex(row.id)
      this.layers[index]["show"] = val
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
    // 删除单图层
    handleLayerDelete(row) {
      console.log("ready delete layer:", row);
      let index = this.getLayerIndex(row["id"])
      // 先关闭图层样式编辑框，防止报错
      this.$bus.$emit("mapEdit", {type: 'off'});
      let layerKey = row.manageInfo.layerKey;
      let sourceKey = row.manageInfo.sourceKey      
      let layerid = row.id;
      let hasMbData = false;
      this.layers.splice(index, 1);
      this.originStyle.splice(index, 1);
      this.layersNameObject[layerKey] -= 1;
      this.handleRemoveLayer(layerid);
      // 验证是否还有mbtile数据
      this.layers.every(item=>{
        if(item.source === sourceKey){
          hasMbData = true;
          return false
        }
      })     
      //如果没有layer使用source，则删除source记录
      if (this.layersNameObject[layerKey] === 0&&!row.metadata['mapbox:type'].includes('mb')) {
        delete this.layersNameObject[layerKey];
        // 背景没有source
        if(row.metadata['mapbox:type'] != "background"){
          delete this.sources[sourceKey];
          // mbTile数据只有删除全部mbTile数据才删除
          this.handleRemoveSource(row.source);
          //只有multiPG删除source的tileJson
          if (row.metadata['mapbox:type'] == "multiPG") {          
            let sourceJsonId = JSON.parse(JSON.stringify(this.sourceNameObject[sourceKey]));
            //source没有再使用时,删除后台的tileJson
            // this.deleteTileJson(row.source);
            this.tileJsonList.push(sourceJsonId);
          }
          delete this.sourceNameObject[sourceKey];
        }
      }else if(row.metadata['mapbox:type'].includes('mb')){
        if(!hasMbData){
          delete this.sources[sourceKey];
          this.handleRemoveSource(row.source);
          delete this.sourceNameObject[sourceKey];
        }
      }
      console.log('删除:',this.layers,this.layersNameObject,this.sourceNameObject,this.tileJsonList)
    },

    deleteLayerFromTree(aimLayerData,node) {
      this.handleLayerDelete(aimLayerData)
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === aimLayerData.id);
      children.splice(index, 1);
    },

    deleteGroupFromTree(data,node) {
      const children = JSON.parse(JSON.stringify(data.children));
      for (let i = 0; i < children.length; i++) {
        this.handleLayerDelete(children[i])
      }
      const parent = node.parent;
      const childrenData = parent.data.children || parent.data;
      const index = childrenData.findIndex(d => d.id === data.id);
      childrenData.splice(index, 1);
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

    },
    // 一键删除
    allLayerDelete() {
      if(this.layers.length > 0){
        // 先关闭图层样式编辑框，防止报错
        this.$bus.$emit("mapEdit", {type: 'off'});
        let mbDataId = '';
        for (let i in this.layers) {
          let item = JSON.parse(JSON.stringify(this.layers[i]));
          let layerKey = item.manageInfo.layerKey;
          let sourceKey = item.manageInfo.sourceKey
          let layerid = item.id;
          this.handleRemoveLayer(layerid);
          this.layersNameObject[layerKey] -= 1;
          //如果没有layer使用source，则删除source，mbtile放到最后删
          if (this.layersNameObject[layerKey] === 0&&!item.metadata['mapbox:type'].includes('mb')) {
            // 背景没有source
            if(item.metadata['mapbox:type'] != "background"){
              this.handleRemoveSource(item.source);
              //只有multiPG删除source的tileJson
              if (item.metadata['mapbox:type'] == "multiPG") {
                let sourceJsonId = JSON.parse(JSON.stringify(this.sourceNameObject[sourceKey]));
                this.tileJsonList.push(sourceJsonId);
              }
            }
          }else if(item.metadata['mapbox:type'].includes('mb')){
            mbDataId = sourceKey;
          } 
        }
        // mbtile的公用一个source，最后统一删除
        this.handleRemoveSource(mbDataId);
        // 循环完再进行视图数据初始化,避免循环中渲染。
        this.layersNameObject = {};
        this.sourceNameObject = {};
        this.layers = [];
        this.sources = [];
        this.originStyle = [];
        this.layersTree = [];
        console.log('一键删除:',this.layers,'\n',this.layersTree,'\n',this.tileJsonList)
      }
    },
    allGroupClose(){
      for (let i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].expanded = !this.allGroupExpand;
      }    
      this.allGroupExpand = !this.allGroupExpand;
      this.collapseIcon = this.allGroupExpand ? 'el-icon-caret-bottom' :'el-icon-caret-right';
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
    handleAddLayer(nowLayerIndex,layer){
      if (nowLayerIndex == 0) {
        this.$bus.$emit("map", {
          type: 'addLayer1',
          drag: true,
          layer: layer
        });
      } else {
        this.$bus.$emit("map", {
          type: 'addLayer2',
          id: this.layers[nowLayerIndex - 1].id,
          drag: true,
          layer: layer
        });
      }
    },
    // ##将地图定位到对应范围位置
    handleNodeClick(data){
      if(data.nodeType == 'layer'){
        const value = {
          type: 'mapFit',
          row: data,        // 点击的图层layer信息
        };
        this.$bus.$emit("map", value);        
      }
      console.log(data);
    },    

    // #对地图样式编辑框组件的封装
    async handleLayerEdit(layerData) {
      let index = this.getLayerIndex(layerData["id"])
      console.log("nowlayer", layerData, this.layers[index])
      const data = {
        type: 'open',
        layer: layerData,
        index: index
      }
      await this.$bus.$emit('main',{type:'reload',name:'editor'});
      // 等editor组件加载完成
      setTimeout(() => {
        this.$bus.$emit("mapEdit", data);
        this.$bus.$emit("layerTree", { type: "highLight", id: layerData.id });
      }, 0); 
    },

    // 对样式模板组件的封装
    async openTemplateEdit(layerData) {
      let index = this.getLayerIndex(layerData["id"])
      console.log("nowlayer", layerData, index)      
      this.UPDATEPARM({parm: 'nowLayerIndex', value: index});
      const data = {
        type: 'open',
        layer: layerData,
        index: index
      }
      await this.$bus.$emit('main',{type:'reload',name:'style'});
      // 等editor组件加载完成
      setTimeout(() => {
        this.$bus.$emit("styleTemp", data);
        this.$bus.$emit("layerTree", { type: "highLight", id: layerData.id });
      }, 0);       
    },

    // #树组件事件
    highLightNode(id){
      // 先等tree组件刷新完  setTimeout作为微服务，打开编辑框为主进程      
      setTimeout(() => {
        this.$refs.tree.setCurrentKey(id);       
      }, 0);
      setTimeout(() => {
        let node = document.querySelector("#classTree .is-current");
        if(!node){
          console.log('目录树错误！');
        }
        else{
          node.scrollIntoView({ block: 'start' })        
        }
      }, 0);
    },
    // 添加style的模板
    addGroups(data){
      if(data !== {}){      // 
        let groupsInfo = JSON.parse(JSON.stringify(data));
        for(let item in groupsInfo){
          let index = this.layersTree.findIndex(
            (currentValue)=>currentValue.nodeType == 'group'&&currentValue.showName == groupsInfo[item].name)        
          if(index == -1){
            let node = {
              id:item,
              showName:groupsInfo[item].name,
              nodeType:'group',
              children:[],
              show:true
            }
            this.addGroup({node});
            console.log('添加组',groupsInfo[item].name);
          }
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

    handleDrop(draggingNode, dropNode, dropType) {
      console.log('tree drop: ', draggingNode, dropNode, dropType);
      if (draggingNode.data.nodeType == "layer") {
        this.handleLayerDrag(draggingNode)
      } else {
        this.handleGroupDrag(draggingNode)
      }
    },

    handleLayerDrag(draggingNode) {
      this.layers = this.createLayersFromTree()
      this.UPDATEPARM({parm: 'layers', value: this.layers});

      let nowLayerIndex = -1
      nowLayerIndex=this.getLayerIndex(draggingNode.data.id)
      console.log("draggingNode,index",draggingNode,nowLayerIndex)

      this.handleRemoveLayer(draggingNode.data.id)
      this.handleAddLayer(nowLayerIndex,draggingNode.data)
    },

    handleGroupDrag(draggingNode) {
      this.layers = this.createLayersFromTree()
      this.UPDATEPARM({parm: 'layers', value: this.layers});

      for (let i=0;i<draggingNode.data.children.length;i++) {
        let layer=draggingNode.data.children[i]
        this.handleRemoveLayer(layer.id)
        let nowLayerIndex = this.getLayerIndex(layer.id)
        this.handleAddLayer(nowLayerIndex,layer)
      }
    },


    addGroup({node=0}={}) {
      let groupNode = node || {};
      if(!node){    // 非style添加方式
        groupNode["id"] = nanoid()
        groupNode["showName"] = "组"
        groupNode["nodeType"] = "group"
        groupNode["children"] = []
        groupNode["show"] = true
      }
      this.layersTree.unshift(groupNode)
    },
    copyLayer(){
      // 复制目标图层信息，修改id和showName，layersNameObject添加图层
      let aimNode = JSON.parse(JSON.stringify(this.$refs.tree.getCurrentNode())) || {};
      if(aimNode != {} && aimNode.nodeType == 'layer'){
        let newNode = JSON.parse(JSON.stringify(aimNode));
        let name = newNode.id.slice(0,-6);
        newNode.id = name+'_'+nanoid(5);
        let result = JSON.parse(
          JSON.stringify(
            nameIndex(this.layers, newNode.manageInfo.layerKey, name, this.layersNameObject)
          )
        );
        this.layersNameObject = result.object;
        newNode.showName = result.show;
        // 将图层添加到目标图层前同时更新layerTree
        this.$refs.tree.insertBefore(newNode,aimNode);
        let index = this.getLayerIndex(aimNode.id);
        this.layers.splice(index,0,newNode);
        this.handleAddLayer(index,newNode);
        this.$refs.tree.setCurrentKey(aimNode.id);
      }
    },

    getLayerIndex(layerId) {
      for (let i = 0, len = this.layers.length; i < len; i++) {
        if (this.layers[i]["id"] == layerId)
          return i
      }
    },

    createLayersFromTree(){
      let newLayers=[]
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
      return newLayers
    }

  },
  beforeDestroy(){
    this.$bus.$off("init");
    this.$bus.$off("map");
    this.$bus.$off("layerTree");
  }  
}
</script>

<style scoped>
/* 图层树 */
.treeBox{
  position: relative;
  /* padding-right: 5px; */
  max-height: calc(100vh - 200px);
  overflow-y: scroll;
}
.treeBox::-webkit-scrollbar{
  /* width: 0; */
}
.custom-tree-node{
  padding-right: 5px;
}
/* 按钮组 */
.treeGroupBtns{
  box-sizing: border-box;
  width: 100%;  
  border-bottom: 1px #dcdfe6 solid;
  display: flex;
  justify-content: space-between;    
  align-items: center;
  padding: 0 5px 10px 5px;
}
/* 按钮组（右部） */
.treeBtns{
  max-width: calc(100% - 60px);
  /* min-width: 80px; */
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 5px;
  border-left: 1px #dcdfe6 solid;
}
/* 按钮组单个按钮（图标） */
.treeBtn{
  margin: 0;
  color: #617889;
  padding: 2px;
  font-size: 20px; 
}
.treeBtn:hover{
  color: #2e4e5d;
}
/* 图层的按钮组 */
.layerBtnGroup{
  position: absolute;     
  right: 5px;               
}
/* 图标和图层名 */
.nameLayer{
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
/* 图标样式 */
.nameLayer i{
  font-size: 15px;
  margin-right: 5px;
}
.nameLayer:hover{
  color: #75b9ff;
}



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