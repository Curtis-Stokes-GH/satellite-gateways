# Satellite gateway project
Simple example project using django rest framework and react.

Both projects are in the same repository for simplicties sake and instructions for each can be found in README the corresponding project folders. Local dev deployment is the only thing currently supported but ideally both would
be served from the same origin via nginx reverse proxying or similar, especially when using session users.

The projects are well tested but a few frontend components are missing due to time constraints

[React frontend](./frontend/README.md)
[Django backend](./backend/README.md)


## Existing user credentials
User credentials for provided database to see the application. The data model is empty except
for this user

admin user:
```
username: admin
password: SomePassword1!
```

## Ownership model and auth
As part of getting familiar django a simple session auth is implemented that will persist
refreshes on the frontend. This is done in the simplest manner possible (although it was not
a strict requirement). The base user has been extended for this and we just make admin's
'is_superuser'.

In order to scope satellites to operators correctly again a very simple data model was employed
where both a satellite and operator belong to a 'company' and this is used for query sets and
permission checks where there is a mixed model (i.e not only admin). Admins are not part of a company
and have site wide access, it would be trivial to make them also scoped to certain elements
