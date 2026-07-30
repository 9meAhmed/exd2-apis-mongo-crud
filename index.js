const express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());


var resData = {
  todos: [
    { id: 1, completed: false, todo: 'Rice', category: 'Grains', price: 3.99 },
    { id: 2, completed: false, todo: 'Milk', category: 'Dairy', price: 2.49 },
    { id: 3, completed: false, todo: 'Eggs', category: 'Dairy', price: 4.29 },
    { id: 4, completed: false, todo: 'Bread', category: 'Bakery', price: 2.99 },
    { id: 5, completed: false, todo: 'Apples', category: 'Fruits', price: 3.49 },
    { id: 6, completed: false, todo: 'Bananas', category: 'Fruits', price: 1.99 },
    { id: 7, completed: false, todo: 'Chicken Breast', category: 'Meat', price: 7.99 },
    { id: 8, completed: false, todo: 'Tomatoes', category: 'Vegetables', price: 2.79 },
    { id: 9, completed: false, todo: 'Onions', category: 'Vegetables', price: 1.89 },
    { id: 10, completed: false, todo: 'Pasta', category: 'Pantry', price: 2.19 }
  ]
};

const getMaxRecordId = () => {
  if (resData.todos.length === 0) {
    return 0;
  } else {
    const sortedItems = resData.todos.sort((a, b) => {
      return a.id - b.id;
    });
    return sortedItems[sortedItems.length - 1].id;
  }
}

app.get('/products', (req, res) => {
  res.json(resData);
  res.status(200).end();
});

app.get('/products/:id', (req, res) => {

  const productId = req.params.id;

  if (productId) {
    const product = resData.todos.find(item => item.id === parseInt(productId));
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } else {
    res.status(400).json({ message: 'Invalid product ID' });
  }
});

app.post('/products', (req, res) => {


  const payload = req.body;

  const newProduct = {
    id: getMaxRecordId() + 1,
    completed: false,
    ...payload
  }

  resData.todos.push(newProduct);

  res.json(newProduct).status(200);

});

app.delete('/products/:id', (req, res) => {

  const productId = req.params.id;

  if (productId) {
    const productIndex = resData.todos.findIndex(item => item.id === parseInt(productId));
    if (productIndex !== -1) {
      resData.todos.splice(productIndex, 1);
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } else {
    res.status(400).json({ message: 'Invalid product ID' });
  }
});

app.put('/products/:id', (req, res) => {
});



const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});