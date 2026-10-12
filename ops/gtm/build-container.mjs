// Writes ops/gtm/inzumer-gtm-container.json: the Tag Manager setup to import (Admin → Import container → Merge).
// Usage: node ops/gtm/build-container.mjs G-XXXXXXX
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const measurementId = process.argv[2] ?? 'G-XXXXXXXXXX';

/** GTM's built-in "Initialization - All Pages" trigger. */
const INITIALIZATION = '2147479573';

const ids = { container: '0', account: '0' };
const base = { accountId: ids.account, containerId: ids.container };
const template = (key, value) => ({ type: 'TEMPLATE', key, value });

const variables = [
  {
    ...base,
    variableId: '1',
    name: 'GA4 Measurement ID',
    type: 'c',
    parameter: [template('value', measurementId)],
  },
  {
    ...base,
    variableId: '2',
    name: 'Tracking ID',
    type: 'jsm',
    notes: 'The closest element with an id: clicks on an icon inside a button still count.',
    parameter: [
      template(
        'javascript',
        "function () {\n  var element = {{Click Element}};\n  var tracked = element && element.closest && element.closest('[id]');\n  return tracked ? tracked.id : undefined;\n}",
      ),
    ],
  },
];

const visibility = (triggerId, name, elementId) => ({
  ...base,
  triggerId,
  name,
  type: 'ELEMENT_VISIBILITY',
  parameter: [
    template('selectorType', 'ID'),
    template('elementId', elementId),
    template('firingFrequency', 'ONCE_PER_ELEMENT'),
    { type: 'BOOLEAN', key: 'useDomChangeListener', value: 'true' },
    { type: 'BOOLEAN', key: 'useOnScreenDuration', value: 'false' },
    template('onScreenRatio', '1'),
  ],
});

const triggers = [
  {
    ...base,
    triggerId: '10',
    name: 'Clicks - tracked ids',
    type: 'CLICK',
    filter: [
      {
        type: 'MATCH_REGEX',
        parameter: [
          template('arg0', '{{Tracking ID}}'),
          template('arg1', '-(button|link|switch)-'),
        ],
      },
    ],
  },
  visibility('11', 'Contact - sent', 'contact-status-success'),
  visibility('12', 'Contact - failed', 'contact-status-error'),
];

const ga4Event = (tagId, name, eventName, triggerId, parameters = []) => ({
  ...base,
  tagId,
  name,
  type: 'gaawe',
  parameter: [
    template('eventName', eventName),
    template('measurementIdOverride', '{{GA4 Measurement ID}}'),
    ...(parameters.length > 0
      ? [
          {
            type: 'LIST',
            key: 'eventSettingsTable',
            list: parameters.map(([parameter, value]) => ({
              type: 'MAP',
              map: [template('parameter', parameter), template('parameterValue', value)],
            })),
          },
        ]
      : []),
  ],
  firingTriggerId: [triggerId],
  tagFiringOption: 'ONCE_PER_EVENT',
});

const tags = [
  {
    ...base,
    tagId: '20',
    name: 'Google tag - GA4',
    type: 'googtag',
    parameter: [template('tagId', '{{GA4 Measurement ID}}')],
    firingTriggerId: [INITIALIZATION],
    tagFiringOption: 'ONCE_PER_EVENT',
  },
  ga4Event('21', 'GA4 - ui_click', 'ui_click', '10', [['element_id', '{{Tracking ID}}']]),
  ga4Event('22', 'GA4 - generate_lead', 'generate_lead', '11', [['form', 'contact']]),
  ga4Event('23', 'GA4 - contact_error', 'contact_error', '12', [['form', 'contact']]),
];

const container = {
  exportFormatVersion: 2,
  exportTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
  containerVersion: {
    path: `accounts/${ids.account}/containers/${ids.container}/versions/0`,
    ...base,
    containerVersionId: '0',
    container: {
      path: `accounts/${ids.account}/containers/${ids.container}`,
      ...base,
      name: 'inzumer.com',
      publicId: 'GTM-5Z7WHKZT',
      usageContext: ['WEB'],
    },
    builtInVariable: [{ ...base, type: 'CLICK_ELEMENT', name: 'Click Element' }],
    variable: variables,
    trigger: triggers,
    tag: tags,
  },
};

const out = fileURLToPath(new URL('./inzumer-gtm-container.json', import.meta.url));
writeFileSync(out, `${JSON.stringify(container, null, 2)}\n`);
console.log(`Written ${out} with ${measurementId}`);
