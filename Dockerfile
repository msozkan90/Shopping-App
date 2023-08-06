FROM node:14 AS build

# Set the working directory inside the container
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


FROM node:14

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production


COPY .env ./
COPY --from=build /app/dist ./dist

RUN npm install express body-parser pg dotenv ts-node bcrypt jsonwebtoken express-validator typeorm @types/pg @types/node @types/express @types/body-parser @types/bcrypt  @types/jsonwebtoken


EXPOSE 3000
CMD ["npm", "start"]
