const artFormStackedBarContainer = document.getElementById(
    "art-form-stacked-bar"
);

if (!artFormStackedBarContainer) {
    console.error(
        'Cannot find element "#art-form-stacked-bar".'
    );
} else {

    const artFormStackedBarSpec = {
        $schema: "https://vega.github.io/schema/vega-lite/v6.json",

        width: "container",
        height: 400,

        autosize: {
            type: "fit",
            contains: "padding"
        },

        background: "#ffffff",

        title: {
            text: "Artwork Category Composition by Decade",
            subtitle: "Percentage of artwork records within each creation decade",
            anchor: "start",
            font: "Arial",
            fontSize: 18,
            subtitleFontSize: 12,
            color: "#252821",
            offset: 12
        },

        data: {
            url: "../data/art_form_by_decade.csv",
            format: {
                type: "csv"
            }
        },

        transform: [
            {
                calculate: "toNumber(datum.CreationDecade)",
                as: "Decade"
            },
            {
                calculate: "toNumber(datum.ArtworkRecordCount)",
                as: "RecordCount"
            },
            {
                calculate: "toNumber(datum.SharePercent)",
                as: "Share"
            },
            {
                calculate: "toNumber(datum.DecadeTotal)",
                as: "TotalRecords"
            }
        ],

        mark: {
            type: "bar",
            stroke: "#ffffff",
            strokeWidth: 0.4,
            tooltip: true
        },

        encoding: {
            x: {
                field: "Decade",
                type: "ordinal",
                sort: "ascending",
                title: "Creation decade",
                axis: {
                    labelAngle: -45,
                    labelFontSize: 10,
                    titleFontSize: 12,
                    grid: false,
                    labelOverlap: false
                }
            },

            y: {
                field: "RecordCount",
                type: "quantitative",
                stack: "normalize",
                title: "Share of artwork records",
                scale: {
                    domain: [0, 1]
                },
                axis: {
                    format: ".0%",
                    values: [0, 0.25, 0.5, 0.75, 1],
                    titleFontSize: 12,
                    gridColor: "#e8e4df"
                }
            },

            color: {
                field: "PhysicalCategoryGroup",
                type: "nominal",
                title: "Artwork category",
                scale: {
                    domain: [
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
                    range: [
                        "#985a3e",
                        "#d8a58c",
                        "#6f8972",
                        "#7b83a8",
                        "#d6b85a",
                        "#9b7296",
                        "#6caaa3",
                        "#a5a5a5",
                        "#c9a88c"
                    ]
                },
                legend: {
                    orient: "bottom",
                    direction: "horizontal",
                    columns: 3,
                    titleFontSize: 12,
                    labelFontSize: 10,
                    labelLimit: 180,
                    symbolType: "square",
                    symbolSize: 100
                }
            },

            order: {
                field: "PhysicalCategoryGroup",
                sort: [
                    "Painting",
                    "Print",
                    "Photograph",
                    "Drawing",
                    "Ceramic",
                    "Sculpture",
                    "Fibre",
                    "Artefact",
                    "Other / less common"
                ]
            },

            tooltip: [
                {
                    field: "DecadeLabel",
                    type: "nominal",
                    title: "Creation decade"
                },
                {
                    field: "PhysicalCategoryGroup",
                    type: "nominal",
                    title: "Artwork category"
                },
                {
                    field: "RecordCount",
                    type: "quantitative",
                    title: "Artwork records",
                    format: ","
                },
                {
                    field: "Share",
                    type: "quantitative",
                    title: "Prepared share",
                    format: ".2f"
                },
                {
                    field: "TotalRecords",
                    type: "quantitative",
                    title: "Total records in decade",
                    format: ","
                }
            ]
        },

        config: {
            view: {
                stroke: null
            },
            axis: {
                labelColor: "#686b63",
                titleColor: "#302e29",
                labelFont: "Arial",
                titleFont: "Arial"
            },
            legend: {
                labelColor: "#302e29",
                titleColor: "#302e29"
            }
        }
    };

    vegaEmbed(
        artFormStackedBarContainer,
        artFormStackedBarSpec,
        {
            actions: false,
            renderer: "svg"
        }
    )
    .then(function () {
        console.log(
            "100% stacked bar chart loaded successfully."
        );
    })
    .catch(function (error) {
        console.error(
            "100% stacked bar chart failed:",
            error
        );

        artFormStackedBarContainer.innerHTML =
            '<p style="color:#b91c1c;">' +
            "Unable to load the chart. Check the CSV path " +
            "and browser console." +
            "</p>";
    });
}