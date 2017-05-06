define([], function() {
    var id;

    function setId(fieldId) {
        id = fieldId;
    }

    function load() {
        $(id).kendoWindow({
            width: "98%",
            height: "65%",
            title: "Portfördelning villkor",
            content: "../portfoliodistributionterms.html",
            visible: false,
            actions: ["Close"],
            close: onClose
        });
    }

    function open() {
        $(id).data("kendoWindow").center().open();
    }

    function onClose(e) {
        if(e.userTriggered) {
            $('.nav-tabs a[href="#home"]').tab('show');
        }
    }

    return {
        setId: setId,
        load: load,
        open: open
    };
});