// $Id: social-share.js 264 2019-03-19 17:58:10Z hayk $
// µ Հ

$(function() {

	var snets =
	{
		'fb' : 'Facebook',
		'tw' : 'Twitter',
		'lj' : 'LiveJournal',
		'pi' : 'Pinterest',
		'vk' : 'VKontakte',
		'ok' : 'Odnoklassniki',
		'mm' : 'MyWorld'
	};

	$('a.share-net').click(function() {

		var snet = $(this).attr('rel');
		var link = gLink.replace('%hash%', encodeURIComponent(hash));
		var name = gTitle;
		var data = '';
		var img = gImg.replace('%hash%', encodeURIComponent(hash));
		if (snet == 'lj')
		{
			data = gHtml.replace('%link%', link);
			data = data.replace('%answer%', answer);
		}
		else
		{
			data = gText.replace('%answer%', answer);
		}

		if (typeof ga != 'undefined')
		{
			ga('send', 'social', {
				'socialNetwork': snets[snet],
				'socialAction': 'share',
				'socialTarget': link
			});
		}

		var url = '';
		var param = {};

		switch (snet)
		{
			case 'fb':
				// url = 'https://www.facebook.com/sharer/sharer.php';
				url = 'https://www.facebook.com/share.php';
				param['u'] = link;
			break;

			case 'tw':
				url = 'https://twitter.com/share';
				param['text'] = data;
				param['url'] = link;
			break;

			case 'vk':
				url = 'https://vkontakte.ru/share.php';
				param['url'] = link;
			break;

			case 'ok':
				url = 'https://www.odnoklassniki.ru/dk';
				param['st.cmd'] = 'addShare';
				param['st.s'] = '0';
				// Одноклассники очень умные и убирают слеш в конце
				// и получаем "Ошибка обработки данных ресурса."
				//link = link.substring(0, link.length-1)+'.html';
				param['st._surl'] = link+'?';
			break;

			case 'lj':
				url = 'https://www.livejournal.com/update.bml';
				param['subject'] = name;
				param['event'] = '<lj-raw>' + data + '</lj-raw>';
				param['prop_taglist'] = '8-gund.com';
			break;

			case 'mm':
				url = 'https://connect.mail.ru/share';
				param['url'] = link;
				param['description'] = data;
				param['imageurl'] = img;
			break;

			case 'pi':
				url = 'https://www.pinterest.com/pin/create/button/';
				param['url'] = link;
				param['media'] = img;
				param['description'] = data;
			break;

		}

		var query = [];
		$.each(param, function(key, val) {
			query.push(key + '=' + encodeURIComponent(val));
		});

		query = query.join('&');
		if (query.length)
		{
			url += '?' + query;
		}

		if (url)
		{
			var ww = 600, wh = 400, sw = screen.width, sh = screen.height, wl = Math.round((sw/2)-(ww/2)), wt = Math.round((sh/2)-(wh/2));
			window.open(url, '', 'left=' + wl + ',top='+ wt + ',width=' + ww + ',height=' + wh + ',personalbar=0,toolbar=0,scrollbars=1,resizable=1');
		}

	});

});
