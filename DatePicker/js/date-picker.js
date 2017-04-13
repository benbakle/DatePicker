$.fn.datePicker = function () {
    var $picker = $(this);
    var $pickerInput = $(".picker-input", $picker);

    initializeDatePicker();

    var _now = new Date();
    var _selectedYear = _now.getFullYear();
    var _selectedMonth = _now.getMonth() + 1;
    var _selectedDate = _now.getDate();
    var _selectedHour = _now.getHours();
    var _selectedMinute = _now.getMinutes();
    var _selectedMeridian = (_selectedHour >= 12) ? "PM" : "AM";


    var _$yearsWrapper = $(".years-wrapper", $picker);
    var _$monthsWrapper = $(".months-wrapper", $picker);
    var _$datesWrapper = $(".dates-wrapper", $picker);
    var _$hoursWrapper = $(".hours-wrapper", $picker);
    var _$minutesWrapper = $(".minutes-wrapper", $picker);
    var _$meridiansWrapper = $(".meridians-wrapper", $picker);

    var monthValueToString = {
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


    printYearsToPicker(_selectedYear);
    printMonthsToPicker();
    printDatesToPicker();
    printHoursToPicker();
    printMinutesToPicker();
    addSelectedMarkers();
    setPickerInputValue();
    wireEvents();


    //---FUNCTIONS----//
    function initializeDatePicker() {
        $picker.append("<div class='picker'>" +
          "<div class='picker-nav'>" +
          "<a href='javascript:void(0)' class='date-link open'></a>" +
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
           "<div class='meridians-wrapper'>" +
          "<a href='javascript:void(0)' class='meridian' data-value='AM'>AM</a>" +
          "<a href='javascript:void(0)' class='meridian' data-value='PM'>PM</a>" +
          "</div>" +
          "</div>" +
          "<div class='close-wrapper'><a href='javascript:void(0)' class='close-picker'>Close</a></div>" +
          "</div>"
        );
    }

    function printYearsToPicker(year) {
        _$yearsWrapper.append(renderYearsHtml(year - 1));
        attachClickToYears();
    }

    function printMonthsToPicker() {
        _$monthsWrapper.append(renderMonthsHtml());
        attachClickToMonths();
    }
    function printDatesToPicker() {
        _$datesWrapper.append(renderDateSpacerHtml() + renderDatesHtml());
        attachClickToDays();
    }

    function printHoursToPicker() {
        _$hoursWrapper.append(renderHoursHtml());
        attachClickToHours();
    }

    function printMinutesToPicker() {
        _$minutesWrapper.append(renderMinutesHtml());
        attachClickToMinutes();
    }

    function addSelectedMarkers() {
        _$yearsWrapper.find("[data-value='" + _selectedYear + "']").addClass("selected");
        _$monthsWrapper.find("[data-value='" + _selectedMonth + "']").addClass("selected");
        _$datesWrapper.find("[data-value='" + _selectedDate + "']").addClass("selected");
        _$hoursWrapper.find("[data-value='" + toStandardTime(_selectedHour) + "']").addClass("selected");
        _$minutesWrapper.find("[data-value='" + roundTimeToNearest5(_selectedMinute) + "']").addClass("selected");
        _$meridiansWrapper.find("[data-value='" + _selectedMeridian + "']").addClass("selected");
    }

    function setPickerInputValue() {
        $pickerInput.val(
            monthValueToString[_selectedMonth] + " " +
            _selectedDate + ", " +
            _selectedYear + " " +
            toStandardTime(_selectedHour) + ":" +
            setIntegerLength(roundTimeToNearest5(_selectedMinute), 2) + " " +
            _selectedMeridian);
    }

    function wireEvents() {
        $('.close-picker', $picker).on('click', function () {
            closeCalendar();
        });

        $pickerInput.on("click", function (e) {
            closeCalendar();
            $(".picker", $picker).addClass("active");
        });

        $(".date-link", $picker).on("click", function () {
            $(".time", $picker).removeClass("active");
            $(".calendar", $picker).addClass("active");
            $(this).siblings(".time-link").removeClass("open");
            $(this).addClass("open");
        });

        $(".time-link", $picker).on("click", function () {
            $(".calendar", $picker).removeClass("active");
            $(".time", $picker).addClass("active");
            $(this).siblings(".date-link").removeClass("open");
            $(this).addClass("open");
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

    function renderYearsHtml(year) {
        var html = "";
        for (i = 0; i < 3; i++) {
            html = html + "<a href='javascript:void(0)' class='year' data-value='" + year + "' " + "'>" + year + "</a>"
            year++;
        }
        return html;
    }

    function renderMonthsHtml() {
        var html = "";
        for (i = 1; i <= 12; i++) {
            html = html + "<a href='javascript:void(0)' class='month' data-value='" + i + "' " + "'>" + monthValueToString[i] + "</a>"
        }
        return html;
    }

    function renderHoursHtml() {
        var html = "";
        for (i = 1; i <= 12; i++) {
            html = html + "<a href='javascript:void(0)' class='hour' data-value='" + i + "' " + "'>" + i + "</a>"
        }
        return html;
    }

    function renderDateSpacerHtml() {
        var html = "";
        for (i = 1; i < selectedMonthStartDay() ; i++) {
            html = html + "<span class='day-spacer'></span>";
        }
        return html;
    }

    function renderDatesHtml(datesPosition) {
        var html = "";
        var datesPosition = selectedMonthStartDay();
        for (i = 1; i <= daysInSelectedMonth() ; i++) {
            html = html + "<a href='javascript:void(0)' " + "class='day' data-value='" + i + "'>" + i + "</a>";
            if ((datesPosition % 7) == 0) {
                html = html + "<br />";
            }
            datesPosition++;
        }
        return html;
    }

    function renderMinutesHtml() {
        var html = "";
        for (i = 0; i <= 55; i = i + 5) {
            var iEdited = setIntegerLength(i, 2);
            html = html + "<a href='javascript:void(0)' class='minute' data-value='" + iEdited + "' " + "'>" + iEdited + "</a>"
        }
        return html;
    }

    function attachClickToYears() {
        $picker.find(".year").on("click", function () {
            clearSelectedMarkers("year");
            $(this).addClass("selected");
            _selectedYear = getDataValue($(this));
            clearCalendarDates();
            printDatesToPicker();
            addSelectedMarkers();
            setPickerInputValue();

        })
    }

    function attachClickToMonths() {
        $picker.find(".month").on("click", function () {
            clearSelectedMarkers("month");
            $(this).addClass("selected");
            _selectedMonth = getDataValue($(this));
            clearCalendarDates();
            printDatesToPicker();
            addSelectedMarkers();
            setPickerInputValue();
        })
    }

    function attachClickToDays() {
        $picker.find(".day").on("click", function () {
            _selectedDate = getDataValue($(this));
            clearSelectedMarkers("day");
            $(this).addClass("selected");
            setPickerInputValue();
            addSelectedMarkers();

        })
    }

    function attachClickToHours() {
        $picker.find(".hour").on("click", function () {
            clearSelectedMarkers("hour");
            $(this).addClass("selected");
            _selectedHour = getDataValue($(this));
            addSelectedMarkers();
            setPickerInputValue();
        })
    }


    function attachClickToMinutes() {
        $picker.find(".minute").on("click", function () {
            clearSelectedMarkers("minute");
            $(this).addClass("selected");
            _selectedMinute = getDataValue($(this));
            addSelectedMarkers();
            setPickerInputValue();

        })
    }
    function attachClickToMeridian() {
        $picker.find(".meridian").on("click", function () {
            clearSelectedMarkers("meridian");
            $(this).addClass("selected");
            _selectedMeridian = getDataValue($(this));
            addSelectedMarkers();
            setPickerInputValue();

        })
    }

    function setIntegerLength(i, intLength) {
        return (i * .01).toFixed(2).split(".")[1];
    }

    function daysInTheMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    function daysInSelectedMonth() {
        return new Date(_selectedYear, _selectedMonth, 0).getDate();

    }
    function getMonthStartDay(month, year) {
        return new Date(month + "/1/" + year).getDay();
    }

    function selectedMonthStartDay() {
        return getMonthStartDay(_selectedMonth, _selectedYear) + 1;
    }

    function clearSelectedMarkers(selector) {
        $("." + selector, $picker).each(function () {
            $(this).removeClass("selected");
        });
    }

    function clearCalendarDates() {
        $picker.find(".dates-wrapper").html("");
    }

    function getDataValue(element) {
        return $(element).attr("data-value")
    }
    function toStandardTime(milTime) {
        if (milTime == 0) { milTime = 12 };
        return (milTime > 12) ? milTime - 12 : milTime;
    }

    function roundTimeToNearest5(time) {
        time = Math.ceil(time / 5) * 5
        return (time == 60) ? 55 : time;
    }

    function closeCalendar() {
        $('.picker').removeClass('active');
    }
}



$(document).ready(function () {
    $(".start-time").datePicker();
    $(".end-time").datePicker();
    $(".close-picker").on("click", function () {
        var result = $(this).closest(".picker").siblings(".picker-input").val();
        $(".container").append("<p>" + new Date(result) + "</p>");
    })
});

