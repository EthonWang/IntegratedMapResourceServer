import axios from 'axios'
import Vue from "vue";
// import config from "../config.js"

const instance= axios.create({
    // baseURL: config.requestUrl,
    // baseURL:Vue.prototype.reqUrl,
    timeout: 4000,
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

// 数据源相关
    addMbtiles(data){
        return instance.post(Vue.prototype.reqUrl+"/dataSource/addMbtiles",data)
    },    
    deleteMbtiles(mbtilesId){
        return instance.get(Vue.prototype.reqUrl+"/dataSource/deleteMbtilesById/"+mbtilesId)
    },   
    getMbtilesList(){
        return  instance.get(Vue.prototype.reqUrl+"/dataSource/getMbtilesList")
      },          
    addPg(data){
        return instance.post(Vue.prototype.reqUrl+"/dataSource/addPg",data)
    },    
    deletePg(pgId){
        return instance.get(Vue.prototype.reqUrl+"/dataSource/deletePgById/"+pgId)
    },   
    getPgList(){
        return instance.get(Vue.prototype.reqUrl+"/dataSource/getPgList")
    },    
    getShpListByPgId(pgId){
        return instance.get(Vue.prototype.reqUrl+"/dataSource/getShpsInfoByPgId/"+pgId)
    }, 
    updateShpsInfoByPgId(pgId){
        return instance.get(Vue.prototype.reqUrl+"/dataSource/updateShpsInfoByPgId/"+pgId)
    },
    //获取style样式列表
    getStyleListById(tileJsonId){
        return instance.get(Vue.prototype.reqUrl+"/dataSource/getStyleList/"+tileJsonId)
    },   
    //保存其他来源的地图样式
    saveOtherMapStyle(data){
        return instance.post(Vue.prototype.reqUrl+"/dataSource/saveOtherMapStyle",data)
    },   
    deleteStyleJson(styleJsonId){
        return instance.get(Vue.prototype.reqUrl+"/dataSource/deleteStyleJson/"+styleJsonId)
    },    

// mvt
    addThirdPartSource(data){
        return instance.post(Vue.prototype.reqUrl+"/dataSource/addThirdPartSource",data)
    },
    getThirdPartSourceList(classification){
        return instance.post(Vue.prototype.reqUrl+"/dataSource/getThirdPartSourceList/"+classification)
    },      



// 字体相关
    deleteFont(fontName){
        return instance.get(Vue.prototype.reqUrl+"/deleteFont/"+fontName)
    },
    //字体
    getFontList(){
        return instance.get(Vue.prototype.reqUrl+"/getFontList")
    }, 

// 图标相关
    // 精灵图
        // 可用精灵图套型列表
    getSpriteList(){
        return instance.post(Vue.prototype.reqUrl+"/getSpriteList")
    },
        // 获取某套精灵图
    getSpriteItem(spriteName,spriteClass,type){
        return instance.get(Vue.prototype.reqUrl+"/store/sprites/"+spriteName+"/"+spriteClass[type])
    },    
    deleteSpriteItem(spriteName){
        return instance.get(Vue.prototype.reqUrl+"/deleteSprite/"+spriteName)
    },    
    // 自定义图标
    getSymbolList(data){
        return instance.post(Vue.prototype.reqUrl+"/symbol/getSymbolList",data)
    },
    deleteSymbol(symbolId){
        return instance.get(Vue.prototype.reqUrl+"/symbol/deleteSymbolById", {params:{symbolId}})
    },
    getSymbolItem(symbolId){
        return instance.get(Vue.prototype.reqUrl+"/symbol/deleteSymbolById" + symbolId)
    },

// OSM样式模板
    //获取style样式列表
    getOsmStyleTemplateList(){
        return instance.get(Vue.prototype.reqUrl+"/styleTemplate/getOsmStyleTemplateList")
    },   
    //保存其他来源的地图样式
    saveOsmStyleTemplate(data){
        return instance.post(Vue.prototype.reqUrl+"/styleTemplate/saveOsmStyleTemplate",data)
    },   
    deleteOsmStyleTemplate(styleTemplateId){
        return instance.get(Vue.prototype.reqUrl+"/styleTemplate/deleteOsmStyleTemplate/"+styleTemplateId)
    },      

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
    getAttrValueMultiPg(ip,port,name,data){
        return instance.post(Vue.prototype.reqUrl+"/shp/getAttrValueMultiPg/"+ip+"/"+port+name, data)
    },  
    getMaxMinAttrMultiPg(ip,port,name,data){
        return instance.post(Vue.prototype.reqUrl+"/shp/getMaxMinAttrMultiPg/"+ip+"/"+port+name, data)
    },           
    deleteSourceById(dataSourceId){
        return instance.get(Vue.prototype.reqUrl+"/deleteSourceById/"+dataSourceId)
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
    importProject(data){
        return instance.post(Vue.prototype.reqUrl+"/mapProject/importProject",data)
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
    // 根据类型获取
    getTileJsonList(tileJsonType){
        return instance.post(Vue.prototype.reqUrl+"/getTileJsonList/"+tileJsonType)
    },
    // 根据id获取
    getTileJson(tileJsonId){
        return instance.get(Vue.prototype.reqUrl+"/getTileJson/"+tileJsonId+".json")
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