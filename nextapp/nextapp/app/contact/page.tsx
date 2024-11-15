'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from 'lucide-react'
import { User } from '@/lib/lib-firebase'
import { RootLayout } from '@/components/ui/RootLayout'

export default function ContactPage({ user }: { user: User }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', { name, email, message })
    // Reset form fields
    setName('')
    setEmail('')
    setMessage('')
    // Show a success message to the user
    alert('Thank you for your message. We will get back to you soon!')
  }

  return (
    <RootLayout>
    <div className="min-h-screen flex flex-col">
  

      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="mb-6">We'd love to hear from you. Please fill out this form and we will get in touch with you shortly.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder="Your message"
                    rows={4}
                  />
                </div>
                <Button type="submit">Send Message</Button>
              </form>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>support@rankcandidates.ai</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>123 AI Street, San Francisco, CA 94105</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">FAQs</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">How does the AI ranking work?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Our AI analyzes resumes based on the job requirements and custom criteria you provide, then ranks candidates accordingly.</p>
                </div>
                <div>
                  <h3 className="font-semibold">Is my data secure?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Yes, we use industry-standard encryption and security measures to protect your data. We never share your information with third parties.</p>
                </div>
                <div>
                  <h3 className="font-semibold">Can I customize the ranking criteria?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Our platform allows you to review and adjust the AI-generated criteria to best fit your specific needs.</p>
                </div>
                <div>
                  <h3 className="font-semibold">How accurate is the AI ranking?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Our AI model is highly accurate and continuously improving. However, we always recommend using it as a tool to assist your decision-making process, not replace it entirely.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
    </RootLayout>
  )
}