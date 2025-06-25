import { useState } from 'react'
import emailjs from '@emailjs/browser'

const ContactPage = () => {

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState({ whatsapp: false, email: false })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const isPhone = (input) => /^\d{10,15}$/.test(input.replace(/\D/g, ''))
  const isEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)

  const sendEmail = async () => {
    try {
      setLoading((prev) => ({ ...prev, email: true }))
      await emailjs.send(
        'default_service',
        'template_ifhrmxj',
        {
          name: form.name,
          email: form.email,
          message: form.message,
          time: new Date().toLocaleString(),
          title: 'New Contact Request',
        },
        '1ksRhKXIHHl8h62RP'
      )
      alert('Message sent via Email!')
    } catch (err) {
      console.error('Email error:', err)
      alert('Email failed. Try again later.')
    } finally {
      setLoading((prev) => ({ ...prev, email: false }))
    }
  }

  const sendWhatsApp = () => {
    setLoading((prev) => ({ ...prev, whatsapp: true }))
    const phoneNumber = '918072888085'
    const text = `Hello, I am ${form.name} (%0AEmail/Phone: ${form.email}).%0A%0A${form.message}`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, '_blank')
    setLoading((prev) => ({ ...prev, whatsapp: false }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate input
    if (!form.name || !form.email || !form.message) {
      alert('Please fill in all fields')
      return
    }

    // Dynamic logic: Check if it's email or phone and trigger accordingly
    if (isEmail(form.email)) {
      // If valid email, send via email
      sendEmail()
    } else if (isPhone(form.email)) {
      // If valid phone, send via WhatsApp
      sendWhatsApp()
    } else {
      alert('Please enter a valid phone number or email')
      return
    }

    // Reset form after successful submission
    resetForm()
  }

  // Fix for the button text and loading state
  const getButtonText = () => {
    if (loading.email) return 'Sending Email...'
    if (loading.whatsapp) return 'Opening WhatsApp...'

    if (!form.email) return 'Send Message'
    if (isEmail(form.email)) return 'Send via Email'
    if (isPhone(form.email)) return 'Send via WhatsApp'
    return 'Send Message'
  }

  const isLoading = loading.email || loading.whatsapp
  

  const resetForm = () => {
    setForm({ name: '', email: '', message: '' })
  }

  // const [form, setForm] = useState({ name: '', email: '', message: '' })

  // const handleChange = (e) => {
  //   const { name, value } = e.target
  //   setForm((prev) => ({ ...prev, [name]: value }))
  // }

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   // Later send to backend
  //   alert('Message submitted successfully!')
  //   setForm({ name: '', email: '', message: '' })
  // }

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   const { name, email, message } = form
  //   const phoneNumber = '918072888085' // Your WhatsApp number (with country code, no +)

  //   const text = `Hello, I am ${name} (%0AEmail: ${email}).%0A%0A${message}`
  //   const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`

  //   window.open(whatsappUrl, '_blank')
  // }

  return (
    <div className="container-custom section-padding">
      <h1 className="text-3xl font-bold text-center mb-10">Contact Us</h1>

      {/* Contact Info & Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Get in Touch</h2>
          <p className="text-gray-600">
            Have questions or need support with your cable or internet services? Fill out the form or reach us directly.
          </p>
          <div className="mt-4 space-y-2 text-gray-700">
            <p><strong>📍 Office:</strong> D.No: 9/17, Mariyamman kovil Street, Pudhureddiyur</p>
            <p><strong>📞 Phone:</strong> +91 9842680525 / +91 8072888085</p>
            <p><strong>📧 Email:</strong> <a href="mailto:mugeshsample@gmail.com" className="text-primary-600 hover:underline">mugeshsample@gmail.com</a></p>
            <p><strong>🕐 Working Hours:</strong> Mon-Sat, 10:00 AM to 6:00 PM</p>
            <p>
              <strong>🌐 Website:</strong>{' '}
              <a
                href="https://www.mugeshbabu.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                https://www.mugeshbabu.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="inline-flex items-center">
                <svg viewBox="0 0 40 40" height="20" width="20" fill="none">
                  <rect width="40" height="40" rx="2" fill="#25D366" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.16382 19.8867C7.16666 12.8126 12.9486 7.05882 20.0527 7.05882C23.4986 7.06024 26.7359 8.39611 29.1691 10.8205C31.6023 13.2448 32.9425 16.4695 32.9412 19.897C32.9383 26.9711 27.156 32.7255 20.0526 32.7255C17.9484 32.7248 15.8827 32.2146 14.0352 31.2426L7.58219 32.9272C7.27122 33.0084 6.989 32.7225 7.07425 32.4126L8.79752 26.1482C7.72503 24.2382 7.16292 22.0869 7.16382 19.8867ZM20.0463 30.4359H20.042C18.1611 30.4352 16.3163 29.9322 14.7069 28.9817L14.3241 28.7556L10.3569 29.7914L11.4158 25.9417L11.1666 25.547C10.1173 23.886 9.56313 21.9663 9.56399 19.9951C9.56629 14.2432 14.2686 9.5636 20.0505 9.5636C22.8502 9.56454 25.482 10.6511 27.4612 12.6231C29.4402 14.5949 30.5294 17.216 30.5283 20.0035C30.526 25.7559 25.8237 30.4359 20.0463 30.4359ZM23.5806 21.4974C23.8678 21.6029 25.4084 22.3667 25.7217 22.5247C25.7829 22.5556 25.84 22.5834 25.893 22.6092C26.1116 22.7156 26.2593 22.7875 26.3223 22.8935C26.4006 23.0252 26.4006 23.6574 26.1395 24.3951C25.8784 25.1326 24.6265 25.8058 24.0245 25.8964C23.4846 25.9777 22.8015 26.0116 22.0509 25.7713C21.5958 25.6258 21.0121 25.4315 20.2645 25.1061C17.3272 23.8281 15.3422 20.9596 14.9667 20.4169C14.9403 20.3789 14.9219 20.3522 14.9116 20.3384L14.9091 20.335C14.7433 20.1122 13.6321 18.6183 13.6321 17.0721C13.6321 15.6177 14.3411 14.8553 14.6675 14.5044C14.6898 14.4803 14.7104 14.4582 14.7288 14.4379C15.0161 14.1219 15.3556 14.0429 15.5645 14.0429C15.7733 14.0429 15.9824 14.0448 16.165 14.054C16.1875 14.0551 16.211 14.055 16.2352 14.0548C16.4178 14.0538 16.6455 14.0525 16.87 14.5959C16.9562 14.8047 17.0823 15.114 17.2153 15.4403C17.4852 16.1024 17.7836 16.8347 17.8361 16.9405C17.9145 17.0985 17.9667 17.2829 17.8622 17.4937C17.8466 17.5253 17.8321 17.5551 17.8182 17.5836C17.7398 17.745 17.6821 17.8637 17.5489 18.0204C17.4968 18.0818 17.4429 18.1479 17.389 18.2141C17.281 18.3466 17.1729 18.4792 17.0789 18.5736C16.922 18.731 16.7587 18.9019 16.9415 19.218C17.1243 19.5341 17.7532 20.5681 18.6846 21.4053C19.686 22.3054 20.5563 22.6858 20.9974 22.8786C21.0835 22.9162 21.1533 22.9467 21.2045 22.9725C21.5178 23.1307 21.7007 23.1042 21.8834 22.8935C22.0662 22.6828 22.6667 21.9715 22.8756 21.6554C23.0845 21.3395 23.2934 21.3921 23.5806 21.4974Z"
                    fill="white"
                  />
                </svg>
                <span className="ml-2 font-semibold">Group:</span>
              </span>
              <a
                href="https://chat.whatsapp.com/JoBEtC7dZE38H5EILwL6Nr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline break-all"
              >
                chat.whatsapp.com/JoBEtC7dZE38H5EILwL6Nr
              </a>
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email / Phone</label>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Message</label>
            <textarea
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:border-primary-500"
            />
          </div>
          {/* <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition"
          >
            {loading ? 'Sending...' : 'Send Message via WhatsApp'}
          </button> */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition"
          >
            {getButtonText()}
          </button>
        </form>
      </div>

      {/* Google Maps */}
      <div className="mt-16 space-y-8">
        <h2 className="text-2xl font-bold text-center mb-4">Our Locations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <iframe
            title="Mugeshbabu - Home Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d516.6768497225428!2d78.27769688951214!3d12.08310310010131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bac13ea76e155e9%3A0x60a2bcd3a0038cec!2smugeshbabu!5e0!3m2!1sen!2sin!4v1651134232759!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg shadow-md"
          ></iframe>

          <iframe
            title="Mugeshbabu Cable Service"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1033.9467893924216!2d78.28053317126191!3d12.084114241940819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bac13004812cab3%3A0x69c85830075c00be!2sMugeshbabu%20Cable%20Service!5e0!3m2!1sen!2sin!4v1734938548584!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg shadow-md"
          ></iframe>
        </div>
      </div>
    </div>
  )
}

export default ContactPage