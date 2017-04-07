define([], function() {
    var colors = ['#356fa2', '#499ab2', '#4a934a', '#c2924e', '#ae2f2b', '#f44336', '#e91e63', '#9c27b0', '#3f51b5', '#00bcd4', '#009688', '#4caf50', '#cddc39', '#ffeb3b', '#ff9800' ,'#795548'
    ,'#9e9e9e', '#607d8b', '#f50057', '#d500f9', '#651fff', '#3d5afe', '#2979ff', '#00b0ff', '#00e5ff', '#1de9b6', '#00e676', '#76ff03', '#c6ff00', '#ffea00', '#ffc400', '#ff9100', '#ec407a', '#ab47bc', '#42a5f5', '#00C851', '#ffbb33'];

    function getColorArray() {
        return colors;
    };

    return { 
        getColorArray: getColorArray
    };
});