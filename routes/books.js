const fs = require("fs");
const path = require("path");

const express = require("express");
const router = express.Router();

const Validator = require("../services/validators");
const DbContext = require("../services/db");
const root = require("../utils").root;
const getCollection = require("../utils").getCollection;


const dbc = new DbContext();
const v = new Validator();
dbc.useCollection("posts.json");

router.get("/", (req, res) => {
    dbc.getAll(
        (records) =>
            res.render("all_books", {
                title: "List of All Books",
                posts: records,

            }),
        () =>
            res.render("all_books", {
                title: "List of All Books",
                posts: null,

            })
    );
});



router.get("/create-book", (req, res) => {
    res.render("create_book", {title: "New Post Form"});
});

router.post("/create-book", (req, res) => {
    if (v.isValid(req.body)) {
        // const date = new Date().toDateString();
        const date = new Date().toLocaleString();
        // const date = new Date().toString();
        dbc.saveOne(req.body, date, () =>
            res.render("create_book", {success: true})
        );
    } else {
        res.render("create_book", {error: true});
    }
});

router.get("/:id/delete", (req, res) => {
    dbc.deleteOne(req.params.id, () => res.redirect("/posts")),
        () => res.sendStatus(500);
});

router.get("/:id/rent", (req, res) => {
    fs.readFile(getCollection("posts.json"), (err, data) => {
        if (err) res.sendStatus(500);

        const posts = JSON.parse(data);
        const post = posts.filter((post) => post.id == req.params.id)[0];
        const postIdx = posts.indexOf(post);
        const splicedPost = posts.splice(postIdx, 1)[0];
        splicedPost.isRented = true;
        posts.push(splicedPost);

        fs.writeFile(getCollection("posts.json"), JSON.stringify(posts), (err) => {
            if (err) res.sendStatus(500);

            res.redirect("/posts");
        });
    });
});

//return book
router.get("/:id/return", (req, res) => {
    fs.readFile(getCollection("posts.json"), (err, data) => {
        if (err) res.sendStatus(500);

        const posts = JSON.parse(data);
        const post = posts.filter((post) => post.id == req.params.id)[0];
        const postIdx = posts.indexOf(post);
        const splicedPost = posts.splice(postIdx, 1)[0];
        splicedPost.isRented = false;
        posts.push(splicedPost);

        fs.writeFile(getCollection("posts.json"), JSON.stringify(posts), (err) => {
            if (err) res.sendStatus(500);

            res.redirect("/rent");
        });
    });
});

//search by name


router.get("/:id", (req, res) => {
    dbc.getOne(
        req.params.id,
        (record) =>
            res.render("post_detail", {title: `${record.title}`, post: record}),
        () => res.sendStatus(404)
    );
});



module.exports = router;
