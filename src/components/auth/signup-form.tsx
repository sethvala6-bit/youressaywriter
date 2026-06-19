'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpSchema, SignUpInput } from '@/lib/validators';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { PasswordStrengthIndicator } from './password-strength-indicator';
import Link from 'next/link';

export function SignUpForm() {
  const { signup } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
  });

  const password = watch('password');

  const onSubmit = async (data: SignUpInput) => {
    setLoading(true);
    setServerError(null);
    try {
      await signup(data.email, data.password, data.firstName, data.lastName);
      router.push('/dashboard');
    } catch (error: any) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {serverError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-dark mb-1">Email *</label>
        <input
          {...register('email')}
          type="email"
          placeholder="your@email.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">First Name</label>
          <input
            {...register('firstName')}
            type="text"
            placeholder="John"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Last Name</label>
          <input
            {...register('lastName')}
            type="text"
            placeholder="Doe"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark mb-1">Password *</label>
        <input
          {...register('password')}
          type="password"
          placeholder="••••••••"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        {password && <PasswordStrengthIndicator password={password} />}
      </div>

      <div>
        <label className="flex items-center">
          <input
            {...register('agreeToTerms')}
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 cursor-pointer"
          />
          <span className="ml-2 text-sm text-gray-600">
            I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
          </span>
        </label>
        {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account? <Link href="/signin" className="text-primary hover:underline">Sign in</Link>
      </p>
    </form>
  );
}
