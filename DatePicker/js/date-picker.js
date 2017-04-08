$.fn.datePicker = function () {
    var $datePicker = $(this);
    var $dateInput = $datePicker.find(".picker-target");
    var _now = new Date();

    var _selectedYear = _now.getFullYear();
    var _selectedMonth = _now.getMonth() + 1;
    var _selectedDate = _now.getDate();

    var _obj_month = {
        '1': "January",
        '2': "February",
        '3': "March",
        '4': "April",
        '5': "May",
        '6': "June",
        '7': "July",
        '8': "August",
        '9': "September",
        '10': "October",
        '11': "November",
        '12': "December",
    }

    var initializeDatePicker = function () {
        $datePicker.append("<div class='calendar'>" +
          "<div class='years-wrapper'></div>" +
          "<div class='months-wrapper'></div>" +
          "<div class='dates-wrapper'></div>" +
          "<div class='close-wrapper'><a href='javascript:void(0)' class='close-picker'>Close</a></div>" +
          "</div>"
        );
    }

    var wireEvents = function () {
        $('.close-picker', $datePicker).on('click', function () {
            closeCalendar();
        });

        $($dateInput).on("click", function (e) {
            closeCalendar();
            $($datePicker).find(".calendar").addClass("visible");
        });

    }

    var closeCalendar = function () {
        $('.calendar').removeClass('visible');
    }

    var printYearsToPicker = function (year) {
        var $yearsWrapper = $datePicker.find(".years-wrapper");
        var yearHtml = "";
        year = year - 2;
        for (i = 0; i < 5; i++) {
            yearHtml = yearHtml + "<a href='javascript:void(0)' class='year' data-value='" + year + "' " + "'>" + year + "</a>"
            year++;
        }
        $yearsWrapper.append(yearHtml);
        attachClickToYears();
    }

    var printMonthsToPicker = function () {
        var $monthWrapper = $datePicker.find(".months-wrapper");
        var monthHtml = "";
        for (i = 1; i <= 12; i++) {
            monthHtml = monthHtml + "<a href='javascript:void(0)' class='month' data-value='" + i + "' " + "'>" + _obj_month[i] + "</a>";
        }
        $monthWrapper.append(monthHtml);
        attachClickToMonths();
    }

    var printDatesToPicker = function (month, year) {
        var monthDays = daysInTheMonth(month, year);
        var $dateWrapper = $datePicker.find(".dates-wrapper");
        var dateHtml = "";

        var startDate = getMonthStartDay(month, year);

        for (i = 1; i <= startDate; i++) {
            dateHtml = dateHtml + "<span class='day-spacer'></span>";
        }

        var pos = i;

        for (i = 1; i <= monthDays; i++) {
            dateHtml = dateHtml + "<a href='javascript:void(0)' " + "class='day' data-value='" + i + "'>" + i + "</a>";
            if ((pos % 7) == 0) {
                dateHtml = dateHtml + "<br />";
            }
            pos++;
        }

        $dateWrapper.append(dateHtml);
        attachClickToDays();
    }

    var daysInTheMonth = function (month, year) {
        return new Date(year, month, 0).getDate();
    }

    var getMonthStartDay = function (month, year) {
        return new Date(month + "/1/" + year).getDay();
    }

    var attachClickToDays = function () {
        $datePicker.find(".day").on("click", function () {
            _selectedDate = getDataValue($(this));
            clearSelectedMarkers("day");
            $(this).addClass("selected");
            writeDateToInput();
            addSelectedMarkers();

        })
    }

    var attachClickToMonths = function () {
        $datePicker.find(".month").on("click", function () {
            clearSelectedMarkers("month");
            $(this).addClass("selected");
            _selectedMonth = getDataValue($(this));
            clearCalendarDates();
            printDatesToPicker(_selectedMonth, _selectedYear);
            addSelectedMarkers();
            writeDateToInput();
        })
    }

    var attachClickToYears = function () {
        $datePicker.find(".year").on("click", function () {
            clearSelectedMarkers("year");
            $(this).addClass("selected");
            _selectedYear = getDataValue($(this));
            clearCalendarDates();
            printDatesToPicker(_selectedMonth, _selectedYear);
            addSelectedMarkers();
            writeDateToInput();

        })
    }

    var attachClickToClose = function () {
        $datePicker.find(".close-picker").on("click", function () {
            $datePicker.find(".calendar.visible").removeClass("visible");
        })
    }

    var clearSelectedMarkers = function (selector) {
        $datePicker.find("." + selector).each(function () {
            $(this).removeClass("selected");
        });
    }

    var clearCalendarDates = function () {
        $datePicker.find(".dates-wrapper").html("");
    }

    var getDataValue = function (element) {
        return $(element).attr("data-value")
    }

    var writeDateToInput = function () {
        $dateInput.val(_obj_month[_selectedMonth] + " " + _selectedDate + ", " + _selectedYear);
    }

    var addSelectedMarkers = function () {
        $datePicker.find(".years-wrapper").find("[data-value='" + _selectedYear + "']").addClass("selected");
        $datePicker.find(".months-wrapper").find("[data-value='" + _selectedMonth + "']").addClass("selected");
        $datePicker.find(".dates-wrapper").find("[data-value='" + _selectedDate + "']").addClass("selected");
    }

    //INITIALIZING PICKER
    initializeDatePicker();
    wireEvents();
    printYearsToPicker(_selectedYear);
    printMonthsToPicker();
    printDatesToPicker(_selectedMonth, _selectedYear);
    attachClickToClose();
    addSelectedMarkers();
    writeDateToInput();

}

$(document).ready(function () {
    $(".date-picker1").datePicker();
    $(".date-picker2").datePicker();
});

//$(".submit").on("click", function () {
//    var inputValue = $(".start-time").val();
//    var d = new Date(inputValue);
//    d.setHours(9);
//    d.setMinutes(30);
//    alert(d);
//})

//$(".end-time").datePicker();