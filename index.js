const { response } = require('express')
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')


app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('build'))

let people = [
      {
        "id": 1,  
        "name": "Arto Hellas",
        "number": "040-123456",
      },
      {
        "id": 2,  
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
      },
      {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345",
      },
      {
        "id": 4,  
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
      }
    ]

app.get('/api/people', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

app.get('/api/people/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = people.find(person => person.id === id)
    if(person){
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/api/info', (req, res) => {
    const html = `<p>Phonebook has info for ${people.length} people</p> <p>${new Date()}</p>`
    res.send(html)
})

const generateId = () => {
    return Math.floor(Math.random() * (1000 - 1) + 1)
}

app.post('/api/people', (req, res) => {
    const body = req.body

    if(!body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    } else if(!body.number){
        return res.status(400).json({ 
            error: 'number missing' 
        })
    } else if(people.some(p => p.name === body.name)){
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    people = people.concat(person)
    
    res.json(person)
})

app.delete('/api/people/:id', (req, res) => {
    const id = Number(req.params.id)
    people = people.filter(person => person.id !== id)
    res.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})