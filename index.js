const express = require('express');
const app = express();
const fs = require("fs");

app.get('/music', function (req, res) {
	var files = fs.readdirSync('static/mp3');
	var music = files[Math.floor(Math.random()*files.length)];
	res.send(music);
});

app.get('/*.html', function(req,res){
	var set = req.url.substring(1,req.url.length-5);
	var html = fs.readFileSync('index.html','utf-8');
	html = html.replace(new RegExp(/\{\{set\}\}/g),set);
	res.send(html);
});

app.get('/sets/*.js', function(req, res) {
	var set = req.url.substring(6).split('.')[0];
	var files = fs.readdirSync('sets/'+set).sort();
	files.pop();
	var json = fs.readFileSync('sets/'+set+'/index.json','utf-8');
	var config = JSON.parse(json);

	var js = 'var TotalSets = '+config.totalSets+';';
	js += 'var SetName = "'+set+'";';
	js += 'var Actions = [';
	files.forEach(function(file){
		if(file.substr(-4) != '.gif')
			return;

		var parts = file.split('-');
		var name = '';
		var ready = config.defaultReady;
		var go = config.defaultGo;
		var rest = config.defaultRest;

		if(parts[1])
			name = parts[1].replace('_',' ').split('.')[0];
		if(parts[2]){
			var p = parts[2].split('_');
			if(p[0])
				ready = parseInt(p[0],10);
			if(p[1])
				go = parseInt(p[1], 10);
			if(p[2])
				rest = parseInt(p[2], 10);
		}
		js += '{"name":"'+name+'",';
		js += '"image":"'+file+'",';
		js += '"ready":'+ready+',';
		js += '"go":'+go+',';
		js += '"rest":'+rest+'},'
	});

	js += '];';
//	console.log(js);
	res.send(js);
});

app.use(express.static('static'));
app.use(express.static('sets'));

app.listen(3001, function () {
      console.log('Gym app listening on port 3001.')
      console.log('visit: http://localhost:3001/abs.html')
});
