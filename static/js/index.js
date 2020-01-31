function set_body_height() {
    var wh = $(window).height();
    $("#image").attr("style", "height:" + wh + "px;");
}

var timer;

var image;
var labelTitle;
var labelCount;
var labelProgress;
var labelRankPoint;
var isFirstPlay = true;
var frames = [];

var totalSeconds = 0;

var synth = null;
var utter = null;

var RANK_TITLE = [
    { name: '倔强青铜I', star: 1 },
    { name: '倔强青铜II', star: 4 },
    { name: '倔强青铜III', star: 7 },
    { name: '秩序白银I', star: 10 },
    { name: '秩序白银II', star: 14 },
    { name: '秩序白银III', star: 18 },
    { name: '秩序白银IV', star: 22 },
    { name: '尊贵黄金I', star: 26 },
    { name: '尊贵黄金II', star: 30 },
    { name: '尊贵黄金III', star: 34 },
    { name: '尊贵黄金IV', star: 38 },
    { name: '荣耀铂金I', star: 42 },
    { name: '荣耀铂金II', star: 47 },
    { name: '荣耀铂金III', star: 52 },
    { name: '荣耀铂金IV', star: 57 },
    { name: '荣耀铂金V', star: 62 },
    { name: '永恒钻石I', star: 67 },
    { name: '永恒钻石II', star: 72 },
    { name: '永恒钻石III', star: 77 },
    { name: '永恒钻石IV', star: 82 },
    { name: '永恒钻石V', star: 87 },
    { name: '至尊星耀I', star: 92 },
    { name: '至尊星耀II', star: 97 },
    { name: '至尊星耀III', star: 102 },
    { name: '至尊星耀IV', star: 107 },
    { name: '至尊星耀V', star: 112 },
    { name: '最强王者', star: 117 },
    { name: '荣耀王者', star: 147 }
];


function getRankTitle(star){
    for(var i = RANK_TITLE.length-1; i >= 0; i--){
        var rank = RANK_TITLE[i];
        if(star >= rank.star)
            return { title: rank.name, star: star - rank.star +1 };
    }
    return null;
}

function init() {
    var finished = false;
    for (var set = 1; set <= TotalSets; set++) {
	for (var index = 0; index < Actions.length; index++) {
	    for (var second = 0; second < Actions[index].ready; second++) {
		var frame = {
		    title: "Get Ready",
		    image: null,
		    showImage: false,
		    hideImage: false,
		    countdown: Actions[index].ready - second - 1,
		    say: null,
		    play: false,
		    stop: false,
		    finished: false
		};

		if (second == 0) {
		    frame.stop = true;
		    frame.showImage = true;
		    frame.image = SetName + "/" + Actions[index].image;

		    frame.say = "get ready for " + Actions[index].name;
		}

		if (frame.countdown <= 5 && frame.countdown > 0) {
		    frame.say = frame.countdown.toString();
		}

		if (frame.countdown == 0) {
		    frame.say = "action";
		    frame.play = true;
		}

		frames.push(frame);
		totalSeconds++;
	    } //end ready

	    for (second = 0; second < Actions[index].go; second++) {
		var frame = {
		    title: "Action",
		    image: SetName + "/" + Actions[index].image,
		    image: null,
		    showImage: false,
		    hideImage: false,
		    countdown: Actions[index].go - second - 1,
		    say: null,
		    play: false,
		    stop: false,
		    finished: false
		};
		if (
		    frame.countdown == 30 ||
			frame.countdown == 20 ||
			(frame.countdown <= 10 && frame.countdown > 0)
		)
		    frame.say = frame.countdown.toString();

		if (frame.countdown == 0) {
		    if (index < Actions.length - 1) {
			frame.say = "rest";
		    } else {
			if (set + 1 > TotalSets) {
			    finished = true;
			    frame.say = "Congratulation.";
			} else {
			    frame.say = "rest for set " + (set + 1).toString();
			}
		    }
		}

		frames.push(frame);
		totalSeconds++;
	    } //end go

	    for (second = 0; !finished && second < Actions[index].rest; second++) {
		var frame = {
		    title: "Rest",
		    image: null,
		    showImage: false,
		    hideImage: false,
		    countdown: Actions[index].rest - second - 1,
		    say: null,
		    play: false,
		    stop: false,
		    finished: false
		};

		if (second == 0) frame.hideImage = true;

		if (frame.countdown % 60 == 0 && frame.countdown / 60 >= 1)
		    frame.say = (frame.countdown / 60).toString() + "minute remaining";

		if (frame.countdown <= 10 && frame.countdown > 0)
		    frame.say = frame.countdown.toString();

		frames.push(frame);
		totalSeconds++;
	    } //end rest
	} //end action loop
    } //end set loop

    var frame = {
	title: "Congratulation",
	image: null,
	showImage: false,
	hideImage: true,
	countdown: 0,
	say: null,
	play: false,
	stop: false,
	finished: true
    };
    frames.push(frame);
}

function start() {
    say('start');
    timer = setInterval(timerfunc, 1000);
}

var progress = 0;

function timerfunc() {
    progress++;
    frame = frames.shift();
    console.log(frame);

    if (frame.say) say(frame.say);

    labelTitle.html(frame.title);
    
    labelCount.html(frame.countdown.toString());

    /* test only
    var rankTitle = getRankTitle(100);
    labelCount.html(rankTitle.title + '<br/>' +  rankTitle.star + " Star");
    */
    
    labelProgress.html(((progress / totalSeconds) * 100.0).toFixed(0) + "%");

    if (frame.showImage) {
	    image.show();
	    image.attr("src", frame.image);
    }
    if (frame.hideImage) {
	    image.hide();
    }

    if (frame.stop) {
	    $.get("/play-pause", function(response) {
	    });
    }

    if (frame.play) {
        if(isFirstPlay){
            isFirstPlay = false;
   	        $.get("/play-pause", function(response) {
	        });
        }else{
	        $.get("/play-next", function(response) {
	        });
        }
    }

    if (frame.finished) {
	    clearInterval(timer);
	    //save rank point
	    $.getJSON("/saveRankPoint", function(result){
	        var rankPoint = "Rank: " + result.rank + " Point: " + result.point;
	        labelRankPoint.html(rankPoint);
    		say("Rank " + result.rank);
            say("Point " + result.point);

            var rankTitle = getRankTitle(result.rank);
            labelCount.html(rankTitle.title +'<br/>'+ rankTitle.star + " Star");
            labelProgress.hide();
	    });
    }
}

function say(text) {
    utter.text = text;
    synth.speak(utter);
}

$(document).ready(function() {
    init();

    set_body_height();
    $(window).bind("resize", function() {
	    set_body_height();
    });

    image = $("#image");
    image.hide();
    labelTitle = $("#labelTitle");
    labelCount = $("#labelCount");
    labelProgress = $("#labelProgress");
    labelRankPoint = $("#labelRankPoint");
    
    $.getJSON("/getRankPoint", function(result){
	    labelRankPoint.html("Rank: " + result.rank + " Point: " + result.point);
    });

    var btn = $("#btn");
    btn.click(function(event) {
        synth = window.speechSynthesis;
        utter = new SpeechSynthesisUtterance();
        utter.lang = "en-US";

	    btn.hide();

	    start();
	    event.preventDefault();
    });

    btn.val((totalSeconds / 60).toFixed(0) + " Min");
});
