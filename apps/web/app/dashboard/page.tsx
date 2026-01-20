import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from './logout-button'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Bienvenue sur HeyTripy ! 🧳
        </h1>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 font-medium">
            ✅ Connexion Supabase réussie !
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Email</h2>
            <p className="text-lg text-gray-900">{user.email}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">User ID</h2>
            <p className="text-sm text-gray-600 font-mono">{user.id}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-500">Créé le</h2>
            <p className="text-lg text-gray-900">
              {new Date(user.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>

          {user.user_metadata?.avatar_url && (
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Avatar</h2>
              <img
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                className="w-16 h-16 rounded-full"
              />
            </div>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <LogoutButton />
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">🎉 Setup terminé !</h3>
          <p className="text-sm text-blue-700">
            Supabase Auth fonctionne parfaitement. Tu peux maintenant continuer avec :
          </p>
          <ul className="mt-2 space-y-1 text-sm text-blue-700">
            <li>• Créer la landing page</li>
            <li>• Setup Claude AI pour le chat</li>
            <li>• Créer le dashboard des voyages</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
