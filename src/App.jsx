import { useState, useEffect } from 'react'

const SPARKLE_COUNT = 5

function generateSparkles() {
  return Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() > 0.5 ? 'lg' : 'sm',
    delay: `${(Math.random() * 6).toFixed(2)}s`,
    duration: `${(3 + Math.random() * 4).toFixed(2)}s`,
    symbol: Math.random() > 0.5 ? '✦' : '✧',
  }))
}

const sparkles = generateSparkles()

const initialFormData = {
  adSoyad: '',
  eposta: '',
  telefon: '',
  universite: '',
  bolum: '',
  sinif: '',
  awsDeneyim: '',
  linkedin: '',
  nedenKatilmak: '',
}

const initialErrors = {
  adSoyad: '',
  eposta: '',
  awsDeneyim: '',
}

function validate(formData) {
  const errors = { ...initialErrors }
  let valid = true

  if (!formData.adSoyad.trim()) {
    errors.adSoyad = 'Ad Soyad alanı zorunludur.'
    valid = false
  } else if (formData.adSoyad.trim().length < 3) {
    errors.adSoyad = 'Ad Soyad en az 3 karakter olmalıdır.'
    valid = false
  }

  if (!formData.eposta.trim()) {
    errors.eposta = 'E-posta alanı zorunludur.'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.eposta)) {
    errors.eposta = 'Geçerli bir e-posta adresi giriniz.'
    valid = false
  }

  if (!formData.awsDeneyim) {
    errors.awsDeneyim = 'Lütfen AWS deneyim seviyenizi seçiniz.'
    valid = false
  }

  return { errors, valid }
}

