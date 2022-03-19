import VueRouter from 'vue-router'

import MainPage from "./pages/MainPage"
import MapEditor from "./pages/MapEditor"
import MyData from "./pages/MyData"
import MyProject from "./pages/MyProject"

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
				}
			]
		},

		{
            path: '/MapEditor',
			component: MapEditor
        },
	]
})

export default route