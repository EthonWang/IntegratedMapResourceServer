import axios from 'axios'
import Vue from "vue";
// import config from "../config.js"

const instance= axios.create({
    // baseURL: config.requestUrl,
    // baseURL:Vue.prototype.reqUrl,
    timeout: 1000,
});

// axios.interceptors.request.use = instance_Mapbox.interceptors.request.use
// instance_Mapbox.interceptors.request.use(config => {
//     if (localStorage.getItem('Token')) {
//         config.headers.Token = localStorage.getItem('Token')
//     }
//     return config
// }, err => {
//     return Promise.reject(err)
// })

// const myBaseUrl=Vue.prototype.reqUrl

export default {

    //shpData
    requestTest() {

        return instance.get(Vue.prototype.reqUrl+"/shp/hello")
    },
    getShpList(data){
        return instance.post(Vue.prototype.reqUrl+"/shp/getShpList",data)
    },
    downloadShp(shpId) {
        return instance.get(Vue.prototype.reqUrl+"/shp/downloadShp", { params: {shpId}})
    },
    deleteShp(shpId){
        return instance.get(Vue.prototype.reqUrl+"/shp/deleteShp", {params:{shpId}})
    },
    getAttrValue(data){
        return instance.post(Vue.prototype.reqUrl+"/shp/getAttrValue", data)
    },  
    getMaxMinAttrValue(data){
        return instance.post(Vue.prototype.reqUrl+"/shp/getMaxMinAttrValue", data)
    },  
    getAttrValueMultiPg(ip,port,data){
        return instance.post(Vue.prototype.reqUrl+"/shp/getAttrValueMultiPg/"+ip+"/"+port, data)
    },  
    getMaxMinAttrMultiPg(ip,port,data){
        return instance.post(Vue.prototype.reqUrl+"/shp/getMaxMinAttrMultiPg/"+ip+"/"+port, data)
    },          
    getShpListById(dataSourceId){
        return instance.get(Vue.prototype.reqUrl+"/getShpListById/"+dataSourceId)
    },  
    deleteSourceById(dataSourceId){
        return instance.get(Vue.prototype.reqUrl+"/deleteSourceById/"+dataSourceId)
    },


    //symbol
    getSymbolList(data){
        return instance.post(Vue.prototype.reqUrl+"/symbol/getSymbolList",data)
    },
    deleteSymbol(symbolId){
        return instance.get(Vue.prototype.reqUrl+"/symbol/deleteSymbolById", {params:{symbolId}})
    },


    //字体
    getFontList(){
        return instance.get(Vue.prototype.reqUrl+"/getFontList")
    },    

    //mbtiles
    getMbtilesSourceList(){
      return  instance.get(Vue.prototype.reqUrl+"/getMbtilesList")
    },

    //Project  del
    // getProjectList(data){
    //     return instance.post("/project/getProjectList",data)
    // },
    // getProjectById(projectId){
    //     return instance.get("/project/getProjectById/"+projectId)
    // },
    // deleteProjectById(projectId){
    //     return instance.get("/project/deleteProjectById/"+projectId)
    // },
    // createNewProject(data){
    //     return instance.post("/project/createNewProject",data)
    // },
    // copyProject(data){
    //     return instance.post("/project/copyProject",data)
    // },

    //mapProject
    getMapProjectList(data){
        return instance.post(Vue.prototype.reqUrl+"/mapProject/getMapProjectList",data)
    },
    getMapProjectById(mapProjectId){
        return instance.get(Vue.prototype.reqUrl+"/mapProject/getMapProjectById/"+mapProjectId)
    },
    deleteMapProjectById(mapProjectId){
        return instance.get(Vue.prototype.reqUrl+"/mapProject/deleteMapProjectById/"+mapProjectId)
    },
    createNewMapProject(data){
        return instance.post(Vue.prototype.reqUrl+"/mapProject/createNewMapProject",data)
    },
    updateMapProject(data){
        return instance.post(Vue.prototype.reqUrl+"/mapProject/updateMapProject",data,{
            headers: { "Content-Type": "application/json;charset=utf-8"},
        })
    },
    copyMapProject(data){
        return instance.post(Vue.prototype.reqUrl+"/mapProject/copyMapProject",data)
    },
    createMapImg(data){
        return instance.post(Vue.prototype.reqUrl+"/mapProject/createMapImg",data)
    },    
    addDataSource(data){
        return instance.post(Vue.prototype.reqUrl+"/addDataSource",data)
    },
    getDataSourceList(){
        return instance.get(Vue.prototype.reqUrl+"/getDataSourceList")
    },

    //地图发布相关
    //获取发布的地图样式
    getPublishedMap(mapProjectId){
        return instance.post(Vue.prototype.reqUrl+"/mapProject/getPublishedMap/"+mapProjectId)
    },    
    //发布地图项目
    publicMap(mapProjectId){
        return instance.get(Vue.prototype.reqUrl+"/mapProject/publicMap/"+mapProjectId)
    },    
    //取消发布地图项目
    cancelPublicMap(mapProjectId){
        return instance.get(Vue.prototype.reqUrl+"/mapProject/cancelPublicMap/"+mapProjectId)
    },        
    //更换发布地图项目的链接
    changeMapLink(mapProjectId){
        return instance.get(Vue.prototype.reqUrl+"/mapProject/changeMapLink/"+mapProjectId)
    },       

    //地图数据与样式
    //tilejson
    createTileJson(data){
        return instance.post(Vue.prototype.reqUrl+"/createTileJson",data)
    },
    createMbTilesJson(data){
        return instance.post(Vue.prototype.reqUrl+"/createMbTilesJson",data)
    },
    deleteTileJson(tileJsonId){
        return instance.get(Vue.prototype.reqUrl+"/deleteTileJson/"+tileJsonId+".json")
    },
    getTileJsonList(tileJsonType){
        return instance.post(Vue.prototype.reqUrl+"/getTileJsonList/"+tileJsonType)
    },
    //获取style样式列表
    getStyleListById(tileJsonId){
        return instance.get(Vue.prototype.reqUrl+"/mapServer/getStyleList/"+tileJsonId)
    },   
    //保存其他来源的地图样式
    saveOtherMapStyle(data){
        return instance.post(Vue.prototype.reqUrl+"/mapServer/saveOtherMapStyle",data)
    },

    //地图类型样式
    //创建类型样式
    createTypeStyle(data){
        return instance.post(Vue.prototype.reqUrl+"/style/createStyle",data)
    },
    //删除类型样式
    deleteTypeStyle(styleId){
        return instance.get(Vue.prototype.reqUrl+"/style/deleteStyleById/"+styleId)
    },
    //获取类型样式
    getTypeStyleById(styleId){
        return instance.get(Vue.prototype.reqUrl+"/style/getStyleById/"+styleId)
    },
    //获取类型样式列表
    getTypeStyleList(styleType){
        return instance.get(Vue.prototype.reqUrl+"/style/getStyleList/"+styleType)
    },

    

    //瓦片缓存
    createTileCache(data){
        return instance.post(Vue.prototype.reqUrl+"/createTileCache",data)
    },


}