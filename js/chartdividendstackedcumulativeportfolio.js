define(['./alasqlportfoliodividenddata', './colors', './monthstaticvalues'], function(alasqlportfoliodividenddata, colors, monthstaticvalues) {

    var chartData = [];
    var chartId;
    var selectedYear = 0;
    var colorArray = colors.getColorArray();
    var months = monthstaticvalues.getMonthValues();
    var currentYear = new Date().getFullYear();

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData() {

        chartData = [];

        var dividendData = alasqlportfoliodividenddata.getPortfolioDividendsYearMonthValues(currentYear);
        dividendData.forEach(function(entry) {
            chartData.push({
                name: entry.name,
                data: entry.data,
                visual: function (e) {
                    var origin = e.rect.origin;
                    var center = e.rect.center();
                    var bottomRight = e.rect.bottomRight();
                    var opacity = (e.dataItem.IsDividendReceived == false ? 0.4 : 1);

                    var path = new kendo.drawing.Path({
                        fill: {
                            color: e.options.color,
                            opacity: opacity
                        },
                        stroke: {
                            width: 0,
                            color: "#000"
                        }
                    })
                    .moveTo(origin.x, bottomRight.y)
                    .lineTo(bottomRight.x, bottomRight.y)
                    .lineTo(bottomRight.x, origin.y)
                    .lineTo(origin.x, origin.y)
                    .close();

                    return path;
                }       
            });
        });    
    }

    function loadChart() {
        $(chartId).kendoChart({
            plotArea: {
                background: ""
            },
            title: {
                text: "Erhållna/förväntade utdelningar månad/värdepapper"
            },
            legend: {
                position: "bottom"
            },
            seriesDefaults: {
                type: "column",
                stack: true,
                labels: {
                    visible: false,
                    background: "transparent"
                }
            },
            series: chartData,
            seriesColors: colorArray,
            valueAxis: {
                labels: {
                    format: "#,0 kr"
                }
            },
            render: function(e) {
                // Clear up the loading indicator for this chart
                var loading = $(".chart-loading", e.sender.element.parent());
                kendo.ui.progress(loading, false);
            },  
            categoryAxis: {
                categories: months,
                majorGridLines: {
                    visible: true
                }
            },
            pannable: {
                lock: "y"
            },
            zoomable: {
                mousewheel: {
                    lock: "y"
                },
                selection: {
                    lock: "y"
                }
            },
            tooltip: {
                visible: true,
                template: "#= chartDividendStackedCumulativePortfolioTooltip(series.name, kendo.toString(value, 'n2'), dataItem) #"
            },
            theme: "bootstrap"
        });
    }

    function updateChartOptions(type) {
        var chart = $(chartId).data("kendoChart");
        chart.setOptions({
            seriesDefaults: {
                type: type,
                stack: true,
                labels: {
                    visible: false,
                    background: "transparent"
                }
            }
        });
    }

    window.chartDividendStackedCumulativePortfolioTooltip = function chartDividendStackedCumulativePortfolioTooltip(seriesName, value, dataItem) {
        if(dataItem.IsDividendReceived)
            return seriesName + " - Erhållet " + value + " kr";
        else 
            return seriesName + " - Förväntat " + value + " kr";
    }

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart,
        updateChartOptions: updateChartOptions
    };
});