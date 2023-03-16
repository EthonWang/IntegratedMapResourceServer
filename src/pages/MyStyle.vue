<template>
  <div class="myResourcePage">
    <el-menu
      :default-active="activeIndex"
      @select="handleMenuSelect"
      class="resourceMenu"
    >
      <el-menu-item index="1">
        <i class="fa fa-italic iconStyle"></i>
        <span slot="title">字体库</span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="fa fa-photo iconStyle"></i>
          <span>图标库</span>
        </template>
        <el-menu-item index="2-1">
          <i class="el-icon-magic-stick"></i>
          <span slot="title">精灵图</span>
        </el-menu-item>
        <el-menu-item index="2-2">
          <i class="el-icon-coordinate"></i>
          <span slot="title">自定义图标</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>图层样式库</span>
        </template>
        <el-menu-item index="3-1">
          <i class="fa fa-circle iconStyle"></i>
          <span slot="title">点样式</span>
        </el-menu-item>
        <el-menu-item index="3-2">
          <i class="fa fa-window-minimize iconStyle"></i>
          <span slot="title">线样式</span>
        </el-menu-item>
        <el-menu-item index="3-3">
          <i class="fa fa-square iconStyle"></i>
          <span slot="title">面样式</span>
        </el-menu-item>
        <el-menu-item index="3-4">
          <i class="fa fa-cube iconStyle"></i>
          <span slot="title">三维面样式</span>
        </el-menu-item>
        <el-menu-item index="3-5">
          <i class="fa fa-font iconStyle"></i>
          <span slot="title">注记样式</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="4">
        <i class="el-icon-s-home"></i>
        <span slot="title">OSM样式库</span>
      </el-menu-item>
    </el-menu>
    <!--  字体文件  -->
    <el-card v-if="activeIndex == '1'" class="main-content" shadow="never">
      <div slot="header">
        <h3>字体管理</h3>
      </div>
      <div class="page-part">
        <!-- <div class="leftUpload">
          <el-divider content-position="center">字体文件上传</el-divider>
          <el-upload
            ref="fontUpload"
            name="fontZip"
            drag
            :action="fontUploadUrl"
            :on-success="handleFileUpSuccess"
            accept=".zip"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              <el-row type="flex">
                <h3 style="display: inline-block; flex: 1">要求:</h3>
                <h3 style="display: inline-block; flex: 8">
                  上传font文件(文件结构参考示例,选中字体文件夹(一个或多个)压缩为zip)
                  <br />!!!不要嵌套文件夹!!!
                </h3>
              </el-row>
            </div>
          </el-upload>
        </div>
        <el-divider class="deviderHeight" direction="vertical"></el-divider> -->
        <div class="rightContent">
          <el-divider content-position="center">字体样式展示</el-divider>
          <el-table
            :data="fontTableData"
            border
            stripe
            :row-style="{ height: '10px', padding: '0' }"
            style="width: 100%"
            height="calc(100vh - 300px)"
          >
            <el-table-column label="字体名称">
              <template slot-scope="scope">
                <span>{{ scope.row }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="中文样式">
              <template slot-scope="scope">
                <span
                  :style="{
                    'font-family': scope.row,
                  }"
                >
                  {{ fontTempList[scope.$index]["cn"] }}</span
                >
              </template>
            </el-table-column> -->
            <el-table-column label="英文样式">
              <template slot-scope="scope">
                <span
                  :style="{
                    'font-family': scope.row,
                  }"
                >
                  {{ fontTempList[scope.$index]["en"] }}</span
                >
              </template>
            </el-table-column>
            <el-table-column label="数字样式">
              <template slot-scope="scope">
                <span
                  :style="{
                    'font-family': scope.row,
                  }"
                >
                  {{ fontTempList[scope.$index]["num"] }}</span
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120">
              <template slot-scope="scope">
                <el-row type="flex" justify="start">
                  <el-col :span="15">
                    <el-input
                      v-model="contentList[scope.$index]"
                      @change="fontItemChange($event, scope.$index)"
                      placeholder="输入内容查看效果"
                    >
                      <template slot="prepend"> 英文 </template>
                    </el-input>
                  </el-col>
                </el-row>

                <!-- <el-button
                  slot="reference"
                  size="mini"
                  @click="fontItemDelete(scope.row)"
                  type="danger"
                  style="margin-left: 5px"
                  >删除
                </el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <!-- 精灵图管理 -->
    <el-card v-if="activeIndex == '2-1'" class="main-content" shadow="never">
      <div slot="header">
        <h3>精灵图管理</h3>
      </div>
      <div class="page-part">
        <div class="leftUpload">
          <el-divider content-position="center">精灵图文件上传</el-divider>
          <el-upload
            ref="spriteUpload"
            name="spriteZip"
            drag
            :action="spriteUploadUrl"
            :on-success="handleFileUpSuccess"
            accept=".zip"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              <el-row type="flex">
                <h3 style="display: inline-block; flex: 1">要求:</h3>
                <h3 style="display: inline-block; flex: 8">
                  上传sprite文件
                  <br />精灵图命名为sprite.png <br />json文件命名为sprite.json
                  <br />png和json一起选中压缩为zip，zip名字即为sprite名字
                  <br />!!!不要嵌套文件夹!!!
                </h3>
              </el-row>
            </div>
          </el-upload>
        </div>
        <el-divider class="deviderHeight" direction="vertical"></el-divider>
        <div class="rightContent">
          <el-divider content-position="center">精灵图展示</el-divider>
          <el-row type="flex">
            <el-select
              v-model="spriteNameSelect"
              placeholder="请选择精灵图"
              @change="spriteChange"
            >
              <el-option
                v-for="item in spriteClassList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option> </el-select
            >&nbsp;
            <el-button type="danger" size="mini" @click="spriteDelete"
              >删除</el-button
            >
            <!-- <el-button v-if="!isSpriteEdit" type="primary" size="mini" @click="spriteDelete">编辑</el-button> -->
            <!-- <el-button v-if="isSpriteEdit"  type="primary" size="mini" @click="isSpriteEdit=false">返回</el-button> -->
          </el-row>
          <br />
          <el-card
            shadow="never"
            class="spriteContainer scrollBox"
            body-style="padding:0"
          >
            <div slot="header">{{ spriteNameSelect }}</div>
            <div class="sprite-box">
              <div
                v-for="(item, key, index) in spriteJsonSelect"
                :key="index"
                :title="key"
                @click="clickSprite(item, key, index)"
                class="spriteCard"
                body-style="padding:0"
                :style="{
                  padding: 0,
                  width: item.width + 30 + 'px',
                  height: item.height + 30 + 'px',
                  cursor: 'pointer',
                }"
              >
                <!-- <el-checkbox 
                  v-if="isSpriteEdit" class="spriteCheck" 
                  v-model="deleteSelect[index]"
                  @change="spriteCheckChange($event,key)">
                </el-checkbox> -->
                <div
                  :style="{
                    'background-image': `url(${spritePngSelect})`,
                    width: item.width + 'px',
                    height: item.height + 'px',
                    'background-position':
                      '-' + item.x + 'px -' + item.y + 'px',
                  }"
                ></div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </el-card>
    <!-- 自定义图标 -->
    <el-card v-if="activeIndex == '2-2'" class="main-content" shadow="never">
      <div slot="header">
        <h3>图标管理</h3>
      </div>
      <div class="page-part">
        <div class="leftUpload">
          <el-divider content-position="center">图标文件上传</el-divider>
          <el-upload
            ref="symbolUpload"
            name="symbolFile"
            drag
            :action="symbolUploadUrl"
            :on-success="handleFileUpSuccess"
            accept=".svg,.png"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              <el-row type="flex">
                <h3 style="display: inline-block; flex: 1">要求:</h3>
                <h3 style="display: inline-block; flex: 8">
                  图标img上传，png或者svg
                  <br />
                </h3>
              </el-row>
            </div>
          </el-upload>
          <el-divider content-position="center">图标展示</el-divider>
          <el-empty
            v-if="!showSymbol"
            description="选取单项展示信息"
          ></el-empty>
          <div v-if="showSymbol">
            <el-card
              class="symbolShowBox"
              body-style="padding:0"
              shadow="never"
            >
              <el-image
                v-if="isSymbolList"
                fit="fill"
                style="width: 200px; height: 200px; margin: 80px 80px"
                :src="reqUrl + '/symbol/getSymbolById/' + symbolSelect['id']"
              >
              </el-image>
              <el-form
                v-if="!isSymbolList"
                label-position="right"
                label-width="100px"
                :model="symbolSelect"
                style="margin-top: 20px"
              >
                <el-form-item label="名称:">
                  <span>{{ symbolSelect.originName }}</span>
                </el-form-item>
                <el-form-item label="上传时间:">
                  <span>{{ symbolSelect.createTime }}</span>
                </el-form-item>
              </el-form>
            </el-card>
          </div>
        </div>
        <el-divider class="deviderHeight" direction="vertical"></el-divider>
        <div class="rightContent">
          <el-divider content-position="center">图标信息</el-divider>
          <el-card
            shadow="never"
            class="symbolContainer"
            :body-style="{
              padding: 0,
              'background-color': isSymbolList ? '' : 'aliceblue',
              height: 'calc(' + 100 + '% - ' + 77 + 'px)',
            }"
          >
            <!-- 标题 -->
            <template slot="header">
              <div class="search-box-data">
                <el-button
                  type="success"
                  icon="el-icon-search"
                  @click="getSymbolList()"
                  >搜索</el-button
                >
                &nbsp;&nbsp;
                <el-input
                  placeholder="请输入搜索内容"
                  prefix-icon="el-icon-search"
                  v-model="symbolSearchText"
                  @keyup.enter.native="getSymbolList()"
                >
                </el-input>
                &nbsp;&nbsp;
                <i
                  v-if="isSymbolList"
                  class="fa fa-list iconBtn"
                  title="切换至图片"
                  style="font-size: 35px"
                  @click="isSymbolList = false"
                ></i>
                <i
                  v-if="!isSymbolList"
                  class="el-icon-menu iconBtn"
                  title="切换至列表"
                  style="font-size: 35px"
                  @click="isSymbolList = true"
                ></i>
              </div>
              <div v-if="!isSymbolList" class="btnBoxType">
                <el-button
                  v-if="!isSymbolEdit"
                  type="primary"
                  size="middle"
                  plain
                  circle
                  icon="el-icon-edit"
                  @click="isSymbolEdit = true"
                >
                </el-button>
                <el-button
                  v-if="isSymbolEdit"
                  type="danger"
                  size="middle"
                  @click="symbolDeletePatch"
                  >删除</el-button
                >
                <el-button
                  v-if="isSymbolEdit"
                  type="primary"
                  size="middle"
                  @click="symbolDelCancle"
                  >返回</el-button
                >
              </div>
            </template>
            <!-- 图片展示 -->
            <div v-if="!isSymbolList" class="symbol-box">
              <div
                v-for="(item, index) in symbolTableData"
                :key="index"
                :title="item.originName"
                class="symbolItemCard"
                @click="clickSymbolImg(item, index)"
                :style="{
                  border:
                    index == symbolSelectIndex
                      ? 'solid ' + 1 + 'px ' + '#909399'
                      : 'solid ' + 1 + 'px ' + '#f0f8ff',
                }"
              >
                <el-checkbox
                  v-if="isSymbolEdit"
                  class="spriteCheck"
                  v-model="symbolDelSelect[index]"
                  @change="symbolCheckChange($event, item)"
                >
                </el-checkbox>
                <el-image
                  style="width: 100px; height: 100px; padding: 25px"
                  :src="reqUrl + '/symbol/getSymbolById/' + item['id']"
                  fit="fit"
                ></el-image>
              </div>
            </div>
            <!-- 列表展示 -->
            <div v-if="isSymbolList" class="symbolListBox">
              <el-table
                :data="symbolTableData"
                stripe
                row-key="id"
                :max-height="symbolTableHeight"
                highlight-current-row
                style="width: 100%"
              >
                <el-table-column
                  prop="originName"
                  label="名称"
                  min-width="100"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  label="上传时间"
                  show-overflow-tooltip
                  min-width="100"
                ></el-table-column>
                <el-table-column
                  label="操作"
                  show-overflow-tooltip
                  min-width="100"
                >
                  <template slot-scope="scope">
                    <el-button size="mini" @click="symbolPreview(scope.row)"
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
          </el-card>
        </div>
      </div>
    </el-card>
    <!-- 样式库 -->
    <el-card
      v-if="activeIndex.indexOf('3-') > -1"
      class="main-content"
      shadow="never"
    >
      <div slot="header">
        <h3>样式库管理</h3>
      </div>
      <div class="page-part">
        <div class="leftUpload">
          <el-divider content-position="center">样式库信息</el-divider>
          <el-empty
            v-if="!styleItemShow"
            description="选取样式，展示配图信息"
          ></el-empty>
          <el-card v-if="styleItemShow" shadow="never" class="styleShowBox">
            <div slot="header">{{ styleSelect.description }}</div>
            <div
              v-for="(item, key) in styleSelect.paint"
              :key="key"
              :title="key"
            >
              <el-row style="height: 40px; font-size: 15px">
                <el-col :span="12">{{ attrTranslate[key] + "：" }}</el-col>
                <el-col :span="12">{{ item }}</el-col>
              </el-row>
            </div>
            <div
              v-for="(item, key, index) in styleSelect.layout"
              :key="index"
              :title="key"
            >
              <el-row style="height: 40px; font-size: 15px">
                <el-col :span="12">{{ attrTranslate[key] + "：" }}</el-col>
                <el-col :span="12">{{ item }}</el-col>
              </el-row>
            </div>
          </el-card>
        </div>
        <el-divider class="deviderHeight" direction="vertical"></el-divider>
        <div class="rightContent">
          <el-card shadow="never" id="styleContainer">
            <div slot="header">
              <h3>{{ typeTranslate[styleTypeSelect] + "样式" }}</h3>
            </div>
            <el-row type="flex" justify="start" style="flex-wrap: wrap">
              <div
                v-for="(item, index) in typeStyleBases[styleTypeSelect]"
                :key="index"
                style="height: 240px; width: 300px"
                class="templateCard"
                @click="showItemInfo(item)"
              >
                <i
                  class="el-icon-remove-outline tempDeleBtn"
                  @click="tempCardDelete(item.id)"
                ></i>
                <el-image
                  :style="{
                    width: 300 + 'px',
                    height: 200 + 'px',
                  }"
                  style="width: 100%; border-radius: 5% 5% 0 0"
                  :src="
                    item.styleImgUrl.ImgUrl
                      ? item.styleImgUrl.ImgUrl
                      : imgDefault
                  "
                  fit="fill"
                ></el-image>
                <el-row
                  type="flex"
                  align="middle"
                  justify="center"
                  class="tempCardName"
                  style="height: 40px; background-color: white; font-size: 20px"
                >
                  <span>{{ item.description }}</span>
                </el-row>
              </div>
            </el-row>
          </el-card>
        </div>
      </div>
    </el-card>
    <!-- mbTiles样式库 -->
    <el-card v-if="activeIndex == '4'" class="main-content" shadow="never">
      <div slot="header">
        <h3>mbTiles样式库管理</h3>
      </div>
      <div class="page-part">
        <div class="leftUpload">
          <el-divider content-position="center">mbTiles源信息</el-divider>
          <el-row type="flex" justify="space-around">
            <el-select
              v-model="mbTileSelectId"
              placeholder=""
              @change="getStyleListById($event)"
            >
              <el-option
                v-for="item in mbSourceList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <el-button
              type="success"
              circle
              size="middle"
              class="el-icon-plus"
              title="添加样式数据"
              @click="openMbStyleEdit"
            >
            </el-button>
          </el-row>
          <el-dialog
            title="mbTile地图样式信息添加"
            :visible.sync="mbStyleEditShow"
            width="30%"
            :modal="false"
            center
          >
            <el-form
              ref="mbStyleEdit"
              label-position="left"
              label-width="100px"
              :model="mbStyleAddInfo"
              id="myForm"
              enctype="multipart/form-data"
              name="fileinfo"
              action=""
              target="uploadFrame"
            >
              <el-form-item
                label="文件:"
                :rules="{
                  required: true,
                  message: '请选择文件',
                  trigger: 'blur',
                }"
              >
                <input type="file" ref="mbStyleFile" />
              </el-form-item>
            </el-form>
            <iframe
              id="uploadFrame"
              name="uploadFrame"
              style="display: none"
            ></iframe>
            <span slot="footer" class="dialog-footer">
              <el-button @click="mbStyleEditShow = false">取 消</el-button>
              <el-button type="primary" @click="addMbStyleData()"
                >确 定</el-button
              >
            </span>
          </el-dialog>
          <el-dialog
            title="OSM地图样式信息添加"
            :visible.sync="osmStyleEditShow"
            width="30%"
            :modal="false"
            center
          >
            <el-form
              ref="osmStyleEdit"
              label-position="left"
              label-width="100px"
              :model="osmStyleAddInfo"
              id="myForm"
              enctype="multipart/form-data"
              name="fileinfo"
              action=""
              target="uploadFrame"
            >
              <el-form-item
                label="样式文件:"
                :rules="{
                  required: true,
                  message: '请选择文件',
                  trigger: 'blur',
                }"
              >
                <input type="file" ref="osmStyleFile" />
              </el-form-item>
              <el-form-item
                label="样式封面:"
                :rules="{
                  required: true,
                  message: '请选择文件',
                  trigger: 'blur',
                }"
              >
                <input type="file" ref="osmImgFile" />
              </el-form-item>
            </el-form>
            <iframe
              id="uploadFrame"
              name="uploadFrame"
              style="display: none"
            ></iframe>
            <span slot="footer" class="dialog-footer">
              <el-button @click="osmStyleEditShow = false">取 消</el-button>
              <el-button type="primary" @click="addOSMStyleData()"
                >确 定</el-button
              >
            </span>
          </el-dialog>
        </div>
        <el-divider class="deviderHeight" direction="vertical"></el-divider>
        <div class="rightContent">
          <el-card shadow="never" id="styleContainer">
            <div slot="header">
              <h3>OSM 样式</h3>
            </div>
            <el-row type="flex" justify="start" style="flex-wrap: wrap">
              <div
                v-for="(item, index) in mbTielsStyleList"
                :key="index"
                style="height: 240px; width: 300px"
                class="templateCard"
              >
                <i
                  class="el-icon-remove-outline tempDeleBtn"
                  @click="styleDelete(item.id)"
                ></i>
                <el-image
                  style="width: 300px;height: 200px; border-radius: 5% 5% 0 0"
                  :src="
                    reqUrl + item.imgWebPath
                      ? reqUrl + item.imgWebPath
                      : imgDefault
                  "
                  fit="fill"
                ></el-image>
                <el-row
                  type="flex"
                  align="middle"
                  justify="center"
                  class="tempCardName"
                  style="height: 40px; background-color: white; font-size: 20px"
                >
                  <span>{{ item.name }}</span>
                </el-row>
              </div>
            </el-row>
          </el-card>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import requestApi from "../api/requestApi";
