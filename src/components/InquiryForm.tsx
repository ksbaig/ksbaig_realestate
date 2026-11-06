import { useState, type FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'

function InquiryForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const subject = `Property inquiry from ${String(formData.get('name'))}`
    const body = [
      `Name: ${formData.get('name')}`,
      `Phone / WhatsApp: ${formData.get('phone')}`,
      `Email: ${formData.get('email') || 'Not provided'}`,
      `Budget: ${formData.get('budget') || 'Not provided'}`,
      `Preferred contact: ${formData.get('preferredContact')}`,
      '',
      `Message: ${formData.get('message')}`,
    ].join('\n')
    const mailto = `mailto:info@ksbigrealestate.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    setSubmitted(true)
    window.location.href = mailto
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="visually-hidden" htmlFor="inquiry-name">Your name</label>
        <input id="inquiry-name" name="name" autoComplete="name" maxLength={100} placeholder="Your name" required />
        <label className="visually-hidden" htmlFor="inquiry-phone">Phone or WhatsApp</label>
        <input id="inquiry-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="Phone / WhatsApp" required />
        <label className="visually-hidden" htmlFor="inquiry-email">Email address (optional)</label>
        <input id="inquiry-email" name="email" type="email" autoComplete="email" maxLength={150} placeholder="Email (optional)" />
        <label className="visually-hidden" htmlFor="inquiry-budget">Your budget</label>
        <input id="inquiry-budget" name="budget" maxLength={60} placeholder="Budget e.g. 50 lakh PKR" />
        <label className="visually-hidden" htmlFor="inquiry-contact">Preferred contact method</label>
        <select id="inquiry-contact" name="preferredContact" defaultValue="Phone">
          <option value="Phone">Contact me by phone</option>
          <option value="WhatsApp">Contact me on WhatsApp</option>
          <option value="Email">Contact me by email</option>
        </select>
        <label className="visually-hidden" htmlFor="inquiry-message">What are you looking for?</label>
        <textarea
          id="inquiry-message"
          name="message"
          maxLength={2000}
          placeholder="What are you looking for? (e.g. 5 marla plot, rented house, file merging)"
          required
          rows={4}
        />
      </div>
      <button className="button button--gradient form-submit" type="submit">
        Send Inquiry <ArrowRight size={16} aria-hidden="true" />
      </button>
      {submitted && (
        <p className="form-status" role="status">
          Your email app should open with your inquiry ready to send.
        </p>
      )}
    </form>
  )
}

export default InquiryForm
