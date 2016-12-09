define(['./alasql.min', './alasqlavanza', './alasqlnordnet', './monthstaticvalues'], function(alasqlhelper, alasqlavanza, alasqlnordnet, monthstaticvalues) {

    var chartDataDividendGrowth = [];
    var chartDataSumYearDividend = [];
    var chartDataSumYearTax = [];
    var chartDataYears = [];
    var chartId;
    var months = monthstaticvalues.getMonthValues();

    function resetArrayValues() {
        chartDataDividendGrowth = [];
        chartDataSumYearDividend = [];
        chartDataSumYearTax = [];
        chartDataYears = [];
    }

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(avanzaValue, nordnetValue) {

        resetArrayValues();

        alasqlnordnet.setSourceData(nordnetValue);
        alasqlavanza.setSourceData(avanzaValue);

        var nordnetYearData = alasqlnordnet.getDividendYears();
        var avanzaYearData = alasqlavanza.getDividendYears();

        alasql('CREATE TABLE IF NOT EXISTS ArTable \
                (Ar INT);');

        alasql('INSERT INTO ArTable SELECT Ar \
                FROM ?', [nordnetYearData]);

        alasql('INSERT INTO ArTable SELECT Ar \
                FROM ?', [avanzaYearData]);

        var resultYear = alasql('SELECT DISTINCT Ar FROM ArTable ORDER BY Ar');
        alasql('TRUNCATE TABLE ArTable');

        resultYear.forEach(function(entry) {

            if (entry.Ar == null) { return; }

            var year = entry.Ar;
            chartDataYears.push(year);

            var nordnetDividendSumBelopp = alasqlnordnet.getDividendYearSumBelopp(year);
            var avanzaDividendSumBelopp = alasqlavanza.getDividendYearSumBelopp(year);

            var nordnetTaxSumBelopp = alasqlnordnet.getTaxYearSumBelopp(year);
            var avanzaTaxSumBelopp = alasqlavanza.getTaxYearSumBelopp(year);
            var totalTaxBelopp = nordnetTaxSumBelopp + avanzaTaxSumBelopp;

            var totalBelopp = nordnetDividendSumBelopp + avanzaDividendSumBelopp + totalTaxBelopp;

            chartDataSumYearDividend.push(totalBelopp);
            chartDataSumYearTax.push(totalTaxBelopp);

            var yearBefore = year-1;
            var foundLastYear = false;
            resultYear.forEach(function(entryLast) {
                if(entryLast.Ar == yearBefore) {
                    var nordnetSumBeloppLastYear = alasqlnordnet.getDividendYearSumBelopp(yearBefore);
                    var avanzaSumBeloppLastYear = alasqlavanza.getDividendYearSumBelopp(yearBefore);

                    var totalBeloppLastYear = nordnetSumBeloppLastYear + avanzaSumBeloppLastYear;

                    var changeValue = totalBelopp - totalBeloppLastYear;
                    var growthValue = ((changeValue / totalBeloppLastYear) * 100).toFixed(2);

                    chartDataDividendGrowth.push(growthValue);

                    foundLastYear = true;
                }
                
            });

            if(foundLastYear == false) {
                chartDataDividendGrowth.push(0);
            }

        });
    }

    function loadChart() {
        $(chartId).kendoChart({
            title: {
                text: "Utdelning år och utdelningstillväxt"
            },
            legend: {
                position: "top"
            },
            seriesDefaults: {
                type: "column",
                stack: true
            },
            series: [{
                type: "column",
                data: chartDataSumYearDividend,
                name: "Utdelning kr",
                tooltip: {
                    visible: true,
                    format: "#,0 kr"
                }
            }
            ,{
                type: "column",
                data: chartDataSumYearTax,
                name: "Källskatt kr",
                tooltip: {
                    visible: true,
                    format: "#,0 kr"
                }
            }
            , {
                type: "line",
                data: chartDataDividendGrowth,
                name: "Utdelningstillväxt",
                axis: "utdtillvaxt",
                tooltip: {
                    visible: true,
                    format: "{0} %"
                }
            }],
            valueAxes: [{
                title: { text: "kr" },
                labels: {
                    format: "#,0 kr"
                }
            }, {
                labels: {
                    format: "{0} %"
                },
                name: "utdtillvaxt",
                title: { text: "Utdelningstillväxt" }
            }],
            categoryAxis: {
                categories: chartDataYears,
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