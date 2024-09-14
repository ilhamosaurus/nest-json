FROM node:20.15.0 AS builder

WORKDIR /app

COPY package*.json ./
COPY /prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

FROM node:20.15.0-alpine3.20 AS production

WORKDIR /app

RUN apk update && apk add shadow
RUN groupadd -g 1001 appgroup && useradd -u 1001 -r -g appgroup -G appgroup appuser

COPY package*.json ./
COPY /prisma ./prisma

RUN npm install --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env .

RUN ls -lR /app
RUN chown -R appuser:appgroup /app
RUN chmod -R +x /app/dist

USER appuser

EXPOSE 6754

CMD [ "npm", "run", "start:migrate:prod" ]

