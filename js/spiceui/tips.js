import DialogCore from './core/dialogCore';

class Tips extends DialogCore{

	constructor(options){
		super();
		this.pluginName = 'tips';
		this.options = $.extend(true, {}, this.options, {
			tipsClass: ''
			// success，warning，error
			, type: 'warning'
			, typeClass: ''
			, maskClose: false
			, autoClose: 2000
		}, options);

		this.typeFontClass = {
			success: 'spice-fa spice-fa-check'
			, warning: 'spice-fa spice-fa-exclamation'
			, error: 'spice-fa spice-fa-close'
		}
	}

	_initDialogTemplate( opts ){
		let self = this
			, options = opts || self.options
			, getIcon = (() => {
				let typeClass = options.typeClass
					, type = options.type
					, typeFontClass = self.typeFontClass[type];
				if( typeClass ){
					return `<i class="${typeClass}"></i>`;
				}else if( typeFontClass ){
					return `<i class="${typeFontClass}"></i>`;
				}else{
					return '';
				}
			})()
			, $spiceTips = $(
				`<div class="spice-tips ${options.tipsClass}">
					<div class="spice-tips-container">
						${getIcon}
						<div class="spice-tips-content">
							${options.template}
						</div>
					</div>
				</div>`
			);

		$spiceTips.hide().appendTo('body');
		$spiceTips.css('zIndex', $.spice.getMaxZIndex() + 1);
		return $spiceTips;
	}
}

module.exports = (options={}) => {
    return new Tips(options).init();
}