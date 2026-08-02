/**
 * Speisekarte, Saisonkarte, Mittagstisch & Allergen-Legende.
 * Inhalte 1:1 aus der bestehenden Website übernommen.
 * Pflege ausschließlich hier – Preise/Gerichte bei Bedarf anpassen.
 *
 * Preisformat: deutsche Schreibweise ohne Währungszeichen ("13,50"),
 * das "€" ergänzt die Anzeige-Komponente.
 */

export type Dish = {
  name: string;
  desc?: string;
  price?: string;
  /** Allergen-/Zusatzstoff-Codes wie auf der Karte, z. B. "a,b,d,o,2,3,10" */
  codes?: string;
};

export type MenuCategory = {
  id: string;
  title: string;
  note?: string;
  items: Dish[];
};

/* -------------------------------------------------------------------------- */
/*  Speisekarte                                                               */
/* -------------------------------------------------------------------------- */
export const speisekarte: MenuCategory[] = [
  {
    id: "aperitifs",
    title: "Aperitifs",
    note: "Auswahl – die vollständige Getränkekarte erhalten Sie im Restaurant.",
    items: [
      { name: "Hugo", desc: "Prosecco mit Soda & Holunderblütensyrup auf Eis mit frischer Minze", price: "6,80", codes: "o,7,13" },
      { name: "Aperol Spritz", desc: "Aperol mit Prosecco & Soda auf Eis", price: "6,80", codes: "o,2,7,13" },
      { name: "Lillet Berry", desc: "Lillet, Schweppes & Wild Berry auf Eis", price: "6,80", codes: "o,2,7,13" },
      { name: "Prosecco Schorle", desc: "auf Eis", price: "5,50", codes: "o,7,13" },
      { name: "Martini", desc: "Bianco o Rosso auf Eis", price: "5,50", codes: "o,2,8,13" },
    ],
  },
  {
    id: "vorspeisen",
    title: "Vorspeisen",
    items: [
      { name: "Pizza carrettiera", desc: "Pizzabrot mit Mozzarella, Rohschinken, Kirschtomaten & Ruccola", price: "13,50" },
      { name: "Bruschetta Classica", desc: "mit Tomatenwürfel", price: "6,50", codes: "a,o" },
      { name: "Antipasto Misto", desc: "Parmaschinken, verschiedene Salamisorten, Käse und mediterranes, eingelegtes Gemüse", price: "19,80", codes: "b,k,1,2,3,10,11" },
      { name: "Pizzabrot Tomate", desc: "mit Knoblauch", price: "8,20", codes: "a,b,d,o" },
      { name: "Caprese", desc: "Tomaten und Mozzarella an Olivenöl und Balsamico", price: "8,20", codes: "b,c,3" },
      { name: "Pizzabrot", desc: "mit Knoblauch", price: "7,20", codes: "a,b,d,o" },
      { name: "Bruschetta mit Räucherlachs", desc: "auf Rucola", price: "8,90", codes: "a,e,o" },
      { name: "Tomatensalat mit Zwiebeln", desc: "auf gemischten Blattsalaten (vegan)", price: "6,80" },
      { name: "Bruschetta Mozzarella", desc: "mit Tomatenwürfel, Mozzarella und Oliven", price: "7,60", codes: "a,b,c,o,3,6,8" },
      { name: "Gemischter Salat", desc: "nach Saison", price: "6,40", codes: "a,b,c,d,1,2,3,4" },
    ],
  },
  {
    id: "suppen",
    title: "Suppen",
    items: [
      { name: "Hausgemachter Minestrone", desc: "Italienische Gemüsesuppe", price: "6,50", codes: "k" },
      { name: "Tomatencremesuppe", desc: "aus frischen Tomaten", price: "6,50", codes: "b" },
    ],
  },
  {
    id: "salate",
    title: "Salate",
    items: [
      { name: "Salat Toscana", desc: "Kalbsschnitzel vom Grill mit Oliven, Tomaten, Zucchini, Mozzarella, Lauchzwiebeln und Blattsalaten an Olivenöldressing", price: "24,80", codes: "b,c,3,6,8" },
      { name: "Insalata al Tonno", desc: "mit Thunfisch und Zwiebeln an Essig und Öl", price: "15,90", codes: "e" },
      { name: "Insalata Pescatore", desc: "mit Meeresfrüchten an Olivenöldressing", price: "19,80", codes: "f,g" },
      { name: "Insalata Contadina", desc: "mit gebratener Hähnchenbrust- und Speckstreifen mit Hausdressing", price: "15,60", codes: "b,d,i,3" },
      { name: "Insalata Marinara", desc: "mit Knoblauchscampi und Hausdressing", price: "15,80", codes: "b,d,f,i,3" },
      { name: "Insalata Rind", desc: "mit gebratenen Rindsstreifen & Hausdressing", price: "15,80" },
      { name: "Insalata sul Mare", desc: "mit gegrillten Lachsstreifen und Hausdressing", price: "15,80", codes: "b,d,e,i,3" },
    ],
  },
  {
    id: "pasta",
    title: "Pasta",
    items: [
      { name: "Penne al Salmone", desc: "mit Räucherlachs in Tomatensahnesauce", price: "15,20", codes: "a,b,d,e,o" },
      { name: "Spaghetti ai Scampi", desc: "mit Gemüsestreifen, Knoblauch und Olivenöl", price: "17,20", codes: "a,d,f,g,o" },
      { name: "Gnocci al Gorgonzola", desc: "in feiner Gorgonzola-Sahnesauce und Spinat", price: "13,50", codes: "a,b,d,o" },
      { name: "Bavette allo Scoglio", desc: "mit Meeresfrüchten in Tomatensauce", price: "16,80", codes: "a,b,d,o,f,g" },
      { name: "Tortellini alla panna", desc: "mit Hinterschinken in leichter Sahnesauce", price: "13,20", codes: "a,b,d,o,1,3,4,10" },
      { name: "Casarecce Mare e Monti", desc: "Pasta mit Lauch, Kalbsstreifen & gegrillten Lachsstreifen in leichter Sahnesauce", price: "15,60", codes: "a,b,d,o,f,g" },
      { name: "Spaghetti alla carbonara", desc: "mit Hinterschinken in leichter Sahnesauce und Eigelb", price: "13,50", codes: "a,b,d,3,4,6" },
      { name: "Casarecce Monte Cristo", desc: "mit frischem hausgemachtem Basilikumpesto und Schrimps", price: "15,20", codes: "a,b,c,d,f,g,o,8" },
      { name: "Penne alla Gorgonzola", desc: "in feiner Gorgonzola-Sahnesauce und Spinat", price: "13,20", codes: "a,b,d,o" },
      { name: "Pappardelle ai Gamberetti", desc: "Bandnudeln mit Krabben und Champignons in feiner Tomatensauce", price: "15,60", codes: "a,b,d,o,g" },
      { name: "Penne all'Arrabiata", desc: "mit Knoblauch, Chili und Tomatensauce (scharf)", price: "12,80", codes: "a,b,d,o" },
      { name: "Pappardelle al Pesto Verde", desc: "mit Hähnchenbruststreifen, Zucchini, frischen Kirschtomaten in leichter Sahnesauce", price: "15,40", codes: "a,b,c,d,o,8" },
      { name: "Spaghetti alla Bolognese", desc: "mit würziger Hackfleischtomatensauce", price: "12,50", codes: "a,b,d,o,1" },
      { name: "Spaghetti al Pesto Verde", desc: "mit frischem hausgemachtem Basilikumpesto", price: "12,50", codes: "a,b,d,o,l" },
      { name: "Spaghetti Parma", desc: "Spaghetti „aglio e olio“ auf Rucola und Parmaschinken umlegt", price: "13,80", codes: "a,d,o" },
      { name: "Spaghetti Napoli", desc: "mit feiner Tomatensauce und Basilikum", price: "11,50", codes: "a,b,d,o" },
      { name: "Bavette al Pesto Rosso", desc: "mit Hähnchenbruststreifen und frischem Pesto aus getrockneten Tomaten in feiner Sahnesauce", price: "13,80", codes: "a,b,c,d,o,8" },
      { name: "Spaghetti „aglio e olio“", desc: "mit Knoblauch, Olivenöl und Chili", price: "10,50", codes: "a,d,o" },
      { name: "Casarecce alla Caprese", desc: "Pasta mit frischen Tomaten, Zucchini, zerlassenem Mozzarella in Olivenöl und Knoblauch", price: "13,80", codes: "a,b,c,d,o,3" },
      { name: "Pappardelle con Pollo", desc: "Bandnudeln mit Hähnchenbruststreifen, Erbsen und Sahnesauce", price: "13,80", codes: "a,b,d,o" },
    ],
  },
  {
    id: "pizza",
    title: "Pizza",
    items: [
      { name: "Pizza Rustica", desc: "mit Parmaschinken, Rucola und Gorgonzola", price: "14,20", codes: "a,b,d,o,2,3,10" },
      { name: "Pizza Mista", desc: "mit Hinterschinken, Salami, Champignons und Artischocken", price: "13,80", codes: "a,b,d,k,o,1,2,3,4,6,10,11" },
      { name: "Pizza Salmone", desc: "mit Räucherlachs und Zwiebeln", price: "13,80", codes: "a,b,d,e,o,2,3,10" },
      { name: "Pizza Tonno", desc: "mit Thunfisch und Zwiebeln", price: "13,80", codes: "a,b,d,e,o,g,2,3,10" },
      { name: "Pizza 4 formaggi", desc: "mit Mozzarella, Grana Padano, Gorgonzola und Edamer", price: "13,80", codes: "a,b,c,d,o,2,3,6,10" },
      { name: "Pizza ai Frutti di Mare", desc: "mit Meeresfrüchten und Zwiebeln", price: "14,60", codes: "a,b,d,f,g,o,2,3,10" },
      { name: "Pizza 4 Stagioni", desc: "mit Hinterschinken, Paprika, Artischocken und Champignons", price: "13,60", codes: "a,b,d,o,1,2,3,4,6,10" },
      { name: "Pizza Fantasia", desc: "mit Hinterschinken, Champignons, Knoblauch und Gorgonzola", price: "13,60", codes: "a,b,d,o,1,2,3,4,10" },
      { name: "Pizza Calzone", desc: "mit Hinterschinken und Champignons", price: "12,80", codes: "a,b,d,o,2,3,4,10" },
      { name: "Pizza Vulcano", desc: "mit Salami, Champignons und Ei", price: "12,80", codes: "a,b,d,k,o,1,2,3,10,11" },
      { name: "Pizza Vegetaria", desc: "mit Oliven, Artischocken, Paprika und Champignons", price: "13,20", codes: "a,b,d,o,2,3,6,8,10" },
      { name: "Pizza Hawaii", desc: "mit Hinterschinken und Ananas", price: "12,50", codes: "a,b,d,o,2,3,10" },
      { name: "Pizza Regina", desc: "mit Spinat, Speck und Knoblauch", price: "12,80", codes: "a,b,d,o,2,3,10" },
      { name: "Pizza Diavolo", desc: "mit Salami, Peperoni und Chili", price: "12,50", codes: "a,b,d,k,o,1,2,3,10,11" },
      { name: "Pizza due Gusti", desc: "mit Hinterschinken und Champignons", price: "12,80", codes: "a,b,d,o,2,3,10" },
      { name: "Pizza Caprese", desc: "mit frischen Tomaten, Mozzarella und Basilikum", price: "12,80", codes: "a,b,d,o,2,3,10" },
      { name: "Pizza Salami", price: "11,50", codes: "a,b,d,k,o,1,2,3,10,11" },
      { name: "Pizza Prosciutto", desc: "mit Hinterschinken", price: "11,50", codes: "a,b,d,o,2,3,10" },
      { name: "Pizza Margherita", price: "9,50", codes: "a,b,d,o,2,3,10" },
      { name: "Pizza Funghi", desc: "mit frischen Champignons", price: "11,50", codes: "a,b,d,o,2,3,10" },
    ],
  },
  {
    id: "fleisch",
    title: "Fleisch",
    items: [
      { name: "Tagliata con Grana e Rucola", desc: "geschnittenes, argentinisches Rindersteak vom Grill auf Rucola und Grana Padanospalten mit Olivenöl verfeinert", price: "29,80", codes: "b,c,2,3,6" },
      { name: "Piccata alla Milanese", desc: "Kalbsschnitzel ummantelt mit Grana Padano und Ei gebraten auf Tomatenspaghetti", price: "27,80", codes: "a,b,c,d,o,2,3,6" },
      { name: "Argentinisches Rindersteak vom Grill", desc: "mit Gemüseantipasto und Tomaten-Mozzarella umlegt", price: "29,80", codes: "b,3" },
      { name: "Paniertes Schnitzel vom Kalb", desc: "mit Pommes Frites", price: "22,50", codes: "a,b,d,o" },
      { name: "Argentinisches Rindersteak in Pfeffersauce", desc: "mit Bratkartoffeln", price: "29,80", codes: "a,b,d,3,4,6" },
      { name: "Paniertes Schnitzel vom Rind", desc: "mit Pommes Frites", price: "24,50", codes: "a,b,d,o" },
    ],
  },
  {
    id: "fisch",
    title: "Fisch",
    items: [
      { name: "Gegrillter Lachs", desc: "mit mediterranem Gemüse", price: "26,80", codes: "e" },
    ],
  },
  {
    id: "gratinati",
    title: "Gratinati",
    items: [
      { name: "Penne al forno", desc: "mit Hähnchenbruststreifen, frischen Champignons, Erbsen in Tomatensahnesauce", price: "13,50", codes: "a,b,d,o" },
      { name: "Gnocchi ai 4 Formaggi", desc: "mit verschiedenen Käsesorten im Ofen überbacken", price: "13,20", codes: "a,b,c,d,o,1,2,3,4,10" },
      { name: "Tortellini della Nonna", desc: "mit Schinken, Spinat, Sahne und Käse überbacken", price: "13,50", codes: "a,b,c,d,o,1,2,3,4,10" },
      { name: "Hausgemachte Lasagne", desc: "in Hackfleischtomatensauce mit Erbsen und Eiern", price: "13,20", codes: "a,b,d,k,o,1" },
    ],
  },
  {
    id: "dessert",
    title: "Dessert",
    items: [
      { name: "Schoko Soufflé", price: "5,80", codes: "a,b,c,d" },
      { name: "Panna cotta", desc: "hausgemacht", price: "5,80", codes: "b,c,d,1,2" },
      { name: "Tiramisú Classico", desc: "Klassischer, hausgemachter Tiramisú", price: "5,80", codes: "a,b,c,d,o,2,3,13" },
      { name: "Sorbetto al Limone", desc: "Zitroneneis mit Prosecco", price: "5,50", codes: "b,c,d,o,7,13" },
      { name: "Tartufo Classico", desc: "Halbgefrorenes aus Zabaioneeis umhüllt mit Kakao", price: "5,80", codes: "b,c" },
      { name: "Tartufo Bianco", desc: "Halbgefrorenes aus Zabaioneeis umhüllt mit geraspelter weißer Schokolade", price: "5,80", codes: "b,c" },
      { name: "Gemischtes Eis", desc: "Portion Eis aus Vanille-, Schoko- und Erdbeereis", price: "3,60", codes: "b,c,d" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Saisonkarte                                                               */
/* -------------------------------------------------------------------------- */
export const saisonkarte = {
  season: "Sommer Saison 2026",
  items: [
    { name: "Penne al Polipo", desc: "mit Krabben, Tintenfisch Pulpo & Aubergine in pikanter Tomatensauce", price: "15,80" },
    { name: "Casarecce Veggie", desc: "Pasta mit frischen Gemüse & Kirschtomaten", price: "14,50" },
    { name: "Risotto ai Frutti di Mare", desc: "mit Meeresfrüchten in Weisswein Sugo", price: "16,80" },
    { name: "Risotto ai Porcini", desc: "mit Hähnchenbruststreifen & Steinpilzen mit Sahne verfeinert", price: "15,60" },
    { name: "Rindersteak vom Grill", desc: "mit Rosmarinkartoffeln & Paprika", price: "27,90" },
    { name: "Rindersteak vom Grill", desc: "mit Aglio e Olio Spaghetti auf Rucola Salat", price: "27,90" },
    { name: "Salat mit Fischknusperle", desc: "mit Hausdressing", price: "15,60" },
  ] as Dish[],
};

/* -------------------------------------------------------------------------- */
/*  Mittagstisch                                                              */
/* -------------------------------------------------------------------------- */
export const mittagstisch = {
  period: "Dienstag bis Freitag",
  time: "12:00 – 14:00 Uhr",
  note: "Zu allen Gerichten (außer dem Tagessalat) gibt es im Restaurant einen Beilagensalat. Bei Straßenverkauf ist kein Salat enthalten.",
  items: [
    { name: "Tagessalat", desc: "mit Chicken Nuggets", price: "9,90" },
    { name: "Penne Frikadellen", desc: "mit Hackfleischbällchen in Tomatensugo", price: "10,50" },
    { name: "Bavette alla Casa", desc: "mit Hähnchenbruststreifen & Lauch in leichter Sahnesauce", price: "10,80" },
    { name: "Risotto Veggie", desc: "mit Gemüse", price: "10,80" },
    { name: "Tortelloni alla Panna", desc: "Nudeln mit Fleischfüllung & Schinken-Sahnesauce", price: "10,80" },
    { name: "Pizza I", desc: "mit Salami & Paprika", price: "10,20" },
    { name: "Pizza II", desc: "mit Oliven, Artischocken & Champignons", price: "10,20" },
    { name: "Pizza III", desc: "Pizza Calzone gefüllt mit Schinken & Champignons", price: "10,20" },
  ] as Dish[],
};

/* -------------------------------------------------------------------------- */
/*  Allergene & Zusatzstoffe (gastronomie-übliche Kennzeichnung)              */
/*  Hinweis: Bitte gegen die interne Kennzeichnung des Restaurants abgleichen.*/
/* -------------------------------------------------------------------------- */
export const allergene = {
  additives: [
    { code: "1", label: "mit Farbstoff" },
    { code: "2", label: "mit Konservierungsstoff" },
    { code: "3", label: "mit Antioxidationsmittel" },
    { code: "4", label: "mit Geschmacksverstärker" },
    { code: "5", label: "geschwefelt" },
    { code: "6", label: "geschwärzt" },
    { code: "7", label: "mit Phosphat" },
    { code: "8", label: "mit Milcheiweiß" },
    { code: "9", label: "koffeinhaltig" },
    { code: "10", label: "mit Süßungsmittel" },
    { code: "11", label: "enthält eine Phenylalaninquelle" },
    { code: "12", label: "chininhaltig" },
    { code: "13", label: "mit Alkohol" },
  ],
  allergens: [
    { code: "a", label: "Glutenhaltiges Getreide" },
    { code: "b", label: "Krebstiere" },
    { code: "c", label: "Eier" },
    { code: "d", label: "Fisch" },
    { code: "e", label: "Erdnüsse" },
    { code: "f", label: "Sojabohnen" },
    { code: "g", label: "Milch / Laktose" },
    { code: "h", label: "Schalenfrüchte (Nüsse)" },
    { code: "i", label: "Sellerie" },
    { code: "j", label: "Senf" },
    { code: "k", label: "Sesamsamen" },
    { code: "l", label: "Schwefeldioxid und Sulfite" },
    { code: "m", label: "Lupinen" },
    { code: "n", label: "Weichtiere" },
    { code: "o", label: "Weitere Zutaten – bitte Personal ansprechen" },
  ],
  note:
    "Die Kennzeichnung folgt der gastronomieüblichen Systematik. Bei Fragen zu Allergenen und Zusatzstoffen berät Sie unser Personal gerne persönlich.",
};
