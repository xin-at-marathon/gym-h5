const express = require('express')
const app = express()
const fs = require('fs')
var request = require('request')
const exec = require('child_process').exec

const APP_KEY = '203756128'
const APP_SECRET = 'dtjmyh6fxxb3q5b11576fboy00gyec07'
const APP_CODE = '2c777f9671bb49749d32b72484828fe8'
const API_URL_PREFIX = 'https://a83774f0c32147a0ace5f5748770682f-cn-hangzhou.alicloudapi.com'

/*
var rank = [
    { name: '倔强青铜I', star: 0 },
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
    { name: '荣耀王者', star: 147 },
]

*/

app.get('/getRankPoint', function(req, res) {
    const options = {
        method: 'GET',
        url: API_URL_PREFIX + '/rank_point',
        headers: {
            Authorization: 'APPCODE ' + APP_CODE,
        },
        json: true,
    }
    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.json(body)
        } else {
            console.error(error)
            console.error(response)
            console.error(body)
        }
    })
})

app.get('/saveRankPoint', function(req, res) {
    const options = {
        method: 'POST',
        url: API_URL_PREFIX + '/rank_point',
        headers: {
            Authorization: 'APPCODE ' + APP_CODE,
        },
        json: true,
    }
    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.json(body)
        } else {
            console.error(error)
            console.error(response)
            console.error(body)
        }
    })
})

app.get('/play-pause', function(req, res) {
    exec('cliclick kp:play-pause', function(error, stdout, stderr) {
        res.sendStatus(200)
    })
})

app.get('/play-next', function(req, res) {
    exec('cliclick -w 333 kd:cmd kp:arrow-left ku:cmd', function(error, stdout, stderr) {
        res.sendStatus(200)
    })
})

app.get('/favor', function(req, res) {
    exec('cliclick c:223,50', function(error, stdout, stderr) {
        res.sendStatus(200)
    })
})

app.get('/music', function(req, res) {
    var files = fs.readdirSync('static/mp3')
    var music = files[Math.floor(Math.random() * files.length)]
    console.log(music)
    res.send(music)
})

app.get('/*.html', function(req, res) {
    var set = req.url.substring(1, req.url.length - 5)
    var html = fs.readFileSync('index.html', 'utf-8')
    html = html.replace(new RegExp(/\{\{set\}\}/g), set)
    res.send(html)
})

app.get('/sets/*.js', function(req, res) {
    var set = req.url.substring(6).split('.')[0]
    var files = fs.readdirSync('sets/' + set).sort()
    files.pop()
    var json = fs.readFileSync('sets/' + set + '/index.json', 'utf-8')
    var config = JSON.parse(json)

    var js = 'var TotalSets = ' + config.totalSets + ';'
    js += 'var SetName = "' + set + '";'
    js += 'var Actions = ['
    files.forEach(function(file) {
        if (file.substr(-4) != '.gif') return

        var parts = file.split('-')
        var name = ''
        var ready = config.defaultReady
        var go = config.defaultGo
        var rest = config.defaultRest

        if (parts[1]) name = parts[1].replace('_', ' ').split('.')[0]
        if (parts[2]) {
            var p = parts[2].split('_')
            if (p[0]) ready = parseInt(p[0], 10)
            if (p[1]) go = parseInt(p[1], 10)
            if (p[2]) rest = parseInt(p[2], 10)
        }
        js += '{"name":"' + name + '",'
        js += '"image":"' + file + '",'
        js += '"ready":' + ready + ','
        js += '"go":' + go + ','
        js += '"rest":' + rest + '},'
    })

    js += '];'
    //	console.log(js);
    res.send(js)
})

app.use(express.static('static'))
app.use(express.static('sets'))

app.listen(3001, function() {
    console.log('Gym app listening on port 3001.')
    console.log('visit: http://localhost:3001/abs.html')
})
