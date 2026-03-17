import { useState, useEffect } from 'react';
import UserForm from './components/UserForm.jsx';
import UsersTable from './components/UsersTable.jsx';

const API = 'http://localhost:3001/api/users';

export default function App() {
  const [users, setUsers] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    const res = await fetch(API);
    const data = await res.json();
    setUsers(data.users);
  }

  async function handleSubmit(fields) {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    if (!res.ok) {
      throw data;
    }
    await fetchUsers();
  }

  return (
    <main className="container">
      <h1>Add User</h1>
      <UserForm onSubmit={handleSubmit} />
      {users !== null && <UsersTable users={users} />}
    </main>
  );
}
