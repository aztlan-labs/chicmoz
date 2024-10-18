ARG BASE
FROM $BASE as deps

WORKDIR /usr/main/services/explorer-ui

ENV SKIP_ENV_VALIDATION true

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ARG VITE_API_URL
ENV VITE_API_URL $VITE_API_URL

ARG VITE_WS_URL
ENV VITE_WS_URL $VITE_WS_URL

ARG VITE_DISCORD_URL
ENV VITE_DISCORD_URL $VITE_DISCORD_URL

ARG VITE_GITHUB_URL
ENV VITE_GITHUB_URL $VITE_GITHUB_URL

ARG VITE_X_URL
ENV VITE_X_URL $VITE_X_URL

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
