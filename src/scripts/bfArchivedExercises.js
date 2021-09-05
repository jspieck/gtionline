import { KVDiagram } from './gti-tools';

const bfArchivedExecises = [
  {
    title: 'Blatt 5: 1d)',
    data: new KVDiagram([
      ['1', '0', '0', '1'],
      ['0', '1', '1', '0'],
      ['0', '1', '1', '0'],
      ['1', '0', '0', '1'],
    ], 4),
  },
  {
    title: 'Blatt 7: 1b)',
    data: new KVDiagram([
      ['-', '0', '1', '0', '0', '1', '0', '-'],
      ['0', '1', '1', '0', '0', '1', '1', '0'],
      ['1', '1', '1', '-', '1', '1', '1', '1'],
      ['-', '1', '1', '0', '0', '1', '1', '1'],
    ], 5),
  },
  {
    title: 'Blatt 8: 1a)',
    data: new KVDiagram([
      ['0', '0', '1', '0'],
      ['1', '1', '1', '1'],
      ['1', '1', '1', '1'],
      ['1', '1', '1', '1'],
    ], 4),
  },
  {
    title: 'Blatt 8: 1b)',
    data: new KVDiagram([
      ['0', '0', '1', '0'],
      ['1', '1', '1', '0'],
      ['1', '1', '1', '1'],
      ['1', '1', '0', '1'],
    ], 4),
  },
  {
    title: 'Zyklische Resttabelle',
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

export function bfGetArchivedExerciseTitles() {
  return bfArchivedExecises.map(ae => ae.title);
}

/**
 * @param {number} index
 * @returns {{title: string, data: KVDiagram}}
 */
export function bfLoadArchivedExercise(index) {
  return bfArchivedExecises[index];
}
