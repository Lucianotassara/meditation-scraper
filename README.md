# meditation-scraper
A tiny scraper for getting some daily meditations from the web and posting them to an API authenticating through JWT.

To use this repo, pull source code:

`git clone https://github.com/Lucianotassara/meditation-scraper.git`

install dependencies with `npm install`

configure environment variables by renaming `.env.sample` to `.env` and fulfill with your virables before runing the script:

```
SCRAPE_URL={ URL to scrape }

RVC_API_PROTOCOL={ http | https }
RVC_API_HOST={ IP or hostname where rvc-api is runing}
RVC_API_PORT={ Port where rvc-api is runing}

EVIDA_API_PROTOCOL={ http | https }
EVIDA_API_HOST={ IP or hostname where the receiving information API is runing}
EVIDA_API_PORT={ Port where the receiving information API is runing}
EVIDA_API_EMAIL={ email or username to authenticate on the receiving information API }
EVIDA_API_PASSWD={ password to authenticate on the receiving information API }
```

`RVC_API_PROTOCOL`, `RVC_API_HOST` and `RVC_API_PORT` makes reference to the running instance of `rvc-api` available on my github repo -> https://github.com/Lucianotassara/rvc-api

and run wht `npm test` for debugging and or `npm start`

