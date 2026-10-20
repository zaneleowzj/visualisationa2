const heatmapColours = [
    "#F0DFD0",
    "#D9AD91",
    "#BD8262",
    "#98583E",
    "#633B2C"
];
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