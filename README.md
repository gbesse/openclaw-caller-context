# Caller Context — OpenClaw

## Français

Cette extension fournit l’outil `caller_context_lookup`. Il recherche une correspondance exacte de numéro E.164 dans un fichier local privé, retourne un résumé limité à 500 caractères et propose une phrase de repli lorsque la recherche échoue. Les doublons restent ambigus. Le fichier doit être un tableau JSON de `{ "callerId": "+33123456789", "summary": "..." }`, limité à 1 Mio et protégé par les permissions `600`.

Installer depuis la racine du dépôt avec `openclaw plugins install -l . --force`, puis `openclaw plugins enable caller-context`. Configurer `plugins.entries.caller-context.config` :

```json
{
  "contactsFile": "/chemin/prive/contacts.json",
  "timeoutMs": 800,
  "locale": "fr"
}
```

Le fichier peut être préparé à partir d’un export incwo avec l’accord de l’utilisateur ; l’extension ne contacte pas incwo. L’agent doit appeler l’outil avant de répondre si son flux le permet. Le plugin `voice-call` d’OpenClaw ne fournit pas encore le hook de préchargement avant la première réponse demandé dans [ce ticket](https://github.com/openclaw/openclaw/issues/79055) : cette extension ne garantit donc pas que le premier tour vocal reçoit le contexte.

## English

This extension provides `caller_context_lookup`. It matches an exact E.164 number in a private local JSON file, returns a summary capped at 500 characters, and supplies a fallback phrase on failure. Duplicate numbers remain ambiguous. The file is an array of `{ "callerId": "+33123456789", "summary": "..." }`, at most 1 MiB, with `600` permissions.

Install it with the OpenClaw commands above and configure `plugins.entries.caller-context.config` as shown, adjusting `contactsFile` and `locale`. A user-approved incwo export may populate the file; this extension does not contact incwo. The agent must call the tool before replying when its flow permits. OpenClaw's `voice-call` plugin does not yet offer the pre-answer preload hook requested in the linked issue, so this extension cannot guarantee context in the first spoken turn.

## Español

Esta extensión ofrece `caller_context_lookup`. Busca una coincidencia exacta de número E.164 en un archivo JSON local privado, devuelve un resumen de hasta 500 caracteres y ofrece una frase alternativa si falla la búsqueda. Los números duplicados quedan ambiguos. El archivo es una lista de `{ "callerId": "+33123456789", "summary": "..." }`, de 1 MiB como máximo y con permisos `600`.

Instálala con los comandos de OpenClaw anteriores y configura `plugins.entries.caller-context.config` como se muestra, ajustando `contactsFile` y `locale`. Un export de incwo aprobado por el usuario puede alimentar el archivo; esta extensión no contacta con incwo. El agente debe llamar a la herramienta antes de responder cuando su flujo lo permita. El plugin `voice-call` de OpenClaw aún no ofrece el hook de precarga anterior a la primera respuesta solicitado en el enlace, por lo que esta extensión no garantiza contexto en el primer turno hablado.

## Vérification / Verification / Verificación

Français : exécuter `npm test` depuis la racine. La CI vérifie également le contenu du paquet. Le test utilise un fichier de contacts temporaire ; il ne lance pas OpenClaw. Le code est publié sous licence MIT ; aucun paquet npm ni ClawHub n'est encore publié.

English: run `npm test` from the root. CI also checks package contents. The test uses a temporary contacts file; it does not start OpenClaw. The code is MIT licensed; no npm or ClawHub package has been published yet.

Español: ejecuta `npm test` desde la raíz. La CI también comprueba el contenido del paquete. La prueba usa un archivo de contactos temporal; no inicia OpenClaw. El código se publica bajo licencia MIT; todavía no hay paquetes publicados en npm ni ClawHub.
