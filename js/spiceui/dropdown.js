import DropdownCore from './core/dropdownCore';

let toggle = [];

class Dropdown extends DropdownCore{

	constructor(selector, options){
		super();
		this.selector = selector;
		this.pluginName = 'dropdown';
		this.options = $.extend(true, {}, this.options, options);
	}

	// 按钮点击
	_dropElemTap(){
		let self = this;
		self.$dropElem
			.off(`tap.spice.${self.pluginName}`)
			.on(`tap.spice.${self.pluginName}`, (e)=>{
				self[ self.$showElem.is(':visible') ? 'hide' : 'show' ]();
			});
	}

	// 下拉内容点击
	_showElemTap(){
		let self = this
		self.$showElemTap
			.off(`tap.spice.${self.pluginName}`)
			.on(`tap.spice.${self.pluginName}`, (e)=>{
				self.selector.trigger(`spice.${self.pluginName}.submenu-tap`, { curMenu:$(e.currentTarget), self: self });
				self.hide();
			});
	}
}

module.exports = (selector, options) => {
	if( !(selector && !$.isPlainObject(selector)) ) return false;

	$('body').off('tap.spice.dropdown').on('tap.spice.dropdown', (e)=>{
		$.each(toggle, (i, elem)=>{
			let $elem = $(elem)
				, data = $elem.data('spice.dropdown');
			if( data && !$.contains($elem[0], e.target) ){
				data.hide();
			}
		});
	});

	let rtn = {};
	$(selector).each((index, self)=>{
		let $self = $(self)
			, data = $self.data('spice.dropdown');
		toggle.push(self);
		if (!data) $self.data('spice.dropdown', (data = new Dropdown($self, options).init()));
		rtn[index] = data;
	})

	if( $(selector).length == 1 ){
        rtn = rtn[0];
    }
    return rtn;
}