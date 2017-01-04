define(['./alasql.min', './alasqlavanza', './alasqlnordnet', './monthstaticvalues'], function(alasqlhelper, alasqlavanza, alasqlnordnet, monthstaticvalues) {

    var chartData;
    var chartId;
    var chartYearValues = [];
    var total = [];

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

        var yearDepositData = [];
        var addedYear = [];
        var nordnetValues = [];
        var avanzaValues = [];
        var isNordnetNotAdded = true;
        total = [];

        resultYear.forEach(function(entry) {

            if (entry.Ar == null) { return; }
            if (addedYear.includes(entry.Ar)) return;

            addedYear.push(entry.Ar);

            var nordnetBelopp = alasqlnordnet.getDepositsYearSumBelopp(entry.Ar);
            var avanzaBelopp = alasqlavanza.getDepositsYearSumBelopp(entry.Ar);
            var totalBelopp = nordnetBelopp + avanzaBelopp;

            total[entry.Ar] = totalBelopp;

            nordnetValues.push(nordnetBelopp);
            avanzaValues.push(avanzaBelopp);          

            if(nordnetBelopp !== 0) 
                isNordnetNotAdded = false;
        });

        if(avanzaValues.some(isBiggerThan0)) {
            if(isNordnetNotAdded) {
                yearDepositData.push({
                    field: "ava",
                    name: "Avanza",
                    data: avanzaValues,
                    color: "#009640",
                    labels: {
                        visible: true,
                        template: "#= window.getChartDepositLabelText(category) #",                
                        position: "outsideEnd"
                    }
                });
            }
            else {
                yearDepositData.push({
                    field: "ava",
                    name: "Avanza",
                    data: avanzaValues,
                    color: "#009640"
                });
            }            
        }

        if(nordnetValues.some(isBiggerThan0)) {
            yearDepositData.push({
                field: "nn",
                name: "Nordnet",
                data: nordnetValues,
                color: "#00A8EF",
                labels: {
                    visible: true,
                    template: "#= window.getChartDepositLabelText(category) #",                
                    position: "outsideEnd"
                }      
            });
        }

        chartYearValues = addedYear; 
        chartData = yearDepositData;
    }

    window.getChartDepositLabelText = function getChartDepositLabelText(category) {
        return kendo.toString(total[category], 'n0') + ' kr';
    }

    function isBiggerThan0(element, index, array) {
        return element > 0;
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
                type: "column",
                stack: true
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
                template: "${series.name} - #= kendo.toString(value, 'n0') # kr"
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