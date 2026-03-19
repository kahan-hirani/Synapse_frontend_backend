FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN mkdir -p uploads

ENV NODE_ENV=production

# Render injects PORT dynamically at runtime.
EXPOSE 10000

CMD ["npm", "start"]
