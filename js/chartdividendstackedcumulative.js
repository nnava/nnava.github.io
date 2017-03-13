define(['./bankdatadividend', './colors', './monthstaticvalues'], function(bankdatadividend, colors, monthstaticvalues) {

    var chartData = [];
    var chartId;
    var selectedYear = 0;
    var colorArray = colors.getColorArray();
    var months = monthstaticvalues.getMonthValues();

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(year) {

        chartData = [];

        selectedYear = year;
        var isTaxChecked = $('#checkboxTax').is(":checked");

        var resultVärdepapper = bankdatadividend.getVärdepapperForYear(selectedYear);
        
        var dividendData = bankdatadividend.getVärdepapperDividendData(year, resultVärdepapper, isTaxChecked);
        dividendData.forEach(function(entry) {
            chartData.push({
                type: "column",
                name: entry.name,
                data: entry.data                
            });
        });

        var resultTotalDividend = bankdatadividend.getTotalDividend(year, isTaxChecked);
        var avgDividendValue = (resultTotalDividend / 12);

        var avgDividendArray = [];
        for(var i=0; i <= 11; i++) {
            avgDividendArray.push(avgDividendValue);
        }

        chartData.push({
            type: "line",
            data: avgDividendArray,
            name: "Utdelningar medelvärde",
            color: "#f2b661",
            tooltip: {
                visible: true
            },
            labels: {
                rotation: 0,
                visible: false
            }
        });
    
    }

    function loadChart() {
        $(chartId).kendoChart({
            plotArea: {
                background: ""
            },
            title: {
                text: "Utdelning per månad/värdepapper - år " + selectedYear
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
                template: "#= series.name # - (#= kendo.toString(value, 'n2') # kr)"
            },
            theme: "bootstrap"
        });
    }

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart
    };
});