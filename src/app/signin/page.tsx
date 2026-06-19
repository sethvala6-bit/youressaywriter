import { SignInForm } from '@/components/auth/signin-form';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Sign In</h1>
          <p className="text-gray-600 mb-8">Access your account and track your orders</p>
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
