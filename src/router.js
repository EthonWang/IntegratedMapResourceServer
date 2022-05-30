import VueRouter from 'vue-router'

import MainPage from "./pages/MainPage"
import MapEditor from "./pages/MapEditor"
import MyData from "./pages/MyData"
import MyProject from "./pages/MyProject"
import MapProjectEditor from "./pages/MapProjectEditor"
import TestPage from "./pages/TestPage"
import MapboxView from "./components/MapboxView.vue"
import ConditionRender from "./components/ConditionRender.vue"

const mapBaseRoute="/Map";

const route = new VueRouter({
	routes: [
		{
			path: '/',
			redirect:mapBaseRoute
		},{
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
					path:mapBaseRoute+"/MyTest",
					component:TestPage
				}
			]
		},{
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
	
						
	]
})

export default route