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
  Posts.findById(id).then(post => {
    if (post.length === 0) {
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

router.get("/", (req, res) => {
  Posts.find()
    .then(posts => {
      res.json({ posts });
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Posts.findById(id).then(post => {
    if (post.length === 0) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
      return;
    }
    res
      .json({ post })

      .catch(error => {
        res
          .status(500)
          .json({ error: "The post information could not be retrieved." });
      });
  });
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  Posts.findPostComments(id)
    .then(posts => {
      if (posts.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
        return;
      }
      res.json({ posts });
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Posts.remove(id)
    .then(response => {
      if (response === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
        return;
      }
      res.json({ message: "Delete Success" });
    })
    .catch(error => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

router.put("/:id", (req, res) => {
  const { title, contents } = req.body;
  const { id } = req.params;
  if (!title || !contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
    return;
  }
  Posts.update(id, { title, contents })
    .then(response => {
      if (response === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
      res.status(200).json({ title, contents });
    })
    .catch(error => {
      res.status(500).json({
        error: "The post information could not be modified."
      });
    });
});

module.exports = router;
