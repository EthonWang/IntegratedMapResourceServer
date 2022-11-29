//准备state——用于存储数据
const state = {
  layers:[],
  sources:{},
  mapProjectInfo:{},
  layersNameObject: {},
  sourceNameObject: {}, 
  nowLayerIndex: 0,
  originStyle:{},     // 对layers进行浅拷贝，所以会随layers进行更新
  spritePath:'',  
  layersTree:[],
  tileJsonList: [],     // 保存后待删除的json名单
  publicBoolean: '',
}
// 不常修改的就放入localStorage
export default state;
