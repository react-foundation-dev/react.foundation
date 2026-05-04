import { describe, expect, it } from 'vitest';

import {
  getCommunityPath,
  getTierBadgeColor,
  getTierColorHex,
  getTierIcon,
} from './community-map-utils';

describe('getCommunityPath', () => {
  it('returns the correct path for a community slug', () => {
    expect(getCommunityPath('react-native-london')).toBe('/communities/react-native-london');
    expect(getCommunityPath('reactjs-sf-bay-area')).toBe('/communities/reactjs-sf-bay-area');
    expect(getCommunityPath('react-berlin')).toBe('/communities/react-berlin');
  });

  it('does not double-slash or drop the prefix', () => {
    const path = getCommunityPath('some-community');
    expect(path.startsWith('/communities/')).toBe(true);
    expect(path).not.toContain('//');
  });
});

describe('getTierColorHex', () => {
  it('returns correct hex for each tier', () => {
    expect(getTierColorHex('platinum')).toBe('#22d3ee');
    expect(getTierColorHex('gold')).toBe('#facc15');
    expect(getTierColorHex('silver')).toBe('#9ca3af');
    expect(getTierColorHex('bronze')).toBe('#fb923c');
  });

  it('returns gray for inactive or paused status regardless of tier', () => {
    expect(getTierColorHex('platinum', 'inactive')).toBe('#6b7280');
    expect(getTierColorHex('gold', 'paused')).toBe('#6b7280');
  });

  it('returns the default blue for unknown tier', () => {
    expect(getTierColorHex()).toBe('#3b82f6');
    expect(getTierColorHex(undefined, 'active')).toBe('#3b82f6');
  });
});

describe('getTierIcon', () => {
  it('returns correct emoji for each tier', () => {
    expect(getTierIcon('platinum')).toBe('💎');
    expect(getTierIcon('gold')).toBe('🏆');
    expect(getTierIcon('silver')).toBe('🥈');
    expect(getTierIcon('bronze')).toBe('🥉');
  });

  it('returns pause icon for inactive or paused status', () => {
    expect(getTierIcon('platinum', 'inactive')).toBe('⏸');
    expect(getTierIcon('gold', 'paused')).toBe('⏸');
  });

  it('returns sparkle for new communities', () => {
    expect(getTierIcon('none', 'new')).toBe('✨');
  });
});

describe('getTierBadgeColor', () => {
  it('returns gradient classes for known tiers', () => {
    expect(getTierBadgeColor('platinum')).toContain('from-cyan-400');
    expect(getTierBadgeColor('gold')).toContain('from-yellow-400');
    expect(getTierBadgeColor('silver')).toContain('from-gray-300');
    expect(getTierBadgeColor('bronze')).toContain('from-orange-300');
  });

  it('returns a fallback class for unknown tier', () => {
    expect(getTierBadgeColor('unknown')).toBe('bg-primary');
  });
});
