window.wrapIt= (function () {
    function wrapItPicker(selector) {
      //  alert(selector);
    }

    var picker = {
        Picker: function (selector) {
            return wrapItPicker(selector);
        }
    };

    return picker;
}());





$(document).ready(function () {
    //$(".start-time").datePicker();
    //$(".end-time").datePicker();
    //$(".close-picker").on("click", function () {
    //    var result = $(this).closest(".picker").siblings(".picker-input").val();
    //    $(".container").append("<p>" + new Date(result) + "</p>");
    //})
    wrapIt.Picker("no");
});
