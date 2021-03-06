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

+ token-based authenticate
  + dependency: jsonwebtoken
+ login router
  + check password, sign a payload and send if correct
  + otherwise return error response 
+ .env: add secret
+ hook up in app

# 4.19

+ blog router, in post route, 
  + verify authorization header, 
  + find user using decoded payload,
  + return error response if token is missing, or verification fails
  + else, save blog with decoded user

# 4.20

+ refactor token isolation / getter into a middleware
  + remove getTokenFrom helper form blog router
  + add middleware  `tokenExtractor`
    + set request.token field
  + hookup middleware and read `req.token`

# 4.21

+ blog delete route
  + authorize only creator of the blog for deletion
    + alternatives
      sign payload of blog/:id and compare tokens
      + Or decode token and compare decoded user ids
  Note: in bd ObjectId stored is an object, not string. First parse toString() to compare with a string id.
  + 401 otherwise

# 4.22

Tests
  
+ helper
  + blogs w user ids
  + users w blog ids
+ add new blogs w token authorization (fix old tests)
  + get token for a user (via login)
  + set authorization header to a token
  + post
+ new test - cannot create blog if authorization is missing (error 401)
+ modify delete test accounting for authorization
+ add new test - cannot delete other's blog




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


