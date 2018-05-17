class DropdownCore{

	constructor(selector, options){
		this.selector = selector;
		this.options = $.extend(true, {}, {
			dropElem: '.spice-btn'
			, showElem: '.spice-dropdown-menu'
			, showElemTap: 'li'
			, activeClass: 'spice-active'
			, show: {
				easing: 'slideDown'
				, speed: 'fast'
			}
			, hide: {
				easing: 'slideUp'
				, speed: 'fast'
			}
		}, options);
	}

	init(){
		let self = this
			, $selector = self.selector
			, options = self.options;

		self.$dropElem = $(options.dropElem, $selector);
		self.$showElem = $(options.showElem, $selector);
		self.$showElemTap = $(options.showElemTap, self.$showElem);

		self._dropElemTap();
		self._showElemTap();

		return self;
	}

	show( $self ){
		let self = this
			, options = self.options
			, $selector = self.selector
			, selfNotEmpty = ($self || '').length > 0
			, $parent = selfNotEmpty ? $self.parent() : $selector
			, $showElem = selfNotEmpty ? $self.siblings(options.showElem) : self.$showElem
			, showO = options.show || {}
			, pluginName = '.' + self.pluginName;
		$parent.addClass( options.activeClass );
		$showElem.stop(true, true)[showO.easing](showO.speed, ()=>{
			$selector.trigger(`spice${pluginName}.show`, self);
		});
	}

	hide( $self ){
		let self = this
			, options = self.options
			, $selector = self.selector
			, selfNotEmpty = ($self || '').length > 0
			, $parent = selfNotEmpty ? $self.parent() : $selector
			, $showElem = selfNotEmpty ? $self.siblings(options.showElem) : self.$showElem
			, hideO = options.hide || {}
			, pluginName = '.' + self.pluginName;

		$parent.removeClass( options.activeClass );
		$showElem.stop(true, true)[hideO.easing](hideO.speed, ()=>{
			$selector.trigger(`spice${pluginName}.hide`, self);
		});
	}

	_dropElemTap(){}

	_showElemTap(){}
}

DropdownCore.prototype.constructor = DropdownCore;

module.exports = DropdownCore;