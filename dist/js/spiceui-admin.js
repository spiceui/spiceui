(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _spiceuiAdmin = __webpack_require__(10);

var _spiceuiAdmin2 = _interopRequireDefault(_spiceuiAdmin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 
$('.e-spice-branch-left').on('tap', function () {
	var $self = $(this),
	    $fa = $('.spice-fa', $self),
	    $wrapper = $('#spice-wrapper');
	if ($wrapper.hasClass('spice-admin-shrink-left')) {
		$wrapper.removeClass('spice-admin-shrink-left');
		$fa.removeClass('spice-fa-indent');
	} else {
		$wrapper.addClass('spice-admin-shrink-left');
		$fa.addClass('spice-fa-indent');
	}
}); // --

$('.e-spice-branch-right').on('tap', function () {
	var $self = $(this),
	    $fa = $('.spice-fa', $self),
	    $wrapper = $('#spice-wrapper');
	if ($wrapper.hasClass('spice-admin-shrink-right')) {
		$wrapper.removeClass('spice-admin-shrink-right');
		$fa.removeClass('spice-fa-close').addClass('spice-fa-bars');
	} else {
		$wrapper.addClass('spice-admin-shrink-right');
		$fa.removeClass('spice-fa-bars').addClass('spice-fa-close');
	}
});

// 
$.spice.Dropdown('.e-spice-dropdown');

//
var tab = $.spice.Tab('.e-spice-tab');
tab.selector.on('spice.tab.titleTap', function (e, o) {
	var curMenu = o.curMenu,
	    self = o.self,
	    index = curMenu.index(),
	    $parent = curMenu.parent();

	if (index == 0) {
		curMenu.trigger('tap');
	} else {
		// 删除操作
		curMenu.remove();
		self.$contentItem.eq(index).remove();
		// 重置tab
		self.init({
			initIndex: $('.spice-active', $parent).index()
		});
	}
});

// 
$('.e-spice-collapse').on('spice.collapse.tap', function (e) {
	if ($.spice.getWindowWidth() >= 1023) {
		$('#spice-wrapper').removeClass('spice-admin-shrink-left');
	}
});
$.spice.Collapse('.e-spice-collapse');

// 
var $tab = $('.e-spice-tab'),
    $tabTitle = $('.spice-tab-title', $tab),
    $tabContent = $('.spice-tab-content', $tab);
$('a[spice-href]', '.e-spice-collapse').on('tap', function () {
	var $self = $(this),
	    href = $self.attr('spice-href'),
	    text = $.trim($self.text());

	if (!href) return false;

	var $curTabTitle = $('[spice-data-href="' + href + '"]', $tabTitle);
	if ($curTabTitle.length <= 0) {
		$tabTitle.append('<li spice-data-href="' + href + '">' + text + '<i>&times;</i></li>');
		$tabContent.append('<div class="spice-tab-item">\n\t                            <iframe src="' + href + '" frameborder="0"></iframe>\n\t                        </div>');
		$curTabTitle = $('[spice-data-href="' + href + '"]', $tabTitle);
	}

	tab.init({
		initIndex: $curTabTitle.index()
	});
});

//
$('.e-spice-refresh').on('mouseenter', function () {
	$('.spice-fa', this).addClass('spice-fa-spin');
}).on('mouseleave', function () {
	$('.spice-fa', this).removeClass('spice-fa-spin');
}).on('tap', function () {
	var $iframe = $('.spice-tab-item:visible iframe', $tabContent),
	    src = $iframe.attr('src');
	$iframe.attr('src', src);
});

/***/ })

/******/ });
});