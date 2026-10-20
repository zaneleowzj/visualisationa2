const topArtistsContainer = document.getElementById(
    "top-artists-chart"
);

if (!topArtistsContainer) {
    console.error(
        'Cannot find "#top-artists-chart".'
    );
} else {

    const topArtistsSpec = {
        $schema: "https://vega.github.io/schema/vega-lite/v6.json",

        data: {
            url: "../data/QAGOMA_TOP_15_ARTISTS_BY_WORKS_WITH_GENDER.csv",
            format: {
                type: "csv"
            }
        },

        width: "container",

        height: {
            step: 27
        },

        title: {
            text: "Top 15 Artists by Recorded Works",
            subtitle: "Ranked by distinct accession numbers",
            anchor: "start",
            fontSize: 18,
            subtitleFontSize: 12,
            color: "#252821",
            offset: 15
        },

        mark: {
            type: "bar",
            cornerRadiusEnd: 4,
            tooltip: true
        },

        encoding: {
            y: {
                field: "artist",
                type: "nominal",
                sort: {
                    field: "works",
                    order: "descending"
                },
                title: null,
                axis: {
                    labelFontSize: 11,
                    labelLimit: 220,
                    labelColor: "#55574f",
                    domain: false,
                    tickSize: 0
                }
            },

            x: {
                field: "works",
                type: "quantitative",
                title: "Number of recorded works",
                scale: {
                    zero: true
                },
                axis: {
                    tickCount: 5,
                    format: ",",
                    labelColor: "#55574f",
                    titleColor: "#252821",
                    gridColor: "#e8e4df",
                    domain: false,
                    tickSize: 0
                }
            },

            color: {
                field: "gender",
                type: "nominal",
                scale: {
                    domain: ["Male", "Female"],
                    range: ["#3777C8", "#E88BB5"]
                },
                legend: {
                    title: "Artist gender",
                    orient: "top",
                    direction: "horizontal",
                    labelFontSize: 12,
                    titleFontSize: 12
                }
            },

            tooltip: [
                {
                    field: "rank",
                    type: "ordinal",
                    title: "Rank"
                },
                {
                    field: "artist",
                    type: "nominal",
                    title: "Artist"
                },
                {
                    field: "works",
                    type: "quantitative",
                    title: "Distinct accession numbers",
                    format: ",.0f"
                },
                {
                    field: "gender",
                    type: "nominal",
                    title: "Gender"
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

    vegaEmbed("#top-artists-chart", topArtistsSpec, {
        actions: false,
        renderer: "svg"
    })
    .then(function () {
        console.log(
            "Top artists chart loaded successfully."
        );
    })
    .catch(function (error) {
        console.error(
            "Top artists chart failed:",
            error
        );

        topArtistsContainer.innerHTML =
            '<p style="color:#b91c1c;">' +
            "Unable to load the chart. Check the CSV path " +
            "and browser console." +
            "</p>";
    });
}