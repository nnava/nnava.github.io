define(['./colors', './alasqlportfoliodata'], function(colors, alasqlportfoliodata) {

    var chartData;
    var chartId;
    var colorArray = colors.getColorArray();

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(sort) {
        var resultAllocation = alasqlportfoliodata.getPortfolioAllocation(sort);
        var resultIndustry = alasqlportfoliodata.getPortfolioIndustrySort(sort);

        var industryData = [];
        var allocationData = [];
        var donutData = [];

        resultIndustry.forEach(function(entry) {
            if(entry == null) return;
            if(entry.name == null) return;

            industryData.push({ 
                "category": entry.name,
                "value": parseInt(entry.value),
                "antal": 0,
                "senastepris":0
            });
        });

        donutData.push({ 
            name: "Bransch",
            data: industryData
        });

        resultAllocation.forEach(function(entry) {
            if(entry == null) return;
            if(entry.name == null) return;

            allocationData.push({ 
                "category": entry.name,
                "value": parseInt(entry.value),
                "antal": entry.Antal,
                "senastepris": entry.SenastePris
            });
        });

        donutData.push({ 
            name: "Innehav",
            data: allocationData,
            labels: {
                visible: true,
                background: "transparent",
                position: "outsideEnd",
                template: "#= category # - #= kendo.format('{0:P}', percentage) #"
            }
        });
        
        chartData = donutData;
    }

    function loadChart() {
        $(chartId).kendoChart({
            plotArea: {
                background: ""
            },
            title: {
                text: "Fördelning innehav"
            },
            legend: {
                position: "top"
            },
            chartArea: {
                background: ""
            },
            seriesDefaults: {
                type: "donut"
            },
            series: chartData,
            seriesColors: colorArray,
            tooltip: {
                visible: true,
                template: "#= window.returnPortfolioAllocationTooltipText(category, kendo.format('{0:P}', percentage), value, dataItem) #"
            },
            theme: "bootstrap"
        });
    }

    window.returnPortfolioAllocationTooltipText = function returnPortfolioAllocationTooltipText(category, percentage, value, dataItem) {
        if(dataItem.antal === 0 && dataItem.senastepris === 0)
            return category + " - " + percentage + " (" + kendo.toString(value, 'n0') + ') kr';
        else
            return category + " - " + percentage + " (" + kendo.toString(value, 'n0') + ') kr' + "</br>" + "Antal: " + kendo.toString(dataItem.antal, 'n0') + " st á senaste pris: " + dataItem.senastepris + " kr";
    }

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart
    };
});