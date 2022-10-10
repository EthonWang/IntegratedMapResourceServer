<template>
  <div style="width: 330px; ">

    <div style="display: flex;justify-content: space-between">
      <el-switch
          :width="30"
          v-model="allLayerShow"
          @change="allLayerShowSwitchChange()"
      >

      </el-switch>

      <el-popconfirm
          title="确定删除全部图层吗？"
          @confirm="allLayerDelete()"
      >
        <el-button slot="reference" type="info" size="mini">一键删除
        </el-button
        >
      </el-popconfirm>

    </div>

    <el-tree
        :data="data"
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
        <div style="display: flex;    " >
          <el-switch
              :width="30"
              style=" margin-top: 5px;  margin-right: 5px;"
              v-model="show"
              @change="handleLayerShowSwitchChange()"
          >
          </el-switch>

          <h4>{{ node.label }}</h4>
        </div>

        <div v-if="data.nodeType=='layer'">

          <el-button
              size="mini"
              type="success"
              @click="handleLayerEdit(node,data)"
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
export default {
  name: "LayersTree",
  data() {
    return {
      data: [{
        id: 1,
        label: '一级 1',
        type: "circle",
        nodeType: "group",
        children: [{
          id: 4,
          label: '二级 1-1',
          type: "circle",
          nodeType: "layer",
        }]
      }, {
        id: 2,
        label: '一级 2',
        type: "circle",
        nodeType: "group",
        children: [{
          id: 5,
          label: '二级 2-1',
          type: "circle",
          nodeType: "layer",
        }, {
          id: 6,
          label: '二级 2-2',
          type: "circle",
          nodeType: "layer",
        }]
      }, {
        id: 3,
        label: '一级 3',
        type: "circle",
        nodeType: "group",
        children: [{
          id: 7,
          label: '二级 3-1',
          type: "circle",
          nodeType: "layer",
        }, {
          id: 8,
          label: '二级 3-2',
          type: "circle",
          nodeType: "layer",
        }]
      }],

      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };

  },
  methods: {
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
      return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
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

  }
}
</script>

<style scoped>
/deep/ .el-tree-node__content {
  height: 40px;
}


</style>