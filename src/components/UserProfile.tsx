import { useAuthStore } from "../store/authStore";

export function UserProfile() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {user.nombre?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{user.nombre}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
          {user.departamento && (
            <p className="text-xs text-gray-400">{user.departamento}</p>
          )}
        </div>
        {user.isDemo && (
          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
            Demo
          </span>
        )}
      </div>
    </div>
  );
}
