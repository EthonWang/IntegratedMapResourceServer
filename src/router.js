import VueRouter from 'vue-router'

import MainPage from "./pages/MainPage"
import MapEditor from "./pages/MapEditor"
import MyData from "./pages/MyData"
import MyProject from "./pages/MyProject"
import MapProjectEditor from "./pages/MapProjectEditor"
import MapEditMain from "./pages/mapEditPage/MapEditMain"
import MyStyle from "./pages/MyStyle"
import MapboxView from "./components/MapboxView"
import ConditionRender from "./components/ConditionRender"
// import TestPage from "./pages/TestPage"
import LayersTree from "./components/LayersTree.vue"
import MyIntroduce from "./pages/MyIntroduce"

const mapBaseRoute="/Map";

const route = new VueRouter({
	routes: [
		{
			path: '/',
			redirect:mapBaseRoute
		},
		{
			path: mapBaseRoute,
			component:MainPage,
			redirect: mapBaseRoute+'/MyData',
			children:[
				{
					path:mapBaseRoute+"/MyData",
					component:MyData
				},
				{
					path:mapBaseRoute+"/MyProject",
					component:MyProject
				},
				{
					path:mapBaseRoute+"/MyStyle",
					component:MyStyle
				},
				{
					path:mapBaseRoute+"/MyIntroduce",
					component:MyIntroduce
				}
			]
		},
		{
			path: "/MapEdit/:mapProjectId",
			component: MapEditMain,
		},
		{
			path: "/ConditionRender",
			component: ConditionRender
		},
		{
			path: "/MapEditor",
			component: MapEditor
		},
		{
      path: "/MapEditor/:mapProjectId",
			component: MapProjectEditor
		},
		{
      path: "/MapboxView",
			component: MapboxView
        },
		{
			path: "/ConditionRender",
			component: ConditionRender
		},
		{
			path: "/LayersTree",
			component: LayersTree
		}
	]
})

export default route