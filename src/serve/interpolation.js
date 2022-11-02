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

