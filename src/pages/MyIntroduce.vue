<template>
    <div class="container">
        <el-image class="background" :src="imgSrc" fit="cover"></el-image>
        <div class="list">
            <el-collapse accordion>
                <el-collapse-item class="iData" title="数据服务 DataService" name="1">
                    <ul>
                        <li>默认PG数据源</li>
                        <li>远程PG数据源</li>
                        <li>瓦片数据源</li>
                        <li>高程数据源</li>
                        <li>WMTS数据源</li>
                        <li>TMS数据源</li>
                    </ul>
                </el-collapse-item>
                <el-collapse-item class="iSource" title="资源服务 SourceService" name="2">
                    <ul>
                        <li>字体库</li>
                        <li>图标库</li>
                        <li>样式库</li>
                        <li>OSM样式库</li>
                    </ul>
                </el-collapse-item>
                <el-collapse-item class="iProject" title="地图项目 MapProject" name="3">
                    <ul>
                        <li>项目的新建</li>
                        <li>数据源加载</li>
                        <li>数据可视化</li>
                    </ul>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            activeName: "1",
            imgSrc: require('../assets/imgs/background_help1.png')
        };
    },
};
</script>
  
<style scoped>
/* .iData .el-collapse-item__header {
    font-size: 30px;
} */

/* .iSource .el-collapse-item__header {
    font-size: 30px;
} */

/* .iProject .el-collapse-item__header {
    font-size: 30px;
} */
.container{
    height: calc(100vh - 75px);
    width: 100%;
    position: relative;
}
.list {
    border-radius: 10px;
    padding: 20px;
    width: 80vw;
    position: absolute;
    left: 10vw;
    right: 10vw;
    top: 14vh;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
}

.background {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: -1;
    opacity: 1;
    background-repeat: no-repeat;
}

.el-collapse /deep/ .el-collapse-item__header {
    background-color: transparent;
    /* background-color: rgba(255, 255, 255, 0.1); */
    border-radius: 5px;
    font-weight: bold;
    font-size: 2vh;
    color: white;
    height: 5vh;
}

.el-collapse /deep/ .el-collapse-item__wrap {
    background-color: transparent;
}



.el-collapse /deep/ .el-collapse-item__content {
    color: white !important;
    font-size: 1.5vh;
}

.el-collapse {
    width: 80vw;
    /* position: absolute; */
    left: 10vw;
    top: 14vh;
}

/* 深度选择器修改样式 */
/* .el-collapse /deep/ .el-collapse-item__header {
    background-color: rgba(255, 255, 255, 0);
    font-weight: bold;
    font-size: 2vh;
    color: white;
    height: 5vh;

} */

/* .el-collapse /deep/ .el-collapse-item__wrap {
    background-color: rgba(255, 255, 255, 0);


} */

/* .el-collapse /deep/ .el-collapse-item__content {
    color: white !important;
    font-size: 1.5vh;

} */
</style>
  