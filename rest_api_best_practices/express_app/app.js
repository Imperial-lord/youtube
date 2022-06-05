const express = require('express');
const morgan = require('morgan');

const fs = require('fs');

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

const users = JSON.parse(fs.readFileSync(`${__dirname}/database.json`));

// Route
// app.get('/users', (req, res) => {
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
  const user = { id: newId, ...req.body };

  users.push(user);

  fs.writeFile(`${__dirname}/database.json`, JSON.stringify(users), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  });
});

app.put('/api/v1/users/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);

  res.status(200).json({
    status: 'success',
    data: {
      user: '<Updated user info>',
    },
  });
});

app.delete('/api/v1/users/:id', (req, res) => {
  res.status(204).json({
    status: 'success',
    data: {
      user: null,
    },
  });
});

app.get('/api/v1/users/:id/name', (req, res) => {
  const { id } = req.params;

  // check if an user exists for a given id
  const user = users.find((el) => el.id === +id);

  if (!user) return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  const name = users[id - 1].first_name + ' ' + users[id - 1].last_name;

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
app.listen(3000, () => console.log('Server is running!'));
