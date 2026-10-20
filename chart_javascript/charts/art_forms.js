const artFormsSmallMultiplesSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v6.json",

    "data": {
        "url": "../data/art_form_by_decade.csv",
        "format": {
            "type": "csv"
        }
    },
    /* transform used to convert text values into numbers */
    "transform": [
        {
            "calculate": "toNumber(datum.CreationDecade)",
            "as": "Decade"
        },
        {
            "calculate": "toNumber(datum.SharePercent)",
            "as": "Share"
        },
        {
            "calculate": "toNumber(datum.ArtworkRecordCount)",
            "as": "RecordCount"
        },
        {
            "calculate": "toNumber(datum.DecadeTotal)",
            "as": "TotalRecords"
        }
    ],
    /* Facet to sort in accordance to the one line per chart visualisation */
    "facet": {
        "field": "PhysicalCategoryGroup",
        "type": "nominal",
        "title": null,
        "sort": [
            "Painting",
            "Print",
            "Photograph",
            "Drawing",
            "Ceramic",
            "Sculpture",
            "Fibre",
            "Artefact",
            "Other / less common"
        ],
        "header": {
            "labelFontSize": 13,
            "labelFontWeight": "bold",
            "labelColor": "#302e29",
            "labelPadding": 8
        }
    },

    "columns": 3,

    "spec": {
        "width": 230,
        "height": 145,

        "mark": {
            "type": "line",
            "color": "#985a3e",
            "strokeWidth": 2.2,
            "point": {
                "filled": true,
                "size": 22,
                "color": "#985a3e"
            }
        },

        "encoding": {
            "x": {
                "field": "Decade",
                "type": "quantitative",
                "title": "Creation decade",
                "scale": {
                    "zero": false
                },
                "axis": {
                    "format": "d",
                    "tickCount": 4,
                    "labelFontSize": 9,
                    "titleFontSize": 10,
                    "grid": false
                }
            },

            "y": {
                "field": "Share",
                "type": "quantitative",
                "title": "Share (%)",
                "scale": {
                    "domain": [0, 100]
                },
                "axis": {
                    "values": [0, 50, 100],
                    "labelExpr": "datum.value + '%'",
                    "labelFontSize": 9,
                    "titleFontSize": 10,
                    "gridColor": "#e8e4df"
                }
            },

            "order": {
                "field": "Decade",
                "type": "quantitative",
                "sort": "ascending"
            },

            "tooltip": [
                {
                    "field": "DecadeLabel",
                    "type": "nominal",
                    "title": "Creation decade"
                },
                {
                    "field": "PhysicalCategoryGroup",
                    "type": "nominal",
                    "title": "Art form"
                },
                {
                    "field": "RecordCount",
                    "type": "quantitative",
                    "title": "Artwork records",
                    "format": ","
                },
                {
                    "field": "Share",
                    "type": "quantitative",
                    "title": "Share of decade",
                    "format": ".2f"
                },
                {
                    "field": "TotalRecords",
                    "type": "quantitative",
                    "title": "Total records in decade",
                    "format": ","
                }
            ]
        }
    },

    "resolve": {
        "scale": {
            "y": "shared"
        }
    },

    "config": {
        "view": {
            "stroke": "#e6ded5"
        },

        "facet": {
            "spacing": 18
        },

        "axis": {
            "labelColor": "#686b63",
            "titleColor": "#302e29"
        }
    }
};

vegaEmbed("#art-forms-line-chart", artFormsSmallMultiplesSpec, {
    actions: false,
    renderer: "svg"
})
