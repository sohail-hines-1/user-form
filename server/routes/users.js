import { Router } from 'express';
import supabase from '../supabaseClient.js';

const router = Router();

function validate({ first_name, last_name, email }) {
  const errors = [];
  if (!first_name || !first_name.trim()) errors.push({ field: 'first_name', message: 'First name is required.' });
  if (!last_name || !last_name.trim()) errors.push({ field: 'last_name', message: 'Last name is required.' });
  if (!email || !email.trim()) {
    errors.push({ field: 'email', message: 'Email is required.' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push({ field: 'email', message: 'Enter a valid email address.' });
  }
  return errors;
}

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ users: data });
});

router.post('/', async (req, res) => {
  const { first_name, last_name, email } = req.body;
  const errors = validate({ first_name, last_name, email });
  if (errors.length) return res.status(400).json({ errors });

  const { data, error } = await supabase
    .from('users')
    .insert([{ first_name: first_name.trim(), last_name: last_name.trim(), email: email.trim() }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ user: data });
});

export default router;
