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

COPY --chown=appuser:appgroup package*.json ./ 
COPY --chown=appuser:appgroup /prisma ./prisma

RUN npm install --only=production

COPY --chown=appuser:appgroup --from=builder /app/dist ./dist
COPY --chown=appuser:appgroup --from=builder /app/.env .


RUN ls -lR /app
# the line after this didnot work
RUN chown -v -R appuser:appgroup /app
RUN chmod -R +x /app/dist

USER appuser

EXPOSE 6754

CMD [ "npm", "run", "start:migrate:prod" ]

