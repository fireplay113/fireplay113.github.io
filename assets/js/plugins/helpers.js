/**
 * Advanced jQuery Plugin Boilerplate
 * @author: Cedric Ruiz
 * https://github.com/elclanrs/advanced-jquery-boilerplate
 */

( function( $ ) {

	var AP = Array.prototype;

	$.newPlugin = function( pluginName, defaults, methods, global ) {

		function Plugin( element, options ) {
			this.options = $.extend( {}, defaults, options );
			this.el = element;
			this._name = pluginName;
			this._init( );
		}

		Plugin.prototype._init = $.noop;
		Plugin.prototype[ pluginName ] = function( method ) {
			if ( !method ) return this;
			try {
				return this[ method ].apply( this, AP.slice.call( arguments, 1 ) );
			} catch ( e ) {}
		};

		$.extend( Plugin.prototype, methods );
		if ( global ) $[ pluginName ] = global;

		$.fn[ pluginName ] = function( ) {

			var args = AP.slice.call( arguments ),
				method = typeof args[ 0 ] == 'string' && args[ 0 ].split( ':' ),
				opts = typeof args[ 0 ] == 'object' && args[ 0 ],
				params = args.slice( 1 ),
				isGet = method[ 0 ] == 'get',
				ret;

			this.each( function( ) {

				var instance = $.data( this, pluginName );

				// Method
				if ( instance ) {
					ret = instance[ pluginName ].apply( instance, [ method[ +isGet ] ].concat( params ) );
				}

				// Init
				return $.data( this, pluginName, new Plugin( this, opts ) );
			} );

			return isGet ? ret : this;
		};
	};

}( jQuery ) );

/**
 * Object.create support test, and fallback for browsers without it
 */
if ( typeof Object.create !== 'function' ) {
	Object.create = function( o ) {
		var F;
		F = function( ) {};
		F.prototype = o;
		return new F( );
	};
}
$.plugin = function( name, object ) {
	$.fn[ name ] = function( options ) {
		return this.each( function( ) {
			if ( !$.data( this, name ) ) {
				return $.data( this, name, Object.create( object ).init( options, this ) );
			}
		} );
	};
};

/**
 * helper object
 */

var _h = {
	/**
	 * load all images inside dom node and call function
	 * @param  {Selector} obj
	 * @param  {Function} callback
	 * @return {[Object]} jQuery collection of images
	 */
	loadImgs: function( obj, callback ) {
		var imgsLength, loadCounter;
		this.imgs = $( obj ).find( "img" );
		imgsLength = this.imgs.length;
		loadCounter = 0;
		this.imgs.one( "load", function( ) {
			loadCounter++;
			if ( loadCounter === imgsLength ) {
				return callback( );
			}
		} ).each( function( ) {
			if ( this.complete ) {
				$( this ).trigger( "load" );
			}
		} );
		return this.imgs;
	},
	/**
	 * Scrollbar With
	 * @return {Px} With in pixels
	 */
	getScrollbarWidth: function( ) {
		var inner, outer, widthNoScroll, widthWithScroll;
		outer = document.createElement( "div" );
		outer.style.visibility = "hidden";
		outer.style.width = "100px";
		document.body.appendChild( outer );
		widthNoScroll = outer.offsetWidth;
		outer.style.overflow = "scroll";
		inner = document.createElement( "div" );
		inner.style.width = "100%";
		outer.appendChild( inner );
		widthWithScroll = inner.offsetWidth;
		outer.parentNode.removeChild( outer );
		return widthNoScroll - widthWithScroll;
	},
	/**
	 * Splits array in arrays by n elemtns
	 * @param  {Array} arr
	 * @param  {Number} n
	 * @return {Array}
	 */
	arrSplit: function( arr, n ) {
		var i, idx, res;
		idx = -1;
		res = [ ];
		i = 0;
		while ( i < arr.length ) {
			if ( i % n === 0 ) {
				idx++;
				res[ idx ] = [ ];
			}
			res[ idx ][ i % n ] = arr[ i ];
			i++;
		}
		return res;
	},
	/**
	 * Check if obj is an Array
	 * @param  {Array} arr
	 * @return {Boolean}
	 */
	isArray: function( arr ) {
		return Object.prototype.toString.call( arr ) === '[object Array]';
	},
	/**
	 * function wich throttles calls so if it is 
	 * called more than once in a short period of time, only one instance will be called
	 * @param  {function} func    
	 * @param  {ms} threshold 
	 * @param  {flag} execAsap  set it true if you need emmidiate envoke
	 * @return {[type]}           [description]
	 */
	debounce: function( func, threshold, execAsap ) {
		var timeout;
		return function debounced( ) {
			var obj = this,
				args = arguments;
			function delayed( ) {
				if ( !execAsap )
					func.apply( obj, args );
				timeout = null;
			}
			if ( timeout )
				clearTimeout( timeout );
			else if ( execAsap )
				func.apply( obj, args );
			timeout = setTimeout( delayed, threshold || 100 );
		};
	},
	props: {
		animationend: "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd"
	}
};

var s = {
	width: 90,
	height: 90,
	stepsPerFrame: 1,
	trailLength: 1,
	pointDistance: 0,
	strokeColor: '#FFFFFF',
	fps: 20,
	setup: function( ) {
		this._.lineWidth = 4;
	},
	step: function( point, index ) {
		var angle, cx, cy, innerRadius, _;
		cx = this.padding + 50;
		cy = this.padding + 50;
		_ = this._;
		angle = ( Math.PI / 180 ) * ( point.progress * 360 );
		innerRadius = ( index === 1 ? 10 : 20 );
		_.beginPath( );
		_.moveTo( point.x, point.y );
		_.lineTo( ( Math.cos( angle ) * innerRadius ) + cx, ( Math.sin( angle ) * innerRadius ) + cy );
		_.closePath( );
		_.stroke( );
	},
	path: [
		[ 'arc', 50, 50, 35, 0, 360 ]
	]
};
