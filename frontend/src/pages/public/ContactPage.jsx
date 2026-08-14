import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject is required';
    if (!formData.message.trim()) {
      errs.message = 'Message cannot be empty';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Please provide at least 10 characters';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-app)', paddingBottom: '6rem' }}>
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: 'var(--primary-900)',
        color: 'white',
        padding: '3.5rem 0',
        marginBottom: '3rem',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary-300)', display: 'block', marginBottom: '0.5rem' }}>
            We're Here to Help
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#ffffff' }}>
            Contact & Agro Support
          </h1>
          <p style={{ fontSize: '1.0625rem', color: '#cbd5e1' }}>
            Have questions about farmer onboarding, delivery schedules, or product quality? Reach out to our dedicated support desk.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1050px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2.5rem'
        }} className="contact-grid">
          
          {/* Contact Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', borderRadius: 'var(--radius-md)' }}>
                  <Phone size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary-900)' }}>Farmer & Customer Helpline</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0.5rem 0' }}>Toll-free support for orders and crop inquiries.</p>
                  <strong style={{ color: 'var(--primary-800)', fontSize: '1rem' }}>+91 (800) 547-2673</strong>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#fff3e0', color: '#e65100', borderRadius: 'var(--radius-md)' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary-900)' }}>Email Inquiries</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0.5rem 0' }}>Send us feedback or partnership requests.</p>
                  <strong style={{ color: 'var(--primary-800)', fontSize: '1rem' }}>support@farmersmarket.local</strong>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: 'var(--radius-md)' }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary-900)' }}>Central Dispatch Hub</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0.5rem 0' }}>Agricultural Processing & Collection Center, Pune, Maharashtra, India</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', borderRadius: 'var(--radius-md)' }}>
                  <Clock size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary-900)' }}>Operating Hours</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0.5rem 0' }}>Monday to Saturday: 6:00 AM – 8:00 PM IST</p>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Form Column */}
          <div className="card" style={{ padding: '2.5rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
              Send Us a Direct Message
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Fill in the details below and our regional agro-coordinator will get back to you shortly.
            </p>

            {submitted && (
              <div style={{
                padding: '1.25rem',
                backgroundColor: 'var(--primary-100)',
                color: 'var(--primary-900)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                border: '1px solid var(--primary-300)'
              }}>
                <CheckCircle2 size={22} color="var(--primary-700)" />
                <div>
                  <strong>Inquiry Submitted!</strong> Thank you for reaching out. We will respond within 24 hours.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                placeholder="e.g. Anand Deshmukh"
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                placeholder="e.g. anand@example.com"
                required
              />

              <Input
                label="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                error={errors.subject}
                placeholder="e.g. Bulk crop inquiry / Farmer registration help"
                required
              />

              <div className="form-group">
                <label className="form-label">
                  Your Message <span style={{ color: 'var(--accent-red)' }}>*</span>
                </label>
                <textarea
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry or order query in detail..."
                  className={`form-input ${errors.message ? 'has-error' : ''}`}
                  style={{ width: '100%', resize: 'vertical' }}
                />
                {errors.message && <span className="form-error">{errors.message}</span>}
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth icon={<Send size={18} />}>
                Send Inquiry Message
              </Button>
            </form>
          </div>

        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr 1.2fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
