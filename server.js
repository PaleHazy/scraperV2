const express = require("express");
const axios = require("axios")
const cheerio = require("cheerio")
const mongoose = require("mongoose");
var db = require("./models");
var uristring =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/HelloMongoose';
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
mongoose.connect(
  uristring, function (err, res) {
    if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
    console.log ('Succeeded connected to: ' + uristring);
    }
  });

app.get("/article", (req, res) => {
  db.Article.find({})
  .then(function(dbArticle){
      res.json((dbArticle))
  }).catch(function(err){
      res.json(err)
  })
});

app.get('/articles/:id', (req,res) => {
    db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function (dbArticle){
        console.log(dbArticle);
res.json(dbArticle)
    })

})

app.post('/articles/:id', (req,res) => {
    console.log(req.body)
    console.log(req.params.id)
    db.Note.create(req.body).then(function(dbNote){
        console.log('dbNote', dbNote);
        return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
    }).then(function(dbArticle){
        console.log('dbArticle', dbArticle)
        res.json(dbArticle)
    }).catch(function(err){
        res.json(err)
    })
})

app.get("/scrape", (req, res) => {
    axios.get("http://www.echojs.com/").then(function(response) {
        var $ = cheerio.load(response.data);
        let articles = $("article h2")
        for (let i =0; i < articles.length; i++)
        {
            console.log('----------------------------------------')            
            console.log(articles[i].children[0].attribs.href)
            console.log(articles[i].children[0].children[0].data)
            console.log('----------------------------------------')
            let insertObj = {
                link: articles[i].children[0].attribs.href,
                title: articles[i].children[0].children[0].data
            }
            db.Article.create(insertObj)
            .then(function(dbArticle){
                console.log(dbArticle)
            }).catch(function(err){
                console.log(err)
            })
        }
        res.send("done")
    })
})
var theport = process.env.PORT || 5000;
app.listen(theport, function(err) {
  console.log("welcome to port " + port);
});
