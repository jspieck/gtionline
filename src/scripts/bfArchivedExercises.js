import { KVDiagram } from './gti-tools';
import { i18n } from './i18n';

// Note: The exercises are declared in a function,
// to allow for automatic retranslation thru vue upon
// switches display languages.
function bfArchivedExecises() {
  return [
    {
      title: `${i18n.t('sheet')} 5: 1a) i)`,
      data: new KVDiagram([
        ['0', '1'],
        ['1', '0'],
      ], 2),
    },
    {
      title: `${i18n.t('sheet')} 5: 1a) ii)`,
      data: new KVDiagram([
        ['0', '0', '1', '0'],
        ['0', '0', '1', '1'],
      ], 3),
    },
    {
      title: `${i18n.t('sheet')} 5: 1a) iii)`,
      data: new KVDiagram([
        ['0', '0', '0', '0'],
        ['1', '1', '0', '0'],
      ], 3),
    },
    {
      title: `${i18n.t('sheet')} 5: 1c)`,
      data: new KVDiagram([
        ['1', '0', '1', '0'],
        ['0', '1', '0', '1'],
        ['1', '0', '1', '0'],
        ['0', '1', '0', '1'],
      ], 4),
    },
    {
      title: `${i18n.t('sheet')} 5: 1d)`,
      data: new KVDiagram([
        ['1', '0', '0', '1'],
        ['0', '1', '1', '0'],
        ['0', '1', '1', '0'],
        ['1', '0', '0', '1'],
      ], 4),
    },
    {
      title: `${i18n.t('sheet')} 6: 2a) i)`,
      data: new KVDiagram([
        ['0', '0', '1', '1'],
        ['1', '0', '1', '1'],
      ], 3),
    },
    {
      title: `${i18n.t('sheet')} 6: 2a) ii)`,
      data: new KVDiagram([
        ['0', '1', '0', '1'],
        ['0', '1', '1', '0'],
      ], 3),
    },
    {
      title: `${i18n.t('sheet')} 7: 1b)`,
      data: new KVDiagram([
        ['-', '0', '1', '0', '0', '1', '0', '-'],
        ['0', '1', '1', '0', '0', '1', '1', '0'],
        ['1', '1', '1', '-', '1', '1', '1', '1'],
        ['-', '1', '1', '0', '0', '1', '1', '1'],
      ], 5),
    },
    {
      title: `${i18n.t('sheet')} 8: 1a)`,
      data: new KVDiagram([
        ['0', '0', '1', '0'],
        ['1', '1', '1', '1'],
        ['1', '1', '1', '1'],
        ['1', '1', '1', '1'],
      ], 4),
    },
    {
      title: `${i18n.t('sheet')} 8: 1b)`,
      data: new KVDiagram([
        ['0', '0', '1', '0'],
        ['1', '1', '1', '0'],
        ['1', '1', '1', '1'],
        ['1', '1', '0', '1'],
      ], 4),
    },
    {
      title: i18n.t('bf_tableWithCyclicRest'),
      data: new KVDiagram([
        ['1', '0', '0', '1'],
        ['1', '-', '-', '0'],
        ['1', '-', '-', '1'],
        ['0', '1', '0', '1'],
      ], 4),
    },
    // {
    //   // Blatt 8: 2) scheint keine gültige Überdeckungstabelle zu sein,
    //   // denn eigentlich müsste abd auch die Einsstelle 11 abdecken
    //   title: 'Blatt 8: 2)',
    //   data: new KVDiagram([ -siehe Kommentar-
    //     ['-', '0', '0', '0', '0', '0', '0', '-'],
    //     ['1', '-', '-', '0', '0', '0', '0', '-'],
    //     ['1', '1', '-', '-', '0', '1', '-', '1'],
    //     ['1', '-', '-', '-', '0', '1', '0', '-'],
    //   ], 5),
    // },
  ];
}

export function bfGetArchivedExerciseTitles() {
  return bfArchivedExecises().map(ae => ae.title);
}

/**
 * @param {number} index
 * @returns {{title: string, data: KVDiagram}}
 */
export function bfLoadArchivedExercise(index) {
  return bfArchivedExecises()[index];
}
