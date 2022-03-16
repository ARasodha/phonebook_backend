const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status - :response-time ms - :res[content-length] :body"));

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => {
  let maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0;
  return maxId + 1;
}

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p>`
    );
});

app.get('/api/persons/:id', (request, response) => {
  let id = Number(request.params.id);
  let person = persons.find(person => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
})

app.post('/api/persons', (request, response) => {
  let body = request.body;

  if (!body.name || !body.number) {
    return response.status(404).json({ error: 'name and number must both be provided' });
  } else if (persons.map(p => p.name.toLowerCase()).includes(body.name.toLowerCase())) {
    return response.status(404).json({ error: 'name must be unique' });
  } else if (persons.map(p => p.number).includes(body.number)) {
    return response.status(404).json({ error: 'number must be unique' });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person);
  response.json(person);
})

app.delete('/api/persons/:id', (request, response) => {
  let id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
})

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
})