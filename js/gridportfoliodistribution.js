define(['./alasqlportfoliodata', './alasqlstockmarketlinkdata', './bankdataportfolio', './clipboard'], function(alasqlportfoliodata, alasqlstockmarketlinkdata, bankdataportfolio, clipboard) {

    var gridData;
    var gridId;
    var portfolioData;

    function setId(fieldId) {
        gridId = fieldId;
    }

    function getCreatedDataSource(portfolioData) {
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: function(options) {
                    options.success(portfolioData);
                },
                update: function (options) {
                    options.success();
                }                
            },
            schema: {
                model: {
                    id: "ID",
                    fields: {
                        ID: { type: "number", editable: false },
                        ISIN: { type: "string", editable: false },
                        Symbol: { type: "string", editable: false },
                        Värdepapper: { type: "string", editable: false },
                        Marknadsvärde: { type: "number", editable: false },
                        Antal: { type: "number", editable: false },
                        SenastePris: { type: "number", editable: true },
                        AktuellFördelning: { type: "number", editable: false },
                        NyFördelning: { type: "number", validation: { required: true, min: 0 } },
                        NyMarknadsvärde: { type: "number", editable: false },
                        DiffAntal: { type: "number", editable: false }      
                    }
                }
            },
            aggregate: [ { field: "NyFördelning", aggregate: "sum" },
                         { field: "Marknadsvärde", aggregate: "sum" },
                         { field: "NyMarknadsvärde", aggregate: "sum" }
            ],
            pageSize: portfolioData.length
        });

        return dataSource;
    }

    function setData() {        
        portfolioData = bankdataportfolio.getPortfolioDistributionData();
        gridData = getCreatedDataSource(portfolioData);
    }

    function load() {
        if($(gridId).data('kendoGrid')) {
            $(gridId).data('kendoGrid').destroy();
            $(gridId).empty();
        }

        var grid = $(gridId).kendoGrid({
            toolbar: kendo.template($("#gridportfoliodistribution_toolbar_template").html()),
            excel: {
                fileName: "fördelning.xlsx",
                filterable: true
            },
            pdf: {
                fileName: "fördelning.pdf",
                allPages: true,
                avoidLinks: true,
                paperSize: "A4",
                margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                landscape: true,
                repeatHeaders: true,
                scale: 0.8
            },
            dataSource: gridData,
            scrollable: true,
            sortable: true,
            pageable: false,
            columns: [
                { field: "ID", hidden: true },
                { field: "ISIN", hidden: true },
                { field: "Symbol", hidden: true },
                { field: "Värdepapper", title: "Värdepapper", width: "50px" },
                { field: "Antal", title: "Nuv. antal", format: "{0:n0} st", width: "15px" },
                { field: "SenastePris", title: "Senaste", format: "{0:n2} kr", width: "15px" },
                { field: "Marknadsvärde", title: "Markn.värde", format: "{0:n2} kr", width: "20px", aggregates: ["sum"], footerTemplate: "Summa: #= kendo.toString(sum, 'n2') # kr" },
                { field: "AktuellFördelning", title: "Aktuell fördelning", format: "{0}%", width: "25px", footerTemplate: gridPercentageToDistributeGroupFooterTemplate },
                { field: "NyFördelning", title: "Ny fördelning", format: "{0}%", width: "25px", aggregates: ["sum"], footerTemplate: gridPercentageNewDistributeGroupFooterTemplate },
                { field: "NyMarknadsvärde", title: "Nytt markn.värde", format: "{0:n2} kr", width: "20px", aggregates: ["sum"], footerTemplate: "Summa: #= kendo.toString(sum, 'n2') # kr" },
                { field: "DiffAntal", title: "Diff antal", format: "{0:n0} st", width: "15px" },
                { title: "Köp/sälj", template: '<a class="k-button k-grid-CustomCommand" href="\\#">#= bankBuyOrSellText(data) #</a>', width: "13px" }
            ],
            editable: true,
            save: function (e) {
                var ID = e.model.ID;
                var newWeightPercentage = e.values["NyFördelning"];
                var newLatestPrice = e.values["SenastePris"];
                if(newLatestPrice == null)
                    alasqlportfoliodata.updatePortfolioDistributionNewWeightPercentageRow(ID, newWeightPercentage);
                else {
                    alasqlportfoliodata.updatePortfolioDistributionNewLatestPriceRow(ID, newLatestPrice);
                    alasqlportfoliodata.updatePortfolioDistributionCalculatedValuesWithNewLatestPriceRow(ID, newLatestPrice);
                    alasqlportfoliodata.updatePortfolioLastPriceRow(newLatestPrice, e.model.Symbol);
                }

                portfolioData = alasqlportfoliodata.getPortfolioDistributionDataNewWeight();

                var dataSource = getCreatedDataSource(portfolioData);
                var grid = $(gridId).data("kendoGrid");
                dataSource.read();
                grid.setDataSource(dataSource);

                e.sender.saveChanges();
            },
            theme: "bootstrap",
        }).data("kendoGrid");

        grid.tbody.on("click", ".k-grid-CustomCommand", function(e) {
            var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));            
            var ISIN = dataItem.ISIN;
            var isClickSell = dataItem.DiffAntal < 0;
            clipboard.copy(Math.abs(dataItem.DiffAntal));
            var url = alasqlstockmarketlinkdata.getBankUrlFromIsin(ISIN, getSelectedBank(), isClickSell);
            window.open(url, '_blank');

            e.preventDefault();
        });

        grid.thead.kendoTooltip({
            filter: "th",
            content: function (e) {
                var target = e.target; 
                return $(target).text();
            }
        });
    }

    function getSelectedBank() {
        var portfolioDistributionBankBtnGroup = $("#portfolioDistributionBankBtnGroup").data("kendoMobileButtonGroup");
        return portfolioDistributionBankBtnGroup.current().index() == 0 ? "AZA" : "NN";
    }

    function gridPercentageNewDistributeGroupFooterTemplate(e) {
        var percentageCurrentDistribution = e.NyFördelning.sum;
        var returnText = "Summa: " + kendo.toString(percentageCurrentDistribution, 'n2') + "%";
        if(percentageCurrentDistribution > 100.1)
            returnText = "<div class='red'>" + returnText + "</div>";
        return returnText;
    }

    function gridPercentageToDistributeGroupFooterTemplate(e) {
        var currentDistribution = e.NyFördelning.sum;
        var percentageToDistribute = (100 - currentDistribution);
        if(percentageToDistribute < 0)
            percentageToDistribute = 0;

        return "Kvar att fördela: " + kendo.toString(percentageToDistribute, 'n2') + "%";
    }

    window.bankBuyOrSellText = function bankBuyOrSellText(data) {
        return data.DiffAntal > 0 ? "Köp" : "Sälj";
    }

    window.portfolioDistributionEqualize = function portfolioDistributionEqualize() {
        setData();
        load();
    }

    return {
        setId: setId,
        setData: setData,
        load: load
    };
});