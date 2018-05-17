import DialogCore from './core/dialogCore';

class Dialog extends DialogCore{

	constructor(options){
		super();
		this.pluginName = 'dialog';
		this.options = $.extend(true, {}, this.options, {
			showCloseBtn: true
			, title: '提示'
			, buttons: []
			, dialogClass: ''
		}, options);
	}

	_initDialogTemplate( opts ){
		let self = this
			, options = opts || self.options
			, closeHtml = options.showCloseBtn ? `<i class="spice-btn spice-dialog-close">&times;</i>` : ``
			, buttonsHtml = (() => {
				let buttons = options.buttons || []
					, buttonsHtml = ``;
				if( buttons.length > 0 ){
					let buttonsStr = buttons.map((item, i)=>{
							let className = item.className || ''
								, href = item.href || ''
								, target = item.target || ''
								, text = item.text || ''
								, hrefTemp = href ? ` href="${href}"` : ``
								, targetTemp = href && target ? ` target="${target}"` : ``;
							if( text ){
								return `<a class="spice-btn spice-btn-default ${className}"${hrefTemp}${targetTemp}>${text}</a>`;
							}else{
								return ``;
							}
						}).join('');
					buttonsHtml = `<div class="spice-dialog-btn-group">${buttonsStr}</div>`;
				}
				return buttonsHtml;
			})()
			, $spiceDialog = $(
				`<div class="spice-dialog ${options.dialogClass}">
					<div class="spice-dialog-container">
						<div class="spice-dialog-head">${options.title}</div>
						<div class="spice-dialog-content">
							${options.template}
							${buttonsHtml}
						</div>
						${closeHtml}
					</div>
				</div>`
			);

		$spiceDialog.hide().appendTo('body');
		$spiceDialog.css('zIndex', $.spice.getMaxZIndex() + 1);
		return $spiceDialog;
	}

}

module.exports = (options={}) => {
    return new Dialog(options).init();
}