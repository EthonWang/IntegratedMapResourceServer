<template>
  <div class="myDataPage">
    <el-menu
      :default-active="activeIndex"
      @select="handleMenuSelect"
      class="dataMenu"
    >
      <el-menu-item index="1">
        <i class="el-icon-coin"></i>
        <span slot="title">默认PG数据源</span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-share"></i>
        <span slot="title">远程PG数据源</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-s-grid"></i>
        <span slot="title">瓦片数据源</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="fa fa-area-chart iconStyle"></i>
        <span slot="title">高程数据源</span>
      </el-menu-item>
      <el-menu-item index="5">
        <i class="fa fa-globe iconStyle"></i>
        <span slot="title">WMTS数据源</span>
      </el-menu-item>
      <el-menu-item index="6">
        <i class="fa fa-cubes iconStyle"></i>
        <span slot="title">TMS数据源</span>
      </el-menu-item>
    </el-menu>
    <!--    shp文件管理-->
    <el-card
      v-if="activeIndex == '1'"
      class="main-content"
      shadow="never"
    >
      <div slot="header">
        <h3>数据管理</h3>
      </div>
      <div class="page-part">
        <div class="leftUpload">
          <el-divider content-position="center">Shapefile文件上传</el-divider>
          <!--            单文件上传-->
          <!--            <el-upload-->
          <!--                name="file"-->
          <!--                drag-->
          <!--                :action="shpUploadUrl"-->
          <!--                :on-success="handleShpUpSuccess"-->
          <!--                accept=".zip"-->
          <!--            >-->
          <!--              <i class="el-icon-upload"></i>-->
          <!--              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
          <!--              <div class="el-upload__tip" slot="tip">tip: 将shp文件压缩(zip格式)后上传！zip名称与shp一致</div>-->
          <!--            </el-upload>-->
          <br />
          <!--            <el-button size="mini" @click="helloTest()">测试</el-button>-->
          <el-upload
            name="files"
            drag
            :action="multiShpUploadUrl"
            :on-success="handleMultiShpUpSuccess"
            accept=".zip"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              <h3>
                要求: 将一个或多个shp文件选中<strong>直接</strong>压缩(zip格式)
              </h3>
              <h3>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;!!!不要嵌套文件夹!!!
              </h3>
            </div>
          </el-upload>
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
            <el-button
              type="success"
              icon="el-icon-search"
              @click="getShpDataList()"
              >搜索</el-button
            >
          </div>
          <el-table
            :data="shpTableData"
            stripe
            row-key="id"
            style="width: 100%"
            max-height="500"
          >
            <el-table-column
              prop="originName"
              label="名称"
              min-width="200"
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
            <!--              <el-table-column-->
            <!--                  prop="srid"-->
            <!--                  label="坐标系"-->
            <!--                  show-overflow-tooltip-->
            <!--                  min-width="100px"-->
            <!--              >-->
            <!--              </el-table-column>-->
            <el-table-column
              label="类型"
              show-overflow-tooltip
              min-width="100px"
            >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{
                  typeList[scope.row["geoType"]]
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="上传时间"
              show-overflow-tooltip
              min-width="230px"
            ></el-table-column>
            <el-table-column
              label="操作"
              show-overflow-tooltip
              min-width="300px"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handlePreview(scope.row, 'defaultPg')"
                  >预览
                </el-button>
                <el-button size="mini" @click="handleDownload(scope.row.id)"
                  >下载
                </el-button>
                <!-- <el-button size="mini" @click="cacheItemPre = scope.row;cacheShow = true"
                >预缓存
                </el-button
                > -->
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDeleteShp(scope.row.id)"
                  >删除
                </el-button>
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
      <!-- 缓存面板 -->
      <!-- <el-dialog
          title="数据库源信息编辑"
          :visible.sync="cacheShow"
          width="30%"
          center>
        <el-form label-position="right" label-width="100px" :model="cacheItem">
          <el-form-item
              label="name:"
              :rules="{required: true, message: '请输入ip信息', trigger: 'blur'}">
            <el-input v-model="cacheItem.ip"></el-input>
          </el-form-item>
          <el-form-item
              label="描述:">
            <el-input v-model="cacheItem.description"></el-input>
          </el-form-item>
          <el-form-item
              label="层级范围:">
            <el-slider
                v-model="cacheItem.range"
                range
                :max="22">
            </el-slider>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
      <el-button @click="cacheShow = false">取 消</el-button>
      <el-button type="primary" @click="handleCache">确 定</el-button>
    </span>
      </el-dialog>           -->
    </el-card>
    <!--    PostgreSQL源管理-->
    <el-card
      v-if="activeIndex == '2'"
      class="main-content"
      shadow="never"
    >
      <div slot="header">
        <h3>数据管理</h3>
      </div>
      <div class="page-part">
        <div class="leftUpload">
          <el-divider content-position="center">数据源信息</el-divider>
          <el-button
            type="primary"
            round
            size="small"
            @click="pgEditShow = true"
            >添加数据库源</el-button
          >
          <el-table
            :data="dataBaseList"
            stripe
            :row-style="{ height: '10px', padding: '0' }"
            style="width: 360px"
            max-height="500"
          >
            <el-table-column prop="name" label="数据库源"> </el-table-column>
            <el-table-column prop="userName" label="用户名"> </el-table-column>
            <el-table-column label="操作" min-width="115">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  style="margin-right: 5px"
                  circle
                  size="mini"
                  class="el-icon-view"
                  title="查看存储数据"
                  @click="handleDataView(scope.row)"
                >
                </el-button>
                <el-popconfirm
                  title="确定删除吗？"
                  @confirm="dataBaseDelete(scope.row)"
                >
                  <el-button
                    slot="reference"
                    style="margin-right: 5px"
                    size="mini"
                    class="el-icon-delete"
                    type="danger"
                    title="删除"
                    circle
                    @click="deletePg(scope.row.id)"
                  >
                  </el-button>
                </el-popconfirm>
                <el-button
                  type="success"
                  class="el-icon-refresh"
                  :title="'更新' + scope.row.name + '数据'"
                  circle
                  size="small"
                  @click="updatePgData(scope.row.id)"
                >
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-divider class="deviderHeight" direction="vertical"></el-divider>
        <div class="rightContent">
          <el-divider content-position="center">{{
            dataBaseList.length > 0 ? pgBaseSelect["name"] + "数据" : ""
          }}</el-divider>
          <br /><br />
          <el-table
            :data="shpMutiData"
            stripe
            row-key="id"
            style="width: 100%"
            max-height="500"
          >
            <el-table-column
              prop="originName"
              label="名称"
              min-width="200"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              label="类型"
              show-overflow-tooltip
              min-width="100px"
            >
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{
                  typeList[scope.row["geoType"]]
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="数据范围"
              show-overflow-tooltip
              min-width="230px"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.bounds }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              show-overflow-tooltip
              min-width="300px"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handlePreview(scope.row, 'multiPg')"
                  >预览
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-divider></el-divider>
        </div>
      </div>
      <!-- 缓存面板 -->
      <!-- <el-dialog
          title="数据库源信息编辑"
          :visible.sync="cacheShow"
          width="30%"
          center>
        <el-form label-position="right" label-width="100px" :model="cacheItem">
          <el-form-item
              label="name:"
              :rules="{required: true, message: '请输入ip信息', trigger: 'blur'}">
            <el-input v-model="cacheItem.ip"></el-input>
          </el-form-item>
          <el-form-item
              label="描述:">
            <el-input v-model="cacheItem.description"></el-input>
          </el-form-item>
          <el-form-item
              label="层级范围:">
            <el-slider
                v-model="cacheItem.range"
                range
                :max="22">
            </el-slider>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
      <el-button @click="cacheShow = false">取 消</el-button>
      <el-button type="primary" @click="handleCache">确 定</el-button>
    </span>
      </el-dialog> -->
      <!-- 数据源编辑 -->
      <el-dialog
        title="数据库源信息编辑"
        :visible.sync="pgEditShow"
        width="30%"
        center>
        <el-form label-position="left" label-width="100px" :model="pgAddInfo">
          <el-form-item
            label="IP:"
            :rules="{required: true, message: '请输入ip信息', trigger: 'blur'}">
            <el-input v-model="pgAddInfo.ip"></el-input>
          </el-form-item>
          <el-form-item
            label="端口:"
            :rules="{required: true, message: '请输入端口号', trigger: 'blur'}">
            <el-input v-model="pgAddInfo.port"></el-input>
          </el-form-item>
          <el-form-item
            label="数据库名:"
            :rules="{required: true, message: '请输入数据库名', trigger: 'blur'}">
            <el-input v-model="pgAddInfo.name"></el-input>
          </el-form-item>
          <el-form-item
            label="用户名:"
            :rules="{required: true, message: '请输入用户名', trigger: 'blur'}">
            <el-input v-model="pgAddInfo.userName"></el-input>
          </el-form-item>
          <el-form-item
            label="密码:"
            :rules="{required: true, message: '请输入密码', trigger: 'blur'}">
            <el-input v-model="pgAddInfo.password"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="pgEditShow = false">取 消</el-button>
          <el-button type="primary" @click="addPg">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <!--    mbtiles-->
    <el-card
      v-if="activeIndex == '3'"
      class="main-content infoBox"
      shadow="never"
    >
      <div slot="header">
        <h3>MbTiles源</h3>
      </div>
      <div>
        <el-button type="primary" round size="small" @click="openMbEdit"
          >添加mbTiles</el-button
        >
        <el-divider content-position="center">mbTiles源信息</el-divider>
        <el-table
          :data="mbtilesTableData"
          stripe
          :row-style="{ height: '10px', padding: '0' }"
          style="width: 100%"
          @cell-click="mbCellClick($event)"
          max-height="500"
        >
          <el-table-column prop="name" label="名称" width="200">
          </el-table-column>
          <el-table-column
            label="数据范围"
            show-overflow-tooltip
            min-width="100"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.tileJsonInfo.bounds }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="是否为OSM数据"
            show-overflow-tooltip
            min-width="50"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.osmMbtilesBoolean ? "是" : "否" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="级别范围"
            show-overflow-tooltip
            min-width="50"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.tileJsonInfo["minzoom"] +
                "-" +
                scope.row.tileJsonInfo["maxzoom"]
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="图层数量"
            show-overflow-tooltip
            min-width="50"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.tileJsonInfo["vector_layers"].length }}</span>
            </template>
          </el-table-column>
          <el-table-column label="中心" show-overflow-tooltip min-width="50">
            <template slot-scope="scope">
              <span>{{ scope.row.tileJsonInfo.center }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" show-overflow-tooltip width="200">
            <template slot-scope="scope">
              <!-- <el-button
                type="success" style="margin-right:5px"
                circle size="mini" class="el-icon-plus"
                title="添加样式数据" @click="openMbStyleEdit">
              </el-button>    -->
              <el-button
                type="primary"
                style="margin: 0px"
                circle
                size="mini"
                class="el-icon-view"
                title="查看数据信息"
                @click="handleMbtilesview(scope.row)"
              >
              </el-button>
              <!-- <el-button
                type="primary" style="margin:0px"
                circle size="mini" class="el-icon-s-grid"
                title="查看样式信息" @click="handlePreview(scope.row,'mbTiles')">
              </el-button>    -->
              <el-popconfirm
                title="确定删除吗？"
                @confirm="deleteMbtiles(scope.row)"
              >
                <el-button
                  slot="reference"
                  style="margin: 0 5px"
                  size="mini"
                  class="el-icon-delete"
                  type="danger"
                  title="删除mbTiles源"
                  circle
                >
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <br />
        <el-dialog
          title="mbTiles信息编辑"
          :visible.sync="mbTilesEditShow"
          width="30%"
          :modal="false"
          center
          :close-on-click-modal="false"
        >
          <el-form
            ref="mbEditForm"
            label-position="right"
            label-width="150px"
            :model="mbAddInfo"
            id="myForm1"
            enctype="multipart/form-data"
            name="fileinfo"
            action=""
            target="uploadFrame2"
          >
            <el-form-item
              label="类型:"
              :rules="{
                required: true,
                message: '请选择数据类型',
                trigger: 'blur',
              }"
            >
              <el-checkbox-group v-model="mbTilesTypeSelect">
                <el-checkbox
                  v-for="item in mbTilesTypeOption"
                  :label="item"
                  :key="item"
                  >{{ item }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              label="是否为OSM数据:"
              prop="osmMbtilesBoolean"
              :rules="{
                required: true,
                message: '请选择是否为OSM数据',
                trigger: 'blur',
              }"
            >
              <el-checkbox v-model="mbAddInfo['osmMbtilesBoolean']"
                >OSM数据</el-checkbox
              >
            </el-form-item>
            <el-form-item label="描述:" prop="description">
              <el-input v-model="mbAddInfo.description"></el-input>
            </el-form-item>
            <el-form-item
              label="文件:"
              :rules="{
                required: true,
                message: '请选择文件',
                trigger: 'blur',
              }"
            >
              <input type="file" ref="mbFile" />
            </el-form-item>
            <el-form-item
              label="文件名:"
              prop="name"
              :rules="{
                required: true,
                message: '文件不能为空',
                trigger: 'blur',
              }"
            >
              <el-input v-model="mbAddInfo.name"></el-input>
            </el-form-item>
            <el-form-item
              label="文件路径:"
              prop="path"
              :rules="{
                required: true,
                message: '请输入文件路径',
                trigger: 'blur',
              }"
            >
              <el-input v-model="mbAddInfo.path" placeholder="E:/MapboxDB/sqlites/2020-10-planet-14.mbtiles"></el-input>
            </el-form-item>
          </el-form>
          <iframe
            id="uploadFrame2"
            name="uploadFrame2"
            style="display: none"
          ></iframe>
          <span slot="footer" class="dialog-footer">
            <el-button @click="mbTilesEditShow = false">取 消</el-button>
            <el-button type="primary" @click="addMbTileData">确 定</el-button>
          </span>
        </el-dialog>
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
            id="myForm2"
            enctype="multipart/form-data"
            name="fileinfo"
            action=""
            target="uploadFrame1"
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
            id="uploadFrame1"
            name="uploadFrame1"
            style="display: none"
          ></iframe>
          <span slot="footer" class="dialog-footer">
            <el-button @click="mbStyleEditShow = false">取 消</el-button>
            <el-button type="primary" @click="addMbStyleData()"
              >确 定</el-button
            >
          </span>
        </el-dialog>
        <!-- 详细信息展示 -->
        <el-row v-if="mbDataInfoShow">
          <el-divider content-position="center">{{
            mbtilesTableData.length > 0
              ? mbTileSelect["name"] + "数据源信息"
              : ""
          }}</el-divider>
          <el-row>
            <h2>数据描述</h2>
            <div style="width: calc(90vw - 300px); font-size: 15px">
              {{ mbTileSelect.description }}
            </div>
          </el-row>
          <br />
          <el-row>
            <!-- <el-col :span="8">
              <h2>
                {{
                  mbtilesTableData.length > 0
                    ? mbTileSelect["name"] + "样式"
                    : ""
                }}
              </h2>
              <el-table
                :data="mbTileStyleList"
                stripe
                border
                style="width: 100%"
              >
                <el-table-column prop="name" label="样式名" width="width">
                </el-table-column>
                <el-table-column
                  label="样式数量"
                  show-overflow-tooltip
                  min-width="50px"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row["layers"].length }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="115">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="
                        handleMbPreview(mbTileJsonList, scope.row, 'mbStyle')
                      "
                      >预览</el-button
                    >
                    <el-popconfirm
                      title="确定删除吗？"
                      @confirm="deleteStyleJson(scope.row)"
                    >
                      <el-button
                        slot="reference"
                        size="mini"
                        type="danger"
                        style="margin-left: 5px"
                        >删除
                      </el-button>
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>
            </el-col> -->
            <el-col :span="12">
              <el-row>
                <h2>{{ mbTileSelect["name"] }}详细信息</h2>
                <el-form
                  label-position="left"
                  label-width="80px"
                  :model="mbInfoDetail"
                >
                  <el-form-item label="类别:">
                    <span>{{ mbInfoDetail.classification }}</span>
                  </el-form-item>
                  <el-form-item label="地址:">
                    <span>{{ mbInfoDetail.path }}</span>
                  </el-form-item>
                </el-form>
              </el-row>
            </el-col>
          </el-row>
          <el-divider content-position="center">{{
            mbtilesTableData.length > 0
              ? mbTileSelect["name"] + "数据图层信息"
              : ""
          }}</el-divider>
          <el-row>
            <el-col :span="8">
              <h2>数据图层</h2>
              <el-table
                :data="mbTileSourceJson['vector_layers']"
                height="400"
                stripe
                border
                style="width: 400px"
              >
                <el-table-column prop="id" label="名称" width="150">
                </el-table-column>
                <el-table-column
                  label="数据范围"
                  show-overflow-tooltip
                  min-width="100px"
                >
                  <template slot-scope="scope">
                    <span>{{
                      scope.row["minzoom"] + "-" + scope.row["maxzoom"]
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  show-overflow-tooltip
                  min-width="100px"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      title="查看图层属性"
                      @click="handleVecLayerView(scope.row)"
                      >查看
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="7" :offset="1">
              <h2>{{ vecLayerSelect.id }} 属性信息</h2>
              <el-table
                :data="this.vecAttrList"
                max-height="400"
                stripe
                border
                style="width: 405px"
              >
                <el-table-column prop="column_name" label="属性名" width="200">
                </el-table-column>
                <el-table-column prop="data_type" label="类型" width="200">
                </el-table-column>
              </el-table>
            </el-col>
            <!-- <el-col :span="6" v-if="typeof(vecLayerSelect.description) != 'undefined' && vecLayerSelect.description != ''">
              <h2>{{vecLayerSelect.id}} 图层描述信息</h2>
              <div style="font-size:15px">{{vecLayerSelect.description}}</div>
            </el-col> -->
          </el-row>
        </el-row>
      </div>
    </el-card>
    <!-- 外部数据源 -->
    <el-card
      v-if="activeIndex == '4' || activeIndex == '5' || activeIndex == '6'"
      class="main-content"
      shadow="never"
    >
      <div slot="header">
        <h3>{{ outUrlItem + " 源管理" }}</h3>
      </div>
      <div>
        <el-button type="primary" round size="small" @click="openUrlEdit">{{
          "添加 " + outUrlItem + " 链接"
        }}</el-button>
        <el-divider content-position="center">{{
          outUrlItem + " 源信息"
        }}</el-divider>
        <el-table
          :data="urlBase[outUrlItem]"
          stripe
          :row-style="{ height: '10px', padding: '0' }"
          style="width: 100%"
          max-height="500"
        >
          <el-table-column prop="name" label="名称" width="200">
          </el-table-column>
          <el-table-column prop="description" label="描述" width="400">
          </el-table-column>
          <el-table-column prop="url" label="外部服务链接">
          </el-table-column>
          <el-table-column label="操作" show-overflow-tooltip width="400">
            <template slot-scope="scope">
              <!-- <el-button
                type="primary"
                style="margin: 0px"
                circle
                size="mini"
                class="el-icon-view"
                title="查看数据信息"
                @click="handleOutview(scope.row)"
              >
              </el-button> -->
              <el-popconfirm
                title="确定删除吗？"
                @confirm="deleteThirdPartSource(scope.row)"
              >
                <el-button
                  slot="reference"
                  style="margin: 0 5px"
                  size="mini"
                  class="el-icon-delete"
                  type="danger"
                  title="删除第三方数据源"
                  circle
                >
                </el-button>
              </el-popconfirm>
            </template>
<!--            <template slot-scope="scope">-->
<!--              <el-popconfirm-->
<!--                title="确定删除吗？"-->
<!--                @confirm="deleteOutUrl(scope.row)"-->
<!--              >-->
<!--                <el-button-->
<!--                  slot="reference"-->
<!--                  style="margin: 0 5px"-->
<!--                  size="mini"-->
<!--                  class="el-icon-delete"-->
<!--                  type="danger"-->
<!--                  title="删除mbTiles源"-->
<!--                  circle-->
<!--                >-->
<!--                </el-button>-->
<!--              </el-popconfirm>-->
<!--            </template>-->
          </el-table-column>
        </el-table>
        <br />
        <el-dialog
          title="mbTiles信息编辑"
          :visible.sync="addUrlEditShow"
          width="30%"
          :modal="false"
          center
          :close-on-click-modal="false"
        >
          <el-form
            ref="urlEditForm"
            label-position="right"
            label-width="150px"
            :model="addUrlInfo"
          >
            <el-form-item
              label="类型:"
              :rules="{
                required: true,
                message: '请选择数据类型',
                trigger: 'blur',
              }"
            >
              <el-select
                v-model="addUrlInfo.classification"
                placeholder="请选择数据类型"
              >
                <el-option
                  v-for="item in ['TMS', 'WMTS', 'TERRAIN']"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述:" prop="description">
              <el-input v-model="addUrlInfo.description"></el-input>
            </el-form-item>
            <el-form-item
              label="名称:"
              prop="name"
              :rules="{
                required: true,
                message: '名称不能为空',
                trigger: 'blur',
              }"
            >
              <el-input v-model="addUrlInfo.name"></el-input>
            </el-form-item>
            <el-form-item
              label="链接:"
              prop="url"
              :rules="{
                required: true,
                message: '请输入服务链接',
                trigger: 'blur',
              }"
            >
              <el-input v-model="addUrlInfo.url"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addUrlEditShow = false">取 消</el-button>
            <el-button type="primary" @click="addOutService">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>

    <!-- pg数据信息展示 -->
    <el-card v-if="pgInfoShow" class="main-content infoBox">
      <div slot="header">
        <h3 class="textStyle" @click="backPreview">数据管理</h3>
        &nbsp;
        <h3 style="color: #aea8aa">{{ "/" + " " + dataInfo["originName"] }}</h3>
      </div>
      <div id="map1"></div>
      <el-row>
        <h2>属性信息</h2>
        <el-table
          :data="dataInfo.attrInfo"
          height="400"
          stripe
          border
          style="width: 400px"
        >
          <el-table-column prop="column_name" label="属性名" width="200">
          </el-table-column>
          <el-table-column prop="data_type" label="类型" width="200">
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <h2>地图详细信息</h2>
        <el-form label-position="right" label-width="80px" :model="infoDetail">
          <el-form-item label="名称:">
            <span>{{ infoDetail.name }}</span>
          </el-form-item>
          <el-form-item v-if="'time' in infoDetail" label="上传时间:">
            <span>{{ infoDetail.time }}</span>
          </el-form-item>
          <el-form-item label="几何类型:">
            <span>{{ typeList[infoDetail.geotype] }}</span>
          </el-form-item>
          <el-form-item v-if="'srid' in infoDetail" label="投影:">
            <span>{{ ESPG[infoDetail.srid] }}</span>
          </el-form-item>
          <el-form-item label="范围:">
            <span>{{ infoDetail.bounds }}</span>
          </el-form-item>
        </el-form>
      </el-row>
    </el-card>
    <!-- mb数据信息展示 -->
    <!-- <el-card v-if="false" class="main-content infoBox">
      <div slot="header">
        <h3 class="textStyle" @click="pgInfoShow = false">数据管理</h3>&nbsp;
        <h3 style="color:#aea8aa">{{'/'+' '+mbTileSelect['name']}}</h3>
      </div>
      <div id="map2"></div>
      <el-row>
        <h2>数据描述</h2>        
        <div style="width:calc(80vw - 300px)">{{mbTileSourceJson.description}}</div>
      </el-row>
      <el-row>
        <el-col :span="12">
          <h2>数据图层</h2>     
          <el-table
            :data="mbTileSourceJson['vector_layers']"
            height="400" stripe border
            style="width: 400px">
            <el-table-column
              prop="id"
              label="名称"
              width="150">
            </el-table-column>
            <el-table-column
                label="数据范围"
                show-overflow-tooltip
                min-width="100px"
            >
              <template slot-scope="scope">
                <span>{{scope.row['minzoom']+'-'+scope.row['maxzoom']}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" show-overflow-tooltip min-width="100px">
              <template slot-scope="scope">
                <el-button size="mini" title="查看图层属性" @click="handleVecLayerView(scope.row)"
                >查看
                </el-button
                >
              </template>
            </el-table-column>              
          </el-table>
        </el-col>
        <el-col :span="12">
          <h2>{{vecLayerSelect.id}} 数据信息</h2>     
          <el-table
            :data="this.vecAttrList"
            height="400" stripe border
            style="width: 400px">
            <el-table-column
              prop="column_name"
              label="属性名"
              width="200">
            </el-table-column>
            <el-table-column
              prop="data_type"
              label="类型"
              width="200">
            </el-table-column>               
          </el-table>         
        </el-col>
      </el-row>
      <el-row>
        <h2>地图详细信息</h2>
        <el-form label-position="right" label-width="80px" :model="infoDetail">
          <el-form-item label="名称:">
            <span>{{infoDetail.name}}</span>
          </el-form-item>
          <el-form-item v-if="'time' in infoDetail" label="上传时间:">
            <span>{{infoDetail.time}}</span>
          </el-form-item>
          <el-form-item label="几何类型:">
            <span>{{typeList[infoDetail.geotype]}}</span>
          </el-form-item>
          <el-form-item v-if="'srid' in infoDetail" label="投影:">
            <span>{{ESPG[infoDetail.srid]}}</span>
          </el-form-item>        
          <el-form-item label="范围:">
            <span>{{infoDetail.bounds}}</span>
          </el-form-item>        
        </el-form>
      </el-row>
      
    </el-card> -->
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import fileApi from "../api/fileApi";
import requestApi from "../api/requestApi";
import layerStyleProperties from "../assets/js/layerStyleProperties";
// import config from "../config";
// import Sortable from 'sortablejs'
var map = null;
export default {
  data() {
    return {
      // 目录条
      activeIndex: "1",
      saveIndex: "",  //用于存储activeIndex,处理地图控件残留问题

      // shpUploadUrl: config.requestUrl + "/shp/uploadShp",
      // symbolUploadUrl: config.requestUrl + "/symbol/uploadSymbol",
      shpUploadUrl: this.reqUrl + "/shp/uploadShp",
      multiShpUploadUrl: this.reqUrl + "/shp/uploadMultiShp",
      symbolUploadUrl: this.reqUrl + "/symbol/uploadSymbol",
      //缓存
      cacheShow: false,
      cacheItemPre: {},
      cacheItem: { name: "", description: "", range: [0, 22] },
      //shp页
      shpTableData: [],
      shpCurrentPage: 1,
      shpPageSize: 10,
      shpTotalDataCount: 0,
      shpSearchInput: "",
      typeList: {
        POINT: "点",
        MULTIPOINT: "多点",
        LINESTRING: "线",
        MULTILINESTRING: "多线",
        POLYGON: "面",
        MULTIPOLYGON: "多面",
        "GEOMETRY COLLECTION": "几何几何",
      },
      // 外部pg
      pgEditShow: false,
      dataBaseList: [],
      pgAddInfo: { ip: "", name: "", password: "", port: "", userName: "" },
      shpMutiData: [],
      pgBaseSelect: {},
      // mbTiles
      mbTileSelect: { tileJsonInfo: [] },
      mbTileStyleJson: {},
      mbTileSourceJson: {},
      mbtilesTableData: [],
      mbTileStyleList: [],
      mbTilesTypeOption: ["压缩", "偏移"],
      mbTilesTypeSelect: [],
      mbTilesEditShow: false,
      mbStyleEditShow: false,
      mbAddInfo: {
        classification: "",
        description: "",
        mbTilesJsonFile: null,
        name: "",
        osmMbtilesBoolean: false,
        path: "",
      },
      mbStyleAddInfo: { mapStyleFile: null, mbtilesId: "" },

      // 外部数据源
      outUrlItem: "",
      addUrlInfo: { classification: "", description: "", name: "", url: "" },
      addUrlEditShow: false,
      urlBase: { TERRAIN: [], TMS: [], WMTS: [] },

      // 信息展示页
      // pg
      infoDetail: { name: "", time: "", geotype: "", srid: "", bound: [] },
      pgInfoShow: false, //控制数据信息展示
      dataInfo: {},
      ESPG: { 4326: "WGS84", 3857: "球体墨卡托" },
      // mbTiles
      mbDataInfoShow: false,
      vecLayerSelect: {},
      vecAttrList: [],
      attrChiList: { String: "字符串", Number: "数字", Boolean: "布尔值" },
      mbInfoDetail: { classification: "", path: "" },

      //图标页
      symbolTableData: [],
      symbolCurrentPage: 1,
      symbolPageSize: 10,
      symbolTotalDataCount: 0,
      symbolSearchInput: "",
    };
  },
  mounted() {
    document.title = '数据服务';
    this.getShpDataList();

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
      requestApi
        .requestTest()
        .then(() => {
          console.log("aaaa");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // menu导航条
    handleMenuSelect(key) {
      this.activeIndex = key;
      this.mbDataInfoShow = false;
      // 等页面渲染完，否则会有地图控件残留在新页面
      this.$nextTick(()=>{
        this.pgInfoShow = false;
      })
      switch (key) {
        case "1":
          this.getShpDataList();
          break;
        case "2":
          requestApi
            .getPgList()
            .then((res) => {
              console.log("数据库源:", res);
              this.dataBaseList = res.data.data;
              if(this.dataBaseList.length != 0){
                this.pgBaseSelect = JSON.parse(
                  JSON.stringify(this.dataBaseList[0])
                ); //默认 优化
                this.handleDataView(this.pgBaseSelect);
              }
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        case "3":
          requestApi
            .getMbtilesList()
            .then((res) => {
              this.mbtilesTableData = res.data.data;
              this.mbTileSelect = JSON.parse(
                JSON.stringify(this.mbtilesTableData[0])
              );
              this.mbTileSourceJson = this.mbTileSelect.tileJsonInfo;
              this.vecLayerSelect =
                this.mbTileSelect.tileJsonInfo.vector_layers;
              this.getStyleListById(this.mbTileSelect.id);
              console.log("mbList", this.mbtilesTableData);
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        case "4":
          this.outUrlItem = "TERRAIN";
          this.getOutService()

          break;
        case "5":
          this.outUrlItem = "WMTS";
          this.getOutService()

          break;
        case "6":
          this.outUrlItem = "TMS";
          this.getOutService()

          break;
        default:
          // this.pgInfoShow = true;
          break;
      }  
    },
    getShpDataList() {
      requestApi
        .getShpList({
          asc: false,
          page: this.shpCurrentPage,
          shpPageSize: this.shpPageSize,
          searchText: this.shpSearchInput,
          sortField: "createTime",
        })
        .then((res) => {
          console.log("shpDataList", res.data);
          this.shpTableData = res.data.data.content;
          this.shpTotalDataCount = res.data.data.totalElements;
        })
        .catch((error) => {
          console.log("shp失败", error);
        });
    },
    dataBaseDelete(row) {
      console.log("111", row.id);
      requestApi
        .deleteSourceById(row.id)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
      this.getPgList();
    },

    handleShpUpSuccess(res) {
      if (res.code != 0) {
        this.$message.error("shp上传成功但导入数据库失败！");
      } else {
        this.$message.success("shp成功上传");
      }
      this.getShpDataList();
    },

    handleMultiShpUpSuccess(res) {
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

    // 多数据源操作
    getPgList() {
      requestApi
        .getPgList()
        .then((res) => {
          console.log("数据库源:", res);
          this.dataBaseList = res.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addPg() {
      requestApi
        .addPg(this.pgAddInfo)
        .then((res) => {
          if (res.data.code == 0) {
            this.$message.success("pg源添加成功！");
            this.getPgList();
          } else {
            this.$message.info("pg源添加失败！");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.info("pg源添加失败！");
        });
      this.pgEditShow = false;
    },
    handleDataView(val) {
      requestApi
        .getShpListByPgId(val.id)
        .then((res) => {
          let list = res.data.data;
          for (let item of list) {
            const bounds = [];
            for (let value of item.bounds) {
              bounds.push(Number(value.toFixed(2)));
            }
            item.bounds = bounds;
          }
          this.shpMutiData = list;
          console.log("多pg数据", this.shpMutiData);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deletePg(id) {
      requestApi
        .deletePg(id)
        .then(() => {
          this.getPgList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updatePgData(id) {
      requestApi
        .updateShpsInfoByPgId(id)
        .then((res) => {
          if (res.data.code == 0) {
            this.$message.success(this.pgBaseSelect.name + "数据更新成功!");
            this.getPgList();
          } else {
            this.$message.info(this.pgBaseSelect.name + "数据更新失败!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // mbTiles服务
    mbCellClick(row) {
      this.mbTileSelect = row;
      this.mbTileJsonList = [
        JSON.parse(JSON.stringify(this.mbTileSelect["tileJsonInfo"])),
      ];
    },
    openMbEdit() {
      this.mbAddInfo = {
        classification: "",
        description: "",
        mbTilesJsonFile: null,
        name: "",
        osmMbtilesBoolean: false,
        path: "",
      };
      this.mbTilesEditShow = true;
      this.$nextTick(() => {
        this.$refs.mbEditForm.resetFields();
      });
    },
    openMbStyleEdit() {
      this.mbStyleAddInfo = { mapStyleFile: null, mbtilesId: "" };
      this.mbStyleEditShow = true;
      this.$nextTick(() => {
        this.$refs.mbStyleEdit.resetFields();
      });
    },
    deleteOutUrl(row){
      console.log('a',row)
    },

    // 添加mbTiles源信息
    async addMbTileData() {
      // 阻止发生默认行为
      let formData = new FormData();
      // 对类型数据进行判断
      const list = this.mbTilesTypeSelect;
      let type = null;
      console.log(list.indexOf("压缩"));
      if (list.indexOf("压缩") > -1) {
        if (list.indexOf("偏移") > -1) {
          type = "mbtiles2";
        } else {
          type = "mbtiles4";
        }
      } else {
        if (list.indexOf("偏移") > -1) {
          type = "mbtiles3";
        } else {
          type = "mbtiles1";
        }
      }
      this.mbAddInfo.classification = type;
      //input的type为file,输入的文件在files属性里
      let file = this.$refs.mbFile.files[0];
      this.mbAddInfo.mbTilesJsonFile = file;
      formData.append("classification", this.mbAddInfo.classification);
      formData.append("description", this.mbAddInfo.description);
      formData.append("mbTilesJsonFile", file);
      formData.append("name", this.mbAddInfo.name);
      formData.append("osmMbtilesBoolean", this.mbAddInfo.osmMbtilesBoolean);
      formData.append("path", this.mbAddInfo.path);
      console.log("表单信息：", this.mbAddInfo);
      this.mbTilesEditShow = false;
      await this.onUpload(true, formData);
    },
    // 添加mbTiles样式信息
    async addMbStyleData() {
      // 阻止发生默认行为
      let formData = new FormData();
      //input的type为file,输入的文件在files属性里
      let file = this.$refs.mbStyleFile.files[0];
      this.mbStyleAddInfo.mapStyleFile = file;
      formData.append("mapStyleFile", file);
      formData.append("mbtilesId", this.mbTileSelect.id);
      console.log("表单信息：", this.mbStyleAddInfo);
      this.mbStyleEditShow = false;
      await this.onUpload(false, formData);
    },
    // 删除mbTiles数据源
    deleteMbtiles(row) {
      requestApi
        .deleteMbtiles(row.id)
        .then((res) => {
          if (res.data.code == 0) {
            this.$message.success("删除数据源：" + row.name);
            this.getMbtilesSourceList();
          } else {
            this.$message.info("删除数据源失败！");
          }
        })
        .catch((err) => {
          this.$message.info("删除数据源失败！");
          console.log(err);
        });
    },

    //删除外部数据源
    deleteThirdPartSource(row) {
      requestApi
        .deleteThirdPartSourceById(row.id)
        .then((res) => {
          if (res.data.code == 0) {
            this.$message.success("删除数据源：" + row.name);
            this.getThirdSourceList(this.outUrlItem);
          } else {
            this.$message.info("删除数据源失败！");
          }
        })
        .catch((err) => {
          this.$message.info("删除数据源失败！");
          console.log(err);
        });
    },

    deleteStyleJson(row) {
      requestApi
        .deleteStyleJson(row.id)
        .then((res) => {
          if (res.data.code == 0) {
            this.$message.success("删除数据源样式：" + row.name);
          } else {
            this.$message.info("删除数据源样式失败！");
          }
        })
        .catch((err) => {
          this.$message.info("删除数据源样式失败！");
          console.log(err);
        });
    },
    // 获取mbtiles源信息
    getMbtilesSourceList() {
      requestApi
        .getMbtilesList()
        .then((res) => {
          this.mbtilesTableData = res.data.data;
          this.mbTileSelect = JSON.parse(
            JSON.stringify(this.mbtilesTableData[0])
          );
          this.mbTileJsonList = [
            JSON.parse(JSON.stringify(this.mbTileSelect["tileJsonInfo"])),
          ];
          console.log("mbList", this.mbtilesTableData);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //获取第三方数据源信息
    getThirdSourceList(classification) {
      requestApi
        .getThirdPartSourceList(classification)
        .then((res) => {
          this.urlBase[classification] = res.data.data;
          // this.mbTileSelect = JSON.parse(
          //   JSON.stringify(this.mbtilesTableData[0])
          // );
          // this.mbTileJsonList = [
          //   JSON.parse(JSON.stringify(this.mbTileSelect["tileJsonInfo"])),
          // ];
          console.log("thirdList", this.urlBase[classification]);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    handleMbtilesview(row) {
      this.mbTileSelect = row;
      this.mbTileSourceJson = row.tileJsonInfo;
      this.vecLayerSelect = row.tileJsonInfo.vector_layers[0];
      this.getStyleListById(row.id);
      this.vecAttrList = [];
      let val = this.vecLayerSelect;
      let { classification: classification, path: path } = row;
      this.mbInfoDetail = JSON.parse(
        JSON.stringify({ classification: classification, path: path })
      );
      for (var key of Object.keys(val.fields)) {
        this.vecAttrList.push({
          column_name: key,
          data_type: val.fields[key],
        });
      }
      this.mbDataInfoShow = true;
    },
    // 获取不同类型来源的tileJson列表
    // async getTileJsonList(type){
    //   requestApi
    //     .getTileJsonList(type)
    //     .then((res) => {
    //       if(res.data.data.length != 0){
    //         switch(type){
    //           case "mbTile":
    //             this.mbTileJsonList = res.data.data;
    //             console.log("mbTileJsonList", this.mbTileJsonList);
    //             //mbTiles先默认为第一个osm数据
    //             this.mbTileSelect = this.mbTileJsonList[0];
    //             this.dataLayers = this.mbTileJsonList[0].vector_layers;
    //             this.getStyleListById(this.mbTileSelect.id);
    //             break;
    //           default:
    //             console.log("tileJsonList", res.data.data);
    //             break
    //         }

    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
    // 获取mbTile的styleJson列表
    async getStyleListById(id) {
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
    },
    // 上传文件
    onUpload(status, formData) {
      if (status) {
        fileApi
          .mbTileUpload(formData)
          .then((res) => {
            if (res.data.code == 0) {
              this.$message.success("mbTile数据上传成功！");
              this.getMbtilesSourceList();
            } else {
              this.$message.info("mbTile数据上传失败！");
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
            this.getStyleListById(this.mbTileSelect.id);
          })
          .catch((e) => {
            this.$message.error(e.message);
          });
      }
    },
    // 展示mbTiles界面
    // handleMbPreview(mbsource,val,type){
    //   this.mbTileSourceJson = val;
    //   this.mbTileSourceJson = mbsource[0];
    //   this.vecLayerSelect = mbsource[0]['vector_layers'][0];
    //   // let {classification:classification,path:path} = val;
    //   // this.mbInfoDetail = JSON.parse(JSON.stringify({'name':name,'time':time,'geotype':geotype,'srid':srid,'bounds':bounds}));
    //   this.pgInfoShow = false;
    //   // this.$nextTick(()=>{
    //   //   this.createMap(val,type);
    //   // })
    //   console.log('val',val,type);
    // },
    handleVecLayerView(val) {
      this.vecLayerSelect = val;
      this.vecAttrList = [];
      for (var key of Object.keys(val.fields)) {
        this.vecAttrList.push({
          column_name: key,
          data_type: val.fields[key],
        });
      }
    },

    // 外部url服务
    getOutService() {
      requestApi
        .getThirdPartSourceList(this.outUrlItem)
        .then((res) => {
          if (res.data.code == 0) {
            this.urlBase[this.outUrlItem] = res.data.data;
          } else {
            console.log(res.data.csg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openUrlEdit() {
      this.addUrlInfo = {
        classification: "",
        description: "",
        name: "",
        url: "",
      };
      this.addUrlEditShow = true;
      this.$nextTick(() => {
        this.$refs.urlEditForm.resetFields();
      });
    },
    addOutService() {
      requestApi
        .addThirdPartSource(this.addUrlInfo)
        .then((res) => {
          if (res.data.code == 0) {
            this.$message.success(this.outUrlItem + "源添加成功！");
            this.getOutService();
          } else {
            this.$message.info(this.outUrlItem + "源添加失败！");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.info(this.outUrlItem + "源添加失败！");
        });
      this.addUrlEditShow = false;
    },

    // 图标操作
    handlePreview(val, type) {
      // 将index变换，用于隐藏页面
      this.saveIndex = this.activeIndex;
      this.activeIndex = "";
      this.dataInfo = val;
      let {
        originName: name,
        createTime: time,
        geoType: geotype,
        srid: srid,
        bounds: bounds,
      } = val;
      this.infoDetail = JSON.parse(
        JSON.stringify({
          name: name,
          time: time,
          geotype: geotype,
          srid: srid,
          bounds: bounds,
        })
      );
      this.pgInfoShow = true;
      this.$nextTick(() => {
        this.createMap(val, type);
      });
      console.log("val", val);
    },
    backPreview(){
      this.activeIndex = this.saveIndex;      
      this.$nextTick(()=>{
        this.pgInfoShow = false;
      })      
    },
    handleDeleteShp(val) {
      this.$confirm("确认删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          requestApi.deleteShp(val).then((res) => {
            if (res.data.code == 0) {
              this.$message.success("删除成功!");
              this.getShpDataList();
            } else {
              this.$message.info("删除失败!");
            }
          });
        })
        .catch((error) => {
          console.log(error);
          this.$message.info("取消删除");
        });
    },

    handleDownload(shpId) {
      window.location.href =
        // config.requestUrl + "/shp/downloadShp?shpId=" + shpId;
        this.reqUrl + "/shp/downloadShp?shpId=" + shpId;
    },

    handleCache() {
      const fields = [];
      for (let item of this.cacheItemPre.attrInfo) {
        fields.push(item.column);
      }

      let createTileCacheDTO = {
        description: this.cacheItem.description,
        name: this.cacheItemPre.id,
        vector_layers: [
          {
            bounds: this.cacheItemPre.bounds,
            field: fields,
            id: this.cacheItemPre.id,
            maxzoom: this.cacheItem.range[1],
            minzoom: this.cacheItem.range[0],
          },
        ],
      };
      requestApi
        .createTileCache(createTileCacheDTO)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 数据信息展示
    createMap(row, type) {
      let mapDiv = "";
      if (type == "defaultPg" || type == "multiPg") {
        mapDiv = "map1";
      } else {
        mapDiv = "map2";
      }
      mapboxgl.accessToken =
        "pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg";
      map = new mapboxgl.Map({
        container: mapDiv,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [11.255, 43.77], // starting position
        zoom: 13, // starting zoom
        preserveDrawingBuffer: true, //为true，则可以使用map.getCanvas().toDataURL()转为PNG
      });

      // 添加比例尺
      var scale = new mapboxgl.ScaleControl({
        maxWidth: 120,
        unit: "imperial",
      });
      map.addControl(scale);
      scale.setUnit("metric");

      // 添加控件缩放按钮和一个指南针.
      var nav = new mapboxgl.NavigationControl();
      map.addControl(nav, "top-right");

      // 添加全局缩放
      map.addControl(new mapboxgl.FullscreenControl());

      //添加定位控件
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        })
      );
      // 添加数据
      map.on("load", () => {
        //添加layer
        let geoType = row.geoType;
        if (row.geoType.indexOf("LINE") !== -1) {
          geoType = "line";
        } else if (row.geoType.indexOf("POLYGON") !== -1) {
          geoType = "fill";
        } else if (row.geoType.indexOf("POINT") !== -1) {
          geoType = "circle";
        }

        let source_layer = null;
        let id = null;

        switch (type) {
          case "defaultPg":
            id = row.tableName;
            source_layer = row.tableName;
            break;
          case "multiPg":
            id = row.originName;
            source_layer = row.originName;
            break;
          case "mbTileSource":
            source_layer = row.id;
            break;
          default:
            source_layer = row["source-layer"];
            break;
        }

        //前八个是自己用的属性
        let newLayer = {
          id: row.originName,
          type: geoType,
          filter: ["all"],
          layout: JSON.parse(
            JSON.stringify(layerStyleProperties[geoType].layout)
          ), //防止同类型图层样式改变间影响
          maxzoom: 22,
          metadata: "",
          minzoom: 0,
          paint: JSON.parse(
            JSON.stringify(layerStyleProperties[geoType].paint)
          ),
          source: id, //通过记录的source名字与id对应，拿到sourceId
          "source-layer": source_layer,
        };
        // 设置随机颜色
        if (geoType !== "symbol") {
          newLayer.paint[geoType + "-color"] =
            "#" + Math.random().toString(16).substr(2, 6);
        }
        // 添加mapbox相关数据
        let tiles = [];
        switch (type) {
          case "defaultPg":
            tiles = [
              this.reqUrl + "/mvt/" + row.tableName + "/{z}/{x}/{y}.pbf",
            ];
            break;
          case "multiPg":
            tiles = [
              this.reqUrl +
                "/multiPgSource/" +
                this.pgBaseSelect.ip +
                "/" +
                this.pgBaseSelect.port +
                "/" +
                this.pgBaseSelect.name +
                "/" +
                row.originName +
                "/{z}/{x}/{y}.pbf",
            ];
            break;
          case "mbTileSource":
            break;

          default:
            break;
        }
        map.addSource(id, { type: "vector", tiles: tiles });
        map.addLayer(newLayer);
        // const center = [Number((row.bounds[0]+row.bounds[2])/2),Number((row.bounds[1]+row.bounds[3])/2)]
        // map.flyTo({
        //   center: center,
        //   zoom: 9,
        //   speed: 3,
        //   curve: 1,
        //   easing(t) {
        //   return t;
        //   }
        // })
        const bbox = [
          [row.bounds[0] + 0, row.bounds[1] + 0],
          [row.bounds[2] + 0, row.bounds[3] + 0],
        ];
        map.fitBounds(bbox, {
          padding: { top: 10, bottom: 25, left: 15, right: 5 },
        });
      });
    },

    //字体
    getFontList() {
      requestApi
        .getFontList()
        .then((res) => {
          this.fontTableData = res.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
h3 {
  margin: 0;
}
.myDataPage {
  width: 100%;
  height: calc(100vh - 75px);
  position: relative;
}

.dataMenu {
  /* float: left; */
  box-sizing: border-box;
  width: 300px;
  height: calc(100vh - 75px);
  box-shadow: 8px 0 20px rgb(0 0 0 / 8%);
  z-index: 100;
}
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
.main-content /deep/ .el-card__header {
  background-color: #f3f6ff;
  font-weight: bold;
  padding-left: 30px;
}

.page-part {
  display: flex;
}

.deviderHeight {
  height: inherit;
  min-width: 1px;
}

/* 图标 */
.search-box-data {
  display: flex;
  justify-content: space-around;
  align-items: center;
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

/* 数据展示 */
/* 标题 */
.textStyle:hover {
  cursor: pointer;
  color: #409eff;
}
/* 内容框 */
.infoBox /deep/ .el-card__body {
  height: calc(100vh - 180px);
  padding-left: 30px;
  overflow-y: scroll;
}
/* 标题 */
.infoBox .el-card__header {
  background-color: #f3f6ff;
  font-weight: bold;
  padding-left: 30px;
}
/* 地图框 */
#map1,
#map2 {
  width: calc(80vw - 300px);
  height: 600px;
  border: 1px solid black;
}
/* mbTiles */
/* 模板展示框样式 */
.templateCard {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  height: 150px;
  width: 150px;
  margin: 5px 10px;
}
.templateCard .el-card__body {
  padding: 0;
}
/* 模板名称样式 */
.tempCardName {
  padding: 0 25px;
}
.tempCardName span {
  width: 100px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
/* 样式删除按钮 */
.tempDeleBtn {
  position: absolute;
  color: #dcdfe6;
  font-size: 20px;
  right: 2px;
  top: 120px;
  z-index: 1;
}
.tempDeleBtn:hover {
  color: red;
}
/* 图标样式 */
.iconStyle {
  width: 20px;
  margin: 0 5px;
}
</style>
