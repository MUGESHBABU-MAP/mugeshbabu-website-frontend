import { useState } from 'react'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import logo from '../../assets/images/MugeshMediaLogo.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState({
    pincode: '',
    street: '',
    city: '',
    state: ''
  })
  const [role, setRole] = useState('customer')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const from = location.state?.from?.pathname || '/dashboard'

  const { handleSubmit } = useForm()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const data = {
      name,
      email,
      username,
      password,
      phone,
      address,
      role
    }

    const result = await register(data)
    if (result.success) {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-3xl w-full">
        <div className="flex flex-col items-center">
          {/* <div className="bg-primary-600 rounded-full w-14 h-14 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            M
          </div> */}
          <div className="flex justify-center">
            <div className="bg-white border border-gray-200 rounded-full shadow-md p-2 w-20 h-20 flex items-center justify-center">
              <img
                src={logo}
                alt="Mugesh Media"
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            Register your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              login to an existing account
            </Link>
          </p>
        </div>

        <form className="mt-8" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Name', value: name, setter: setName, id: 'name', required: true },
              { label: 'Email', value: email, setter: setEmail, id: 'email', type: 'email', required: true },
              { label: 'Username', value: username, setter: setUsername, id: 'username', required: true },
              { label: 'Password', value: password, setter: setPassword, id: 'password', type: 'password', required: true },
              { label: 'Phone', value: phone, setter: setPhone, id: 'phone' },
              { label: 'Pincode', value: address.pincode, setter: (val) => setAddress({ ...address, pincode: val }), id: 'pincode' },
              { label: 'Street', value: address.street, setter: (val) => setAddress({ ...address, street: val }), id: 'street' },
              { label: 'City (Vill)', value: address.city, setter: (val) => setAddress({ ...address, city: val }), id: 'city' },
              { label: 'State', value: address.state, setter: (val) => setAddress({ ...address, state: val }), id: 'state' }
            ].map(({ label, value, setter, id, type = 'text', required }) => (
              <div key={id} className="space-y-1">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                  {label} {required && <span className="text-red-600">*</span>}
                </label>
                <input
                  type={type}
                  id={id}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  required={required}
                  className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            ))}

            <div className="space-y-1">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role <span className="text-red-600">*</span>
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white font-medium py-3 rounded-lg hover:bg-primary-700 transition duration-150"
            >
              {loading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                'Register'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage