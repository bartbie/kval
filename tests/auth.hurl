# Register a new user
POST http://localhost:3000/auth/signup
{
    "email": "testuser@test.com",
    "password": "Password123123123$",
    "firstName": "John",
    "lastName": "Malkovich"
}
HTTP 201
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data.token" exists

# Login with valid credentials
POST http://localhost:3000/auth/login
{
    "email": "testuser@test.com",
    "password": "Password123123123$"
}
HTTP 201
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data.token" exists
[Captures]
token: jsonpath "$.data.token"

# Login with invalid credentials
POST http://localhost:3000/auth/login
{
    "email": "wronguser@test.com",
    "password": "wrongpass"
}
HTTP 201
[Asserts]
jsonpath "$.success" == false
jsonpath "$.error" == "Email doesn't exist!"

# Login with invalid credentials
POST http://localhost:3000/auth/login
{
    "email": "testuser@test.com",
    "password": "wrongpass"
}
HTTP 201
[Asserts]
jsonpath "$.success" == false
jsonpath "$.error" == "Wrong password!"

# Access protected route with token
GET http://localhost:3000/healthcheck/protected
Authorization: Bearer {{token}}
HTTP 200

# Access protected route without token
GET http://localhost:3000/healthcheck/protected
HTTP 401
