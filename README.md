# LearnRestify

npm install restify
npm install typescript
npm install ts-node
npm i @types/node

npm start


http://localhost:8080/foo?a=b


http://localhost:8080/api/v1/cities/Toronto


Versioning
curl -s localhost:8080/versioning/mike
curl -s -H 'accept-version: ~1' localhost:8080/versioning/mike
curl -s -H 'accept-version: ~2' localhost:8080/versioning/mike
curl -s -H 'accept-version: ~4' localhost:8080/versioning/mike


cache-memory
npm install cache-memory
http://localhost:8080/cache/2
http://localhost:8080/cache/3


dotenv
npm install dotenv
add .env file