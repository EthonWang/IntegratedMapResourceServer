export default
{
    "version": 8,
    "name": "Basic",
    "metadata": {
        "mapbox:type": "default",
        "mapbox:origin": "basic-v1",
        "mapbox:sdk-support": {
            "android": "10.6.0",
            "ios": "10.6.0",
            "js": "2.9.0"
        },
        "mapbox:autocomposite": true,
        "mapbox:groups": {
            "Transit, transit-labels": {
                "name": "Transit, transit-labels",
                "collapsed": true
            },
            "Administrative boundaries, admin": {
                "name": "Administrative boundaries, admin",
                "collapsed": true
            },
            "Land & water, built": {
                "name": "Land & water, built",
                "collapsed": true
            },
            "Land & water, land": {
                "name": "Land & water, land",
                "collapsed": true
            },
            "Road network, bridges": {
                "name": "Road network, bridges",
                "collapsed": true
            },
            "Road network, tunnels": {
                "name": "Road network, tunnels",
                "collapsed": true
            },
            "Road network, road-labels": {
                "name": "Road network, road-labels",
                "collapsed": true
            },
            "Buildings, built": {"name": "Buildings, built", "collapsed": true},
            "Natural features, natural-labels": {
                "name": "Natural features, natural-labels",
                "collapsed": true
            },
            "Road network, surface": {
                "name": "Road network, surface",
                "collapsed": true
            },
            "Walking, cycling, etc., barriers-bridges": {
                "name": "Walking, cycling, etc., barriers-bridges",
                "collapsed": true
            },
            "Place labels, place-labels": {
                "name": "Place labels, place-labels",
                "collapsed": true
            },
            "Point of interest labels, poi-labels": {
                "name": "Point of interest labels, poi-labels",
                "collapsed": true
            },
            "Walking, cycling, etc., tunnels": {
                "name": "Walking, cycling, etc., tunnels",
                "collapsed": true
            },
            "Walking, cycling, etc., walking-cycling-labels": {
                "name": "Walking, cycling, etc., walking-cycling-labels",
                "collapsed": true
            },
            "Walking, cycling, etc., surface": {
                "name": "Walking, cycling, etc., surface",
                "collapsed": true
            },
            "Transit, built": {"name": "Transit, built", "collapsed": true},
            "Land & water, water": {
                "name": "Land & water, water",
                "collapsed": true
            }
        },
        "mapbox:decompiler": {
            "id": "cl8447n3p002r14p8dbok9e6f",
            "componentVersion": "13.0.0",
            "strata": [
                {
                    "id": "basic-v1",
                    "order": [
                        ["land-and-water", "land"],
                        ["land-and-water", "water"],
                        ["land-and-water", "built"],
                        ["transit", "built"],
                        ["buildings", "built"],
                        ["road-network", "tunnels-case"],
                        ["walking-cycling", "tunnels"],
                        ["road-network", "tunnels"],
                        ["transit", "ferries"],
                        ["walking-cycling", "surface"],
                        ["road-network", "surface"],
                        ["transit", "surface"],
                        ["road-network", "surface-icons"],
                        ["walking-cycling", "barriers-bridges"],
                        ["road-network", "bridges"],
                        ["transit", "bridges"],
                        ["buildings", "extruded"],
                        ["transit", "elevated"],
                        ["admin-boundaries", "admin"],
                        ["buildings", "building-labels"],
                        ["road-network", "road-labels"],
                        ["walking-cycling", "walking-cycling-labels"],
                        ["transit", "ferry-aerialway-labels"],
                        ["natural-features", "natural-labels"],
                        ["point-of-interest-labels", "poi-labels"],
                        ["transit", "transit-labels"],
                        ["place-labels", "place-labels"]
                    ]
                }
            ],
            "components": {
                "road-network": "13.0.0",
                "natural-features": "13.0.0",
                "place-labels": "13.0.0",
                "admin-boundaries": "13.0.0",
                "point-of-interest-labels": "13.0.0",
                "walking-cycling": "13.0.0",
                "transit": "13.0.0",
                "land-and-water": "13.0.0",
                "buildings": "13.0.0"
            },
            "propConfig": {
                "road-network": {
                    "colorBase": "hsl(175, 0%, 100%)",
                    "colorRoad": "hsl(0, 13%, 94%)",
                    "roadNetwork": "Simple"
                },
                "natural-features": {
                    "colorBase": "hsl(175, 0%, 100%)",
                    "colorWater": "hsl(177, 63%, 94%)",
                    "colorPoi": "hsl(20, 2%, 55%)"
                },
                "place-labels": {
                    "colorBase": "hsl(175, 0%, 100%)",
                    "colorPlaceLabel": "hsl(0, 6%, 66%)",
                    "settlementSubdivisionsDensity": 3,
                    "settlementLabelStyle": "Text only"
                },
                "admin-boundaries": {
                    "colorBase": "hsl(175, 0%, 100%)",
                    "colorPlaceLabel": "hsl(0, 6%, 66%)"
                },
                "point-of-interest-labels": {
                    "colorBase": "hsl(175, 0%, 100%)",
                    "colorGreenspace": "hsl(127, 10%, 85%)",
                    "colorGreenspaceLabel": "hsl(128, 12%, 47%)",
                    "colorPoi": "hsl(20, 2%, 55%)",
                    "density": 2
                },
                "walking-cycling": {
                    "colorBase": "hsl(175, 0%, 100%)",
                    "colorRoad": "hsl(0, 13%, 94%)",
                    "colorGreenspace": "hsl(127, 10%, 85%)",
                    "colorGreenspaceLabel": "hsl(128, 12%, 47%)",
                    "walkingCyclingPisteBackground": false,
                    "golfHoleLabelLine": false,
                    "pedestrianPolygonFeatures": false
                },
                "transit": {
                    "colorRoad": "hsl(0, 13%, 94%)",
                    "colorAirport": "hsl(345, 3%, 70%)",
                    "aerialways": false,
                    "colorTransit": "hsl(40, 3%, 70%)",
                    "transitLabels": false,
                    "colorBase": "hsl(175, 0%, 100%)",
                    "colorWater": "hsl(177, 63%, 94%)",
                    "railways": false,
                    "ferries": false
                },
                "land-and-water": {
                    "landType": "Landuse only",
                    "colorGreenspace": "hsl(127, 10%, 85%)",
                    "colorAirport": "hsl(345, 3%, 70%)",
                    "transitionLandOnZoom": false,
                    "colorBase": "hsl(175, 0%, 100%)",
                    "colorWater": "hsl(177, 63%, 94%)",
                    "waterStyle": "Simple"
                },
                "buildings": {
                    "colorBase": "hsl(175, 0%, 100%)",
                    "houseNumbers": false
                }
            }
        },
        "mapbox:uiParadigm": "layers"
    },
    "center": [104.85666060429617, 26.86344920863455],
    "zoom": 4.378110190417616,
    "bearing": 0,
    "pitch": 0,
    "fog": {
        "range": [-1, 10],
        "color": [
            "interpolate",
            ["exponential", 1.2],
            ["zoom"],
            5.5,
            "hsl(205, 76%, 90%)",
            6,
            "hsl(57, 99%, 99%)"
        ],
        "high-color": [
            "interpolate",
            ["exponential", 1.2],
            ["zoom"],
            5.5,
            "hsl(205, 76%, 5%)",
            6,
            "hsl(205, 76%, 78%)"
        ],
        "space-color": [
            "interpolate",
            ["exponential", 1.2],
            ["zoom"],
            5.5,
            "hsl(205, 76%, 10%)",
            6,
            "hsl(205, 76%, 90%)"
        ],
        "horizon-blend": [
            "interpolate",
            ["exponential", 1.2],
            ["zoom"],
            5.5,
            0.04,
            6,
            0.1
        ],
        "star-intensity": [
            "interpolate",
            ["exponential", 1.2],
            ["zoom"],
            5.5,
            0.3,
            6,
            0
        ]
    },
    "sources": {
        "composite": {
            "url": "mapbox://mapbox.mapbox-streets-v8",
            "type": "vector"
        }
    },
    "sprite": "mapbox://sprites/vsir743/cl8447n3p002r14p8dbok9e6f/draft",
    "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    "projection": {"name": "globe"},
    "layers": [
        {
            "id": "land",
            "type": "background",
            "metadata": {
                "mapbox:featureComponent": "land-and-water",
                "mapbox:group": "Land & water, land"
            },
            "layout": {},
            "paint": {"background-color": "hsl(175, 0%, 99%)"}
        },
        {
            "id": "national-park",
            "type": "fill",
            "metadata": {
                "mapbox:featureComponent": "land-and-water",
                "mapbox:group": "Land & water, land"
            },
            "source": "composite",
            "source-layer": "landuse_overlay",
            "minzoom": 5,
            "filter": ["==", ["get", "class"], "national_park"],
            "layout": {},
            "paint": {
                "fill-color": "hsl(127, 10%, 85%)",
                "fill-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    5,
                    0,
                    6,
                    0.5,
                    10,
                    0.5
                ]
            }
        },
        {
            "id": "landuse",
            "type": "fill",
            "metadata": {
                "mapbox:featureComponent": "land-and-water",
                "mapbox:group": "Land & water, land"
            },
            "source": "composite",
            "source-layer": "landuse",
            "minzoom": 5,
            "filter": [
                "all",
                [">=", ["to-number", ["get", "sizerank"]], 0],
                [
                    "match",
                    ["get", "class"],
                    ["park", "airport", "glacier", "pitch", "sand", "facility"],
                    true,
                    "residential",
                    ["step", ["zoom"], true, 12, false],
                    "cemetery",
                    true,
                    false
                ],
                [
                    "<=",
                    [
                        "-",
                        ["to-number", ["get", "sizerank"]],
                        [
                            "interpolate",
                            ["exponential", 1.5],
                            ["zoom"],
                            12,
                            0,
                            18,
                            14
                        ]
                    ],
                    14
                ]
            ],
            "layout": {},
            "paint": {
                "fill-color": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    15,
                    [
                        "match",
                        ["get", "class"],
                        "park",
                        "hsl(127, 10%, 85%)",
                        "airport",
                        "hsl(345, 1%, 100%)",
                        "cemetery",
                        "hsl(109, 3%, 91%)",
                        "glacier",
                        "hsl(177, 43%, 90%)",
                        "pitch",
                        "hsl(127, 11%, 80%)",
                        "sand",
                        "hsl(127, 8%, 98%)",
                        "residential",
                        "hsl(175, 0%, 100%)",
                        "hsl(175, 2%, 94%)"
                    ],
                    16,
                    [
                        "match",
                        ["get", "class"],
                        "park",
                        "hsl(127, 10%, 85%)",
                        "airport",
                        "hsl(345, 15%, 98%)",
                        "cemetery",
                        "hsl(109, 3%, 91%)",
                        "glacier",
                        "hsl(177, 43%, 90%)",
                        "pitch",
                        "hsl(127, 11%, 80%)",
                        "sand",
                        "hsl(127, 8%, 98%)",
                        "hsl(175, 2%, 94%)"
                    ]
                ],
                "fill-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    5,
                    ["match", ["get", "class"], "residential", 1, 0],
                    6,
                    ["match", ["get", "class"], "glacier", 0.5, 1],
                    12,
                    [
                        "match",
                        ["get", "class"],
                        "glacier",
                        0.5,
                        "residential",
                        0,
                        1
                    ]
                ]
            }
        },
        {
            "id": "pitch-outline",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "land-and-water",
                "mapbox:group": "Land & water, land"
            },
            "source": "composite",
            "source-layer": "landuse",
            "minzoom": 15,
            "filter": ["==", ["get", "class"], "pitch"],
            "layout": {},
            "paint": {"line-color": "hsl(109, 6%, 95%)"}
        },
        {
            "id": "waterway",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "land-and-water",
                "mapbox:group": "Land & water, water"
            },
            "source": "composite",
            "source-layer": "waterway",
            "minzoom": 8,
            "layout": {
                "line-cap": ["step", ["zoom"], "butt", 11, "round"],
                "line-join": "round"
            },
            "paint": {
                "line-color": "hsl(177, 63%, 94%)",
                "line-width": [
                    "interpolate",
                    ["exponential", 1.3],
                    ["zoom"],
                    9,
                    ["match", ["get", "class"], ["canal", "river"], 0.1, 0],
                    20,
                    ["match", ["get", "class"], ["canal", "river"], 8, 3]
                ],
                "line-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    8,
                    0,
                    8.5,
                    1
                ]
            }
        },
        {
            "id": "water",
            "type": "fill",
            "metadata": {
                "mapbox:featureComponent": "land-and-water",
                "mapbox:group": "Land & water, water"
            },
            "source": "composite",
            "source-layer": "water",
            "layout": {},
            "paint": {"fill-color": "hsl(177, 63%, 94%)"}
        },
        {
            "id": "land-structure-polygon",
            "type": "fill",
            "metadata": {
                "mapbox:featureComponent": "land-and-water",
                "mapbox:group": "Land & water, built"
            },
            "source": "composite",
            "source-layer": "structure",
            "minzoom": 13,
            "filter": [
                "all",
                ["==", ["get", "class"], "land"],
                ["==", ["geometry-type"], "Polygon"]
            ],
            "layout": {},
            "paint": {"fill-color": "hsl(175, 0%, 99%)"}
        },
        {
            "id": "land-structure-line",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "land-and-water",
                "mapbox:group": "Land & water, built"
            },
            "source": "composite",
            "source-layer": "structure",
            "minzoom": 13,
            "filter": [
                "all",
                ["==", ["get", "class"], "land"],
                ["==", ["geometry-type"], "LineString"]
            ],
            "layout": {"line-cap": "square"},
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.99],
                    ["zoom"],
                    14,
                    0.75,
                    20,
                    40
                ],
                "line-color": "hsl(175, 0%, 99%)"
            }
        },
        {
            "id": "aeroway-polygon",
            "type": "fill",
            "metadata": {
                "mapbox:featureComponent": "transit",
                "mapbox:group": "Transit, built"
            },
            "source": "composite",
            "source-layer": "aeroway",
            "minzoom": 11,
            "filter": [
                "all",
                [
                    "match",
                    ["get", "type"],
                    ["runway", "taxiway", "helipad"],
                    true,
                    false
                ],
                ["==", ["geometry-type"], "Polygon"]
            ],
            "paint": {
                "fill-color": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    15,
                    "hsl(345, 1%, 91%)",
                    16,
                    "hsl(345, 2%, 93%)"
                ],
                "fill-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    11,
                    0,
                    11.5,
                    1
                ]
            }
        },
        {
            "id": "aeroway-line",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "transit",
                "mapbox:group": "Transit, built"
            },
            "source": "composite",
            "source-layer": "aeroway",
            "minzoom": 9,
            "filter": ["==", ["geometry-type"], "LineString"],
            "paint": {
                "line-color": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    15,
                    "hsl(345, 1%, 91%)",
                    16,
                    "hsl(345, 2%, 93%)"
                ],
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    9,
                    ["match", ["get", "type"], "runway", 1, 0.5],
                    18,
                    ["match", ["get", "type"], "runway", 80, 20]
                ]
            }
        },
        {
            "id": "building",
            "type": "fill",
            "metadata": {
                "mapbox:featureComponent": "buildings",
                "mapbox:group": "Buildings, built"
            },
            "source": "composite",
            "source-layer": "building",
            "minzoom": 15,
            "filter": [
                "all",
                ["!=", ["get", "type"], "building:part"],
                ["==", ["get", "underground"], "false"]
            ],
            "layout": {},
            "paint": {
                "fill-color": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    15,
                    "hsl(175, 0%, 95%)",
                    16,
                    "hsl(175, 0%, 95%)"
                ],
                "fill-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    15,
                    0,
                    16,
                    1
                ],
                "fill-outline-color": "hsl(175, 0%, 87%)"
            }
        },
        {
            "id": "tunnel-path",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "walking-cycling",
                "mapbox:group": "Walking, cycling, etc., tunnels"
            },
            "source": "composite",
            "source-layer": "road",
            "minzoom": 14,
            "filter": [
                "all",
                ["==", ["get", "structure"], "tunnel"],
                ["==", ["get", "class"], "path"],
                ["!=", ["get", "type"], "steps"],
                ["==", ["geometry-type"], "LineString"]
            ],
            "layout": {},
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    15,
                    1,
                    18,
                    4
                ],
                "line-color": "hsl(175, 0%, 89%)",
                "line-dasharray": [
                    "step",
                    ["zoom"],
                    ["literal", [1, 0]],
                    15,
                    ["literal", [1.75, 1]],
                    16,
                    ["literal", [1, 0.75]],
                    17,
                    ["literal", [1, 0.5]]
                ]
            }
        },
        {
            "id": "tunnel-steps",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "walking-cycling",
                "mapbox:group": "Walking, cycling, etc., tunnels"
            },
            "source": "composite",
            "source-layer": "road",
            "minzoom": 14,
            "filter": [
                "all",
                ["==", ["get", "structure"], "tunnel"],
                ["==", ["get", "type"], "steps"],
                ["==", ["geometry-type"], "LineString"]
            ],
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    15,
                    1,
                    16,
                    1.6,
                    18,
                    6
                ],
                "line-color": "hsl(175, 0%, 89%)",
                "line-dasharray": [
                    "step",
                    ["zoom"],
                    ["literal", [1, 0]],
                    15,
                    ["literal", [1.75, 1]],
                    16,
                    ["literal", [1, 0.75]],
                    17,
                    ["literal", [0.3, 0.3]]
                ]
            }
        },
        {
            "id": "tunnel-pedestrian",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "walking-cycling",
                "mapbox:group": "Walking, cycling, etc., tunnels"
            },
            "source": "composite",
            "source-layer": "road",
            "minzoom": 13,
            "filter": [
                "all",
                ["==", ["get", "structure"], "tunnel"],
                ["==", ["get", "class"], "pedestrian"],
                ["==", ["geometry-type"], "LineString"]
            ],
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    14,
                    0.5,
                    18,
                    12
                ],
                "line-color": "hsl(175, 0%, 89%)",
                "line-dasharray": [
                    "step",
                    ["zoom"],
                    ["literal", [1, 0]],
                    15,
                    ["literal", [1.5, 0.4]],
                    16,
                    ["literal", [1, 0.2]]
                ]
            }
        },
        {
            "id": "tunnel-simple",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "road-network",
                "mapbox:group": "Road network, tunnels"
            },
            "source": "composite",
            "source-layer": "road",
            "minzoom": 13,
            "filter": [
                "all",
                ["==", ["get", "structure"], "tunnel"],
                [
                    "step",
                    ["zoom"],
                    [
                        "match",
                        ["get", "class"],
                        [
                            "motorway",
                            "motorway_link",
                            "trunk",
                            "trunk_link",
                            "primary",
                            "secondary",
                            "tertiary",
                            "street",
                            "street_limited",
                            "primary_link",
                            "track"
                        ],
                        true,
                        false
                    ],
                    14,
                    [
                        "match",
                        ["get", "class"],
                        [
                            "motorway",
                            "motorway_link",
                            "trunk",
                            "trunk_link",
                            "primary",
                            "primary_link",
                            "secondary",
                            "secondary_link",
                            "tertiary",
                            "tertiary_link",
                            "street",
                            "street_limited",
                            "service",
                            "track"
                        ],
                        true,
                        false
                    ]
                ],
                ["==", ["geometry-type"], "LineString"]
            ],
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    13,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        4,
                        ["secondary", "tertiary"],
                        2.5,
                        [
                            "motorway_link",
                            "trunk_link",
                            "street",
                            "street_limited",
                            "primary_link"
                        ],
                        1,
                        0.5
                    ],
                    18,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        32,
                        ["secondary", "tertiary"],
                        26,
                        [
                            "motorway_link",
                            "trunk_link",
                            "street",
                            "street_limited",
                            "primary_link"
                        ],
                        18,
                        12
                    ]
                ],
                "line-color": "hsl(0, 13%, 87%)"
            }
        },
        {
            "id": "road-path",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "walking-cycling",
                "mapbox:group": "Walking, cycling, etc., surface"
            },
            "source": "composite",
            "source-layer": "road",
            "minzoom": 12,
            "filter": [
                "all",
                ["==", ["get", "class"], "path"],
                [
                    "step",
                    ["zoom"],
                    [
                        "!",
                        [
                            "match",
                            ["get", "type"],
                            ["steps", "sidewalk", "crossing"],
                            true,
                            false
                        ]
                    ],
                    16,
                    ["!=", ["get", "type"], "steps"]
                ],
                ["match", ["get", "structure"], ["none", "ford"], true, false],
                ["==", ["geometry-type"], "LineString"]
            ],
            "layout": {"line-join": ["step", ["zoom"], "miter", 14, "round"]},
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    13,
                    0.5,
                    14,
                    1,
                    15,
                    1,
                    18,
                    4
                ],
                "line-color": "hsl(175, 0%, 100%)",
                "line-dasharray": [
                    "step",
                    ["zoom"],
                    ["literal", [4, 0.3]],
                    15,
                    ["literal", [1.75, 0.3]],
                    16,
                    ["literal", [1, 0.3]],
                    17,
                    ["literal", [1, 0.25]]
                ]
            }
        },
        {
            "id": "road-steps",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "walking-cycling",
                "mapbox:group": "Walking, cycling, etc., surface"
            },
            "source": "composite",
            "source-layer": "road",
            "minzoom": 14,
            "filter": [
                "all",
                ["==", ["get", "type"], "steps"],
                ["match", ["get", "structure"], ["none", "ford"], true, false],
                ["==", ["geometry-type"], "LineString"]
            ],
            "layout": {"line-join": "round"},
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    15,
                    1,
                    16,
                    1.6,
                    18,
                    6
                ],
                "line-color": "hsl(175, 0%, 100%)",
                "line-dasharray": [
                    "step",
                    ["zoom"],
                    ["literal", [1, 0]],
                    15,
                    ["literal", [1.75, 1]],
                    16,
                    ["literal", [1, 0.75]],
                    17,
                    ["literal", [0.3, 0.3]]
                ]
            }
        },
        {
            "id": "road-pedestrian",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "walking-cycling",
                "mapbox:group": "Walking, cycling, etc., surface"
            },
            "source": "composite",
            "source-layer": "road",
            "minzoom": 12,
            "filter": [
                "all",
                ["==", ["get", "class"], "pedestrian"],
                ["match", ["get", "structure"], ["none", "ford"], true, false],
                ["==", ["geometry-type"], "LineString"]
            ],
            "layout": {"line-join": ["step", ["zoom"], "miter", 14, "round"]},
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    14,
                    0.5,
                    18,
                    12
                ],
                "line-color": "hsl(175, 0%, 100%)",
                "line-dasharray": [
                    "step",
                    ["zoom"],
                    ["literal", [1, 0]],
                    15,
                    ["literal", [1.5, 0.4]],
                    16,
                    ["literal", [1, 0.2]]
                ]
            }
        },
        {
            "id": "road-simple",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "road-network",
                "mapbox:group": "Road network, surface"
            },
            "source": "composite",
            "source-layer": "road",
            "minzoom": 5,
            "filter": [
                "all",
                [
                    "step",
                    ["zoom"],
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk"],
                        true,
                        false
                    ],
                    6,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        true,
                        false
                    ],
                    8,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary", "secondary"],
                        true,
                        false
                    ],
                    10,
                    [
                        "match",
                        ["get", "class"],
                        [
                            "motorway",
                            "trunk",
                            "primary",
                            "secondary",
                            "tertiary",
                            "motorway_link",
                            "trunk_link"
                        ],
                        true,
                        false
                    ],
                    11,
                    [
                        "match",
                        ["get", "class"],
                        [
                            "motorway",
                            "motorway_link",
                            "trunk",
                            "trunk_link",
                            "primary",
                            "secondary",
                            "tertiary",
                            "street"
                        ],
                        true,
                        false
                    ],
                    12,
                    [
                        "match",
                        ["get", "class"],
                        [
                            "motorway",
                            "motorway_link",
                            "trunk",
                            "trunk_link",
                            "primary",
                            "secondary",
                            "tertiary",
                            "street",
                            "street_limited",
                            "primary_link"
                        ],
                        true,
                        false
                    ],
                    13,
                    [
                        "match",
                        ["get", "class"],
                        [
                            "motorway",
                            "motorway_link",
                            "trunk",
                            "trunk_link",
                            "primary",
                            "secondary",
                            "tertiary",
                            "street",
                            "street_limited",
                            "primary_link",
                            "track"
                        ],
                        true,
                        false
                    ],
                    14,
                    [
                        "match",
                        ["get", "class"],
                        [
                            "motorway",
                            "motorway_link",
                            "trunk",
                            "trunk_link",
                            "primary",
                            "primary_link",
                            "secondary",
                            "secondary_link",
                            "tertiary",
                            "tertiary_link",
                            "street",
                            "street_limited",
                            "service",
                            "track"
                        ],
                        true,
                        false
                    ]
                ],
                ["match", ["get", "structure"], ["none", "ford"], true, false],
                ["==", ["geometry-type"], "LineString"]
            ],
            "layout": {
                "line-cap": ["step", ["zoom"], "butt", 14, "round"],
                "line-join": ["step", ["zoom"], "miter", 14, "round"]
            },
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    5,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        0.75,
                        ["secondary", "tertiary"],
                        0.1,
                        0
                    ],
                    13,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        4,
                        ["secondary", "tertiary"],
                        2.5,
                        [
                            "motorway_link",
                            "trunk_link",
                            "primary_link",
                            "street",
                            "street_limited"
                        ],
                        1,
                        0.5
                    ],
                    18,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        32,
                        ["secondary", "tertiary"],
                        26,
                        [
                            "motorway_link",
                            "trunk_link",
                            "primary_link",
                            "street",
                            "street_limited"
                        ],
                        18,
                        10
                    ]
                ],
                "line-color": [
                    "match",
                    ["get", "class"],
                    [
                        "primary_link",
                        "secondary_link",
                        "tertiary_link",
                        "street",
                        "street_limited",
                        "service",
                        "track"
                    ],
                    "hsl(0, 13%, 91%)",
                    "hsl(0, 13%, 94%)"
                ]
            }
        },
        {
            "id": "bridge-path",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "walking-cycling",
                "mapbox:group": "Walking, cycling, etc., barriers-bridges"
            },
            "source": "composite",
            "source-layer": "road",
            "minzoom": 14,
            "filter": [
                "all",
                ["==", ["get", "structure"], "bridge"],
                ["==", ["get", "class"], "path"],
                ["!=", ["get", "type"], "steps"],
                ["==", ["geometry-type"], "LineString"]
            ],
            "layout": {},
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    15,
                    1,
                    18,
                    4
                ],
                "line-color": "hsl(175, 0%, 100%)",
                "line-dasharray": [
                    "step",
                    ["zoom"],
                    ["literal", [4, 0.3]],
                    15,
                    ["literal", [1.75, 0.3]],
                    16,
                    ["literal", [1, 0.3]],
                    17,
                    ["literal", [1, 0.25]]
                ]
            }
        },
        {
            "id": "bridge-steps",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "walking-cycling",
                "mapbox:group": "Walking, cycling, etc., barriers-bridges"
            },
            "source": "composite",
            "source-layer": "road",
            "minzoom": 14,
            "filter": [
                "all",
                ["==", ["get", "type"], "steps"],
                ["==", ["get", "structure"], "bridge"],
                ["==", ["geometry-type"], "LineString"]
            ],
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    15,
                    1,
                    16,
                    1.6,
                    18,
                    6
                ],
                "line-color": "hsl(175, 0%, 100%)",
                "line-dasharray": [
                    "step",
                    ["zoom"],
                    ["literal", [1, 0]],
                    15,
                    ["literal", [1.75, 1]],
                    16,
                    ["literal", [1, 0.75]],
                    17,
                    ["literal", [0.3, 0.3]]
                ]
            }
        },
        {
            "id": "bridge-pedestrian",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "walking-cycling",
                "mapbox:group": "Walking, cycling, etc., barriers-bridges"
            },
            "source": "composite",
            "source-layer": "road",
            "minzoom": 13,
            "filter": [
                "all",
                ["==", ["get", "structure"], "bridge"],
                ["==", ["get", "class"], "pedestrian"],
                ["==", ["geometry-type"], "LineString"]
            ],
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    14,
                    0.5,
                    18,
                    12
                ],
                "line-color": "hsl(175, 0%, 100%)",
                "line-dasharray": [
                    "step",
                    ["zoom"],
                    ["literal", [1, 0]],
                    15,
                    ["literal", [1.5, 0.4]],
                    16,
                    ["literal", [1, 0.2]]
                ]
            }
        },
        {
            "id": "bridge-case-simple",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "road-network",
                "mapbox:group": "Road network, bridges"
            },
            "source": "composite",
            "source-layer": "road",
            "minzoom": 13,
            "filter": [
                "all",
                ["==", ["get", "structure"], "bridge"],
                [
                    "step",
                    ["zoom"],
                    [
                        "match",
                        ["get", "class"],
                        [
                            "motorway",
                            "motorway_link",
                            "trunk",
                            "trunk_link",
                            "primary",
                            "secondary",
                            "tertiary",
                            "street",
                            "street_limited",
                            "primary_link",
                            "track"
                        ],
                        true,
                        false
                    ],
                    14,
                    [
                        "match",
                        ["get", "class"],
                        [
                            "motorway",
                            "motorway_link",
                            "trunk",
                            "trunk_link",
                            "primary",
                            "primary_link",
                            "secondary",
                            "secondary_link",
                            "tertiary",
                            "tertiary_link",
                            "street",
                            "street_limited",
                            "service",
                            "track"
                        ],
                        true,
                        false
                    ]
                ],
                ["==", ["geometry-type"], "LineString"]
            ],
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    13,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        6,
                        ["secondary", "tertiary"],
                        4,
                        [
                            "motorway_link",
                            "trunk_link",
                            "street",
                            "street_limited",
                            "primary_link"
                        ],
                        2.5,
                        1.25
                    ],
                    18,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        36,
                        ["secondary", "tertiary"],
                        30,
                        [
                            "motorway_link",
                            "trunk_link",
                            "street",
                            "street_limited",
                            "primary_link"
                        ],
                        22,
                        16
                    ]
                ],
                "line-color": "hsl(175, 0%, 99%)"
            }
        },
        {
            "id": "bridge-simple",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "road-network",
                "mapbox:group": "Road network, bridges"
            },
            "source": "composite",
            "source-layer": "road",
            "minzoom": 13,
            "filter": [
                "all",
                ["==", ["get", "structure"], "bridge"],
                [
                    "step",
                    ["zoom"],
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk"],
                        true,
                        false
                    ],
                    13,
                    [
                        "match",
                        ["get", "class"],
                        [
                            "motorway",
                            "motorway_link",
                            "trunk",
                            "trunk_link",
                            "primary",
                            "secondary",
                            "tertiary",
                            "street",
                            "street_limited",
                            "primary_link",
                            "track"
                        ],
                        true,
                        false
                    ],
                    14,
                    [
                        "match",
                        ["get", "class"],
                        [
                            "motorway",
                            "motorway_link",
                            "trunk",
                            "trunk_link",
                            "primary",
                            "primary_link",
                            "secondary",
                            "secondary_link",
                            "tertiary",
                            "tertiary_link",
                            "street",
                            "street_limited",
                            "service",
                            "track"
                        ],
                        true,
                        false
                    ]
                ],
                ["==", ["geometry-type"], "LineString"]
            ],
            "layout": {"line-cap": ["step", ["zoom"], "butt", 14, "round"]},
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    13,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        4,
                        ["secondary", "tertiary"],
                        2.5,
                        [
                            "motorway_link",
                            "trunk_link",
                            "street",
                            "street_limited",
                            "primary_link"
                        ],
                        1,
                        0.5
                    ],
                    18,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        32,
                        ["secondary", "tertiary"],
                        26,
                        [
                            "motorway_link",
                            "trunk_link",
                            "street",
                            "street_limited",
                            "primary_link"
                        ],
                        18,
                        12
                    ]
                ],
                "line-color": [
                    "match",
                    ["get", "class"],
                    [
                        "primary_link",
                        "secondary_link",
                        "tertiary_link",
                        "street",
                        "street_limited",
                        "service",
                        "track"
                    ],
                    "hsl(0, 13%, 91%)",
                    "hsl(0, 13%, 94%)"
                ]
            }
        },
        {
            "id": "admin-1-boundary-bg",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "admin-boundaries",
                "mapbox:group": "Administrative boundaries, admin"
            },
            "source": "composite",
            "source-layer": "admin",
            "minzoom": 7,
            "filter": [
                "all",
                ["==", ["get", "admin_level"], 1],
                ["==", ["get", "maritime"], "false"],
                ["match", ["get", "worldview"], ["all", "US"], true, false]
            ],
            "paint": {
                "line-color": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    8,
                    "hsl(175, 0%, 99%)",
                    16,
                    "hsl(0, 10%, 99%)"
                ],
                "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    7,
                    3.75,
                    12,
                    5.5
                ],
                "line-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    7,
                    0,
                    8,
                    0.75
                ],
                "line-dasharray": [1, 0],
                "line-blur": ["interpolate", ["linear"], ["zoom"], 3, 0, 8, 3]
            }
        },
        {
            "id": "admin-0-boundary-bg",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "admin-boundaries",
                "mapbox:group": "Administrative boundaries, admin"
            },
            "source": "composite",
            "source-layer": "admin",
            "minzoom": 1,
            "filter": [
                "all",
                ["==", ["get", "admin_level"], 0],
                ["==", ["get", "maritime"], "false"],
                ["match", ["get", "worldview"], ["all", "US"], true, false]
            ],
            "paint": {
                "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    3,
                    3.5,
                    10,
                    8
                ],
                "line-color": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    6,
                    "hsl(175, 0%, 99%)",
                    8,
                    "hsl(0, 10%, 99%)"
                ],
                "line-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    3,
                    0,
                    4,
                    0.5
                ],
                "line-blur": ["interpolate", ["linear"], ["zoom"], 3, 0, 10, 2]
            }
        },
        {
            "id": "admin-1-boundary",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "admin-boundaries",
                "mapbox:group": "Administrative boundaries, admin"
            },
            "source": "composite",
            "source-layer": "admin",
            "minzoom": 2,
            "filter": [
                "all",
                ["==", ["get", "admin_level"], 1],
                ["==", ["get", "maritime"], "false"],
                ["match", ["get", "worldview"], ["all", "US"], true, false]
            ],
            "layout": {},
            "paint": {
                "line-dasharray": [
                    "step",
                    ["zoom"],
                    ["literal", [2, 0]],
                    7,
                    ["literal", [2, 2, 6, 2]]
                ],
                "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    7,
                    0.75,
                    12,
                    1.5
                ],
                "line-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    2,
                    0,
                    3,
                    1
                ],
                "line-color": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    3,
                    "hsl(0, 3%, 77%)",
                    7,
                    "hsl(0, 2%, 62%)"
                ]
            }
        },
        {
            "id": "admin-0-boundary",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "admin-boundaries",
                "mapbox:group": "Administrative boundaries, admin"
            },
            "source": "composite",
            "source-layer": "admin",
            "minzoom": 1,
            "filter": [
                "all",
                ["==", ["get", "admin_level"], 0],
                ["==", ["get", "disputed"], "false"],
                ["==", ["get", "maritime"], "false"],
                ["match", ["get", "worldview"], ["all", "US"], true, false]
            ],
            "layout": {},
            "paint": {
                "line-color": "hsl(0, 2%, 51%)",
                "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    3,
                    0.5,
                    10,
                    2
                ],
                "line-dasharray": [10, 0]
            }
        },
        {
            "id": "admin-0-boundary-disputed",
            "type": "line",
            "metadata": {
                "mapbox:featureComponent": "admin-boundaries",
                "mapbox:group": "Administrative boundaries, admin"
            },
            "source": "composite",
            "source-layer": "admin",
            "minzoom": 1,
            "filter": [
                "all",
                ["==", ["get", "disputed"], "true"],
                ["==", ["get", "admin_level"], 0],
                ["==", ["get", "maritime"], "false"],
                ["match", ["get", "worldview"], ["all", "US"], true, false]
            ],
            "paint": {
                "line-color": "hsl(0, 2%, 51%)",
                "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    3,
                    0.5,
                    10,
                    2
                ],
                "line-dasharray": [
                    "step",
                    ["zoom"],
                    ["literal", [3.25, 3.25]],
                    6,
                    ["literal", [2.5, 2.5]],
                    7,
                    ["literal", [2, 2.25]],
                    8,
                    ["literal", [1.75, 2]]
                ]
            }
        },
        {
            "id": "road-label-simple",
            "type": "symbol",
            "metadata": {
                "mapbox:featureComponent": "road-network",
                "mapbox:group": "Road network, road-labels"
            },
            "source": "composite",
            "source-layer": "road",
            "minzoom": 12,
            "filter": [
                "all",
                ["has", "name"],
                [
                    "match",
                    ["get", "class"],
                    [
                        "motorway",
                        "trunk",
                        "primary",
                        "secondary",
                        "tertiary",
                        "street",
                        "street_limited"
                    ],
                    true,
                    false
                ]
            ],
            "layout": {
                "text-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    10,
                    [
                        "match",
                        ["get", "class"],
                        [
                            "motorway",
                            "trunk",
                            "primary",
                            "secondary",
                            "tertiary"
                        ],
                        10,
                        9
                    ],
                    18,
                    [
                        "match",
                        ["get", "class"],
                        [
                            "motorway",
                            "trunk",
                            "primary",
                            "secondary",
                            "tertiary"
                        ],
                        16,
                        14
                    ]
                ],
                "text-max-angle": 30,
                "text-font": ["DIN Pro Regular", "Arial Unicode MS Regular"],
                "symbol-placement": "line",
                "text-padding": 1,
                "text-rotation-alignment": "map",
                "text-pitch-alignment": "viewport",
                "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
                "text-letter-spacing": 0.01
            },
            "paint": {
                "text-color": "hsl(175, 0%, 50%)",
                "text-halo-color": "hsl(0, 13%, 94%)",
                "text-halo-width": 1
            }
        },
        {
            "id": "path-pedestrian-label",
            "type": "symbol",
            "metadata": {
                "mapbox:featureComponent": "walking-cycling",
                "mapbox:group": "Walking, cycling, etc., walking-cycling-labels"
            },
            "source": "composite",
            "source-layer": "road",
            "minzoom": 12,
            "filter": [
                "step",
                ["zoom"],
                ["match", ["get", "class"], ["pedestrian"], true, false],
                15,
                ["match", ["get", "class"], ["path", "pedestrian"], true, false]
            ],
            "layout": {
                "text-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    10,
                    ["match", ["get", "class"], "pedestrian", 9, 6.5],
                    18,
                    ["match", ["get", "class"], "pedestrian", 14, 13]
                ],
                "text-max-angle": 30,
                "text-font": ["DIN Pro Regular", "Arial Unicode MS Regular"],
                "symbol-placement": "line",
                "text-padding": 1,
                "text-rotation-alignment": "map",
                "text-pitch-alignment": "viewport",
                "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
                "text-letter-spacing": 0.01
            },
            "paint": {
                "text-color": "hsl(175, 0%, 50%)",
                "text-halo-color": "hsl(175, 0%, 100%)",
                "text-halo-width": 1,
                "text-halo-blur": 1
            }
        },
        {
            "id": "waterway-label",
            "type": "symbol",
            "metadata": {
                "mapbox:featureComponent": "natural-features",
                "mapbox:group": "Natural features, natural-labels"
            },
            "source": "composite",
            "source-layer": "natural_label",
            "minzoom": 13,
            "filter": [
                "all",
                [
                    "match",
                    ["get", "class"],
                    ["canal", "river", "stream"],
                    ["match", ["get", "worldview"], ["all", "US"], true, false],
                    ["disputed_canal", "disputed_river", "disputed_stream"],
                    [
                        "all",
                        ["==", ["get", "disputed"], "true"],
                        [
                            "match",
                            ["get", "worldview"],
                            ["all", "US"],
                            true,
                            false
                        ]
                    ],
                    false
                ],
                ["==", ["geometry-type"], "LineString"]
            ],
            "layout": {
                "text-font": ["DIN Pro Italic", "Arial Unicode MS Regular"],
                "text-max-angle": 30,
                "symbol-spacing": [
                    "interpolate",
                    ["linear", 1],
                    ["zoom"],
                    15,
                    250,
                    17,
                    400
                ],
                "text-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    13,
                    12,
                    18,
                    18
                ],
                "symbol-placement": "line",
                "text-pitch-alignment": "viewport",
                "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]]
            },
            "paint": {
                "text-color": "hsl(177, 31%, 57%)",
                "text-halo-color": "hsla(175, 0%, 100%, 0.5)"
            }
        },
        {
            "id": "natural-line-label",
            "type": "symbol",
            "metadata": {
                "mapbox:featureComponent": "natural-features",
                "mapbox:group": "Natural features, natural-labels"
            },
            "source": "composite",
            "source-layer": "natural_label",
            "minzoom": 4,
            "filter": [
                "all",
                [
                    "match",
                    ["get", "class"],
                    ["glacier", "landform"],
                    ["match", ["get", "worldview"], ["all", "US"], true, false],
                    ["disputed_glacier", "disputed_landform"],
                    [
                        "all",
                        ["==", ["get", "disputed"], "true"],
                        [
                            "match",
                            ["get", "worldview"],
                            ["all", "US"],
                            true,
                            false
                        ]
                    ],
                    false
                ],
                ["<=", ["get", "filterrank"], 2],
                ["==", ["geometry-type"], "LineString"]
            ],
            "layout": {
                "text-size": [
                    "step",
                    ["zoom"],
                    ["step", ["get", "sizerank"], 18, 5, 12],
                    17,
                    ["step", ["get", "sizerank"], 18, 13, 12]
                ],
                "text-max-angle": 30,
                "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
                "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
                "symbol-placement": "line-center",
                "text-pitch-alignment": "viewport"
            },
            "paint": {
                "text-halo-width": 0.5,
                "text-halo-color": "hsl(175, 5%, 100%)",
                "text-halo-blur": 0.5,
                "text-color": [
                    "step",
                    ["zoom"],
                    [
                        "step",
                        ["get", "sizerank"],
                        "hsl(20, 0%, 65%)",
                        5,
                        "hsl(20, 2%, 55%)"
                    ],
                    17,
                    [
                        "step",
                        ["get", "sizerank"],
                        "hsl(20, 0%, 65%)",
                        13,
                        "hsl(20, 2%, 55%)"
                    ]
                ]
            }
        },
        {
            "id": "natural-point-label",
            "type": "symbol",
            "metadata": {
                "mapbox:featureComponent": "natural-features",
                "mapbox:group": "Natural features, natural-labels"
            },
            "source": "composite",
            "source-layer": "natural_label",
            "minzoom": 4,
            "filter": [
                "all",
                [
                    "match",
                    ["get", "class"],
                    ["dock", "glacier", "landform", "water_feature", "wetland"],
                    ["match", ["get", "worldview"], ["all", "US"], true, false],
                    [
                        "disputed_dock",
                        "disputed_glacier",
                        "disputed_landform",
                        "disputed_water_feature",
                        "disputed_wetland"
                    ],
                    [
                        "all",
                        ["==", ["get", "disputed"], "true"],
                        [
                            "match",
                            ["get", "worldview"],
                            ["all", "US"],
                            true,
                            false
                        ]
                    ],
                    false
                ],
                ["<=", ["get", "filterrank"], 2],
                ["==", ["geometry-type"], "Point"]
            ],
            "layout": {
                "text-size": [
                    "step",
                    ["zoom"],
                    ["step", ["get", "sizerank"], 18, 5, 12],
                    17,
                    ["step", ["get", "sizerank"], 18, 13, 12]
                ],
                "icon-image": ["get", "maki"],
                "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
                "text-offset": [
                    "step",
                    ["zoom"],
                    [
                        "step",
                        ["get", "sizerank"],
                        ["literal", [0, 0]],
                        5,
                        ["literal", [0, 0.75]]
                    ],
                    17,
                    [
                        "step",
                        ["get", "sizerank"],
                        ["literal", [0, 0]],
                        13,
                        ["literal", [0, 0.75]]
                    ]
                ],
                "text-anchor": [
                    "step",
                    ["zoom"],
                    ["step", ["get", "sizerank"], "center", 5, "top"],
                    17,
                    ["step", ["get", "sizerank"], "center", 13, "top"]
                ],
                "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]]
            },
            "paint": {
                "icon-opacity": [
                    "step",
                    ["zoom"],
                    ["step", ["get", "sizerank"], 0, 5, 1],
                    17,
                    ["step", ["get", "sizerank"], 0, 13, 1]
                ],
                "text-halo-color": "hsl(175, 5%, 100%)",
                "text-halo-width": 0.5,
                "text-halo-blur": 0.5,
                "text-color": [
                    "step",
                    ["zoom"],
                    [
                        "step",
                        ["get", "sizerank"],
                        "hsl(20, 0%, 65%)",
                        5,
                        "hsl(20, 2%, 55%)"
                    ],
                    17,
                    [
                        "step",
                        ["get", "sizerank"],
                        "hsl(20, 0%, 65%)",
                        13,
                        "hsl(20, 2%, 55%)"
                    ]
                ]
            }
        },
        {
            "id": "water-line-label",
            "type": "symbol",
            "metadata": {
                "mapbox:featureComponent": "natural-features",
                "mapbox:group": "Natural features, natural-labels"
            },
            "source": "composite",
            "source-layer": "natural_label",
            "minzoom": 1,
            "filter": [
                "all",
                [
                    "match",
                    ["get", "class"],
                    ["bay", "ocean", "reservoir", "sea", "water"],
                    ["match", ["get", "worldview"], ["all", "US"], true, false],
                    [
                        "disputed_bay",
                        "disputed_ocean",
                        "disputed_reservoir",
                        "disputed_sea",
                        "disputed_water"
                    ],
                    [
                        "all",
                        ["==", ["get", "disputed"], "true"],
                        [
                            "match",
                            ["get", "worldview"],
                            ["all", "US"],
                            true,
                            false
                        ]
                    ],
                    false
                ],
                ["==", ["geometry-type"], "LineString"]
            ],
            "layout": {
                "text-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0,
                    ["*", ["-", 16, ["sqrt", ["get", "sizerank"]]], 1],
                    22,
                    ["*", ["-", 22, ["sqrt", ["get", "sizerank"]]], 1]
                ],
                "text-max-angle": 30,
                "text-letter-spacing": [
                    "match",
                    ["get", "class"],
                    "ocean",
                    0.25,
                    ["sea", "bay"],
                    0.15,
                    0
                ],
                "text-font": ["DIN Pro Italic", "Arial Unicode MS Regular"],
                "symbol-placement": "line-center",
                "text-pitch-alignment": "viewport",
                "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]]
            },
            "paint": {
                "text-color": [
                    "match",
                    ["get", "class"],
                    ["bay", "ocean", "sea"],
                    "hsl(177, 59%, 71%)",
                    "hsl(177, 31%, 57%)"
                ],
                "text-halo-color": "hsla(175, 0%, 100%, 0.5)"
            }
        },
        {
            "id": "water-point-label",
            "type": "symbol",
            "metadata": {
                "mapbox:featureComponent": "natural-features",
                "mapbox:group": "Natural features, natural-labels"
            },
            "source": "composite",
            "source-layer": "natural_label",
            "minzoom": 1,
            "filter": [
                "all",
                [
                    "match",
                    ["get", "class"],
                    ["bay", "ocean", "reservoir", "sea", "water"],
                    ["match", ["get", "worldview"], ["all", "US"], true, false],
                    [
                        "disputed_bay",
                        "disputed_ocean",
                        "disputed_reservoir",
                        "disputed_sea",
                        "disputed_water"
                    ],
                    [
                        "all",
                        ["==", ["get", "disputed"], "true"],
                        [
                            "match",
                            ["get", "worldview"],
                            ["all", "US"],
                            true,
                            false
                        ]
                    ],
                    false
                ],
                ["==", ["geometry-type"], "Point"]
            ],
            "layout": {
                "text-line-height": 1.3,
                "text-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0,
                    ["*", ["-", 16, ["sqrt", ["get", "sizerank"]]], 1],
                    22,
                    ["*", ["-", 22, ["sqrt", ["get", "sizerank"]]], 1]
                ],
                "text-font": ["DIN Pro Italic", "Arial Unicode MS Regular"],
                "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
                "text-letter-spacing": [
                    "match",
                    ["get", "class"],
                    "ocean",
                    0.25,
                    ["bay", "sea"],
                    0.15,
                    0.01
                ],
                "text-max-width": [
                    "match",
                    ["get", "class"],
                    "ocean",
                    4,
                    "sea",
                    5,
                    ["bay", "water"],
                    7,
                    10
                ]
            },
            "paint": {
                "text-color": [
                    "match",
                    ["get", "class"],
                    ["bay", "ocean", "sea"],
                    "hsl(177, 59%, 71%)",
                    "hsl(177, 31%, 57%)"
                ],
                "text-halo-color": "hsla(175, 0%, 100%, 0.5)"
            }
        },
        {
            "id": "poi-label",
            "type": "symbol",
            "metadata": {
                "mapbox:featureComponent": "point-of-interest-labels",
                "mapbox:group": "Point of interest labels, poi-labels"
            },
            "source": "composite",
            "source-layer": "poi_label",
            "minzoom": 6,
            "filter": [
                "<=",
                ["get", "filterrank"],
                ["+", ["step", ["zoom"], 0, 16, 1, 17, 2], 2]
            ],
            "layout": {
                "text-size": [
                    "step",
                    ["zoom"],
                    ["step", ["get", "sizerank"], 18, 5, 12],
                    17,
                    ["step", ["get", "sizerank"], 18, 13, 12]
                ],
                "icon-image": [
                    "case",
                    ["has", "maki_beta"],
                    [
                        "coalesce",
                        ["image", ["get", "maki_beta"]],
                        ["image", ["get", "maki"]]
                    ],
                    ["image", ["get", "maki"]]
                ],
                "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
                "text-offset": [
                    "step",
                    ["zoom"],
                    [
                        "step",
                        ["get", "sizerank"],
                        ["literal", [0, 0]],
                        5,
                        ["literal", [0, 0.75]]
                    ],
                    17,
                    [
                        "step",
                        ["get", "sizerank"],
                        ["literal", [0, 0]],
                        13,
                        ["literal", [0, 0.75]]
                    ]
                ],
                "text-anchor": [
                    "step",
                    ["zoom"],
                    ["step", ["get", "sizerank"], "center", 5, "top"],
                    17,
                    ["step", ["get", "sizerank"], "center", 13, "top"]
                ],
                "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]]
            },
            "paint": {
                "icon-opacity": [
                    "step",
                    ["zoom"],
                    ["step", ["get", "sizerank"], 0, 5, 1],
                    17,
                    ["step", ["get", "sizerank"], 0, 13, 1]
                ],
                "text-halo-color": [
                    "match",
                    ["get", "class"],
                    "park_like",
                    "hsl(127, 15%, 100%)",
                    "hsl(175, 5%, 100%)"
                ],
                "text-halo-width": 0.5,
                "text-halo-blur": 0.5,
                "text-color": [
                    "step",
                    ["zoom"],
                    [
                        "step",
                        ["get", "sizerank"],
                        [
                            "match",
                            ["get", "class"],
                            "food_and_drink",
                            "hsl(14, 2%, 78%)",
                            "park_like",
                            "hsl(128, 13%, 57%)",
                            "hsl(20, 0%, 65%)"
                        ],
                        5,
                        [
                            "match",
                            ["get", "class"],
                            "food_and_drink",
                            "hsl(14, 4%, 61%)",
                            "park_like",
                            "hsl(128, 12%, 46%)",
                            "hsl(20, 2%, 55%)"
                        ]
                    ],
                    17,
                    [
                        "step",
                        ["get", "sizerank"],
                        [
                            "match",
                            ["get", "class"],
                            "food_and_drink",
                            "hsl(14, 2%, 78%)",
                            "park_like",
                            "hsl(128, 13%, 57%)",
                            "hsl(20, 0%, 65%)"
                        ],
                        13,
                        [
                            "match",
                            ["get", "class"],
                            "food_and_drink",
                            "hsl(14, 4%, 61%)",
                            "park_like",
                            "hsl(128, 12%, 46%)",
                            "hsl(20, 2%, 55%)"
                        ]
                    ]
                ]
            }
        },
        {
            "id": "airport-label",
            "type": "symbol",
            "metadata": {
                "mapbox:featureComponent": "transit",
                "mapbox:group": "Transit, transit-labels"
            },
            "source": "composite",
            "source-layer": "airport_label",
            "minzoom": 8,
            "filter": [
                "match",
                ["get", "class"],
                ["military", "civil"],
                ["match", ["get", "worldview"], ["all", "US"], true, false],
                ["disputed_military", "disputed_civil"],
                [
                    "all",
                    ["==", ["get", "disputed"], "true"],
                    ["match", ["get", "worldview"], ["all", "US"], true, false]
                ],
                false
            ],
            "layout": {
                "text-line-height": 1.1,
                "text-size": ["step", ["get", "sizerank"], 18, 9, 12],
                "icon-image": ["get", "maki"],
                "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
                "text-offset": [0, 0.75],
                "text-rotation-alignment": "viewport",
                "text-anchor": "top",
                "text-field": [
                    "step",
                    ["get", "sizerank"],
                    ["coalesce", ["get", "name_en"], ["get", "name"]],
                    15,
                    ["get", "ref"]
                ],
                "text-letter-spacing": 0.01,
                "text-max-width": 9
            },
            "paint": {
                "text-color": "hsl(345, 3%, 70%)",
                "text-halo-color": "hsl(345, 20%, 100%)",
                "text-halo-width": 1
            }
        },
        {
            "id": "settlement-subdivision-label",
            "type": "symbol",
            "metadata": {
                "mapbox:featureComponent": "place-labels",
                "mapbox:group": "Place labels, place-labels"
            },
            "source": "composite",
            "source-layer": "place_label",
            "minzoom": 10,
            "maxzoom": 15,
            "filter": [
                "all",
                [
                    "match",
                    ["get", "class"],
                    "settlement_subdivision",
                    ["match", ["get", "worldview"], ["all", "US"], true, false],
                    "disputed_settlement_subdivision",
                    [
                        "all",
                        ["==", ["get", "disputed"], "true"],
                        [
                            "match",
                            ["get", "worldview"],
                            ["all", "US"],
                            true,
                            false
                        ]
                    ],
                    false
                ],
                ["<=", ["get", "filterrank"], 3]
            ],
            "layout": {
                "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
                "text-transform": "uppercase",
                "text-font": ["DIN Pro Regular", "Arial Unicode MS Regular"],
                "text-letter-spacing": [
                    "match",
                    ["get", "type"],
                    "suburb",
                    0.15,
                    0.1
                ],
                "text-max-width": 7,
                "text-padding": 3,
                "text-size": [
                    "interpolate",
                    ["cubic-bezier", 0.5, 0, 1, 1],
                    ["zoom"],
                    11,
                    ["match", ["get", "type"], "suburb", 11, 10.5],
                    15,
                    ["match", ["get", "type"], "suburb", 15, 14]
                ]
            },
            "paint": {
                "text-halo-color": "hsla(175, 5%, 100%, 0.75)",
                "text-halo-width": 1,
                "text-color": "hsl(0, 6%, 60%)",
                "text-halo-blur": 0.5
            }
        },
        {
            "id": "settlement-minor-label",
            "type": "symbol",
            "metadata": {
                "mapbox:featureComponent": "place-labels",
                "mapbox:group": "Place labels, place-labels"
            },
            "source": "composite",
            "source-layer": "place_label",
            "minzoom": 2,
            "maxzoom": 13,
            "filter": [
                "all",
                ["<=", ["get", "filterrank"], 3],
                [
                    "match",
                    ["get", "class"],
                    "settlement",
                    ["match", ["get", "worldview"], ["all", "US"], true, false],
                    "disputed_settlement",
                    [
                        "all",
                        ["==", ["get", "disputed"], "true"],
                        [
                            "match",
                            ["get", "worldview"],
                            ["all", "US"],
                            true,
                            false
                        ]
                    ],
                    false
                ],
                [
                    "step",
                    ["zoom"],
                    [">", ["get", "symbolrank"], 6],
                    4,
                    [">=", ["get", "symbolrank"], 7],
                    6,
                    [">=", ["get", "symbolrank"], 8],
                    7,
                    [">=", ["get", "symbolrank"], 10],
                    10,
                    [">=", ["get", "symbolrank"], 11],
                    11,
                    [">=", ["get", "symbolrank"], 13],
                    12,
                    [">=", ["get", "symbolrank"], 15]
                ]
            ],
            "layout": {
                "icon-image": "",
                "text-font": ["DIN Pro Regular", "Arial Unicode MS Regular"],
                "text-radial-offset": [
                    "step",
                    ["zoom"],
                    ["match", ["get", "capital"], 2, 0.6, 0.55],
                    8,
                    0
                ],
                "text-anchor": ["step", ["zoom"], "center", 8, "center"],
                "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
                "text-max-width": 7,
                "text-line-height": 1.1,
                "text-size": [
                    "interpolate",
                    ["cubic-bezier", 0.2, 0, 0.9, 1],
                    ["zoom"],
                    3,
                    [
                        "step",
                        ["get", "symbolrank"],
                        12,
                        9,
                        11,
                        10,
                        10.5,
                        12,
                        9.5,
                        14,
                        8.5,
                        16,
                        6.5,
                        17,
                        4
                    ],
                    13,
                    [
                        "step",
                        ["get", "symbolrank"],
                        23,
                        9,
                        21,
                        10,
                        19,
                        11,
                        17,
                        12,
                        16,
                        13,
                        15,
                        15,
                        13
                    ]
                ]
            },
            "paint": {
                "text-color": "hsl(0, 6%, 45%)",
                "text-halo-color": "hsl(175, 5%, 100%)",
                "text-halo-width": 1,
                "icon-opacity": ["step", ["zoom"], 1, 8, 0],
                "text-halo-blur": 1
            }
        },
        {
            "id": "settlement-major-label",
            "type": "symbol",
            "metadata": {
                "mapbox:featureComponent": "place-labels",
                "mapbox:group": "Place labels, place-labels"
            },
            "source": "composite",
            "source-layer": "place_label",
            "minzoom": 2,
            "maxzoom": 15,
            "filter": [
                "all",
                ["<=", ["get", "filterrank"], 3],
                [
                    "match",
                    ["get", "class"],
                    "settlement",
                    ["match", ["get", "worldview"], ["all", "US"], true, false],
                    "disputed_settlement",
                    [
                        "all",
                        ["==", ["get", "disputed"], "true"],
                        [
                            "match",
                            ["get", "worldview"],
                            ["all", "US"],
                            true,
                            false
                        ]
                    ],
                    false
                ],
                [
                    "step",
                    ["zoom"],
                    false,
                    2,
                    ["<=", ["get", "symbolrank"], 6],
                    4,
                    ["<", ["get", "symbolrank"], 7],
                    6,
                    ["<", ["get", "symbolrank"], 8],
                    7,
                    ["<", ["get", "symbolrank"], 10],
                    10,
                    ["<", ["get", "symbolrank"], 11],
                    11,
                    ["<", ["get", "symbolrank"], 13],
                    12,
                    ["<", ["get", "symbolrank"], 15],
                    13,
                    [">=", ["get", "symbolrank"], 11],
                    14,
                    [">=", ["get", "symbolrank"], 15]
                ]
            ],
            "layout": {
                "icon-image": "",
                "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
                "text-radial-offset": [
                    "step",
                    ["zoom"],
                    ["match", ["get", "capital"], 2, 0.6, 0.55],
                    8,
                    0
                ],
                "text-anchor": ["step", ["zoom"], "center", 8, "center"],
                "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
                "text-max-width": 7,
                "text-line-height": 1.1,
                "text-size": [
                    "interpolate",
                    ["cubic-bezier", 0.2, 0, 0.9, 1],
                    ["zoom"],
                    3,
                    ["step", ["get", "symbolrank"], 13, 6, 12],
                    6,
                    ["step", ["get", "symbolrank"], 16, 6, 15, 7, 14],
                    8,
                    ["step", ["get", "symbolrank"], 18, 9, 17, 10, 15],
                    15,
                    [
                        "step",
                        ["get", "symbolrank"],
                        23,
                        9,
                        22,
                        10,
                        20,
                        11,
                        18,
                        12,
                        16,
                        13,
                        15,
                        15,
                        13
                    ]
                ]
            },
            "paint": {
                "text-color": "hsl(0, 6%, 45%)",
                "text-halo-color": "hsl(175, 5%, 100%)",
                "text-halo-width": 1,
                "icon-opacity": ["step", ["zoom"], 1, 8, 0],
                "text-halo-blur": 1
            }
        },
        {
            "id": "state-label",
            "type": "symbol",
            "metadata": {
                "mapbox:featureComponent": "place-labels",
                "mapbox:group": "Place labels, place-labels"
            },
            "source": "composite",
            "source-layer": "place_label",
            "minzoom": 3,
            "maxzoom": 9,
            "filter": [
                "match",
                ["get", "class"],
                "state",
                ["match", ["get", "worldview"], ["all", "US"], true, false],
                "disputed_state",
                [
                    "all",
                    ["==", ["get", "disputed"], "true"],
                    ["match", ["get", "worldview"], ["all", "US"], true, false]
                ],
                false
            ],
            "layout": {
                "text-size": [
                    "interpolate",
                    ["cubic-bezier", 0.85, 0.7, 0.65, 1],
                    ["zoom"],
                    4,
                    ["step", ["get", "symbolrank"], 10, 6, 9.5, 7, 9],
                    9,
                    ["step", ["get", "symbolrank"], 21, 6, 16, 7, 13]
                ],
                "text-transform": "uppercase",
                "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
                "text-field": [
                    "step",
                    ["zoom"],
                    [
                        "step",
                        ["get", "symbolrank"],
                        ["coalesce", ["get", "name_en"], ["get", "name"]],
                        5,
                        [
                            "coalesce",
                            ["get", "abbr"],
                            ["get", "name_en"],
                            ["get", "name"]
                        ]
                    ],
                    5,
                    ["coalesce", ["get", "name_en"], ["get", "name"]]
                ],
                "text-letter-spacing": 0.15,
                "text-max-width": 6
            },
            "paint": {
                "text-color": "hsl(0, 6%, 45%)",
                "text-halo-color": "hsl(175, 5%, 100%)",
                "text-halo-width": 1
            }
        },
        {
            "id": "country-label",
            "type": "symbol",
            "metadata": {
                "mapbox:featureComponent": "place-labels",
                "mapbox:group": "Place labels, place-labels"
            },
            "source": "composite",
            "source-layer": "place_label",
            "minzoom": 1,
            "maxzoom": 10,
            "filter": [
                "match",
                ["get", "class"],
                "country",
                ["match", ["get", "worldview"], ["all", "US"], true, false],
                "disputed_country",
                [
                    "all",
                    ["==", ["get", "disputed"], "true"],
                    ["match", ["get", "worldview"], ["all", "US"], true, false]
                ],
                false
            ],
            "layout": {
                "icon-image": "",
                "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
                "text-line-height": 1.1,
                "text-max-width": 6,
                "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
                "text-radial-offset": ["step", ["zoom"], 0.6, 8, 0],
                "text-size": [
                    "interpolate",
                    ["cubic-bezier", 0.2, 0, 0.7, 1],
                    ["zoom"],
                    1,
                    ["step", ["get", "symbolrank"], 11, 4, 9, 5, 8],
                    9,
                    ["step", ["get", "symbolrank"], 22, 4, 19, 5, 17]
                ]
            },
            "paint": {
                "icon-opacity": [
                    "step",
                    ["zoom"],
                    ["case", ["has", "text_anchor"], 1, 0],
                    7,
                    0
                ],
                "text-color": "hsl(0, 6%, 45%)",
                "text-halo-color": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    2,
                    "hsla(175, 5%, 100%, 0.75)",
                    3,
                    "hsl(175, 5%, 100%)"
                ],
                "text-halo-width": 1.25
            }
        },
        {
            "id": "continent-label",
            "type": "symbol",
            "metadata": {
                "mapbox:featureComponent": "place-labels",
                "mapbox:group": "Place labels, place-labels"
            },
            "source": "composite",
            "source-layer": "natural_label",
            "minzoom": 0.75,
            "maxzoom": 3,
            "filter": ["==", ["get", "class"], "continent"],
            "layout": {
                "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
                "text-line-height": 1.1,
                "text-max-width": 6,
                "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
                "text-size": [
                    "interpolate",
                    ["exponential", 0.5],
                    ["zoom"],
                    0,
                    10,
                    2.5,
                    15
                ],
                "text-transform": "uppercase",
                "text-letter-spacing": 0.05
            },
            "paint": {
                "text-color": "hsl(0, 6%, 45%)",
                "text-halo-color": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0,
                    "hsla(175, 5%, 100%, 0.75)",
                    3,
                    "hsl(175, 5%, 100%)"
                ],
                "text-halo-width": 1.5,
                "text-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0,
                    0.8,
                    1.5,
                    0.5,
                    2.5,
                    0
                ]
            }
        }
    ],
    "created": "2022-09-16T06:44:04.433Z",
    "modified": "2022-09-16T06:46:24.263Z",
    "id": "cl8447n3p002r14p8dbok9e6f",
    "owner": "vsir743",
    "visibility": "private",
    "protected": false,
    "draft": true
}