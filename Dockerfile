ARG NODE_VERSION=22.8.0
ARG PNPM_VERSION=10.6.1

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm@${PNPM_VERSION}
RUN pnpm install

COPY . .
RUN pnpm build


# docker run -d --name my-app-container my-sveltekit-app
# docker exec -it my-app-container /bin/sh

# RUN THIS FOR INSPECTING THE FILES
# RUN apk add --no-cache lf
# Keep the container running for inspection
# CMD ["tail", "-f", "/dev/null"]

FROM nginx:stable-alpine3.17 AS final
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 4321
