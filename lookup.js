import { readFile, stat } from 'node:fs/promises';

const fallback = {
  fr: 'Je vais vérifier votre dossier pendant notre échange.',
  en: 'I will check your record as we speak.',
  es: 'Voy a consultar su expediente mientras hablamos.',
};

export async function lookupCaller({ contactsFile, callerId, timeoutMs = 800, locale = 'fr' }) {
  const result = { status: 'unknown', context: null, fallback: fallback[locale] ?? fallback.fr };
  if (!contactsFile || !/^\+[1-9]\d{7,14}$/.test(callerId ?? '')) return result;
  const deadline = Math.min(2000, Math.max(50, Number(timeoutMs) || 800));
  const controller = new AbortController();
  let timer;
  const load = async () => {
    const info = await stat(contactsFile);
    if (!info.isFile() || info.size > 1024 * 1024 || (info.mode & 0o077) !== 0) {
      return { ...result, status: 'unavailable' };
    }
    const bytes = await readFile(contactsFile, { signal: controller.signal });
    const contacts = JSON.parse(bytes.toString('utf8'));
    if (!Array.isArray(contacts)) return { ...result, status: 'unavailable' };
    const matches = contacts.filter((item) => item?.callerId === callerId);
    if (matches.length !== 1)
      return { ...result, status: matches.length ? 'ambiguous' : 'unknown' };
    const summary = matches[0].summary;
    if (typeof summary !== 'string' || summary.length > 500 || !summary.trim()) {
      return { ...result, status: 'unavailable' };
    }
    return { status: 'found', context: summary, fallback: null };
  };
  try {
    return await Promise.race([
      load(),
      new Promise((resolve) => {
        timer = setTimeout(() => {
          controller.abort();
          resolve({ ...result, status: 'timeout' });
        }, deadline);
      }),
    ]);
  } catch {
    return { ...result, status: 'unavailable' };
  } finally {
    clearTimeout(timer);
  }
}
