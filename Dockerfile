FROM node:12.14.0-alpine AS INSTALLER

ENV TZ "Asia/Tokyo"
ENV NODE_ENV "production"
ENV PORT 3000

WORKDIR /workdir

COPY ./package.json      /workdir/package.json
COPY ./yarn.lock         /workdir/yarn.lock

RUN yarn install --production

FROM node:12.14.0-alpine

ENV TZ "Asia/Tokyo"
ENV NODE_ENV "production"
ENV PORT 3000

WORKDIR /workdir

COPY --from=INSTALLER /workdir/node_modules node_modules

COPY ./dist           /workdir/dist
COPY ./lib            /workdir/lib
COPY ./package.json   /workdir/package.json

CMD ["node", "lib/server.js"]
