FROM node:lts-alpine3.14 as builder

WORKDIR /app

COPY . /app

RUN npm ci
RUN npm run build
RUN npm prune --production


FROM node:lts-alpine3.14 as production

WORKDIR /app

EXPOSE 8000

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/envs ./envs
COPY --from=builder /app/ormconfig.json ./ormconfig.json

CMD ["node", "dist/src/main"]