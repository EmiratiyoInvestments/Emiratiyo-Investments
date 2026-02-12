export default {
  name: 'agent',
  title: 'Agents',
  type: 'document',
  validation: Rule => Rule.custom((fields) => {
    const hasPhone = fields?.phone
    const hasEmail = fields?.email
    const hasWhatsapp = fields?.whatsapp
    
    if (!hasPhone && !hasEmail && !hasWhatsapp) {
      return 'At least one contact method (Phone, Email, or WhatsApp) is required'
    }
    return true
  }),
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 }
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Agent profile photo'
    },
    {
      name: 'role',
      title: 'Role/Title',
      type: 'string',
      description: 'e.g., Senior Property Consultant, Real Estate Advisor',
      options: {
        list: [
          { title: 'Senior Property Consultant', value: 'senior-property-consultant' },
          { title: 'Property Consultant', value: 'property-consultant' },
          { title: 'Real Estate Advisor', value: 'real-estate-advisor' },
          { title: 'Listing Agent', value: 'listing-agent' },
          { title: 'Sales Manager', value: 'sales-manager' },
          { title: 'Leasing Specialist', value: 'leasing-specialist' }
        ]
      }
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'e.g., +971 50 123 4567'
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'e.g., agent@company.com',
      validation: Rule => Rule.email()
    },
    {
      name: 'whatsapp',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'e.g., +971501234567 (no spaces or special characters)'
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      description: 'Short biography about the agent'
    },
    {
      name: 'licenseNumber',
      title: 'License Number',
      type: 'string',
      description: 'Real estate license number (optional)'
    },
    {
      name: 'languages',
      title: 'Languages',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Languages spoken by the agent'
    },
    {
      name: 'specialization',
      title: 'Specialization',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Luxury Properties', value: 'luxury' },
          { title: 'Off-Plan Sales', value: 'off-plan' },
          { title: 'Rental Properties', value: 'rental' },
          { title: 'Commercial Properties', value: 'commercial' },
          { title: 'Investment Properties', value: 'investment' },
          { title: 'Villas', value: 'villas' },
          { title: 'Apartments', value: 'apartments' }
        ]
      },
      description: 'Agent areas of expertise'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image'
    }
  }
}