import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API || 'http://localhost:4000';

function App(){
  const [email,setEmail]=useState('alice@example.com');
  const [password,setPassword]=useState('password');
  const [token,setToken]=useState(null);
  const [me,setMe]=useState(null);

  async function login(e){
    e.preventDefault();
    const res = await axios.post(`${API}/auth/login`, { email, password });
    setToken(res.data.token);
    localStorage.setItem('credbud_token', res.data.token);
    fetchMe(res.data.token);
  }

  async function fetchMe(t){
    try {
      const res = await axios.get(`${API}/me`, { headers: { Authorization: 'Bearer ' + t } });
      setMe(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <h1>CredBud — Demo Frontend</h1>
      {!token && (
        <form onSubmit={login}>
          <div>
            <label>Email:</label><br/>
            <input value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label>Password:</label><br/>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" />
          </div>
          <button type="submit">Login</button>
        </form>
      )}
      {token && me && (
        <div>
          <h2>Welcome, {me.name} ({me.role})</h2>
          <p>Use the backend endpoints to mark attendance and award rewards.</p>
        </div>
      )}
    </div>
  );
}

export default App;
