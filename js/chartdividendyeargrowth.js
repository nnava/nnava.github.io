define(['./alasqlavanza', './alasqlnordnet'], function(alasqlavanza, alasqlnordnet) {

    var chartDataDividendGrowth = [];
    var chartDataSumYearDividend = [];
    var chartDataSumYearTax = [];
    var chartDataSumReturnYearTax = [];
    var chartDataYears = [];
    var chartReturnTaxDiff = [];
    var chartExpectedTaxBelopp = [];
    var chartId;

    function resetArrayValues() {
        chartDataDividendGrowth = [];
        chartDataSumYearDividend = [];
        chartDataSumYearTax = [];
        chartDataSumReturnYearTax = [];
        chartDataYears = [];
        chartReturnTaxDiff = [];
        chartExpectedTaxBelopp = [];
    }

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData() {

        resetArrayValues();

        var nordnetYearData = alasqlnordnet.getDividendYears();
        var avanzaYearData = alasqlavanza.getDividendYears();
        var result = avanzaYearData.concat(nordnetYearData);

        var resultYear = alasql('SELECT DISTINCT Year FROM ? ORDER BY Year', [result]);
        var resultYearArray = yearToArray(resultYear);

        var futureTaxReturnYears = [];
        resultYearArray.forEach(function(year) {

            chartDataYears.push(year);
            
            var totalDividend = getTotalDividendForYear(year);
            var totalTaxBelopp = getTotalTaxForYear(year);

            var expectedTotalTaxReturnBelopp = getExpectedTotalTaxReturnForYear(year -3);
            chartExpectedTaxBelopp[year] = expectedTotalTaxReturnBelopp;

            var totalTaxReturnBelopp = getTotalTaxReturnForYear(year);
            var diffValue = ((totalTaxReturnBelopp / expectedTotalTaxReturnBelopp) * 100).toFixed(3);

            if(isNaN(diffValue) == false)
                chartReturnTaxDiff[year] = diffValue;

            chartDataSumReturnYearTax.push(totalTaxReturnBelopp);

            // if taxbelopp < 0, och finns värde i årsarray? lägg till annars lägg till år i ny årsarray (framtid)
            if(totalTaxBelopp < 0 && !resultYearArray.includes(year + 3)) {
                futureTaxReturnYears.push(year);
            }

            // Post för återbetald källskatt, hur ser den ut?
            var totalBelopp = totalDividend + totalTaxBelopp;

            chartDataSumYearDividend.push(totalBelopp);
            chartDataSumYearTax.push(totalTaxBelopp);

            var yearBefore = year-1;
            var foundLastYear = false;
            resultYear.forEach(function(entryLast) {
                if(entryLast.Year == yearBefore) {
                    var totalDividendLastYear = getTotalDividendForYear(yearBefore);
                    var totalTaxBeloppLastYear = getTotalTaxForYear(yearBefore);

                    var totalBeloppLastYear = totalDividendLastYear + totalTaxBeloppLastYear;

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
    
    function getTotalTaxReturnForYear(year) {
        var avanzaTaxReturnSumBelopp = alasqlavanza.getReturnedTaxYearSumBelopp(year);
        var nordnetTaxReturnSumBelopp = alasqlnordnet.getReturnedTaxYearSumBelopp(year);
        return avanzaTaxReturnSumBelopp + nordnetTaxReturnSumBelopp;
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

    function getExpectedTotalTaxReturnForYear(year) {
        var nordnetTaxReturnSumBelopp = alasqlnordnet.getTaxYearSumBelopp(year);
        var avanzaTaxReturnSumBelopp = alasqlavanza.getTaxYearSumBelopp(year);
        return - (nordnetTaxReturnSumBelopp + avanzaTaxReturnSumBelopp);
    }

    function addFutureTaxReturnData(futureTaxReturnYears) {
        futureTaxReturnYears.forEach(function(year) {
            var totalTaxReturnBelopp = getExpectedTotalTaxReturnForYear(year);
            chartDataSumReturnYearTax.push(totalTaxReturnBelopp);
            chartDataYears.push(year + 3);
        });        
    }
    
    function yearToArray(resultYear) {
        var resultYearArray = [];
        resultYear.forEach(function(entry) {
            if (entry.Year == null) { return; }

            resultYearArray.push(entry.Year);
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
                    template: "#= window.returnTaxTooltipText(category, value) #"
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
            theme: "bootstrap",
            transitions: false
        });      
    }

    window.returnTaxTooltipText = function returnTaxTooltipText(category, value) {
        var returnTaxDiffValue = chartReturnTaxDiff[category];
        if(returnTaxDiffValue){
            var expectedTaxBelopp = kendo.toString(chartExpectedTaxBelopp[category], 'n2') + ' kr'; 
            var returnedTaxBelopp = kendo.toString(value, 'n2') + ' kr';

            return "Debiterad källskatt: " + expectedTaxBelopp + "<br/> " +
                "Återbetald källskatt: " + returnedTaxBelopp + "<br/> " +
                "Procentuellt återbetald källskatt: " + returnTaxDiffValue + " %";
        }
        else {
            return kendo.toString(value, 'n2') + ' kr';
        }
    }

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart
    };
});