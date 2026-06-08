import { destinationType } from "./destinationType";
import { experienceType } from "./experienceType";
import { storyType } from "./storyType";
import { routeType } from "./routeType";
import { eventType } from "./eventType";
import { itineraryType } from "./itineraryType";
import { bookingType } from "./bookingType";
import { analyticsEventType } from "./analyticsEventType";
import { internationalTripType } from "./internationalTripType";
import { productType } from "./productType";
import { siteSettingsType } from "./siteSettingsType";
import { calendarEventType } from "./calendarEventType";
import { aiLogType } from "./aiLogType";
import { agentTaskType } from "./agentTaskType";
import { SchemaTypeDefinition } from "sanity";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    destinationType,
    experienceType,
    routeType,
    itineraryType,
    internationalTripType,
    productType,
    bookingType,
    storyType,
    eventType,
    siteSettingsType,
    analyticsEventType,
    calendarEventType,
    aiLogType,
    agentTaskType,
  ],
};
