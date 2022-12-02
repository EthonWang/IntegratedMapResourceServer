import { nanoid } from "nanoid";

/**mapboxgl
 * 遍历layers属性
 * @param {Object}     mapProjectInfo 项目参数
 */  
export const projInit = (a1,a2,a3)=>{
  let layers = JSON.parse(JSON.stringify(a1));
  let sources = JSON.parse(JSON.stringify(a2));
  let layersTree = JSON.parse(JSON.stringify(a3));
  let sourceObj = {};
  let layerObj = {};
  for(let item of layers){
    delete item['index'];
    delete item['originName'];
    if(item['metadata']['mapbox:type'] == 'pgDefault'){
      item['metadata']['mapbox:type'] = 'defaultPG';
      item['sourceType'] = 'defaultPG';
      let sourceId =  `${item['source-layer']}#defaultPG`;
      sourceObj[sourceId] = item['source'];
      item['source'] = sourceId;
      item['manageInfo'] = {layerKey:sourceId,sourceKey:sourceId};
      if(sourceId in layerObj){
        layerObj[sourceId] += 1;
      }else{
        layerObj[sourceId] = 1;
      }
    }else if(item['metadata']['mapbox:type'] == 'mbStyle'){
      let layerName =  `${item['id']}_liberty#style`;
      let sourceName =  'global_#meta';
      sourceObj[sourceName] = item['source'];
      item['source'] = sourceName;
      item['manageInfo'] = {layerKey:layerName,sourceKey:sourceName};  
      if(sourceName in layerObj){
        layerObj[sourceName] += 1;
      }else{
        layerObj[sourceName] = 1;
      }          
    }else if(item['metadata']['mapbox:type'] == 'background'){
      item['sourceType'] = 'background';
      if('background' in layerObj){
        layerObj['background'] += 1;
      }else{
        layerObj['background'] = 1;
      }       
    }
    let addID = nanoid(5);
    for (let i = 0; i < layersTree.length; i++) {
      let node=layersTree[i];
      if(node.nodeType=="group"){
        for (let k = 0; k < node.children.length; k++){
          if(node.children[k].id==item.id)
            node.children[k]=item
            node.children[k].id += `_${addID}`;
        }
      }
      else{
        if(node.id==item.id){
          layersTree[i]=item
          layersTree[i].id += `_${addID}`;
        }
      }
    }    
    item['id'] += `_${addID}`;
  }
  let sourceStr = JSON.stringify(sources);
  for(let key in sourceObj){
    console.log("替换的key",sourceObj[key],key);
    let a = sourceStr.replace(sourceObj[key],key);
    sourceStr = a;
  }
  sources = JSON.parse(sourceStr);
  return {layerRes:layers,sourceRes:sources,layersTreeRes:layersTree,layerObj:layerObj,sourceObj:sourceObj}
 }