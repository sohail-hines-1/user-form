import { useState, useEffect } from 'react';

const EMPTY = { first_name: '', last_name: '', email: '' };
const EMPTY_ERRORS = { first_name: '', last_name: '', email: '' };

function validateFields({ first_name, last_name, email }) {
  const errors = { ...EMPTY_ERRORS };
  if (!first_name.trim()) errors.first_name = 'First name is required.';
  if (!last_name.trim()) errors.last_name = 'Last name is required.';
  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  return errors;
}

export default function UserForm({ onSubmit }) {
  const [fields, setFields] = useState(EMPTY);
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [success]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields(f => ({ ...f, [name]: value }));
    setErrors(err => ({ ...err, [name]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validation = validateFields(fields);
    if (Object.values(validation).some(Boolean)) {
      setErrors(validation);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(fields);
      setFields(EMPTY);
      setErrors(EMPTY_ERRORS);
      setSuccess(true);
    } catch (err) {
      if (err.errors) {
        const mapped = { ...EMPTY_ERRORS };
        err.errors.forEach(({ field, message }) => { mapped[field] = message; });
        setErrors(mapped);
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="user-form">
      {success && <p className="success-flash">User added successfully!</p>}

      <div className="field">
        <label htmlFor="first_name">First Name</label>
        <input
          id="first_name"
          name="first_name"
          value={fields.first_name}
          onChange={handleChange}
          aria-describedby={errors.first_name ? 'err-first_name' : undefined}
        />
        {errors.first_name && <span id="err-first_name" className="field-error">{errors.first_name}</span>}
      </div>

      <div className="field">
        <label htmlFor="last_name">Last Name</label>
        <input
          id="last_name"
          name="last_name"
          value={fields.last_name}
          onChange={handleChange}
          aria-describedby={errors.last_name ? 'err-last_name' : undefined}
        />
        {errors.last_name && <span id="err-last_name" className="field-error">{errors.last_name}</span>}
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={fields.email}
          onChange={handleChange}
          aria-describedby={errors.email ? 'err-email' : undefined}
        />
        {errors.email && <span id="err-email" className="field-error">{errors.email}</span>}
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Add User'}
      </button>
    </form>
  );
}
