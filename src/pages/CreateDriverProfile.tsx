import React from 'react'
import { SEO } from '../components/SEO'
import { tracks } from '../tracksStore'

export const CreateDriverProfile: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    number: '',
    numberSuffix: '',
    classes: [] as string[],
    homeTrack: '',
    region: '',
    team: '',
    carMake: '',
    carModel: '',
    carYear: '',
    carEngine: '',
    sponsors: '',
    championships: '',
    yearsRacing: '',
    facebook: '',
    instagram: '',
    website: '',
    photoUrl: '',
    bio: '',
    email: '',
  })

  const [submitted, setSubmitted] = React.useState(false)
  const [step, setStep] = React.useState(1)

  const availableClasses = [
    'Superstocks',
    'Stockcars',
    'Sprintcars',
    'Midgets',
    'TQ Midgets',
    'Super Saloons',
    'Saloons',
    'Production Saloons',
    'Streetstocks',
    'Modifieds',
    'Ministocks (Youth)',
    'Ministocks (Adult)',
    'Sidecars',
    'Solo Bikes',
    'Six Shooters',
    'Lightning Sprints',
    'Quarter Midgets',
    'Vintage',
    'Other',
  ]

  const numberSuffixes = [
    { value: '', label: 'None' },
    { value: 'NZ', label: 'NZ - National' },
    { value: 'A', label: 'A - Auckland' },
    { value: 'W', label: 'W - Waikato' },
    { value: 'B', label: 'B - Bay of Plenty' },
    { value: 'R', label: 'R - Rotorua' },
    { value: 'G', label: 'G - Gisborne' },
    { value: 'HB', label: 'HB - Hawkes Bay' },
    { value: 'T', label: 'T - Taranaki' },
    { value: 'M', label: 'M - Manawatu' },
    { value: 'WN', label: 'WN - Wellington' },
    { value: 'N', label: 'N - Nelson' },
    { value: 'C', label: 'C - Canterbury' },
    { value: 'WC', label: 'WC - West Coast' },
    { value: 'O', label: 'O - Otago' },
    { value: 'S', label: 'S - Southland' },
    { value: 'P', label: 'P - Palmerston North' },
    { value: 'V', label: 'V - Various' },
  ]

  const regions = [
    'Northland',
    'Auckland',
    'Waikato',
    'Bay of Plenty',
    'Gisborne',
    'Hawkes Bay',
    'Taranaki',
    'Manawatu-Whanganui',
    'Wellington',
    'Tasman',
    'Nelson',
    'Marlborough',
    'West Coast',
    'Canterbury',
    'Otago',
    'Southland',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const fullNumber = `${formData.number}${formData.numberSuffix}`

    const subject = encodeURIComponent(`New Driver Profile - ${formData.name} #${fullNumber}`)
    const body = encodeURIComponent(`
=== DRIVER PROFILE SUBMISSION ===

BASIC INFO
----------
Name: ${formData.name}
Number: ${fullNumber}
Email: ${formData.email}
Home Track: ${formData.homeTrack}
Region: ${formData.region}
Years Racing: ${formData.yearsRacing || 'Not specified'}

RACING CLASSES
--------------
${formData.classes.join('\n')}

CAR DETAILS
-----------
Make: ${formData.carMake || 'Not specified'}
Model: ${formData.carModel || 'Not specified'}
Year: ${formData.carYear || 'Not specified'}
Engine: ${formData.carEngine || 'Not specified'}

TEAM & SPONSORS
---------------
Team: ${formData.team || 'Independent'}
Sponsors: ${formData.sponsors || 'None listed'}

ACHIEVEMENTS
------------
${formData.championships || 'None listed'}

SOCIAL MEDIA
------------
Facebook: ${formData.facebook || 'None'}
Instagram: ${formData.instagram || 'None'}
Website: ${formData.website || 'None'}
Photo URL: ${formData.photoUrl || 'None - please email photo to elitespec2019@gmail.com'}

BIO
---
${formData.bio || 'No bio provided'}

---
Submitted: ${new Date().toLocaleString('en-NZ')}
    `)

    window.location.href = `mailto:elitespec2019@gmail.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  const toggleClass = (className: string) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.includes(className)
        ? prev.classes.filter(c => c !== className)
        : [...prev.classes, className]
    }))
  }

  const canProceedStep1 = formData.name && formData.number && formData.email && formData.homeTrack && formData.classes.length > 0
  const canProceedStep2 = true // Optional fields
  const canSubmit = canProceedStep1

  if (submitted) {
    return (
      <>
        <SEO
          title="Driver Profile Submitted"
          description="Your driver profile submission has been sent to SpeedwayHub NZ."
          path="/drivers/create"
        />
        <main id="main-content" className="mx-auto max-w-4xl px-4 py-6">
          <div className="card text-center py-12">
            <div className="text-5xl mb-4">🏁</div>
            <h1 className="text-2xl font-bold text-white mb-2">Profile Submitted!</h1>
            <p className="text-slate-300 mb-4">
              Your email app should have opened with your profile details.
            </p>
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
              <p className="text-sm text-slate-300 mb-2"><strong>Next steps:</strong></p>
              <ol className="text-sm text-slate-400 list-decimal list-inside space-y-1">
                <li>Send the email that opened</li>
                <li>Reply to attach your photo (if you have one)</li>
                <li>We'll add your profile within 24-48 hours</li>
              </ol>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Email didn't open? Send your details to <a href="mailto:elitespec2019@gmail.com" className="text-hub-red">elitespec2019@gmail.com</a>
            </p>
            <div className="flex gap-3 justify-center">
              <a href="/drivers" className="rounded-full bg-hub-red px-6 py-2 text-sm font-semibold text-black hover:bg-hub-red/90 transition-colors">
                View All Drivers
              </a>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setStep(1)
                  setFormData({
                    name: '', number: '', numberSuffix: '', classes: [], homeTrack: '', region: '',
                    team: '', carMake: '', carModel: '', carYear: '', carEngine: '', sponsors: '',
                    championships: '', yearsRacing: '', facebook: '', instagram: '', website: '',
                    photoUrl: '', bio: '', email: '',
                  })
                }}
                className="rounded-full border border-slate-700 px-6 py-2 text-sm font-semibold text-slate-300 hover:border-hub-red/50 transition-colors"
              >
                Submit Another
              </button>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <SEO
        title="Create Driver Profile - SpeedwayHub NZ"
        description="Create your free driver profile on SpeedwayHub NZ. Share your racing career, car details, sponsors and connect with fans across New Zealand."
        path="/drivers/create"
      />
      <main id="main-content" className="mx-auto max-w-4xl px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl mb-2">
            Create Your <span className="text-hub-red">Driver Profile</span>
          </h1>
          <p className="text-sm text-slate-300">
            Get listed in NZ's speedway directory. Free for all drivers.
          </p>
        </header>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <button
                type="button"
                onClick={() => s < step && setStep(s)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step === s ? 'bg-hub-red text-black' :
                  step > s ? 'bg-green-600 text-white cursor-pointer' :
                  'bg-slate-800 text-slate-500'
                }`}
              >
                {step > s ? '✓' : s}
              </button>
              {s < 3 && <div className={`flex-1 h-1 rounded ${step > s ? 'bg-green-600' : 'bg-slate-800'}`} />}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="card space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <span className="text-2xl">👤</span>
                <div>
                  <h2 className="text-lg font-semibold text-white">Basic Information</h2>
                  <p className="text-xs text-slate-400">Required fields marked with *</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 mb-2">
                    Full Name <span className="text-hub-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Michael Pickens"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-hub-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 mb-2">
                    Contact Email <span className="text-hub-red">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-hub-red focus:outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">Not displayed publicly</p>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 mb-2">
                  Racing Number <span className="text-hub-red">*</span>
                </label>
                <div className="flex gap-2 items-center flex-wrap">
                  <input
                    type="text"
                    required
                    value={formData.number}
                    onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value.replace(/[^0-9]/g, '') }))}
                    placeholder="54"
                    maxLength={4}
                    className="w-20 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white text-center font-bold focus:border-hub-red focus:outline-none"
                  />
                  <select
                    value={formData.numberSuffix}
                    onChange={(e) => setFormData(prev => ({ ...prev, numberSuffix: e.target.value }))}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-hub-red focus:outline-none"
                  >
                    {numberSuffixes.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <div className="px-4 py-3 bg-slate-800 rounded-lg">
                    <span className="text-slate-400 text-sm">Preview:</span>
                    <span className="ml-2 font-bold text-hub-red text-lg">{formData.number || '?'}{formData.numberSuffix}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 mb-2">
                    Home Track <span className="text-hub-red">*</span>
                  </label>
                  <select
                    required
                    value={formData.homeTrack}
                    onChange={(e) => setFormData(prev => ({ ...prev, homeTrack: e.target.value }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-hub-red focus:outline-none"
                  >
                    <option value="">Select track...</option>
                    {tracks.map(track => (
                      <option key={track.slug} value={track.slug}>{track.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 mb-2">
                    Region
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-hub-red focus:outline-none"
                  >
                    <option value="">Select region...</option>
                    {regions.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 mb-2">
                  Racing Classes <span className="text-hub-red">*</span>
                  <span className="text-slate-500 ml-2 normal-case">(select all that apply)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableClasses.map(className => (
                    <label
                      key={className}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                        formData.classes.includes(className)
                          ? 'border-hub-red bg-hub-red/10 text-hub-red'
                          : 'border-slate-700 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.classes.includes(className)}
                        onChange={() => toggleClass(className)}
                        className="sr-only"
                      />
                      <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                        formData.classes.includes(className) ? 'bg-hub-red border-hub-red text-black' : 'border-slate-600'
                      }`}>
                        {formData.classes.includes(className) && '✓'}
                      </span>
                      <span className="text-sm">{className}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="rounded-full bg-hub-red px-8 py-3 text-sm font-semibold text-black hover:bg-hub-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Car & Team →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Car & Team */}
          {step === 2 && (
            <div className="card space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <span className="text-2xl">🏎️</span>
                <div>
                  <h2 className="text-lg font-semibold text-white">Car & Team Details</h2>
                  <p className="text-xs text-slate-400">Optional but helps fans learn about you</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 mb-2">Team Name</label>
                  <input
                    type="text"
                    value={formData.team}
                    onChange={(e) => setFormData(prev => ({ ...prev, team: e.target.value }))}
                    placeholder="e.g. Smith Racing"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-hub-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 mb-2">Years Racing</label>
                  <input
                    type="text"
                    value={formData.yearsRacing}
                    onChange={(e) => setFormData(prev => ({ ...prev, yearsRacing: e.target.value }))}
                    placeholder="e.g. 5 years"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-hub-red focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 mb-2">Car Details</label>
                <div className="grid gap-4 md:grid-cols-4">
                  <input
                    type="text"
                    value={formData.carMake}
                    onChange={(e) => setFormData(prev => ({ ...prev, carMake: e.target.value }))}
                    placeholder="Make (e.g. Holden)"
                    className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-hub-red focus:outline-none"
                  />
                  <input
                    type="text"
                    value={formData.carModel}
                    onChange={(e) => setFormData(prev => ({ ...prev, carModel: e.target.value }))}
                    placeholder="Model (e.g. Commodore)"
                    className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-hub-red focus:outline-none"
                  />
                  <input
                    type="text"
                    value={formData.carYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, carYear: e.target.value }))}
                    placeholder="Year"
                    className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-hub-red focus:outline-none"
                  />
                  <input
                    type="text"
                    value={formData.carEngine}
                    onChange={(e) => setFormData(prev => ({ ...prev, carEngine: e.target.value }))}
                    placeholder="Engine (e.g. LS3 V8)"
                    className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-hub-red focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 mb-2">
                  Sponsors
                  <span className="text-slate-500 ml-2 normal-case">(one per line or comma-separated)</span>
                </label>
                <textarea
                  value={formData.sponsors}
                  onChange={(e) => setFormData(prev => ({ ...prev, sponsors: e.target.value }))}
                  placeholder="ABC Auto Parts&#10;Smith & Sons Builders&#10;Local Cafe"
                  rows={3}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-hub-red focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 mb-2">
                  Championships & Achievements
                  <span className="text-slate-500 ml-2 normal-case">(one per line)</span>
                </label>
                <textarea
                  value={formData.championships}
                  onChange={(e) => setFormData(prev => ({ ...prev, championships: e.target.value }))}
                  placeholder="2024 NZ Superstock Champion&#10;2023 North Island Title Runner-up&#10;Huntly Track Champion 2022-2024"
                  rows={4}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-hub-red focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 hover:border-hub-red/50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="rounded-full bg-hub-red px-8 py-3 text-sm font-semibold text-black hover:bg-hub-red/90 transition-colors"
                >
                  Next: Social & Bio →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Social & Bio */}
          {step === 3 && (
            <div className="card space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <span className="text-2xl">📱</span>
                <div>
                  <h2 className="text-lg font-semibold text-white">Social Media & Bio</h2>
                  <p className="text-xs text-slate-400">Help fans find and follow you</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 mb-2">Facebook</label>
                  <input
                    type="url"
                    value={formData.facebook}
                    onChange={(e) => setFormData(prev => ({ ...prev, facebook: e.target.value }))}
                    placeholder="https://facebook.com/..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-hub-red focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 mb-2">Instagram</label>
                  <input
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="https://instagram.com/..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-hub-red focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 mb-2">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-hub-red focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 mb-2">
                  Profile Photo
                </label>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-sm text-slate-300 mb-2">
                    <strong>Option 1:</strong> Paste a link to your photo (from Facebook, Instagram, etc.)
                  </p>
                  <input
                    type="url"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, photoUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-hub-red focus:outline-none mb-3"
                  />
                  <p className="text-sm text-slate-400">
                    <strong>Option 2:</strong> Reply to the submission email with your photo attached. We recommend a clear photo of you with your car.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 mb-2">
                  Bio / About You
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell fans about your racing journey, what got you into speedway, your goals, memorable moments, etc."
                  rows={6}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-hub-red focus:outline-none resize-none"
                />
                <p className="text-xs text-slate-500 mt-1">Tip: A good bio helps fans connect with you</p>
              </div>

              {/* Summary Preview */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h3 className="text-sm font-semibold text-white mb-3">Preview</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-2xl">
                    {formData.photoUrl ? '📷' : '👤'}
                  </div>
                  <div>
                    <p className="font-bold text-white">{formData.name || 'Your Name'}</p>
                    <p className="text-hub-red font-bold">#{formData.number || '?'}{formData.numberSuffix}</p>
                    <p className="text-xs text-slate-400">{formData.classes.join(', ') || 'Racing classes'}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 hover:border-hub-red/50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="rounded-full bg-hub-red px-8 py-3 text-sm font-bold text-black hover:bg-hub-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Profile 🏁
                </button>
              </div>

              <p className="text-xs text-slate-500 text-center">
                By submitting, you agree to have your information publicly displayed on SpeedwayHub NZ.
              </p>
            </div>
          )}
        </form>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Questions? Email <a href="mailto:elitespec2019@gmail.com" className="text-hub-red hover:underline">elitespec2019@gmail.com</a>
          </p>
        </div>
      </main>
    </>
  )
}
