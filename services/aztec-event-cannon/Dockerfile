ARG BASE

FROM $BASE as BUILD
WORKDIR /usr/main/services/aztec-event-cannon
RUN yarn workspaces focus @chicmoz/aztec-event-cannon
COPY . .
RUN yarn build

FROM node:20-alpine
WORKDIR /usr/main/services/aztec-event-cannon
COPY --from=BUILD /usr/main /usr/main

CMD ["yarn", "run", "start"]

