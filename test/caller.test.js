import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, chmod } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { lookupCaller } from '../lookup.js';

test('caller lookup is exact, private, bounded, and has localized fallback', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'caller-context-'));
  const contactsFile = join(directory, 'contacts.json');
  await writeFile(
    contactsFile,
    JSON.stringify([{ callerId: '+33123456789', summary: 'Client with an open quote' }]),
  );
  await chmod(contactsFile, 0o600);
  assert.deepEqual(await lookupCaller({ contactsFile, callerId: '+33123456789' }), {
    status: 'found',
    context: 'Client with an open quote',
    fallback: null,
  });
  for (const [locale, expected] of [['fr', /vérifier votre dossier/], ['en', /check your record/], ['es', /consultar su expediente/]]) {
    const unknown = await lookupCaller({ contactsFile, callerId: '+33123456780', locale });
    assert.equal(unknown.status, 'unknown');
    assert.match(unknown.fallback, expected);
  }
  const invalid = await lookupCaller({ contactsFile, callerId: '123456789' });
  assert.equal(invalid.status, 'unknown');
  await chmod(contactsFile, 0o644);
  assert.equal(
    (await lookupCaller({ contactsFile, callerId: '+33123456789' })).status,
    'unavailable',
  );
});
