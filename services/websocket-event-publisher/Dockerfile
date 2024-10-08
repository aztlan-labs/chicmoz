ARG BASE

FROM $BASE as BUILD
WORKDIR /usr/main/services/websocket-event-publisher
RUN yarn workspaces focus @chicmoz/websocket-event-publisher
COPY . .
RUN yarn build

FROM node:20-alpine
WORKDIR /usr/main/services/websocket-event-publisher
COPY --from=BUILD /usr/main /usr/main

EXPOSE 80
CMD ["yarn", "run", "start"]

