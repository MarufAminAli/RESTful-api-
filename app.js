const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");


const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });
mongoose.Promise = global.Promise;

const articlesSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articlesSchema);

// requests targeting all articles

app.route("/articles")
  .get((req, res) => {
    Article.find({}).then((err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle
      .save()
      .catch((error) => {
        res.send(error);
      })
      .then((article) => {
        res.send("saved:" + article);
      });
  })

  .delete((req, res) => {
    Article.deleteMany({})
      .catch((error) => {
        res.send(error);
      })
      .then(() => {
        res.send("Successfully Deleted");
      });
  });

//  requests targeting a single article  



app.route("/articles/:articleTitle")
.get( (req,res) => {
Article.findOne({title: req.params.articleTitle})
.then((foundArticle)=> {
    res.send(foundArticle)
})
.catch((error)=>{
    res.send(error)
})
})

.put(async (req, res) => {
  try {
    await Article.updateOne(
      { title: req.params.articleTitle },
      { $set: { title: req.body.title, content: req.body.content }}
    );
    res.send(`Successfully updated  article`);
  } catch (error) {
    res.send(error);
  }
})
.delete(async (req,res) => {
  try{
    await Article.deleteOne(
      {title:req.params.articleTitle});
      res.send("succesfully deleted artice")
  }catch (error) {
    res.send (error);
  }
})


app.listen("3000", () => {
  console.log("listening on port 3000");
});
