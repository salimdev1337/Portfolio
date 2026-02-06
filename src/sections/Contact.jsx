import { useState } from 'react';
import { Card, Button, Input, Textarea } from '../components/common';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const contactInfo = [
    {
      icon: '📧',
      label: 'Email',
      value: 'salimmtiri17@gmail.com',
      link: 'mailto:salimmtiri17@gmail.com'
    },
    {
      icon: '💼',
      label: 'LinkedIn',
      value: 'Salim Mtiri',
      link: 'https://linkedin.com/in/salim-mtiri'
    },
    {
      icon: '💻',
      label: 'GitHub',
      value: '@salimmtiri',
      link: 'https://github.com/salimdev1337'
    },
    {
      icon: '📱',
      label: 'Phone',
      value: '+216 28 194 566',
      link: 'tel:+21628194566'
    },
    {
      icon: '📸',
      label: 'Instagram',
      value: '@salim.mtiri',
      link: 'https://instagram.com/salim_mtiri'
    }
  ];

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    } else if (formData.subject.trim().length > 100) {
      newErrors.subject = 'Subject must be less than 100 characters';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('API_ENDPOINT', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Success
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');

      // Clear error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding pb-40 mb-20">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-pixel text-3xl md:text-4xl text-[var(--text-primary)] mb-4">
            {'<CONTACT_ME/>'}
          </h2>
          <p className="font-mono text-sm text-[var(--text-secondary)] max-w-2xl mx-auto">
            Have a quest in mind? Let's team up and build something awesome!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card>
            <h3 className="font-pixel text-sm text-[var(--accent)] mb-6">{'> SEND_MESSAGE'}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="font-mono text-xs text-[var(--text-primary)] mb-2 block">
                  Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="font-mono text-[10px] text-red-500 mt-1">❌ {errors.name}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="font-mono text-xs text-[var(--text-primary)] mb-2 block">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="font-mono text-[10px] text-red-500 mt-1">❌ {errors.email}</p>
                )}
              </div>

              {/* Subject Input */}
              <div>
                <label htmlFor="subject" className="font-mono text-xs text-[var(--text-primary)] mb-2 block">
                  Subject *
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  className={errors.subject ? 'border-red-500' : ''}
                />
                {errors.subject && (
                  <p className="font-mono text-[10px] text-red-500 mt-1">❌ {errors.subject}</p>
                )}
              </div>

              {/* Message Textarea */}
              <div>
                <label htmlFor="message" className="font-mono text-xs text-[var(--text-primary)] mb-2 block">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or idea..."
                  rows={5}
                  className={errors.message ? 'border-red-500' : ''}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.message && (
                    <p className="font-mono text-[10px] text-red-500">❌ {errors.message}</p>
                  )}
                  <p className="font-mono text-[10px] text-[var(--text-secondary)] ml-auto">
                    {formData.message.length}/1000
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SENDING...' : '📤 SEND MESSAGE'}
              </Button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="bg-[var(--success)] bg-opacity-20 border-2 border-[var(--success)] px-4 py-3 animate-fadeIn">
                  <p className="font-mono text-xs text-[var(--success)]">
                    ✅ Message sent successfully! I'll get back to you soon.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-500 bg-opacity-20 border-2 border-red-500 px-4 py-3 animate-fadeIn">
                  <p className="font-mono text-xs text-red-500">
                    ❌ Oops! Something went wrong. Please try again or email me directly.
                  </p>
                </div>
              )}
            </form>
          </Card>

          {/* Contact Info & Direct Links */}
          <div className="space-y-6">
            {/* Direct Contact Info */}
            <Card>
              <h3 className="font-pixel text-sm text-[var(--accent)] mb-6">{'> DIRECT_CONTACT'}</h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    target={info.link.startsWith('http') ? '_blank' : undefined}
                    rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 p-3 bg-[var(--bg-primary)] border-2 border-[var(--border)] hover:border-[var(--accent)] transition-colors group"
                  >
                    <span className="text-2xl">{info.icon}</span>
                    <div>
                      <p className="font-mono text-[10px] text-[var(--text-secondary)]">{info.label}</p>
                      <p className="font-mono text-xs text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                        {info.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </Card>

            {/* Availability Status */}
            <Card className="bg-[var(--accent)] bg-opacity-10 border-[var(--accent)]">
              <div className="text-center">
                <div className="text-4xl mb-3">💼</div>
                <h3 className="font-pixel text-sm text-[var(--accent)] mb-2">CURRENTLY SEEKING</h3>
                <p className="font-mono text-xs text-[var(--text-primary)] mb-2">
                  6-Month Internship
                </p>
                <p className="font-mono text-[10px] text-[var(--text-secondary)]">
                  February - July 2026
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-[var(--success)] rounded-full animate-pulse"></div>
                  <span className="font-mono text-xs text-[var(--success)]">AVAILABLE</span>
                </div>
              </div>
            </Card>

            {/* Fun Message */}
            <Card className="text-center">
              <p className="font-pixel text-[10px] text-[var(--accent)] mb-2">⚡ QUICK RESPONSE TIME</p>
              <p className="font-mono text-xs text-[var(--text-secondary)]">
                Usually replies within 24 hours
                <br />
                (faster if there's espresso ☕)
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
