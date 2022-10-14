/**
 * 筛选filter对象
 * @param {List} layer 筛选条件
 */  


/**
 * 筛选filter对象
 * @param {List} filterList 筛选条件
 */  
export const filterSplit = (filterList)=>{
  let filterConditon = [];
  let filterWay = filterList[0];     //第一项为条件判断
  let filterOptionSelectList = [];
  let filterTemp = [filterWay];

  filterList.forEach(element => {
    console.log('元素',typeof(element),element);
    if(typeof(element) == 'string'){
      return true;
    } 
    switch(element[0]){
      case '==':
      case '!=':
      case '<' :
      case '<=':
      case '>' :
      case '>=':
        filterConditon.push({
          option: element[1], 
          type:   element[0], 
          value:  element[2]
        });        // ["==","admin_level",2],
        break      // 前几种都是一种处理情况
      case 'in':        
      case '!in':  
        filterConditon.push({
          option: element[1], 
          type:   element[0], 
          value:  element.slice(2).join(',')
        });        // ["in","class","bus","rail","airport"]
        break            
      case 'has':        
      case '!has':     
        filterConditon.push({
          option: '', 
          type:   element[0], 
          value:  element[1]
        });        // ["!has","claimed_by"] 
        break
    }
    filterOptionSelectList.push(element[1]);
    let filter = [];
    let length = filterConditon.length - 1;
    filter.push(filterConditon[length].type);
    filter.push(["get", filterConditon[length].option]);
    filter.push(filterConditon[length].value); 
    filterTemp.push(filter)   

  });
  return{filterWay:filterWay,filterConditon:filterConditon,filterOptionSelectList:filterOptionSelectList,filterTemp:filterTemp}
}


/**
 * base..stops..转换为zoom的interpolate方式
 * @param {Object} renderObject 渲染条件
 */ 
export const renderSplit = (renderObject)=>{
  let zoomValue = [];
  let rate = [];
  let rateValue = {'exp':1,'bezier':[1,1,1,1]};
  let stops = renderObject['stops'];
  // 条件渲染
  let rate1 = [];  
  // 没有base属性则按linear插值，否则为exponential
  if('base' in renderObject){
    rateValue['exp'] = renderObject['base'];
    rate = 'exponential';
    rate1.push('exponential');
    rate1.push(rateValue['exp']);
  }else{
    rate = 'linear';
    rate1.push('linear');
  }
  let zoomCondition1 = ["interpolate", rate1, ["zoom"]];

  stops.forEach(element=>{
    zoomValue.push({
      zoom: element[0],
      value: element[1]
    })
    let length = zoomValue.length - 1;
    console.log('测试',length);
    zoomCondition1.push(zoomValue[length]['zoom']);
    zoomCondition1.push(zoomValue[length]['value']);
  })
  return({
    rate:rate,
    rateValue:rateValue,
    zoomValue:zoomValue,
    valueOrigin:stops[0][1],       // 取第一个级别的数据
    zoomCondition1:zoomCondition1
  })

  

}
