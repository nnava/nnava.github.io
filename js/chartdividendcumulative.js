define(['./bankdatadividend'], function(bankdatadividend) {

    var chartData;
    var chartId;

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData() {

        var isTaxChecked = $('#checkboxTax').is(":checked");

        var result = bankdatadividend.getDividendAll(isTaxChecked);

        var yearDividendDataItems = [];
        var previousBelopp = 0;
        result.forEach(function(entry) {
            if (entry.Year == null) { return; }

            var belopp = entry.Belopp + previousBelopp;
            previousBelopp = belopp;
            yearDividendDataItems.push({
                Year: entry.Year,
                Belopp: Math.round(previousBelopp)
            });
        });
      
        chartData = yearDividendDataItems;
    }
    
    function loadChart() {
        $(chartId).kendoChart({
            dataSource: {
                data: chartData
            },
            title: {
                text: "Utdelning ackumulerad - total"
            },
            legend: {
                visible: false
            },
            seriesDefaults: {
                type: "area",
                labels: {
                    visible: true,
                    background: "transparent",
                    format: "#,0"
                }
            },
            series: [{
                field: "Belopp",
                name: "Ackumulerad utdelning"
            }],
            valueAxis: {
                line: {
                    visible: false
                },
                labels: {
                    format: "#,0 kr"
                }
            },
            categoryAxis: {
                field: "Year",
                majorGridLines: {
                    visible: false
                }
            },
            tooltip: {
                visible: true,
                template: "#= category # - #= kendo.toString(value, 'n0') # kr"
            },
            theme: "bootstrap",
            transitions: false
        });
    }

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart
    };
});