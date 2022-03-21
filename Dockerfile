FROM node:17.7.2-alpine as build-base

WORKDIR /build

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package due to Puppeteer compatibility with Docker.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY package.json package-lock.json ./

FROM build-base as prod-deps-image

RUN npm install --production

FROM prod-deps-image as build-image

RUN  npm install
COPY . ./
RUN npm run build

FROM node:17.7.2-alpine as runtime

WORKDIR /app

COPY --from=prod-deps-image /build/node_modules/ ./node_modules
COPY --from=build-image /build/dist/ ./dist

# https://github.com/puppeteer/puppeteer/blob/v7.1.0/docs/troubleshooting.md#running-on-alpine
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

CMD [ "node", "/app/dist/index.js" ]
