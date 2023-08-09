# EKINOKS - TASK

Online Shopping App that customers can buy products

## Tech Stack
- Node JS
- Typescript JS
- Express JS
- PostgreSQL
- Docker

## Installation and Dependencies
- Download project repository

- Install [Docker](https://www.docker.com/) to your device

- Sign up [Postman](https://www.postman.com/)

- Change name env_example file to .env

```bash
# Run this command on terminal in project main directory, same level with docker-compose.yml file.

docker-compose -f docker-compose.yml up -d --build

```
- After finish your project will be ready to use and dbseeder create example data in your database.
## Usage
- Login to your postman account and import postman collection file that you downloaded in project repository file

- After login you can use example user accounts
```python
# admin user
{
"email":"admin@example.com",
"password":"password"
}
# normal user
{
"email":"normal@example.com",
"password":"password"
}
```
- After login successfully you will obtain access token like below and this token is expired in 1 hour
```
# Example token
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJub3JtYWxAZXhhbXBsZS5jb20iLCJpc19hZG1pbiI6ZmFsc2UsImlhdCI6MTY5MTQ0MzcxMSwiZXhwIjoxNjkxNDQ3MzExfQ.p3gETDgo2v8nsKGl3W4qtY7wvDlJKXlyZX2_WcD_Zsw
```
- After selecting the URL to request, this token you can come to the Authorization tab, select the Bearer Token, paste it into the field corresponding to the Token and use it.

### Endpoints
```
# User
- http://localhost:3000/login (post)
- http://localhost:3000/register (post)
- http://localhost:3000/profile (get)

# Product
- http://localhost:3000/products (get, post, delete, patch)

# Order
- http://localhost:3000/orders (get, post, delete, patch, detail)
```
### Restrictions
- You can make every request with admin user token.
- You can make every request with normal user token except manage product (create, update, delete)
- You can not add new admin user but if you want you can add normal user

### Design and Logic
- Authorization system (admin, client)
- Database relationships ( user <--> order, product <--> order )
- Node JS and Database management with docker
- Request validation for get clean user informations
- TypeORM library for SQL managements
- Bearer Token for Auth security
- Meaningful exceptions and Structured response
- Logical logs for users
- Clean code and code explanaiton
- Easy test with postman collection
