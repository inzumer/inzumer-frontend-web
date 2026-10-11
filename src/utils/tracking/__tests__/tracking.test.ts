import { trackingId } from '../tracking';

describe('trackingId', () => {
  it('should build kebab-case ids from a scope, a kind and a name', () => {
    expect(trackingId('contact', 'input', 'emailAddress')).toBe('contact-input-email-address');
    expect(trackingId('menu', 'button', 'open')).toBe('menu-button-open');
  });

  it('should accept several name parts, numbers and odd characters', () => {
    expect(trackingId('projects', 'button', 'tab', 2, 'paymentsV2')).toBe(
      'projects-button-tab-2-payments-v2',
    );
    expect(trackingId('rail', 'link', ' GitHub #1 ')).toBe('rail-link-git-hub-1');
  });
});
