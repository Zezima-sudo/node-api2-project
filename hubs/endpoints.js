const express = require('express')
const Db = require('../data/db')
const router = express.Router()

//regular post

router.post("/posts", (req, res) => {
    if (req.body.title && req.body.contents) {
      Db.insert(req.body)
        .then((post) => {
          res.status(201).json(post);
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            error: "There was an error while saving the post to the database",
          });
        });
    } else {
      res.status(400).json({
        errorMessage: "Please provide title and contents for the post.",
      });
    }
  });

  // post with id 
  router.post('/posts/:id/comments', (req, res) => {
      const {text} = req.body;
      const {id: post_id} = req.params

        if (!req.body.text) {
            return res.status(400).json({
                errorMessage: "Please provide text for the comment"
            })
        }
        Db.insertComment({text, post_id})
        .then(comment => {
            if(!comment.id) {
                res.status(404).json({
                    message: 'The post with that ID does not exist  '
                })
            } else {
                res.status(201).json(comment)
            }
        })
            .catch(error => {
                console.log(error)
                res.status(500).json({
                    error: "there was an error"
                })
            })
})

router.get('/posts', (req, res) => {
    Db.find(req.query)
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            message: 'Error retrieving data'
        })
    })
})

//BROKEN
router.get('/posts/:id', (req, res) => {
   Db.findById(req.params.id)
   .then(post => {
       if(post) {   
           res.status(200).json(post)
       } else {
           res.status(404).json({
               message: 'the post with the specified ID does not exist '
           })
       }
   })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: 'The post info couldnt be retrived'
            })
        })
  
})

router.get('/posts/:id/comments', (req, res) => {
    Db.findPostComments(req.params.id)
    .then(comment => {
        if(comment) {
            res.status(200).json(comment)
        } else {
            res.status(404).json({
                message: 'the post with the specified ID does not exist'
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: 'the comment`s information could not be retrieved'
        })
    })
})

router.delete('/posts/:id', (req, res) => {
    Db.remove(req.params.id)
    .then(delReq => {
        if(delReq) {
            res.status(200).json({
                message: 'item removed'
            })
        } else {
            res.status(404).json({
                message: `The post with the specified ID doesn't exist`
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: 'The post could not be removed'
        })
    })
})

router.put('/posts/:id', (req, res) => {
   if(!req.body.title || !req.body.contents) {
       return res.status(400).json({
           errorMessage: 'Please provide title and contents for this post'
       })
   }
   Db.update(req.params.id, req.body)
   .then(post => {
       if(post) {
           console.log(post)
           res.status(200).json(post)
       } else {
        res.status(404).json({
            error: 'The post with the specified ID does not exist'
        })
       }
   })
   .catch(err => {
       console.log(err)
       res.status(500).json({
           error: 'the post information could not be modified'
       })
   })
})




// export default router
module.exports = router;