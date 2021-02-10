"use strict";

var authParty = 'YWRtaW46cGFzcw==';
var apiServerUrl = 'https://github.com';

include(apiServerUrl + "/mauricioestra/pof/blob/main/lang-config.js");
$('head').append('<link rel="stylesheet" href="' + apiServerUrl + '/mauricioestra/pof/blob/main/dbl-style.css" type="text/css" />');

var pushTrackData = fillTrackDataUrlParams(_push);
var pushPopup = {};

var cid = -1;
if (typeof pushTrackData !== 'undefined') {
	if (typeof pushTrackData.cid !== 'undefined' && pushTrackData.cid) {
		cid = pushTrackData.cid;
	} else if (pushTrackData.pid !== 'undefined' && pushTrackData.pid) {
		cid = pushTrackData.pid;
	}
}

getFirstPopUP(cid);

function getFirstPopUP(cid) {
	var init = {
		method: 'GET',
		headers: {
			'Content-type': 'application/json',
			'Authorization': 'Basic ' + authParty
		},
		mode: 'cors'
	};

	var url = apiServerUrl + '/api/subscribe/first-popup/cid/' + cid + '/lang/' + getLanguage().substr(0, 2);
	var request = new Request(url, init);
	fetch(request).then(function (response) {
		if (response.status !== 200) {
			validateAndShowPopUP(defaultFirstPopupJson);
		}
		return response.json();
	}).then(function (json) {
		validateAndShowPopUP(json ? json : defaultFirstPopupJson);
	}).catch(function (error) {
		console.log('Failure get first popupStyle: ' + error.message);
		validateAndShowPopUP(defaultFirstPopupJson);
	});
}

function validateAndShowPopUP(pushPopupJson) {
	if (pushPopupJson.excludeWrongBrowser) {
		if (isPushSupportedOnBrowser(getBrowserInfo())) {
			detectPrivateMode(
				function (is_private) {
					if (!is_private) {
						console.log("OK. Push is supported on this browser");
						showNotification(pushPopupJson);
					} else {
						console.log("Push isn't supported on this browser, disable or hide UI");
					}
				}
			);
		} else {
			console.log("Push isn't supported on this browser");
		}
	} else {
		showNotification(pushPopupJson);
	}
}

function getPushDomain() {
	var subdomain = "";
	if (typeof pushTrackData.sub !== 'undefined' && pushTrackData.sub !== '') {
		subdomain = pushTrackData.sub + ".";
	}
	return apiServerUrl.replace("://", "://" + subdomain);
};

var clickNotification = function (isOpenWindow) {
	closeNotificationPopup();
	if (isOpenWindow) {
		var landingPath = typeof pushPopup !== 'undefined' && pushPopup.pathToLanding !== '' ? pushPopup.pathToLanding + '/' : '/';
		var lang = typeof pushPopup !== 'undefined' && pushPopup.languageCode !== '' ? pushPopup.languageCode : 'en';
		var ref = window.location.origin + window.location.pathname;
		var url = getPushDomain() + landingPath + "?ext=1" + "&ref=" + ref + "&lang=" + lang + getTrackDataUrlParams(pushTrackData);
		setCookie("push_do_not_show_notification_popup", "true", 1);
		openChildWindow(url, 550, 450);
	}
};

var closeNotificationPopup = function () {
	$(".push-notification")
		.fadeOut(700, function () {
			$(this).remove()
		});
	$(".popup-mobile")
		.fadeOut(700, function () {
			$(this).remove()
		});
	$(".popup-desktop")
		.fadeOut(700, function () {
			$(this).remove()
		});
	$(".popup")
		.fadeOut(700, function () {
			$(this).remove()
		});
};

function showNotification(pushPopupJson) {
	if (pushPopupJson.template === '1' || pushPopupJson.template === 1) {
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			showMobileCustomNotification(pushPopupJson);
		} else {
			showÐ¡ustomNotification(pushPopupJson);
		}
	} else if (pushPopupJson.template === '2' || pushPopupJson.template === 2) {
		showFBNotification(pushPopupJson);
	} else {
		showDefaultNotification(pushPopupJson);
	}
}

