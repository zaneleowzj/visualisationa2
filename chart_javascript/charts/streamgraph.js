
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


