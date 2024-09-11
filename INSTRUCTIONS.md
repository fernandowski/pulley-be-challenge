# Local Development

To start Local Server for development. This is usually faster.
**Dependencies**
- yarn v1.22.21
- node 21.6.1
- npx v10.2.4
```
yarn dev
```

# Docker environment

**Backend**

To start the backend app in docker environment and should not be used for development.
```
docker-compose up --build be
```

**Frontend**
```
docker load < captrivia-fe-amd64.tar && docker-compose up fe
```
