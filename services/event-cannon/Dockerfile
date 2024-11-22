ARG BASE

FROM $BASE as BUILD
WORKDIR /usr/main/services/event-cannon
RUN yarn workspaces focus @chicmoz/event-cannon
COPY . .
RUN yarn build

FROM node:20-alpine
WORKDIR /usr/main/services/event-cannon
COPY --from=BUILD /usr/main /usr/main

CMD ["yarn", "run", "start"]

