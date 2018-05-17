class Carousel{

	constructor(selector, options){
		this.selector = selector;
		this.options = $.extend(true, {}, {
							// 效果的类型，1：滚动，2：渐隐渐现
							// type: '1'
							// 是否无限循环滚动
							loop: true
							// 动画速度控制
							, speed: '0.6s'
							// 是否自动轮播
							, auto: true
							// 轮播延时
							, time: 3000
							// 是否显示焦点图
							, dot: true
							// 是否显示箭头按钮
							, arrowBtn: false
							// 轮播滚动前回调函数
							// , scrollBefore: function(){}
							// 轮播滚动结束回调函数
							// , scrollAfter: function(){}
					}, options);
	}

	init(){
		let self = this
			, $selector = self.selector
			, options = self.options
			, $ul = $('.spice-carousel-content > ul', $selector)
			, $li = $('> li', $ul);

		if( $li.length <= 1 ) return self;

		if(options.loop){
			if( $('li.spice-carousel-clone', $ul).length == 0 ){
				let $cloneLiFirst = $li.first().clone(true).addClass('spice-carousel-clone')
					, $cloneLiLast = $li.last().clone(true).addClass('spice-carousel-clone');
				$ul.append($cloneLiFirst).prepend($cloneLiLast);
				$li = $('> li', $ul);
			}
		}

		// 添加焦点图
		self.addDot();

		// 添加箭头
		self.addArrowBtn();

		let liWidth = 100/$li.length + '%';

		$ul.css({
			width: $li.length + '00%'
			, transitionDuration: '0s'
			, transform: 'translate3d(' + (options.loop ? '-'+ liWidth : '0') + ', 0, 0)'
		});

		$li.css({
			width: liWidth
			, display: 'block'
		});

		$selector
			.off('mouseenter.spice.carousel')
			.off('mouseleave.spice.carousel')
			.on('mouseenter.spice.carousel', function(){
				self.removeInterval();
			})
			.on('mouseleave.spice.carousel', function(){
				self.addInterval();
			}).trigger('mouseleave.spice.carousel');

		self.addTouch();

		return self;
	}

	addDot(){
		let self = this
			, $selector = self.selector
			, options = self.options
			, $ul = $('.spice-carousel-content > ul', $selector)
			, $li = $('> li:not(.spice-carousel-clone)', $ul)
			, dotsClass = '';

		if( !options.dot ) {
			dotsClass = ' spice-none';
		};

		$('.spice-carousel-dots', $selector).remove();

		let dotTemp = [];
		for(let i = 0; i < $li.length; i++){
			if( i == 0 ){
				dotTemp.push('<a class="spice-active"></a>');
			}else{
				dotTemp.push('<a></a>');
			}
		}
		$selector.append(`<div class="spice-carousel-dots${dotsClass}">${dotTemp.join('')}</div>`);

		$('.spice-carousel-dots a', $selector)
			.off('tap.spice.carousel')
			.on('tap.spice.carousel', function(){
				let index = $(this).index();
				self.scrollTo( index );	
			});
	}

	addArrowBtn(){
		let self = this
			, $selector = self.selector
			, options = self.options;

		if( !options.arrowBtn ) return false;

		$('.spice-carousel-btn', $selector).remove();
		$selector.append(`<a class="spice-carousel-btn spice-carousel-btn-prev">
								<i class="spice-fa spice-fa-angle-left"></i>
							</a>
							<a class="spice-carousel-btn spice-carousel-btn-next">
								<i class="spice-fa spice-fa-angle-right"></i>
							</a>`);

		$('.spice-carousel-btn-prev', $selector)
			.off('tap.spice.carousel')
			.on('tap.spice.carousel', function(){
				self.prev();
			});

		$('.spice-carousel-btn-next', $selector)
			.off('tap.spice.carousel')
			.on('tap.spice.carousel', function(){
				self.next();
			});

	}

	prev(){
		let self = this
			, $selector = self.selector
			, options = self.options
			, $dot = $('.spice-carousel-dots', $selector)
			, $dotA = $('a.spice-active', $dot)
			, dotAIndex = $dotA.index()
			, $prevA = $dotA.prev('a')
			, $ul = $('.spice-carousel-content > ul', $selector)
			, $li = $('> li', $ul);

		if( $prevA.length > 0 ){
			$prevA.trigger('tap.spice.carousel');
		}else{
			if( options.loop ){
				$ul.css({
					transitionDuration: '0s'
					, transform: 'translate3d(-' + (100/$li.length*($li.length-1)) + '%, 0, 0)'
				});
			}
			setTimeout(function(){
				$('a:last', $dot).trigger('tap.spice.carousel');	
			}, 15);
		}
	}

	next(){
		let self = this
			, $selector = self.selector
			, options = self.options
			, $dot = $('.spice-carousel-dots', $selector)
			, $dotA = $('a.spice-active', $dot)
			, dotAIndex = $dotA.index()
			, $nextA = $dotA.next('a')
			, $ul = $('.spice-carousel-content > ul', $selector)
			, $li = $('> li', $ul);

		if( $nextA.length > 0 ){
			$nextA.trigger('tap.spice.carousel');
		}else{
			if( options.loop ){
				$ul.css({
					transitionDuration: '0s'
					, transform: 'translate3d(0, 0, 0)'
				});
			}
			setTimeout(function(){
				$('a:first', $dot).trigger('tap.spice.carousel');
			}, 15);
		}
	}

	scrollTo( index ){
		let self = this
			, $selector = self.selector
			, options = self.options
			, $ul = $('.spice-carousel-content > ul', $selector)
			, $li = $('> li', $ul);

		$ul.css({
			transitionDuration: options.speed
			, transform: 'translate3d(-' + (100/$li.length*(options.loop ? index + 1 : index)) + '%, 0, 0)'
		});

		$('.spice-carousel-dots a:eq(' + index + ')', $selector)
			.addClass('spice-active')
			.siblings('a').removeClass('spice-active');
	}

	addInterval(){
		let self = this
			, $selector = self.selector
			, options = self.options;

		if( options.auto ){
			self.removeInterval();
			let interval = setInterval(function(){
				self.next();
			}, options.time);
			$selector.data('spice.carousel.interval', interval);
		}
		
	}

	removeInterval(){
		let self = this
			, $selector = self.selector
			, interval = $selector.data('spice.carousel.interval');

    	interval && clearInterval(interval);
	}

	addTouch(){
		let self = this
			, $selector = self.selector
			, options = self.options
			, loop = options.loop
			, $ul = $('.spice-carousel-content > ul', $selector)
			, $li = $('> li:not(.spice-carousel-clone)', $ul)
			, $dot = $('.spice-carousel-dots', $selector)
			, DIRECTION = ''
			, START_X = 0
			, MOVE_X = 0
			, MOVE_CURRENT_X = 0;

		self.removeTouch();

		$selector
			.on('panstart.spice.carousel', (e)=>{
				if( e.originalEvent.pointerType == 'mouse' ) return false;
				self.removeInterval();
				START_X = +$ul.css('transform').substring().replace(/\s/g, '').split(',')[4];
				DIRECTION = '';
			})
			.on('panleft.spice.carousel panright.spice.carousel', (e)=>{
				if( e.originalEvent.pointerType == 'mouse' ) return false;
				DIRECTION = e.type;
				MOVE_X = e.originalEvent.deltaX;

				if( !loop ){
					if( DIRECTION == 'panright' ){
						if( MOVE_X > 0 ){
							MOVE_X /= 3;
						}
					}else if( DIRECTION == 'panleft' ){
						if( Math.abs(MOVE_X + START_X) - $selector.width()*($li.length-1) > 0 ){
							MOVE_X /= 3;
						}
					}
				}

				MOVE_CURRENT_X = MOVE_X + START_X;

				$ul.css({
					transitionDuration: '0s'
					, transform: 'translate3d(' + MOVE_CURRENT_X + 'px, 0, 0)'
				});
			})
			.on('panend.spice.carousel', (e)=>{
				if( e.originalEvent.pointerType == 'mouse' ) return false;
				let curPage = Math.ceil(Math.abs(MOVE_CURRENT_X/$selector.width())) + ( loop ? 0 : 1 );
				if( DIRECTION == 'panleft' ){
					let $curA = $('a:eq(' + (curPage-1) + ')', $dot);
					if( $curA.length > 0 ){
						$curA.trigger('tap.spice.carousel');
					}else{
						if( loop ){
							$ul.css({
								transitionDuration: '0s'
								, transform: 'translate3d(' + (MOVE_CURRENT_X + $selector.width()*$li.length) + 'px, 0, 0)'
							});
							setTimeout(function(){
								$('a:first', $dot).trigger('tap.spice.carousel');
							}, 15);
						}else{
							$('a:last', $dot).trigger('tap.spice.carousel');
						}
					}
				}else if( DIRECTION == 'panright' ){
					if( curPage-2 == -1 ){
						$ul.css({
							transitionDuration: '0s'
							, transform: 'translate3d(' + (MOVE_CURRENT_X - $selector.width()*$li.length) + 'px, 0, 0)'
						});
						setTimeout(function(){
							$('a:last', $dot).trigger('tap.spice.carousel');
						}, 15);
					}else{
						$('a:eq(' + (curPage-2) + ')', $dot).trigger('tap.spice.carousel');	
					}
				}
				
				self.addInterval();
			});
	}

	removeTouch(){
		let self = this
			, $selector = self.selector;

		$selector.off('panstart.spice.carousel panleft.spice.carousel panright.spice.carousel panend.spice.carousel');
	}

}

module.exports = (selector, options) => {
	if( !(selector && !$.isPlainObject(selector)) ) return false;

	let rtn = {}
	$(selector).each((index, self)=>{
		let $self = $(self)
			, data = $self.data('spice.carousel');
		if (!data) $self.data('spice.carousel', (data = new Carousel($self, options).init()));
		rtn[index] = data;
	})

	if( $(selector).length == 1 ){
        rtn = rtn[0];
    }
    return rtn;
}