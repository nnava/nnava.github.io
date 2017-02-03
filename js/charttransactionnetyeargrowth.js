define(['./bankdatatransaction', './colors'], function(bankdatatransaction, colors) {

    var chartDataGrowth = [];
    var chartDataSumSell = [];
    var chartDataSumBuy = [];
    var chartDataNetto = [];
    var chartDataYears = [];
    var colorArray = colors.getColorArray();
    var chartId;

    function resetArrayValues() {
        chartDataGrowth = [];
        chartDataSumSell = [];
        chartDataSumBuy = [];
        chartDataNetto = [];
        chartDataYears = [];
    }

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData() {

        resetArrayValues();

        var resultYear = bankdatatransaction.getTransactionYears();
        resultYear.forEach(function(entry) {

            if(entry == null) return;
            if(entry.Year == null) return;

            var year = entry.Year;

            chartDataYears.push(year);
            
            var buySumBelopp = - bankdatatransaction.getBuyTransactionSumBelopp(year);
            var sellSumBelopp = bankdatatransaction.getSellTransactionSumBelopp(year);
            chartDataSumSell.push(sellSumBelopp);

            var totalNettoBelopp = buySumBelopp - sellSumBelopp;

            chartDataSumBuy.push(buySumBelopp);            
            chartDataNetto.push(totalNettoBelopp);

            var yearBefore = year-1;
            var foundLastYear = false;
            resultYear.forEach(function(entryLast) {
                if(entryLast.Year == yearBefore) {
                    var lastYear = entryLast.Year;

                    var buySumBeloppLastYear = - bankdatatransaction.getBuyTransactionSumBelopp(lastYear);
                    var sellSumBeloppLastYear = bankdatatransaction.getSellTransactionSumBelopp(lastYear);

                    var totalNettoBeloppLastYear = buySumBeloppLastYear - sellSumBeloppLastYear;

                    var changeValue = totalNettoBelopp - totalNettoBeloppLastYear;
                    var growthValue = ((changeValue / totalNettoBeloppLastYear) * 100).toFixed(2);

                    chartDataGrowth.push(growthValue);

                    foundLastYear = true;
                }
                
            });

            if(foundLastYear == false) {
                chartDataGrowth.push(0);
            }

        });
    }
   
    function loadChart() {
        $(chartId).kendoChart({
            title: {
                text: "Köp/sälj/nettoinvesterat total - år"
            },
            legend: {
                position: "top"
            },
            seriesDefaults: {
                type: "column",
                labels: {
                    visible: true,
                    format: "#,0 kr",
                    background: "none"
                }
            },
            series: [{
                type: "column",
                data: chartDataSumBuy,
                name: "Köp",
                tooltip: {
                    visible: true,
                    format: "#,0 kr"
                }
            }
            ,{
                type: "column",
                data: chartDataSumSell,
                name: "Sälj",
                tooltip: {
                    visible: true,
                    format: "#,0 kr"
                }
            }
            ,{
                type: "column",
                data: chartDataNetto,
                name: "Nettoinvesterat",
                tooltip: {
                    visible: true,
                    format: "#,0 kr"
                }
            }
            ,{
                type: "line",
                data: chartDataGrowth,
                name: "Nettoutveckling",
                axis: "nettoutveckling",
                color: "#f2b661",
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
            seriesColors: colorArray,
            valueAxes: [{
                title: { text: "kr" },
                labels: {
                    format: "#,0 kr"
                }
            }, {
                labels: {
                    format: "{0} %"
                },
                name: "nettoutveckling",
                title: { text: "Nettoutveckling" }
            }],
            categoryAxis: {
                categories: chartDataYears,
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