export default {
    line: {
        "layout": {
            "line-cap": "butt", //One of "butt", "round", "square"
            "line-join": "miter",  //One of "bevel", "round", "miter"
            "line-miter-limit": 2,
            "line-round-limit": 1.05,
            "visibility":"visible",
            // "line-sort-key":999
        },
        "paint": {
            "line-blur": 0,
            "line-color":"#000000",
            "line-dasharray": [],
            "line-gap-width": 0,
           // "line-gradient":"",  //ignore  Requires source to be "geojson".
            "line-offset": 0,
            "line-opacity": 1,
           // "line-pattern": "",  //ignore  Optional resolvedImage.
            "line-translate": [0,0],
            "line-translate-anchor": "map", //One of "map", "viewport".
            "line-width": 1,
        }
    },
    circle:{
        "layout":{
            "visibility":"visible", //One of "visible", "none"
            // "circle-sort-key":999,
        },
        "paint": {
            "circle-blur": 0,
            "circle-color":"#000000",
            "circle-opacity":1,
            "circle-pitch-alignment":"viewport", //One of "map", "viewport"
            "circle-pitch-scale":"map", //One of "map", "viewport"
            "circle-radius":5,
            "circle-stroke-color":"#000000",
            "circle-stroke-opacity":1,
            "circle-stroke-width":0,
            "circle-translate":[0,0],
            "circle-translate-anchor":"map", // One of "map", "viewport"
        }
    },
    fill:{
        "layout":{
            "visibility":"visible", //One of "visible", "none"
            // "fill-sort-key":999
        },
        "paint": {
            "fill-antialias":true,
            "fill-color":"#000000",
            "fill-opacity":1,
            "fill-outline-color":"#000000",
            //"fill-pattern":''  //ignore  Optional resolvedImage.
            "fill-translate":[0,0],
            "fill-translate-anchor":"map", // One of "map", "viewport"
        }
    },
    symbol:{
        "layout":{
            "icon-allow-overlap":false,
            "icon-anchor":"center", //One of "center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right".
            "icon-ignore-placement":false,
            "icon-image":"cat",
            "icon-keep-upright":false,
            "icon-offset":[0,0],
            "icon-optional":false,
            "icon-padding":0,
            "icon-pitch-alignment":"auto", //One of "map", "viewport", "auto"
            "icon-rotate":0,
            "icon-rotation-alignment":"auto", //"map", "viewport", "auto"
            "icon-size":0.25,

            // "symbol-placement":"point",  //One of "point", "line", "line-center"
            // "symbol-sort-key":0,
            // "symbol-spacing":1,
            // "text-anchor":"center", //One of "center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right". Defaults to "center"
            // "text-field":"",
            // "text-font":["Open Sans Regular","Arial Unicode MS Regular"],
            // "text-ignore-placement":false,
            // "text-justify":"center", // One of "auto", "left", "center", "right".
            // "text-keep-upright":true,
            // "text-letter-spacing":0,
            // "text-line-height":1.2,
            // "text-max-angle":45,
            // "text-max-width":0,
            // "text-offset":[0,0],
            // "text-optional":false,
            // "text-padding":2,
            // "text-pitch-alignment":"auto", //One of "map", "viewport", "auto"
            // "text-radial-offset":0,
            // "text-rotate":0,
            // "text-rotation-alignment":"auto", //One of "map", "viewport", "auto"
            // "text-size":16,
            // "text-transform":"none", //One of "none", "uppercase", "lowercase"
            // "text-variable-anchor":["center"], //One of "center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right".
            // "text-writing-mode":["horizontal"], //One of "horizontal", "vertical"
            // "visibility":"none",
        },
        "paint":{
            // "icon-color":"#000000",
            // // "icon-halo-blur":0,
            // // "icon-halo-color":"rgba(0, 0, 0, 0)",
            // // "icon-halo-width":0,
            // "icon-opacity":1,
            // "icon-translate":[0,0],
            // "icon-translate-anchor":"map", //One of "map", "viewport"
            // "text-color":"#000000",
            // "text-halo-blur":0,
            // "text-halo-color":"rgba(0, 0, 0, 0)",
            // "text-halo-width":0,
            // "text-opacity":1,
            // "text-translate":[0,0],
            // "text-translate-anchor":"map", //One of "map", "viewport".
        }

    },
    "fill-extrusion": {
        "layout": {
          "visibility": "visible", //One of "visible", "none"
          // "fill-extrusion-sort-key":999
        },
        "paint": {
          "fill-extrusion-height": 0,
          "fill-extrusion-base": 0,
          "fill-extrusion-color": "#000000",
          "fill-extrusion-opacity": 1,
          "fill-extrusion-translate": [0, 0],
          "fill-extrusion-translate-anchor": "map", // One of "map", "viewport"
          "fill-extrusion-vertical-gradient": true,
        }          
    },
    background:{
        "paint":{
            "background-color": "#000000",
            "background-opacity": 1,
            "background-pattern": "",
        },
        "layout":{
            "visibility": "visible",
        }

    }          

}