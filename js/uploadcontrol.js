define(['./papaparse.min', './appcontrolloader'], function(Papa, appControlLoader) {
  
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
            complete: function(files) { console.log('complete');  },
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

                if(isFileAvanza)
                    $('#avanzaData').val('');
                else
                    $('#nordnetData').val('');

                appControlLoader.loadControls();
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

        $.each(e.files, function (index, value) {

            var extension = value.extension.toLowerCase();
            if (ALLOWED_EXTENSIONS.indexOf(extension) == -1) {
                alert("Endast fil med filformat CSV");
                e.preventDefault();
            }

            var reader = new FileReader();
            reader.onload = function(e) {
                var hasNordnetDataValue = false;
                if($('#nordnetData').val())
                    hasNordnetDataValue = true;

                var readerResultString = reader.result;

                // If we already have a file of NN, remove first line for this
                if(hasNordnetDataValue) {
                    readerResultString = readerResultString.substring(readerResultString.indexOf("\n") + 1);
                }
                         
                var isFileAvanza = readerResultString.startsWith("Datum");

                if(isFileAvanza) {
                    $('#avanzaData').val(getBankSourceJsonData(readerResultString));
                }                    
                else {

                    if(hasNordnetDataValue) {
                        $('#nordnetDataString').val($('#nordnetDataString').val() + readerResultString);
                    }
                    else {
                        $('#nordnetDataString').val(readerResultString);
                    }

                    $('#nordnetData').val(getBankSourceJsonData($('#nordnetDataString').val()));
                }
                    
                $("#btnExportToPdf").kendoButton().data("kendoButton").enable(true);

                appControlLoader.loadControls();
            }

            reader.readAsText(value.rawFile, 'ISO-8859-1');            
        });       

    };

    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    function getBankSourceJsonData(stringValue) {

        stringValue = replaceAll(stringValue, "ö", "o");
        stringValue = replaceAll(stringValue, "ä", "a");
        stringValue = replaceAll(stringValue, "Ä", "A");
        stringValue = replaceAll(stringValue, "Ö", "O");
        stringValue = replaceAll(stringValue, ",", ".");
        stringValue = replaceAll(stringValue, "/", "");

        var config = {
            header: true,
            skipEmtyLines: true
        };

        var parsedResult = Papa.parse(stringValue, config);
        return JSON.stringify(parsedResult.data);
    }

    return {
        setControlId: setControlId,
        load: load
    }

});