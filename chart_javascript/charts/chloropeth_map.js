const choroplethContainer = document.getElementById(
    "choropleth_map"
);

if (!choroplethContainer) {
    console.error('Cannot find element "#choropleth_map".');
} else {

    const choroplethSpec = {
        $schema: "https://vega.github.io/schema/vega-lite/v6.json",

        width: 700,
        height: 480,
        background: "#ffffff",
        padding: 10,

        title: {
            text: "How Are Mapped Artworks Distributed Across Australia?",
            subtitle: "Mapped artwork records by state and territory in the selected QAGOMA dataset",
            anchor: "start",
            font: "Arial",
            fontSize: 17,
            subtitleFont: "Arial",
            subtitleFontSize: 11,
            color: "#252821",
            offset: 12
        },

        data: {
            url: "../data/australia_states_fixed.geojson",
            format: {
                type: "json",
                property: "features"
            }
        },

        transform: [
            {
                calculate: "datum.properties.state_name || datum.properties.STATE_NAME",
                as: "State"
            },
            {
                lookup: "State",
                from: {
                    data: {
                        url: "../data/chloropleth_total_map.csv",
                        format: {
                            type: "csv",
                            parse: {
                                "Mapped_Artwork_Count": "number"
                            }
                        }
                    },
                    key: "State/Territory",
                    fields: ["Mapped_Artwork_Count"]
                },
                as: ["ArtworkCount"]
            }
        ],

        // Use the identity projection with vertical reflection.
        projection: {
            type: "identity",
            reflectY: true,
            fit: {
                signal: "data('source_0')"
            }
        },

        mark: {
            type: "geoshape",
            stroke: "#555555",
            strokeWidth: 0.8
        },

        encoding: {
            color: {
                condition: {
                    test: "isValid(datum.ArtworkCount)",
                    field: "ArtworkCount",
                    type: "quantitative",
                    scale: {
                        type: "sqrt",
                        domain: [0, 3086],
                        range: ["#deebf7", "#08519c"],
                        clamp: true
                    },
                    legend: {
                        orient: "right",
                        title: "Artwork records",
                        format: ",.0f",
                        gradientLength: 200,
                        gradientThickness: 14,
                        titleFontSize: 11,
                        labelFontSize: 10
                    }
                },
                value: "#d1d5db"
            },

            tooltip: [
                {
                    field: "State",
                    type: "nominal",
                    title: "State / Territory"
                },
                {
                    field: "ArtworkCount",
                    type: "quantitative",
                    title: "Mapped artwork records",
                    format: ",.0f"
                }
            ]
        },

        config: {
            background: "#ffffff",
            view: {
                stroke: null
            },
            axis: {
                labelFont: "Arial",
                titleFont: "Arial"
            }
        }
    };

    vegaEmbed(choroplethContainer, choroplethSpec, {
        actions: false,
        renderer: "svg"
    })
    .then(function (result) {
        console.log("Choropleth loaded.");

        const features = result.view.data("source_0") || [];

        console.table(
            features.map(function (d) {
                return {
                    GeoJSON_State:
                        d.properties?.state_name ||
                        d.properties?.STATE_NAME,
                    State: d.State,
                    ArtworkCount: d.ArtworkCount
                };
            })
        );
    })
    .catch(function (error) {
        console.error("Choropleth failed:", error);
    });
}