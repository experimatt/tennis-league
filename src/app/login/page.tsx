import LoginForm from "./login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Tennis League Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage your tennis league
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-sm text-gray-500">
          Use: admin@example.com / admin123
        </div>
      </div>
    </div>
  )
} 