const publicArtWaffleSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v6.json",

    width: 330,
    height: 330,
    background: "#F7F5F0",

    data: {
        url: "../data/melbourne_public_art_cleaned.csv",
        format: {
            type: "csv"
        }
    },

    transform: [
        // Keep only the three categories used in the chart.
        {
            filter: "datum.AssetType === 'Art' || datum.AssetType === 'Monument' || datum.AssetType === 'Fountain'"
        },

        // Normalise artwork names for duplicate detection.
        {
            calculate: "lower(trim(datum.Name || ''))",
            as: "NormalisedName"
        },
        {
            filter: "datum.NormalisedName !== ''"
        },

        // Count each unique name only once per category.
        {
            aggregate: [
                { op: "count", as: "UniqueRecord" }
            ],
            groupby: ["AssetType", "NormalisedName"]
        },

        // Count unique artwork names in each category.
        {
            aggregate: [
                { op: "count", as: "Count" }
            ],
            groupby: ["AssetType"]
        },

        // Calculate each category's percentage of the total.
        {
            joinaggregate: [
                { op: "sum", field: "Count", as: "Total" }
            ]
        },
        {
            calculate: "datum.Count / datum.Total * 100",
            as: "Percentage"
        },

        // Initially allocate the whole-number squares.
        {
            calculate: "floor(datum.Percentage)",
            as: "BaseSquares"
        },
        {
            calculate: "datum.Percentage - datum.BaseSquares",
            as: "Remainder"
        },

        // Calculate how many squares remain to reach 100.
        {
            joinaggregate: [
                { op: "sum", field: "BaseSquares", as: "AllocatedSquares" }
            ]
        },
        {
            calculate: "100 - datum.AllocatedSquares",
            as: "RemainingSquares"
        },

        // Rank categories by their fractional remainders.
        {
            window: [
                { op: "row_number", as: "RemainderRank" }
            ],
            sort: [
                { field: "Remainder", order: "descending" },
                { field: "AssetType", order: "ascending" }
            ]
        },

        // Distribute remaining squares using the largest remainder method.
        {
            calculate: "datum.BaseSquares + (datum.RemainderRank <= datum.RemainingSquares ? 1 : 0)",
            as: "FinalSquares"
        },

        // Generate the individual squares for the waffle chart.
        {
            calculate: "sequence(0, datum.FinalSquares)",
            as: "SquareIndices"
        },
        {
            flatten: ["SquareIndices"],
            as: ["SquareIndex"]
        },
        {
            calculate: "datum.SquareIndex % 10",
            as: "Column"
        },
        {
            calculate: "9 - floor(datum.SquareIndex / 10)",
            as: "Row"
        }
    ],

    mark: {
        type: "rect",
        cornerRadius: 3,
        stroke: "#F7F5F0",
        strokeWidth: 2
    },

    encoding: {
        x: {
            field: "Column",
            type: "ordinal",
            axis: null,
            scale: {
                paddingInner: 0.12,
                paddingOuter: 0.04
            }
        },

        y: {
            field: "Row",
            type: "ordinal",
            axis: null,
            scale: {
                paddingInner: 0.12,
                paddingOuter: 0.04
            }
        },

        color: {
            field: "AssetType",
            type: "nominal",
            title: "Asset type",
            sort: ["Art", "Monument", "Fountain"],
            scale: {
                domain: ["Art", "Monument", "Fountain"],
                range: ["#3777C8", "#E88BB5", "#E3A43B"]
            },
            legend: {
                orient: "bottom",
                direction: "horizontal",
                title: null,
                symbolType: "square"
            }
        },

        tooltip: [
            {
                field: "AssetType",
                type: "nominal",
                title: "Asset type"
            },
            {
                field: "Count",
                type: "quantitative",
                title: "Unique names",
                format: ","
            },
            {
                field: "Percentage",
                type: "quantitative",
                title: "Share (%)",
                format: ".1f"
            },
            {
                field: "Total",
                type: "quantitative",
                title: "Total unique names",
                format: ","
            }
        ]
    },

    config: {
        view: {
            stroke: null
        },
        font: "Arial"
    }
};

// Render the Vega-Lite chart.
vegaEmbed("#publicArtWaffleChart", publicArtWaffleSpec, {
    actions: false,
    renderer: "svg"
})
.then(() => {
    console.log("Public art waffle chart rendered successfully.");
})
.catch(error => {
    console.error("Public art waffle chart failed to load:", error);
});