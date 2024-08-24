ARG BASE
FROM $BASE as deps

WORKDIR /usr/main/services/explorer-ui

ENV SKIP_ENV_VALIDATION true

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN yarn workspaces focus @chicmoz/explorer-ui

FROM deps as build

ENV GENERATE_SOURCEMAP false

WORKDIR /usr/main/services/explorer-ui

COPY . .
COPY --from=deps /usr/main /usr/main
RUN yarn build

FROM nginx:1.21-alpine as runner

RUN sed -i '/location \//a try_files $uri $uri/ /index.html;' /etc/nginx/conf.d/default.conf
COPY --from=build /usr/main/services/explorer-ui/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
