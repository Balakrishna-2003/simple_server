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
env.config();

import { createClient } from '@supabase/supabase-js'
import { parseArgs } from 'util';
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

const {data, error} = await supabase.from('hello').select('*');
console.log("data " +data &&  data.length);


// const db = new pg.Client({
//   host: "localhost",
//   database: "login_data",
//   password: "admin@123",
//   user: "postgres",
//   port: 5432,
// });

// db.connect();


const dirname = path.dirname(fileURLToPath(import.meta.url));
const origin_url = process.env.ORIGIN_URL+"/";


app.use(express.json())
app.use(urlencoded({ extended: true }))

app.use(cors({
  origin: process.env.ORIGIN_URL,
  methods: ['GET','POST'],
  credentials: true
}))




app.use(session({
  secret: "TOPSECRET",
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax'
  }
}))


app.use(passport.initialize());
app.use(passport.session());


app.get("/", async(req, res) => {
  try {
    
  
  const {data, err} = await supabase.from('hello').select('*').filter("username", 'eq','hello');
  console.log("data 2"+data &&  data.length);
  
  console.log("data 3"+req.user+" hello world");
  res.send(req.user+"hello world");
} catch (error) {
  console.log(error);
  
}

})

app.get("/login", (req, res) => {
  const user = req.user;
  console.log("user1 "+user);
  // res.send(req.user);
  if(req.user) {
    console.log("hello");
    res.json({success: true, user: req.user});
  }else{
    console.log("nooo");
    
    res.json({success: false, user: null});
  }
})

app.get("/logout", (req, res, next) => {
  console.log("loging out");
  
  if(req.isAuthenticated()){
  req.logout(function(err) {
    if (err) {
      console.log("logi");
      
      return next(err);
    }
    console.log("logiiiii");
    
    res.status(200).send({success: true});
  })
}else {
  console.log("failed");
  
  res.status(201).send({success: true});
}
});

app.post("/signup" , async (req, res) => {
  // console.log(req);
  const password = req.body.password;
  try {
    // const result = await db.query("SELECT * FROM users WHERE name = $1",[req.body.username]);
    const {data, err} = await supabase.from('hello').select().filter("username", 'eq', req.body.username);
    console.log('s');
    
    console.log("data 3"+data);
    if(data &&  data.length > 0){
      res.redirect(origin_url+'/');
    }else{
      bcrypt.hash(password, saltrounds, async (error, hash) => {
        if(error){
          console.log("err1"+error);
        }
        if(hash){
          // const data = await db.query("INSERT INTO users VALUES ($1, $2) RETURNING *", [req.body.username, hash]);
          const { data, error } = await supabase.from("hello").insert({username: req.body.username,password: hash}).select();
          console.log("hii "+data);
          
          const re = { 
            displayName: data[0].username,password: data[0].password 
          };
          if(data){
            req.login(re, (err) => {
              console.log("hello");
              console.log("req,user " +req.user);
              
              res.redirect(origin_url+'Home');
            })
          }else{
            res.redirect(origin_url);
          }
        }
      })
    }
    
    
  } catch (error) {
    console.log("err 2 "+error);
  }

} )

// app.get("/logout", (req, res) => {
//   console.log(req);
  
//   // if(req.user){
//   //   console.log("loginout");
//   try {
//     req.logout();
//     res.redirect(origin_url);
//   } catch (error) {
//     console.log(error);
    
//   }
    
//   //   res.redirect("http://localhost:5173/");
//   // }else{
//   //   res.end();
//   // }
// })

app.post("/", async (req, res) => {
  console.log("he "+req.body);
  // const ress = await db.query("INSERT INTO users values($1, $2);", [req.body.username, req.body.password]);
  const { data, error } = await supabase.from('hello').insert({username: req.body.username, password: req.body.password})
  // res.send(`hello world ${req.body.name} message from backend`);
  res.status(200).redirect(origin_url+"Home")
})

// app.post("/login", passport.authenticate("local", {
//   successMessage: "hello world",
//   failureMessage: "failed",
// }));

app.post("/login", (req, res, next) => {

  passport.authenticate("local", (err, user, info) => {
    console.log("yess iam here");
    
    if (err) {
      console.error("Auth error:", err);
      return res.status(500).json({ success: false, error: "Authentication failed" });
    }

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    req.login(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ success: false, error: "Login failed" });
      }

      return res.status(200).json({ success: true, user });
    });
  })(req, res, next);
});


// app.post("/login", (req,res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     console.log('us');
    
//     console.log("suer "+user);
    
//     if(user) {
//       const re = { displayName: user.username, password: user.password};
//       // Authentication succeeded
//       req.login(re, (err) => {
//         if(err) console.log("err3 "+err);
//         console.log("yes");
//         console.log("re 2 "+req.user);
//         // res.send(JSON.parse(req));
//         res.status(200).redirect(origin_url+"Home");
//         // res.send("login success");
//       })
//     }else{
//       console.log('hhjkkj');
//       // re.send("login failed");
//       res.redirect(origin_url+'Login');
//     };
//   })(req, res, next);
// })

app.get("/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account"
  })
)

app.get("/auth/google/secrets",
  passport.authenticate(
    "google",
    {
      successRedirect: origin_url,
      failureRedirect: process.env.API_URL
    } ));

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    // return cb(null, username);
    try {
      console.log('username '+username+" password "+ password);
      
      // const result = await db.query("SELECT * FROM users WHERE name = $1 ", [username]);
      console.log('sd');
      
      const { data, error } = await supabase.from('hello').select().filter('username', 'eq',username);
      console.log("data 5 "+data);
      console.log(data);
      if (data && data.length > 0) {
        const user = data[0];
        const storedHashedPassword = user.password;
        console.log("user 5"+user);
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if(err){
            console.log("err 6 "+err);
            return cb(err);
          }else{
            if(valid){
              console.log("errror");
              return cb(null, user);
            }else{
              console.log("errrdor");

              return cb(null, false);
            }
          }
        })

        // const storedHashedPassword = user.password;
        //       bcrypt.compare(password, storedHashedPassword, (err, valid) => {
        //         if (err) {
        //           console.error("Error comparing passwords:", err);
        //           return cb(err);
        //         } else {
        //           if (valid) {
        //             return cb(null, user);
        //           } else {
        //             return cb(null, false);
        //           }
        //         }
        //       });
      } else {
          return cb("user not found");
      }
    } catch (err) {
      console.log("err 7 "+err);
      return cb(err);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.API_URL+"/auth/google/secrets",
    userprofileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  },async (accessToken, refreshToken, profile, cb) => {
    console.log("profile 1 "+profile);
    console.log("he");
    return cb(null, profile);
  })
)

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log("dir "+dirname);
  console.log(`http://localhost:${port}`)
})