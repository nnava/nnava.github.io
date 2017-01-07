define(['./alasql.min', './alasqlavanza', './alasqlnordnet', './monthstaticvalues'], function(alasqlhelper, alasqlavanza, alasqlnordnet, monthstaticvalues) {

    var chartDataDividendGrowth = [];
    var chartDataSumYearDividend = [];
    var chartDataSumYearTax = [];
    var chartDataSumReturnYearTax = [];
    var chartDataYears = [];
    var chartId;
    var months = monthstaticvalues.getMonthValues();

    function resetArrayValues() {
        chartDataDividendGrowth = [];
        chartDataSumYearDividend = [];
        chartDataSumYearTax = [];
        chartDataSumReturnYearTax = [];
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

        var resultYearArray = yearToArray(resultYear);

        var futureTaxReturnYears = [];
        resultYearArray.forEach(function(year) {

            chartDataYears.push(year);
            
            var totalDividend = getTotalDividendForYear(year);
            var totalTaxBelopp = getTotalTaxForYear(year);

            var totalTaxReturnBelopp = getTotalTaxReturnForYear(year -3);
            chartDataSumReturnYearTax.push(totalTaxReturnBelopp);

            //if taxbelopp < 0, och finns värde i årsarray? lägg till annars lägg till år i ny årsarray (framtid)
            if(totalTaxBelopp < 0 && !resultYearArray.includes(year + 3)) {
                futureTaxReturnYears.push(year);
            }

            var totalBelopp = totalDividend + totalTaxBelopp;

            chartDataSumYearDividend.push(totalBelopp);
            chartDataSumYearTax.push(totalTaxBelopp);

            var yearBefore = year-1;
            var foundLastYear = false;
            resultYear.forEach(function(entryLast) {
                if(entryLast.Ar == yearBefore) {
                    var totalBeloppLastYear = getTotalDividendForYear(yearBefore);

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

        addFutureTaxReturnData(futureTaxReturnYears);
    }

    function getTotalDividendForYear(year) {
        var nordnetSumBeloppLastYear = alasqlnordnet.getDividendYearSumBelopp(year);
        var avanzaSumBeloppLastYear = alasqlavanza.getDividendYearSumBelopp(year);
        return nordnetSumBeloppLastYear + avanzaSumBeloppLastYear;
    }

    function getTotalTaxForYear(year) {
        var nordnetTaxSumBelopp = alasqlnordnet.getTaxYearSumBelopp(year);
        var avanzaTaxSumBelopp = alasqlavanza.getTaxYearSumBelopp(year);
        return nordnetTaxSumBelopp + avanzaTaxSumBelopp;    
    }

    function getTotalTaxReturnForYear(year) {
        var nordnetTaxReturnSumBelopp = alasqlnordnet.getTaxYearSumBelopp(year);
        var avanzaTaxReturnSumBelopp = alasqlavanza.getTaxYearSumBelopp(year);
        return - (nordnetTaxReturnSumBelopp + avanzaTaxReturnSumBelopp);
    }

    function addFutureTaxReturnData(futureTaxReturnYears) {
        futureTaxReturnYears.forEach(function(year) {
            var totalTaxReturnBelopp = getTotalTaxReturnForYear(year);
            chartDataSumReturnYearTax.push(totalTaxReturnBelopp);
            chartDataYears.push(year + 3);
        });        
    }
    
    function yearToArray(resultYear) {
        var resultYearArray = [];
        resultYear.forEach(function(entry) {
            if (entry.Ar == null) { return; }

            resultYearArray.push(entry.Ar);
        });

        return resultYearArray;
    }
    function loadChart() {
        $(chartId).kendoChart({
            title: {
                text: "Utdelning och utdelningstillväxt per år"
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
                name: "Debiterad källskatt kr",
                tooltip: {
                    visible: true,
                    format: "#,0 kr"
                }
            }
            ,{
                type: "column",
                data: chartDataSumReturnYearTax,
                name: "Återbetald källskatt kr",
                tooltip: {
                    visible: true,
                    format: "#,0 kr"
                }
            }
            ,{
                type: "line",
                data: chartDataDividendGrowth,
                name: "Utdelningstillväxt",
                axis: "utdtillvaxt",
                tooltip: {
                    visible: true,
                    format: "{0} %"
                },
                labels: {
                    rotation: 0,
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