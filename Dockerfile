# Altyapı oluşturma
FROM node:14 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Uygulama çalıştırma
FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

# .env dosyasını kopyala
COPY .env ./

# Derleme işleminden gerekli dosyaları kopyala
COPY --from=build /app/dist ./dist

# Express ve diğer bağımlılıkları ekleyelim
RUN npm install express body-parser pg dotenv ts-node @types/pg @types/node @types/express @types/body-parser

EXPOSE 3000
CMD ["npm", "start"]
