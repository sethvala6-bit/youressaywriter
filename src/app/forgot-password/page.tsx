import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Reset Password</h1>
          <p className="text-gray-600 mb-8">Enter your email to receive a password reset link</p>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
