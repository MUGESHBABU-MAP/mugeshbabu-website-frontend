import { useEffect, useState } from 'react'
import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  const [open, setOpen] = useState(false)

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const frame = document.querySelector('iframe.goog-te-banner-frame')
      if (frame) frame.style.display = 'none'
      document.body.style.top = '0px'
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="hidden fixed bottom-6 right-6 z-50">
      <div className="relative group">
        <button
          onClick={() => setOpen(!open)}
          className="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition duration-200"
        >
          <Languages className="w-5 h-5" />
        </button>

        {open && (
          <div className="absolute bottom-14 right-0 bg-white border border-gray-300 shadow-lg rounded-xl px-4 py-2 flex flex-col gap-2">
            <button onClick={() => changeLanguage('en')} className="text-sm text-gray-700 hover:text-primary-600">English</button>
            <button onClick={() => changeLanguage('ta')} className="text-sm text-gray-700 hover:text-primary-600">தமிழ்</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default LanguageSwitcher