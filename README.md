## Start Cassandra

```bash
docker-compose up -d
```

## Node install

```bash
npm install
```

## Cassandra Keyspace table users 資料初始

```bash
npm run db_create
npm start
```

## API

```bash
# get user list
curl -X GET localhost:3000/api/users

# get user By username
curl -X GET localhost:3000/api/users/username1

# add user
curl -X POST -H "Content-Type: application/json" localhost:3000/api/users -d '{"username": "username99", "email": "email@gmail.com", "name": "name99", "password": "password99"}'

# delete user
curl -X DELETE localhost:3000/api/users/username99

# update user
curl -X POST -H "Content-Type: application/json" localhost:3000/api/users/username1 -d '{"email": "newEmail@gmail.com", "name": "newName"}'

```
