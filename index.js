import express, { urlencoded } from 'express';
import path from 'path'
import { fileURLToPath } from 'url';
import cors from 'cors';
// import pg from 'pg';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from "passport-local";
import GoogleStrategy from 'passport-google-oauth2';
import env from 'dotenv';
import bcrypt from 'bcrypt';

const app = express();
const port = 3000;
const saltrounds = 10;


import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://hkjdhxgquhzidxbwecxb.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhramRoeGdxdWh6aWR4YndlY3hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMjQxMTYsImV4cCI6MjA2MTcwMDExNn0.1VTa0Ua6rGlc8AJZGH5FnMAFod7R_SssTLDgRqwYyDk"
const supabase = createClient(supabaseUrl, supabaseKey);

const { data, error } = await supabase.from('hello').select('*');
console.log(data);


// const db = new pg.Client({
//   host: "localhost",
//   database: "login_data",
//   password: "admin@123",
//   user: "postgres",
//   port: 5432,
// });

// db.connect();
env.config();

const dirname = path.dirname(fileURLToPath(import.meta.url));
const origin_url = "http://localhost:5173/";


// app.use(session({
//   secret: "TOPSECRET",
//   resave: false,
//   saveUninitialized: true,
// }))
app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
  resave: false,
  maxAge: 1000,
}))
// app.use(passport.initialize());
// app.use(passport.session());


app.get("/", (req, res) => {
  console.log(req.user);
  res.send("hello world message from backend "+data[0].name);

})

// app.get("/login", (req, res) => {
//   if(req.user) {
//     res.status(200).json({
//       success: true,
//       user: req.user
//     })
//   }else{
//     res.send(null);
//   }
// })

// app.get("/logout", (req, res, next) => {
//   console.log("loging out");
  
//   if(req.isAuthenticated()){
//   req.logout(function(err) {
//     if (err) {
//       return next(err);
//     }
//     res.status(200).send({success: true});
//   })
// }else {
//   res.status(200).send({success: true});
// }
// });

// app.post("/signup" , async (req, res) => {
//   // console.log(req);
//   const password = req.body.password;
//   try {
//     const result = await db.query("SELECT * FROM users WHERE name = $1",[req.body.username]);
//     console.log(result.rows.length);
//     if(result.rows.length > 0){
//       res.redirect(origin_url+'/');
//     }else{
//       bcrypt.hash(password, saltrounds, async (error, hash) => {
//         if(error){
//           console.log(error);
//         }
//         if(hash){
//           const data = await db.query("INSERT INTO users VALUES ($1, $2) RETURNING *", [req.body.username, hash]);
//           const re = {
//             displayName: data.rows[0].name,password: data.rows[0].password 
//           };
//           if(data){
//             req.login(re, (err) => {
//               console.log("hello");
//               console.log(req.user);
              
//               res.redirect(origin_url+'Home');
//             })
//           }else{
//             res.redirect(origin_url);
//           }
//         }
//       })
//     }
    
    
//   } catch (error) {
//     console.log(error);
//   }

// } )

// // app.get("/logout", (req, res) => {
// //   console.log(req);
  
// //   // if(req.user){
// //   //   console.log("loginout");
// //   try {
// //     req.logout();
// //     res.redirect(origin_url);
// //   } catch (error) {
// //     console.log(error);
    
// //   }
    
// //   //   res.redirect("http://localhost:5173/");
// //   // }else{
// //   //   res.end();
// //   // }
// // })

// app.post("/", async (req, res) => {
//   console.log(req.body);
//   const ress = await db.query("INSERT INTO users values($1, $2);", [req.body.username, req.body.password]);
//   // res.send(`hello world ${req.body.name} message from backend`);
//   res.redirect(origin_url+"Home")
// })

// app.post("/login", (req,res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     console.log(user);
//     if(user) {
//       // Authentication succeeded
//       console.log("yes");
//       res.redirect(origin_url+"Home");
//     };
//   })(req, res, next);
// })

// app.get("/auth/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     prompt: "select_account"
//   })
// )

// app.get("/auth/google/secrets",
//   passport.authenticate(
//     "google",
//     {
//       successRedirect: origin_url,
//       failureRedirect: "http://localhost:3000/"
//     } ));

// passport.use(
//   "local",
//   new Strategy(async function verify(username, password, cb) {
//     // return cb(null, username);
//     try {
//       const result = await db.query("SELECT * FROM users WHERE name = $1 ", [
//         username
//       ]);
//       if (result.rows.length > 0) {
//         const user = result.rows[0];
//         const storedHashedPassword = user.password;
//         console.log("s "+user);
//         bcrypt.compare(password, storedHashedPassword, (err, valid) => {
//           if(err){
//             console.log(err);
//             return cb(err);
//           }else{
//             if(valid){
//               return cb(null, user);
//             }else{
//               return cb(null, false);
//             }
//           }
//         })

//         // const storedHashedPassword = user.password;
//         //       bcrypt.compare(password, storedHashedPassword, (err, valid) => {
//         //         if (err) {
//         //           console.error("Error comparing passwords:", err);
//         //           return cb(err);
//         //         } else {
//         //           if (valid) {
//         //             return cb(null, user);
//         //           } else {
//         //             return cb(null, false);
//         //           }
//         //         }
//         //       });
//       } else {
//           return cb("user not found");
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   })
// );

// passport.use(
//   "google",
//   new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/secrets",
//     userprofileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
//   },async (accessToken, refreshToken, profile, cb) => {
//     console.log(profile);
//     console.log("he");
//     return cb(null, profile);
//   })
// )

// passport.serializeUser((user, cb) => {
//   cb(null, user);
// });

// passport.deserializeUser((user, cb) => {
//   cb(null, user);
// });

app.listen(port, () => {
  console.log(dirname);
  console.log(`http://localhost:${port}`)
})