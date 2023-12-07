FROM ghcr.io/puppeteer/puppeteer:19.4.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY prackage*.json ./
RUN npm ci
COPY . .
CMD [ "node","index.js" ]