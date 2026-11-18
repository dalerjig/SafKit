FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build_with_check

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/front.conf /etc/nginx/conf.d/front.conf

COPY --from=build /app/dist /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
