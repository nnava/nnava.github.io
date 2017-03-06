define(['./papaparse.min', './appcontrolhandler', './alasqlavanza', './alasqlnordnet', './alasqlbankdataexception'], 
    function(Papa, appControlHandler, alasqlavanza, alasqlnordnet, alasqlbankdataexception) {
  
    var controlId;

    function setControlId(fieldId) {
        controlId = fieldId;
    }

    function load() {
        $(controlId).kendoUpload({
            async: {         
                autoUpload: true
            },
            select: onSelect,
            remove: onRemove,
            validation: {
                allowedExtensions: [".csv"]
            },
            showFileList: true,
            multiple: true,
            localization: {
                select: 'Välj fil(er)',
                remove: 'Ta bort',
                cancel: 'Avbryt'
            }
        });
    }

    function onRemove(e) {

        $.each(e.files, function (index, value) {
            var reader = new FileReader();

            reader.onload = function(e) {
                var isFileAvanza = reader.result.startsWith("Datum");

                if(isFileAvanza) {
                    alasql('TRUNCATE TABLE AvanzaData');
                    alasql('TRUNCATE TABLE AvanzaPortfolio;');
                }
                else {
                    alasql('TRUNCATE TABLE NordnetData');
                    alasql('TRUNCATE TABLE NordnetPortfolio;');
                }

                appControlHandler.loadControls();
            }

            reader.readAsText(value.rawFile);
        });
    }

    var ALLOWED_EXTENSIONS = [".csv"];
    var maxFiles = 10;

    function onSelect(e) {

        if($('#dataFiles').parent().children('input[type=file]:not(#uploader)').length > maxFiles) {
            e.preventDefault();
            alert("Max antal filer är tio");
        }      

        kendo.ui.progress($(document.body), true);
     
        var fileArrayLength = e.files.length;
        var timeoutValue = 1;

        alasqlavanza.createDataTable();
        alasqlavanza.createPortfolioTable();
        alasqlnordnet.createDataTable();
        alasqlnordnet.createPortfolioTable();

        $.each(e.files, function (index, value) {

            var extension = value.extension.toLowerCase();
            if (ALLOWED_EXTENSIONS.indexOf(extension) == -1) {
                alert("Endast fil med filformat CSV");
                e.preventDefault();
            }

            console.log(index);
            
            var reader = new FileReader();
            reader.onloadend = function(e) {
                if(reader.error != null)
                    console.log(reader.error.message);

                if((index +1) == fileArrayLength) { 

                    alasqlbankdataexception.deleteAvanzaRowsToSkip();
                    alasqlbankdataexception.addAvanzaRowsForDividend();
                    alasqlbankdataexception.addNordnetRowsForDividend();
                    alasqlbankdataexception.addAvanzaRowsStocksSpecial();

                    setTimeout(function(){  appControlHandler.loadControls(); }, 10);                                       
                }
            }
 
            reader.onload = function(e) {
                var readerResultString = reader.result;
                var isFileAvanza = readerResultString.startsWith("Datum");

                readerResultString = replaceToNeededCharacters(readerResultString);

                if(isFileAvanza) {
                    alasql('INSERT INTO AvanzaData \
                    SELECT Antal, Belopp, Datum, YEAR(Datum) AS Year, MONTH(Datum) AS Month, ISIN, Konto, Kurs, [Typ av transaktion], Valuta, [Värdepapperbeskrivning] FROM CSV(?, {separator:";"})', [readerResultString]);
                    alasql('INSERT INTO AvanzaPortfolio SELECT DISTINCT Konto FROM CSV(?, {separator:";"})', [readerResultString]);
                }                    
                else {
                    var nordnetData = JSON.parse(getBankSourceJsonData(readerResultString));
                    alasql('INSERT INTO NordnetData \
                    SELECT [Id], "' + value.name + '" AS Konto, [Affärsdag], Antal, Avgifter, Belopp, [Bokföringsdag], ISIN, Instrumenttyp, Kurs, Likviddag, Makuleringsdatum, Transaktionstyp, Valuta, [Värdepapper], Transaktionstext, [Totalt antal] FROM ?', [nordnetData]);
                    alasql('INSERT INTO NordnetPortfolio VALUES (' + index + ', "' + value.name + '");');
                }

                console.log('done', index);
            }
            
            console.log(value.name);
            setTimeout(function(){ reader.readAsText(value.rawFile, 'ISO-8859-1'); }, timeoutValue);
            timeoutValue += 100;
        }); 
    };

    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    function replaceToNeededCharacters(stringValue) {

        stringValue = replaceAll(stringValue, "/", "");
        stringValue = replaceAll(stringValue, ",", ".");

        return stringValue;
    }

    function getBankSourceJsonData(stringValue) {

        var config = {
            header: true,
            skipEmtyLines: true
        };

        var parsedResult = Papa.parse(stringValue, config);
        return JSON.stringify(parsedResult.data);
    }

    function getFilesCount() {
        var uploadControl = $(controlId).data("kendoUpload"),
                            files = uploadControl.getFiles();
        return files.length;
    }

    return {
        setControlId: setControlId,
        getFilesCount: getFilesCount,
        load: load
    }

});