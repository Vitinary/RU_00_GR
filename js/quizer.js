let sec_per_turn = 30;

let sec = 0;
let song_count = 0;
let poster_count = 1;
let answers;
let correct = 0;
let score = 0;
let f_packages = 1;
let m_packages = 1;
let gr_packages = 1;
let hardcore_level = 1;
let options;
let skill = '';
let rate = '';
let lang = '';
let year = '';
let genre = '';
let artist_type = '';
let audioPath = 'audio/ru/';
let imgPath = 'img/';
let finalMessage = '';
let modeToggle;
let setMedia;
let rightAnswer;
let toggleFlag = false;
let withoutAnswers = false;
let isSingle = true;
let audio;
let start_count_down = false;
let rating = [];
let songs_backup;
let overall;

function mirror(txt, speed = 20, color){
$('#mirror_txt').replaceWith( '<marquee id="mirror_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function mirror_eval(txt, speed = 20, color){
$('#eval_txt').replaceWith( '<marquee id="eval_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function choose(num){
	$('#pause').show();
	let answer = '';
	if(num){
		answer = options[num-1];
	} else {
		answer = $('#answer_input').val();
	}
	start_count_down = false;
	if(audio && audio.paused){
		audio.play();
	}
	modeToggle();
	let group = songs[song_count].group;
	let song = songs[song_count].song;
	let song_year = songs[song_count].year;
	if(!song_year) {
		song_year = '';
	} else {
		song_year = ' (' + song_year + ')';
	}
	if(answer.toUpperCase() == songs[song_count].group.toUpperCase()){
		mirror_eval(rightAnswer(song_year), 20, "green");
		$("#option_" + num).addClass("green");
		correct++;
		if (!~rate.indexOf('+ ' + group)){
			$('#rate').html(rate = '<br/>+ ' + group + rate);
		}
		$('#score').html(++score);
	} else {
		mirror_eval(rightAnswer(song_year), 20, "red");
		$("#option_" + num).addClass("red");
		$('#skill').html(skill = '<br/>- ' + group + '<br/>"' + song + '"' + song_year + skill);
	}
		toggleGameButton();
		next();
}

function rightAnswer_EN(){
	return songs[song_count].song;
}

function rightAnswer_RU(year){
	return songs[song_count].group + ' "' + songs[song_count].song + '"' + year;
}

function next(){
	if(song_count==songs.length-1){
		$('#song_count').html(song_count+1);
		$('#song').css("visibility", "hidden");
		$('#mirror').show();
		let overall = songs.length
		let percent = calculatePercent(correct,overall);
		let msg = 'Верно: ' + percent + '%('
		+ correct + '/' + overall + ').';
		let color = 'red';
		if(percent>=65){
			color = 'green';
			msg+=finalMessage; 
		} else{
			msg+=' Послушайте ещё песенок и попробуйте снова.'
		}
		mirror(msg, 20, color);
		emptyOptions();
		song_count=0;
		shuffle(songs);
	} else {
		$('#song_count').html(++song_count);
		toggleLearn();
	}
}

function calculatePercent(correct,overall){
	let num = correct/overall*100;
	return parseFloat(num).toFixed(0);
}

function toggle(){
	if($('#learn').is('[disabled]')){
		$('#learn').prop('disabled', false);
		$('.game_button').prop('disabled', true);
	} else {
		$('#learn').prop('disabled', true);
		$('.game_button').prop('disabled', false);
	}
}

function toggleLearn(){
	if($('#learn').is('[disabled]')){
		$('#learn').prop('disabled', false);
	} else {
		$('#learn').prop('disabled', true);
	}
}

function toggleGameButton(){
	if($('.game_button').is('[disabled]')){
		$('.game_button').prop('disabled', false);
	} else {
		$('.game_button').prop('disabled', true);
	}
}

let lang_letter;

function learn(){
	hide_navi_icons();
	if(withoutAnswers){
		$('.without_answers').show();
	} else {
		$('.answer').show();
	}
	$('#pause').hide();
	$('#back').hide();
	$('#package_content').hide();
	$('#answer_input').val('');
	decolorOptions();
	modeToggle();
	toggleLearn();
	toggleGameButton();
	randomAnswers();
	setMedia();
	count_down(sec_per_turn);
	$('#mirror').hide();
}

async function sec_15(){
	if(audio.paused){
		audio.play();
		count_down(15);
	} else {
		audio.currentTime += 15;
		if(time_left < 15){
			time_left = 15;
		}
	}
}

function song_pause() {
	if(audio.paused){
		audio.play();
	} else {
		audio.pause();
	}
}

let time_left = 0;
async function count_down(end){
	start_count_down = true;
	time_left = end;
	while(start_count_down && time_left-- > 0){
		await sleep(1000);
		if(isSingle){	
			$('#sec').html(new Intl.NumberFormat().format(sec+=1));
		} else if(isP1Turn) {
			$('#p1_sec').html(new Intl.NumberFormat().format(p1_sec+=1));
		} else {
			$('#p2_sec').html(new Intl.NumberFormat().format(p2_sec+=1));
		}
	}
	if(start_count_down){
		audio.pause();
	}
}

let time_min = 0;
async function count_time(){
	while(true){
		await sleep(60000);
		$('#min').html(++time_min);
	}
}

function time_toggle() {
	$('#sec_h2').toggle();
	$('#min_h2').toggle();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function decolorOptions(){
	for(let i = 1; i <= 4; i++){
		$("#option_" + i).removeClass("red");
		$("#option_" + i).removeClass("green");
	}
}

function setAudio(){
	if(audio){
		audio.pause();
	}
	if(!songs[song_count].audioPath){
		audio = new Audio(audioPath + songs[song_count].id + '.mp3');
	} else {
		audio = new Audio(songs[song_count].audioPath + '.mp3');
	}
	audio.play();
}

function randomAnswers(){
	options = [];
	let current_answers = answers;
	current_answers = removeDuplicates(current_answers);
	let correctAnswer = songs[song_count].group;
	options.push(correctAnswer);
	removeItemOnce(current_answers,correctAnswer);
	if(current_answers.length > 4){
		removeItemOnce(answers,correctAnswer);
	} else {
		current_answers = removeItemOnce(removeDuplicates(songs.map(item=>item.group)),correctAnswer);
	}
	shuffle(current_answers);
	options.push(current_answers[0]);
	options.push(current_answers[1]);
	options.push(current_answers[2]);
	shuffle(options);
	$('#option_1').html(options[0]);
	$('#option_2').html(options[1]);
	$('#option_3').html(options[2]);
	$('#option_4').html(options[3]);
}

function skipGroup(flag, group){
	group = group.replace("#", "'");
	if(!flag.checked){
		songs = jQuery.grep(songs, function(value) {
		  return value.group != group;
		});
		answers = songs.map(item=>item.group);
		$('#total').html(songs.length);
	} else {
		$('.group_item').prop('checked', true);
		songs = songs_backup;
		answers = songs.map(item=>item.group);
		$('#total').html(songs.length);
	}
}

function emptyOptions(){
	$('#option_1').html('');
	$('#option_2').html('');
	$('#option_3').html('');
	$('#option_4').html('');
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function removeDuplicates(arr) {
	var uniqueValues = [];
	$.each(arr, function(i, el){
		if($.inArray(el, uniqueValues) === -1) uniqueValues.push(el);
	});
	return uniqueValues;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function play_pause() {
   var mediaVideo = $("#song").get(0);
   if (mediaVideo.paused) {
       mediaVideo.play();
   } else {
       mediaVideo.pause();
  }
}

function toggleArtist(){
	if(toggleFlag){
		$('#artist').attr("src",  songs[song_count].imgPath + ".jpg");
		$('#artist').toggle();
	} else {
		toggleFlag = true;
	}
}

function load(){
	$('#answer_input').keypress(function (e) {
	  if (e.which == 13) {
		choose();
		return false;
	  }
	});	
	setup();
}

// RU songs

const ru_2000_gr_icon = [
	'ru_pop_m_easy',
	'ru_pop_m_medium',
	'ru_pop_f',
	'ru_pop_f_easy',
	'ru_pop_f_medium',
	'ru_rock',
	'ru_rock_2'
];

const RU_2000_GR_PACK_1 = 6;
const RU_2000_GR_PACK_5 = 1;
const RU_2000_GR_PACK_2 = 2;
const RU_2000_GR_PACK_3 = 3;
const RU_2000_GR_PACK_6 = 4;
const RU_2000_GR_PACK_4 = 5;
const RU_2000_GR_PACK_7 = 7;


let ru_2000_gr = [
	{
		pack : RU_2000_GR_PACK_5,
		group : 'Hi-Fi',
		song : "А мы любили"
	},
	{
		pack : RU_2000_GR_PACK_5,
		group : 'Hi-Fi',
		song : "Седьмой лепесток"
	},
	{
		pack : RU_2000_GR_PACK_5,
		group : 'Отпетые мошенники',
		song : "Граница (ft Леонид Агутин)"
	},
	{
		pack : RU_2000_GR_PACK_5,
		group : 'Дискотека Авария',
		song : "Малинки (ft Жанна Фриске)"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Бумбокс',
		song : "Вахтерам"
	},
	{
		pack : RU_2000_GR_PACK_5,
		group : 'Иванушки International',
		song : "Реви"
	},
	{
		pack : RU_2000_GR_PACK_5,
		group : 'Иванушки International',
		song : "Золотые облака"
	},
	{
		pack : RU_2000_GR_PACK_5,
		group : 'Иванушки International',
		song : "Тополиный пух"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Чай вдвоем',
		song : "А ты все ждешь"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Многоточие',
		song : "Щемит в душе тоска"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Quest Pistols',
		song : "Белая стрекоза любви"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Корни',
		song : "Вика"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Корни',
		song : "Ты узнаешь её"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Дыши',
		song : "Взгляни на небо"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Сценакардия',
		song : "Времена года"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Градусы',
		song : "Режиссер"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Корни',
		song : "25 этаж"
	},
	{
		pack : RU_2000_GR_PACK_5,
		group : 'Hi-Fi',
		song : "Глупые люди"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Quest Pistols',
		song : "Я устал"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Бумбокс',
		song : "Eva"
	},
	{
		pack : RU_2000_GR_PACK_5,
		group : 'Дискотека Авария',
		song : "Если хочешь остаться"
	},
	{
		pack : RU_2000_GR_PACK_5,
		group : 'Дискотека Авария',
		song : "Модный танец Арам Зам Зам"
	},
	{
		pack : RU_2000_GR_PACK_5,
		group : 'Звери',
		song : "Капканы"
	},
	{
		pack : RU_2000_GR_PACK_5,
		group : 'Отпетые мошенники',
		song : "Моя звезда (ft Сливки)"
	},
	{
		pack : RU_2000_GR_PACK_5,
		group : 'Уматурман',
		song : "Прасковья"
	},
	{
		pack : RU_2000_GR_PACK_5,
		group : 'Уматурман',
		song : "Дождь"
	},
	{
		pack : RU_2000_GR_PACK_5,
		group : 'Уматурман',
		song : "Ночной дозор"
	},
	{
		pack : RU_2000_GR_PACK_5,
		group : 'Звери',
		song : "Брюнетки и блондинки"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Чай вдвоем',
		song : "Ласковая моя"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Бутырка',
		song : "Запахло весной"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Бутырка',
		song : "Аттестат"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Игра слов',
		song : "Алина Кабаева"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'БиС',
		song : "Кораблики"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : "Пятница",
		song : "Солдат"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : "5ivesta family",
		song : "Я буду (23-45)"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : "Revoльvers",
		song : "Ты у меня одна"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : "Revoльvers",
		song : "Целуешь меня"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : "Каста",
		song : "Ревность"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : "Т9",
		song : "Ода нашей любви"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : "Бумер",
		song : "Не плачь"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : '140 ударов в минуту',
		song : 'Не сходи с ума'
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Блестящие',
		song : "А я всё летала"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Блестящие',
		song : "За четыре моря"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Фабрика',
		song : "Не виноватая я"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Serebro',
		song : "Дыши (ft Баста)"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Serebro',
		song : "Опиум"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Serebro',
		song : "Сладко"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Пропаганда',
		song : "Пять минут на любовь"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Рефлекс',
		song : "Non-stop"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Краски',
		song : "Старший брат"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Краски',
		song : "Оранжевое солнце"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Краски',
		song : "Мне мальчик твой не нужен"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Винтаж',
		song : "Роман"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Винтаж',
		song : "Плохая девочка"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Винтаж',
		song : "Ева"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Лицей',
		song : "Она не верит больше в любовь"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Лицей',
		song : "Падает дождь"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Лицей',
		song : "Планета Пять"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Фабрика',
		song : "Рыбка"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Пропаганда',
		song : "Ай-я"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Пропаганда',
		song : "Супер детка"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Фабрика',
		song : "Зажигают огоньки"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Блестящие',
		song : "Пальмы парами"
	},
	{
		pack : RU_2000_GR_PACK_6,
		group : 'Тату',
		song : "Нас не догонят"
	},
	{
		pack : RU_2000_GR_PACK_6,
		group : 'Тату',
		song : "Я сошла с ума"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Любовные Истории',
		song : "Школа"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Подиум',
		song : "Танцуй, пока молодая"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Тотал',
		song : "Бьет по глазам"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Тутси',
		song : "Самый-самый"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Город 312',
		song : "Останусь"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Город 312',
		song : "Вне зоны доступа"
	},
	{
		pack : RU_2000_GR_PACK_6,
		group : 'Тату',
		song : "All about us"
	},
	{
		pack : RU_2000_GR_PACK_6,
		group : 'Сливки',
		song : "Самая лучшая (ft Анжелика Варум)"
	},
	{
		pack : RU_2000_GR_PACK_6,
		group : 'Сливки',
		song : "Иногда"
	},
	{
		pack : RU_2000_GR_PACK_6,
		group : 'Сливки',
		song : "Летели недели"
	},
	{
		pack : RU_2000_GR_PACK_6,
		group : 'Ранетки',
		song : "Ангелы"
	},
	{
		pack : RU_2000_GR_PACK_6,
		group : 'Ранетки',
		song : "Это все о ней"
	},
	{
		pack : RU_2000_GR_PACK_6,
		group : 'Гости из будущего',
		song : "Грустные сказки"
	},
	{
		pack : RU_2000_GR_PACK_6,
		group : 'Гости из будущего',
		song : "Метко"
	},
	{
		pack : RU_2000_GR_PACK_6,
		group : 'Гости из будущего',
		song : "Почему ты"
	},
	{
		pack : RU_2000_GR_PACK_6,
		group : 'Чили',
		song : "Лето"
	},
	{
		pack : RU_2000_GR_PACK_6,
		group : 'Чили',
		song : "Сердце"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Инфинити',
		song : "Слезы вода"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "БандЭрос",
		song : "Про красивую жизнь"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "БандЭрос",
		song : "Манхэттен"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "БандЭрос",
		song : "Полосы"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "A’Studio",
		song : "S.O.S."
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "A’Studio",
		song : "Ещё люблю"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "Потап и Настя",
		song : "Непара"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "Потап и Настя",
		song : "Почему молчишь"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "Потап и Настя",
		song : "Новый год"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Би-2',
		song : "Серебро",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Неприкасаемые',
		song : "Моя бабушка курит трубку",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Ленинград',
		song : "Мне бы в небо",
		year : 2002,
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Земфира',
		song : "До свиданья",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Мумий Тролль',
		song : "Невеста",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Танцы минус',
		song : "Половинка",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Сплин',
		song : "Моё сердце",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Смысловые Галлюцинации',
		song : "Вечно молодой"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Чичерина',
		song : "Ту-лу-ла",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Кукрыниксы',
		song : "По раскрашенной душе",
		year : 2002
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Ляпис Трубецкой',
		song : "Сочи",
		year : 2001
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Пикник',
		song : "Фиолетово-чёрный",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Агата Кристи',
		song : "Секрет",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Алиса',
		song : "Веретено",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Чайф',
		song : "Время не ждёт",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Крематорий',
		song : "Катманду",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Ю-питер',
		song : "Девушка по городу",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Пилот',
		song : "Тюрьма",
		year : 2001
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Тараканы',
		song : "Я смотрю на них"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Наив',
		song : "Суперзвезда",
		year : 2000
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Кирпичи',
		song : "Данила Блюз",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Мельница',
		song : "Ночная Кобыла",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Ночные снайперы',
		song : "Катастрофически"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Сурганова и Оркестр',
		song : "Мураками"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Чичерина',
		song : "Жара",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Маша и медведи',
		song : "Земля",
		year : 2000
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Юта',
		song : "Хмель и солод"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Zdob si Zdub',
		song : "Видели ночь",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Ундервуд',
		song : "Гагарин, я вас любила"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Мультфильмы',
		song : "Яды"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : '7Б',
		song : "Молодые ветра",
		year : 2001
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Animal ДжаZ',
		song : "Три полоски",
		year : 2006
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Lumen',
		song : "Сид и Нэнси",
		year : 2002
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Мёртвые дельфины',
		song : "На моей луне"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Слот',
		song : "2 войны",
		year : 2006
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Элизиум',
		song : "Острова"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Мумий Тролль',
		song : "Такие девчонки",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Мумий Тролль',
		song : "Контрабанды",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Алиса',
		song : "Пересмотри",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Танцы минус',
		song : "Ю",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Би-2',
		song : "Варвара",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Би-2',
		song : "Моя любовь",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Сплин',
		song : "Весь этот бред",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Чайф',
		song : "Нахреноза",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Смысловые Галлюцинации',
		song : "Зачем топтать мою любовь"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Смысловые Галлюцинации',
		song : "Полюса"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Мультфильмы',
		song : "Магнитофон"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Мультфильмы',
		song : "Пистолет"
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Земфира',
		song : "Хочешь?",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Земфира',
		song : "Кто?",
		ignore : true
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Ляпис Трубецкой',
		song : "Капитал",
		year : 2007
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Монокини',
		song : "Дотянуться до солнца"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Монокини',
		song : "Сидим на облаках"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Монокини',
		song : "До встречи на звезде"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Русский размер',
		song : 'Льдами'
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Русский размер',
		song : '!Слушай'
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Непара',
		song : 'Другая причина'
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Непара',
		song : 'Плачь и смотри'
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Непара',
		song : 'Бог тебя выдумал'
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Рефлекс',
		song : "Первый раз"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Каста',
		song : "Горячее время"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Челси',
		song : "Самая любимая"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Челси',
		song : "Почему"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Токио',
		song : "Мы будем вместе всегда"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Токио',
		song : "Кто я без тебя"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Токио',
		song : "Когда ты плачешь"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Инфинити',
		song : "Где ты"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Инфинити',
		song : "Я не боюсь"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Тутси',
		song : "Чашка капучино"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Тутси',
		song : "Сама по себе"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Амега',
		song : 'Десант'
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Амега',
		song : 'Я летая пою'
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Амега',
		song : 'Убегаю'
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Lumen',
		song : 'Кофе',
		year : 2003
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Ногу свело',
		song : 'Наши юные смешные голоса',
		year : 2002
	},
	{
		pack : RU_2000_GR_PACK_5,
		group : 'Отпетые мошенники',
		song : 'Насосы'
	},
	{
		pack : RU_2000_GR_PACK_5,
		group : 'Звери',
		song : 'Дожди-пистолеты'
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Виагра',
		song : "Перемирие"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Виагра',
		song : "Биология"
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Виагра',
		song : "Стоп стоп стоп"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Турбомода',
		song : "Школа"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'БиС',
		song : "Твой или ничей"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'БиС',
		song : "Катя, возьми телефон"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Чай вдвоем',
		song : "Желанная",
		year : 2003
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Турбомода',
		song : 'Каникулы',
		year : 2007
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Ассорти',
		song : 'Красивая любовь',
		year : 2009
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Ассорти',
		song : 'Зажги моё тело',
		year : 2009
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Турбомода',
		song : 'Хитрое солнышко',
		year : 2009
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Любовные Истории',
		song : 'Путь домой',
		year : 2003
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Рок-Острова',
		song : "Не любить невозможно",
		year : 2008
	},
	{
		pack : RU_2000_GR_PACK_3,
		group : 'Рефлекс',
		song : "Танцы",
		year : 2005
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : 'Катя Чехова',
		song : "Я — робот",
		year : 2005
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : "Триада",
		song : "Дежавю",
		year : 2005
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "A’Studio",
		song : "Бегу к тебе",
		year : 2007
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Lumen',
		song : "Гореть",
		year : 2001
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Ляпис Трубецкой',
		song : "Огоньки",
		year : 2007
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Леприконсы',
		song : "Девчонки полюбили не меня",
		year : 2007
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Леприконсы',
		song : "Пиво",
		year : 2007
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Леприконсы',
		song : "Лена",
		year : 2000
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Пилот',
		song : "Братишка",
		year : 2000
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Пилот',
		song : "Кеды со звездами",
		year : 2002
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Слот',
		song : "Мёртвые звёзды",
		year : 2007
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Слот',
		song : "Одни",
		year : 2003
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Кукрыниксы',
		song : "Творец",
		year : 2002
	},
	{
		pack : RU_2000_GR_PACK_1,
		group : 'Кукрыниксы',
		song : "Тайна",
		year : 2002
	},
	{
		pack : RU_2000_GR_PACK_7,
		group : 'Jane Air',
		song : "Junk",
		year : 2004
	},
	{
		pack : RU_2000_GR_PACK_7,
		group : 'Jane Air',
		song : "Вулканы",
		year : 2004
	},
	{
		pack : RU_2000_GR_PACK_7,
		group : 'Jane Air',
		song : "Пуля",
		year : 2002
	},
	{
		pack : RU_2000_GR_PACK_6,
		group : 'Планка',
		song : "На грани болевого порога (2002)"
	},
	{
		pack : RU_2000_GR_PACK_6,
		group : 'Планка',
		song : "Забыла, не помню (2002)"
	},
	{
		pack : RU_2000_GR_PACK_7,
		group : '[AMATORY]',
		song : "Дыши со мной (2008)"
	},
	{
		pack : RU_2000_GR_PACK_7,
		group : '[AMATORY]',
		song : "Осколки (2003)"
	},
	{
		pack : RU_2000_GR_PACK_7,
		group : '[AMATORY]',
		song : "Слишком поздно (2007)"
	},
	{
		pack : RU_2000_GR_PACK_7,
		group : 'Stigmata',
		song : "Лёд (2006)"
	},
	{
		pack : RU_2000_GR_PACK_7,
		group : 'Stigmata',
		song : "Сентябрь (2007)"
	},
	{
		pack : RU_2000_GR_PACK_7,
		group : 'Stigmata',
		song : "Крылья (2007)"
	},
	{
		pack : RU_2000_GR_PACK_7,
		group : 'Психея',
		song : "Навсегда (2005)"
	},
	{
		pack : RU_2000_GR_PACK_7,
		group : 'Психея',
		song : "Мишень (2009)"
	},
	{
		pack : RU_2000_GR_PACK_7,
		group : 'Психея',
		song : "Лезвием сердца (2004)"
	},
	{
		pack : RU_2000_GR_PACK_7,
		group : 'Origami',
		song : "12 секунд (2006)"
	},
	{
		pack : RU_2000_GR_PACK_7,
		group : 'Origami',
		song : "Досчитай до пяти (2006)"
	},
	{
		pack : RU_2000_GR_PACK_7,
		group : 'Origami',
		song : "Без лишних слов (2006)"
	},
	{
		pack : RU_2000_GR_PACK_7,
		group : 'Sakura',
		song : "Слов нет (2006)"
	},
	{
		pack : RU_2000_GR_PACK_7,
		group : 'Sakura',
		song : "Письмо-исповедь ответа не требует (2007)"
	},
	{
		pack : RU_2000_GR_PACK_7,
		group : 'Sakura',
		song : "Доспехи Бога (2009)"
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Дискомафия',
		song : 'На соседней улице (2005)'
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Дискомафия',
		song : 'Летняя пора (2001)'
	},
	{
		pack : RU_2000_GR_PACK_2,
		group : 'Дискомафия',
		song : 'Море по колено (2003)'
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "Пара Нормальных",
		song : "Не улетай"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "Пара Нормальных",
		song : "Вставай"
	},
	{
		pack : RU_2000_GR_PACK_4,
		group : "Пара Нормальных",
		song : "По улицам Москвы"
	}
];

let ru_2000_gr_1 =	ru_2000_gr.filter(item => item.pack == 6);
let ru_2000_gr_2 =	ru_2000_gr.filter(item => item.pack == 1);
let ru_2000_gr_3 =	ru_2000_gr.filter(item => item.pack == 2);
let ru_2000_gr_4 =	ru_2000_gr.filter(item => item.pack == 3);
let ru_2000_gr_5 =	ru_2000_gr.filter(item => item.pack == 4);
let ru_2000_gr_6 =	ru_2000_gr.filter(item => item.pack == 5);
let ru_2000_gr_7 =	ru_2000_gr.filter(item => item.pack == 7);

let music = [
	{
		arr: ru_2000_gr,
		lang: 'ru',
		year: '2000',
		type: 'gr',
		packs: [
				{
					arr: ru_2000_gr_2,
					name: 'RU 2000s Groups: Easy',
				},
				{
					arr: ru_2000_gr_3,
					name: 'RU 2000s Groups: Medium',
				},
				{
					arr: ru_2000_gr_4,
					name: 'RU 2000s Groups: Pop Women',
				},
				{
					arr: ru_2000_gr_5,
					name: 'RU 2000s Groups: Pop Women Easy',
				},
				{
					arr: ru_2000_gr_6,
					name: 'RU 2000s Groups: Pop Women Medium',
				},
				{
					arr: ru_2000_gr_1,
					name: 'RU 2000s Groups: Rock',
				},
				{
					arr: ru_2000_gr_7,
					name: 'RU 2000s Groups: Hard Rock',
				}
			]
	}
]

let songs_to_map;
let mapping_result;
function map_songs(){
	back = back_to_current_pack;
	$('.package').hide();
	$('#mirror').hide();
	$('#map').hide();
	$('#package_content').hide();
	$('#mapping_content').show();
	toggleLearn();
	for(var j=0; j < music.length; j++){
		music[j].arr = generateSongIdsWithPrefix(music[j].arr, music[j].lang, 
												music[j].year, music[j].type);
	}
	showMapping(0, "en_2000_gr", "gr");
}

function select_mapping_button(suffix, type){
	$('.gr').attr('src', 'img/chart/gr.png');
	$('.m').attr('src', 'img/chart/m.png');
	$('.f').attr('src', 'img/chart/f.png');
	let selected = 'img/chart/' + type + '_selected.png';
	$('#btn_' + suffix).attr('src', selected);
}

function showMapping(index, suffix, type){
	select_mapping_button(suffix, type);
	mapping_result = '';
	let h1_start = `<h1>`;
	let h1_end = `</h1>`;
	let br = `<br/>`;
	let hr = `<hr/>`;
	for(var j=0; j < music[index].packs.length; j++){
		mapping_result += h1_start + music[index].packs[j].name + h1_end;
		mapping_result += map_songs_format(music[index].packs[j].arr);
		mapping_result += br + hr;
	}
	$('#mapping_content').html(mapping_result);
}

function generateSongIdsWithPrefix(arr, lang, year, type){
	let prefix = lang + '_' + year + '_' + type + '_';
	let audioPath = 'audio/' + lang + '/' + year + '/' + type + '/';
	let imgPath = 'img/' + lang + '/' + year + '/' + type + '/';
	let id;
	for(var i=1; i <= arr.length; i++){
		id = 'Song (' + i + ')';
		arr[i-1].id = prefix + id;
		arr[i-1].audioPath = audioPath + id;
		arr[i-1].imgPath = imgPath + arr[i-1].group;
	}
	return arr;
}

function generateSongIdsByPaths(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
		arr[i-1].audioPath = audioPath + 'Song (' + i + ')';
		arr[i-1].imgPath = imgPath + arr[i-1].song;
	}
	return arr;
}

function generateSongIdsImgGroup(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
		arr[i-1].audioPath = audioPath + 'Song (' + i + ')';
		arr[i-1].imgPath = imgPath + arr[i-1].group;
	}
	return arr;
}

function generatePathsBySongName(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].audioPath = audioPath + arr[i-1].group;
		arr[i-1].imgPath = imgPath + arr[i-1].song;
	}
	return arr;
}

function map_songs_format(arr){
	arr = arr.filter(song => !song.ignore);
	let h2_start = `<h2 style='margin-bottom: -20px;'>`;
	let h2_end = `</h2>`;
	let h3_start = `<h3 style='font-family: serif; margin-left: 30px;' >`;
	let h3_end = `</h3>`;
	let div_start = `<div>`;
	let div_end = `</div>`;
	let br = `<br/>`;
	//let img_start = `<img width="300" height="300" src="`;
	let img_end = `.jpg" />`;
	let img_play_start = `<img class='pointer onhover' width="30" height="30" src="img/navi/play.png" onclick="playSong('`;
	let img_play_middle = `')" id='`;
	let img_play_end = `'" />`;
	let space = '&nbsp;';
	songs_to_map = arr.sort((a,b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : 0));
	let curr_group = songs_to_map[0].group;
	//let result = img_start + songs_to_map[0].imgPath + img_end + br
	let result = h2_start + curr_group + ':' + h2_end + h3_start;
	let id;
	for(let i = 0; i < songs_to_map.length; i++){
		id = songs_to_map[i].id.replace(' ', '_').replace('(', '').replace(')', '');
		if(curr_group != songs_to_map[i].group){
			curr_group = songs_to_map[i].group;
			result += h3_end + h2_start + songs_to_map[i].group + ':' + h2_end 
			+ h3_start + songs_to_map[i].song + space
			+ img_play_start + songs_to_map[i].audioPath + "', '" + id
			+ img_play_middle + id + img_play_end + div_end;
		} else {
			result += div_start + songs_to_map[i].song + space
			+ img_play_start + songs_to_map[i].audioPath + "', '" + id 
			+ img_play_middle + id + img_play_end
			+ div_end;
		}
	}
	result += h3_end;
	return result;
}

let last_song_id;
let is_playing = false;
function playSong(audioPath, id){
	if(id == last_song_id){
		if(is_playing){
			audio.pause();
			$('#' + id).attr('src', 'img/navi/play.png');
			is_playing = false;
		} else {
			audio.play();
			$('#' + id).attr('src', 'img/navi/pause.png');
			is_playing = true;
		}
	} else {
		if(audio){
			audio.pause();
		}
		$('#' + last_song_id).attr('src', 'img/navi/play.png');
		last_song_id = id;
		is_playing = true;
		$('#' + id).attr('src', 'img/navi/pause.png');
		audio = new Audio(audioPath + '.mp3');
		audio.play();
	}
}

function getGroupNamesSorted(){
	let group_names = removeDuplicates(songs.map(item=>item.group)).sort();
	return group_names;
}

function showGroupNames(){
	songs_backup = songs;
	let group_names = getGroupNamesSorted();
	
	let tag_1 = `<h3><label class='checkbox-google'><input class='group_item' checked id='group_`;
	let tag_2 = `' type='checkbox' onchange='skipGroup(this,"`;
	let tag_3 = `");'><span class='checkbox-google-switch'></span></label> `;
	let tag_4 =	`</h3>`;
	let result = '';
	for(let i = 0; i < group_names.length; i++){
		result += tag_1 + i + tag_2 + group_names[i].replace("'", "#") + tag_3 + group_names[i] + tag_4;
	}
	$('#package_content').html(result);
	$('#package_content').show();
	toggleLearn();
}

function hide_navi_icons(){
	$('#map').hide();
	$('#mirror').hide();
	$('.settings').hide();
	
	$('#sec_15').show();
	$('#back').show();
}

let gr_package_names = [];
let package_names;

function show_packages(num){
	for(var i=1; i <= num; i++){
		if(package_names[i-1]){
			$('#package_' + i).attr("src", 'img/package/' + package_names[i-1] + ".png");
		} else {
			$('#package_' + i).attr("src", 'img/package/' + i + ".png");
		}
		$('#package_' + i).show();
	}
}

function package_num(num){
	$('#current_pack').show();
	$('#current_pack').attr('src', $('#package_' + num).attr('src'));
	$('.package').hide();
	setPathsByPack(num);
	showGroupNames();
}

function setPaths(artist_type, package_num, genre){
		let songs_str = lang + '_' + year;
			audioPath = 'audio/' + lang + '/' + year + '/';
			imgPath = 'img/' + lang + '/' + year + '/';
		if(genre){
			songs_str += '_' + genre;
			audioPath += genre + '/';
			imgPath += genre + '/';
		}
		if(artist_type){
			songs_str += '_' + artist_type;
			audioPath += artist_type + '/';
			imgPath += artist_type + '/';
		}
		if(package_num){
			songs_str += '_' + package_num;
			audioPath += package_num + '/';
			imgPath += package_num + '/';
		}
		songs = generateSongIds(eval(songs_str));
		answers = songs.map(item=>item.group);
		finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
		$('#total').html(songs.length);
		shuffle(songs);
}

function setPathsByPack(num){
	let arr = generateSongIds(eval(lang + '_' + year + '_' + artist_type));
	songs = arr.filter(song => song.pack == num && !song.ignore);
	songs.forEach(song => {
		song.audioPath = 'audio/' + lang + '/' + year + '/' + artist_type + '/' + song.id;
		song.imgPath = 'img/' + lang + '/' + year + '/' + artist_type + '/' + song.group;
	});
	finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
	$('#total').html(songs.length);
	shuffle(songs);
}
	
function setMusicalAlphabet(){
	let result = [];
	let arr = generateSongIds(eval(lang + '_' + year + '_gr'));
	let arr_pack;
	audioPath = 'audio/' + lang + '/' + year + '/gr/';
	imgPath = 'img/' + lang + '/' + year + '/gr/';
	for(let i = 1; i <= gr_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Группа', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	arr = generateSongIds(eval(lang + '_' + year + '_m'));
	audioPath = 'audio/' + lang + '/' + year + '/m/';
	imgPath = 'img/' + lang + '/' + year + '/m/';
	for(let i = 1; i <= m_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Исполнитель', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	arr = generateSongIds(eval(lang + '_' + year + '_f'));
	audioPath = 'audio/' + lang + '/' + year + '/f/';
	imgPath = 'img/' + lang + '/' + year + '/f/';
	for(let i = 1; i <= f_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Исполнительница', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	result = result.flat();
	shuffle(result);
	songs = result.slice(0, 20);
	answers = songs.map(item=>item.group);
	finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
	$('#total').html(songs.length);
	showGroupNames();
}
	
function setMusicalAlphabetPack(arr, type, audioPath, imgPath){
	shuffle(arr);
	arr = arr.sort((a,b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : 0));
	let group = arr[0].group;
	let result = [];
	result.push(arr[0]);
	for(let i = 1; i < arr.length; i++){
		if(group == arr[i].group){
			continue;
		} else {
			group = arr[i].group;
			result.push(arr[i]);
		}
	}
	result.forEach(song => {
		song.letter = Array.from(song.group)[0];
		song.type = type;
		song.audioPath = audioPath + song.id;
		song.imgPath = imgPath + song.group;
	});
	return result;
}

function generateSongIds(arr){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
	}
	return arr;
}

let back;
let expressMode = false;
let generateSongs;
let generateArr;
let generateAudioPath;
let generateImgPath;

function setup(){
	lang = 'ru';
	year = '2000';
	artist_type = 'gr';
	modeToggle = toggleArtist;
	setMedia = setAudio;
	rightAnswer = rightAnswer_RU;
	count_time();
	package_names = ru_2000_gr_icon;
	show_packages(package_names.length);
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	useUrlParam();
}

let pack_num;
let year_url = 'https://sunquiz.netlify.app/2000';

function useUrlParam() {
	var url_string = window.location.href; 
	var url = new URL(url_string);
	pack_num = url.searchParams.get("pack");
	if(pack_num){
		package_num(pack_num);
	}
	back = back_to_browser;
}

function back_to_browser(){
	window.location.href = year_url;
}

function back_to_current_pack(){
	back = back_to_browser;
	$('#mapping_content').hide();
	$('#map').show();
	package_num(pack_num);
}