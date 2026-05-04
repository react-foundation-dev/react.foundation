export function getCommunityPath(slug: string): string {
  return `/communities/${slug}`;
}

export function getTierColorHex(tier?: string, status?: string): string {
  if (status === 'inactive' || status === 'paused') {
    return '#6b7280'; // gray-500
  }

  switch (tier) {
    case 'platinum':
      return '#22d3ee'; // cyan-400
    case 'gold':
      return '#facc15'; // yellow-400
    case 'silver':
      return '#9ca3af'; // gray-400
    case 'bronze':
      return '#fb923c'; // orange-400
    default:
      return '#3b82f6'; // blue-500 for active without tier
  }
}

export function getTierBadgeColor(tier: string): string {
  switch (tier) {
    case 'platinum':
      return 'bg-gradient-to-r from-cyan-400 to-blue-400';
    case 'gold':
      return 'bg-gradient-to-r from-yellow-400 to-orange-400';
    case 'silver':
      return 'bg-gradient-to-r from-gray-300 to-gray-400';
    case 'bronze':
      return 'bg-gradient-to-r from-orange-300 to-orange-400';
    default:
      return 'bg-primary';
  }
}

export function getTierIcon(tier: string, status?: string): string {
  if (status === 'inactive') return '⏸';
  if (status === 'paused') return '⏸';
  if (status === 'new') return '✨';

  switch (tier) {
    case 'platinum':
      return '💎';
    case 'gold':
      return '🏆';
    case 'silver':
      return '🥈';
    case 'bronze':
      return '🥉';
    default:
      return '📍';
  }
}
