// esto sirve para crear un servidor JSON con autenticación simulada, donde se pueden registrar, iniciar sesión y cerrar sesión usuarios, así como obtener el perfil del usuario autenticado.

import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';

// hacemos un const para obtener la ruta del directorio actual, ya que estamos usando módulos ES6 
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '..', 'src', 'data', 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Simular autenticación con sesión en memoria
let sessionUser = null;

server.post('/login', (req, res) => {
  const { email, password } = req.body;
  const db = router.db;
  const user = db.get('users').find({ email, password }).value();
  if (!user) {
    return res.status(401).json({ error: 'Las credenciales no coinciden.' });
  }
  sessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
  res.json(sessionUser);
});

server.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const db = router.db;
  if (db.get('users').find({ email }).value()) {
    return res.status(400).json({ error: 'Ya existe una cuenta con ese correo.' });
  }
  const maxId = db.get('users').maxBy('id').value() || 0;
  const newUser = {
    id: maxId + 1,
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  db.get('users').push(newUser).write();
  sessionUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt,
  };
  res.json(sessionUser);
});

server.post('/logout', (req, res) => {
  sessionUser = null;
  res.json({ ok: true });
});

server.get('/profile', (req, res) => {
  if (!sessionUser) return res.status(401).json({ error: 'No autenticado.' });
  res.json(sessionUser);
});

server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`API Admin SENA corriendo en http://localhost:${PORT}`);
});