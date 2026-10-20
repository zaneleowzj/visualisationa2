const creatorOriginDonutSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v6.json",

    "description":
        "Creator country association in the selected QAGOMA Australian-art dataset.",

    "data": {
        "values": [
            {
                "CreatorOriginCategory": "Australian-associated",
                "ArtworkRecords": 5606,
                "SharePercent": 88.69
            },
            {
                "CreatorOriginCategory": "Mixed / multi-country",
                "ArtworkRecords": 552,
                "SharePercent": 8.73
            },
            {
                "CreatorOriginCategory": "Unknown / unclassified",
                "ArtworkRecords": 160,
                "SharePercent": 2.53
            },
            {
                "CreatorOriginCategory": "International-associated",
                "ArtworkRecords": 3,
                "SharePercent": 0.05
            }
        ]
    },

    "width": 320,
    "height": 300,

    "mark": {
        "type": "arc",
        "innerRadius": 75,
        "outerRadius": 115,
        "stroke": "#ffffff",
        "strokeWidth": 2,
        "cursor": "pointer"
    },

    "encoding": {
        "theta": {
            "field": "ArtworkRecords",
            "type": "quantitative",
            "stack": true
        },

        "color": {
            "field": "CreatorOriginCategory",
            "type": "nominal",
            "title": "Creator country association",

            "scale": {
                "domain": [
                    "Australian-associated",
                    "Mixed / multi-country",
                    "Unknown / unclassified",
                    "International-associated"
                ],

                "range": [
                    "#985a3e",
                    "#d8a58c",
                    "#b9b8ad",
                    "#6f8972"
                ]
            },

            "legend": {
                "orient": "bottom",
                "direction": "horizontal",
                "columns": 2,
                "title": null,
                "labelFontSize": 11,
                "labelLimit": 180,
                "symbolType": "circle",
                "symbolSize": 90
            }
        },

        "order": {
            "field": "ArtworkRecords",
            "type": "quantitative",
            "sort": "descending"
        },

        "tooltip": [
            {
                "field": "CreatorOriginCategory",
                "type": "nominal",
                "title": "Classification"
            },
            {
                "field": "ArtworkRecords",
                "type": "quantitative",
                "title": "Artwork records",
                "format": ","
            },
            {
                "field": "SharePercent",
                "type": "quantitative",
                "title": "Share of records",
                "format": ".2f"
            }
        ]
    },

    "config": {
        "background": "white",

        "view": {
            "stroke": null
        },

        "legend": {
            "labelColor": "#302e29",
            "titleColor": "#302e29"
        }
    }
};

vegaEmbed("#creator-origin-donut", creatorOriginDonutSpec, {
    actions: false,
    renderer: "svg"
})
.then(() => {
    console.log("Creator country donut chart loaded successfully.");
})
.catch(error => {
    console.error("Creator country donut chart error:", error);

    const container = document.getElementById("creator-origin-donut");

    if (container) {
        container.innerHTML =
            "<p>Unable to load the chart. Check the browser console.</p>";
    }
});