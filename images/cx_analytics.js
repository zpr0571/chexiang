(function () {
    var analytics = {
        config: {
            url: (("https:" == document.location.protocol) ? " https://" : " http://") + "data.chexiang.com/a.gif",

            expires: 8888,
            domain: 'chexiang.com',
            path: "/",

            version: 20150319,
            type: "pv",
            wcid: "wcid",
            usid: "analysis_sign",
            jsName: 'cx_analytics'
        },
        reconfig: function (type) {
            this.config.type = type || this.config.type;
            this.data.t = type || this.config.type;

            return this;
        },
        data: {
            t: "pv"
        },
        getDate: function () {
            this.data.time = new Date().getTime();
            if (document) {
                this.data.title = document.title || '';
                this.data.r = document.referrer || '';
                this.data.ct = document.charset || document.characterSet || "";
            }
            if (window && window.screen) {
                this.data.srh = window.screen.height || 0;
                this.data.srw = window.screen.width || 0;
            }
            if (navigator) {
                this.data.ul = navigator.language || '';
            }
            this.data.v = this.util.getVersion();
            this.data[this.config.usid] = this.util.getCookie(this.config.usid) || '';

            var wcid = this.util.getCookie(this.config.wcid) || '';

            if (wcid && wcid.length == 36) {
                this.data.nu = 0;
            } else {
                this.data.nu = 1;
                wcid = this.util.getUUID();
                this.util.setCookie(this.config.wcid,
                    wcid,
                    this.config.expires,
                    this.config.path,
                    this.config.domain);
            }
            return this;
        },
        dataProcess: function () {
            //if (this.config.type == "pv") {
            var args = "";
            for (var i in this.data) {
                if (args != '') {
                    args += '&';
                }
                args += i + '=' + encodeURIComponent(this.data[i]);
            }
            this.args = args;
            //}

            return this;
        },
        send: function () {
            var img = new Image(1, 1);
            img.src = this.config.url + "?" + this.args;
        },
        util: {
            getVersion: function () {
                return analytics.config.version;
            },
            getCookie: function (name) {
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = this.trim(cookies[i].toString());
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            },
            setCookie: function (sName, value, exp, path, domain, secure) {
                var expires = new Date;
                exp = typeof exp == 'undefined' ? '' : ';expires=' + new Date(expires.getTime() + (exp * 24 * 60 * 60 * 1000)).toUTCString();
                document.cookie = sName + "=" + value
                                + exp
                                + ((domain == null) ? "" : ("; domain=" + domain))
                                + ((path == null) ? "" : ("; path=" + path))
                                + ((secure == true) ? "; secure" : "");
            },
            trim: function (str) {
                return str.replace(/(^\s*)|(\s*$)/g, "");
            },
            getUUID: function () {
                var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
                var chars = CHARS, uuid = new Array(36), rnd = 0, r;
                for (var i = 0; i < 36; i++) {
                    if (i == 8 || i == 13 || i == 18 || i == 23) {
                        uuid[i] = '-';
                    } else if (i == 14) {
                        uuid[i] = '4';
                    } else {
                        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                        r = rnd & 0xf;
                        rnd = rnd >> 4;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
                return uuid.join('');
            },
            getParam: function (url, paramName) {
                var reg = new RegExp("(^|\\?|&)" + paramName + "=([^&]*)(\\s|&|$)", "i");
                if (reg.test(url))
                    return RegExp.$2;
                else
                    return "";
            },
            base64encode: function (str) {
                var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                var out, i, len;
                var c1, c2, c3;
                len = str.length;
                i = 0;
                out = "";
                while (i < len) {
                    c1 = str.charCodeAt(i++) & 0xff;
                    if (i == len) {
                        out += base64EncodeChars.charAt(c1 >> 2);
                        out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                        out += "==";
                        break;
                    }
                    c2 = str.charCodeAt(i++);
                    if (i == len) {
                        out += base64EncodeChars.charAt(c1 >> 2);
                        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                        out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                        out += "=";
                        break;
                    }
                    c3 = str.charCodeAt(i++);
                    out += base64EncodeChars.charAt(c1 >> 2);
                    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                    out += base64EncodeChars.charAt(c3 & 0x3F);
                }
                return out;
            },
            isString: function (str) {
                return (str != null) && (str != undefined) && (typeof str == 'string') && (str.constructor == String);
            },
            isNumber: function (num) {
                return (typeof num == 'number') && (num.constructor == Number);
            },
            isDate: function (d) {
                return d && (typeof d == 'object') && d.constructor == Date;
            },
            isArray: function (arr) {
                return arr && (typeof arr == 'object') && (arr.constructor == Array);
            },
            isObject: function (obj) {
                return obj && (typeof obj == 'object') && (obj.constructor == Object);
            }
        },
        args: ""
    };
    window.ANA = analytics;
})();

(function () {
    var type = window.ANA.util.getParam(document.getElementById("analyticsScript").src, "type");
    window.ANA.reconfig(type).getDate().dataProcess().send();
})();