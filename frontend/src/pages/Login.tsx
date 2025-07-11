import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import jwtDecode from 'jwt-decode';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post('/auth/login', data);
      localStorage.setItem('token', res.data.token);
      setUser(jwtDecode(res.data.token));
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 max-w-sm mx-auto mt-10 bg-white rounded shadow">
      <h2 className="text-xl mb-4 font-bold">Login</h2>
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
      <button type="submit" className="btn">Login</button>
      <p className="text-sm mt-4">
        Don’t have an account?{" "}
        <Link to="/register" className="text-blue-600 underline">
          Register here
        </Link>
      </p>
    </form>
  );
}