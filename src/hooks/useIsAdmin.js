import { useAuth } from '../context'

export default function useIsAdmin() {
  const { user } = useAuth()
  return user?.role === 'admin'
}
