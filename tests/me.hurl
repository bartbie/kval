# {
#   email: "sarah@example.com",
#   password: "$2b$10$X9f4VcJ2PMxPZUyK9OqB6O6P2Z8bGJ/9L4M8J9K9X9X9X9X9X9",
#   firstName: "Sarah",
#   lastName: "Smith",
#   age: 32,
#   bio: "Classical violinist",
#   instruments: ["violin"],
#   genres: ["classical"],
#   createdAt: new Date()
# },
# Login with valid credentials
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
token: jsonpath "$.data.token"


GET {{host}}/api/me
Authorization: Bearer {{token}}
HTTP 200
[Captures]
my_id: jsonpath "$.data._id"
[Asserts]
# {
#     _id: string;
#     firstName: string;
#     lastName: string;
#     age: number;
#     bio: string;
#     instruments: string[];
#     genres: string[];
#     ensembles: {
#         _id: string;
#         genres: string[];
#         name: string;
#         createdBy: string;
#         members: string[];
#     }[];
# }
jsonpath "$.success" == true
jsonpath "$.data._id" exists
jsonpath "$.data.email" == "sarah@example.com"
jsonpath "$.data.age" == 32
jsonpath "$.data.bio" == "Classical violinist"
jsonpath "$.data.genres" count == 1
jsonpath "$.data.ensembles" count == 2
jsonpath "$.data.ensembles[*]._id" exists
jsonpath "$.data.ensembles[0].members" count == 2
jsonpath "$.data.ensembles[1].members" count == 1
jsonpath "$.data.ensembles[1].createdBy" == {{my_id}}


PATCH {{host}}/api/me
Authorization: Bearer {{token}}
# {
#     firstName?: string | undefined;
#     lastName?: string | undefined;
#     age?: number | undefined;
#     bio?: string | undefined;
#     instruments?: string[] | undefined;
#     genres?: string[] | undefined;
# }
{
    "bio": "new awesome bio",
    "email": "thiswillbestrippedeitherway"
}
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data.bio" == "new awesome bio"
jsonpath "$.data.email" == "sarah@example.com"


GET {{host}}/api/me
Authorization: Bearer {{token}}
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data._id" exists
jsonpath "$.data.email" == "sarah@example.com"
jsonpath "$.data.age" == 32
jsonpath "$.data.bio" == "new awesome bio"
jsonpath "$.data.genres" count == 1
jsonpath "$.data.ensembles" count == 2
jsonpath "$.data.ensembles[*]._id" exists
jsonpath "$.data.ensembles[0].members" count == 2
jsonpath "$.data.ensembles[1].members" count == 1
jsonpath "$.data.ensembles[1].createdBy" == {{my_id}}


PATCH {{host}}/api/me
# {
#     firstName?: string | undefined;
#     lastName?: string | undefined;
#     age?: number | undefined;
#     bio?: string | undefined;
#     instruments?: string[] | undefined;
#     genres?: string[] | undefined;
# }
{
    "bio": "new awesome bio"
}
HTTP 401
