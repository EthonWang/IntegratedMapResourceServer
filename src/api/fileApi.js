import axios from 'axios'
import Vue from "vue";
// 文件上传
export default{
  postUpload (file){
      return axios({
        url: Vue.prototype.reqUrl+"/createMbTilesJson",
        method: 'post',
        data: file,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
  }

}
