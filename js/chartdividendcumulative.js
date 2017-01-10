define(['./alasql.min', './alasqlavanza', './alasqlnordnet'], function(alasqlhelper, alasqlavanza, alasqlnordnet) {

    var chartData;
    var chartId;

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(avanzaValue, nordnetValue) {

        alasqlnordnet.setSourceData(nordnetValue);
        alasqlavanza.setSourceData(avanzaValue);

        var isTaxChecked = $('#checkboxTax').is(":checked");

        var nordnetData = alasqlnordnet.getDividendAll(isTaxChecked);
        var avanzaData = alasqlavanza.getDividendAll(isTaxChecked);

        alasql('CREATE TABLE IF NOT EXISTS DividendAllTable \
                (Year INT, Belopp DECIMAL);');

        alasql('INSERT INTO DividendAllTable SELECT Year, Belopp \
                FROM ?', [nordnetData]);

        alasql('INSERT INTO DividendAllTable SELECT Year, Belopp \
                FROM ?', [avanzaData]);

        var result = alasql('SELECT Year, SUM(Belopp) AS Belopp FROM DividendAllTable GROUP BY Year ORDER BY Year');
        alasql('TRUNCATE TABLE DividendAllTable');

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
            theme: "bootstrap"
        });
    }

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart
    };
});