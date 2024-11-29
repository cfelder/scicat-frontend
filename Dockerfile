FROM node:18.18.0-alpine AS builder

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

WORKDIR /frontend
COPY package*.json /frontend/
RUN npm ci
COPY . /frontend/
RUN npx ng build

FROM nginxinc/nginx-unprivileged
COPY --from=builder /frontend/dist/ /usr/share/nginx/html/
COPY scripts/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080
