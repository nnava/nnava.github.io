define(['./bankdatadividend', './colors', './monthstaticvalues'], function(bankdatadividend, colors, monthstaticvalues) {

    var chartData;
    var chartId;
    var selectedYear = 0;
    var colorArray = colors.getColorArray();
    var months = monthstaticvalues.getMonthValues();

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(avanzaValue, nordnetValue, year) {

        selectedYear = year;
        var isTaxChecked = $('#checkboxTax').is(":checked");

        bankdatadividend.setData(avanzaValue, nordnetValue);
        var resultVärdepapper = bankdatadividend.getVärdepapperForYear(selectedYear);
        
        chartData = bankdatadividend.getVärdepapperDividendData(year, resultVärdepapper, isTaxChecked);
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
                line: {
                    visible: false
                },
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