FROM node:alpine AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --pure-lockfile

COPY . .

RUN yarn build
# Stage 2: Run the application
FROM node:alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/yarn.lock ./

RUN yarn install --production --pure-lockfile

USER node

ENV NODE_ENV=production

EXPOSE 8000

CMD ["node", "dist/index.js"]
