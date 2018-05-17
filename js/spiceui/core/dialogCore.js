class DialogCore{

	constructor(options){
		this.options = $.extend(true, {}, {
			template: '&nbsp;'
			, maskClose: true
			, autoClose: false
			, show: {
				easing: 'fadeIn'
				, speed: 'fast'
			}
			, hide: {
				easing: 'fadeOut'
				, speed: 'fast'
			}
		}, options);
	}

	init( opts ){
		let self = this
			, options = $.extend(true, {}, self.options, opts);

		self.timmer = null;
		self.destory();

		self.selector = self._initDialogTemplate( options );
		
		// 默认元素事件
		self._initActivate();

		return self;
	}

	show(){
		let self = this
			, $selector = self.selector
			, options = self.options
			, timeNum =  options.autoClose
			, showO = options.show || {}
			, pluginName = '.' + self.pluginName;

		$selector.stop(true, true)[showO.easing](showO.speed, ()=>{
			$selector.trigger(`spice${pluginName}.show`, self);
		});

		if( $.isNumeric(timeNum) ){
			if( self.timmer ) clearTimeout( self.timmer );
            self.timmer = setTimeout(()=>{
				                self.hide();
				            }, timeNum);
        }
	}

	hide(){
		let self = this
			, $selector = self.selector
			, options = self.options
			, hideO = options.hide || {}
			, pluginName = '.' + self.pluginName;

		$selector.stop(true, true)[hideO.easing](hideO.speed, ()=>{
			$selector.trigger(`spice${pluginName}.hide`, self);
		});
	}

	destory(){
		let self = this
			, $selector = self.selector;
		if( $selector && $selector.length > 0 ){
			$selector.remove();
		}
	}

	_initActivate(){
		let self = this
			, $selector = self.selector
			, options = self.options;

		// 关闭按钮
		$('.spice-dialog-close', $selector).on('tap', ()=>{
			self.hide();
		});

		// 遮罩关闭
		if( options.maskClose ){
			$selector.on('tap', (e)=>{
				let $target = $( e.target );
				if( $target.hasClass('spice-dialog') ){
					self.hide();
				}
			});
		}
	}

	_initDialogTemplate(){}

}

DialogCore.prototype.constructor = DialogCore;

module.exports = DialogCore;