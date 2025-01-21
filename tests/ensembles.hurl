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
jsonpath "$.data.genres" count == 1


GET {{host}}/api/ensembles/92d7f38584bf0ce462a28470036cb4d9d71eb0437842c64
HTTP 200
[Asserts]
jsonpath "$.success" == false
