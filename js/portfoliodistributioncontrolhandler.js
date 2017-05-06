define(['./gridportfoliodistribution', './alasqlavanza', './alasqlnordnet', './alasqlportfoliodata', './alasqlstockdata'], 
     function(gridPortfolioDistribution, alasqlavanza, alasqlnordnet, alasqlportfoliodata, alasqlstockdata) {

    var localStoragePortfolioDistributionBankBtnGroupIndexField = "portfolioDistributionBankBtnGroupIndexValue";

    function loadGridPortfolioDistribution() {
        gridPortfolioDistribution.setId("#gridPortfolioDistribution");
        gridPortfolioDistribution.setData();
        gridPortfolioDistribution.load();
    }

    function loadControls() {
        loadGridPortfolioDistribution();
        loadPortfolioDistributionDanger();
    }

    function loadPortfolioDistributionDanger() {
        var stocksMissingPrice = alasqlportfoliodata.getPortfolioLastPriceDataMissingPrice();
        if(stocksMissingPrice.length === 0) return;
        var stocksText = "";
        for(var i=0; i < stocksMissingPrice.length; i++) {
            var symbol = stocksMissingPrice[i].Symbol;
            var name = alasqlstockdata.getVärdepapperNamnFromYahooSymbol(symbol);
            if(i == 0)
                stocksText = name;
            else 
                stocksText += ", " + name
        }

        var warningText = "Senaste pris saknas för följande värdepapper:" + stocksText + ", komplettera uppgifter manuellt genom att redigera senastepris och ny fördelning";
        $("#spanPortfolioDistributionDanger").text(warningText);
        $('#divPortfolioDistributionDanger').attr("class", "alert alert-danger alert-dismissable");
    }

    function initPortfolioDistributionBankBtnGroup() {
        var indexValue = getSelectedBankIndexValue();

        $("#portfolioDistributionBankBtnGroup").kendoMobileButtonGroup({
            select: function(e) {
                localStorage.setItem(localStoragePortfolioDistributionBankBtnGroupIndexField, e.index);
            },
            index: indexValue
        });
    }

    function getSelectedBankIndexValue() {
        var hasAvanzaTableRows = alasqlavanza.hasDataTableRows();
        var hasNordnetTableRows = alasqlnordnet.hasDataTableRows();
        if(hasAvanzaTableRows && !hasNordnetTableRows)
            return 0;
        else if (hasNordnetTableRows && !hasAvanzaTableRows)
            return 1;
        else if (hasAvanzaTableRows && hasNordnetTableRows) {
            var indexValue = localStorage.getItem(localStoragePortfolioDistributionBankBtnGroupIndexField);
            return indexValue == null ? 0 : parseInt(indexValue);
        }
        else {
            return 0;
        }        
    }

    return {
        loadControls: loadControls,
        initPortfolioDistributionBankBtnGroup: initPortfolioDistributionBankBtnGroup
    }
});