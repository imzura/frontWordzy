/* "use client"

import { useAuth } from "../../features/auth/hooks/useAuth"
import ApprenticeNavbar from "./ApprenticeNavbar"

const ApprenticeLayout = ({ children }) => {
  const { user } = useAuth()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <ApprenticeNavbar />
      <div className="flex-1 overflow-auto">
        <div className="min-h-full">{children}</div>
      </div>
    </div>
  )
}

export default ApprenticeLayout */
