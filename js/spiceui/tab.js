class Tab {
	constructor(selector, options){
		this.selector = selector;
		this.pluginName = 'tab';
		this.options = $.extend(true, {}, {
			activeClass: 'spice-active'
			, titleContainer: '.spice-tab-title'
			, titleItem: 'li'
			, titleTriggerTagName: 'i'
			, contentContainer: '.spice-tab-content'
			, contentItem: '.spice-tab-item'
			, initIndex: 0
		}, options);
	}

	init(opts){
		let self = this
			, $selector = self.selector
			, options = $.extend(true, {}, self.options, opts)
			, activeClass = options.activeClass;

		self.$titleContainer = $(options.titleContainer, $selector)
		self.$titleItem = $(options.titleItem, self.$titleContainer);
		self.$contentContainer = $(options.contentContainer, $selector)
		self.$contentItem = $(options.contentItem, self.$contentContainer);

		self.$titleItem.off(`tap.spice.${self.pluginName}`).on(`tap.spice.${self.pluginName}`, (e)=>{
			let $self = $(e.currentTarget)
				, index = $self.index();

			if( e.target.tagName.toUpperCase() == options.titleTriggerTagName.toUpperCase() ){
				$selector.trigger(`spice.${self.pluginName}.titleTap`, { curMenu:$(e.currentTarget), self: self });
			}else{
				self.show( index );
			}
		});

		// 初始化位置
		self.show( options.initIndex > 0 ? options.initIndex : 0 );

		return self;
	}

	show( index = 0 ){
		let self = this
			, $selector = self.selector
			, options = self.options
			, activeClass = options.activeClass;

		self.$titleItem.eq( index )
			.addClass( activeClass )
			.siblings( options.titleItem ).removeClass( activeClass );

		self.$contentItem.eq( index )
			.show().addClass( activeClass )
			.siblings( options.contentItem ).hide().removeClass( activeClass )
	}
}

module.exports = (selector, options) => {
	if( !(selector && !$.isPlainObject(selector)) ) return false;

	let rtn = {};
	$(selector).each((index, self)=>{
		let $self = $(self)
			, data = $self.data('spice.tab');
		if (!data) $self.data('spice.tab', (data = new Tab($self, options).init()));
		rtn[index] = data;
	})

	if( $(selector).length == 1 ){
        rtn = rtn[0];
    }
    return rtn;
}