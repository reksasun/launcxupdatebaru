// frontend/src/hooks/useAuth.ts
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { authManager } from '@/lib/authManager'

/**
 * Hook to guard routes that require authentication.
 * Redirects to /login if no token is found in authManager.
 */
export function useRequireAuth() {
  const router = useRouter()

  useEffect(() => {
    const token = authManager.getToken('admin')
    if (!token) {
      router.replace('/login')
    }
  }, [router])
}
