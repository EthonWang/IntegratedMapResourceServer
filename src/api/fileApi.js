import axios from 'axios'
import Vue from "vue";
// 文件上传
export default{
  mbTileUpload (file){
    return axios({
      url: Vue.prototype.reqUrl+"/dataSource/addMbtiles",
      method: 'post',
      data: file,
      headers: {
          'Content-Type': 'multipart/form-data'
      }
    })
  },
  mbStyleUpload(file){
    return axios({
      url: Vue.prototype.reqUrl+"/dataSource/saveOtherMapStyle",
      method: 'post',
      data: file,
      headers: {
          'Content-Type': 'multipart/form-data'
      }
    })    
  },
  osmStyleUpload(file){
    return axios({
      url: Vue.prototype.reqUrl+"/styleTemplate/saveOsmStyleTemplate",
      method: 'post',
      data: file,
      headers: {
          'Content-Type': 'multipart/form-data'
      }
    })    
  }

}
