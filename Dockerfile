FROM node:20-alpine

RUN apk add --no-cache libc6-compat
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps --include=dev

COPY . .
RUN npm run build

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs \
 && adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000
CMD ["npm", "run", "start"]
