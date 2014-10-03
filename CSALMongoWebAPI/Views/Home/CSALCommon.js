﻿//NOTE: requires jQuery to be previously imported

//Just in case we're on a weird platform without a console
if (!window.console) {
    window.console = { log: function () { } };
}


//Helper for jQuery to see if a query returns anything
$.fn.exists = function () {
    return this.length && this.length !== 0;
};

//Actual helpers
var CSALCommon = {
    progressDialogSelector: null,
    progressDialogTextSelector: null,

    showProgress: function (txt) {
        try {
            if (!!CSALCommon.progressDialogSelector) {
                var dlg = $(CSALCommon.progressDialogSelector);
                if (dlg.exists()) {
                    if (!!CSALCommon.progressDialogTextSelector) {
                        console.log(txt);
                        $(CSALCommon.progressDialogTextSelector).text(!!txt ? txt : "Working");
                    }
                    dlg.show();
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    },

    hideProgress: function () {
        try {
            if (!!CSALCommon.progressDialogSelector) {
                var dlg = $(CSALCommon.progressDialogSelector);
                if (dlg.exists()) {
                    dlg.hide();
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    },

    //Helper to get always-valid, always-trimmed string
    trimmedStr: function (s) {
        var ss = "" + s;
        if (ss && ss != "undefined" && ss != "null" && ss.length && ss.length > 0) {
            return $.trim(ss);
        }
        else {
            return "";
        }
    },

    arrLen: function (a) {
        return (a && a.length) ? a.length : 0;
    },

    showRows: function (tableSelector, rows) {
        var table = $(tableSelector).DataTable();
        table
            .clear()
            .rows.add(rows)
            .draw()
        ;
    },

    doServerGet: function (url, progressText, dataTarget) {
        CSALCommon.showProgress(progressText);
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json"
        })
        .done(function (data, textStatus, jqXHR) {
            CSALCommon.hideProgress();
            console.log("Call done [" + url + "]: " + textStatus);
            if (textStatus != "success") {
                //OOPS - server didn't like our request
                var errMsg = textStatus + "???";
                try {
                    errMsg = data.errmsg;
                } catch (err) { }
                alert("There was an issue [" + url + "]: " + errMsg);
            }
            else {
                //SUCCESS!
                dataTarget(data);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            CSALCommon.hideProgress();
            console.log("Call done [" + url + "]: " + textStatus + ", error:" + errorThrown);
            alert("There was an error [" + url + "] ==> " +
                "[" + textStatus + ": " + errorThrown + "]"
            );
        });
    },

    lessonPathMarkup: function (lessonPath) {
        //Given the string lessonPath, return a DOM element suitable for
        //appending for display
        lessonPath = CSALCommon.trimmedStr(lessonPath);
        if (lessonPath.length < 1)
            return $("<span></span>").text(lessonPath);

        var last = "M";
        var component = $("<span></span>");

        for (var i = 0; i < lessonPath.length; ++i) {
            var c = lessonPath[i];
            if (c != last) {
                if (c == "E" || (c == "M" && last == "H")) {
                    component.append($("<span class='glyphicon glyphicon-arrow-down'></span>"))
                }
                else if (c == "H" || (c == "M" && last == "E")) {
                    component.append($("<span class='glyphicon glyphicon-arrow-up'></span>"))
                }
                else {
                    //???
                    component.append($("<span class='glyphicon glyphicon-question-sign'></span>"))
                }
            }
            component.append($("<span></span>").text(c));
        }

        return component;
    }
};