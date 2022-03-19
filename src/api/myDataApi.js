import axios from 'axios'

import config from "../config.js"

const instance_myData = axios.create({
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
    requestTest() {
        return instance_myData.get("hello")
    },

    getDataList(data){
        return instance_myData.post("getFileList",data)
    },
    downLoadFile(fileId) {
        return instance_myData.get("downloadFile", { params: {fileId}})
    },
    deleteFileById(fileId){
        return instance_myData.get("deleteFile", {params:{fileId}})
    }
}