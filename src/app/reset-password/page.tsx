import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Create New Password</h1>
          <p className="text-gray-600 mb-8">Enter your new password below</p>
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
