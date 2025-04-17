require('dotenv').config();
const dns = require("node:dns")
const express = require('express');
const cors = require('cors');
const app = express();
let bodyParser = require('body-parser');
const { error } = require('node:console');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urls = [];
// 2. 你可以 POST 一个 URL 到 /api/shorturl ，并获得一个包含 original_url 和 short_url 属性的 JSON 响应。
// 这是一个例子： { original_url : 'https://freeCodeCamp.org', short_url : 1}
// 3. 当你访问 /api/shorturl/<short_url> 时，你将被重定向到原始 URL
// 4. 如果你传入一个不符合有效 http://www.example.com 格式的无效 URL，JSON 响应将会包含 { error: 'invalid url' }
app.post("/api/shorturl", (req, res) => {
  const hostname = new URL(req.body.url).hostname;
  
  dns.lookup(hostname, (err) => {
    if (err) {
      res.json({ error: 'invalid url' });
    }
    const url = { original_url: req.body.url, short_url : urls.length}
    urls.push(url);
    res.json(url);
  });
}); 

app.get("/api/shorturl/:id", (req, res) => {
  const redirectUrl = urls.find(item => item.short_url == req.params.id).original_url;
  res.redirect(redirectUrl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});