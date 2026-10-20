// ============================================
// AUSTRALIAN ART VISUALISATION
// HEATMAP + CHOROPLETH MAP
// ============================================


// SHARED COLOUR PALETTE
const heatmapColours = [
    "#f4e8df",
    "#e4c4ad",
    "#c58c69",
    "#985a3e",
    "#633b2c"
];


// ============================================
// CHART 1: ARTWORK DISTRIBUTION HEATMAP
// ============================================

const heatmapSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v6.json",

    width: "container",
    height: { step: 48 },

    autosize: {
        type: "fit",
        contains: "padding"
    },

    data: {
        url: "../data/heatmap_states_australian_3category.csv",
        format: { type: "csv" }
    },

    transform: [
        {
            calculate: "toNumber(datum['Mapped_Artwork_Count'])",
            as: "artwork_count"
        }
    ],

    mark: {
        type: "rect",
        stroke: "white",
        strokeWidth: 3,
        cornerRadius: 4,
        cursor: "pointer"
    },

    encoding: {
        x: {
            field: "Department",
            type: "nominal",
            title: "Art department",

            sort: [
                "Australian Art",
                "Contemporary Australian Art",
                "Indigenous Australian Art"
            ],

            axis: {
                orient: "top",
                labelAngle: 0,
                labelLimit: 200,
                labelFontSize: 11,
                labelFontWeight: "bold",
                titleFontSize: 12,
                titleFontWeight: "bold",
                labelPadding: 12,
                titlePadding: 15
            }
        },

        y: {
            field: "State/Territory",
            type: "nominal",
            title: "State / territory",

            sort: [
                "Queensland",
                "Northern Territory",
                "New South Wales",
                "Victoria",
                "Western Australia",
                "South Australia",
                "Tasmania",
                "Australian Capital Territory"
            ],

            axis: {
                labelLimit: 200,
                labelFontSize: 11,
                labelFontWeight: "bold",
                titleFontSize: 12,
                titleFontWeight: "bold",
                labelPadding: 8
            }
        },

        color: {
            field: "artwork_count",
            type: "quantitative",

            scale: {
                type: "log",
                domain: [1, 1300],
                clamp: true,
                range: heatmapColours
            },

            legend: null
        },

        tooltip: [
            {
                field: "State/Territory",
                type: "nominal",
                title: "State / territory"
            },
            {
                field: "Department",
                type: "nominal",
                title: "Art department"
            },
            {
                field: "artwork_count",
                type: "quantitative",
                title: "Mapped artwork records",
                format: ","
            }
        ]
    },

    config: {
        background: "white",

        view: {
            stroke: null
        },

        axis: {
            labelFont: "Arial",
            titleFont: "Arial",
            labelColor: "#55574f",
            titleColor: "#252821",
            grid: false,
            domain: false,
            tickSize: 0
        }
    }
};


// UPDATE THE HEATMAP DETAILS PANEL

function updateHeatmapDetails(datum) {
    if (!datum) return;

    const state = datum["State/Territory"];
    const department = datum["Department"];
    const count = Number(datum["artwork_count"]);

    const stateElement = document.getElementById("detail-state");
    const departmentElement = document.getElementById("detail-department");
    const countElement = document.getElementById("detail-count");
    const headingElement = document.getElementById("detail-heading");

    if (stateElement) {
        stateElement.textContent = state || "Unknown";
    }

    if (departmentElement) {
        departmentElement.textContent = department || "Unknown";
    }

    if (countElement) {
        countElement.textContent = Number.isFinite(count)
            ? count.toLocaleString("en-AU")
            : "Unavailable";
    }

    if (headingElement) {
        headingElement.textContent = state || "Artwork details";
    }
}


// RENDER THE HEATMAP

