import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext()

  const location = useLocation()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const changeRole = async () => {
    try {
      const { data } = await axios.post('/api/owner/change-role')
      if (data.success) {
        setIsOwner(true)
        toast.success(data.message || 'Role changed successfully')
        navigate('/owner')  // Navigate after becoming owner
      } else {
        toast.error(data.message || 'Failed to change role')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Error occurred')
    }
  }

  return (
    <div
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all duration-300 ${
        location.pathname === '/' ? 'bg-light' : 'bg-white'
      }`}
    >
      <Link to='/'>
        <img src={assets.logo} alt='logo' className='h-8' />
      </Link>

      {/* Responsive menu container */}
      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${
          location.pathname === '/' ? 'bg-light' : 'bg-white'
        } ${open ? 'max-sm:translate-x-0' : 'max-sm:translate-x-full'}`}
      >
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path} onClick={() => setOpen(false)}>
            {link.name}
          </Link>
        ))}

        {/* Search Box (only on larger screens) */}
        <div className='hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56'>
          <input
            type='text'
            className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500'
            placeholder='Search products'
          />
          <img src={assets.search_icon} alt='search' />
        </div>

        {/* Buttons */}
        <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
          <button
            onClick={() => (isOwner ? navigate('/owner') : changeRole())}
            className='cursor-pointer'
          >
            {isOwner ? 'Dashboard' : 'List cars'}
          </button>

          <button
            onClick={() => {
              if (user) {
                logout()
              } else {
                setShowLogin(true)
                setOpen(false)
              }
            }}
            className='cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg'
          >
            {user ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>

      {/* Mobile menu icon */}
      <button
        className='sm:hidden cursor-pointer z-50'
        aria-label='Menu'
        onClick={() => setOpen(!open)}>
        <img src={open ? assets.close_icon : assets.menu_icon} alt='menu' />
      </button>
    </div>
  )
}

export default Navbar
