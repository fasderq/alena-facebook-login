FROM node:10-alpine 
WORKDIR /build

COPY package.json .
COPY yarn.lock .

RUN yarn install \
  && yarn cache clean

COPY . .
ENV NODE_ENV=production

RUN yarn build

# FROM alpine:3.7

# VOLUME  /usr/share/facebook-login
# WORKDIR /usr/share/facebook-login

# COPY --from=builder /build/dist /usr/share/facebook-login

CMD ["/bin/ls", "/usr/share/facebook-login"]