function showDefaultNotification(pushPopupJson) {
	pushPopup = pushPopupJson;
	var notificationPopupDiv =
		'<div class="push-notification" style="width:422px; background-color:' + pushPopupJson.backgroundColor + '; box-shadow:0 0 4px #888; font-weight:400;">' +
		'<div class="push-inner-wrapper" style="padding: 0 20px 10px; margin: 0;">' +
		'<div class="push-image-wrapper" style="float:left;position:relative;margin:15px 15px 0 0; padding: 0; display:inline-block;">' +
		'<img style="height: 65px; width: 65px;" src="' + pushPopupJson.image + '"/>' +
		'</div>' +
		'<div class="push-text-wrapper" style="padding: 10px 0 0; color: #000; text-align: left; line-height: 1.4em; display: inline-block; width: calc(100% - 80px);">' +
		'<span class="push-title" style=" color: ' + pushPopupJson.titleColor + ';  margin-bottom: 5px; text-align: left; font-size: 14px; font-weight: 700; line-height: 1.4em; font-family: "Open Sans",sans-serif;">' + pushPopupJson.title + '</span>' +
		'<p class="push-message" style="color: ' + pushPopupJson.messageColor + '; font-size: 12px; line-height: 1.4em; margin: 10px 0; padding: 0; text-align: left; font-family: "Open Sans",sans-serif; color: black;">' + pushPopupJson.message + '</p>' +
		'</div>' +
		'<div style="clear: both;">' +
		'<div class="push-button-wrapper" style="float: right; margin: 0; padding: 0;">' +
		'<button class="push-btn push-btn-close" onclick="clickNotification(false)" style="background: ' + pushPopupJson.btnCloseBgColor + '; color: ' + pushPopupJson.btnCloseColor + '; border-color: #CCC; margin-right: 20px; min-width: 122px; height: 26px; font-size: 12px; cursor: pointer; border-radius: 4px; border: 1px solid #CCC;">' + pushPopupJson.btnCloseText + '</button>' +
		'<button class="push-btn push-btn-allow" onclick="clickNotification(true)" style="background: ' + pushPopupJson.btnAllowBgColor + '; color: ' + pushPopupJson.btnAllowColor + '; border: 1px solid ' + pushPopupJson.btnAllowBgColor + '; min-width: 122px; height: 26px; font-size: 12px; cursor: pointer; border-radius: 4px;">' + pushPopupJson.btnAllowText + '</button>' +
		'</div>' +
		'<div style="clear:both"></div>' +
		'</div>' +
		'</div>' +
		'</div>';

	if (!getCookie("push_do_not_show_notification_popup")) {
		$("body").append(notificationPopupDiv);
	}
}

function showÐ¡ustomNotification(pushPopupJson) {
	pushPopup = pushPopupJson;
	var notificationPopupDiv = '<div class="popup-desktop" style="width: 690px;height: 530px;background: #fff;text-align: center;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 9999;box-shadow: 0 0 4px #888;">' +
		'<div class="popup-header" style="height: 240px;background: url(' + pushPopupJson.image + ')  no-repeat center;background-size: auto;background-size: cover;background-position-x: center; background-position-y: center"> ' +
		'</div>' +
		'<div class="popup-body"> ' +
		'<div class="title" style=" color:' + pushPopupJson.titleColor + '; font-family: \'Arial\', \'serif\';font-size: 30px;font-weight: 700;line-height: 37px;max-width: 630px;margin: 27px auto;">' + pushPopupJson.title + '<img src=""></div> ' +
		'<div class="text" style="color:' + pushPopupJson.messageColor + '; font-family: \'Helvetica Neue\', \'Sans-serif\', \'serif\';font-size: 21px;line-height: 37px;color: #5d5d5d;padding-bottom: 20px;">' + pushPopupJson.message + '</div> ' +
		'<div> ' +
		'<button class="green popup-apply" onclick="clickNotification(true)" style="background:' + pushPopupJson.btnAllowBgColor + '; color: ' + pushPopupJson.btnAllowColor + ';max-width: 350px;width: 50%; border-radius: 5px; color: #fff; font-family: \'Helvetica\', \'Sans-serif\', \'serif\';font-size: 24px;text-align: center;height: 53px;border: none;margin: 10px;">' + pushPopupJson.btnAllowText + '</button>' +
		'<button class="grey popup-cancel" onclick="clickNotification(false)" style="background: none;color: #acabab;max-width: 140px;width: 50%;; font-family: \'Helvetica\', \'Sans-serif\', \'serif\';font-size: 24px;text-align: center;height: 53px;border: none;margin: 10px;">' + pushPopupJson.btnCloseText + '</button>' +
		'</div> ' +
		'</div> ' +
		'</div>';

	if (!getCookie("push_do_not_show_notification_popup")) {
		$("body").append(notificationPopupDiv);
	}
}


