// --
import spiceui from '../scss/spiceui.scss'

require('jquery');
require('jquery-migrate');

// 常用事件
require('./spiceui/events')

let spice = {}
	, $window = $(window);

spice.isAndroid = (/android/gi).test(navigator.appVersion);
spice.isIDevice = (/iphone|ipad/gi).test(navigator.appVersion);
spice.isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);

spice.hasTouch = 'ontouchstart' in window && !spice.isTouchPad;

// 常用方法

spice.isUndefined = (o) => {
    return o === undefined;
}
spice.isNull = (o) => {
    return o === null;
}
spice.isBoolean = (o) => {
    return toString.call(o) === '[object Boolean]';
}
spice.isString = (o) => {
    return toString.call(o) === '[object String]';
}

// 返回body下最大的zIndex值
spice.getMaxZIndex = () => { 
    return Math.max.apply(null, $('*', document.body).map(()=>{ return $(this).css('zIndex')>>>0; }).get());
}

// 获取url所传参数的值
spice.getURLParameter = (key, frame) => {
    let param = (frame || window).location.search,reg = new RegExp('[&\?]+'+key+'=([^&]*)'),str = '';
      if(reg.test(param))str = RegExp.$1;
      return str;
}

// 返回字符串的字符长度，一个中文占两个字符长度
spice.getStringLength = (str) => {
    let num = 0, i = 0, len = str.length, unicode;
    for(; i < len; i++){
        unicode = str.charCodeAt(i);
        num += unicode > 127 ? 2 : 1;
    }
    return num;
}

// 本函数将字符串 str 的第 start 位起的字符串取出 strlen 个字符。
// 若 start 为负数，则从字符串尾端算起。
// 若可省略的参数 strlen 存在，但为负数，则表示取到倒数第 strlen 个字符。
// str 要截取的字符串
// start 开始点
// strlen 截取长度
spice.subString = (str, start, strlen) => {
    let i = 0, num = 0, unicode, rstr = '',
        len = str.length, sblen = spice.getStringLength(str);

    if (start < 0) {
        start = sblen + start;
    }

    if (strlen < 0 || $.type(strlen) != 'number') {
        strlen = ~~strlen + sblen;
    }
    else{
        strlen += start;
    }

    // 起点
    for(; i < len; i++) {
        if (num >= start) {
            break;
        }
        let unicode = str.charCodeAt(i);
        num += unicode > 127 ? 2 : 1;
    }

    // 开始取
    for(; i < len; i++) {
        let unicode = str.charCodeAt(i);
        num += unicode > 127 ? 2 : 1;

        if (num > strlen) {
            break;
        }

        rstr += str.charAt(i);
    }

    return rstr;
}

// 元素的可视区域
// elem 元素选择器
// callback 元素在可视区域的回调函数
spice.visualArea = (elem, options) => {
    if(!elem || !spice.isString(elem) || $(elem).length == 0) return false;
    let opt = {
        callBack: null
        , num: 0
    }
    opt = $.extend({}, opt, options);
    $window.off('scroll.spice.visualArea').on('scroll.spice.visualArea', () => {
        let $W = $(this);
        if ($W.scrollTop() + $W.height() > $(elem).offset().top - opt.num) {
            opt.callBack && $.isFunction(opt.callBack) && opt.callBack($(elem));
        }
    }).trigger('scroll.spice.visualArea');
}

// 获取浏览器滚动条宽度
spice.getScrollbarWidth = () => {
    if( spice.android || $('body').height() <= $window.height() ){
        return 0;
    }else{
        let p = document.createElement('p')
            , styles = {
                width: '100px'
                , height: '100px'
                , overflowY: 'scroll'
            }
            , i
            , scrollbarWidth;
        for (i in styles) p.style[i] = styles[i];
        document.body.appendChild(p);
        scrollbarWidth = p.offsetWidth - p.clientWidth;
        $(p).remove();
        return scrollbarWidth;
    }
}

// 获取 window 的宽度
spice.getWindowWidth = () => {
    return $window.width() + spice.getScrollbarWidth();
}

// 获取时间戳
spice.getTimestamp = () => {
    return (new Date()).getTime().toString();
}

// 数组去重
spice.unique = (sz) => {
    let res = [];
    let json = {};
    for(let i = 0; i < sz.length; i++){
        if(!json[sz[i]]){
            res.push(sz[i]);
            json[sz[i]] = 1;
        }
    }
    return res;
}

// A (possibly faster) way to get the current timestamp as an integer.
spice.now = Date.now || function () {
    return new Date().getTime();
};

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
spice.throttle = (func, wait, options) => {
    let context, args, result;
    let timeout = null;
    let previous = 0;
    if (!options) options = {};
    let later = () => {
        previous = options.leading === false ? 0 : spice.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return () => {
        let now = spice.now();
        if (!previous && options.leading === false) previous = now;
        let remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
            clearTimeout(timeout);
            timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
spice.debounce = (func, wait, immediate) => {
    let timeout, args, context, timestamp, result;

    let later = () => {
        let last = spice.now() - timestamp;

        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return () => {
        context = this;
        args = arguments;
        timestamp = spice.now();
        let callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
};

// 下拉菜单
import Dropdown from './spiceui/dropdown';
spice.Dropdown = Dropdown;

// 折叠菜单
import Collapse from './spiceui/collapse';
spice.Collapse = Collapse;

// 弹出层
import Dialog from './spiceui/dialog';
spice.Dialog = Dialog;

// 弹出框
import Tips from './spiceui/tips';
spice.Tips = Tips;

// 选项卡
import Tab from './spiceui/tab';
spice.Tab = Tab;

// 轮播
import Carousel from './spiceui/carousel';
spice.Carousel = Carousel;

// 翻页
import Pagination from './spiceui/pagination';
spice.Pagination = Pagination;

$.spice = spice;