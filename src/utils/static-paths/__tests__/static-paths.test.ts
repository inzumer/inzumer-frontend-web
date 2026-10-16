import { localePaths } from '../static-paths';

describe('static paths', () => {
  it('should give one path per language', () => {
    expect(localePaths()).toEqual([{ params: { lang: 'es' } }, { params: { lang: 'en' } }]);
  });
});
