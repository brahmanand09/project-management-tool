import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post('/auth/register', data);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 max-w-sm mx-auto mt-10 bg-white rounded shadow">
      <h2 className="text-xl mb-4 font-bold">Register</h2>
      <div className="mb-4">
        <input
          {...register('email')}
          placeholder="Email"
          className="input"
        />
        <p className="text-red-600 text-sm">{errors.email?.message}</p>
      </div>
      <div className="mb-4">
        <input
          type="password"
          {...register('password')}
          placeholder="Password"
          className="input"
        />
        <p className="text-red-600 text-sm">{errors.password?.message}</p>
      </div>
      <button type="submit" className="btn">Register</button>
    </form>
  );
}