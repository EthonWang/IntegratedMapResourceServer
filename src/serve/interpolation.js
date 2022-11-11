/**mapboxgl
 * 依据layersName添加新图层名(text-field) 注：添加styleJson的图层不需要此功能
 * @param {List}     layers 图层组
 * @param {String}   layerId 同一数据源的唯一标识
 * @param {String}   originName 图层数据源名称
 * @param {Object}   layersNameObject 数据源名
 */  
export const nameIndex = (a1,a2,a3,a4)=>{
  let layers = JSON.parse(JSON.stringify(a1));
  let layerId = JSON.parse(JSON.stringify(a2));
  let originName = JSON.parse(JSON.stringify(a3));
  let layersNameObject = JSON.parse(JSON.stringify(a4));
  let showName = '';
  let numList = [];
  let layersName = [];
  layers.forEach(item =>{
    layersName.push(item.showName)
  })
  if(layerId in layersNameObject){
    let List = layersName.filter(data =>     // 获取符合命名规范的名称
      data.includes(originName)&&data.includes('(')&&data.includes(')')
    )
    // 有正规命名
    if(List.length != 0){
      List.forEach(element => {
        numList.push(Number(element.slice(-2,-1)));   // road(2)提取2
      });
      numList.sort((a,b)=>a-b);   // 升序
      numList.every((element,index)=>{
        let flag = true;
        if(element != index + 1){    // 如：[1,3]，顺序出现断档
          showName = originName + '(' + (index + 1) + ')';
          flag = false;
        }
        else if(index == numList.length-1){    // 如[1,2,3]顺序正确
          showName = originName + '(' + (index + 2) + ')';
          flag = false;
        }
        return flag
      })
    }else{
      // 有原始名字则添加(2), 若对原始名进行修改则添加(1)
      showName = originName + (layersName.indexOf(originName) != -1 ? '(2)' : '(1)');
    }
    layersNameObject[layerId] += 1;
  }else{
    layersNameObject[layerId] = 1;
    showName = originName;
  }
  console.log('返回结果',showName,layersNameObject);
  return {show:showName,object:layersNameObject};
}


/**
 * 对项目信息进行本地文件替换
 * @param {List}     sources 数据源图层 [{ name: name, type: type, sourceId: item, itemInfo: "", newType: type, newSourceInfo: [(sourceId),(source-layer)] }]
 * @param {file}     uploadFile 上传的文件信息
 */  
export const fileImport = (a1,a2)=>{
  let sources = a1;
  let uploadFile = JSON.parse(JSON.stringify(a2));
  sources.forEach(item=>{
    switch (item.newType) {
      case 'defaultPG':
      case 'multiPG':
        uploadFile = replacePG(item,uploadFile)
        break;
      default:
        uploadFile = replaceElse(item,uploadFile)
        break;
    }
  })
  return uploadFile
}

export const replacePG = (a1,a2)=>{
  let item = a1;
  let sourceId_new = item.newSourceInfo[0];
  let sourceId_old = item.sourceId;
  let source_layer_new = item.newSourceInfo[1];
  let index = sourceId_old.indexOf('#');
  // defaultPG: '#' ; multiPG: '_#'
  let source_layer_old = item.type == 'defaultPG' ? item.sourceId.slice(0,index) : item.sourceId.slice(0,index-1);
  let uploadFile = JSON.parse(JSON.stringify(a2));
  // 先转换source的url
  uploadFile.sources[
    item.sourceId
  ].url = `${this.reqUrl}/getTileJson/${item.jsonId}.json`;   
  // 选择本地文件时更改了样式,修改类型
  if(item.newType != item.type){
    uploadFile.layers.every(data =>{
      if(data.source == sourceId_old){
        data.sourceType = item.newType;
        data.metadata['mapbox:type'] = item.newType;
      }
    })
  }
  let file_update = JSON.stringify(uploadFile); 
  // 替换sourceId
  file_update = file_update.replaceAll(sourceId_old, sourceId_new);
  // 替换source-layer
  file_update = file_update.replaceAll(source_layer_old, source_layer_new);  
  let file_final = JSON.parse(file_update);  
  return file_final
} 
export const replaceElse = (a1,a2)=>{
  let item = a1;
  let uploadFile = JSON.parse(JSON.stringify(a2));
  // 先转换source的url
  uploadFile.sources[
    item.sourceId
  ].url = `${this.reqUrl}/getTileJson/${item.jsonId}.json`;   
  return uploadFile
} 