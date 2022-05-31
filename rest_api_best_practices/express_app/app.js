const express = require('express');
const morgan = require('morgan');
const fs = require('fs');

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

const users = JSON.parse(fs.readFileSync(`${__dirname}/database.json`));

// Routes

// app.get('/api/v1/users', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });

app.post('/api/v1/users', (req, res) => {
  const newId = users[users.length - 1].id + 1;
  const newUser = { id: newId, ...req.body };

  users.push(newUser);
  fs.writeFile(`${__dirname}/database.json`, JSON.stringify(users), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  });
});

app.put('/api/v1/users/:id', (req, res) => {
  const { id } = req.params;
  // code to update a user...
  res.status(200).json({
    status: 'success',
    data: {
      user: '<Updated user info here>',
    },
  });
});

app.delete('/api/v1/users/:id', (req, res) => {
  const { id } = req.params;
  // code to delete a user...
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

app.get('/api/v1/users/:id/name', (req, res) => {
  const { id } = req.params;

  // checks if id for a user exists
  const user = users.find((el) => el.id === +id);
  if (!user) return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  const name = users[id].first_name + ' ' + users[id].last_name;
  res.status(200).json({
    status: 'success',
    data: {
      name,
    },
  });
});

app.get('/api/v1/users', (req, res) => {
  let { first_name, page_number } = req.query;
  if (!page_number) page_number = 1;

  let results = [...users];

  if (first_name) results = results.filter((el) => el.first_name === first_name);
  const page_size = 25;
  results = results.slice((page_number - 1) * page_size, page_number * page_size);

  res.status(200).json({
    status: 'success',
    results: results.length,
    data: {
      users: results,
    },
  });
});

// Server
app.listen(3000, () => console.log('Server running'));
