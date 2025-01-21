GET {{host}}/api/users
HTTP 200
[Captures]
first_id: jsonpath "$.data[0]._id"
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data[*]._id" exists
jsonpath "$.data[*].email" not exists
jsonpath "$.data[*].password" not exists
jsonpath "$.data[1].age" == 32
jsonpath "$.data[0].genres" count == 2
jsonpath "$.data[1].ensembles" count == 2
jsonpath "$.data[1].ensembles[0].members" count == 2

GET {{host}}/api/users/{{first_id}}
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data._id" exists
jsonpath "$.data.password" not exists
jsonpath "$.data.firstName" == "John"
jsonpath "$.data.lastName" == "Doe"
jsonpath "$.data.age" == 28
jsonpath "$.data.genres" count == 2
jsonpath "$.data.instruments" count == 2
jsonpath "$.data.ensembles" count == 1
jsonpath "$.data.ensembles[0].members" count == 2
jsonpath "$.data.ensembles[0].createdBy" == {{first_id}}
jsonpath "$.data.ensembles[0].genres" count == 1


GET {{host}}/api/users/92d7f38584bf0ce462a28470036cb4d9d71eb0437842c64
HTTP 200
[Asserts]
jsonpath "$.success" == false
