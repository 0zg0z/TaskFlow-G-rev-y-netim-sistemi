const express = require('express');
const app = express();
const port = 3000;
const taskRouter = require('./routes/tasks');
const projectsRouter = require('./routes/projects');
const employeeRouter = require('./routes/employees');

app.use(express.json());

app.use('/tasks', taskRouter);

app.use('/employees',employeeRouter);

app.use('/projects', projectsRouter);


app.use('/projects/:projectId/tasks', taskRouter);

app.use('/employees/:employeeId/tasks', taskRouter);


app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});