function showMobileCustomNotification(pushPopupJson) {
	pushPopup = pushPopupJson;
	if (pushPopupJson.imageMob == undefined || pushPopupJson.imageMob == null || pushPopupJson.imageMob == '') {
		pushPopupJson.imageMob = pushPopupJson.image;
	}
	var notificationPopupDiv = '<div class="popup-mobile" style="width: 90vw;height: fit-content;position: fixed;top: 40%;transform: translateY(-50%);left: 5vw;background: #fff;text-align: center;z-index: 9999;font-family: \'Arial\', \'serif\';"> ';
	if (pushPopupJson.headerTitle !== undefined || pushPopupJson.headerMessage !== undefined) {
		notificationPopupDiv +=
			'<div class="popup-header" style="font-family: \'Black Han Sans\', \'Sans-serif\', \'serif\';height: 55px; background-color: #171717;color: #fff;">' +
			'<div class="title" style="font-size: 18px;font-weight: 400;padding-top: 8px;">' + pushPopupJson.headerTitle === undefined ? '' : pushPopupJson.headerTitle + '</div>' +
			'<div class="text" style="font-size: 14px; font-weight: 700;">' + pushPopupJson.headerMessage === undefined ? '' : pushPopupJson.headerMessage + '</div>' +
				'</div>';
	}
	notificationPopupDiv +=
		'<div class="popup-body">' +
		'<div class="top-body" style="min-height: 220px;width: 100%; display: flex; flex: 1 1 50%;">' +
		'<div class="photo" style="height: 220px; width:50%; background: url(' + pushPopupJson.imageMob + ') no-repeat 50% 0/cover;"></div>' +
		'<div style="width: 50%">' +
		'<div class="title" style="display: flex;justify-content: center;align-items: center;padding-top: 35px;color:' + pushPopupJson.titleColor + ';font-size: 24px;font-weight: 700;"><span>' + pushPopupJson.title + '</span></div>' +
		'<div class="text" style="color:' + pushPopupJson.messageColor + ';font-style: italic;font-size: 18px;line-height: 25px;text-align: left;padding: 20px;">' + pushPopupJson.message + '</div>' +
		'</div>' +
		'</div>' +
		'<div class="text" style="color: #333;font-size: 17px;line-height: 24px;padding: 15px 10px 10px;"></div>' +
		'<div>' +
		'<button class="green popup-apply" onclick="clickNotification(true)" style="background:' + pushPopupJson.btnAllowBgColor + '; color: ' + pushPopupJson.btnAllowColor + ';border-radius: 5px; font-size: 18px;text-align: center;width: calc(100% - 20px);height: 53px;border: none;margin: auto;letter-spacing: 0.3px;">' + pushPopupJson.btnAllowText + '</button>' +
		'<button class="grey popup-cancel" onclick="clickNotification(false)" style="background: none;color: #acabab;font-weight: 700;letter-spacing: 0.38px; font-size: 18px;text-align: center;width: calc(100% - 20px);height: 53px;border: none;margin: auto;letter-spacing: 0.3px;">' + pushPopupJson.btnCloseText + '</button>' +
		'</div>' +
		'</div>';


	if (!getCookie("push_do_not_show_notification_popup")) {
		$("body").append(notificationPopupDiv);
	}
}


