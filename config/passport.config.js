import passport from "passport"
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import UserModel from '../models/user.js'
import { createHash, isValidPassword } from './config.js'

const LocalStrategy = local.Strategy

const initializePassport = () => {

    // Estrategia Local
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { firstName, lastName, email, age } = req.body;
        let role = 'user';
        try {
            const user = await UserModel.findOne({ email: username })
            if (user) {
                console.log('User already exists')
                return done(null, false)
            }
            if (email == 'adminCoder@coder.com' && password == 'adminCod3r123') {
                role = 'Admin'
              } else role = 'User'
            const newUser = {
                firstName, lastName, email, age, role,
                password: createHash(password)
            }
            const result = await UserModel.create(newUser)

            return done(null, result)
        } catch(err) {
            return done('Error al leer la BD')
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done) => {
        try {
            const user = await UserModel.findOne({ email: username })
            if (!user) {
                console.log('User doesnot exists')
                return done(null, user)
            }

            if (!isValidPassword(user, password)) return done(null, false)

            return done(null, user)
        } catch(err) {}
    }))

    // estrategia Github
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.e382288e684d55c7',
        clientSecret: '688e8dd089bed1e24ef75a8acd2a0b0380ba8972',
        callbackURL: 'http://localhost:8080/sessions/githubCallback'
    }, async(accessToken, refreshToken, profile, done) => {
        try {
            const user = await UserModel.findOne({ email: profile._json.email })
            if (user) return done (null, user)
            const newUser = await UserModel.create({
                // firstName: profile.displayName,
                // lastName: profile.username,
                email: profile._json.email,
                // age: 0,
                // password: 'github',
                role: 'User',
            })

            return done(null, newUser)
        } catch(err) {
            return done (err, 'Error to login with GitHub')
        }
    }))


    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })
}

export default initializePassport