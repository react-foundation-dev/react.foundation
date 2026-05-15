import { describe, expect, it } from 'vitest';

import { REACT_COMMUNITIES } from './communities';

describe('REACT_COMMUNITIES', () => {
  it('includes the approved React Michigan community entry', () => {
    expect(REACT_COMMUNITIES).toContainEqual(
      expect.objectContaining({
        id: 'react-michigan',
        name: 'React Michigan',
        slug: 'react-michigan',
        city: 'Grand Rapids',
        region: 'Michigan',
        country: 'United States',
        timezone: 'America/Detroit',
        verified: true,
        verification_status: 'verified',
      })
    );
  });
});
