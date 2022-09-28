export default
[
	{
		"layer": "aerodrome_label",
		"attributes": [
			{
				"attribute": "name",
				"type": "string",
				"values": []
			},
			{
				"attribute": "name_en",
				"type": "string",
				"values": []
			},
			{
				"attribute": "name_de",
				"type": "string",
				"values": []
			},
			{
				"attribute": "class",
				"type": "string",
				"values": [
					"international",
					"public",
					"regional",
					"military",
					"private",
					"other"
				]
			},
			{
				"attribute": "iata",
				"type": "string",
				"values": []
			},
			{
				"attribute": "icao",
				"type": "string",
				"values": []
			},
			{
				"attribute": "ele",
				"type": "number",
				"min": -15000,
				"max": 21114
			},
			{
				"attribute": "ele_ft",
				"type": "number",
				"min": -49215,
				"max": 69276
			}
		]
	},
	{
		"layer": "aeroway",
		"attributes": [
			{
				"attribute": "ref",
				"type": "string",
				"values": []
			},
			{
				"attribute": "class",
				"type": "string",
				"values": [
					"aerodrome",
					"heliport",
					"runway",
					"helipad",
					"taxiway",
					"apron",
					"gate"
				]
			}
		]
	},
	{
		"layer": "boundary",
		"attributes": [
			{
				"attribute": "admin_level",
				"type": "number",
				"min": 0,
				"max": 4
			},
			{
				"attribute": "adm0_l",
				"type": "string",
				"values": []
			},
			{
				"attribute": "adm0_r",
				"type": "string",
				"values": []
			},
			{
				"attribute": "disputed",
				"type": "number",
				"min": 0,
				"max": 1
			},
			{
				"attribute": "disputed_name",
				"type": "string",
				"values": [
					"AbuMusaIsland",
					"BaraHotiiValleys",
					"ChineseClaim",
					"Crimea",
					"Demchok",
					"Dokdo",
					"IndianClaim-North",
					"IndianClaimwesternKashmir",
					"PakistaniClaim",
					"SamduValleys",
					"TirpaniValleys"
				]
			},
			{
				"attribute": "claimed_by",
				"type": "string",
				"values": []
			},
			{
				"attribute": "maritime",
				"type": "number",
				"min": 0,
				"max": 1
			}
		]
	},
	{
		"layer": "building",
		"attributes": [
			{
				"attribute": "render_height",
				"type": "number",
				"min": 0,
				"max": 1500
			},
			{
				"attribute": "render_min_height",
				"type": "number",
				"min": 0,
				"max": 1500
			},
			{
				"attribute": "disputed",
				"type": "number",
				"min": 0,
				"max": 1
			},
			{
				"attribute": "colour",
				"type": "string",
				"values": []
			},
			{
				"attribute": "hide_3d",
				"type": "number",
				"min": 0,
				"max": 1
			}
		]
	},
	{
		"layer": "housenumber",
		"attributes": [
			{
				"attribute": "housenumber",
				"type": "string",
				"values": []
			}
		]
	},
	{
		"layer": "landcover",
		"attributes": [
			{
				"attribute": "class",
				"type": "string",
				"values": [
					"farmland",
					"ice",
					"wood",
					"rock",
					"grass",
					"wetland",
					"sand"
				]
			},
			{
				"attribute": "subclass",
				"type": "string",
				"values": [
					"allotments",
					"bare_rock",
					"beach",
					"bog",
					"dune",
					"scrub",
					"farm",
					"farmland",
					"fell",
					"forest",
					"garden",
					"glacier",
					"grass",
					"grassland",
					"golf_course",
					"heath",
					"mangrove",
					"marsh",
					"meadow",
					"orchard",
					"park",
					"plant_nursery",
					"recreation_ground",
					"reedbed",
					"saltern",
					"saltmarsh",
					"sand",
					"scree",
					"swamp",
					"tidalflat",
					"tundra",
					"village_green",
					"vineyard",
					"wet_meadow",
					"wetland",
					"wood"
				]
			}
		]
	},
	{
		"layer": "landuse",
		"attributes": [
			{
				"attribute": "class",
				"type": "string",
				"values": [
					"railway",
					"cemetery",
					"military",
					"residential",
					"commercial",
					"industrial",
					"garages",
					"retail",
					"bus_station",
					"school",
					"university",
					"kindergarten",
					"college",
					"library",
					"hospital",
					"stadium",
					"pitch",
					"playground",
					"track",
					"theme_park",
					"zoo",
					"suburb",
					"quarter",
					"neighbourhood",
					"dam"
				]
			}
		]
	},
	{
		"layer": "mountain_peak",
		"attributes": [
			{
				"attribute": "name",
				"type": "string",
				"values": []
			},
			{
				"attribute": "name_en",
				"type": "string",
				"values": []
			},
			{
				"attribute": "name_de",
				"type": "string",
				"values": []
			},
			{
				"attribute": "class",
				"type": "string",
				"values": [
					"peak",
					"volcano",
					"saddle",
					"ridge",
					"cliff",
					"arete"
				]
			},
			{
				"attribute": "ele",
				"type": "number",
				"min": -15000,
				"max": 21114
			},
			{
				"attribute": "ele_ft",
				"type": "number",
				"min": -49215,
				"max": 69276
			},
			{
				"attribute": "customary_ft",
				"type": "string",
				"values": [
					"1",
					"None"
				]
			},
			{
				"attribute": "rank",
				"type": "string",
				"values": []
			}
		]
	},
	{
		"layer": "park",
		"attributes": [
			{
				"attribute": "class",
				"type": "string",
				"values": []
			},
			{
				"attribute": "name",
				"type": "string",
				"values": []
			},
			{
				"attribute": "name_en",
				"type": "string",
				"values": []
			},
			{
				"attribute": "name_de",
				"type": "string",
				"values": []
			},
			{
				"attribute": "rank",
				"type": "string",
				"values": []
			}
		]
	},
	{
		"layer": "place",
		"attributes": [
			{
				"attribute": "name",
				"type": "string",
				"values": []
			},
			{
				"attribute": "name_en",
				"type": "string",
				"values": []
			},
			{
				"attribute": "name_de",
				"type": "string",
				"values": []
			},
			{
				"attribute": "capital",
				"type": "number",
				"min": 2,
				"max": 6
			},
			{
				"attribute": "class",
				"type": "string",
				"values": [
					"continent",
					"country",
					"state",
					"province",
					"city",
					"town",
					"village",
					"hamlet",
					"suburb",
					"quarter",
					"neighbourhood",
					"isolated_dwelling"
				]
			},
			{
				"attribute": "iso_a2",
				"type": "string",
				"values": [
					"EG",
					"ET",
					"CD",
					"ZA",
					"TZ",
					"KE",
					"SD",
					"UG",
					"MA",
					"DZ",
					"GH",
					"CI",
					"CM",
					"MG",
					"MZ",
					"NG",
					"NE",
					"BF",
					"MW",
					"ML",
					"TD",
					"SN",
					"AO",
					"ZW",
					"CN",
					"IN",
					"ID",
					"PK",
					"BD",
					"RU",
					"JP",
					"PH",
					"VN",
					"TR",
					"IR",
					"TH",
					"MM",
					"KR",
					"IQ",
					"AF",
					"MY",
					"NP",
					"DE",
					"FR",
					"GB",
					"IT",
					"ES",
					"UA",
					"PL",
					"RO",
					"NL",
					"GR",
					"HR",
					"BE",
					"PT",
					"CZ",
					"HU",
					"BY",
					"SE",
					"AT",
					"CH",
					"BG",
					"RS",
					"DK",
					"FI",
					"US",
					"MX",
					"CA",
					"GT",
					"CU",
					"HT",
					"DO",
					"HN",
					"NI",
					"SV",
					"CR",
					"PR",
					"PA",
					"JM",
					"TT",
					"GP",
					"MQ",
					"AU",
					"PG",
					"NZ",
					"FJ",
					"MU",
					"RE",
					"MV",
					"SC",
					"BR",
					"CO",
					"AR",
					"PE",
					"VE",
					"CL",
					"EC",
					"BO",
					"PY",
					"UY"
				]
			},
			{
				"attribute": "rank",
				"type": "number",
				"min": 0,
				"max": 18
			}
		]
	},
	{
		"layer": "poi",
		"attributes": [
			{
				"attribute": "name",
				"type": "string",
				"values": []
			},
			{
				"attribute": "name_en",
				"type": "string",
				"values": []
			},
			{
				"attribute": "name_de",
				"type": "string",
				"values": []
			},
			{
				"attribute": "class",
				"type": "string",
				"values": [
					"shop",
					"town_hall",
					"golf",
					"fast_food",
					"park",
					"bus",
					"railway",
					"aerialway",
					"entrance",
					"campsite",
					"laundry",
					"grocery",
					"library",
					"college",
					"lodging",
					"ice_cream",
					"post",
					"cafe",
					"school",
					"alcohol_shop",
					"bar",
					"harbor",
					"car",
					"hospital",
					"cemetery",
					"attraction",
					"beer",
					"music",
					"stadium",
					"art_gallery",
					"clothing_store",
					"swimming",
					"castle"
				]
			},
			{
				"attribute": "subclass",
				"type": "string",
				"values": []
			},
			{
				"attribute": "rank",
				"type": "number",
				"min": 0,
				"max": 16
			},
			{
				"attribute": "agg_stop",
				"type": "number",
				"min": 1,
				"max": 1
			},
			{
				"attribute": "level",
				"type": "string",
				"values": []
			},
			{
				"attribute": "layer",
				"type": "string",
				"values": []
			},
			{
				"attribute": "indoor",
				"type": "number",
				"min": 1,
				"max": 1
			}
		]
	},
	{
		"layer": "transportation",
		"attributes": [
			{
				"attribute": "class",
				"type": "string",
				"values": [
					"motorway",
					"trunk",
					"primary",
					"secondary",
					"tertiary",
					"minor",
					"path",
					"service",
					"track",
					"raceway",
					"busway",
					"motorway_construction",
					"trunk_construction",
					"primary_construction",
					"secondary_construction",
					"tertiary_construction",
					"minor_construction",
					"path_construction",
					"service_construction",
					"track_construction",
					"raceway_construction"
				]
			},
			{
				"attribute": "subclass",
				"type": "string",
				"values": [
					"rail",
					"narrow_gauge",
					"preserved",
					"funicular",
					"subway",
					"light_rail",
					"monorail",
					"tram",
					"pedestrian",
					"path",
					"footway",
					"cycleway",
					"steps",
					"bridleway",
					"corridor",
					"platform"
				]
			},
			{
				"attribute": "network",
				"type": "string",
				"values": []
			},
			{
				"attribute": "brunnel",
				"type": "string",
				"values": [
					"bridge",
					"tunnel",
					"ford"
				]
			},
			{
				"attribute": "oneway",
				"type": "number",
				"min": -1,
				"max": 1
			},
			{
				"attribute": "ramp",
				"type": "number",
				"min": 1,
				"max": 1
			},
			{
				"attribute": "service",
				"type": "string",
				"values": [
					"spur",
					"yard",
					"siding",
					"crossover",
					"driveway",
					"alley",
					"parking_aisle"
				]
			},
			{
				"attribute": "access",
				"type": "string",
				"values": [
					"False"
				]
			},
			{
				"attribute": "toll",
				"type": "number",
				"min": 0,
				"max": 1
			},
			{
				"attribute": "expressway",
				"type": "number",
				"min": 1,
				"max": 1
			},
			{
				"attribute": "layer",
				"type": "string",
				"values": []
			},
			{
				"attribute": "level",
				"type": "string",
				"values": []
			},
			{
				"attribute": "indoor",
				"type": "number",
				"min": 1,
				"max": 1
			},
			{
				"attribute": "bicycle",
				"type": "string",
				"values": []
			},
			{
				"attribute": "foot",
				"type": "string",
				"values": []
			},
			{
				"attribute": "horse",
				"type": "string",
				"values": []
			},
			{
				"attribute": "mtb_scale",
				"type": "string",
				"values": []
			},
			{
				"attribute": "surface",
				"type": "string",
				"values": [
					"paved",
					"unpaved"
				]
			}
		]
	},
	{
		"layer": "transportation_name",
		"attributes": [
			{
				"attribute": "name",
				"type": "string",
				"values": []
			},
			{
				"attribute": "name_en",
				"type": "string",
				"values": []
			},
			{
				"attribute": "name_de",
				"type": "string",
				"values": []
			},
			{
				"attribute": "ref",
				"type": "string",
				"values": []
			},
			{
				"attribute": "ref_length",
				"type": "string",
				"values": []
			},
			{
				"attribute": "network",
				"type": "string",
				"values": [
					"us-interstate",
					"us-highway",
					"us-state",
					"ca-transcanada",
					"gb-motorway",
					"gb-trunk",
					"road"
				]
			},
			{
				"attribute": "class",
				"type": "string",
				"values": [
					"motorway",
					"trunk",
					"primary",
					"secondary",
					"tertiary",
					"minor",
					"service",
					"track",
					"path",
					"raceway",
					"motorway_construction",
					"trunk_construction",
					"primary_construction",
					"secondary_construction",
					"tertiary_construction",
					"minor_construction",
					"service_construction",
					"track_construction",
					"path_construction",
					"raceway_construction",
					"rail",
					"transit",
					"motorway_junction"
				]
			},
			{
				"attribute": "subclass",
				"type": "string",
				"values": [
					"pedestrian",
					"path",
					"footway",
					"cycleway",
					"steps",
					"bridleway",
					"corridor",
					"platform",
					"junction"
				]
			},
			{
				"attribute": "brunnel",
				"type": "string",
				"values": [
					"bridge",
					"tunnel",
					"ford"
				]
			},
			{
				"attribute": "level",
				"type": "string",
				"values": []
			},
			{
				"attribute": "layer",
				"type": "string",
				"values": []
			},
			{
				"attribute": "indoor",
				"type": "number",
				"min": 1,
				"max": 1
			},
			{
				"attribute": "route_1",
				"type": "string",
				"values": []
			},
			{
				"attribute": "route_2",
				"type": "string",
				"values": []
			},
			{
				"attribute": "route_3",
				"type": "string",
				"values": []
			},
			{
				"attribute": "route_4",
				"type": "string",
				"values": []
			},
			{
				"attribute": "route_5",
				"type": "string",
				"values": []
			},
			{
				"attribute": "route_6",
				"type": "string",
				"values": []
			}
		]
	},
	{
		"layer": "water",
		"attributes": [
			{
				"attribute": "class",
				"type": "string",
				"values": [
					"dock",
					"river",
					"lake",
					"ocean"
				]
			},
			{
				"attribute": "intermittent",
				"type": "number",
				"min": 0,
				"max": 1
			},
			{
				"attribute": "brunnel",
				"type": "string",
				"values": [
					"bridge",
					"tunnel"
				]
			}
		]
	},
	{
		"layer": "water_name",
		"attributes": [
			{
				"attribute": "name",
				"type": "string",
				"values": []
			},
			{
				"attribute": "name_en",
				"type": "string",
				"values": []
			},
			{
				"attribute": "name_de",
				"type": "string",
				"values": []
			},
			{
				"attribute": "class",
				"type": "string",
				"values": [
					"lake",
					"sea",
					"ocean"
				]
			},
			{
				"attribute": "intermittent",
				"type": "number",
				"min": 0,
				"max": 1
			}
		]
	},
	{
		"layer": "waterway",
		"attributes": [
			{
				"attribute": "name",
				"type": "string",
				"values": []
			},
			{
				"attribute": "name_en",
				"type": "string",
				"values": []
			},
			{
				"attribute": "name_de",
				"type": "string",
				"values": []
			},
			{
				"attribute": "class",
				"type": "string",
				"values": [
					"waterway",
					"river",
					"canal",
					"drain",
					"ditch"
				]
			},
			{
				"attribute": "brunnel",
				"type": "string",
				"values": [
					"bridge",
					"tunnel"
				]
			},
			{
				"attribute": "intermittent",
				"type": "number",
				"min": 0,
				"max": 1
			}
		]
	}
]