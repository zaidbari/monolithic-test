var express = require('express')
const Comment = require('../models/Comment')
const Post = require('../models/Post')
var router = express.Router()

/* GET home page. */
router.get('/', async (req, res, next) => {
  // get all posts with comments
  const posts = await Post.find().populate('comments')
  console.log(req.session.user);
	res.render('index', { title: 'Posts', posts, error: '' })
})

router.post('/create', async(req, res, next) => {
  const { title } = req.body
  console.log(req.session.user)
	if (!title) {
    res.render('index', { title: 'Posts', error: 'Title is required!' })
		return
	}

	try {
		await Post.create({
			title,
			createdBy: req.session.user._id
		})

    res.redirect('/')
    return
	} catch (e) {
		console.log(e)
    res.render('index', { title: 'Posts', error: 'Title is required!' })
    return
	}
})

router.post('/comment', async (req, res, next) => { 
  const { content, id } = req.body
  console.log(req.session.user)
  if (!content) {
    res.render('index', { title: 'Posts', error: 'Content is required!' })
    return
  }

  try {

    const banedWords = ['pakistan', 'orange']
    const status = content.match(new RegExp(banedWords.join('|'), 'gi')) ? 'rejected' : 'accepted'
  
    const {_id} = await Comment.create({
      content,
      post: id,
      createdBy: req.session.user._id,
      status: status
    });

    await Post.findOneAndUpdate({ _id: id }, { $push: { comments: _id } })

    res.redirect('/')
    return
  } catch (e) {
    console.log(e)
    res.render('index', { title: 'Posts', error: 'Content is required!' })
    return
  }
})

module.exports = router
