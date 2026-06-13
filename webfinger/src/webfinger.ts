import { LRUCache } from 'lru-cache';
import { eq, or } from 'drizzle-orm';
import * as schema from './db/schema';
import { config } from './env';
import { db } from './db';

interface WebFingerLink {
  rel: string;
  href?: string;
  type?: string;
  titles?: Record<string, string>;
  properties?: Record<string, string | null>;
}

interface WebFingerResponse {
  subject: string;
  links: WebFingerLink[];
  aliases?: string[];
  properties?: Record<string, string | null>;
}

const LOOKUP_CONSTANTS = {
  NOT_FOUND: 'not_found',
  NO_SUBJECT: 'no_subject',
  UNSUPPORTED_RESOURCE_TYPE: 'unsupported_resource_type',
} as const;

type CachedLookupResult = WebFingerResponse | (typeof LOOKUP_CONSTANTS)[keyof typeof LOOKUP_CONSTANTS];

class WebFinger {
  cache = new LRUCache<string, CachedLookupResult>({
    max: 5000,
    ttl: 1000 * 60,
  });

  private parseResource(resource: string) {
    const [resourceType, subject] = resource.split(':');

    return { resourceType, subject };
  }

  private parseSubject(subject: string) {
    const raw = subject.trim();

    const [left, right] = raw.split('@');

    if (!left || !right) {
      return { domain: undefined, raw, username: undefined };
    }

    return { domain: right, raw, username: left };
  }

  private async _lookup(resource: string) {
    const { resourceType, subject } = this.parseResource(resource);

    if (!subject) {
      return LOOKUP_CONSTANTS.NO_SUBJECT;
    }

    switch (resourceType) {
      case 'acct': {
        const { raw, username } = this.parseSubject(subject);

        const [user] = await db
          .select()
          .from(schema.users)
          .where(or(username ? eq(schema.users.user_id, username) : undefined, eq(schema.users.email, raw)))
          .limit(1);

        if (!user) {
          return LOOKUP_CONSTANTS.NOT_FOUND;
        }

        const response: WebFingerResponse = {
          links: [
            {
              href: config.ISSUER_DOMAIN,
              rel: 'http://openid.net/specs/connect/1.0/issuer',
            },
          ],
          subject: `acct:${user.email}`,
        };

        return response;
      }
      default: {
        return LOOKUP_CONSTANTS.UNSUPPORTED_RESOURCE_TYPE;
      }
    }
  }
  async lookup(resource: string) {
    const cacheKey = resource;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const result = await this._lookup(resource);
    this.cache.set(cacheKey, result);

    return result;
  }
}

export { WebFinger, LOOKUP_CONSTANTS };
