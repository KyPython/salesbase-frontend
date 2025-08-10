import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  job_title: z.string().optional(),
  company_name: z.string().optional(),
});

export default function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id && id !== 'new';
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Fetch customer data if editing
  useEffect(() => {
    if (isEditMode) {
      fetch(`http://localhost:3001/api/contacts/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.contact) {
            setValue('first_name', data.contact.first_name || '');
            setValue('last_name', data.contact.last_name || '');
            setValue('email', data.contact.email || '');
            setValue('phone', data.contact.phone || '');
            setValue('job_title', data.contact.job_title || '');
            setValue('company_name', data.contact.company_name || '');
          }
        })
        .catch(err => {
          console.error('Error fetching customer:', err);
        });
    }
  }, [id, isEditMode, setValue]);

  const onSubmit = async (data) => {
    try {
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode
        ? `http://localhost:3001/api/contacts/${id}`
        : 'http://localhost:3001/api/contacts';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        // ✅ SUCCESS: Navigate back to customer list
        navigate('/customers', { 
          state: { 
            message: `Customer ${isEditMode ? 'updated' : 'created'} successfully!`,
            refresh: true 
          } 
        });
      } else {
        alert('Failed to save customer');
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Failed to save customer');
    }
  };

return (
  <div className="max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold mb-6">
      {isEditMode ? 'Edit Customer' : 'Add New Customer'}
    </h2>
    
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input 
            {...register('first_name')} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.first_name && (
            <span className="text-red-500 text-sm">{errors.first_name.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input 
            {...register('last_name')} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.last_name && (
            <span className="text-red-500 text-sm">{errors.last_name.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input 
            {...register('email')} 
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input 
            {...register('phone')} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <input 
            {...register('job_title')} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input 
            {...register('company_name')} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Customer' : 'Create Customer')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/customers')}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}