function showFBNotification(pushPopupJson) {
	pushPopup = pushPopupJson;
	var notificationPopupDiv = ' <div class="popup" style="position: fixed;' +
		'z-index: 1050;' +
		'top: 1px;' +
		'width: 100% !important;' +
		'max-width: 500px !important;' +
		'left: 50% !important;' +
		'transform: translateX(-50%) !important;' +
		'background-color: #fff;' +
		'font-family: "Open Sans, sans-serif";' +
		'box-shadow: 0 0 7px 4px #cecece;>' +
		'<p class="popup__header" style=" background-color: #3f5998;' +
		'color: #fff;' +
		'font-weight: 900;' +
		'font-size: 16px;' +
		'padding: 12px;' +
		'margin: 0px;"></p>' +
		'<div class="popup__main" style="display: flex;' +
		'flex-wrap: nowrap;' +
		'padding: 10px 20px !important;">' +
		'<div class="popup__img" style="flex: 0 0 67px;' +
		'width: 67px;' +
		'height: 67px;' +
		' background: url(' + pushPopupJson.image + ');' +
		'background-repeat: no-repeat;' +
		'background-size: contain;' +
		'margin-right: 15px;">' +
		'<img src="" alt="">' +
		'</div>' +
		'<div class="popup__text">' +
		'<p class="popup__title" ' +
		'style="font-size: 20px;' +
		'font-weight: 600;' +
		'padding-bottom: 3px !important;' +
		' margin: 0px;' +
		'color: #595959;">' + pushPopupJson.title + '</p>' +
		'<p class="popup__body" ' +
		'style="font-size: 15px;' +
		'margin: 0px;' +
		'color: #595959;">' + pushPopupJson.message + '</p>' +
		'</div>' +
		'</div>' +
		'<div class="popup__footer" style="background-color: #e7e7e7;' +
		'padding: 5px;' +
		'text-align: right;">' +
		' <button onclick="clickNotification(true)" class="popup__btn popup__btn--ok" style="color: #fff;' +
		'background-color: #3f5998;' +
		'border: 1px solid #3f5998;' +
		'display: inline-block;' +
		'text-decoration: none;' +
		'padding: 6px;' +
		'font-weight: 600;' +
		'font-size: 13px;' +
		'margin: 0 3px;' +
		'cursor: pointer;">' + pushPopupJson.btnAllowText + '</button>' +
		'<button onclick="clickNotification(false)" class="popup__btn popup__btn--cancel" style="display: inline-block;' +
		'text-decoration: none;' +
		'padding: 6px;' +
		'font-weight: 600;' +
		'font-size: 13px;' +
		'margin: 0 3px;' +
		'cursor: pointer;' +
		'color: #595959;' +
		'border: 1px solid #595959;' +
		'background-color: transparent;">' + pushPopupJson.btnCloseText + '</button>' +
		'</div>' +
		'</div>';

	if (!getCookie("push_do_not_show_notification_popup")) {
		$("body").append(notificationPopupDiv);
	}
}

var setCookie = function (name, value, i) {
	var d = new Date;
	d.setTime(d.getTime() + 1 * 1 * 3600); // 1 hour
	var expire = "expires=" + d.toUTCString();
	document.cookie = name + "=" + value + ";path=/;";
};

var getCookie = function (name) {
	for (var t = name + "=", n = document.cookie.split(";"), i = 0; i < n.length; i++) {
		for (var r = n[i]; " " === r.charAt(0);) r = r.substring(1);
		if (0 === r.indexOf(t)) return r.substring(t.length, r.length);
	}
	return !1;
};

function getUrlParams() {
	var e = {};
	window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (t, i, a) {
		e[i] = a
	});
	return e;
}

