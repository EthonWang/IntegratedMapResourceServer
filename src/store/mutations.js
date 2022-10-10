import {UPDATE} from './mutation-type.js'
//准备mutations——用于操作数据（state）
const mutations = {
  [UPDATE](state,data){
    state[data.parm] = data.value;
  }
}
export default mutations;