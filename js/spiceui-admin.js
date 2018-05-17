// --
import spiceuiAdmin from '../scss/spiceui-admin.scss'

// 
$('.e-spice-branch-left').on('tap', function(){
	let $self = $(this)
		, $fa = $('.spice-fa', $self)
		, $wrapper = $('#spice-wrapper');
	if($wrapper.hasClass('spice-admin-shrink-left')){
		$wrapper.removeClass('spice-admin-shrink-left');
		$fa.removeClass('spice-fa-indent');
	}else{
		$wrapper.addClass('spice-admin-shrink-left');
		$fa.addClass('spice-fa-indent');
	}
});
$('.e-spice-branch-right').on('tap', function(){
	let $self = $(this)
		, $fa = $('.spice-fa', $self)
		, $wrapper = $('#spice-wrapper');
	if($wrapper.hasClass('spice-admin-shrink-right')){
		$wrapper.removeClass('spice-admin-shrink-right');
		$fa.removeClass('spice-fa-close').addClass('spice-fa-bars');
	}else{
		$wrapper.addClass('spice-admin-shrink-right');
		$fa.removeClass('spice-fa-bars').addClass('spice-fa-close');
	}
});

// 
$.spice.Dropdown( '.e-spice-dropdown' );

//
let tab = $.spice.Tab('.e-spice-tab');
tab.selector.on('spice.tab.titleTap', function(e, o){
    let curMenu = o.curMenu
        , self = o.self
        , index = curMenu.index()
        , $parent = curMenu.parent();
    
    if( index == 0 ){
    	curMenu.trigger('tap');
    }else{
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
$('.e-spice-collapse').on('spice.collapse.tap', function(e){
	if( $.spice.getWindowWidth() >= 1023 ){
		$('#spice-wrapper').removeClass('spice-admin-shrink-left');	
	}
});
$.spice.Collapse('.e-spice-collapse');

// 
let $tab = $('.e-spice-tab')
	, $tabTitle = $('.spice-tab-title', $tab)
	, $tabContent = $('.spice-tab-content', $tab);
$('a[spice-href]', '.e-spice-collapse').on('tap', function(){
	let $self = $(this)
		, href = $self.attr('spice-href')
		, text = $.trim( $self.text() );

	if(!href) return false;

	let $curTabTitle = $(`[spice-data-href="${href}"]`, $tabTitle);
	if( $curTabTitle.length <= 0 ){
		$tabTitle.append(`<li spice-data-href="${href}">${text}<i>&times;</i></li>`);
		$tabContent.append(`<div class="spice-tab-item">
	                            <iframe src="${href}" frameborder="0"></iframe>
	                        </div>`);
		$curTabTitle = $(`[spice-data-href="${href}"]`, $tabTitle);
	}

	tab.init({
		initIndex: $curTabTitle.index()
	});

});

//
$('.e-spice-refresh')
	.on('mouseenter', function(){
		$('.spice-fa', this).addClass('spice-fa-spin');
	})
	.on('mouseleave', function(){
		$('.spice-fa', this).removeClass('spice-fa-spin');
	})
	.on('tap', function(){
		let $iframe = $('.spice-tab-item:visible iframe', $tabContent)
			, src = $iframe.attr('src');
		$iframe.attr('src', src);
	});