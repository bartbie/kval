GET {{host}}/api/ensembles
HTTP 200
[Captures]
first_id: jsonpath "$.data[0]._id"
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data[*]._id" exists
jsonpath "$.data" count == 2
jsonpath "$.data[0].members" count == 2
jsonpath "$.data[*].members[*].email" not exists
jsonpath "$.data[*].members[*].password" not exists
jsonpath "$.data[*].members[*]._id" exists


GET {{host}}/api/ensembles/{{first_id}}
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data._id" exists
jsonpath "$.data.members" count == 2
jsonpath "$.data.members[*]._id" exists
jsonpath "$.data.members[*].email" not exists
jsonpath "$.data.members[*].password" not exists
jsonpath "$.data.name" == "Classical Ensemble"
jsonpath "$.data.bio" == "very cool ensemble"
jsonpath "$.data.genres" count == 1


GET {{host}}/api/ensembles/92d7f38584bf0ce462a28470
HTTP 200
[Asserts]
jsonpath "$.success" == false


# setup

POST {{host}}/api/auth/login
{
    "email": "sarah@example.com",
    "password": "$2b$10$X9f4VcJ2PMxPZUyK9OqB6O6P2Z8bGJ/9L4M8J9K9X9X9X9X9X9"
}
HTTP 201
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data.token" exists
[Captures]
auth_token: jsonpath "$.data.token"


GET {{host}}/api/me
Authorization: Bearer {{auth_token}}
HTTP 200
[Captures]
user_id: jsonpath "$.data._id"

POST {{host}}/api/auth/login
{
    "email": "test@test.com",
    "password": "test"
}
HTTP 201
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data.token" exists
[Captures]
second_token: jsonpath "$.data.token"


GET {{host}}/api/me
Authorization: Bearer {{second_token}}
HTTP 200
[Captures]
second_user: jsonpath "$.data._id"


# Create ensemble
POST {{host}}/api/ensembles
Authorization: Bearer {{auth_token}}
{
    "name": "Test Ensemble",
    "bio": "Test Description",
    "genres": ["rock", "metal", "jazz"]
}
HTTP 201
[Captures]
ensemble_id: jsonpath "$.data._id"
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data.name" == "Test Ensemble"
jsonpath "$.data.members" isCollection
jsonpath "$.data.members[0]" == {{user_id}}
jsonpath "$.data.createdBy" == {{user_id}}

GET {{host}}/api/ensembles
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data[*].name" includes "Test Ensemble"

GET {{host}}/api/ensembles/{{ensemble_id}}
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data.name" == "Test Ensemble"
jsonpath "$.data.createdBy" == {{user_id}}
jsonpath "$.data.members" count == 1
jsonpath "$.data.members[0]._id" == {{user_id}}

# Update ensemble
PATCH {{host}}/api/ensembles/{{ensemble_id}}
Authorization: Bearer {{auth_token}}
{
    "name": "Updated Ensemble",
    "bio": "Updated Description"
}
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data.name" == "Updated Ensemble"
jsonpath "$.data.bio" == "Updated Description"

# Test unauthorized access
PATCH {{host}}/api/ensembles/{{ensemble_id}}
{
    "name": "Should Fail"
}
HTTP 401

# Join ensemble (second user)

POST {{host}}/api/ensembles/{{ensemble_id}}/join
Authorization: Bearer {{second_token}}
HTTP 201
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data.members" isCollection
jsonpath "$.data.members" count == 2
jsonpath "$.data.members[*]" includes {{second_user}}

# Leave ensemble
POST {{host}}/api/ensembles/{{ensemble_id}}/leave
Authorization: Bearer {{second_token}}
HTTP 201
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data.members" count == 1
jsonpath "$.data.members[0]" == {{user_id}}

# Test invalid ID
GET {{host}}/api/ensembles/invalid_id
HTTP 400

# Disband ensemble
DELETE {{host}}/api/ensembles/{{ensemble_id}}
Authorization: Bearer {{auth_token}}
HTTP 200
[Asserts]
jsonpath "$.success" == true

# Verify ensemble is gone
GET {{host}}/api/ensembles/{{ensemble_id}}
HTTP 200
[Asserts]
jsonpath "$.success" == false
