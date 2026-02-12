export default {
  name: 'author',
  title: 'Authors',
  type: 'document',
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
      options: { hotspot: true }
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'Investment Expert', value: 'investment-expert' },
          { title: 'Real Estate Analyst', value: 'real-estate-analyst' },
          { title: 'Market Researcher', value: 'market-researcher' },
          { title: 'Guest Writer', value: 'guest-writer' }
        ]
      }
    }
  ]
}