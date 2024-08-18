# messyorm
messyorm is Node.js orm based on knex querybuild
# need to install mysql2,pg and etc driver manually.
# In near future I will change it to  typescript.
# usage by example 
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