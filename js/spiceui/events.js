// 常用事件封装
// hammer.js事件 集成到 jquery 事件中
import Hammer from 'hammerjs'

delete Hammer.defaults.cssProps.userSelect;

// hammer 事件列表
const eventList = [
					'tap', 'doubletap'
					, 'pan', 'panstart', 'panmove', 'panend', 'pancancel', 'panleft', 'panright', 'panup', 'pandown'
					, 'swipe', 'swipeleft', 'swiperight', 'swipeup', 'swipedown'
					, 'press', 'pressup'
					, 'pinch', 'pinchstart', 'pinchmove', 'pinchend', 'pinchcancel', 'pinchin', 'pinchout'
					, 'rotate', 'rotatestart', 'rotatemove', 'rotateend', 'rotatecancel'
				]

for( let value of eventList){
	$.event.special[value] = {
		setup( data, namespaces, eventHandle ){
			let $self = $(this)
				, hammertime = new Hammer($self[0], {
					// cssProps: {
					// 	userSelect: 'inherit'
					// }
				})
			$self.data('hammerjs', hammertime)
			hammertime.on(value, (e)=>{
				eventHandle(e)
			})
		}
		, teardown( namespaces ){
			$( this ).off( value )
		}
	}
}