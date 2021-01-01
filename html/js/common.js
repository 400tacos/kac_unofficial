const CONST_DIFFICULTY_NAMES = ['Beginner','Basic','Difficult','Expert','Challenge','Basic','Difficult','Expert','Challenge'];
const CONST_DIFFICULTY_PREFIX = ['b','B','D','E','C','B','D','E','C'];
const CONST_SPDP_PREFIX = ['S','D'];
const CONST_CURRENT_DDR_VERSION = 18;

const MIN = 60;
const HOUR = 60*MIN;
const DAY = 24*HOUR;
const WEEK = 7*DAY;
const YEAR = 365*DAY;

function wrapJpnText(selector) {
	$(selector).each(function () {
		// see https://stackoverflow.com/questions/15033196/using-javascript-to-check-whether-a-string-contains-japanese-characters-includi
		this.innerHTML = this.innerHTML.replace(/([\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]+)/ig, "<span class=\"jp-font\">$1</span>");
	});
}

function commaizeScore(score) {
    if (!score) return score;
    // see https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
}

function gradeForScoreAndLamp(score, lamp) {
    var grade =
//    score == 1000000 ? 'MFC' :
//    score >  999000  ? 'PFC' :
    score >=  990000  ? 'AAA' :

    score >=  950000  ? 'AA+' :
    score >=  900000  ? 'AA'  :
    score >=  890000  ? 'AA-' :

    score >=  850000  ? 'A+'  :
    score >=  800000  ? 'A'   :
    score >=  790000  ? 'A-'  :

    score >=  750000  ? 'B+'  :
    score >=  700000  ? 'B'   :
    score >=  690000  ? 'B-'  :

    score >=  650000  ? 'C+'  :
    score >=  600000  ? 'C'   :
    score >=  590000  ? 'C-'  :

    score >=  550000  ? 'D+'  :

    score <= 0       ? '-'   :
 /* anything else */   'D'   ;

    if (lamp == 0 && score > 0) grade = 'E';
    if (lamp == 5) grade = 'PFC';
    if (lamp == 6) grade = 'MFC';

    return grade;
}

function hookupAnonymousHeaderMenu() {
  $('#header-username, #header-password').on('keypress', function (e) {
         if(e.which === 13){
			requestLogin();
         }
   });
}

function hookupDropdownMenu() {

    // header dropdown

    $(".div-top-profile-button").click(function(e) {
        var display_mode = $(this).data('display_mode');
        if (display_mode == 'clicked') {
            $(".dropdown ul").hide();
            $(".div-top-profile-button").data('display_mode', 'hidden');
        } else if (display_mode != 'hovered') {
            $(".dropdown ul").show();
            $(".div-top-profile-button").data('display_mode', 'clicked');
        }
		e.stopPropagation();
		return false;
    });

	$(".dropdown").hover(
	function() {
            $(".dropdown ul").show();
            $(".div-top-profile-button").data('display_mode', 'hovered');
    },
	function() {
            $(".dropdown ul").hide();
            $(".div-top-profile-button").data('display_mode', 'unhovered');
 	}
	);

    $(".dropdown ul, .button").mouseup(function() {
        return false;
    });

     // footer language drop"up"

     $(".div-footer-lang").click(function(e) {
        var display_mode = $(this).data('display_mode');
        if (display_mode == 'clicked') {
            $(".div-footer-lang ul").hide();
            $(".div-footer-lang").data('display_mode', 'hidden');
        } else if (display_mode != 'hovered') {
            $(".div-footer-lang ul").show();
            $(".div-footer-lang").data('display_mode', 'clicked');
        }
		e.stopPropagation();
		return false;
    });

    $(".div-footer-lang ul, .button").mouseup(function() {
        return false;
    });

    $(document).click(function() {
		$(".dropdown ul").hide();
		$(".div-top-profile-button").data('display_mode', '0');
		$(".div-footer-lang ul").hide();
		$(".div-footer-lang").data('display_mode', '0');
        try {   // this is a temp workaround until we move all dropdowns to dropdown.js
            for (var i = 0; i < registeredDropdownIds.length; i++) {
                $('#' + registeredDropdownIds[i] + ' ul').hide();
                registeredDropdowns[i].data('display_mode', 0);
            }
        } catch (e) {
            // do nothing
        }
    });

}


function spdpModeButtonAction(currMode) {

    swal.fire({
        title: currMode == 0 ? xpstr_common.MSG_SWITCH_TO_DP_VIEW : xpstr_common.MSG_SWITCH_TO_SP_VIEW,
        showCancelButton: true,
        confirmButtonText: xpstr_common.SWITCH,
        cancelButtonText: xpstr_common.CANCEL,
        showLoaderOnConfirm: true,
        preConfirm: () => {

            var payload = {SP_or_DP: (spdpMode == 0 ? 1 : 0)};

            return ajax({
                url: "/api/spdp_mode",
                type: "POST",
                contentType: "application/json",
                processData: false,
                data: JSON.stringify(payload)
            })
            .then(response => {
                document.cookie = "SP_or_DP=" + (spdpMode == 0 ? 1 : 0) + ";path=/";
                return;
            })
            .catch(error => {
                swal.showValidationMessage(
                    xpstr_common.SWITCH_SPDP_VIEW_ERROR_MSG
                );
            });
        }
    }).then((result) => {
        if (result.value) {
            window.location.href = getUrlWithoutDiffParam();
        }
    });

}

function getUrlWithoutDiffParam() {
    var url = window.location.href;

    var urlParts = url.split('?');
    var urlBase = urlParts[0];

    if (urlParts.length == 1) return urlBase;

    var urlRawParams = urlParts[1];

    var oldParams = urlRawParams.split('&');
    var newParams = [];
    for (param of oldParams) {
        if (param.split('=')[0] == 'diff') continue;
        newParams.push(param);
    }
    
    if (newParams.length > 0) {
        return urlBase + "?" + newParams.join('&');
    } else {
        return urlBase;
    }
}

