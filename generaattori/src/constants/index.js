// Wizard-vaiheet ja konfiguraatio

export const WIZARD_STEP_NAMES = [
  'Genre',
  'Arkkityyppi', 
  'Olen...',
  'Keho Adjektiivi',
  'Fyysinen Ammatti',
  'Mieli Adjektiivi',
  'Henkinen Ammatti',
  'Sielu Adjektiivi',
  'Mystinen Koulutus',
  'Mystinen Voima',
  'Rotu',
  'Henkilötiedot',
  'Yhteenveto'
];

// UI Konstanit
export const UI_CONSTANTS = {
  APP_TITLE: 'Iltasatu Hahmonluonti',
  LOCAL_STORAGE_KEYS: {
    CURRENT_STEP: 'iltasatu-nykyinen-vaihe',
    WIZARD_STATE: 'iltasatu-wizard-tila'
  }
};

// Kortti-komponentti variantit
export const KORTTI_VARIANTS = {
  NORMAALI: 'normaali',
  PIENI: 'pieni',
  TIIVIS: 'tiivis'
};

export const KORTTI_DEFAULTS = {
  KORKEUS: 300,
  KUVA_KOKO: 'cover',
  TAUSTA_SIJAINTI: 'center'
};