vegaEmbed("#heatmap", heatmapSpec, {
    actions: false,
    renderer: "svg"
})
.then(function (result) {
    console.log("Heatmap loaded successfully.");

    // Vega's mark-level event listener supplies the hovered item.
    result.view.addEventListener("mouseover", function (event, item) {
        if (!item || !item.datum) return;

        const datum = item.datum;

        if (
            datum["State/Territory"] &&
            datum["Department"] !== undefined
        ) {
            updateHeatmapDetails(datum);
        }
    });
})
.catch(function (error) {
    console.error("Heatmap failed to load:", error);
});
/* =========================================
   CHART 2: AUSTRALIAN CHOROPLETH MAP
   Compatible with Vega-Lite 5
========================================= */

(function () {
    "use strict";

    const container = document.getElementById("choropleth_map");

    if (!container) {
        console.error('Cannot find element "#choropleth_map".');
        return;
    }

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

        // Use the same projection as the successful GeoJSON-only test.
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

    vegaEmbed(container, choroplethSpec, {
        actions: false,
        renderer: "svg"
    })
    .then(function (result) {
        console.log("Choropleth loaded.");

        const features = result.view.data("source_0") || [];

        console.table(
            features.map(function (d) {
                return {
                    GeoJSON_State: d.properties?.state_name ||
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

})();

/* ============================================
   CHART 3: INTERACTIVE ACQUISITION STREAMGRAPH
   ============================================ */

const acquisitionStreamgraphSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v6.json",

    width: "container",
    height: 380,

    autosize: {
        type: "fit",
        contains: "padding"
    },

    title: {
        text: "Evolution of Artwork Acquisitions",
        subtitle: "Annual acquisition records by art department, 1934–2024",
        anchor: "start",
        fontSize: 18,
        subtitleFontSize: 12,
        color: "#252821",
        subtitleColor: "#686b63"
    },

    data: {
        url: "../data/acquisition_by_year_department.csv",
        format: {
            type: "csv"
        }
    },

    params: [
        {
            name: "selectedDepartment",
            value: "All"
        }
    ],

    transform: [
        {
            calculate: "toNumber(datum.Year)",
            as: "year"
        },
        {
            calculate: "toNumber(datum.Acquisition_Count)",
            as: "acquisition_count"
        }
    ],

    mark: {
        type: "area",
        interpolate: "monotone",
        opacity: 0.9,
        line: {
            color: "white",
            strokeWidth: 0.5
        }
    },

    encoding: {
        x: {
            field: "year",
            type: "quantitative",
            title: "Year of acquisition",
            scale: {
                domain: [1934, 2024],
                nice: false
            },
            axis: {
                format: "d",
                tickCount: 8,
                labelFontSize: 11,
                titleFontSize: 12,
                grid: false,
                domainColor: "#ded5cb",
                tickColor: "#ded5cb"
            }
        },

        y: {
            field: "acquisition_count",
            type: "quantitative",
            stack: "center",
            title: null,
            axis: {
                labels: false,
                ticks: false,
                domain: false,
                grid: false
            }
        },

        color: {
            field: "Department",
            type: "nominal",
            title: "Art department",
            scale: {
                domain: [
                    "Australian Art",
                    "Contemporary Australian Art",
                    "Indigenous Australian Art"
                ],
                range: [
                    "#985a3e",
                    "#d8a58c",
                    "#6f8972"
                ]
            },
            legend: {
                orient: "bottom",
                direction: "horizontal",
                title: null,
                labelFontSize: 11,
                symbolType: "square",
                symbolSize: 100,
                offset: 15
            }
        },

        opacity: {
            condition: {
                test: "selectedDepartment === 'All' || datum.Department === selectedDepartment",
                value: 1
            },
            value: 0.12
        },

        order: {
            field: "Department",
            sort: [
                "Australian Art",
                "Contemporary Australian Art",
                "Indigenous Australian Art"
            ]
        },

        tooltip: [
            {
                field: "year",
                type: "quantitative",
                title: "Year",
                format: "d"
            },
            {
                field: "Department",
                type: "nominal",
                title: "Department"
            },
            {
                field: "acquisition_count",
                type: "quantitative",
                title: "Acquisition records",
                format: ","
            }
        ]
    },

    config: {
        background: "white",
        view: {
            stroke: null
        },
        axis: {
            labelFont: "Arial",
            titleFont: "Arial",
            labelColor: "#686b63",
            titleColor: "#252821"
        }
    }
};


/* ============================================
   RENDER STREAMGRAPH AND CONNECT BUTTONS
   ============================================ */

vegaEmbed("#streamgraph", acquisitionStreamgraphSpec, {
    actions: false,
    renderer: "svg"
})
.then(({ view }) => {

    const buttons = document.querySelectorAll(".department-btn");
    const status = document.getElementById("streamgraph-selection");

    buttons.forEach(button => {
        button.setAttribute(
            "aria-pressed",
            String(button.dataset.department === "All")
        );

        button.addEventListener("click", () => {
            const department = button.dataset.department;

            // Update the Vega-Lite parameter.
            view.signal("selectedDepartment", department).run();

            // Update button appearance.
            buttons.forEach(item => {
                const active = item === button;

                item.classList.toggle("active", active);
                item.setAttribute("aria-pressed", String(active));
            });

            // Update the status text.
            if (status) {
                status.textContent = department === "All"
                    ? "Showing all departments"
                    : `Highlighting ${department}`;
            }
        });
    });

    console.log("Interactive acquisition streamgraph loaded.");

})
.catch(error => {
    console.error("Acquisition streamgraph failed to load:", error);
});



/* =========================================
   CHART 4: ART FORMS OVER TIME
   SMALL MULTIPLES
========================================= */

const artFormsSmallMultiplesSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v6.json",

    "data": {
        "url": "../data/art_form_by_decade.csv",
        "format": {
            "type": "csv"
        }
    },

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
.then(() => {
    console.log("Art forms small multiples loaded successfully.");
})
.catch(error => {
    console.error("Art forms small multiples error:", error);

    const container = document.getElementById("art-forms-line-chart");

    if (container) {
        container.innerHTML =
            "<p>Unable to load the art forms chart. Check the CSV path and browser console.</p>";
    }
});


/* =========================================
   CHART 5: CREATOR COUNTRY ASSOCIATION
   DONUT CHART
========================================= */

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

/* =========================================
   CHART: 100% STACKED BAR
   ART FORM COMPOSITION BY CREATION DECADE
========================================= */

(function () {
    "use strict";

    const container = document.getElementById(
        "art-form-stacked-bar"
    );

    if (!container) {
        console.error(
            'Cannot find element "#art-form-stacked-bar".'
        );
        return;
    }

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

    vegaEmbed(container, artFormStackedBarSpec, {
        actions: false,
        renderer: "svg"
    })
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

        container.innerHTML =
            '<p style="color:#b91c1c;">' +
            "Unable to load the chart. Check the CSV path " +
            "and browser console." +
            "</p>";
    });

})();

/* =========================================
   CHART 7: GENDER POPULATION PYRAMID
   Source: DAAO biography dataset
========================================= */

(function () {
    "use strict";

    const container = document.getElementById(
        "gender-decade-chart"
    );

    if (!container) {
        console.error(
            'Cannot find "#gender-decade-chart".'
        );
        return;
    }

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
                    range: ["#985a3e", "#6f8972"]
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

        container.innerHTML =
            '<p style="color:#b91c1c;">' +
            "Chart failed to load. Check the CSV path " +
            "and browser console." +
            "</p>";
    });
})();


/* =========================================
   CHART 8: TOP 15 ARTISTS BY WORKS
   Source: QAGOMA collection dataset
========================================= */

(function () {
    "use strict";

    const container = document.getElementById(
        "top-artists-chart"
    );

    if (!container) {
        console.error(
            'Cannot find "#top-artists-chart".'
        );
        return;
    }

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

        container.innerHTML =
            '<p style="color:#b91c1c;">' +
            "Unable to load the chart. Check the CSV path " +
            "and browser console." +
            "</p>";
    });
})();

