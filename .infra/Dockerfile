# Etapa de construcción para la aplicación
FROM node:22 AS builder
WORKDIR /app
COPY ./ ./
RUN npm install ci
RUN npm run build

# Etapa final
FROM node:22-alpine
COPY --from=builder /app/dist/apps/api /app

ENV PORT=3000
EXPOSE ${PORT}


ENV NODE_ENV='production'
ENV HOST='http://127.0.0.1'

ENV DATABASE_URL=''
ENV DATABASE_NAME=''

ENV JWT_SECRET=''
ENV JWT_EXPIRES_IN=''

ENV MAIL_HOST=''
ENV MAIL_PORT=''
ENV MAIL_USER=''
ENV MAIL_PASS=''

CMD ["node", "/app/index.js"]