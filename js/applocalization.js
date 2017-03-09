define(['./alasqllocalization'], function(alasqllocalization) {

    function loadLanguage(language) {
        if(language == "se") {
            loadSwedish();            
        }
        else if(language == "no") {
            loadNorwegian();            
        }
    }

    function loadNorwegian() {
        alasqllocalization.createUserLocalizationTable();
        alasqllocalization.insertUserLocalization("NOK");
    }

    function loadSwedish() {
        alasqllocalization.createUserLocalizationTable();
        alasqllocalization.insertUserLocalization("SEK");
    }

    return { 
        loadLanguage: loadLanguage
    };
});