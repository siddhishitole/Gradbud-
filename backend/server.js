const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// In-memory "databases" (for example only)
const users = [
  { id: 'u1', name: 'Alice', role: 'student', email: 'alice@example.com', passwordHash: bcrypt.hashSync('password', 8) },
  { id: 'u2', name: 'Prof Bob', role: 'faculty', email: 'bob@example.com', passwordHash: bcrypt.hashSync('password', 8) }
];
const attendance = {}; // userId -> [{id,date,status}]
const rewards = {}; // userId -> [{id,points,reason}]

// Auth helpers
function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '12h' });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Public: login
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = generateToken(user);
  res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
});

// Protected: get profile
app.get('/me', authMiddleware, (req, res) => {
  const u = users.find(x => x.id === req.user.id);
  if (!u) return res.status(404).json({ error: 'Not found' });
  res.json({ id: u.id, name: u.name, role: u.role, email: u.email });
});

// Attendance service endpoints (microservice-style)
app.post('/attendance/mark', authMiddleware, (req, res) => {
  const { userId, date, status } = req.body;
  if (!userId || !date || !status) return res.status(400).json({ error: 'Missing fields' });
  const record = { id: uuidv4(), date, status };
  attendance[userId] = attendance[userId] || [];
  attendance[userId].push(record);
  return res.json({ success: true, record });
});

app.get('/attendance/:userId', authMiddleware, (req, res) => {
  const uId = req.params.userId;
  return res.json({ records: attendance[uId] || [] });
});

// Rewards service endpoints
app.post('/rewards/award', authMiddleware, (req, res) => {
  const { userId, points, reason } = req.body;
  if (!userId || !points) return res.status(400).json({ error: 'Missing fields' });
  const r = { id: uuidv4(), points, reason: reason || null, date: new Date().toISOString() };
  rewards[userId] = rewards[userId] || [];
  rewards[userId].push(r);
  return res.json({ success: true, reward: r });
});

app.get('/rewards/:userId', authMiddleware, (req, res) => {
  const uId = req.params.userId;
  return res.json({ rewards: rewards[uId] || [], totalPoints: (rewards[uId] || []).reduce((s,r)=>s+r.points,0) });
});

// Simple admin endpoint to list users
app.get('/admin/users', authMiddleware, (req, res) => {
  if (req.user.role !== 'faculty' && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  res.json({ users: users.map(u => ({ id: u.id, name: u.name, role: u.role, email: u.email })) });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('CredBud backend running on port', port);
});
