define(['./alasql.min', './alasqlavanza', './alasqlnordnet', './monthstaticvalues'], function(alasqlhelper, alasqlavanza, alasqlnordnet, monthstaticvalues) {

    var chartData;
    var chartId;
    var chartYearValues = [];

    function resetArrayValues() {
        chartYearValues = [];
    }

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(avanzaValue, nordnetValue) {

        resetArrayValues();

        alasqlnordnet.setSourceData(nordnetValue);
        alasqlavanza.setSourceData(avanzaValue);

        var nordnetYearData = alasqlnordnet.getDepositYears();
        var avanzaYearData = alasqlavanza.getDepositYears();

        alasql('CREATE TABLE IF NOT EXISTS ArTable \
                (Ar INT);');

        alasql('INSERT INTO ArTable SELECT Ar \
                FROM ?', [nordnetYearData]);

        alasql('INSERT INTO ArTable SELECT Ar \
                FROM ?', [avanzaYearData]);

        var resultYear = alasql('SELECT DISTINCT Ar FROM ArTable');
        alasql('TRUNCATE TABLE ArTable');

        var yearDepositValues = [];
        var entryId = 0;
        var addedYear = [];
        
        resultYear.forEach(function(entry) {

            if (entry.Ar == null) { return; }
            if(addedYear.includes(entry.Ar)) return;

            addedYear.push(entry.Ar);

            console.log(entry.Ar);

            var resultNordnet = alasqlnordnet.getDepositsYearSumBelopp(entry.Ar);
            var resultAvanza = alasqlavanza.getDepositsYearSumBelopp(entry.Ar);

            console.log(resultNordnet);
            console.log(resultAvanza);

            var totalBelopp = resultNordnet + resultAvanza;

            yearDepositValues.push({
                    name: entry.Ar,
                    data: totalBelopp,
                    gap: parseFloat(0.4, 10),
                    spacing: parseFloat(0.3, 10)
            });
        });

        chartYearValues = addedYear; 
        chartData = yearDepositValues;
    }

    function loadChart() {
        $(chartId).kendoChart({
            title: {
                text: "Insättningar - år"
            },
            legend: {
                position: "bottom"
            },
            seriesDefaults: {
                type: "column"
            },
            series: chartData,
            valueAxis: {
                line: {
                    visible: false
                },
                labels: {
                    format: "#,0 kr"
                }
            },
            categoryAxis: {
                categories: chartYearValues,
                majorGridLines: {
                    visible: true
                }
            },
            tooltip: {
                visible: true,
                format: "#,0 kr"
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