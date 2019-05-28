const router = require("express").Router();
const Posts = require("../data/db.js");

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
    return;
  }
  Posts.insert({
    title,
    contents
  })
    .then(response => {
      res.status(201).json({ title, contents });
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error while saving the post to the database"
      });
    });
});

router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  const { text, post_id } = req.body;
  Posts.findById(id).then(user => {
    if (user.length === 0) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
      return;
    }
    Posts.insertComment({ text, post_id })
      .then(comment => {
        console.log(text);
        if (text === "") {
          res
            .status(400)
            .json({ errorMessage: "Please provide text for the comment." });
          return;
        }
        res.status(201).json({ text });
      })
      .catch(error => {
        res.status(500).json({
          error: "There was an error while saving the comment to the database"
        });
      });
  });
});

router.get('/', (req, res) => {
    const { id } = req.params;
    Posts.findById(id).then(user => {
        if (user.length === 0) {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." });
          return;
        }
        res.json({user})
    })
        .catch 
            res.status(500).json({"The comments information could not be retrieved."})

})

module.exports = router;
