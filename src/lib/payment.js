// Square Application ID
export const APPLICATION_ID: String = process.env.NODE_ENV === 'production' ? 'sq0idp-v7U5CDrd7BsGSyBaJ5ubow' : 'sandbox-sq0idb-Ss2jZjlouAOTJY6g25cTzw';
// Square Location ID
export const LOCATION_ID: String = process.env.NODE_ENV === 'production' ? '04Z8B2G52FQXP' : 'Z50ZZE434AGC9';

export const CLASS_TYPES: { [String]: String } = {
  FUNDAMENTALS_ONLY: 'FUNDAMENTALS_ONLY',
  LEVEL_2_ONLY: 'LEVEL_2_ONLY',
  LEVEL_3_ONLY: 'LEVEL_3_ONLY',
  FUNDAMENTALS_AND_LEVEL_2: 'FUNDAMENTALS_AND_LEVEL_2',
  FUNDAMENTALS_AND_LEVEL_3: 'FUNDAMENTALS_AND_LEVEL_3',
  DANCE_ONLY: 'DANCE_ONLY',
  TEST_CLASS: 'TEST_CLASS'
}

export function classPrice(classType: String): Number {
  switch(classType) {
    case CLASS_TYPES.FUNDAMENTALS_ONLY:
    case CLASS_TYPES.LEVEL_2_ONLY:
    case CLASS_TYPES.LEVEL_3_ONLY:
      return 15;
    case CLASS_TYPES.FUNDAMENTALS_AND_LEVEL_2:
    case CLASS_TYPES.FUNDAMENTALS_AND_LEVEL_3:
      return 25;
    case CLASS_TYPES.DANCE_ONLY:
      return 8;
    default:
      return 1;
  }
}