$.fn.datePicker = function () {
    var $dateInput = $(this);
    var _now = new Date();

    var _selectedYear = _now.getFullYear();
    var _selectedMonth = _now.getMonth() + 1;
    var _selectedDate = _now.getDate();

    var $calendar = $(".calendar");

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

    var writeDateToInput = function () {
        $dateInput.val(_obj_month[_selectedMonth] + " " + _selectedDate + ", " + _selectedYear);
    }

    var clearCalendarDays = function () {
        $(".days").remove();
    }

    var clearSelectedMarkers = function (selector) {
        $("." + selector).each(function () {
            $(this).removeClass("selected");
        });
    }

    var initializeSelected = function () {
        var $selectedYear = $(".years").find("[data-value='" + _selectedYear + "']");
        var $selectedMonth = $(".months").find("[data-value='" + _selectedMonth + "']");
        var $selectedDay = $(".days").find("[data-value='" + _selectedDate + "']");

        $selectedYear.addClass("selected");
        $selectedMonth.addClass("selected");
        $selectedDay.addClass("selected");

    }
    var getDataValue = function (element) {
        return $(element).attr("data-value")
    }

    var daysInTheMonth = function (month, year) {
        return new Date(year, month, 0).getDate();
    }

    var getMonthStartDay = function (month, year) {
        return new Date(month + "/1/" + year).getDay();
    }

    var printYearsToCalendar = function (year) {
        year = year - 2;
        var yearHtml = "<div class='years'>";
        for (i = 0; i < 5; i++) {
            yearHtml = yearHtml + "<a href='javascript:void(0)' class='year' data-value='" + year + "' " + "'>" + year + "</a>"
            year++;
        }
        yearHtml = yearHtml + "</div>";
        $calendar.append(yearHtml);
    }

    var printMonthsToCalendar = function () {
        var monthHtml = "<div class='months'>";
        for (i = 1; i <= 12; i++) {
            monthHtml = monthHtml + "<a href='javascript:void(0)' class='month' data-value='" + i + "' " + "'>" + _obj_month[i] + "</a>";
        }
        monthHtml = monthHtml + "</div>"
        $calendar.append(monthHtml);
    }

    var printDatesToCalendar = function (month, year) {
        var monthDays = daysInTheMonth(month, year);
        var dateHtml = "<div class='days'>"
        var startDate = getMonthStartDay(month, year);

        for (i = 1; i <= startDate; i++) {
            dateHtml = dateHtml + "<span class='day-spacer'></span>";
        }

        var pos = i;
        for (i = 1; i <= monthDays; i++) {
            dateHtml = dateHtml + "<a href='javascript:void(0)' " +
              "class='day' data-value='" + i + "'>" + i + "</a>";
            if ((pos % 7) == 0) {
                dateHtml = dateHtml + "<br />";
            }
            pos++;
        }

        $calendar.append(dateHtml);

        $(".day").on("click", function () {
            clearSelectedMarkers("day");
            _selectedDate = getDataValue($(this));
            $(this).addClass("selected");
            writeDateToInput();
        })

    }

    printYearsToCalendar(_selectedYear);
    printMonthsToCalendar();
    printDatesToCalendar(_selectedMonth, _selectedYear);
    writeDateToInput();

    $(".year").on("click", function () {
        clearSelectedMarkers("year");
        $(this).addClass("selected");
        _selectedYear = getDataValue($(this));
        clearCalendarDays();
        printDatesToCalendar(_selectedMonth, _selectedYear);
        writeDateToInput();
        initializeSelected();

    })

    $(".month").on("click", function () {
        clearSelectedMarkers("month");
        $(this).addClass("selected");
        _selectedMonth = getDataValue($(this));
        clearCalendarDays();
        printDatesToCalendar(_selectedMonth, _selectedYear);
        writeDateToInput();
        initializeSelected();

    })

    $dateInput.on("click", function () {
        $calendar.toggleClass("visible");
    });

    initializeSelected();
}

$(".submit").on("click", function () {
    var inputValue = $(".start-time").val();
    var d = new Date(inputValue);
    d.setHours(9);
    d.setMinutes(30);
    alert(d);
})

$(".start-time").datePicker();
//$(".end-time").datePicker();

var test = function () {
    return (1) ? true : false;
}
console.log(test());