export default function App() {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState(initialErrors)
  const [touched, setTouched] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showCheckmark, setShowCheckmark] = useState(false)

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => setShowCheckmark(true), 100)
      return () => clearTimeout(timer)
    }
    setShowCheckmark(false)
  }, [isSuccess])

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const { errors: newErrors } = validate({ ...formData, [name]: value })
      setErrors(prev => ({ ...prev, [name]: newErrors[name] }))
    }
  }

  function handleBlur(e) {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const { errors: newErrors } = validate(formData)
    setErrors(prev => ({ ...prev, [name]: newErrors[name] }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const allTouched = Object.keys(initialErrors).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {}
    )
    setTouched(allTouched)

    const { errors: validationErrors, valid } = validate(formData)
    setErrors(validationErrors)

    if (!valid) return

    setIsLoading(true)

    try {
      const res = await fetch('https://d5ohy9vobg.execute-api.eu-north-1.amazonaws.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu')
      setIsSuccess(true)
    } catch (err) {
      alert('Kayıt sırasında hata: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleReset() {
    setFormData(initialFormData)
    setErrors(initialErrors)
    setTouched({})
    setIsSuccess(false)
    setShowCheckmark(false)
  }

  return (
    <div className="page-wrapper">
      {/* Animated gradient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Sparkle background */}
      <div className="sparkles-bg" aria-hidden="true">
        {sparkles.map(s => (
          <span
            key={s.id}
            className={`sparkle sparkle--${s.size}`}
            style={{
              top: s.top,
              left: s.left,
              animationDelay: s.delay,
              animationDuration: s.duration,
            }}
          >
            {s.symbol}
          </span>
        ))}
      </div>

      {/* Vertical ZİRVE 2026 text */}
      <div className="side-text side-text--left">
        <span className="side-text-content">ZİRVE 2026</span>
      </div>

      {/* Grid pattern overlay */}
      <div className="grid-pattern" aria-hidden="true" />

      <main className="main-container">
        {/* Logo / Header */}
        <header className="header">
          <div className="logo-badge">
            <span className="logo-cloud">☁</span>
            <div className="logo-text-group">
              <span className="logo-aws">AWS</span>
              <span className="logo-cloud-clubs">Cloud Clubs</span>
            </div>
          </div>

          <h2 className="event-name">
            <span className="event-name-line event-name-accent">Cloud & Okan Dev Event</span>
          </h2>

          <div className="event-chips">
            <span className="event-chip">
              <span>📍</span> Osman Hamdi Bey Conference Hall
            </span>
            <span className="event-chip">
              <span>📅</span> 21 April
            </span>
            <span className="event-chip">
              <span>🕐</span> 10:00 AM — 4:30 PM
            </span>
          </div>
        </header>

        {/* Card */}
        <div className="card">
          <div className="card-glow" />

          {!isSuccess ? (
            <>
              <div className="card-header">
                <h1 className="form-title">Kayıt Formu</h1>
                <p className="form-subtitle">
                  Cloud & Okan Dev Event etkinliğine katılmak için aşağıdaki formu doldurunuz.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="form">
                {/* Ad Soyad */}
                <div className={`field-group${errors.adSoyad && touched.adSoyad ? ' field-group--error' : ''}${formData.adSoyad && !errors.adSoyad ? ' field-group--valid' : ''}`}>
                  <label className="field-label" htmlFor="adSoyad">
                    <span className="field-icon">👤</span>
                    Ad Soyad
                    <span className="required-mark">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="adSoyad"
                      name="adSoyad"
                      className="field-input"
                      placeholder="Adınız ve soyadınız"
                      value={formData.adSoyad}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="name"
                    />
                    <div className="input-highlight" />
                  </div>
                  {errors.adSoyad && touched.adSoyad && (
                    <span className="error-msg" role="alert">⚠ {errors.adSoyad}</span>
                  )}
                </div>

                {/* E-posta */}
                <div className={`field-group${errors.eposta && touched.eposta ? ' field-group--error' : ''}${formData.eposta && !errors.eposta ? ' field-group--valid' : ''}`}>
                  <label className="field-label" htmlFor="eposta">
                    <span className="field-icon">✉</span>
                    E-posta
                    <span className="required-mark">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="eposta"
                      name="eposta"
                      className="field-input"
                      placeholder="ornek@universite.edu.tr"
                      value={formData.eposta}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="email"
                    />
                    <div className="input-highlight" />
                  </div>
                  {errors.eposta && touched.eposta && (
                    <span className="error-msg" role="alert">⚠ {errors.eposta}</span>
                  )}
                </div>

                {/* Telefon */}
                <div className="field-group">
                  <label className="field-label" htmlFor="telefon">
                    <span className="field-icon">📱</span>
                    Telefon
                    <span className="optional-mark">(opsiyonel)</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="tel"
                      id="telefon"
                      name="telefon"
                      className="field-input"
                      placeholder="+90 5xx xxx xx xx"
                      value={formData.telefon}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="tel"
                    />
                    <div className="input-highlight" />
                  </div>
                </div>

                {/* Üniversite */}
                <div className="field-group">
                  <label className="field-label" htmlFor="universite">
                    <span className="field-icon">🏛</span>
                    Üniversite
                    <span className="optional-mark">(opsiyonel)</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="universite"
                      name="universite"
                      className="field-input"
                      placeholder="Üniversite adınız"
                      value={formData.universite}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="input-highlight" />
                  </div>
                </div>

                {/* Bölüm */}
                <div className="field-group">
                  <label className="field-label" htmlFor="bolum">
                    <span className="field-icon">📚</span>
                    Bölüm
                    <span className="optional-mark">(opsiyonel)</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="bolum"
                      name="bolum"
                      className="field-input"
                      placeholder="Bölümünüz (örn. Bilgisayar Mühendisliği)"
                      value={formData.bolum}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="input-highlight" />
                  </div>
                </div>

                {/* Sınıf */}
                <div className="field-group">
                  <label className="field-label" htmlFor="sinif">
                    <span className="field-icon">🎓</span>
                    Sınıf
                    <span className="optional-mark">(opsiyonel)</span>
                  </label>
                  <div className="input-wrapper select-wrapper">
                    <select
                      id="sinif"
                      name="sinif"
                      className="field-input field-select"
                      value={formData.sinif}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Sınıfınızı seçiniz</option>
                      <option value="1">1. Sınıf</option>
                      <option value="2">2. Sınıf</option>
                      <option value="3">3. Sınıf</option>
                      <option value="4">4. Sınıf</option>
                      <option value="yuksek_lisans">Yüksek Lisans</option>
                      <option value="doktora">Doktora</option>
                    </select>
                    <span className="select-arrow">▾</span>
                    <div className="input-highlight" />
                  </div>
                </div>

                {/* AWS Deneyim Seviyesi */}
                <div className={`field-group${errors.awsDeneyim && touched.awsDeneyim ? ' field-group--error' : ''}`}>
                  <label className="field-label">
                    <span className="field-icon">☁</span>
                    AWS Deneyim Seviyesi
                    <span className="required-mark">*</span>
                  </label>
                  <div className="radio-group">
                    {[
                      { value: 'hic_yok', label: 'Hiç Yok', icon: '⭐' },
                      { value: 'baslangic', label: 'Başlangıç', icon: '⭐⭐' },
                      { value: 'orta', label: 'Orta', icon: '⭐⭐⭐' },
                      { value: 'ileri', label: 'İleri', icon: '⭐⭐⭐⭐' },
                    ].map(opt => (
                      <label
                        key={opt.value}
                        className={`radio-card${formData.awsDeneyim === opt.value ? ' radio-card--selected' : ''}`}
                        htmlFor={`aws-${opt.value}`}
                      >
                        <input
                          type="radio"
                          id={`aws-${opt.value}`}
                          name="awsDeneyim"
                          value={opt.value}
                          checked={formData.awsDeneyim === opt.value}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="radio-input"
                        />
                        <span className="radio-icon">{opt.icon}</span>
                        <span className="radio-label">{opt.label}</span>
                        <span className="radio-check">✓</span>
                      </label>
                    ))}
                  </div>
                  {errors.awsDeneyim && touched.awsDeneyim && (
                    <span className="error-msg" role="alert">⚠ {errors.awsDeneyim}</span>
                  )}
                </div>

                {/* LinkedIn */}
                <div className="field-group">
                  <label className="field-label" htmlFor="linkedin">
                    <span className="field-icon">🔗</span>
                    LinkedIn Profili
                    <span className="optional-mark">(opsiyonel)</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      className="field-input"
                      placeholder="https://linkedin.com/in/kullanici-adi"
                      value={formData.linkedin}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="input-highlight" />
                  </div>
                </div>

                {/* Neden katılmak istiyorsunuz */}
                <div className="field-group">
                  <label className="field-label" htmlFor="nedenKatilmak">
                    <span className="field-icon">💬</span>
                    Neden katılmak istiyorsunuz?
                    <span className="optional-mark">(opsiyonel)</span>
                  </label>
                  <div className="input-wrapper">
                    <textarea
                      id="nedenKatilmak"
                      name="nedenKatilmak"
                      className="field-input field-textarea"
                      placeholder="AWS Cloud Clubs Summit'e katılma motivasyonunuzu paylaşın..."
                      value={formData.nedenKatilmak}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={4}
                    />
                    <div className="input-highlight" />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className={`submit-btn${isLoading ? ' submit-btn--loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="btn-content">
                      <span className="spinner" />
                      Kaydediliyor...
                    </span>
                  ) : (
                    <span className="btn-content">
                      <span className="btn-icon">🚀</span>
                      Kayıt Ol
                    </span>
                  )}
                  <span className="btn-shine" />
                </button>

                <p className="form-note">
                  <span>🔒</span> Bilgileriniz güvende. Yalnızca etkinlik organizasyonu için kullanılacaktır.
                </p>
              </form>
            </>
          ) : (
            <div className="success-container">
              <div className={`success-checkmark${showCheckmark ? ' success-checkmark--visible' : ''}`}>
                <div className="checkmark-circle">
                  <svg className="checkmark-svg" viewBox="0 0 52 52" fill="none">
                    <circle className="checkmark-circle-bg" cx="26" cy="26" r="25" />
                    <path className="checkmark-path" d="M14 26 l8 8 l16-16" />
                  </svg>
                </div>
              </div>

              <div className="success-sparkles" aria-hidden="true">
                {['✦', '✧', '✦', '✧', '✦', '✧'].map((s, i) => (
                  <span key={i} className="success-sparkle" style={{ animationDelay: `${i * 0.12}s` }}>
                    {s}
                  </span>
                ))}
              </div>

              <h2 className="success-title">Kaydınız Alındı!</h2>
              <p className="success-message">
                Cloud & Okan Dev Event etkinliğine başarıyla kayıt oldunuz.
                Etkinlik detayları e-posta adresinize gönderilecektir.
              </p>

              <div className="success-info-card">
                <div className="success-info-row">
                  <span className="success-info-label">👤 Ad Soyad</span>
                  <span className="success-info-value">{formData.adSoyad}</span>
                </div>
                <div className="success-info-row">
                  <span className="success-info-label">✉ E-posta</span>
                  <span className="success-info-value">{formData.eposta}</span>
                </div>
                <div className="success-info-row">
                  <span className="success-info-label">🏛 Üniversite</span>
                  <span className="success-info-value">{formData.universite}</span>
                </div>
              </div>

              <button className="reset-btn" onClick={handleReset}>
                <span>↩</span> Yeni Kayıt
              </button>
            </div>
          )}
        </div>

        <footer className="footer">
          <span>✦</span>
          <span>AWS Cloud Clubs — Istanbul Okan University &copy; 2026</span>
          <span>✦</span>
        </footer>
      </main>
    </div>
  )
}
