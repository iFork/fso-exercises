TODO:

# 4.15
create new users
  + model
    + username, name, passwordHash
    + toJSON - remove passwordHash
  + User controller
    + POST api/users
      + dependency bcrypt
      + bcrypt passwordHash
    + GET api/users
    + Hook up to app

# 4.16

user schematype validation
  + username:
    + required, minlength 3
    + unique (use mongoose unique validator)
  + password:
    + required, minlength 3
    + NOTE: password validation is outside of mongoose, in a router since db schema does not include it
  + error code and message
    + 400? bad request, reason message (path required, not unique, etc.)
  + test
    + invlid users cannot be created, verify error code, msg

# 4.17

+ blog model
  + user (author)
+ blog post
  + arbitrary user (found first) is designated as author
  + populate user
+ blog get /
  + populate user
+ user model
  + blogs []
+ user get /
  + populate blog
[TODO: change db initialization to implement doc links and test ]

# 4.18

token-based authenticate
  dependency: jsonwebtoken
login router
  check password, sign a payload and send if correct
  otherwise return error response 

# 4.19

blog router, in post route, 
  verify authorization header, 
  find user using decoded payload,
  return error response if token is missing, or verification fails
  else, save blog with decoded user

# 4.20

refactor token isolation / getter into a middleware
  remove getTokenFrom helper form blog router
  add middleware  `tokenExtractor`
    set request.token field
  hookup middleware and read `req.token`

# Further Questions

mongoose
What `const User = / module.exports = / mongoose.model('', schema)` returns that we export and use like `new User()`

supertest
how supertest wraps app? what it can wrap? what can be passed in as an app? 
`const api = supertest(app);`
As a result, app routers/http verbs (post, get) become available and othe superagent functions with some `.expect(statusCode | header, headerValue)`

execution of supertest
`api.post(path).send(data)[.type('json')]
.expect(statusCode).expect(header ..)`
How does it starts execution once .expect() is hooked up? without it do we need to pass some special `executeRequest()` method (to run request per superagent)?