var openChildWindow = function (url, width, height) {
	var l, d = void 0 !== window.screenLeft ? window.screenLeft : screen.left,
		h = void 0 !== window.screenTop ? window.screenTop : screen.top,
		f = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width,
		g = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height,
		left = f / 2 - width / 2 + d, top = g / 2 - height / 2 + h;
	var a = window.open(url, "_blank", "scrollbars=yes, width=" + width + ", height=" + height + ", top=" + top + ", left=" + left);
	a.focus();
};

function fillTrackDataUrlParams(pushConfig) {
	var urlVars = getUrlParams();
	var pageAttributes = (typeof pushConfig !== 'undefined' && typeof pushConfig.urlParams !== 'undefined' && pushConfig.urlParams) ? JSON.parse(JSON.stringify(pushConfig.urlParams)) : {};
	var trackData = {};
	if (urlVars) {
		Object.keys(urlVars).forEach(function (key) {
			var value = urlVars[key];
			if ((typeof value !== 'undefined') && value) {
				trackData[key] = value;
			}
		});
	}
	if (pageAttributes) {
		Object.keys(pageAttributes).forEach(function (key) {
			var value = pageAttributes[key];
			if ((typeof value !== 'undefined') && value) {
				if (!trackData.hasOwnProperty(key) || key === 'cid') {
					trackData[key] = value;
				}
			}
		});
	}
	return trackData;
}

function getTrackDataUrlParams(pushTrack) {
	var trackDataString = "";
	Object.keys(pushTrack).forEach(function (key) {
		trackDataString += "&" + key + "=" + pushTrack[key];
	});
	return trackDataString;
}

function include(url) {
	var script = document.createElement('script');
	script.src = url;
	document.getElementsByTagName('head')[0].appendChild(script);
}

function isPushSupportedOnBrowser(browser) {
	return !isDefaultAndroidBrowser() && ('PushManager' in window)
		&& ((browser['browser'] == 'Chrome' && parseInt(browser['majorVersion']) > 52)
			|| (browser['browser'] == 'Firefox' && parseInt(browser['majorVersion']) > 44)
			|| (browser['browser'] == 'Opera' && parseInt(browser['majorVersion']) > 37 && getDeviceType() == 'mobile'))
}

function isDefaultAndroidBrowser() {
	var ua = navigator.userAgent;
	return (
		ua.indexOf('Mozilla/5.0') > -1 &&
		ua.indexOf('Android') > -1 &&
		ua.indexOf('AppleWebKit') > -1 &&
		(ua.indexOf('Version') > -1 || ua.indexOf('SamsungBrowser') > -1)
	);
}

//Detect private mode START
function retry(isDone, next) {
	var current_trial = 0, max_retry = 50, interval = 10, is_timeout = false;
	var id = window.setInterval(
		function () {
			if (isDone()) {
				window.clearInterval(id);
				next(is_timeout);
			}
			if (current_trial++ > max_retry) {
				window.clearInterval(id);
				is_timeout = true;
				next(is_timeout);
			}
		},
		10
	);
}

function isIE10OrLater(user_agent) {
	var ua = user_agent.toLowerCase();
	if (ua.indexOf('msie') === 0 && ua.indexOf('trident') === 0) {
		return false;
	}
	var match = /(?:msie|rv:)\s?([\d\.]+)/.exec(ua);
	if (match && parseInt(match[1], 10) >= 10) {
		return true;
	}
	return false;
}

function detectPrivateMode(callback) {
	var is_private;

	if (window.webkitRequestFileSystem) {
		window.webkitRequestFileSystem(
			window.TEMPORARY, 1,
			function () {
				is_private = false;
			},
			function (e) {
				is_private = true;
			}
		);
	} else if (window.indexedDB && /Firefox/.test(window.navigator.userAgent)) {
		var db;
		try {
			db = window.indexedDB.open('test');
		} catch (e) {
			is_private = true;
		}

		if (typeof is_private === 'undefined') {
			retry(
				function isDone() {
					return db.readyState === 'done' ? true : false;
				},
				function next(is_timeout) {
					if (!is_timeout) {
						is_private = db.result ? false : true;
					}
				}
			);
		}
	} else if (isIE10OrLater(window.navigator.userAgent)) {
		is_private = false;
		try {
			if (!window.indexedDB) {
				is_private = true;
			}
		} catch (e) {
			is_private = true;
		}
	} else if (window.localStorage && /Safari/.test(window.navigator.userAgent)) {
		try {
			window.localStorage.setItem('test', 1);
		} catch (e) {
			is_private = true;
		}

		if (typeof is_private === 'undefined') {
			is_private = false;
			window.localStorage.removeItem('test');
		}
	}

	retry(
		function isDone() {
			return typeof is_private !== 'undefined' ? true : false;
		},
		function next(is_timeout) {
			callback(is_private);
		}
	);
}

