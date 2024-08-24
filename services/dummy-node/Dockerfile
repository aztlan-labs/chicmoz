ARG BASE

FROM $BASE as BUILD
WORKDIR /usr/main/services/dummy-node
RUN yarn workspaces focus @chicmoz/dummy-node
COPY . .
RUN yarn build

FROM node:20-alpine
WORKDIR /usr/main/services/dummy-node
COPY --from=BUILD /usr/main /usr/main

EXPOSE 80
CMD ["yarn", "node", "--unhandled-rejections=strict", "--enable-source-maps", "./build/index.js"]
