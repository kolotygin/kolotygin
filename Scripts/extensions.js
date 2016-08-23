Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function (key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
};

if (typeof Date.prototype.format === "undefined") {
    Date.prototype.format = function (pattern) {
        var hours = this.getHours();
        var ttime = "AM";
        if (pattern.indexOf("t") > -1 && hours > 12) {
            hours = hours - 12;
            ttime = "PM";
        }

        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": hours, //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds(), //millisecond,
            "t+": ttime
        };

        if (/(y+)/.test(pattern)) {
            pattern = pattern.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(pattern)) {
                pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return pattern;
    };
}

(function ($) {
    $.fn.onEnter = function (fn) {
        return this.each(function () {
            var $this = $(this);
            $this.bind('onEnter', fn);
            $this.keydown(function (e) {
                if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
                    e.preventDefault();
                    e.stopPropagation();
                    $this.trigger('onEnter');
                }
            });
        });
    };
})(jQuery);
