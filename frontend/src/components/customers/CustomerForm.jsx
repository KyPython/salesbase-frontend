import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  company_name: z.string().optional(),
});

export default function CustomerForm({ initialData = {}, onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  const onSubmit = async (data) => {
    try {
      const method = initialData.id ? 'PUT' : 'POST';
      const url = initialData.id
        ? `/api/contacts/${initialData.id}`
        : '/api/contacts';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        reset();
        if (onSuccess) onSuccess();
      } else {
        alert('Failed to save customer');
      }
    } catch {
      alert('Failed to save customer');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>
          First Name:
          <input {...register('first_name')} />
        </label>
        {errors.first_name && (
          <span style={{ color: 'red' }}>{errors.first_name.message}</span>
        )}
      </div>
      <div>
        <label>
          Last Name:
          <input {...register('last_name')} />
        </label>
        {errors.last_name && (
          <span style={{ color: 'red' }}>{errors.last_name.message}</span>
        )}
      </div>
      <div>
        <label>
          Email:
          <input {...register('email')} />
        </label>
        {errors.email && (
          <span style={{ color: 'red' }}>{errors.email.message}</span>
        )}
      </div>
      <div>
        <label>
          Company:
          <input {...register('company_name')} />
        </label>
      </div>
      <button type="submit" disabled={isSubmitting}>
        {initialData.id ? 'Update' : 'Add'} Customer
      </button>
    </form>
  );
}