# MessyORM

**MessyORM** is a lightweight ORM for Node.js built on top of the Knex query builder. It provides a simple and intuitive API for interacting with your database. **MessyORM** currently supports multiple database clients, but you'll need to install the specific driver for your database manually.

## Features

- Simple and easy-to-use API
- Supports multiple databases via Knex
- Flexible model configuration
- Future migration to TypeScript

## Installation

Before using **MessyORM**, ensure that you've installed the necessary database drivers. For example, to use MySQL:

```bash
npm install mysql2
  first example 
    class Customers extends BaseModel {
        static table = 'customers'
        static columns = ['state','country']
        static config = {
            client: 'mysql2',
            connection: {
              host: '127.0.0.1',
              port: 3306,
              user: 'your_username',
              password: 'your_password',
              database: 'your_database',
            },
        }
    } 
    const data = await Customers.getAll({limit:2})
    console.log(data)
you can not include columns static fields array it will get all columns
second example 
  class Orders extends BaseModel {
    static table = 'orders';
     static columns = ['state','country']
        static config = {
            client: 'mysql2',
            connection: {
              host: '127.0.0.1',
              port: 3306,
              user: 'your_username',
              password: 'your_password',
              database: 'your_database',
            },
        }
  }
  const orderData = await Orders.getOne({ where: { orderNumber: 10103 } });
  console.log(orderData);