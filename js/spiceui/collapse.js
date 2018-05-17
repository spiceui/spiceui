import DropdownCore from './core/dropdownCore';

class Collapse extends DropdownCore{

	constructor(selector, options){
		super();
		this.selector = selector;
		this.pluginName = 'collapse';
		this.options = $.extend(true, {}, this.options, {
			closeOther: true
			, dropElem: 'a'
			, showElem: 'ul'
		}, options);

	}

	// 按钮点击
	_dropElemTap(){
		let self = this
			, options = self.options;
		self.$dropElem
			.off(`tap.spice.${self.pluginName}`)
			.on(`tap.spice.${self.pluginName}`, (e)=>{
				let $self = $(e.currentTarget)
					, $siblingsElem = $self.siblings(options.showElem);
				if( $siblingsElem.length > 0 ){
					self[ $siblingsElem.is(':visible') ? 'hide' : 'show' ]( $self );
					options.closeOther && self._hideOtherMenu( $siblingsElem );
				}
				self.selector.trigger(`spice.${self.pluginName}.tap`, { curMenu:$(e.currentTarget), self: self });
			});
	}

	_hideOtherMenu( $self ){
		let self = this
			, options = self.options
			, selector = self.selector;
		$.each($(options.showElem, selector), (i, elem)=>{
			let $otherElem = $(elem).not($self);
			if( $otherElem.length > 0 ){
				self.hide( $otherElem.siblings( $(options.dropElem) ) );
			}
		});
	}
}

module.exports = (selector, options) => {
	if( !(selector && !$.isPlainObject(selector)) ) return false;

	let rtn = {};
	$(selector).each((index, self)=>{
		let $self = $(self)
			, data = $self.data('spice.collapse');
		if (!data) $self.data('spice.collapse', (data = new Collapse($self, options).init()));
		rtn[index] = data;
	})

	if( $(selector).length == 1 ){
        rtn = rtn[0];
    }
    return rtn;
}