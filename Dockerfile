FROM node:alpine
WORKDIR ./app
COPY ./app .
RUN ["node","server.mjs"]

CMD ["node","server.mjs"]
EXPOSE 8001
