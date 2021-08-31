import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: 'de',
  fallbackLocale: 'de',
  messages: {
    de: {
      numVarInput: 'Anzahl an Variablen',
      confirm: 'Bestätigen',
      varNaming: 'Benennung der Variablen',
      kvDiagram: 'KV-Diagramm',
      numeralSystem: 'Zahlensysteme',
      polyadic: 'Polyadisch',
      floatingPoint: 'Gleitkommazahlen',
      functionMin: 'Funktionsminimierung',
      exercises: 'Übungsaufgaben',
      generateEx: 'Aufgabe Generieren',
      generate: 'Generieren',
      addition: 'Addition',
      subtraction: 'Subtraktion',
      multiplication: 'Multiplikation',
      division: 'Division',
      ownSolution: 'Eigene Lösung',
      signBit: 'Vorzeichenbit',
      correctSolution: 'Korrekte Lösung',
      solution: 'Lösung',
      exponentBits: 'Exponent',
      fractionBits: 'Mantisse',
      attRound: 'Runden nicht vergessen!',
      attSolve: 'Bitte vorher selber versuchen, die Aufgabe zu lösen!',
      step: 'Schritt',
      freeCalculation: 'Freie Berechnung',
      operationSelect: 'Operationsauswahl',
      firstFloatingPoint: 'Erste Gleitkommazahl',
      secondFloatingPoint: 'Zweite Gleitkommazahl',
      operand: 'Operand',
      decimal: 'Dezimalzahl',
      binary: 'Binärzahl',
      inputNumber: 'Zahl eingeben',
      fpformat: 'Floating Point Format',
      check: 'Check',
      values: 'Werte',
      // neu
      // general
      conversion: 'Konvertierung',
      conversionExercise1: 'Konvertiere: ',
      conversionExercise2: 'in eine IEEE-Flieskommazahl einer Exponenten-Länge von: ',
      steps: 'Schritte',
      repeatMinuend: 'wiederhole\\ Minuend',
      doDivision: 'Divison durchführen',
      doMultiplication: 'Multiplikation durchführen',
      getDescription: 'Beschreibung',
      approach: 'Lösungsweg',
      gti: 'Grundlagen der Technischen Informatik',
      disclaimer: 'Haftungsausschluss:<br>'
        + 'Dies ist ein durch die GTI-Online-Webseite automatisch generierter Lösungsweg. Jedwehige'
        + ' Ausgabe kann als Entwurf angesehen werden und ist somit <u>inoffiziell</u>.<br>'
        + 'Wir geben uns große Mühe um für euch ein zuverlässiges und korrektes Hilfsmittel zu '
        + 'entwickeln. Trotzdem kann es sein, dass der Lösungsweg oder die Lösung selbst Fehler enthalten. '
        + 'Gründe hierfür sind unteranderem eine spezielle Browserversion. '
        + 'Bitte überprüfen Sie den Inhalt bevor Sie diesen zum Beispiel in einer Klausur verwenden.',
      example: 'Beispiel',
      composition: 'Zusammensetzung',
      negativeSummand: 'Eine Addition mit einem negativen Wert wird behandelt wie eine Subtraktion.',
      negativeSubtrahend: 'Ein negativer Subtrahend wirkt sich wie ein positiver Summand aus.',
      negativeMinuendSubtrahend: 'Vereinfachung für den Fall \\( - x - y \\rightarrow - (x + y) \\)',
      addWithZero: 'Bei einer Addition mit 0 wird der jeweils andere Summand nicht verändert',
      subWithZero: 'Bei einer Subtraktion mit 0 wird der jeweils andere Wert nicht verändert',
      divWithZero: 'Bei einer Division mit 0 im Zähler ist das Ergebnis immer 0.',
      mulWithZero: 'Bei einer Multiplikation mit 0 ist das Ergebnis immer 0.',
      zeroDivision: 'Eine Division durch 0 ist nicht möglich!',
      // values
      value: 'Wert',
      givenValues: 'Werte der übertragenen Zahlen',
      leftValue: 'Zahl links',
      rightValue: 'Zahl rechts',
      firstSummand: '1. Summand',
      secondSummand: '2. Summand',
      firstFactor: '1. Faktor',
      secondFactor: '2. Faktor',
      numerator: 'Zähler',
      denominator: 'Nenner',
      minuend: 'Minuend',
      subtrahend: 'Subtrahend',
      sign: 'Vorzeichen',
      // exponent
      exponent: 'Exponent',
      adjustExponents: 'Die Exponenten beider Zahlen müssen angeglichen werden.',
      addExponents: 'Die Exponenten beider Zahlen müssen addiert werden.',
      subtExponents: 'Die Exponenten beider Zahlen müssen subtrahiert werden.',
      diffExponent: 'Differenz Exponent',
      smallerExponent: 'Es wird immer der kleinere vom größeren Exponenten subtrahiert',
      resDiffExponent: 'daher ergibt sich eine Differenz von',
      newExponent: 'neuer Exponent',
      considerExponent: 'Exponent beachten',
      // mantissa
      mantissa: 'Mantisse',
      solutionIsNan: 'Die Mantisse muss nicht berechnet werden, da das Ergebnis sicher NaN ist.',
      solutionIsInf: 'Die Mantisse muss nicht berechnet werden, da das Ergebnis sicher unendlich ist.',
      solutionIsZero: 'Die Mantisse muss nicht berechnet werden, da das Ergebnis sicher 0 ist.',
      mulMantissa: 'Die Mantissen beider Zahlen müssen multipliziert werden.',
      addMantissa: 'Die Mantissen beider Zahlen müssen addiert werden.',
      divMantissa: 'Die Mantissen beider Zahlen müssen dividiert werden.',
      newMantissa: 'Neue Mantisse',
      zeroMantissa: 'Mantissen sind identisch \\( \\rightarrow \\) neue Mantissa ist 0-Mantisse',
      newMantissaIs: 'Die neue Mantisse ist somit',
      equalMantissa: 'Die Mantissen sind identisch, \\( \\rightarrow \\) Exponent wird um 1 erhöht Mantisse bleibt gleich',
      equalMantissaDiv: 'Die beiden Mantissen sind gleich, daher wird keine binäre Division durchgeführt',
      adjustSmallerMantissa: 'Anpassen der kleineren Mantisse',
      shiftMantissa: 'Shiften der kleineren Mantisse',
      mantissaFloat: 'Mantisse im Float',
      mantissa1float: 'Im Float wird die führende 1 nicht angezeigt',
      // twos complement
      subtTwosComplement: 'Subtraktion entspricht der Addition mit dem Zweierkomplement',
      mantissaTwosComplement: 'Bildung Zweierkomplement aus Mantisse',
      switchBits: 'Bits umkehren',
      add1: '1 addieren',
      normalize: 'Normalisieren',
      // shift, representation
      shiftExpMant: 'Der Shift-Faktor des Exponenten muss auf die Mantissen angewendet werden.',
      shift: 'Shift',
      considerRepresentation: 'Darstellung beachten',
      consider1comma: 'Die Mantisse beginnt in der Standard-Darstellung immer mit einer 1 vor dem Komma.',
      // polydic
      ternary: 'Ternärzahl',
      octal: 'Oktalzahl',
      hexadecimal: 'Hexadezimal',
      hex: 'Hexadezimal',
      input: 'Eingabe',
      number: 'Nummer',
      representation: 'Representation im Ausgangsformat',
      // polydic conversion
      firstFormat: 'Ausgangsformat',
      secondFormat: 'Zielformat',
      doConversion: 'Konvertierung durchführen:',
      modus: 'Modus',
      to: 'nach',
      TenToPower: 'Bei der Konvertierung vom Dezimalsystem in ein beliebiges anders muss vor dem Komma der Divisions- und nach dem Komma der Multiplikationsalgorithmus angewendet werden.',
      PowerToTen: 'Die Konvertierung eines beliebigen Systems in das Dezimalsystem läuft durch Summierung der potenzierten Stellen.',
      PowerToPower: 'Die Konvertierung eines beliebigen Zahlensystems in ein beliebiges (nicht dezimal), erfolgt durch zweiteilige Konvertierung über das Dezimalsystem. Zuerst wird von dem ursprünglichen System durch Aufsummieren eine Dezimalzahl erzeugt. Als zweiter Schritt wird dann mittels des Divisions- und des Multiplikationsalgorithmus die Zahl im Zielsystem konstruhiert.',
      firstToTen: '1. Summieren der potenzierten Stellen',
      secondToPower: '2. Konvertierung mittels Divisions- und Multiplikationsalgorithmus',
      shortcutBinToHex: 'Bei der Konvertierung von Binär nach Hex können die Werte direkt abgelesen werden.',
      shortcutHexToBin: 'Bei der Konvertierung von Hex nach Binär können die Werte direkt abgelesen werden.',
      divisionAlgorithm: 'Divisions-Algorithmus',
      multiplicationAlgorithm: 'Multiplikations-Algorithmus',
      summation: 'Aufsummieren',
      factor: 'Faktor',
      quotient: 'Quotient',
      remainder: 'Rest',
      newBasis: 'neue Basis',
    },
    en: {
      numVarInput: 'Number of variables',
      confirm: 'Confirm',
      varNaming: 'Variable naming',
      kvDiagram: 'Karnaugh Map',
      numeralSystem: 'Numeral System',
      polyadic: 'Polyadic',
      floatingPoint: 'Floating Points',
      functionMin: 'Minimization',
      exercises: 'Exercises',
      generateEx: 'Generate Exercise',
      generate: 'Generate',
      addition: 'Addition',
      subtraction: 'Subtraction',
      multiplication: 'Multiplication',
      division: 'Division',
      solution: 'Solution',
      ownSolution: 'Own Solution',
      signBit: 'Sign Bit',
      correctSolution: 'Correct Solution',
      exponentBits: 'Exponent',
      fractionBits: 'Fraction',
      attRound: 'Do not forget to round!',
      attSolve: 'Please try to solve the exercise beforehand!',
      step: 'Step',
      freeCalculation: 'Free Calculation',
      operationSelect: 'Configure Computation',
      firstFloatingPoint: 'First Floating Point Number',
      secondFloatingPoint: 'Second Floating Point Number',
      operand: 'Operand',
      decimal: 'Decimal',
      binary: 'Binary',
      inputNumber: 'Input Number',
      fpformat: 'Floating Point Format',
      check: 'Check',
      values: 'Values',
      // TODO: Übersetzen
      // general
      conversion: 'Conversion',
      conversionExercise1: 'Convert: ',
      conversionExercise2: 'into a IEEE-Floatingpointnumber with exponent lenght of: ',
      steps: 'steps',
      repeatMinuend: 'repeat\\ minuend',
      doDivision: 'execute division',
      doMultiplication: 'execute multiplication',
      getDescription: 'description',
      approach: 'Approach',
      gti: 'Foundations of Computer Engineering',
      disclaimer: 'Disclaimer:<br>'
        + 'This is an automatically generated solution approach by the '
        + 'GTI-Online-Website. Every output is completely <u>unofficial</u> and in the drafts state.<br>'
        + 'We are making lots of efforts to build a correct and reliable tool for you. '
        + 'Regardless, there may be failures in the solution or approach. That can especially '
        + 'depend on your browser version. Please review before using it for instance in an exam.',
      example: 'Example',
      composition: 'composition',
      negativeSummand: 'An addition with a negative value is similar to a subtraction.',
      negativeSubtrahend: 'A negative subtrahend is similar to a positive summand.',
      negativeMinuendSubtrahend: 'Simplification for the case \\( - x - y \\rightarrow - (x + y) \\)',
      addWithZero: 'An addition with 0 results in the other summand',
      subWithZero: 'A subtraction with 0 results in the other value',
      mulWithZero: 'A multiplication with 0 results always 0.',
      zeroDivision: 'A division by 0 is illegal!',
      // values
      value: 'value',
      givenValues: 'values of the transmitted numbers',
      leftValue: 'left value',
      rightValue: 'right value',
      firstSummand: '1. summand',
      secondSummand: '2. summand',
      firstFactor: '1. factor',
      secondFactor: '2. factor',
      minuend: 'minuend',
      subtrahend: 'subtrahend',
      numerator: 'numerator',
      denominator: 'denominator',
      sign: 'sign',
      // exponent
      exponent: 'exponent',
      adjustExponents: 'The exponents of both numbers must be balanced.',
      addExponents: 'The exponents of both numbers must be added.',
      subtExponents: 'The exponents of both numbers must be subtracted.',
      diffExponent: 'difference of the exponents',
      smallerExponent: 'The smaller exponent will substracted from the bigger one',
      resDiffExponent: 'hence this difference results',
      newExponent: 'new exponent',
      considerExponent: 'consider the exponent',
      // mantissa
      mantissa: 'mantissa',
      mulMantissa: 'The mantissa of both numbers must be multiplied.',
      solutionIsNan: 'The mantissa can not be calculated because the input leads to NaN.',
      solutionIsInf: 'The mantissa can not be calculated because the input leads to infinity.',
      solutionIsZero: 'The mantissa can not be calculated because the input leads to zero.',
      addMantissa: 'The mantissa of both numbers must be added.',
      divMantissa: 'The mantissa of both numbers must be divided.',
      newMantissa: 'new mantissa',
      zeroMantissa: 'both mantissa are equal \\( \\rightarrow \\) the new mantissa is the 0-mantissa',
      newMantissaIs: 'Hence the new mantissa is',
      equalMantissa: 'Both mantissa are equal \\( \\rightarrow \\) the exponent will be incremented the mantissa remains',
      equalMantissaDiv: 'Both mantissa are equal, no binary division will be executed',
      adjustSmallerMantissa: 'Adjust the smaller mantissa',
      shiftMantissa: 'Shift the smaller mantissa',
      mantissaFloat: 'Mantissa inside the float',
      mantissa1float: 'The leading 1 is not part of the float',
      // twos complement
      subtTwosComplement: 'Subtraction is similar to addition with the two\'s complement',
      mantissaTwosComplement: 'Formation of the two\'s complement out of the mantissa',
      switchBits: 'invert bits',
      add1: 'add 1',
      normalize: 'normalize',
      // shift, representation
      shiftExpMant: 'The exponent\'s shift factor must be applied to the mantissa.',
      shift: 'shift',
      considerRepresentation: 'consider representation',
      consider1comma: 'The mantissa begins with an 1 in the standard form.',
    },
    fr: {
      numVarInput: 'Nombre de Variables',
      confirm: 'Confirmer',
      varNaming: 'Nommage des Variables',
      kvDiagram: 'Table de Karnaugh',
      numeralSystem: 'Système de numération',
      polyadic: 'Polyadique',
      floatingPoint: 'Virgule flottante',
      functionMin: 'Minimisation',
      exercises: 'Exercises',
      generateEx: 'Générer l\'exercice',
      generate: 'Générer',
      addition: 'Addition',
      subtraction: 'Soustraction',
      multiplication: 'Multiplication',
      division: 'Division',
      solution: 'Solution',
      ownSolution: 'Propre Solution',
      signBit: 'Signe',
      correctSolution: 'Solution Correcte',
      exponentBits: 'Exposant',
      fractionBits: 'Mantisse',
      attRound: 'N\'oubliez pas d\'arrondir!',
      attSolve: 'Veuillez essayer de résoudre l\'exercice au préalable!',
      step: 'Étape',
      freeCalculation: 'Calcul libre',
      operationSelect: 'Configurer le calcul',
      firstFloatingPoint: 'Premier numéro à virgule flottante',
      secondFloatingPoint: 'Deuxième numéro à virgule flottante',
      operand: 'Operand',
      decimal: 'Décimale',
      binary: 'Binaire',
      inputNumber: 'Entrez le numéro',
      fpformat: 'Format en virgule flottante',
      check: 'Vérifier',
      values: 'Valeurs',
      // TODO: Übersetzen
      // general
      conversion: 'Conversion',
      conversionExercise1: 'Convert: ',
      conversionExercise2: 'into a IEEE-Floatingpointnumber with exponent lenght of: ',
      steps: 'steps',
      repeatMinuend: 'repeat\\ minuend',
      doDivision: 'execute division',
      doMultiplication: 'execute multiplication',
      getDescription: 'description',
      approach: 'Approach',
      gti: 'Foundations of Computer Engineering',
      disclaimer: 'Disclaimer:<br>'
        + 'This is an automatically generated solution approach by the '
        + 'GTI-Online-Website. Every output is completely <u>unofficial</u> and in the drafts state.<br>'
        + 'We are making lots of efforts to build a correct and reliable tool for you. '
        + 'Regardless, there may be failures in the solution or approach. That can especially '
        + 'depend on your browser version. Please review before using it for instance in an exam.',
      example: 'Example',
      composition: 'composition',
      negativeSummand: 'An addition with a negative value is similar to a subtraction.',
      negativeSubtrahend: 'A negative subtrahend is similar to a positive summand.',
      negativeMinuendSubtrahend: 'Simplification for the case \\( - x - y \\rightarrow - (x + y) \\)',
      addWithZero: 'An addition with 0 results in the other summand',
      subWithZero: 'A subtraction with 0 results in the other value',
      mulWithZero: 'A multiplication with 0 results always 0.',
      divWithZero: 'A division with 0 in the numerator results always 0.',
      zeroDivision: 'A division by 0 is illegal!',
      // values
      value: 'value',
      givenValues: 'values of the transmitted numbers',
      leftValue: 'left value',
      rightValue: 'right value',
      firstSummand: '1. summand',
      secondSummand: '2. summand',
      firstFactor: '1. factor',
      secondFactor: '2. factor',
      minuend: 'minuend',
      subtrahend: 'subtrahend',
      numerator: 'numerator',
      denominator: 'denominator',
      sign: 'sign',
      // exponent
      exponent: 'exponent',
      adjustExponents: 'The exponents of both numbers must be balanced.',
      addExponents: 'The exponents of both numbers must be added.',
      subtExponents: 'The exponents of both numbers must be subtracted.',
      diffExponent: 'difference of the exponents',
      smallerExponent: 'The smaller exponent will substracted from the bigger one',
      resDiffExponent: 'hence this difference results',
      newExponent: 'new exponent',
      considerExponent: 'consider the exponent',
      // mantissa
      mantissa: 'mantissa',
      mulMantissa: 'The mantissa of both numbers must be multiplied.',
      solutionIsNan: 'The mantissa can not be calculated because the input leads to NaN.',
      solutionIsInf: 'The mantissa can not be calculated because the input leads to infinity.',
      solutionIsZero: 'The mantissa can not be calculated because the input leads to zero.',
      addMantissa: 'The mantissa of both numbers must be added.',
      divMantissa: 'The mantissa of both numbers must be divided.',
      newMantissa: 'new mantissa',
      zeroMantissa: 'both mantissa are equal \\( \\rightarrow \\) the new mantissa is the 0-mantissa',
      newMantissaIs: 'Hence the new mantissa is',
      equalMantissa: 'Both mantissa are equal \\( \\rightarrow \\) the exponent will be incremented the mantissa remains',
      equalMantissaDiv: 'Both mantissa are equal, no binary division will be executed',
      adjustSmallerMantissa: 'Adjust the smaller mantissa',
      shiftMantissa: 'Shift the smaller mantissa',
      mantissaFloat: 'Mantissa inside the float',
      mantissa1float: 'The leading 1 is not part of the float',
      // twos complement
      subtTwosComplement: 'Subtraction is similar to addition with the two\'s complement',
      mantissaTwosComplement: 'Formation of the two\'s complement out of the mantissa',
      switchBits: 'invert bits',
      add1: 'add 1',
      normalize: 'normalize',
      // shift, representation
      shiftExpMant: 'The exponent\'s shift factor must be applied to the mantissa.',
      shift: 'shift',
      considerRepresentation: 'consider representation',
      consider1comma: 'The mantissa begins with an 1 in the standard form.',
    },
    es: {
      numVarInput: 'Número de Variables',
      confirm: 'Confirmar',
      varNaming: 'Nombramiento variable',
      kvDiagram: 'Mapa de Karnaugh',
      numeralSystem: 'Sistema de numeración',
      polyadic: 'Poliádico',
      floatingPoint: 'Coma Flotante',
      functionMin: 'Minimización',
      exercises: 'Ejercicios',
      generateEx: 'Generar Ejercicio',
      generate: 'Generar',
      addition: 'Adición',
      subtraction: 'Sustracción',
      multiplication: 'Multiplicación',
      division: 'División',
      solution: 'Solución',
      ownSolution: 'Solución propia',
      signBit: 'Bit de signo',
      correctSolution: 'Solución Correcta',
      exponentBits: 'Exponente',
      fractionBits: 'Significando',
      attRound: '¡No te olvides de redondear!',
      attSolve: '¡Por favor, intente resolver el ejercicio de antemano!',
      step: 'Paso',
      freeCalculation: 'Cálculo libre',
      operationSelect: 'Configurar la computación',
      firstFloatingPoint: 'Primer número de punto flotante',
      secondFloatingPoint: 'Segundo número de punto flotante',
      operand: 'Operand',
      decimal: 'Decimal',
      binary: 'Binario',
      inputNumber: 'Introduce el número',
      fpformat: 'Formato de punto flotante',
      check: 'Comprobar',
      values: 'valore',
      // TODO: Übersetzen
      // general
      conversion: 'Conversion',
      conversionExercise1: 'Convert: ',
      conversionExercise2: 'into a IEEE-Floatingpointnumber with exponent lenght of: ',
      steps: 'steps',
      repeatMinuend: 'repeat\\ minuend',
      doDivision: 'execute division',
      doMultiplication: 'execute multiplication',
      getDescription: 'description',
      approach: 'Approach',
      gti: 'Foundations of Computer Engineering',
      disclaimer: 'Disclaimer:<br>'
        + 'This is an automatically generated solution approach by the '
        + 'GTI-Online-Website. Every output is completely <u>unofficial</u> and in the drafts state.<br>'
        + 'We are making lots of efforts to build a correct and reliable tool for you. '
        + 'Regardless, there may be failures in the solution or approach. That can especially '
        + 'depend on your browser version. Please review before using it for instance in an exam.',
      example: 'Example',
      composition: 'composition',
      negativeSummand: 'An addition with a negative value is similar to a subtraction.',
      negativeSubtrahend: 'A negative subtrahend is similar to a positive summand.',
      negativeMinuendSubtrahend: 'Simplification for the case \\( - x - y \\rightarrow - (x + y) \\)',
      addWithZero: 'An addition with 0 results in the other summand',
      subWithZero: 'A subtraction with 0 results in the other value',
      mulWithZero: 'A multiplication with 0 results always 0.',
      divWithZero: 'A division with 0 in the numerator results always 0.',
      zeroDivision: 'A division by 0 is illegal!',
      // values
      value: 'value',
      givenValues: 'values of the transmitted numbers',
      leftValue: 'left value',
      rightValue: 'right value',
      firstSummand: '1. summand',
      secondSummand: '2. summand',
      firstFactor: '1. factor',
      secondFactor: '2. factor',
      minuend: 'minuend',
      subtrahend: 'subtrahend',
      numerator: 'numerator',
      denominator: 'denominator',
      sign: 'sign',
      // exponent
      exponent: 'exponent',
      adjustExponents: 'The exponents of both numbers must be balanced.',
      addExponents: 'The exponents of both numbers must be added.',
      subtExponents: 'The exponents of both numbers must be subtracted.',
      diffExponent: 'difference of the exponents',
      smallerExponent: 'The smaller exponent will substracted from the bigger one',
      resDiffExponent: 'hence this difference results',
      newExponent: 'new exponent',
      considerExponent: 'consider the exponent',
      // mantissa
      mantissa: 'mantissa',
      mulMantissa: 'The mantissa of both numbers must be multiplied.',
      solutionIsNan: 'The mantissa can not be calculated because the input leads to NaN.',
      solutionIsInf: 'The mantissa can not be calculated because the input leads to infinity.',
      solutionIsZero: 'The mantissa can not be calculated because the input leads to zero.',
      addMantissa: 'The mantissa of both numbers must be added.',
      divMantissa: 'The mantissa of both numbers must be divided.',
      newMantissa: 'new mantissa',
      zeroMantissa: 'both mantissa are equal \\( \\rightarrow \\) the new mantissa is the 0-mantissa',
      newMantissaIs: 'Hence the new mantissa is',
      equalMantissa: 'Both mantissa are equal \\( \\rightarrow \\) the exponent will be incremented the mantissa remains',
      equalMantissaDiv: 'Both mantissa are equal, no binary division will be executed',
      adjustSmallerMantissa: 'Adjust the smaller mantissa',
      shiftMantissa: 'Shift the smaller mantissa',
      mantissaFloat: 'Mantissa inside the float',
      mantissa1float: 'The leading 1 is not part of the float',
      // twos complement
      subtTwosComplement: 'Subtraction is similar to addition with the two\'s complement',
      mantissaTwosComplement: 'Formation of the two\'s complement out of the mantissa',
      switchBits: 'invert bits',
      add1: 'add 1',
      normalize: 'normalize',
      // shift, representation
      shiftExpMant: 'The exponent\'s shift factor must be applied to the mantissa.',
      shift: 'shift',
      considerRepresentation: 'consider representation',
      consider1comma: 'The mantissa begins with an 1 in the standard form.',
    },
    lt: {
      numVarInput: 'Numerus variabilium',
      confirm: 'Adfirmare',
      varNaming: 'Nomen variabilium',
      kvDiagram: 'Tabula Karnaugh',
      numeralSystem: 'Disciplina numerorum',
      polyadic: 'Polyadicus',
      floatingPoint: 'Comma adfluens',
      functionMin: 'Deminutio',
      exercises: 'Exercitia',
      generateEx: 'Crea exercitium',
      generate: 'Crea',
      addition: 'Addere',
      subtraction: 'Deducere',
      multiplication: 'Multiplicare',
      division: 'divido',
      solution: 'Solutio',
      ownSolution: 'Solutio propia',
      signBit: 'Signum',
      correctSolution: 'Solutio recta',
      exponentBits: 'Exponens',
      fractionBits: 'Fractura',
      attRound: 'Habet enim praeteriti doloris secura recordatio delectationem.!',
      attSolve: 'Iucundi acti labores!',
      step: 'Gradus',
      freeCalculation: 'Ratio libera',
      operationSelect: 'Elige rationem',
      firstFloatingPoint: '1. Comma adfluens',
      secondFloatingPoint: '2. Comma adfluens',
      operand: 'Operandus',
      decimal: 'Systema decima',
      binary: 'Systema binaria',
      inputNumber: 'Inputa numerum',
      fpformat: 'Forma commae adfluentis',
      check: 'Authentica',
      values: 'valōrēs',
      // TODO: Übersetzen
      // general
      conversion: 'Conversion',
      conversionExercise1: 'Convert: ',
      conversionExercise2: 'into a IEEE-Floatingpointnumber with exponent lenght of: ',
      steps: 'steps',
      repeatMinuend: 'repeat\\ minuend',
      doDivision: 'execute division',
      doMultiplication: 'execute multiplication',
      getDescription: 'description',
      approach: 'Approach',
      gti: 'Foundations of Computer Engineering',
      disclaimer: 'Disclaimer:<br>'
        + 'This is an automatically generated solution approach by the '
        + 'GTI-Online-Website. Every output is completely <u>unofficial</u> and in the drafts state.<br>'
        + 'We are making lots of efforts to build a correct and reliable tool for you. '
        + 'Regardless, there may be failures in the solution or approach. That can especially '
        + 'depend on your browser version. Please review before using it for instance in an exam.',
      example: 'Example',
      composition: 'composition',
      negativeSummand: 'An addition with a negative value is similar to a subtraction.',
      negativeSubtrahend: 'A negative subtrahend is similar to a positive summand.',
      negativeMinuendSubtrahend: 'Simplification for the case \\( - x - y \\rightarrow - (x + y) \\)',
      addWithZero: 'An addition with 0 results in the other summand',
      subWithZero: 'A subtraction with 0 results in the other value',
      mulWithZero: 'A multiplication with 0 results always 0.',
      divWithZero: 'A division with 0 in the numerator results always 0.',
      zeroDivision: 'A division by 0 is illegal!',
      // values
      value: 'value',
      givenValues: 'values of the transmitted numbers',
      leftValue: 'left value',
      rightValue: 'right value',
      firstSummand: '1. summand',
      secondSummand: '2. summand',
      firstFactor: '1. factor',
      secondFactor: '2. factor',
      minuend: 'minuend',
      subtrahend: 'subtrahend',
      numerator: 'numerator',
      denominator: 'denominator',
      sign: 'sign',
      // exponent
      exponent: 'exponent',
      adjustExponents: 'The exponents of both numbers must be balanced.',
      addExponents: 'The exponents of both numbers must be added.',
      subtExponents: 'The exponents of both numbers must be subtracted.',
      diffExponent: 'difference of the exponents',
      smallerExponent: 'The smaller exponent will substracted from the bigger one',
      resDiffExponent: 'hence this difference results',
      newExponent: 'new exponent',
      considerExponent: 'consider the exponent',
      // mantissa
      mantissa: 'mantissa',
      mulMantissa: 'The mantissa of both numbers must be multiplied.',
      solutionIsNan: 'The mantissa can not be calculated because the input leads to NaN.',
      solutionIsInf: 'The mantissa can not be calculated because the input leads to infinity.',
      solutionIsZero: 'The mantissa can not be calculated because the input leads to zero.',
      addMantissa: 'The mantissa of both numbers must be added.',
      divMantissa: 'The mantissa of both numbers must be divided.',
      newMantissa: 'new mantissa',
      zeroMantissa: 'both mantissa are equal \\( \\rightarrow \\) the new mantissa is the 0-mantissa',
      newMantissaIs: 'Hence the new mantissa is',
      equalMantissa: 'Both mantissa are equal \\( \\rightarrow \\) the exponent will be incremented the mantissa remains',
      equalMantissaDiv: 'Both mantissa are equal, no binary division will be executed',
      adjustSmallerMantissa: 'Adjust the smaller mantissa',
      shiftMantissa: 'Shift the smaller mantissa',
      mantissaFloat: 'Mantissa inside the float',
      mantissa1float: 'The leading 1 is not part of the float',
      // twos complement
      subtTwosComplement: 'Subtraction is similar to addition with the two\'s complement',
      mantissaTwosComplement: 'Formation of the two\'s complement out of the mantissa',
      switchBits: 'invert bits',
      add1: 'add 1',
      normalize: 'normalize',
      // shift, representation
      shiftExpMant: 'The exponent\'s shift factor must be applied to the mantissa.',
      shift: 'shift',
      considerRepresentation: 'consider representation',
      consider1comma: 'The mantissa begins with an 1 in the standard form.',
    },
  },
});
