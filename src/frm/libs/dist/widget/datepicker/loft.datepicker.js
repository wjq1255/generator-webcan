/**
 * @file 时间选择器组件
 * @name Datepicker
 * @desc 按钮组件
 * @import core/zepto.extend.js, core/zepto.ui.js, core/zepto.iscroll.js ,core/zepto.highlight.js
 * @importCSS icons.css
 */
(function($, undefined) {
    var date = new Date();
    $.ui.define('datepicker', {
        _data: {
            dateFormat: 'yy/mm/dd',
            dateOrder: 'mmddy',
            timeWheels: 'hhii',
            timeFormat: 'hh:ii',
            startYear: date.getFullYear(),
            endYear: date.getFullYear() + 1,
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            shortYearCutoff: '+10',
            monthText: '月份',
            dayText: '日',
            yearText: '年份',
            hourText: '时',
            minuteText: '分',
            secText: '秒',
            ampmText: '&nbsp;',
            stepHour: 1,
            stepMinute: 1,
            stepSecond: 1,
            separator: ' '
        },

        preset: function(inst) {
            var that = $(this),
                html5def = {},
                format;
            // Force format for html5 date inputs (experimental)
            if (that.is('input')) {
                switch (that.attr('type')) {
                    case 'date':
                        format = 'yy-mm-dd';
                        break;
                    case 'datetime':
                        format = 'yy-mm-ddTHH:ii:ssZ';
                        break;
                    case 'datetime-local':
                        format = 'yy-mm-ddTHH:ii:ss';
                        break;
                    case 'month':
                        format = 'yy-mm';
                        html5def.dateOrder = 'mmyy';
                        break;
                    case 'time':
                        format = 'HH:ii:ss';
                        break;
                }
                // Check for min/max attributes
                var min = that.attr('min'),
                    max = that.attr('max');
                if (min)
                    html5def.minDate = this.parseDate(format, min);
                if (max)
                    html5def.maxDate = this.parseDate(format, max);
            }

            // Set year-month-day order
            var s = $.extend({}, defaults, html5def, inst.settings),
                offset = 0,
                wheels = [],
                ord = [],
                o = {},
                f = {
                    y: 'getFullYear',
                    m: 'getMonth',
                    d: 'getDate',
                    h: getHour,
                    i: getMinute,
                    s: getSecond,
                    ap: getAmPm
                },
                p = s.preset,
                dord = s.dateOrder,
                tord = s.timeWheels,
                regen = dord.match(/D/),
                ampm = tord.match(/a/i),
                hampm = tord.match(/h/),
                hformat = p == 'datetime' ? s.dateFormat + s.separator + s.timeFormat : p == 'time' ? s.timeFormat : s.dateFormat,
                defd = new Date(),
                stepH = s.stepHour,
                stepM = s.stepMinute,
                stepS = s.stepSecond,
                mind = s.minDate,
                maxd = s.maxDate;

            format = format ? format : hformat;

            if (p.match(/date/i)) {

                // Determine the order of year, month, day wheels
                $.each(['y', 'm', 'd'], function(i, v) {
                    var i = dord.search(new RegExp(v, 'i'));
                    if (i > -1)
                        ord.push({
                            o: i,
                            v: v
                        });
                });
                /*changed by huangjc*/
                //                ord.sort(function(a, b) { return a.o > b.o ? 1 : -1; });
                $.each(ord, function(i, v) {
                    o[v.v] = i;

                });

                var w = {};
                console.log(o);
                for (var k = 0; k < 3; k++) {
                    if (k == o.y) {
                        offset++;
                        w[s.yearText] = {};
                        var start = mind ? mind.getFullYear() : s.startYear,
                            end = maxd ? maxd.getFullYear() : s.endYear;
                        for (var i = start; i <= end; i++)
                        /*changed by huangjc*/
                        //                            w[s.yearText][i] = dord.match(/yy/i) ? i : (i + '').substr(2, 2);
                            w[s.yearText][i] = dord.match(/yy/i) ? i : (i + '');
                    } else if (k == o.m) {
                        offset++;
                        w[s.monthText] = {};
                        for (var i = 0; i < 12; i++)
                            w[s.monthText][i] =
                            dord.match(/MM/) ? s.monthNames[i] :
                            dord.match(/M/) ? s.monthNamesShort[i] :
                            dord.match(/mm/) && i < 9 ? '0' + (i + 1) : i + 1;
                    } else if (k == o.d) {
                        offset++;
                        w[s.dayText] = {};
                        for (var i = 1; i < 32; i++)
                            w[s.dayText][i] = dord.match(/dd/i) && i < 10 ? '0' + i : i;
                    }
                }
                wheels.push(w);

            }

            if (p.match(/time/i)) {
                var w = {};
                if (tord.match(/h/i)) {
                    o.h = offset++; // Hours wheel order
                    w[s.hourText] = {};
                    for (var i = 0; i < 24; i += stepH) {
                        console.log(i)
                        w[s.hourText][i] = i;
                    }
                    /*changed by huangjc*/
                    //                    for (var i = 0; i < (hampm ? 12 : 24); i += stepH)
                    //                        w[s.hourText][i] = hampm && i == 0 ? 12 : tord.match(/hh/i) && i < 10 ? '0' + i : i;
                }
                if (tord.match(/i/)) {
                    o.i = offset++; // Minutes wheel order
                    w[s.minuteText] = {};
                    for (var i = 0; i < 60; i += stepM)
                        w[s.minuteText][i] = tord.match(/ii/) && i < 10 ? '0' + i : i;
                }
                if (tord.match(/s/)) {
                    o.s = offset++; // Seconds wheel order
                    w[s.secText] = {};
                    for (var i = 0; i < 60; i += stepS)
                        w[s.secText][i] = tord.match(/ss/) && i < 10 ? '0' + i : i;
                }
                if (ampm) {
                    o.ap = offset++; // ampm wheel order
                    var upper = tord.match(/A/);
                    w[s.ampmText] = {
                        0: upper ? 'AM' : 'am',
                        1: upper ? 'PM' : 'pm'
                    };
                }
                console.log('www', w)
                wheels.push(w);
            }

            function get(d, i, def) {
                if (o[i] !== undefined)
                    return +d[o[i]];
                if (def !== undefined)
                    return def;
                return defd[f[i]] ? defd[f[i]]() : f[i](defd);
            }

            function step(v, step) {
                return Math.floor(v / step) * step;
            }

            function getHour(d) {
                var hour = d.getHours();
                hour = hampm && hour >= 12 ? hour - 12 : hour;
                return step(hour, stepH);
            }

            function getMinute(d) {
                return step(d.getMinutes(), stepM);
            }

            function getSecond(d) {
                return step(d.getSeconds(), stepS);
            }

            function getAmPm(d) {
                return ampm && d.getHours() > 11 ? 1 : 0;
            }

            function getDate(d) {
                var hour = get(d, 'h', 0);
                return new Date(get(d, 'y'), get(d, 'm'), get(d, 'd'), get(d, 'ap') ? hour + 12 : hour, get(d, 'i', 0), get(d, 's', 0));
            }

            inst.setDate = function(d, fill, time) {
                // Set wheels
                for (var i in o)
                    this.temp[o[i]] = d[f[i]] ? d[f[i]]() : f[i](d);
                this.setValue(true, fill, time);
            }

            inst.getDate = function(d) {
                return getDate(d);
            }

            return {
                wheels: wheels,
                headerText: function(v) {
                    return this.formatDate(hformat, getDate(inst.temp), s);
                },
                /**
                 * Builds a date object from the wheel selections and formats it to the given date/time format
                 * @param {Array} d - An array containing the selected wheel values
                 * @return {String} - The formatted date string
                 */
                formatResult: function(d) {
                    return this.formatDate(format, getDate(d), s);
                },
                /**
                 * Builds a date object from the input value and returns an array to set wheel values
                 * @return {Array} - An array containing the wheel values to set
                 */
                parseValue: function(val) {
                    var d = new Date(),
                        iscroll,
                        result = [];
                    try {
                        d = this.parseDate(format, val, s);
                    } catch (e) {}
                    // Set wheels
                    for (var i in o)
                        result[o[i]] = d[f[i]] ? d[f[i]]() : f[i](d);
                    return result;
                },
                /**
                 * Validates the selected date to be in the minDate / maxDate range and sets unselectable values to disabled
                 * @param {Object} dw - jQuery object containing the generated html
                 * @param {Integer} [i] - Index of the changed wheel, not set for initial validation
                 */
                validate: function(dw, i) {
                    var temp = inst.temp,
                        mins = {
                            m: 0,
                            d: 1,
                            h: 0,
                            i: 0,
                            s: 0,
                            ap: 0
                        },
                        /*changed by huangjc*/
                        maxs = {
                            m: 11,
                            d: 31,
                            h: 23,
                            i: step(59, stepM),
                            s: step(59, stepS),
                            ap: 1
                        },
                        //                        maxs = { m: 11, d: 31, h: step(hampm ? 11 : 23, stepH), i: step(59, stepM), s: step(59, stepS), ap: 1 },
                        w = (mind || maxd) ? ['y', 'm', 'd', 'ap', 'h', 'i', 's'] : ((i == o.y || i == o.m || i === undefined) ? ['d'] : []), // Validate day only, if no min/max date set
                        minprop = true,
                        maxprop = true;
                    $.each(w, function(x, i) {
                        if (o[i] !== undefined) {
                            var min = mins[i],
                                max = maxs[i],
                                maxdays = 31,
                                val = get(temp, i),
                                t = $('ul', dw).eq(o[i]),
                                y, m;
                            if (i == 'd') {
                                y = get(temp, 'y'),
                                    m = get(temp, 'm');
                                maxdays = 32 - new Date(y, m, 32).getDate();
                                max = maxdays;
                                if (regen)
                                    $('li', t).each(function() {
                                        var that = $(this),
                                            d = that.data('val'),
                                            w = new Date(y, m, d).getDay();
                                        that.html(dord.replace(/[my]/gi, '').replace(/dd/, d < 10 ? '0' + d : d).replace(/d/, d).replace(/DD/, s.dayNames[w]).replace(/D/, s.dayNamesShort[w]));
                                    });
                            }
                            if (minprop && mind) {
                                min = mind[f[i]] ? mind[f[i]]() : f[i](mind);
                            }
                            if (maxprop && maxd) {
                                max = maxd[f[i]] ? maxd[f[i]]() : f[i](maxd);
                            }
                            if (i != 'y') {
                                var i1 = $('li[data-val="' + min + '"]', t).index(),
                                    i2 = $('li[data-val="' + max + '"]', t).index();
                                $('li', t).removeClass('dw-v').slice(i1, i2 + 1).addClass('dw-v');
                                if (i == 'd') { // Hide days not in month
                                    $('li', t).removeClass('dw-h').slice(maxdays).addClass('dw-h');
                                }
                                if (val < min)
                                    val = min;
                                if (val > max)
                                    val = max;
                            }
                            if (minprop)
                                minprop = val == min;
                            if (maxprop)
                                maxprop = val == max;
                            // Disable some days
                            if (s.invalid && i == 'd') {
                                var idx = [];
                                // Disable exact dates
                                if (s.invalid.dates)
                                    $.each(s.invalid.dates, function(i, v) {
                                        if (v.getFullYear() == y && v.getMonth() == m) {
                                            idx.push(v.getDate() - 1);
                                        }
                                    });
                                // Disable days of week
                                if (s.invalid.daysOfWeek) {
                                    var first = new Date(y, m, 1).getDay();
                                    $.each(s.invalid.daysOfWeek, function(i, v) {
                                        for (var j = v - first; j < maxdays; j += 7)
                                            if (j >= 0)
                                                idx.push(j);
                                    });
                                }
                                // Disable days of month
                                if (s.invalid.daysOfMonth)
                                    $.each(s.invalid.daysOfMonth, function(i, v) {
                                        v = (v + '').split('/');
                                        if (v[1]) {
                                            if (v[0] - 1 == m)
                                                idx.push(v[1] - 1);
                                        } else
                                            idx.push(v[0] - 1);
                                    });
                                $.each(idx, function(i, v) {
                                    $('li', t).eq(v).removeClass('dw-v');
                                });
                            }
                        }
                    });
                },
                methods: {
                    /**
                     * Returns the currently selected date.
                     * @param {Boolean} temp - If true, return the currently shown date on the picker, otherwise the last selected one
                     * @return {Date}
                     */
                    getDate: function(temp) {
                        //var inst = $(this).data('iScroll');
                        var inst = $(this).iScroll('getInst');
                        if (inst)
                            return inst.getDate(temp ? inst.temp : inst.values);
                    },
                    /**
                     * Sets the selected date
                     * @param {Date} d - Date to select.
                     * @param {Boolean} [fill] - Also set the value of the associated input element. Default is true.
                     * @return {Object} - jQuery object to maintain chainability
                     */
                    setDate: function(d, fill, time) {
                        if (fill == undefined) fill = false;
                        return this.each(function() {
                            var inst = $(this).iScroll('getInst');
                            if (inst)
                                inst.setDate(d, fill, time);
                        });
                    }
                }
            }
        },

        formatDate: function(format, date, settings) {
            if (!date) return null;
            var s = $.extend({}, defaults, settings),
                // Check whether a format character is doubled
                look = function(m) {
                    var n = 0;
                    while (i + 1 < format.length && format.charAt(i + 1) == m) {
                        n++;
                        i++;
                    };
                    return n;
                },
                // Format a number, with leading zero if necessary
                f1 = function(m, val, len) {
                    var n = '' + val;
                    if (look(m))
                        while (n.length < len)
                            n = '0' + n;
                    return n;
                },
                // Format a name, short or long as requested
                f2 = function(m, val, s, l) {
                    return (look(m) ? l[val] : s[val]);
                },
                output = '',
                literal = false;
            for (var i = 0; i < format.length; i++) {
                if (literal)
                    if (format.charAt(i) == "'" && !look("'"))
                        literal = false;
                    else
                        output += format.charAt(i);

                else
                    switch (format.charAt(i)) {
                        case 'd':
                            output += f1('d', date.getDate(), 2);
                            break;
                        case 'D':
                            output += f2('D', date.getDay(), s.dayNamesShort, s.dayNames);
                            break;
                        case 'o':
                            output += f1('o', (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000, 3);
                            break;
                        case 'm':
                            output += f1('m', date.getMonth() + 1, 2);
                            break;
                        case 'M':
                            output += f2('M', date.getMonth(), s.monthNamesShort, s.monthNames);
                            break;
                        case 'y':
                            output += (look('y') ? date.getFullYear() : (date.getYear() < 10 ? '0' : '') + date.getYear());
                            break;
                        case 'h':
                            var h = date.getHours();
                            //output += f1('h', (h > 12 ? (h - 12) : (h == 0 ? 12 : h)), 2);
                            output += f1('h', h, 2);
                            break;
                        case 'H':
                            output += f1('H', date.getHours(), 2);
                            break;
                        case 'i':
                            output += f1('i', date.getMinutes(), 2);
                            break;
                        case 's':
                            output += f1('s', date.getSeconds(), 2);
                            break;
                        case 'a':
                            output += date.getHours() > 11 ? 'pm' : 'am';
                            break;
                        case 'A':
                            output += date.getHours() > 11 ? 'PM' : 'AM';
                            break;
                        case "'":
                            if (look("'"))
                                output += "'";
                            else
                                literal = true;
                            break;
                        default:
                            output += format.charAt(i);
                    }
            }
            return output;
        },

        /**
         * Extract a date from a string value with a specified format.
         * @param {String} format - Input format.
         * @param {String} value - String to parse.
         * @param {Object} settings - Settings.
         * @return {Date} - Returns the extracted date.
         */
        parseDate: function(format, value, settings) {
            var def = new Date();
            if (!format || !value) return def;
            value = (typeof value == 'object' ? value.toString() : value + '');
            var s = $.extend({}, defaults, settings),
                year = def.getFullYear(),
                month = def.getMonth() + 1,
                day = def.getDate(),
                doy = -1,
                hours = def.getHours(),
                minutes = def.getMinutes(),
                seconds = 0, //def.getSeconds(),
                ampm = -1,
                literal = false,
                // Check whether a format character is doubled
                lookAhead = function(match) {
                    var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
                    if (matches)
                        iFormat++;
                    return matches;
                },
                // Extract a number from the string value
                getNumber = function(match) {
                    lookAhead(match);
                    var size = (match == '@' ? 14 : (match == '!' ? 20 :
                        (match == 'y' ? 4 : (match == 'o' ? 3 : 2))));
                    var digits = new RegExp('^\\d{1,' + size + '}');
                    var num = value.substr(iValue).match(digits);
                    if (!num)
                        return 0;
                    //throw 'Missing number at position ' + iValue;
                    iValue += num[0].length;
                    return parseInt(num[0], 10);
                },
                // Extract a name from the string value and convert to an index
                getName = function(match, s, l) {
                    var names = (lookAhead(match) ? l : s);
                    for (var i = 0; i < names.length; i++) {
                        if (value.substr(iValue, names[i].length).toLowerCase() == names[i].toLowerCase()) {
                            iValue += names[i].length;
                            return i + 1;
                        }
                    }
                    return 0;
                    //throw 'Unknown name at position ' + iValue;
                },
                // Confirm that a literal character matches the string value
                checkLiteral = function() {
                    //if (value.charAt(iValue) != format.charAt(iFormat))
                    //throw 'Unexpected literal at position ' + iValue;
                    iValue++;
                },
                iValue = 0;

            for (var iFormat = 0; iFormat < format.length; iFormat++) {
                if (literal)
                    if (format.charAt(iFormat) == "'" && !lookAhead("'"))
                        literal = false;
                    else
                        checkLiteral();
                else
                    switch (format.charAt(iFormat)) {
                        case 'd':
                            day = getNumber('d');
                            break;
                        case 'D':
                            getName('D', s.dayNamesShort, s.dayNames);
                            break;
                        case 'o':
                            doy = getNumber('o');
                            break;
                        case 'm':
                            month = getNumber('m');
                            break;
                        case 'M':
                            month = getName('M', s.monthNamesShort, s.monthNames);
                            break;
                        case 'y':
                            year = getNumber('y');
                            break;
                        case 'H':
                            hours = getNumber('H');
                            break;
                        case 'h':
                            hours = getNumber('h');
                            break;
                        case 'i':
                            minutes = getNumber('i');
                            break;
                        case 's':
                            seconds = getNumber('s');
                            break;
                        case 'a':
                            ampm = getName('a', ['am', 'pm'], ['am', 'pm']) - 1;
                            break;
                        case 'A':
                            ampm = getName('A', ['am', 'pm'], ['am', 'pm']) - 1;
                            break;
                        case "'":
                            if (lookAhead("'"))
                                checkLiteral();
                            else
                                literal = true;
                            break;
                        default:
                            checkLiteral();
                    }
            }
            if (year < 100)
                year += new Date().getFullYear() - new Date().getFullYear() % 100 +
                (year <= s.shortYearCutoff ? 0 : -100);
            if (doy > -1) {
                month = 1;
                day = doy;
                do {
                    var dim = 32 - new Date(year, month - 1, 32).getDate();
                    if (day <= dim)
                        break;
                    month++;
                    day -= dim;
                } while (true);
            }
            hours = (ampm == -1) ? hours : ((ampm && hours < 12) ? (hours + 12) : (!ampm && hours == 12 ? 0 : hours));
            var date = new Date(year, month - 1, day, hours, minutes, seconds);
            if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day)
                throw 'Invalid date';
            return date;
        },

        _create: function() {
            if (this._data.disabled) return false;

            var hi = this._data.height,
                thi = this._data.rows * hi;

            // Parse value from input
            //read();

            // Create wheels containers
            var html = '<div class="' + this._data.theme + '">' + (this._data.display == 'inline' ? '<div class="dw dwbg dwi"><div class="dwwr">' : '<div class="dwo"></div><div class="dw dwbg"><div class="dwwr">' + (this._data.headerText ? '<div class="dwv"></div>' : ''));
            for (var i = 0; i < this._data.wheels.length; i++) {
                html += '<div class="dwc' + (this._data.mode != 'scroller' ? ' dwpm' : ' dwsc') + (this._data.showLabel ? '' : ' dwhl') + '"><div class="dwwc dwrc"><table cellpadding="0" cellspacing="0"><tr>';
                // Create wheels
                for (var label in this._data.wheels[i]) {
                    console.log(this._data.wheels[i]);
                    /*changed by huangjc*/
                    html += '<td><div class="dwwl dwrc">' + '<div class="dww dwrc" style="height:' + thi + 'px;min-width:' + this._data.width + 'px;"><ul>';
                    //                    html += '<td><div class="dwwl dwrc">' + '<div class="dwl">' + label + '</div><div class="dww dwrc" style="height:' + thi + 'px;min-width:' + s.width + 'px;"><ul>';
                    // Create wheel values
                    for (var j in this._data.wheels[i][label]) {
                        html += '<li class="dw-v" data-val="' + j + '" style="height:' + hi + 'px;line-height:' + hi + 'px;">' + this._data.wheels[i][label][j] + '</li>';
                    }
                    html += '</ul><div class="dwwo"></div></div><div class="dwwol"></div><div class="dwwol-bottom"></div></div></td>';
                }
                html += '</tr></table></div></div>';
            }
            html += (this._data.display != 'inline' ? '<div class="dwbc"><span class="dwbw dwb-s"><a href="#" class="dwb">' + this._data.setText + '</a></span><span class="dwbw dwb-c"><a href="#" class="dwb">' + this._data.cancelText + '</a></span></div>' : '<div class="dwcc"></div>') + '</div></div></div>';

            dw = $(html);

            //scrollToPos();

            // Show
            this._data.display != 'inline' ? dw.appendTo('body') : elm.is('div') ? elm.html(dw) : dw.insertAfter(elm);
            visible = true;

            // Theme init
            //theme.init(dw, that);

            //if (this._data.display != 'inline') {
            //    // Init buttons
            //    $('.dwb-s a', dw).click(function() {
            //        this.setValue(false, true);
            //        this.hide();
            //        s.onSelect.call(e, that.val, that);
            //        return false;
            //    });
            //
            //    $('.dwb-c a', dw).click(function() {
            //        that.hide();
            //        s.onCancel.call(e, that.val, that);
            //        return false;
            //    });
            //
            //    // Disable inputs to prevent bleed through (Android bug)
            //    $('input,select').each(function() {
            //        if (!$(this).prop('disabled'))
            //            $(this).addClass('dwtd');
            //    });
            //    $('input,select').prop('disabled', true);
            //
            //    // Set position
            //    position();
            //    $(window).bind('resize.dw', position);
            //}

            // Events
            //dw.delegate('.dwwl', 'DOMMouseScroll mousewheel', function(e) {
            //    if (!s.readonly) {
            //        e.preventDefault();
            //        e = e.originalEvent;
            //        var delta = e.wheelDelta ? (e.wheelDelta / 120) : (e.detail ? (-e.detail / 3) : 0),
            //            t = $('ul', this),
            //            p = +t.data('pos'),
            //            val = Math.round(p - delta);
            //        setGlobals(t);
            //        calc(t, val, delta < 0 ? 1 : 2);
            //    }
            //}).delegate('.dwb, .dwwb', START_EVENT, function(e) {
            //    // Active button
            //    $(this).addClass('dwb-a');
            //}).delegate('.dwwb', START_EVENT, function(e) {
            //    if (!s.readonly) {
            //        // + Button
            //        e.preventDefault();
            //        e.stopPropagation();
            //        var t = $(this).closest('.dwwl').find('ul')
            //        func = $(this).hasClass('dwwbp') ? plus : minus;
            //        setGlobals(t);
            //        clearInterval(timer);
            //        timer = setInterval(function() {
            //            func(t);
            //        }, s.delay);
            //        func(t);
            //    }
            //}).delegate('.dwwl', START_EVENT, function(e) {
            //    // Scroll start
            //    if (!move && s.mode != 'clickpick' && !s.readonly) {
            //        e.preventDefault();
            //        move = true;
            //        target = $('ul', this).addClass('dwa');
            //        if (s.mode == 'mixed')
            //            $('.dwwb', this).fadeOut('fast');
            //        pos = +target.data('pos');
            //        setGlobals(target);
            //        start = getY(e);
            //        startTime = new Date();
            //        stop = start;
            //        that.scroll(target, pos);
            //    }
            //});
            //
            //s.onShow.call(e, dw, that);

        },


        _init: function() {
            console.log('22')

        },

        /**
         * 事件管理器
         * @private
         */
        _eventHandler: function(event) {
            var data = this._data;
            if (data.disabled) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        },

        /**
         * @desc 销毁组件。
         * @name destroy
         * @grammar destroy()  ⇒ instance
         * @example
         * //setup 
         * $('#btn').button('destroy');
         *
         * //render 
         * var btn = $.ui.button();
         * btn.destroy();
         */
        destroy: function() {
            var me = this,
                data = this._data;
            data._buttonElement.off('click', me._eventHandler).highlight();
            //data._buttonElement.children().remove();
            me.$super('destroy');
        }

        /**
         * @name Trigger Events
         * @theme event
         * @desc 组件内部触发的事件
         *
         * ^ 名称 ^ 处理函数参数 ^ 描述 ^
         * | init | event | 组件初始化的时候触发，不管是render模式还是setup模式都会触发 |
         * | click | event | 当按钮点击时触发，当按钮为disabled状态时，不会触发 |
         * | statechange | event, state(disabled的值) | 当按钮disabled状态发生变化时触发 |
         * | change | event | 当按钮类型为''checkbox''或者''radio''时，选中状态发生变化时触发 |
         * | destory | event | 组件在销毁的时候触发 |
         */
    });
})(Zepto);
