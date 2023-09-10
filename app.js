const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Discover the latest in daily journel and beyond through our daily blog posts. Our team of passionate writers and experts curates content that's not only informative but also thought-provoking and enjoyable to read. From in-depth articles to quick reads, there's something for everyone. Discover the latest in [Your Blog Niche] and beyond through our daily blog posts. Our team of passionate writers and experts curates content that's not only informative but also thought-provoking and enjoyable to read. From in-depth articles to quick reads, there's something for everyone. Our commitment to delivering daily blogs means you'll always have something new to explore. Whether you're looking for practical tips, insightful stories, or the latest trends, we've got you covered. Stay informed, stay inspired.";
const aboutContent = `Welcome to daily journel, where facts meet fascination! I'm Maisam Hussain, your guide in the world of knowledge and discovery. Let me introduce myself, I'm Maisam, a seasoned blogger with years of experience in the art of storytelling through words. My journey began with a passion for sharing knowledge and a deep curiosity about the world around us. Over the years, I've honed my craft and transformed that passion into a blog that brings you the most intriguing, informative, and captivating content.`;
const contactContent = "At daily journel, we value your feedback, questions, and suggestions. We're here to assist you in any way we can, so don't hesitate to get in touch with us. Here's how you can reach out: Our dedicated customer support team is available to assist you with any inquiries or issues you may have. Whether you need help navigating our website, have questions about our content, or encounter technical difficulties, we're just a message away. Email: support@[yourblogname].com and Phone: +1 (555) 123-4567 ";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// connecting mongoose to the local as below
mongoose.connect("mongodb://127.0.0.1:27017/blogDB");

// creating the blog mongoose schema to define structure for the documents in the model/collection
const blogSchema = {
  inputTitle: String,
  inputBody: String
};

// creating the model to store the document in it
const Blog = mongoose.model("Blog", blogSchema);


//  Home route
app.get("/", function(req, res){ // ch#1

  Blog.find({})
    .then(posts=>{
      res.render("home", {
        paragraph1: homeStartingContent,
        posts: posts  
      });
    })
    .catch(err=>{
      console.log("error", err);
    });

});

//  About route
app.get("/about", function(req, res){
  res.render("about", {aboutParagraph: aboutContent});
});

//  Contact route
app.get("/contact", function(req, res){
  res.render("contact", {contactParagraph: contactContent});
});

//  Composing Post route
app.get("/compose", function(req, res){
  res.render("compose");

});


//  For composing new Route
app.post("/compose", function(req, res){

  const post1 = new Blog({
    inputTitle: req.body.inputTitle,
    inputBody: req.body.inputBody
  });

  post1.save()
  res.redirect("/");

});


// using Express Route parameters, we are gonna create a new get request on post route
app.get("/post/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  
  Blog.findOne({_id: requestedPostId})
    .then(post=>{
      res.render("post", {
        inputTitle: post.inputTitle, 
        inputBody: post.inputBody
      });
    })
    .catch(err=>{
      console.log(err);
    });

});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});