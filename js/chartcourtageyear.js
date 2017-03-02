define(['./bankdatacourtage', ], function(bankdatacourtage) {

    var chartData;
    var chartId;
    var chartYearValues = [];
    var total = [];
    var nordnetSellValues = [];
    var nordnetBuyValues = [];
    var avanzaSellValues = [];
    var avanzaBuyValues = [];
    var chartDataCourtageGrowth = [];

    function resetArrayValues() {
        chartYearValues = [];
        chartDataCourtageGrowth = [];
        nordnetSellValues = [];
        nordnetBuyValues = [];
        avanzaSellValues = [];
        avanzaBuyValues = [];
    }

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData() {

        resetArrayValues();

        var resultYear = bankdatacourtage.getCourtageYears();

        var addedYear = [];
        total = [];

        resultYear.forEach(function(entry) {

            if (entry.Year == null) { return; }
            if (addedYear.includes(entry.Year)) return;

            var year = entry.Year;

            addedYear.push(year);

            var nordnetCourtageBuy = bankdatacourtage.getNordnetCourtageSumBuy(year);
            var nordnetCourtageSell = bankdatacourtage.getNordnetCourtageSumSell(year);
            var avanzaCourtageBuy = bankdatacourtage.getAvanzaCourtageSumBuy(year);
            var avanzaCourtageSell = bankdatacourtage.getAvanzaCourtageSumSell(year);

           var totalBelopp = nordnetCourtageBuy + nordnetCourtageSell + avanzaCourtageBuy + avanzaCourtageSell;

            total[year] = totalBelopp;

            nordnetSellValues.push(nordnetCourtageSell);
            nordnetBuyValues.push(nordnetCourtageBuy);
            avanzaSellValues.push(avanzaCourtageSell);
            avanzaBuyValues.push(avanzaCourtageBuy);
 
            var yearBefore = year-1;
            var foundLastYear = false;
            resultYear.forEach(function(entryLast) {
                if(entryLast.Year == yearBefore) {
                    var totalBeloppLastYear = getTotalCourtageForYear(yearBefore);

                    var changeValue = totalBelopp - totalBeloppLastYear;
                    var growthValue = ((changeValue / totalBeloppLastYear) * 100).toFixed(2);

                    chartDataCourtageGrowth.push(growthValue);

                    foundLastYear = true;
                }
                
            });

            if(foundLastYear == false) {
                chartDataCourtageGrowth.push(0);
            }
        });

        var data = [];

        var labelTotalVisibleNordnet = true;
        var labelTotalVisibleAvanza = false;

        if(nordnetBuyValues.some(isBiggerThan0) && avanzaBuyValues.some(isBiggerThan0)) {
            labelTotalVisibleAvanza = false;
            labelTotalVisibleNordnet = true;
        };

        if(nordnetBuyValues.some(isBiggerThan0) == false && avanzaBuyValues.some(isBiggerThan0)) {
            labelTotalVisibleAvanza = true;
            labelTotalVisibleNordnet = false;
        };

        if(avanzaBuyValues.some(isBiggerThan0)) {
            data.push({
                type: "column",
                field: "avabuy",
                name: "Avanza köp-courtage",
                color: "#009640",
                data: avanzaBuyValues
            });
        };
0
        if(avanzaSellValues.some(isBiggerThan0)) {
            data.push({
                type: "column",
                field: "avasell",
                name: "Avanza sälj-courtage",
                color: "#00cc58",
                data: avanzaSellValues,
                labels: {
                    visible: labelTotalVisibleAvanza,
                    template: "#= window.getChartCourtageLabelText(category) #",                
                    position: "outsideEnd"
                }
            });
        };

        if(nordnetBuyValues.some(isBiggerThan0)) {
            data.push({
                type: "column",
                field: "nnbuy",
                color: "#00A8EF",
                name: "Nordnet köp-courtage",
                data: nordnetBuyValues
            });
        };

        if(nordnetSellValues.some(isBiggerThan0)) {
            data.push({
                type: "column",
                field: "nnsell",
                name: "Nordnet sälj-courtage",
                color: "#4dc9ff",
                data: nordnetSellValues,
                labels: {
                    visible: labelTotalVisibleNordnet,
                    template: "#= window.getChartCourtageLabelText(category) #",                
                    position: "outsideEnd"
                }
            });
        };

        data.push({
            type: "line",
            data: chartDataCourtageGrowth,
            name: "Courtageutveckling",
            axis: "courtageutveckling",
            color: "#F2B661",
            tooltip: {
                visible: true,
                format: "{0} %"
            },
            labels: {
                rotation: 0,
                visible: true,
                format: "{0} %"
            }
        });

        chartYearValues = addedYear; 
        chartData = data;
    }

    function getTotalCourtageForYear(year) {
        var nordnetCourtageBuy = bankdatacourtage.getNordnetCourtageSumBuy(year);
        var nordnetCourtageSell = bankdatacourtage.getNordnetCourtageSumSell(year);
        var avanzaCourtageBuy = bankdatacourtage.getAvanzaCourtageSumBuy(year);
        var avanzaCourtageSell = bankdatacourtage.getAvanzaCourtageSumSell(year);
        var totalBelopp = nordnetCourtageBuy + nordnetCourtageSell + avanzaCourtageBuy + avanzaCourtageSell;
        return totalBelopp;
    }

    window.getChartCourtageLabelText = function getChartCourtageLabelText(category) {
        return kendo.toString(total[category], 'n2') + ' kr';
    }

    function isBiggerThan0(element, index, array) {
        return element > 0;
    }

    function loadChart() {
        $(chartId).kendoChart({
            title: {
                text: "Courtage - år"
            },
            legend: {
                position: "bottom"
            },
            seriesDefaults: {
                type: "column",
                stack: true
            },
            series: chartData,
            valueAxes: [{
                title: { text: "kr" },
                labels: {
                    format: "#,0 kr"
                }
            }, {
                labels: {
                    format: "{0} %"
                },
                name: "courtageutveckling",
                title: { text: "Courtageutveckling" }
            }],
            categoryAxis: {
                categories: chartYearValues,
                majorGridLines: {
                    visible: true
                }
            },
            tooltip: {
                visible: true,
                template: "${series.name} - #= kendo.toString(value, 'n2') # kr"
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