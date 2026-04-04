import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  useCdn: true,
  apiVersion: '2024-01-01',
  // token is intentionally omitted — never expose write tokens in the browser.
  // Read-only public data is served via the CDN without a token.
})

const builder = createImageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)