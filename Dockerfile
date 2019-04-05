FROM node:lts-alpine

LABEL maintainer="levshino@gmail.com"
LABEL description="Simple and fast proxy to bypass CORS issues during prototyping against existing APIs"

RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN chmod +x ./bin/corsyusha.js
RUN yarn install

EXPOSE 8118

ENTRYPOINT [ "./bin/corsyusha.js" ]
