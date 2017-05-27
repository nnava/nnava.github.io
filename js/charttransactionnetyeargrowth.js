define(['./bankdatatransaction', './colors'], function(bankdatatransaction, colors) {
    var chartDataSumSell = [];
    var chartDataSumBuy = [];
    var chartDataNetto = [];
    var chartDataYears = [];
    var colorArray = colors.getColorArray();
    var chartId;

    function resetArrayValues() {
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
            }],
            seriesColors: colorArray,
            valueAxes: [{
                title: { text: "kr" },
                labels: {
                    format: "#,0 kr"
                }
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