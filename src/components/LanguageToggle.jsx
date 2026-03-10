import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { i18n, t } = useTranslation()
  const isJa = i18n.language === 'ja'

  const toggle = () => {
    i18n.changeLanguage(isJa ? 'en' : 'ja')
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 cursor-pointer"
      style={{
        borderColor: 'rgba(255,255,255,0.4)',
        color: 'white',
        background: 'rgba(255,255,255,0.1)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.05em',
        fontSize: '0.875rem',
      }}
      aria-label={t('ui.aria.toggleLanguage')}
    >
      <span style={{ opacity: isJa ? 0.5 : 1 }}>EN</span>
      <span style={{ opacity: 0.4, margin: '0 2px' }}>/</span>
      <span style={{ opacity: isJa ? 1 : 0.5 }}>日本語</span>
    </button>
  )
}
