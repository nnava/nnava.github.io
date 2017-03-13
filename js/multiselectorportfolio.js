define(['./alasqlavanza', './alasqlnordnet', './alasqlportfolio'], function(alasqlavanza, alasqlnordnet, alasqlportfolio) {

    var data = [];
    var dataSelected = [];
    var multiselectorId;

    function setMultiselectorId(fieldId) {
        multiselectorId = fieldId;
    }

    function setData() {
        var portfolioData = alasqlportfolio.getPortfolios();
        var nordnetData = alasqlnordnet.getSelectedPortfolios();
        var avanzaData = alasqlavanza.getSelectedPortfolios();
        var bankDataSelectedPortfolios = nordnetData.concat(avanzaData);
        
        data = [];
        portfolioData.forEach(function(entry) {
            if (entry.Konto == null) { return; }
            data.push({ text: entry.Konto, value: entry.Konto });
        });

        dataSelected = [];
        bankDataSelectedPortfolios.forEach(function(entry) {
            if (entry.Konto == null) { return; }
            dataSelected.push({ text: entry.Konto, value: entry.Konto });
        });
    }

    function loadMultiselector() {

        if(data.length == 0) return;
        var multiselect = $(multiselectorId).data("kendoMultiSelect");
        if(multiselect) {
            multiselect.setDataSource(data);
            $(multiselectorId).getKendoMultiSelect().value(dataSelected);
            saveValues();
            return;
        } 

        $('#portfolioSelector').attr("class", "row top15");
        $(multiselectorId).kendoMultiSelect({
            filter: "startswith",
            dataTextField: "text",
            dataValueField: "value",
            dataSource: data,
            ignoreCase: true,
            autoWidth: true,
            animation: {
                close: {
                    effects: "fadeOut zoom:out",
                    duration: 200
                },
                open: {
                    effects: "fadeIn zoom:in",
                    duration: 500
                }
            },
            theme: "bootstrap"
        });

        $(multiselectorId).getKendoMultiSelect().value(data);
    }

    function saveValues() {
        alasqlavanza.truncatePortfolioData();
        alasqlnordnet.truncatePortfolioData();

        var multiselect = $(multiselectorId).data("kendoMultiSelect");
        if(multiselect) {
            var dataItems = multiselect.dataItems();
            if(dataItems == null) return;
            var i = 0;
            dataItems.forEach(function(entry) {
                if(entry.value.endsWith("csv")) {
                    alasqlnordnet.insertPortfolioData(i, entry.value);
                    i++;
                } else {
                    alasqlavanza.insertPortfolioData(entry.value);
                }        
            });  
        }
    }

    return {
        setMultiselectorId: setMultiselectorId,
        setData: setData,
        loadMultiselector: loadMultiselector,
        saveValues: saveValues
    };
});