import {UPDATE} from './mutation-type.js'
//准备actions——用于响应组件中的动作
const actions = {
  update({commit},data){
    commit(UPDATE,data)
  }
}
export default actions;