const publicArtMap = L.map("melbournePublicArtMap").setView(
  [-37.8136, 144.9631],
  14
);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19
}).addTo(publicArtMap);

// Add interactive controls above the map.
const controls = L.control({ position: "topright" });

controls.onAdd = function () {
  const div = L.DomUtil.create("div", "public-art-controls");

  div.innerHTML = `
    <label for="artTypeFilter"><strong>Asset type</strong></label>
    <select id="artTypeFilter">
      <option value="All">All types</option>
      <option value="Art">Art</option>
      <option value="Monument">Monuments</option>
      <option value="Fountain">Fountains</option>
    </select>

    <label for="artSearch"><strong>Search artwork or artist</strong></label>
    <input id="artSearch" type="text" placeholder="Type a name..." />

    <button id="resetArtFilters" type="button">Reset filters</button>
  `;

  L.DomEvent.disableClickPropagation(div);
  L.DomEvent.disableScrollPropagation(div);
  return div;
};

controls.addTo(publicArtMap);

// Colours by asset type.
const typeColours = {
  Art: "#3777C8",
  Monument: "#E88BB5",
  Fountain: "#E3A43B"
};

const markerLayer = L.layerGroup().addTo(publicArtMap);
let artworkRecords = [];

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, function (char) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char];
  });
}

