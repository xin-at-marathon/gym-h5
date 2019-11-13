function set_body_height() {
    var wh = $(window).height();
    $("#image").attr("style", "height:" + wh + "px;");
}

var timer;

var image;
var music;
var labelTitle;
var labelCount;
var labelProgress;
var labelRankPoint;

var frames = [];

var totalSeconds = 0;

var synth = null;
var utter = null;

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
		    loadMusic: false,
		    finished: false
		};

		if (second == 0) {
		    frame.stop = true;
		    frame.loadMusic = true;
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
		    loadMusic: false,
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
		    loadMusic: false,
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
	loadMusic: false,
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

    if (frame.say) say(frame.say);

    labelTitle.html(frame.title);
    labelCount.html(frame.countdown.toString());
    labelProgress.html(((progress / totalSeconds) * 100.0).toFixed(0) + "%");

    if (frame.showImage) {
	    image.show();
	    image.attr("src", frame.image);
    }
    if (frame.hideImage) {
	    image.hide();
    }

    if (frame.stop) {
	    music[0].pause();
    }

    if (frame.loadMusic) {
	    $.get("/music", function(response) {
	        music.attr("src", "mp3/" + response);
	        music[0].load();
	    });
    }

    if (frame.play) {
	    music[0].volume = 0.3;
	    music[0].play();
    }

    if (frame.finished) {
	    clearInterval(timer);
	    //save rank point
	    $.getJSON("/saveRankPoint", function(result){
	        var rankPoint = "Rank: " + result.rank + " Point: " + result.point;
	        labelRankPoint.html(rankPoint);
    		say("Rank " + result.rank);
            say("Point " + result.point);
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
    music = $("#music");
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

	    music.hide();
	    start();
	    event.preventDefault();
    });

    btn.val((totalSeconds / 60).toFixed(0) + " Min");
});
