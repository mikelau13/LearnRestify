# LearnRestify

npm install restify

npm start


http://localhost:8080/foo?a=b

Hypermedia
http://localhost:8080/cities
http://localhost:8080/anotherroute


Versioning
curl -s localhost:8080/versioning/mike
curl -s -H 'accept-version: ~1' localhost:8080/versioning/mike
curl -s -H 'accept-version: ~3' localhost:8080/versioning/mike
