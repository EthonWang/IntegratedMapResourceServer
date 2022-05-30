import axios from 'axios'

import config from "../config.js"

const instance= axios.create({
    baseURL: config.requestUrl,
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

export default {

    //shpData
    requestTest() {
        return instance.get("/shp/hello")
    },
    getShpList(data){
        return instance.post("/shp/getShpList",data)
    },
    downloadShp(shpId) {
        return instance.get("/shp/downloadShp", { params: {shpId}})
    },
    deleteShp(shpId){
        return instance.get("/shp/deleteShp", {params:{shpId}})
    },

    //symbol
    getSymbolList(data){
        return instance.post("/symbol/getSymbolList",data)
    },
    deleteSymbol(symbolId){
        return instance.get("/symbol/deleteSymbolById", {params:{symbolId}})
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
        return instance.post("/mapProject/getMapProjectList",data)
    },
    getMapProjectById(mapProjectId){
        return instance.get("/mapProject/getMapProjectById/"+mapProjectId)
    },
    deleteMapProjectById(mapProjectId){
        return instance.get("/mapProject/deleteMapProjectById/"+mapProjectId)
    },
    createNewMapProject(data){
        return instance.post("/mapProject/createNewMapProject",data)
    },
    updateMapProject(data){
        return instance.post("/mapProject/updateMapProject",data,{
            headers: { "Content-Type": "application/json;charset=utf-8"},
        })
    },
    copyMapProject(data){
        return instance.post("/mapProject/copyMapProject",data)
    }


}