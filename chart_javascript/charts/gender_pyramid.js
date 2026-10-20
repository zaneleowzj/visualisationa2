const genderContainer = document.getElementById(
    "gender-decade-chart"
);

if (!genderContainer) {
    console.error(
        'Cannot find "#gender-decade-chart".'
    );
} else {

    const genderPyramidSpec = {
        $schema: "https://vega.github.io/schema/vega-lite/v6.json",

        data: {
            url: "../data/DAAO_Gender_By_Career_Decade.csv",
            format: { type: "csv" }
        },

        transform: [
            {
                fold: ["Male", "Female"],
                as: ["gender", "artist_count"]
            },
            {
                calculate:
                    "datum.gender === 'Male' ? -toNumber(datum.artist_count) : toNumber(datum.artist_count)",
                as: "signed_count"
            },
            {
                calculate:
                    "datum.total_male_female > 0 ? toNumber(datum.artist_count) / toNumber(datum.total_male_female) * 100 : 0",
                as: "percentage"
            }
        ],

        width: "container",
        height: 360,

        title: {
            text: "Gender Distribution by Career-Start Decade",
            subtitle:
                "Male biographies on the left, female biographies on the right",
            anchor: "start",
            fontSize: 18,
            subtitleFontSize: 12,
            color: "#252821",
            offset: 16
        },

        mark: {
            type: "bar",
            tooltip: true,
            height: {
                band: 0.75
            }
        },

        encoding: {
            y: {
                field: "career_start_decade",
                type: "ordinal",
                title: "Career-start decade",
                sort: "descending",
                axis: {
                    labelFontSize: 11,
                    labelColor: "#55574f",
                    titleFontSize: 12,
                    titleColor: "#252821",
                    domain: false,
                    tickSize: 0
                }
            },

            x: {
                field: "signed_count",
                type: "quantitative",
                title: "Number of artist biographies",
                scale: {
                    domain: [-300, 300]
                },
                axis: {
                    values: [-300, -200, -100, 0, 100, 200, 300],
                    labelExpr: "abs(datum.value)",
                    labelColor: "#55574f",
                    titleColor: "#252821",
                    grid: true,
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
                    title: "Gender",
                    orient: "top",
                    labelFontSize: 12
                }
            },

            order: {
                field: "gender",
                sort: ["Male", "Female"]
            },

            tooltip: [
                {
                    field: "career_start_decade",
                    type: "ordinal",
                    title: "Career-start decade"
                },
                {
                    field: "gender",
                    type: "nominal",
                    title: "Gender"
                },
                {
                    field: "artist_count",
                    type: "quantitative",
                    title: "Artist biographies",
                    format: ",.0f"
                },
                {
                    field: "percentage",
                    type: "quantitative",
                    title: "Share within decade",
                    format: ".1f"
                },
                {
                    field: "total_male_female",
                    type: "quantitative",
                    title: "Total male/female records",
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

    vegaEmbed("#gender-decade-chart", genderPyramidSpec, {
        actions: false,
        renderer: "svg"
    })
    .then(function () {
        console.log(
            "Gender population pyramid loaded successfully."
        );
    })
    .catch(function (error) {
        console.error(
            "Gender population pyramid failed:",
            error
        );

        genderContainer.innerHTML =
            '<p style="color:#b91c1c;">' +
            "Chart failed to load. Check the CSV path " +
            "and browser console." +
            "</p>";
    });
}