function getCookie(key) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var kv = cookies[i].split('=');
        if (!kv) continue;

        var k = kv[0].trim();
        if (!k || k.length == 0) continue;
        var v = kv[1].trim();

        if (k == key) {
            return v;
        }
    }
    return null;
}

function getUrlParams() {

    var paramsSplit = location.search.substr(1).split("&");
    var paramsKv = new Map();

    if (paramsSplit.length > 0) {
        for (var i = 0; i < paramsSplit.length; i++) {

            var p = paramsSplit[i].split("=");
            paramsKv[p[0]] = p[1];

        }
    }

    return paramsKv;
}

function readableTimePeriod(time, now) {
    var t = now - time;
    if (t < 0) {
        return xpstr_common.SOME_TIME_IN_THE_FUTURE;
    } else if (t < 3*MIN) {
        return xpstr_common.VERY_RECENTLY;
    } else if (t < 120*MIN) {
        return xpstr_common.n_MINS_AGO.replace('{n}', Math.floor(t/MIN));
    } else if (t < 72*HOUR) {
        return xpstr_common.n_HOURS_AGO.replace('{n}', Math.floor(t/HOUR));
    } else if (t < 365*DAY) {
        return xpstr_common.n_DAYS_AGO.replace('{n}', Math.floor(t/DAY));
    } else {
        return xpstr_common.n_YEARS_AGO.replace('{n}', Math.floor(t/YEAR));
    }
}

function humanDateTimeFromUnixSec(unixSec) {
    let dateObj = new Date(unixSec * 1000);

    let year = dateObj.getFullYear();
    let month = dateObj.getMonth()+1;
    let date = dateObj.getDate();
    let dayOfWeek = dateObj.getDay();

    let hours = ("0" + dateObj.getHours()).substr(-2);
    let min = ("0" + dateObj.getMinutes()).substr(-2);
    let sec = ("0" + dateObj.getSeconds()).substr(-2);

    let timezone = dateObj.toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2];
    if (!timezone) timezone = '';   // fallback in case above code is not supported by browser

    var strMonth = xpstr_common['SHORT_MONTH_' + month];
    var strDayOfWeek = xpstr_common['SHORT_DAY_OF_WEEK_' + dayOfWeek];

    return xpstr_common.DATE_FORMAT_w_y_m_d_h_M_s_tz
                .replace('{w}', strDayOfWeek)
                .replace('{y}', year)
                .replace('{m}', strMonth)
                .replace('{d}', date)
                .replace('{h}', hours)
                .replace('{M}', min)
                .replace('{s}', sec)
                .replace('{tz}', timezone);
}

function humanDateFromUnixTime(unixSec) {
    let dateObj = new Date(unixSec * 1000);
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth()+1;
    let date = dateObj.getDate();

    var strMonth = xpstr_common['SHORT_MONTH_' + month];
    return xpstr_common.DATE_FORMAT_y_m_d
                .replace('{y}', year)
                .replace('{m}', strMonth)
                .replace('{d}', date);
}

// see: https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
function humanTimeFromUnixTime(time){

    var dateObj = new Date(time * 1000);

    var date = humanDateFromUnixTime(time);

	var hour = dateObj.getHours();
    if (hour < 10) hour = '0' + hour;
	var min = dateObj.getMinutes();
    if (min < 10) min = '0' + min;
	var sec = dateObj.getSeconds();
    if (sec < 10) sec = '0' + sec;

    var time = hour + ":" + min + ":" + sec;

	return date + ' ' + time;
}

function genericDateFromUnixTime(unixSec) {
    let dateObj = new Date(unixSec * 1000);
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth()+1;
    let date = dateObj.getDate();

    if (month < 10) month = '0' + month;
    if (date < 10) date = '0' + date;

    return year + '-' + month + '-' + date;
}

function genericDateTimeFromUnixSec(unixSec) {

    let dateObj = new Date(unixSec * 1000);

    let year = dateObj.getFullYear();
    let month = ('0' + (dateObj.getMonth()+1)).substr(-2);
    let date = ('0' + dateObj.getDate()).substr(-2);

    let hours = ("0" + dateObj.getHours()).substr(-2);
    let min = ("0" + dateObj.getMinutes()).substr(-2);
    let sec = ("0" + dateObj.getSeconds()).substr(-2);

    return year + '-' + month + '-' + date + ' ' + hours + ':' + min + ":" + sec;
}

function ajax(options) {
    return new Promise(function(resolve, reject) {
        $.ajax(options)
        .done(function(data) {
            resolve();
        })
        .fail(function(err) {
            reject(err);
        });
    });
}

// autofontsize

;(function($) {
    $.fn.textfill = function(options) {
        this.each(function () {
            var fontSize = options.maxFontPixels;
            var divText = $('div:first', this);
            var maxWidth = $(this).width()-8;
            var maxHeight = $(this).height()-6;

            while (fontSize >= 9) {
                divText.css('font-size', fontSize);
                divText.css('line-height', fontSize+'px');
                if (divText.width() <= maxWidth && divText.height() <= maxHeight) break;
                fontSize--;
            }
        });
        return this;
    }
})(jQuery);

/*
 *    common login functions
 */

function showLoadingDialog(title) {
    swal.fire({
        text : title ? title : xpstr_common.LOADING_MSG,
        animation: false,
        customClass: 'swal-loading',
    });
    swal.showLoading();
}

function hideLoadingDialog() {
    swal.close();
}

