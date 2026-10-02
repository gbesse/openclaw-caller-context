import { Type } from 'typebox';
import { definePluginEntry } from 'openclaw/plugin-sdk/plugin-entry';
import { lookupCaller } from './lookup.js';

export default definePluginEntry({
  id: 'caller-context',
  name: 'Caller Context',
  description: 'FR : recherche d’appelant ; EN: caller lookup; ES: búsqueda de llamantes',
  register(api) {
    const config = api.pluginConfig ?? {};
    api.registerTool({
      name: 'caller_context_lookup',
      description:
        'FR : chercher un contexte d’appelant avant de répondre ; EN: look up caller context before replying; ES: buscar el contexto del llamante antes de responder',
      parameters: Type.Object({ callerId: Type.String() }),
      async execute(_id, params) {
        const result = await lookupCaller({
          contactsFile: config.contactsFile,
          callerId: params.callerId,
          timeoutMs: config.timeoutMs ?? 800,
          locale: config.locale ?? 'fr',
        });
        return { content: [{ type: 'text', text: JSON.stringify(result) }], details: result };
      },
    });
  },
});
