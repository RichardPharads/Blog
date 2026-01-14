import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/AuthHook'

const Authorized = ({ onLogout }: { user: any; onLogout: () => void }) => {
  return (
    <>
    <li>
        <Link
          to="/profile"
          className="border px-4 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
        >
          My Blog Post
        </Link>
      </li>
      <li>
        <Link
          to="/create"
          className="border px-4 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
        >
          Create Post
        </Link>
      </li>
      <li>
        <button
          onClick={onLogout}
          className="px-4 py-1.5 text-gray-700 hover:text-gray-900"
        >
          Log out
        </button>
      </li>
      
    </>
  )
}

function Navigation() {
  const navigate = useNavigate()
  const { authorized, user, logout } = useAuth()
  const authState = useSelector((state: any) => state.auth.authorized)
  const userState = useSelector((state: any) => state.auth.user)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    console.log('Auth state updated:', {
      authorized,
      authState,
      user: user?.email,
      userState: userState?.email,
    })
  }, [authState, userState, authorized, user])

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const renderUserInfo = () => {
    if (!user) return null

    return (
      <div className="flex items-center gap-2.5">
        {user.user_metadata?.avatar_url && (
          <img
            src={user.user_metadata.avatar_url}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
          />
        )}
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
          {user.user_metadata?.name || user.email}
        </span>
      </div>
    )
  }

  return (
    <nav className="py-4 px-4 sm:px-6 lg:px-10 border-b bg-white sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tight">
            Blog
          </Link>

          {/* Desktop user info */}
          <div className="hidden sm:block">{renderUserInfo()}</div>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-5">
            {authorized ? (
              <Authorized user={user} onLogout={handleLogout} />
            ) : (
              <>
                <li>
                  <Link
                    to="/register"
                    className="px-5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 -mr-2 text-gray-700 hover:text-black focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMobileMenuOpen
                  ? 'M6 18L18 6M6 6l12 12'
                  : 'M4 6h16M4 12h16M4 18h16'
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-3 border-t">
          <div className="pt-3 pb-4 px-2">
            {/* Mobile user info */}
            {renderUserInfo()}
            <ul className="mt-4 space-y-3">
              {authorized ? (
                <>
                  <li>
                    <Link
                      to="/create"
                      className="block px-4 py-2.5 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Create Post
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Log out
                    </button>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2.5 rounded-lg hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/register"
                      className="block px-4 py-2.5 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      className="block px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation