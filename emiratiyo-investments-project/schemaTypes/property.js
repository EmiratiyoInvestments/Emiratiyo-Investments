export default {
  name: 'property',
  title: 'Properties',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Property Title',
      type: 'string',
      description: 'e.g., "Luxury 3BR Apartment in Downtown Dubai"'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 }
    },
    {
      name: 'propertyId',
      title: 'Property ID/Reference',
      type: 'string',
      description: 'Internal reference number'
    },
    {
      name: 'agent',
      title: 'Assigned Agent',
      type: 'reference',
      to: [{ type: 'agent' }],
      description: 'Agent responsible for this property'
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text'
        }
      ]
    },
    {
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text'
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption'
            }
          ]
        }
      ]
    },
    {
      name: 'excerpt',
      title: 'Short Description/Excerpt',
      type: 'text',
      rows: 3,
      description: 'Brief summary shown on listing cards'
    },
    {
      name: 'description',
      title: 'Full Description',
      type: 'blockContent',
      description: 'Detailed property description'
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Property price in AED or your currency'
    },
    {
      name: 'priceLabel',
      title: 'Price Label',
      type: 'string',
      description: 'Optional custom price text (e.g., "Starting from", "POA")'
    },
    {
      name: 'propertyType',
      title: 'Property Type',
      type: 'string',
      options: {
        list: [
          { title: 'Apartment', value: 'apartment' },
          { title: 'Villa', value: 'villa' },
          { title: 'Townhouse', value: 'townhouse' },
          { title: 'Penthouse', value: 'penthouse' },
          { title: 'Studio', value: 'studio' },
          { title: 'Duplex', value: 'duplex' },
          { title: 'Land/Plot', value: 'land' },
          { title: 'Commercial', value: 'commercial' },
          { title: 'Office', value: 'office' }
        ]
      }
    },
    {
      name: 'status',
      title: 'Property Status',
      type: 'string',
      options: {
        list: [
          { title: 'For Sale', value: 'for-sale' },
          { title: 'For Rent', value: 'for-rent' },
          { title: 'Sold', value: 'sold' },
          { title: 'Rented', value: 'rented' },
          { title: 'Off-Plan', value: 'off-plan' }
        ]
      }
    },
    {
      name: 'bedrooms',
      title: 'Bedrooms',
      type: 'number',
      description: 'Number of bedrooms'
    },
    {
      name: 'bathrooms',
      title: 'Bathrooms',
      type: 'number',
      description: 'Number of bathrooms'
    },
    {
      name: 'area',
      title: 'Area/Size',
      type: 'number',
      description: 'Property size in square feet or square meters'
    },
    {
      name: 'areaUnit',
      title: 'Area Unit',
      type: 'string',
      options: {
        list: [
          { title: 'Square Feet (sq ft)', value: 'sqft' },
          { title: 'Square Meters (sq m)', value: 'sqm' }
        ]
      }
    },
    {
      name: 'location',
      title: 'Location/Address',
      type: 'object',
      fields: [
        {
          name: 'area',
          title: 'Area/Community',
          type: 'string',
          description: 'e.g., Downtown Dubai, Palm Jumeirah'
        },
        {
          name: 'city',
          title: 'City',
          type: 'string'
        },
        {
          name: 'fullAddress',
          title: 'Full Address',
          type: 'text',
          rows: 2
        }
      ]
    },
    {
      name: 'completionStatus',
      title: 'Completion Status',
      type: 'string',
      options: {
        list: [
          { title: 'Ready', value: 'ready' },
          { title: 'Off-Plan', value: 'off-plan' },
          { title: 'Under Construction', value: 'under-construction' }
        ]
      }
    },
    {
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
        list: [
          { title: 'Swimming Pool', value: 'pool' },
          { title: 'Gym/Fitness Center', value: 'gym' },
          { title: 'Parking', value: 'parking' },
          { title: '24/7 Security', value: 'security' },
          { title: 'Balcony', value: 'balcony' },
          { title: 'Garden', value: 'garden' },
          { title: 'Maid\'s Room', value: 'maids-room' },
          { title: 'Study Room', value: 'study' },
          { title: 'Central AC', value: 'ac' },
          { title: 'Built-in Wardrobes', value: 'wardrobes' },
          { title: 'Kitchen Appliances', value: 'kitchen-appliances' },
          { title: 'Pets Allowed', value: 'pets-allowed' },
          { title: 'Concierge Service', value: 'concierge' },
          { title: 'Kids Play Area', value: 'kids-play-area' },
          { title: 'BBQ Area', value: 'bbq' },
          { title: 'Sauna', value: 'sauna' },
          { title: 'Jacuzzi', value: 'jacuzzi' },
          { title: 'Private Beach Access', value: 'beach-access' }
        ]
      }
    },
    {
      name: 'featured',
      title: 'Featured Property',
      type: 'boolean',
      description: 'Show this property prominently on the properties page'
    },
    {
      name: 'virtualTourUrl',
      title: 'Virtual Tour URL',
      type: 'url',
      description: 'Link to 360° virtual tour or video tour'
    },
    {
      name: 'developer',
      title: 'Developer Name',
      type: 'string',
      description: 'For off-plan properties'
    },
    {
      name: 'handoverDate',
      title: 'Handover Date',
      type: 'date',
      description: 'Expected handover date for off-plan properties'
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime'
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'e.g., Luxury, Investment, Waterfront, Family-Friendly'
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string'
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price',
      media: 'mainImage',
      status: 'status',
      agent: 'agent.name'
    },
    prepare(selection) {
      const { title, price, status, agent } = selection
      const priceFormatted = price ? `AED ${price.toLocaleString()}` : 'Price not set'
      const statusLabel = status ? ` • ${status}` : ''
      const agentLabel = agent ? ` • Agent: ${agent}` : ''
      return {
        ...selection,
        subtitle: `${priceFormatted}${statusLabel}${agentLabel}`
      }
    }
  }
}