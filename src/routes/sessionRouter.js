import { Router } from "express"
// import UserModel from "../../models/user.js";
// import { createHash, isValidPassword } from "../../config/config.js";
import passport from "passport"

  const router = Router();

  router.get('/register', (req, res) => {
    res.render('sessions/register')
  })

  // router.post('/register', async (req, res) => {
  //   const userNew = req.body
  //   if (userNew.email == 'adminCoder@coder.com' && userNew.password == 'adminCod3r123') {
  //     userNew.role = 'Admin'
  //   } else userNew.role = 'User'
  //   const user = new UserModel(userNew)
  //   await user.save()
  //   res.redirect('/sessions/login')
  // })

  router.post('/register', passport.authenticate('register', {
    failureRedirect: '/sessions/failRegister'
}), async(req, res) => {
    res.redirect('/sessions/login')
})


  router.get('/failRegister', (req, res) => {
    res.render('sessions/register', { error: 'Failed!'})
  })
  
  router.get('/login', (req, res) => {
    res.render('sessions/login')
  })

  // router.post('/login', async (req, res) => {
  //   const {email, password } = req.body 
  //   const user = await UserModel.findOne({email, password}).lean().exec()
  //   if (!user) {
  //       return res.status(401).render("errors/base", {
  //           error: 'Error en Email y / o Contraseña'
  //       })
  //   } req.session.user = user
  //   res.redirect("/products")
  // }) 

router.post('/login', passport.authenticate('login', {
    failureRedirect: '/sessions/failLogin'
}), async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: 'error', error: 'Invalid credentials'})
    }
    req.session.user = {
        firstName: req.user.first_name,
        username: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    }
    res.redirect('/products')
})

router.get('/failLogin', (req, res) => {
  res.render('sessions/login', { error: 'Fail Login!'})
})

router.get('/github', passport.authenticate('github', { scope: ["user:email"] }), (req, res) => { })

router.get('/githubCallback',
    passport.authenticate('github', { failureRedirect: '/login' }),

    async (req, res) => {
      console.log(req.user)
      req.session.user = {
        displayName: req.user.displayName,
        username: req.user.username,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    }
        res.redirect('/products')
    })


    router.get('/logout', function (req, res) {
      req.logout(function (err) {
          if (err) { return res.send({ error: 'error al logout'}); }
          res.redirect('/sessions/login');
      });
  });
  

  router.post('/logout', (req, res) => {
    const user = req.session.user.email;
    req.session.destroy(err => {
        console.log(err)
        if (err) res.status(500).render('/errors/base', {
            error: err
        })
        else res.render('sessions/logout', { user: user})
    })
  })

  export default router