import fileApi from "../api/fileApi";
import "../assets/font/font.css";
import layerStyleProperties from "../assets/js/layerStyleProperties";

export default {
  name: "MyStyle",
  data() {
    return {
      // 目录条
      activeIndex: "1",

      //字体库
      fontTableData: [],
      fontTempalate: { cn: "道路", en: "abcdefg ABCDEFG", num: "0123456789" },
      fontTempList: [], //整体的例子样式列表内容
      contentList: [], //用于用户查看样式的内容

      // 图标库
      // 精灵图
      symbolUploadUrl: this.reqUrl + "/symbol/uploadSymbol",
      spriteUploadUrl: this.reqUrl + "/uploadSpriteZip",
      fontUploadUrl: this.reqUrl + "/uploadFontZip",
      spriteClassList: [],
      spriteItemList: [],
      spriteNameSelect: "",
      spriteJsonSelect: {},
      spritePngSelect: "",
      //   // 单个精灵图勾选框，暂不用
      // isSpriteEdit: false,
      // deleteSelect: [],     //用于展示精灵图checkbox的选择情况
      // spriteDelteList: [],  //要删除的精灵图name列表
      // 自定义图标
      symbolTableData: [],
      symbolCurrentPage: 1, //请求信息
      symbolPageSize: 10,
      symbolSearchText: "",
      symbolSearchType: "createTime",
      symbolTotalDataCount: 0,
      isSymbolEdit: false,
      isSymbolList: true,
      showSymbol: false, //小框信息展示
      symbolSelect: {},
      symbolSelectIndex: 0,
      symbolTableHeight: `${document.documentElement.clientHeight}` - 350, //监测屏幕高度，解决table的max-height使用不了问题，可以再加watch监测,
      symbolDelSelect: [], //用于展示图标checkbox的选择情况
      symbolDelteList: [], //要删除的图标name列表

      // 样式库
      styleTypeSelect: "circle",
      typeStyleBases: {
        circle: [],
        line: [],
        fill: [],
        "fill-extrusion": [],
        symbol: [],
      },
      typeTranslate: {
        circle: "点",
        line: "线",
        fill: "面",
        "fill-extrusion": "三维填充",
        symbol: "图标",
      },
      styleContainerWidth: 0, //等挂载完，从mounted中获取元素宽度
      attrTranslate: layerStyleProperties["tabName"], //图层属性中英文转换
      styleSelect: {},
      styleItemShow: false,
      imgDefault: require("../assets/imgs/map-icon.png"),

      // 默认样式库
      mbSourceList: [], //分为mbtiles和非mbTiles类
      mbTileSelectId: "",
      mbTilesJsonSelect: {}, //选中的数据源信息
      mbTielsStyleList: [], //所选的mbTiles绑定的样式信息
      mbStyleAddInfo: { mapStyleFile: null, mbtilesId: "" },
      osmStyleAddInfo: { mapStyleFile: null, mapStyleImg: null },
      mbStyleEditShow: false,
      osmStyleEditShow: false,
    };
  },
  // computed:{
  //   spriteJsonSelect:function(){
  //     if(this.spriteNameSelect != ''){
  //       const url = this.reqUrl + "/store/sprites/"+this.spriteNameSelect+"/"+"sprite.json";
  //       return fetch(url).then(res=>{
  //         return res.json();
  //       })
  //     }else{
  //       return {};
  //     }
  //   },
  //   spritePngSelect:function(){
  //     if(this.spriteNameSelect != ''){
  //       return this.reqUrl + "/store/sprites/"+this.spriteNameSelect+"/"+"sprite.png";
  //     }else{
  //       return '';
  //     }
  //   }
  // },
  mounted() {
    document.title = "资源服务";

    // this.styleContainerWidth = `${document.getElementById('styleContainer').offsetWidth}`;  //监测样式容器宽度

    this.getFontList();

    //窗口适应问题
    const that = this;
    window.onresize = function listen() {
      that.symbolTableHeight = `${document.documentElement.clientHeight}` - 350;
      // that.styleContainerWidth = `${document.getElementById('styleContainer').offsetWidth}`;
    };
  },
  methods: {
    // 切换导航条
    handleMenuSelect(key) {
      console.log("key", key);
      this.activeIndex = key;
      switch (key) {
        case "1":
          this.getFontList();
          break;
        case "2-1":
          requestApi
            .getSpriteList()
            .then((res) => {
              console.log(res);
              this.spriteClassList = res.data.data;
              this.spriteNameSelect = this.spriteClassList[0];
              this.spriteChange();
            })
            .catch((err) => {
              console.log(err);
            });

          break;
        case "2-2":
          this.getSymbolList();
          break;
        case "3-1":
          this.commonInfoInit();
          this.styleTypeSelect = "circle";
          this.getTypeStyleList("circle");
          break;
        case "3-2":
          this.commonInfoInit();
          this.styleTypeSelect = "line";
          this.getTypeStyleList("line");
          break;
        case "3-3":
          this.commonInfoInit();
          this.styleTypeSelect = "fill";
          this.getTypeStyleList("fill");
          break;
        case "3-4":
          this.commonInfoInit();
          this.styleTypeSelect = "fill-extrusion";
          this.getTypeStyleList("fill-extrusion");
          break;
        case "3-5":
          this.commonInfoInit();
          this.styleTypeSelect = "symbol";
          this.getTypeStyleList("symbol");
          break;
        case "4":
          this.getMbtilesInfo();
          break;
        default:
          this.styleTypeSelect = "fill";
          this.getTypeStyleList("fill");
          break;
      }
    },

    // 字体
    getFontList() {
      let data = null;
      requestApi
        .getFontList()
        .then((res) => {
          data = res.data.data;
        })
        .then(() => {
          // 初始化各个字体样式展示的内容
          this.fontTempList = [];
          this.contentList = [];
          data.forEach(() => {
            const temp = JSON.parse(JSON.stringify(this.fontTempalate));
            this.fontTempList.push(temp);
            this.contentList.push("");
          });
          this.fontTableData = data; //等数据处理完再对视图数据进行赋值，防止页面部分数据没显示
        });
    },
    fontItemDelete(fontName) {
      this.$confirm("此操作将删除字体" + fontName, "是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          requestApi
            .deleteFont(fontName)
            .then((res) => {
              if (res.data.code != 0) {
                this.$message.info("字体删除失败！");
              } else {
                this.$message.success("删除字体:" + fontName);
                this.getFontList();
              }
            })
            .catch(() => {
              this.$message.success("删除字体:" + fontName);
            });
        })
        .catch(() => {
          this.$message.info("取消字体删除！");
        });
    },
    fontItemChange(val, index) {
      this.fontTempList[index]["en"] = val;
    },

    // 图标库
    // 精灵图
    handleFileUpSuccess(res) {
      console.log(res);
      let menuNameShow = "";
      switch (this.activeIndex) {
        case "1":
          menuNameShow = "字体文件";
          this.getSpriteList();
          break;
        case "2-1":
          menuNameShow = "精灵图";
          this.getSpriteList();
          break;
        case "2-2":
          menuNameShow = "图标文件";
          this.getSymbolList();

          break;
        case "3-1":
          break;
      }
      if (res.code != 0) {
        this.$message.error(menuNameShow + "上传成功但导入数据库失败！");
      } else {
        this.$message.success(menuNameShow + "成功上传");
      }
    },
    getSpriteList() {
      requestApi
        .getSpriteList()
        .then((res) => {
          console.log(res);
          this.spriteClassList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // getSpriteItem() {
    //   requestApi
    //     .getSpriteList()
    //     .then((res) => {
    //       console.log(res);
    //       this.spriteItemList = res.data.data;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
    readSpriteByJson() {
      fetch("/sprite.json")
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          this.spriteJson = json;
          console.log("精灵图json", this.spriteJson);
        });
    },
    clickSprite(item, key, index) {
      console.log("当前点击的精灵图信息", item, key, index);
    },
    spriteDelete() {
      this.$confirm(
        "此操作将删除精灵图" + this.spriteNameSelect,
        "是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          requestApi
            .deleteSpriteItem(this.spriteNameSelect)
            .then((res) => {
              if (res.data.code != 0) {
                this.$message.info("精灵图删除失败！");
              } else {
                this.$message.success("删除精灵图:" + this.spriteNameSelect);
                this.getSpriteList();
              }
            })
            .catch(() => {
              this.$message.success("删除精灵图:" + this.spriteNameSelect);
            });
        })
        .then(() => {
          // 更新显示信息
          this.spriteNameSelect = this.spriteItemList[0];
          this.spriteChange();
        })
        .catch(() => {
          this.$message.info("取消精灵图删除！");
        });
    },
    // 单个精灵图标的操作，暂不用
    // spriteCheckChange(val,key){
    //   if(val){
    //     this.spriteDelteList.push(key);
    //     console.log('列表',this.spriteDelteList);
    //   }else{
    //     const index = this.spriteDelteList.indexOf(key);
    //     this.spriteDelteList.splice(index,1);
    //     console.log('列表',this.spriteDelteList);
    //   }
    // },
    // 删除精灵图里的单个图标
    // sptiteDelete(){
    //   for(let name of this.spriteDelteList){
    //     console.log(name);
    //   }
    // }
    spriteChange() {
      if (this.spriteNameSelect != "") {
        const url =
          this.reqUrl +
          "/store/sprites/" +
          this.spriteNameSelect +
          "/" +
          "sprite.json";
        fetch(url)
          .then((res) => {
            return res.json();
          })
          .then((json) => {
            this.spriteJsonSelect = json;
            console.log("精灵图json", this.spriteJsonSelect);
          });
        this.spritePngSelect =
          this.reqUrl +
          "/store/sprites/" +
          this.spriteNameSelect +
          "/" +
          "sprite.png";
      }
    },

    // 自定义图标
    getSymbolList() {
      let data = {
        asc: false,
        page: this.symbolCurrentPage,
        pageSize: this.symbolPageSize,
        searchText: this.symbolSearchText,
        sortField: this.symbolSearchType,
      };
      requestApi.getSymbolList(data).then((res) => {
        console.log(res);
        this.symbolTableData = res.data.data.content;
        this.symbolTotalDataCount = res.data.data.totalElements;
      });
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
      this.$confirm("确认删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          requestApi
            .deleteSymbol(val)
            .then(() => {
              this.$message.success("删除成功!");
              this.getSymbolList();
              this.showSymbol = false;
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    symbolDelCancle() {
      this.symbolDelSelect = [];
      this.symbolDelteList = [];
      this.isSymbolEdit = false;
    },
    symbolDeletePatch() {
      this.$confirm("将删除所选图标, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const List = JSON.parse(JSON.parse(this.symbolDelteList));
          for (let item of List) {
            requestApi
              .deleteSymbol(item.id)
              .then(() => {
                this.$message.success("删除成功!");
              })
              .catch((error) => {
                console.log(error);
              });
          }
          this.getSymbolList();
          this.symbolDelSelect = [];
          this.symbolDelteList = [];
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    symbolPreview(row) {
      this.symbolSelect = row;
      this.showSymbol = true;
      console.log("id", this.symbolSelect.id);
    },
    clickSymbolImg(item, index) {
      this.symbolSelect = item;
      this.symbolSelectIndex = index;
      this.showSymbol = true;
      console.log("id", this.symbolSelect.id);
    },
    // 单个图标的操作
    symbolCheckChange(val, item) {
      if (val) {
        this.symbolDelteList.push(item);
        console.log("列表", this.symbolDelteList);
      } else {
        const index = this.symbolDelteList.indexOf(item);
        this.symbolDelteList.splice(index, 1);
        console.log("列表", this.symbolDelteList);
      }
    },

    // 样式库
    commonInfoInit() {
      this.styleSelect = {};
      this.styleItemShow = false;
    },
    getTypeStyleList(type) {
      requestApi
        .getTypeStyleList(type)
        .then((res) => {
          if (res.data.code == 0) {
            this.typeStyleBases[type] = res.data.data;
            console.log("typeStyleBases", this.typeStyleBases);
          } else {
            console.log(res.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showItemInfo(val) {
      this.styleSelect = val;
      this.styleItemShow = true;
      console.log(val);
    },
    tempCardDelete(id) {
      this.$confirm("确认删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          requestApi
            .deleteTypeStyle(id)
            .then((res) => {
              if (res.data.code == 0) {
                this.$message.success("删除成功！");
                this.getTypeStyleList(this.styleTypeSelect);
              } else {
                this.$message.info("删除数据源样式失败！");
              }
            })
            .catch(() => {
              this.$message.info("删除失败");
            });
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },

    // mbTiles样式信息
    // 获取mbtiles源信息
    getMbtilesInfo() {
      requestApi
        .getMbtilesList()
        .then((res) => {
          const mbOriginList = res.data.data;
          this.mbSourceList = mbOriginList.filter(
            (data) => !data.osmMbtilesBoolean
          ); //获取非mbTiles源数据列表
          this.mbSourceList.unshift({ id: "OSM", name: "OSM (OpenStreetMap)" }); //首位添加OSM数据
          this.mbTileSelectId = JSON.parse(
            JSON.stringify(this.mbSourceList[0].id)
          );
          this.getStyleListById(this.mbTileSelectId); //初始化第一个mbtile包含的样式数据
          console.log(this.mbSourceList);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    mbSelectChange(id) {
      let index = null;
      this.mbSourceList.forEach((item, i) => {
        if (item.id == id) {
          index = i;
          return null;
        }
      });
      this.mbTilesJsonSelect = this.mbSourceList[index];
      console.log("ceshi", this.mbTilesJsonSelect);
    },
    getStyleListById(id) {
      console.log(id);
      if (id == "OSM") {
        requestApi
          .getOsmStyleTemplateList()
          .then((res) => {
            this.mbTielsStyleList = res.data.data;
            console.log("osmStyleList", res);
          })
          .catch((error) => {
            console.log(error);
          });

        // if(res.data.data.length != 0){
        //   this.mbTileStyleList = res.data.data;
        //   console.log("mbTileStyleList", this.mbTileStyleList);
        //mbTileStyle先默认为第一个数据
        // this.mbTileStyleSelect = this.mbTileStyleList[0].id;
        // this.mbTileStyleJson = this.mbTileStyleList[0];
        // this.styleLayers = this.mbTileStyleJson.layers;
        // }
        // else{
        //   this.mbTileStyleList = [];
        // }
      } else {
        requestApi
          .getStyleListById(id)
          .then((res) => {
            if (res.data.data.length != 0) {
              this.mbTileStyleList = res.data.data;
              console.log("mbTileStyleList", this.mbTileStyleList);
              //mbTileStyle先默认为第一个数据
              // this.mbTileStyleSelect = this.mbTileStyleList[0].id;
              // this.mbTileStyleJson = this.mbTileStyleList[0];
              // this.styleLayers = this.mbTileStyleJson.layers;
            } else {
              this.mbTileStyleList = [];
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    openMbStyleEdit() {
      this.mbStyleAddInfo = { mapStyleFile: null, mbtilesId: "" };
      this.mbStyleAddInfo = { mapStyleFile: null, mbtilesId: "" };
      if (this.mbTileSelectId == "OSM") {
        this.osmStyleEditShow = true;
        this.$nextTick(() => {
          this.$refs.osmStyleEdit.resetFields();
        });
      } else {
        this.mbStyleEditShow = true;
        this.$nextTick(() => {
          this.$refs.mbStyleEdit.resetFields();
        });
      }
    },
    // 添加mbTiles样式信息
    addMbStyleData() {
      // 阻止发生默认行为
      let formData = new FormData();
      //input的type为file,输入的文件在files属性里
      let file = this.$refs.mbStyleFile.files[0];
      this.mbStyleAddInfo.mapStyleFile = file;
      formData.append("mapStyleFile", file);
      formData.append("mbtilesId", this.mbTileSelect.id);
      console.log("表单信息：", this.mbStyleAddInfo);
      this.mbStyleEditShow = false;
      this.onUpload(false, formData);
    },
    addOSMStyleData() {
      // 阻止发生默认行为
      let formData = new FormData();
      //input的type为file,输入的文件在files属性里
      let file1 = this.$refs.osmStyleFile.files[0];
      let file2 = this.$refs.osmImgFile.files[0];
      this.osmStyleAddInfo.mapStyleFile = file1;
      this.osmStyleAddInfo.mapStyleImg = file2;
      formData.append("mapStyleFile", file1);
      formData.append("mapStyleImg", file2);
      console.log("表单信息：", this.osmStyleAddInfo);
      this.osmStyleEditShow = false;
      this.onUpload(true, formData);
    },
    // 上传文件
    onUpload(status, formData) {
      if (status) {
        fileApi
          .osmStyleUpload(formData)
          .then((res) => {
            if (res.data.code == 0) {
              this.$message.success("OSM样式数据上传成功！");
              this.getStyleListById(this.mbTileSelectId);
            } else {
              this.$message.info("OSM样式数据上传失败！");
            }
          })
          .catch((e) => {
            this.$message.error(e.message);
          });
      } else {
        fileApi
          .mbStyleUpload(formData)
          .then(() => {
            this.$message.success("style数据上传成功！");
            this.getStyleListById(this.mbTileSelectId);
          })
          .catch((e) => {
            this.$message.error(e.message);
          });
      }
    },
    styleDelete(id) {
      if (this.mbTileSelectId == "OSM") {
        this.osmStyleDelete(id);
      } else {
        this.mbStyleDelete(id);
      }
    },
    mbStyleDelete(id) {
      this.$confirm("确认删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          requestApi
            .deleteStyleJson(id)
            .then((res) => {
              if (res.data.code == 0) {
                this.$message.success("删除数据源样式成功！");
                this.getStyleListById(this.mbTileSelectId);
              } else {
                this.$message.info("删除数据源样式失败！");
              }
            })
            .catch(() => {
              this.$message.info("删除失败");
            });
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    osmStyleDelete(id) {
      this.$confirm("确认删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          requestApi
            .deleteOsmStyleTemplate(id)
            .then((res) => {
              if (res.data.code == 0) {
                this.$message.success("删除OSM数据源样式成功！");
                this.getStyleListById(this.mbTileSelectId);
              } else {
                this.$message.info("删除OSM数据源样式失败！");
              }
            })
            .catch(() => {
              this.$message.info("删除失败");
            });
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
  },
};
</script>

<style scoped>
/* 整体容器 */
h3 {
  margin: 0;
}
.myResourcePage {
  width: 100%;
  height: calc(100vh - 75px);
  position: relative;
}
/* 内容框 */
.el-card__body {
  height: calc(100vh - 180px);
  padding-left: 30px;
  overflow-y: scroll;
}
/* 标题 */
.main-content /deep/ .el-card__header {
  background-color: #f3f6ff;
  font-weight: bold;
  padding-left: 30px;
}
/* .main-content .h3{
  margin: 0;
} */
/* 容器内部样式框 */
.leftUpload {
  width: 360px;
}
.page-part {
  display: flex;
}
.deviderHeight {
  height: inherit;
  min-width: 1px;
}
.rightContent {
  width: 100%;
  overflow: auto;
}
/* 左侧导航条样式 */
.resourceMenu {
  /* float: left; */
  box-sizing: border-box;
  width: 300px;
  height: calc(100vh - 75px);
  box-shadow: 8px 0 20px rgb(0 0 0 / 8%);
  z-index: 100;
}
/* 内容框 */
/* 内容框样式 */
.main-content {
  box-sizing: border-box;
  position: absolute;
  width: calc(100vw - 300px);
  height: calc(100vh - 75px);
  border-left: 0;
  left: 300px;
  top: 0;
}

/* 标题 */
.el-card__header {
  background-color: #f3f6ff;
  font-weight: bold;
  padding-left: 30px;
}
/* 精灵图 */
.spriteContainer {
  position: relative;
  width: calc(100% - 2px); /*有边框存在*/
  height: calc(100vh - 300px);
}
.scrollBox /deep/ .el-card__body {
  height: calc(100% - 50px);
  padding-left: 30px;
  background-color: aliceblue;
  overflow-y: scroll;
}
/* 精灵图外框 */
.sprite-box {
  /* position: absolute; */
  display: flex;
  align-items: top;
  flex-wrap: wrap;
  width: 100%;
}
/* 精灵图单元格 */
.spriteCard {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.spriteCard:hover {
  border-radius: 4px;
  background-color: #57575a;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3);
}
/* 勾选框 */
.spriteCheck {
  position: absolute;
  top: 3px;
  left: 4px;
}
/* 图标 */
/* 点击样式信息展示框 */
.symbolShowBox {
  width: 360px;
  height: 360px;
}
.symbol-box {
  display: flex;
  align-items: top;
  flex-wrap: wrap;
  width: 100%;
}
/* 图标显示框 */
.symbolContainer {
  position: relative;
  width: calc(100% - 2px); /*有边框存在*/
  height: calc(100vh - 250px);
}
.search-box-data {
  display: flex;
  /* justify-content: space-around; */
  align-items: center;
  width: 70%;
  margin: 0 auto;
}
.btnBoxType {
  position: absolute;
  top: 18px;
  float: left;
}
/* 小图标显示框 */
.symbolItemCard {
  position: relative;
  width: 150px;
  height: 150px;
  padding: 0;
  border: 1px solid #f0f8ff;
  cursor: pointer;
}
.symbolItemCard:hover {
  border-radius: 4px;
  background-color: #57575a;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3);
}
/* 列表显示框 */
.symbolListBox {
  height: calc(100vh - 350px);
}
/* 样式库 */
#styleContainer {
  position: relative;
  width: calc(100% - 2px); /*有边框存在*/
  height: calc(100vh - 180px);
}
#styleContainer /deep/ .el-card__body {
  box-sizing: border-box;
  width: 100%;
  height: calc(100vh - 233px);
  overflow-y: scroll;
  background-color: aliceblue;
}
/* 样式属性展示框 */
.styleShowBox {
  max-height: calc(100vh - 180px);
  overflow-y: scroll;
}
/* 模板单目显示框样式 */
.templateCard {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  box-sizing: border-box;
  justify-content: center;

  margin: 0 15px 15px 0;
  cursor: pointer;
  border: 1px solid #fafafa;
  border-radius: 5% 5% 0 0;
  background-color: white;
}
.templateCard:hover {
  box-shadow: 0 0 10px 1px rgba(0 0 0 / 20%);
}
/* 样式删除按钮 */
.tempDeleBtn {
  position: absolute;
  color: #dcdfe6;
  font-size: 20px;
  right: 10px;
  top: 210px;
  z-index: 1;
}
.tempDeleBtn:hover {
  color: red;
}
/* 模板名称样式 */
.tempCardName {
  padding: 0 25px;
  border-top: 1px solid #dcdfe6;
}
.tempCardName span {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
/* fa图标样式 */
.iconStyle {
    width: 20px;
    margin: 0 5px;
  }
</style>
