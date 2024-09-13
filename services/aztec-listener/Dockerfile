ARG BASE

FROM $BASE as BUILD
WORKDIR /usr/main/services/aztec-listener
RUN yarn workspaces focus @chicmoz/aztec-listener
COPY . .
RUN yarn build

FROM node:20-alpine
WORKDIR /usr/main/services/aztec-listener
COPY --from=BUILD /usr/main /usr/main

EXPOSE 80
CMD ["yarn", "node", "--unhandled-rejections=strict", "--enable-source-maps", "./build/src/index.js"]
