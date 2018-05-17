class Pagination{

	constructor(selector, options){
		this.selector = selector;
		this.options = $.extend(true, {}, {
							total: 0
							, pageSize: 10
							, pageLimits: false
							, pageLimitsList: [10, 20, 50, 100, 200]
							, pageSkip: false
					}, options);
	}

	init(){
		let self = this
			, $selector = self.selector
			, options = self.options
			, total = options.total
			, pageSize = options.pageSize;

		if( total > 0 ){
			self._pageSize = pageSize;
			self.pageNumber = Math.ceil(total/pageSize);
            self.initButton();
            self.addEvents();
		}

		return self;
	}

	initButton(){
		let self = this
			, $selector = self.selector
			, options = self.options
			, pageNumber = self.pageNumber
			, pagination = [];

		for(let i = 0; i < pageNumber; i++){
			let num = i + 1;
			if(num == 1){
				pagination.push('<a class="spice-page-numbers spice-page-prev">上一页</a>');
			}
			// 多于6页中间省略
			if(pageNumber > 6){
				if(num > pageNumber - 3){
					pagination.push(`<a class="spice-page-numbers" data-spice-page-value="${num}">${num}</a>`);
				}
				if(num < 4){
					pagination.push(`<a class="spice-page-numbers" data-spice-page-value="${num}">${num}</a>`);

					if( num == 3 ){
						pagination.push(`<span class="spice-page-numbers spice-page-dots">…</span>`);
					}
				}
			}else{
				pagination.push(`<a class="spice-page-numbers" data-spice-page-value="${num}">${num}</a>`);
			}

			if( i == pageNumber - 1 ){
				pagination.push(`<a class="spice-page-numbers spice-page-next">下一页</a>`);
				if(options.pageLimits){
					pagination.push( self.getPageLimitsTemp() );
				}
				if(options.pageSkip){
					pagination.push( self.getPageSkip() );
				}
				pagination.push(`<span class="spice-page-numbers spice-page-all-numbers">共${pageNumber}页</span>`);
			}
		}
		$selector.html( pagination.join('') );
		$('[data-spice-page-value="1"]', $selector).addClass('spice-page-current');
		$selector.trigger('spice.pagination.tap', 1);
	}

	addEvents(){
		let self = this
			, $selector = self.selector
			, options = self.options
			, total = options.total
			, pageSize = options.pageSize
			, pageNumber = self.pageNumber;

		$selector
			.on('tap.spice.pagination', 'a.spice-page-numbers', function(){
				let $self = $(this)
					, selfPage = +$self.attr('data-spice-page-value')
					, currentPage = +$('.spice-page-current', $selector).attr('data-spice-page-value');
				if($self.hasClass('spice-page-prev')){
					if(currentPage > 1){
						self.refreshButton( currentPage - 1 );
					}
				}else if($self.hasClass('spice-page-next')){
					if( currentPage < pageNumber ){
						self.refreshButton( currentPage + 1 );
					}
				}else{
					self.refreshButton( selfPage );
				}
			})
			.on('mouseenter.spice.pagination', function(){
				$('body').addClass('spice-no-select');
			})
			.on('mouseleave.spice.pagination', function(){
				$('body').removeClass('spice-no-select');
			});

		// 
		$selector
			.on('change.spice.pagination', 'select.spice-form-control', function(){
				let $self = $(this)
					, value = +$self.val();
				self.setPageSize(value);
			});

		// 
		$selector
			.on('keyup.spice.pagination', '.spice-page-skip input', function(){
				let $self = $(this)
					, value = $self.val();
				$self.val( value.replace(/[^0-9]/g, '') || '' );
			});

		$selector
			.on('tap.spice.pagination', '.spice-btn', function(){
				let $self = $(this)
					, value = $.trim($('input', $self.closest('.spice-page-skip')).val());
				if( value ){
					self.refreshButton( value );
				}
			});

	}

	setPageSize(val){
		let self = this
			, $selector = self.selector
			, options = self.options
			, total = options.total
			, pageSize = options.pageSize
			, pageNumber = self.pageNumber;

		if( total > 0 ){
			options.pageSize = val || pageSize;
			self._pageSize = options.pageSize;
			self.pageNumber = Math.ceil(total/options.pageSize);
            self.initButton();
		}
	}

	refreshButton(page){
		let self = this
			, $selector = self.selector
			, options = self.options
			, pageNumber = self.pageNumber
			, pagination = [];

		page = +page;

		if( page >= pageNumber ) page = pageNumber;

		if( page <= 1 ) page = 1;

		self.currentPage = page;

		// 点击中间的
		if(page > 2 && page < pageNumber-1 && pageNumber > 6){
			pagination.push('<a class="spice-page-numbers spice-page-prev">上一页</a>');
			if( page > 3 ){
				pagination.push(`<a class="spice-page-numbers" data-spice-page-value="1">1</a>`);
			}
			if( page > 4 ){
				pagination.push(`<span class="spice-page-numbers spice-page-dots">…</span>`);
			}
			pagination.push(`<a class="spice-page-numbers" data-spice-page-value="${page-2}">${page-2}</a>`);
			pagination.push(`<a class="spice-page-numbers" data-spice-page-value="${page-1}">${page-1}</a>`);
			pagination.push(`<a class="spice-page-numbers" data-spice-page-value="${page}">${page}</a>`);
			pagination.push(`<a class="spice-page-numbers" data-spice-page-value="${page+1}">${page+1}</a>`);
			pagination.push(`<a class="spice-page-numbers" data-spice-page-value="${page+2}">${page+2}</a>`);
			if(page < pageNumber-3){
				pagination.push(`<span class="spice-page-numbers spice-page-dots">…</span>`);
			}
			if(page < pageNumber-2){
				pagination.push(`<a class="spice-page-numbers" data-spice-page-value="${pageNumber}">${pageNumber}</a>`);
			}
			pagination.push(`<a class="spice-page-numbers spice-page-next">下一页</a>`);
			if(options.pageLimits){
				pagination.push( self.getPageLimitsTemp() );
			}
			if(options.pageSkip){
				pagination.push( self.getPageSkip() );
			}
			pagination.push(`<span class="spice-page-numbers spice-page-all-numbers">共${pageNumber}页</span>`);
		}

		if( (page <= 2 && pageNumber > 6) || (page >= pageNumber-1 && pageNumber > 6) ){
			pagination.push('<a class="spice-page-numbers spice-page-prev">上一页</a>');
			pagination.push(`<a class="spice-page-numbers" data-spice-page-value="1">1</a>`);
			pagination.push(`<a class="spice-page-numbers" data-spice-page-value="2">2</a>`);
			pagination.push(`<a class="spice-page-numbers" data-spice-page-value="3">3</a>`);
			pagination.push(`<span class="spice-page-numbers spice-page-dots">…</span>`);
			pagination.push(`<a class="spice-page-numbers" data-spice-page-value="${pageNumber-2}">${pageNumber-2}</a>`);
			pagination.push(`<a class="spice-page-numbers" data-spice-page-value="${pageNumber-1}">${pageNumber-1}</a>`);
			pagination.push(`<a class="spice-page-numbers" data-spice-page-value="${pageNumber}">${pageNumber}</a>`);
			pagination.push(`<a class="spice-page-numbers spice-page-next">下一页</a>`);
			if(options.pageLimits){
				pagination.push( self.getPageLimitsTemp() );
			}
			if(options.pageSkip){
				pagination.push( self.getPageSkip() );
			}
			pagination.push(`<span class="spice-page-numbers spice-page-all-numbers">共${pageNumber}页</span>`);
		}

		if(pagination.length > 0){
			$selector.html( pagination.join('') );
		}
		$('.spice-page-current', $selector).removeClass('spice-page-current');
		$(`[data-spice-page-value="${page}"]`, $selector).addClass('spice-page-current');
		$selector.trigger('spice.pagination.tap', page);
	}

	getPageLimitsTemp(){
		let self = this
			, $selector = self.selector
			, _pageSize = self._pageSize
			, options = self.options			
			, pageSize = options.pageSize
			, pageLimitsList = $.isArray(options.pageLimitsList) ? options.pageLimitsList : [10, 20, 50, 100, 200];

		if( $.inArray(_pageSize, pageLimitsList) == -1 ){
			pageLimitsList.push( _pageSize );
		}

		pageLimitsList = $.spice.unique(pageLimitsList.sort(function(a, b){
							return a - b;
						}));

		let optionTemp = [];
		for(let i = 0; i < pageLimitsList.length; i++){
			let curLimit = pageLimitsList[i];
			optionTemp.push( `<option value="${curLimit}"` + ( pageSize == curLimit ? ' selected="selected"' : "" ) + `>${curLimit} 条/页</option>` );
		}

		if( optionTemp.length > 0 ){
			return `<span class="spice-page-numbers spice-page-limits">
			        <select class="spice-form-control">${optionTemp.join('')}</select>
			    </span>`;
		}else{
			return '';
		}
		
	}

	getPageSkip(){
		let self = this
			, currentPage = self.currentPage || 1;
		return `<span class="spice-page-numbers spice-page-skip">
			        到第<input type="text" value="${currentPage}" />页
			        <a class="spice-btn spice-btn-default">确定</a>
			    </span>`;
	}

}

module.exports = (selector, options) => {
	if( !(selector && !$.isPlainObject(selector)) ) return false;

	let rtn = {}
	$(selector).each((index, self)=>{
		let $self = $(self)
			, data = $self.data('spice.pagination');
		if (!data) $self.data('spice.pagination', (data = new Pagination($self, options).init()));
		rtn[index] = data;
	})

	if( $(selector).length == 1 ){
        rtn = rtn[0];
    }
    return rtn;
}