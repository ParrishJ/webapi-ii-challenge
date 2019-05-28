const express = require("express");

const blogRouter = require("../posts/posts-router.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Blog!</h1>
    `);
});

server.use("/api/posts", blogRouter);

module.exports = server;
