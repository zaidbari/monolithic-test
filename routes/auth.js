const router = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/User')


router.get('/login', (req, res, next) => {
  if (req.session.user) {
    res.redirect('/')
    return
  } 
  res.render('login', { title: 'Login', error: '' })
})
router.get('/signup', (req, res, next) => {
  if (req.session.user) {
    res.redirect('/')
    return
  }
	res.render('signup', { title: 'Signup', error: '' })
})

router.get('/logout', (req, res, next) => {
  req.session.destroy()
  res.redirect('/')
 })

router.post('/login', async (req, res) => {
	const { email, password } = req.body
	var user = await User.findOne({ email })

	if (user === null) {
    res.render('login', { title: 'Login', error: 'Email incorrect' })
    return
  }  
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    res.render('login', { title: 'Login', error: 'Password incorrect' })
    return
  }

  req.session.regenerate(function (err) {
    if (err) next(err)

    // store user information in session, typically a user id
    req.session.user = user

    // save the session before redirection to ensure page
    // load does not happen before session is saved
    req.session.save(function (err) {
      if (err) return next(err)
      res.redirect('/')
    })
  })
})

router.post('/signup', async (req, res, next) => {
  const { name, email, password } = req.body

	// check for existing email
	const user = await User.findOne({ email })
	if (user) {
    res.render('signup', { title: 'Signup', error: 'Email Already exists' })
		return
	}

	try {
		const salt = bcrypt.genSaltSync(10)
		const hash = bcrypt.hashSync(password, salt)

		const newUser = await User.create({
			email,
			password: hash,
			name
		})
    req.session.user = newUser
    res.redirect('/')
    return
  } catch (error) {
    res.render('signup', { title: 'Signup', error: 'Email, name and password required' })
	}
 })

module.exports = router