//Detect private mode END

function getBrowserInfo() {
	navigator.appVersion;
	var e, t, i, a = navigator.userAgent,
		n = navigator.appName,
		r = "" + parseFloat(navigator.appVersion),
		o = parseInt(navigator.appVersion, 10);
	return -1 != (t = a.indexOf("Opera")) && (n = "Opera", r = a.substring(t + 6), -1 != (t = a.indexOf("Version")) && (r = a.substring(t + 8))), -1 != (t = a.indexOf("OPR")) ? (n = "Opera", r = a.substring(t + 4)) : -1 != (t = a.indexOf("MSIE")) ? (n = "Microsoft Internet Explorer", r = a.substring(t + 5)) : -1 != (t = a.indexOf("Chrome")) ? (n = "Chrome", r = a.substring(t + 7)) : -1 != (t = a.indexOf("Safari")) ? (n = "Safari", r = a.substring(t + 7), -1 != (t = a.indexOf("Version")) && (r = a.substring(t + 8))) : -1 != (t = a.indexOf("Firefox")) ? (n = "Firefox", r = a.substring(t + 8)) : -1 != a.indexOf("Trident/") ? (n = "Microsoft Internet Explorer", r = a.substring(a.indexOf("rv:") + 3)) : (e = a.lastIndexOf(" ") + 1) < (t = a.lastIndexOf("/")) && (n = a.substring(e, t), r = a.substring(t + 1), n.toLowerCase() == n.toUpperCase() && (n = navigator.appName)), -1 != (i = r.indexOf(";")) && (r = r.substring(0, i)), -1 != (i = r.indexOf(" ")) && (r = r.substring(0, i)), -1 != (i = r.indexOf(")")) && (r = r.substring(0, i)), o = parseInt("" + r, 10), isNaN(o) && (r = "" + parseFloat(navigator.appVersion), o = parseInt(navigator.appVersion, 10)), {
		browser: n,
		version: r,
		majorVersion: o
	}
}

function getDeviceType() {
	var e = 1,
		t = "desktop";
	return function (t) {
		(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))) && (e = 2)
	}(navigator.userAgent || navigator.vendor || window.opera), 2 == e && (t = "mobile"), t
}

function getLanguage() {
	return navigator.language || navigator.userLanguage
}

var defaultFirstPopupJson = {
	"languageCode": "en",
	"title": "HI sweety :) Wanna chat now? So click here))) I'm free tonight",
	"message": "Ann, 26 y.o.",
	"btnAllowText": "Chat NOW",
	"btnCloseText": "Later",
	"image": "https://rawcdn.githack.com/mauricioestra/sun/1ceebd8e39c7067deaf81f59d2e11e9994c33f9b/icon.png",
	"backgroundColor": "#f0eff0",
	"titleColor": "#000000",
	"messageColor": "#000000",
	"btnAllowBgColor": "#0084f6",
	"btnAllowColor": "#ffffff",
	"btnCloseBgColor": "#ffffff",
	"btnCloseColor": "#000000",
	"pathToLanding": "",
	"excludeWrongBrowser": false
};


function resolveCidByPid(pid) {
	var result = -1;
	if (typeof pid !== 'undefined' && pid !== null && !isNaN(parseInt(pid)) && pidTOcidMap.has(parseInt(pid))) {
		result = pidTOcidMap.get(parseInt(pid));
	}
	return result;
};