function renderArtworks() {
  markerLayer.clearLayers();

  const selectedType =
    document.getElementById("artTypeFilter").value;
  const searchTerm =
    document.getElementById("artSearch").value.trim().toLowerCase();

  artworkRecords.forEach(function (d) {
    const type = (d.AssetType || "").trim();
    const name = (d.Name || "").toLowerCase();
    const artist = (d.Artist || "").toLowerCase();

    if (selectedType !== "All" && type !== selectedType) return;
    if (
      searchTerm &&
      !name.includes(searchTerm) &&
      !artist.includes(searchTerm)
    ) return;

    const lat = Number(d.Latitude);
    const lon = Number(d.Longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

    const colour = typeColours[type] || "#777777";

    const marker = L.circleMarker([lat, lon], {
      radius: 7,
      fillColor: colour,
      color: "#ffffff",
      weight: 1,
      fillOpacity: 0.85
    });

    marker.bindPopup(`
      <div class="art-popup">
        <strong>${escapeHtml(d.Name || "Untitled")}</strong><br>
        <b>Type:</b> ${escapeHtml(type || "Not recorded")}<br>
        <b>Artist:</b> ${escapeHtml(d.Artist || "Not recorded")}<br>
        <b>Date:</b> ${escapeHtml(d.ArtDate || "Not recorded")}<br>
        <b>Structure:</b> ${escapeHtml(d.Structure || "Not recorded")}<br>
        <b>Address:</b> ${escapeHtml(d.Address || "Not recorded")}
      </div>
    `);

    marker.on("mouseover", function () {
      this.setStyle({
        radius: 11,
        weight: 2,
        fillOpacity: 1
      });
      this.bringToFront();
    });

    marker.on("mouseout", function () {
      this.setStyle({
        radius: 7,
        weight: 1,
        fillOpacity: 0.85
      });
    });

    markerLayer.addLayer(marker);
  });
}

// Load the CSV.
Papa.parse("../data/melbourne_public_art_cleaned.csv", {
  download: true,
  header: true,
  skipEmptyLines: true,

  complete: function (results) {
    artworkRecords = results.data;
    renderArtworks();

    document.getElementById("artTypeFilter")
      .addEventListener("change", renderArtworks);

    document.getElementById("artSearch")
      .addEventListener("input", renderArtworks);

    document.getElementById("resetArtFilters")
      .addEventListener("click", function () {
        document.getElementById("artTypeFilter").value = "All";
        document.getElementById("artSearch").value = "";
        renderArtworks();
      });

    console.log("Loaded artwork records:", artworkRecords.length);
  },

  error: function (error) {
    console.error("Failed to load public art CSV:", error);
  }
});

