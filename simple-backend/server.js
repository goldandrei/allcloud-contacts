const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (for demo purposes)
let contacts = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     email: "john@example.com",
  //     phone: "123-456-7890",
  //     cell: "098-765-4321",
  //     full_address: "123 Main St, City, State",
  //     registration_date: "2024-01-15",
  //     age: 30,
  //     image_url: "https://via.placeholder.com/150",
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Smith",
  //     email: "jane@example.com",
  //     phone: "555-123-4567",
  //     cell: "555-987-6543",
  //     full_address: "456 Oak Ave, Town, State",
  //     registration_date: "2024-01-20",
  //     age: 25,
  //     image_url: "https://via.placeholder.com/150",
  //   },
];

let nextId = 3;

// Routes
app.get("/api/contacts", (req, res) => {
  res.json(contacts);
});

app.get("/api/contacts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const contact = contacts.find((c) => c.id === id);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ error: "Contact not found" });
  }
});

app.post("/api/contacts", (req, res) => {
  const newContact = {
    id: nextId++,
    ...req.body,
    registration_date: req.body.registration_date || new Date().toISOString().split("T")[0],
  };
  contacts.push(newContact);
  res.status(201).json(newContact);
});

app.put("/api/contacts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const contactIndex = contacts.findIndex((c) => c.id === id);
  if (contactIndex !== -1) {
    contacts[contactIndex] = { ...contacts[contactIndex], ...req.body };
    res.json(contacts[contactIndex]);
  } else {
    res.status(404).json({ error: "Contact not found" });
  }
});

app.delete("/api/contacts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const contactIndex = contacts.findIndex((c) => c.id === id);
  if (contactIndex !== -1) {
    contacts.splice(contactIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: "Contact not found" });
  }
});

// Add random contacts endpoint
app.post("/api/contacts/random", async (req, res) => {
  try {
    const response = await fetch("https://randomuser.me/api/?results=10");
    const data = await response.json();

    const newContacts = data.results.map((user) => ({
      id: nextId++,
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      phone: user.phone,
      cell: user.cell,
      full_address: `${user.location.street.number} ${user.location.street.name}, ${user.location.city}`,
      registration_date: new Date().toISOString().split("T")[0],
      age: user.dob.age,
      image_url: user.picture.large,
    }));

    contacts.push(...newContacts);
    res.json(newContacts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch random contacts" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  GET    /api/contacts`);
  console.log(`  GET    /api/contacts/:id`);
  console.log(`  POST   /api/contacts`);
  console.log(`  PUT    /api/contacts/:id`);
  console.log(`  DELETE /api/contacts/:id`);
  console.log(`  POST   /api/contacts/random`);
});
