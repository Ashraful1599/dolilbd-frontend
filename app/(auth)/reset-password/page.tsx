'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ token, email, password, password_confirmation: passwordConfirmation }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password reset successfully!');
        router.push('/login');
      } else {
        toast.error(data.message || 'Reset failed. The link may have expired.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-red-600 font-medium mb-4">Invalid or expired reset link.</p>
            <Link href="/forgot-password" className="text-blue-600 hover:underline text-sm">Request a new link</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-gray-900">Dolil<span className="text-blue-600">BD</span></h1>
            <p className="text-xs text-gray-500 mt-0.5">Legal Document System</p>
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-8 w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Reset password</h2>
            <p className="text-sm text-gray-500 mt-1">Enter your new password below.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Minimum 8 characters"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                minLength={8}
                placeholder="Repeat your new password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            <Link href="/login" className="text-blue-600 hover:underline">Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
