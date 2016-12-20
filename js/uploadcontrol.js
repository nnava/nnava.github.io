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
    var maxFiles = 2;

    function onSelect(e) {

        if($('#dataFiles').parent().children('input[type=file]:not(#uploader)').length > maxFiles) {
            e.preventDefault();
            alert("Max antal filer är två och då en Avanza och en Nordnet");
        }

        var addedFilesCount = e.files.length;
        
        var loadControlsWaiter = 0;
        if(addedFilesCount > 1)
            loadControlsWaiter = 1;

        $.each(e.files, function (index, value) {
            
            var extension = value.extension.toLowerCase();
            if (ALLOWED_EXTENSIONS.indexOf(extension) == -1) {
                alert("Endast fil med filformat CSV");
                e.preventDefault();
            }

            var reader = new FileReader();
            reader.onload = function(e) {
                var jsonResultString = getBankSourceJsonData(reader.result);                  
                var isFileAvanza = reader.result.startsWith("Datum");

                if(isFileAvanza)
                    $('#avanzaData').val(jsonResultString);
                else
                    $('#nordnetData').val(jsonResultString);

                $("#btnExportToPdf").kendoButton().data("kendoButton").enable(true);

                if(loadControlsWaiter == 0)
                    appControlLoader.loadControls();

                loadControlsWaiter--;
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