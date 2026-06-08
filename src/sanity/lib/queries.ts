import { groq } from 'next-sanity';

export const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0] {
  "destinationsHero": destinationsHero.asset->url,
  "experiencesHero": experiencesHero.asset->url,
  "routesHero": routesHero.asset->url,
  "storiesHero": storiesHero.asset->url,
  "eventsHero": eventsHero.asset->url,
  "visaHero": visaHero.asset->url,
  "travelTradeHero": travelTradeHero.asset->url,
  contactEmail,
  instagramUrl,
  facebookUrl,
  twitterUrl,
  youtubeUrl,
  whatsappUrl,
  socialFeedImages
}`;
