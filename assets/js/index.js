var resources = [
	"//fonts.googleapis.com/css?family=Noto+Sans&subset=latin,cyrillic",
	"//fonts.googleapis.com/earlyaccess/notosansarmenian.css",
	"/assets/css/toastr.css",
	"/assets/js/vendor/jquery.js",
	"/assets/js/vendor/lodash.js",
	"/assets/js/vendor/jquery.velocity.js",
	"/assets/js/vendor/velocity.ui.js",
	"/assets/js/vendor/shake.js",
	"/assets/js/res/strings."+gLang+".js?v="+gVersion,
	"/assets/js/social-share.js",
	"/assets/js/helpers.js",
	"/assets/js/plugins/toastr.js",
	"/assets/js/plugins/shapetext.js"
];



head.load('//www.google-analytics.com/analytics.js', function() {
	ga('create', 'UA-62568351-1', 'auto');
	ga('send', 'pageview');
});

head.load(resources, function() {

	$.runFromInput = false;

	toastr.options.timeOut = 7500;

	var setAnswer = function() {
		hashes = Object.keys(answers);
		hash = hashes[Math.floor(Math.random() * hashes.length)];
		answer = answers[hash];
		shapeText(answer, ".ball-text", ".ball-textbox");
	};

	gaTrackEvent = function(type) {
		if (typeof ga != 'undefined')
		{
			ga('send', 'event', 'answer', type);
		}

	}

	$(".js-balltext").click(function () {

		if (!$.runFromInput)
		{
			gaTrackEvent('mouse');
			$(".question").velocity("transition.bounceUpOut", {duration: 700});
		}

		var ball = $(".ball"),
			text = $(".ball-textbox"),
			share = $(".share"),
			shareNets = $(".share-nets");

		// анимация тряски
		ball.velocity("callout.shake", {
				duration: 700,
				// выполняется перед началом тряски
				begin: function() {
					// убирается текст
					text.velocity({opacity: 0, scale: 1.5}, {duration: 100});
					//убирается синий фон
					ball.addClass('ball--transition');
						}};
			      )
				},
				// после завершения тряски
				complete: function() {
					// возвращается текст
					text.velocity({opacity: 1, scale: 1}, {duration: 100});
					// выводится текст
					setAnswer();
					// добавляется синий фон
					ball.removeClass("ball--transition");
					$.runFromInput = false;
					$('#yourq').focus();
				}
			});
	});

	setTimeout(function() {
		$(".question")
			.velocity("transition.bounceDownIn", {
				duration: 700,
				complete: function() {
					$(".question").removeClass("is-invisible");
					$('#yourq').focus();
				}
			});
	}, 2000);

	$(".question-close").on("click", function(e) {
		e.stopPropagation();
		$(".question")
			.velocity("transition.bounceUpOut", {
				duration: 700
			});
	});

	var shareNets = $(".share-nets");

	$(".share-icon").on("click", function() {
		if(shareNets.data("opened")) {
			shareNets
				.velocity("transition.whirlOut", {
					duration: 200,
					complete: function() {
						$(".share-nets").data("opened", false);
					}
				});
		} else {
			shareNets
				.velocity("transition.whirlIn", {
					duration: 200,
					complete: function() {
						$(".share-nets").data("opened", true);
					}
				});
		}
	});

	Object.keys = Object.keys || function(o)
	{
		var result = [];
		for(var name in o)
		{
			if (o.hasOwnProperty(name))
			result.push(name);
		}
		return result;
	};

	$.testShakeEvent = new Shake({
		threshold: 0.3,
		timeDifference: 300
	});
	$.testShakeEvent.start();

	window.addEventListener('shake', function () {

		window.removeEventListener('shake', arguments.callee, false);
		$.testShakeEvent.stop();
		$.testShakeEvent = undefined;

		setTimeout(function() {
			$(".ball-textbox").velocity({opacity: 0, scale: 1.5}, {duration: 100});
			$(".ball").addClass('ball--transition');
			setTimeout(function() {
				shapeText(shakeMsg, ".ball-text", ".ball-textbox");
				$(".ball-textbox").velocity({opacity: 1, scale: 1}, {duration: 100});
				$(".ball").removeClass("ball--transition");
			}, 400);
		}, 400);

		$.shakeTimeDifference = 800;
		$.shakeTimeout = $.shakeTimeDifference + 50;

		$.ballShakeEvent = new Shake({
			threshold: 8,
			timeDifference: $.shakeTimeDifference
		});

		// start listening to device motion
		$.ballShakeEvent.start();

		window.addEventListener('shake', function () {

			if (typeof lastShakeTime == 'undefined')
			{
				//start shake
				// убирается текст
				$(".ball-textbox").velocity({opacity: 0, scale: 1.5}, {duration: 100});
				// убирается синий фон
				$(".ball").addClass('ball--transition');
				// убираются социалки
				$(".share").velocity("transition.whirlOut", {duration: 400});
				if($(".share-nets").data("opened"))
				{
					$(".share-nets").velocity("transition.whirlOut", {duration: 200, complete: function() {
						$(".share-nets").data("opened", false);
					}});
				}
				gaTrackEvent('shake');
			}

			lastShakeTime = new Date();

			setTimeout(function() {
				currentTime = new Date();
				timeDifference = currentTime.getTime()-lastShakeTime.getTime();
				if (timeDifference>$.shakeTimeout)
				{
					//stop shake
					lastShakeTime = undefined;

					// возвращается текст
					$(".ball-textbox").velocity({opacity: 1, scale: 1}, {duration: 100});
					// выводится текст
					setAnswer();
					// добавляется синий фон
					$(".ball").removeClass("ball--transition");
				}
				else
				{
					// shake in progress -- do nothing
				}
			}, $.shakeTimeout);
		}, false);

	}, false);

	if( $( window ).width() > 810)
	{
		head.load('/assets/js/social.js?v='+gVersion);
	}

	$('#yourq').on('keypress', function(e){
		if( $('#yourq').val()!='' )
		{
			if (e.type === 'keypress')
			{
				var keycode = (e.keyCode ? e.keyCode : e.which);
				if(keycode == '13')
				{
					e.stopPropagation();
					$.runFromInput = true;
					$(".js-balltext").triggerHandler('click');
					gaTrackEvent('keyboard');
				}
			}
		}
	});

});
