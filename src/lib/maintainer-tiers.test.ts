import { describe, expect, it } from 'vitest';

import { ecosystemLibraries } from './maintainer-tiers';
import { NPMCollector } from './ris/collectors/npm-collector';

function findLibrary(owner: string, name: string) {
  return ecosystemLibraries.find((library) => library.owner === owner && library.name === name);
}

describe('ecosystemLibraries', () => {
  it('tracks community-approved ecosystem library requests', () => {
    expect(findLibrary('ant-design', 'ant-design')).toMatchObject({
      category: 'ui',
      tier: 1,
    });
    expect(findLibrary('invertase', 'react-native-firebase')).toMatchObject({
      category: 'data',
      tier: 2,
    });
  });

  it('does not contain duplicate repository targets', () => {
    const repositoryKeys = ecosystemLibraries.map((library) => `${library.owner}/${library.name}`);

    expect(new Set(repositoryKeys).size).toBe(repositoryKeys.length);
  });

  it('maps requested repositories to their primary npm packages', () => {
    expect(NPMCollector.getPackageName('ant-design', 'ant-design')).toBe('antd');
    expect(NPMCollector.getPackageName('invertase', 'react-native-firebase')).toBe(
      '@react-native-firebase/app'
    );
  });
});
