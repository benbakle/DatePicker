$.fn.datePicker = function () {
    var $datePicker = $(this);
    var $dateInput = $datePicker.find(".picker-input");

    var _now = new Date();
    var _selectedYear = _now.getFullYear();
    var _selectedMonth = _now.getMonth() + 1;
    var _selectedDate = _now.getDate();
    var _selectedHour = _now.getHours();
    var _selectedMinute = _now.getMinutes();
    var _selectedMeridian = (_selectedHour > 12) ? "PM" : "AM";


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
        $datePicker.append("<div class='picker'>" +
          "<div class='picker-nav'>" +
          "<a href='javascript:void(0)' class='date-link'></a>" +
          "<a href='javascript:void(0)' class='time-link'></a>" +
          "</div>" +
          "<div class='calendar active'>" +
          "<div class='years-wrapper'></div>" +
          "<div class='months-wrapper'></div>" +
          "<div class='dates-wrapper'></div>" +
          "</div>" +
          "<div class='time'>" +
          "<div class='hours-wrapper'></div>" +
          "<div class='minutes-wrapper'></div>" +
           "<div class='meridian-wrapper'>" +
          "<a href='javascript:void(0)' class='meridian' data-value='AM'>AM</a>" +
          "<a href='javascript:void(0)' class='meridian' data-value='PM'>PM</a>" +
          "</div>" +
          "</div>" +
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
            $(".picker", $datePicker).addClass("active");
        });

        $(".date-link", $datePicker).on("click", function () {
            $(".time", $datePicker).removeClass("active");
            $(".calendar", $datePicker).addClass("active");
        });

        $(".time-link", $datePicker).on("click", function () {
            $(".calendar", $datePicker).removeClass("active");
            $(".time", $datePicker).addClass("active");
        });

        attachClickToMeridian();


        $(document).on("mouseup", function (e) {
            var container = $(".picker");
            if (!container.is(e.target) // if the target of the click isn't the container...
              &&
              container.has(e.target).length === 0) // ... nor a descendant of the container
            {
                closeCalendar();
            }
        });

    }

    var closeCalendar = function () {
        $('.picker').removeClass('active');
    }

    var printYearsToPicker = function (year) {
        var $yearsWrapper = $datePicker.find(".years-wrapper");
        var yearHtml = "";
        year = year - 1;
        for (i = 0; i < 3; i++) {
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

    var printHoursToPicker = function () {
        var $hoursWrapper = $(".hours-wrapper", $datePicker);
        var hourHtml = "";
        for (i = 1; i <= 12; i++) {
            hourHtml = hourHtml + "<a href='javascript:void(0)' class='hour' data-value='" + i + "' " + "'>" + i + "</a>"
        }
        $hoursWrapper.append(hourHtml);
        attachClickToHours();
    }

    var printMinutesToPicker = function () {
        var $minutesWrapper = $(".minutes-wrapper", $datePicker);
        var minuteHtml = "";
        for (i = 0; i <= 55; i = i + 5) {
            var iEdited = setIntegerLength(i, 2);
            minuteHtml = minuteHtml + "<a href='javascript:void(0)' class='minute' data-value='" + iEdited + "' " + "'>" + iEdited + "</a>"
        }
        $minutesWrapper.append(minuteHtml);
        attachClickToMinutes();
    }

    var setIntegerLength = function (i, intLength) {
        return (i * .01).toFixed(2).split(".")[1];
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

    var attachClickToHours = function () {
        $datePicker.find(".hour").on("click", function () {
            clearSelectedMarkers("hour");
            $(this).addClass("selected");
            _selectedHour = getDataValue($(this));
            addSelectedMarkers();
            writeDateToInput();

        })
    }

    var attachClickToMinutes = function () {
        $datePicker.find(".minute").on("click", function () {
            clearSelectedMarkers("minute");
            $(this).addClass("selected");
            _selectedMinute = getDataValue($(this));
            addSelectedMarkers();
            writeDateToInput();

        })
    }
    var attachClickToMeridian = function () {
        $datePicker.find(".meridian").on("click", function () {
            clearSelectedMarkers("meridian");
            $(this).addClass("selected");
            _selectedMeridian = getDataValue($(this));
            addSelectedMarkers();
            writeDateToInput();

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
    var toStandardTime = function (milTime) {
        if (milTime == 0) { milTime = 12 };
        return (milTime > 12) ? milTime - 12 : milTime;
    }

    var roundTimeToNearest5 = function (time) {
        time = Math.ceil(time / 5) * 5
        if(time == 60){
            return 55;
        }
        return time;
    }

    var writeDateToInput = function () {
        var test = _selectedMeridian;
        $dateInput.val(_obj_month[_selectedMonth] + " " +
            _selectedDate + ", " + _selectedYear + " " +
            toStandardTime(_selectedHour) + ":" + setIntegerLength(roundTimeToNearest5(_selectedMinute), 2) + " " + _selectedMeridian);
    }

    var addSelectedMarkers = function () {
        $datePicker.find(".years-wrapper").find("[data-value='" + _selectedYear + "']").addClass("selected");
        $datePicker.find(".months-wrapper").find("[data-value='" + _selectedMonth + "']").addClass("selected");
        $datePicker.find(".dates-wrapper").find("[data-value='" + _selectedDate + "']").addClass("selected");
        $datePicker.find(".hours-wrapper").find("[data-value='" + toStandardTime(_selectedHour) + "']").addClass("selected");
        $datePicker.find(".minutes-wrapper").find("[data-value='" + roundTimeToNearest5(_selectedMinute) + "']").addClass("selected");
        $datePicker.find(".meridian-wrapper").find("[data-value='" + _selectedMeridian + "']").addClass("selected");
    }

    //INITIALIZING PICKER
    initializeDatePicker();
    printYearsToPicker(_selectedYear);
    printMonthsToPicker();
    printDatesToPicker(_selectedMonth, _selectedYear);
    printHoursToPicker();
    printMinutesToPicker();
    addSelectedMarkers();
    writeDateToInput();
    wireEvents();


}

$(document).ready(function () {
    $(".start-time").datePicker();
    $(".end-time").datePicker();
});

//$(".submit").on("click", function () {
//    var inputValue = $(".start-time").val();
//    var d = new Date(inputValue);
//    d.setHours(9);
//    d.setMinutes(30);
//    alert(d);
//})

//$(".end-time").datePicker();