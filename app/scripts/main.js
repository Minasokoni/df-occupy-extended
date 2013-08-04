var Grid = Grid || ( function() {

	var blockWidth = 150,
	blockHeight    = 150,
	win            = $(window),
	winh,
	winw,
	rows,
	blocksPerRow;

	function build(){
		var container = $('#container'),
		grid          = container.find('ul'),
		rows          = Math.ceil(winh / blockHeight),
		i             = 0,
		blocks        = '';

		grid.html('');
		grid.css('width', blocksPerRow * blockWidth);


		while (i < rows * blocksPerRow) {
			blocks += '<li class=\"block-'+parseInt(Math.random() * 3)+'\"></li>';
			i++;
		};

		grid.html(blocks);

	}


	function init(){
		win.resize(function(){
			winw = win.width();
			winh = win.height();
			blocksPerRow = Math.ceil(winw / blockWidth);
			build();
		});

		winw = win.width();
		winh = win.height();
		blocksPerRow = Math.ceil(winw / blockWidth);
		build();

	}


	function show(callback){
		var container = $('#container'),
		grid          = container.find('ul'),
		blocks        = grid.find('li'),
		numofblocks   = blocks.length,
		count         = 0;

		blocks.each(function(i, block){
			setTimeout(function(){
				$(block).addClass('animate');
				$(block).animate({'opacity':1.0}, 250, function(){
					count++;
					//counter in here
					if(numofblocks == count){
						if(callback){
							callback();
						}
					}
				});

			}, (Math.random() * 20) * (10+(i * 1)));
		});
	}

	function hide(){
		var container = $('#container'),
		grid          = container.find('ul'),
		blocks        = grid.find('li');

		blocks.each(function(i, block){
			setTimeout(function(){
				$(block).removeClass('animate');
				$(block).animate({'opacity':0}, 250, function(){
					// counter in here
				});

			}, (Math.random() * 20) * (10+(i * 1)));
		});
	}

	return {
		init: init,
		show: show,
		hide: hide
	}


} )();


var Sound = Sound || ( function () {

	var audio = $('<audio>', { autoplay : 'autoplay'});

	function fart(){
		addSource(audio, 'sound/fart.mp3', 'audio/mpeg; codecs=\"mp3\"');
		addSource(audio, 'sound/fart.ogg', 'audio/ogg; codecs=\"vorbis\"');
		audio.appendTo('body');
	}

	function boarding(){
		addSource(audio, 'sound/boarding.mp3', 'audio/mpeg; codecs=\"mp3\"');
		addSource(audio, 'sound/boarding.ogg', 'audio/ogg; codecs=\"vorbis\"');
		audio.appendTo('body');
	}

	function addSource(element, path, type){
		$('<source>').attr('src', path).appendTo(element);
		$('<source>', {'src' : path, 'type': type})
	}

	return {
		fart: fart,
		run: boarding
	}

})();


$(function(){
	Grid.init();

	// var refresh = setInterval(function(){
	// 	$.get('http://dfoccupied.appspot.com/latest.json', function(data){
	// 		var occupied = (data.occupied == true ? '#E81C30' : '#16C430');
	// 		$('#container ul li').css({'background-color' : occupied});
	// 		Grid.show(function(){
	// 			Grid.hide();
	// 		});
	// 	});
	// },(60000 * 2));

	$.get('http://dfoccupied.appspot.com/latest.json', function(data){
		var occupied = (data.occupied == true ? '#E81C30' : '#16C430');
		var status = (data.occupied == true ? 'occupied' : 'vacant');
		$('#container ul li').css({'background-color' : occupied});
		document.title = 'The Bathrooms are '+status;
		Grid.show(function(){
			$('#container div.text').text(status).addClass(status).fadeIn(400);
			if(status == 'occupied'){
				Sound.fart();
			}else{
				Sound.run();
			}
		});
	});

});