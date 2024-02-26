import {
  Interaction,
  InteractionStyle,
} from '../../../../command-service/command-service.interface';

export const rollcallTemplate = (data: {
  participants: string[];
  notParticipants: string[];
}) => `
Rollcall started. Available commands: 
here: join the rollcall
not-here: remove your presence from the rollcall
rollcall-pull: pulls down the rollcall message

${data.participants.length} present${
  data.participants.length > 1 ? 's' : ''
}: ${data.participants.join(', ')}
${data.notParticipants.length} NOT present${
  data.participants.length > 1 ? 's' : ''
}: ${data.notParticipants.join(', ')}
`;

export const rollcallInteractions: Interaction[] = [
  {
    id: 'hereButton',
    label: '👍 Here',
    style: InteractionStyle.Primary,
  },
  {
    id: 'notHereButton',
    label: '👎 Not Here',
    style: InteractionStyle.Primary,
  },
  {
    id: 'pullDownButton',
    label: '👇 Pull Down',
    style: InteractionStyle.Secondary,
  },
  {
    id: 'excuseMeButton',
    label: 'Excuse me',
    style: InteractionStyle.Secondary,
  },
];

export const excuses = [
  'Raga, temo che la mia vecchia auto abbia deciso di lasciarmi a piedi proprio stasera. Porcoddio, non posso unirmi al rollcall.',
  'Man, ho un appuntamento con una donna che ho incontrato alla biblioteca. Sì, lo so, sembra improbabile, ma è vero. Non posso giocare stasera.',
  'Porcoddio, ho appena scoperto che il mio cane ha mangiato il mio joystick. Non posso volare stasera, raga.',
  "Raga, ho appena ricevuto una chiamata dal cinema. Hanno bisogno di me per una proiezione d'emergenza di un regista Ungaro che il mio capo ha convinto a presentare nel nostro cinema. Non posso unirmi al rollcall.",
  'Man, ho appena rovesciato il caffè sulla mia tastiera. Non posso unirmi al rollcall, temo.',
  'Raga, ho appena incontrato una donna a Voghera. Sì, lo so, sembra improbabile, ma è vero. Non posso giocare stasera.',
  "Porcoddio, ho appena scoperto che il mio vecchio amico da scuola al quale é morta la nonna l'altro giorno è in città. Non posso unirmi al rollcall, raga.",
  'Raga, ho appena ricevuto una chiamata dal mio capo. Devo lavorare fino a tardi stasera. Non posso unirmi al rollcall.',
  'Raga, la mia vecchia auto ha deciso di fare le bizze proprio stasera. Sono bloccato in mezzo al nulla, tra Voghera e il cinema. Porcoddio, non posso unirmi al rollcall stasera.',
  "Man, ho appena finito di leggere 'Il nome della rosa' e sono troppo preso per pensare a volare in IL2 Sturmovik. Vi faccio sapere quando torno sulla terra.",
  'Raga, ho appena incontrato una donna al bar. Non so come sia successo, ma mi ha detto che le piacciono gli uomini che lavorano in biblioteca. Non posso unirmi al gioco stasera, temo.',
  'Raga, sono stato invitato a un evento letterario stasera. Non posso rifiutare, sono un bibliotecario dopo tutto. Non posso unirmi al rollcall.',
  'Porcoddio, sono stato chiamato per un turno extra al cinema. Non posso unirmi al rollcall stasera, oso dire.',
  'Porcoddio, ho appena scoperto che la mia ex si è fidanzata. Sono troppo abbattuto per volare stasera.',
  'Man, ho appena finito un libro che mi ha lasciato senza parole. Ho bisogno di tempo per elaborare. Non posso unirmi al rollcall stasera.',
  'Raga, ho appena avuto un incidente con la mia vecchia auto. Non è nulla di grave, ma sono troppo scosso per volare stasera.',
  'Porcoddio, ho appena scoperto che la mia ex si è sposata. Sono troppo sconvolto per unirmi al rollcall stasera.',
  "Man, ho appena finito di leggere '1984' e sono troppo preso per pensare a volare in IL2 Sturmovik. Vi faccio sapere quando torno sulla terra.",
  'Raga, ho appena scoperto che il mio joystick è stato rapito da un gruppo di piccoli gabbiani ribelli. Sì, gabbiani. Hanno formato una squadra di volo e stanno organizzando una protesta contro la mancanza di briciole di pane nei parchi. Non posso volare stasera, temo.',
  'Man, ho ricevuto una chiamata dall’Associazione degli Amanti dei Libri Antichi. Hanno bisogno del mio aiuto per decifrare un manoscritto criptico. Dicono che contiene le ricette segrete della nonna di Leonardo da Vinci. Non posso unirmi al rollcall, porcoddio.',
  'Raga, ho appena ricevuto una lettera da un avvocato. Sembra che il mio gatto abbia intentato causa contro di me per violazione dei diritti felini. Dice che ho negato il suo accesso al tappeto e alla finestra. Oso dire, è una questione legale seria. Non posso unirmi al rollcall stasera.',
  'Porcoddio, ho appena scoperto che il mio vecchio amico, il barista di nome Luigi, è in città. Dice che ha inventato una nuova bevanda chiamata ‘Caffè Supersonico’. Contiene tre tipi di caffè, un po’ di razzo e una spruzzata di vaniglia. Non posso unirmi al rollcall, raga.',
  'Raga, ho appena ricevuto una chiamata dal mio capo al cinema. Hanno bisogno di me per proiettare un film d’arte sperimentale girato interamente con patate. Dicono che sarà il nuovo capolavoro della cinematografia tuberosa. Non posso unirmi al rollcall stasera, vi faccio sapere.',
  'Man, ho appena ricevuto una lettera da un fan segreto. Dice che sono l’incarnazione virtuale di Dante Alighieri. Mi chiede di scrivere la Divina Commedia 2.0. Non posso giocare stasera, temo di deludere il mio fan letterario ultraterreno.',
  'Raga, ho appena scoperto che il mio vicino di casa, il signor Rossi, è un ex pilota di elicotteri spaziali. Dice che ha bisogno del mio aiuto per riparare il suo tostapane a fusione nucleare. Non posso unirmi al rollcall, porcoddio.',
  'Porcoddio, ho appena ricevuto una chiamata dal Museo delle Cose Assurde. Hanno bisogno che io identifichi un oggetto misterioso trovato nel seminterrato. Sembra una penna a sfera, ma emette luce ultravioletta. Non posso unirmi al rollcall stasera, oso dire.',
];
