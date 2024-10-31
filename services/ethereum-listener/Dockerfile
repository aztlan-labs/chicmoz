ARG BASE

FROM $BASE as BUILD
WORKDIR /usr/main/services/ethereum-listener
RUN yarn workspaces focus @chicmoz/ethereum-listener
COPY . .
RUN yarn build

FROM node:20-alpine
WORKDIR /usr/main/services/ethereum-listener
COPY --from=BUILD /usr/main /usr/main

CMD ["yarn", "run", "start"]

