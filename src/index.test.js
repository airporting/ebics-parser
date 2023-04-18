describe('ebics parser', function () {
  let parse;

  beforeEach(() => {
    parse = require('./index');
  });

  test('no transactions A', () => {
    const text = `0130004    00071EUR2 00010139479  280323                                                  0000003445691I
0730004    00071EUR2 00010139479  290323                                                  0000003445691I`;

    expect(parse(text)).toEqual([
      {
        header: {
          record_code: '01',
          bank_code: '30004',
          desk_code: '00071',
          currency_code: 'EUR',
          nb_of_dec: '2',
          account_nb: '00010139479',
          prev_date: '2023-03-28',
          prev_amount: '344569.19',
        },
        footer: {
          record_code: '07',
          bank_code: '30004',
          desk_code: '00071',
          currency_code: 'EUR',
          nb_of_dec: '2',
          account_nb: '00010139479',
          next_date: '2023-03-29',
          next_amount: '344569.19',
        },
        transactions: [],
        problems: null,
      },
    ]);
  });

  test('no transactions B', () => {
    const text = `0130004    00823EUR2 00010738652  280323                                                  0000000008653O
0730004    00823EUR2 00010738652  290323                                                  0000000008653O`;

    expect(parse(text)).toEqual([
      {
        header: {
          record_code: '01',
          bank_code: '30004',
          desk_code: '00823',
          currency_code: 'EUR',
          nb_of_dec: '2',
          account_nb: '00010738652',
          prev_date: '2023-03-28',
          prev_amount: '-865.36',
        },
        footer: {
          record_code: '07',
          bank_code: '30004',
          desk_code: '00823',
          currency_code: 'EUR',
          nb_of_dec: '2',
          account_nb: '00010738652',
          next_date: '2023-03-29',
          next_amount: '-865.36',
        },
        transactions: [],
        problems: null,
      },
    ]);
  });

  test('malformed - no footer  unknown line qualifier 03', () => {
    const text = `0118020 00001EUR2 00410GXLT01
030323 0000000000000} 0418020648900001EUR2 00410GXLT0191030323 030323RESTITUTION FONDS DE GARANTIE 2015123 00000000392067I000001
0518020648900001EUR2 00410GXLT0191030323 030323
0418020210400001EUR2 00410GXLT0191030323 030323FACTURE 86013179 NON GARANTIE 2014995 00000000006000{000001
0518020210400001EUR2 00410GXLT0191030323 030323DEVENANT FINANCABLE NON GARANTI
0418020404100001EUR2 00410GXLT0121030323 010323VIREMENT BANCAIRE EN VOTRE FAVE 1994254 00000001463361O000070
0518020404100001EUR2 00410GXLT0121030323 010323URN 5292443 VIREMENT N 52924
0418020302600001EUR2 00410GXLT0161030323 010323PRECOMPTE DE COMM. DE FINANCEME 1994254 00000000011488J000001
0518020302600001EUR2 00410GXLT0161030323 010323NT VIREMENT N 5292443 0418020101100001EUR2 00410GXLT0191030323 030323REPRISE DE FACTURES INDISPONIBL 1993288 00000000381110R000004
0518020101100001EUR2 00410GXLT0191030323 030323ES REMISE N 2717960 0418020303100001EUR2 00410GXLT0167030323 030323TVA SUR COMMISSION D AFFACTURAG 1993288 00000000000590}000003
0518020303100001EUR2 00410GXLT0167030323 030323E SUR REMISE N 2717960 0418020302100001EUR2 00410GXLT0165030323 030323COMMISSION D AFFACTURAGE SUR RE 1993288 00000000002950K000002
0518020302100001EUR2 00410GXLT0165030323 030323MISE N 2717960 0418020100100001EUR2 00410GXLT0191030323 030323ACHAT REMISE DE FACTURES REMIS 1993288 00000001966800{000001
0518020100100001EUR2 00410GXLT0191030323 030323E N 2717960 0418020353600001EUR2 00410GXLT0167020323 010323TVA SUR COMM. DE FINANCEMENT CO 1974131 00000000002523O000002
0518020353600001EUR2 00410GXLT0167020323 010323MPLEMENTAIRE ARRETES DE LA PERI
0418020352600001EUR2 00410GXLT0161020323 010323COMM. DE FINANCEMENT COMPLEMENT 1974131 00000000012617R000001
0518020352600001EUR2 00410GXLT0161020323 010323AIRE ARRETES DE LA PERIODE 2023
041802036BZ00001EUR2 00410GXLT01 010323 010323TVA SUR FRAIS DE GESTION DE CON 1891950 00000000000130}000002
051802036BZ00001EUR2 00410GXLT01 010323 010323TRAT EN LIGNE 041802032BZ00001EUR2 00410GXLT01 010323 010323FRAIS DE GESTION DE CONTRAT EN 1891950 00000000000650}000001
051802032BZ00001EUR2 00410GXLT01 010323 010323LIGNE 0418020312200001EUR2 00410GXLT0167280223 280223TVA SUR COMMISSION SUR REMISE D 1851684 00000000000026P000003
0518020312200001EUR2 00410GXLT0167280223 280223 AVOIRS REMISE N 2715010 0418020302200001EUR2 00410GXLT0165280223 280223COMMISSION SUR REMISE D AVOIRS 1851684 00000000000133M000002
0518020302200001EUR2 00410GXLT0165280223 280223 REMISE N 2715010 0418020100200001EUR2 00410GXLT0191280223 280223ACHAT REMISE D AVOIRS REMISE N 1851684 00000000088920}000001
0518020100200001EUR2 00410GXLT0191280223 280223 2715010 0418020404100001EUR2 00410GXLT0121280223 260223VIREMENT BANCAIRE EN VOTRE FAVE 1842999 00000002360952M000070
0518020404100001EUR2 00410GXLT0121280223 260223URN 5286537 VIREMENT N 52865
0418020210700001EUR2 00410GXLT0191280223 280223FACTURE N 63574441 DEVENANT FIN 1834511 00000000006000{000001
0518020210700001EUR2 00410GXLT0191280223 280223ANCABLE GARANTIE DEBITEUR LERO
0418020302600001EUR2 00410GXLT0161270223 250223PRECOMPTE DE COMM. DE FINANCEME 1810893 00000000002268P000001
0518020302600001EUR2 00410GXLT0161270223 250223NT VIREMENT N 5285067 0418020545100001EUR2 00410GXLT0105270223 280223RESTITUTION REGLEMENT VIR LEROY 1805894 00000000009919F000001
0518020545100001EUR2 00410GXLT0105270223 280223MERLIN 777 571.60� 0418020101100001EUR2 00410GXLT0191270223 270223REPRISE DE FACTURES INDISPONIBL 1780522 00000002375267L000004
0518020101100001EUR2 00410GXLT0191270223 270223ES REMISE N 2712826 0418020303100001EUR2 00410GXLT0167270223 270223TVA SUR COMMISSION D AFFACTURAG 1780522 00000000000846J000003
0518020303100001EUR2 00410GXLT0167270223 270223E SUR REMISE N 2712826 0418020302100001EUR2 00410GXLT0165270223 270223COMMISSION D AFFACTURAGE SUR RE 1780522 00000000004230O000002
0518020302100001EUR2 00410GXLT0165270223 270223MISE N 2712826 0418020100100001EUR2 00410GXLT0191270223 270223ACHAT REMISE DE FACTURES REMIS 1780522 00000002820357B000001
0518020100100001EUR2 00410GXLT0191270223 270223E N 2712826 0718020 00001EUR2 00410GXLT01
030323 0000000773178H`;

    expect(parse(text)).toEqual([
      {
        footer: {},
        header: {
          account_nb: '00410GXLT01',
          bank_code: '18020',
          currency_code: 'EUR',
          desk_code: '00001',
          nb_of_dec: '2',
          record_code: '01',
        },
        problems: [
          {
            line: '030323 0000000000000} 0418020648900001EUR2 00410GXLT0191030323 030323RESTITUTION FONDS DE GARANTIE 2015123 00000000392067I000001',
            message: 'Wrong line qualifier',
          },
          {
            line: '0418020210400001EUR2 00410GXLT0191030323 030323FACTURE 86013179 NON GARANTIE 2014995 00000000006000{000001',
            message: 'transaction header malformed',
          },
          {
            line: '0418020404100001EUR2 00410GXLT0121030323 010323VIREMENT BANCAIRE EN VOTRE FAVE 1994254 00000001463361O000070',
            message: 'transaction header malformed',
          },
          {
            line: '0418020302600001EUR2 00410GXLT0161030323 010323PRECOMPTE DE COMM. DE FINANCEME 1994254 00000000011488J000001',
            message: 'transaction header malformed',
          },
          {
            line: '0418020352600001EUR2 00410GXLT0161020323 010323COMM. DE FINANCEMENT COMPLEMENT 1974131 00000000012617R000001',
            message: 'transaction header malformed',
          },
          {
            line: '041802036BZ00001EUR2 00410GXLT01 010323 010323TVA SUR FRAIS DE GESTION DE CON 1891950 00000000000130}000002',
            message: 'transaction header malformed',
          },
          {
            line: '0418020210700001EUR2 00410GXLT0191280223 280223FACTURE N 63574441 DEVENANT FIN 1834511 00000000006000{000001',
            message: 'transaction header malformed',
          },
          {
            line: '0418020302600001EUR2 00410GXLT0161270223 250223PRECOMPTE DE COMM. DE FINANCEME 1810893 00000000002268P000001',
            message: 'transaction header malformed',
          },
          {
            line: '030323 0000000773178H',
            message: 'Wrong line qualifier',
          },
        ],
        transactions: [
          {
            record_code: '04',
          },
          {
            '23D': 'EVENANT FINANCABLE NON GARANTI',
            _1: '',
            _2: '0303',
            account_nb: '00410GXLT01',
            bank_code: '18020',
            currency_code: 'EUR',
            desk_code: '00001',
            internal_code: '2104',
            nb_of_dec: '2',
            operation_code: '91',
            operation_date: '2023-03-03',
            record_code: '04',
          },
          {
            '23D': 'EVENANT FINANCABLE NON GARANTI',
            '23U': 'RN 5292443 VIREMENT N 52924',
            _1: '',
            _2: '0103',
            account_nb: '00410GXLT01',
            bank_code: '18020',
            currency_code: 'EUR',
            desk_code: '00001',
            internal_code: '4041',
            nb_of_dec: '2',
            operation_code: '21',
            operation_date: '2023-03-03',
            record_code: '04',
          },
          {
            '23D': 'EVENANT FINANCABLE NON GARANTI',
            '23E':
              'N 2717960 0418020353600001EUR2 00410GXLT0167020323 010323TVA SUR COMM. DE FINANCEMENT CO 1974131 00000000002523O000002',
            '23M': 'PLEMENTAIRE ARRETES DE LA PERI',
            '23N':
              'T VIREMENT N 5292443 0418020101100001EUR2 00410GXLT0191030323 030323REPRISE DE FACTURES INDISPONIBL 1993288 00000000381110R000004',
            '23U': 'RN 5292443 VIREMENT N 52924',
            _1: '',
            _2: '0103',
            account_nb: '00410GXLT01',
            bank_code: '18020',
            currency_code: 'EUR',
            desk_code: '00001',
            internal_code: '3536',
            nb_of_dec: '2',
            operation_code: '67',
            operation_date: '2023-03-02',
            record_code: '04',
          },
          {
            '23A': 'IRE ARRETES DE LA PERIODE 2023',
            '23D': 'EVENANT FINANCABLE NON GARANTI',
            '23E':
              'N 2717960 0418020353600001EUR2 00410GXLT0167020323 010323TVA SUR COMM. DE FINANCEMENT CO 1974131 00000000002523O000002',
            '23M': 'PLEMENTAIRE ARRETES DE LA PERI',
            '23N':
              'T VIREMENT N 5292443 0418020101100001EUR2 00410GXLT0191030323 030323REPRISE DE FACTURES INDISPONIBL 1993288 00000000381110R000004',
            '23U': 'RN 5292443 VIREMENT N 52924',
            _1: '',
            _2: '0103',
            account_nb: '00410GXLT01',
            bank_code: '18020',
            currency_code: 'EUR',
            desk_code: '00001',
            internal_code: '3526',
            nb_of_dec: '2',
            operation_code: '61',
            operation_date: '2023-03-02',
            record_code: '04',
          },
          {
            '23A': 'IRE ARRETES DE LA PERIODE 2023',
            '23D': 'EVENANT FINANCABLE NON GARANTI',
            '23E':
              'N 2717960 0418020353600001EUR2 00410GXLT0167020323 010323TVA SUR COMM. DE FINANCEMENT CO 1974131 00000000002523O000002',
            '23M': 'PLEMENTAIRE ARRETES DE LA PERI',
            '23N':
              'T VIREMENT N 5292443 0418020101100001EUR2 00410GXLT0191030323 030323REPRISE DE FACTURES INDISPONIBL 1993288 00000000381110R000004',
            '23U': 'RN 5286537 VIREMENT N 52865',
            _1: '',
            _2: '2602',
            account_nb: '00410GXLT01',
            bank_code: '18020',
            currency_code: 'EUR',
            desk_code: '00001',
            internal_code: '4041',
            nb_of_dec: '2',
            operation_code: '21',
            operation_date: '2023-02-28',
            record_code: '04',
          },
          {
            '23A': 'NCABLE GARANTIE DEBITEUR LERO',
            '23D': 'EVENANT FINANCABLE NON GARANTI',
            '23E':
              'N 2717960 0418020353600001EUR2 00410GXLT0167020323 010323TVA SUR COMM. DE FINANCEMENT CO 1974131 00000000002523O000002',
            '23M': 'PLEMENTAIRE ARRETES DE LA PERI',
            '23N':
              'T VIREMENT N 5292443 0418020101100001EUR2 00410GXLT0191030323 030323REPRISE DE FACTURES INDISPONIBL 1993288 00000000381110R000004',
            '23U': 'RN 5286537 VIREMENT N 52865',
            _1: '',
            _2: '2802',
            account_nb: '00410GXLT01',
            bank_code: '18020',
            currency_code: 'EUR',
            desk_code: '00001',
            internal_code: '2107',
            nb_of_dec: '2',
            operation_code: '91',
            operation_date: '2023-02-28',
            record_code: '04',
          },
        ],
      },
    ]);
  });

  test('various', () => {
    const text = `0130004    00585EUR2 00010156142  280323                                                  0000006564827I
0430004056800585EUR2 0001015614218290323  290323DOMUSVI                          0000000  0000000359190{
0530004056800585EUR2 0001015614218290323     NPYDOMUSVI
0530004056800585EUR2 0001015614218290323     LCC/INV/3867 8.2.2023
0530004056800585EUR2 0001015614218290323     RCNNOTPROVIDED
0530004056800585EUR2 0001015614218290323     PDOFR FRANCE
0430004081800585EUR2 00010156142B2290323  290323PRLV SEPA/DGFIP IMPOT                   0 0000000560630}FR46ZZZ005002
0530004081800585EUR2 00010156142B2290323     NBEDGFIP IMPOT
0530004081800585EUR2 00010156142B2290323     IBEFR46ZZZ005002
0530004081800585EUR2 00010156142B2290323     RUMNN804148211DGFIP2019921505K41FN7QQ
0530004081800585EUR2 00010156142B2290323     RCN220750510700113748308
0530004081800585EUR2 00010156142B2290323     LCCTVA-032023-3310CA3
0730004    00585EUR2 00010156142  290323                                                  0000006363387I`;

    expect(parse(text)).toEqual([
      {
        header: {
          record_code: '01',
          bank_code: '30004',
          desk_code: '00585',
          currency_code: 'EUR',
          nb_of_dec: '2',
          account_nb: '00010156142',
          prev_date: '2023-03-28',
          prev_amount: '656482.79',
        },
        footer: {
          record_code: '07',
          bank_code: '30004',
          desk_code: '00585',
          currency_code: 'EUR',
          nb_of_dec: '2',
          account_nb: '00010156142',
          next_date: '2023-03-29',
          next_amount: '636338.79',
        },
        transactions: [
          {
            record_code: '04',
            bank_code: '30004',
            internal_code: '0568',
            desk_code: '00585',
            currency_code: 'EUR',
            nb_of_dec: '2',
            account_nb: '00010156142',
            operation_code: '18',
            operation_date: '2023-03-29',
            reject_code: '',
            value_date: '2023-03-29',
            label: 'DOMUSVI',
            reference: '0000000',
            exempt_code: '',
            amount: '35919',
            debtor_name: 'DOMUSVI',
            remittance_information_1: '/INV/3867 8.2.2023',
            end2end_identification: 'NOTPROVIDED',
            purpose: '',
            PDO: 'FR FRANCE',
            _1: '',
            _2: '',
            _3: '',
            '_4:': '',
          },
          {
            record_code: '04',
            bank_code: '30004',
            internal_code: '0818',
            desk_code: '00585',
            currency_code: 'EUR',
            nb_of_dec: '2',
            account_nb: '00010156142',
            operation_code: 'B2',
            operation_date: '2023-03-29',
            reject_code: '',
            value_date: '2023-03-29',
            label: 'PRLV SEPA/DGFIP IMPOT',
            reference: '',
            exempt_code: '0',
            amount: '-56063',
            _1: '',
            _2: '',
            _3: '',
            '_4:': 'FR46ZZZ005002',
            creditor_name: 'DGFIP IMPOT',
            creditor_id: 'FR46ZZZ005002',
            creditor_id_type: '',
            mandate_identification: 'NN804148211DGFIP2019921505K41FN7QQ',
            sequence_type: '',
            end2end_identification: '220750510700113748308',
            purpose: '',
            remittance_information_1: 'TVA-032023-3310CA3',
          },
        ],
        problems: null,
      },
    ]);
  });

  test('Known bank', () => {
    const text = `0118020    00001EUR2 00410GXLT01  060423                                                  0000000012258N
0418020404100001EUR2 00410GXLT0121070423  050423VIREMENT BANCAIRE EN VOTRE FAVE  3175387 00000000594363K000070
0518020404100001EUR2 00410GXLT0121070423  050423URN 5335098    VIREMENT N 53350
0418020312600001EUR2 00410GXLT0167070423  050423TVA SUR PRECOMPTE DE COMM. DE F  3175387 00000000001429P000002
0518020312600001EUR2 00410GXLT0167070423  050423INANCEMENT   VIREMENT N 5335098
0718020    00001EUR2 00410GXLT01  070423                                                  0000000000000} `;

    expect(parse(text)).toEqual([
      {
        header: {
          record_code: '01',
          bank_code: '18020',
          desk_code: '00001',
          currency_code: 'EUR',
          nb_of_dec: '2',
          account_nb: '00410GXLT01',
          prev_date: '2023-04-06',
          prev_amount: '-1225.85',
        },
        footer: {
          record_code: '07',
          bank_code: '18020',
          desk_code: '00001',
          currency_code: 'EUR',
          nb_of_dec: '2',
          account_nb: '00410GXLT01',
          next_date: '2023-04-07',
          next_amount: '0',
        },
        transactions: [
          {
            _1: '',
            _2: '050',
            _3: '0',
            '_4:': '000070',
            record_code: '04',
            bank_code: '18020',
            internal_code: '4041',
            desk_code: '00001',
            currency_code: 'EUR',
            nb_of_dec: '2',
            account_nb: '00410GXLT01',
            operation_code: '21',
            operation_date: '2023-04-07',
            reject_code: '',
            amount: '-59436.32',
            exempt_code: '',
            label: 'VIREMENT BANCAIRE EN VOTRE FAVE',
            reference: '3175387',
            value_date: '2023-04-05',
            423: 'URN 5335098    VIREMENT N 53350',
          },
          {
            423: 'INANCEMENT   VIREMENT N 5335098',
            _1: '',
            _2: '050',
            _3: '0',
            '_4:': '000002',
            record_code: '04',
            bank_code: '18020',
            internal_code: '3126',
            desk_code: '00001',
            currency_code: 'EUR',
            nb_of_dec: '2',
            account_nb: '00410GXLT01',
            operation_code: '67',
            operation_date: '2023-04-07',
            reject_code: '',
            amount: '-142.97',
            exempt_code: '',
            label: 'TVA SUR PRECOMPTE DE COMM. DE F',
            reference: '3175387',
            value_date: '2023-04-05',
          },
        ],
        problems: null,
      },
    ]);
  });

  test('Known bank 2', () => {
    const text = `0118020    00001EUR2 00410GXLT01  030323                                                  0000000773178H
0418020404100001EUR2 00410GXLT0121060323  040323VIREMENT BANCAIRE EN VOTRE FAVE  2059801 00000000771083K000070
0518020404100001EUR2 00410GXLT0121060323  040323URN 5295341    VIREMENT N 52953
0418020312600001EUR2 00410GXLT0167060323  040323TVA SUR PRECOMPTE DE COMM. DE F  2059801 00000000000349L000002
0518020312600001EUR2 00410GXLT0167060323  040323INANCEMENT   VIREMENT N 5295341
0418020302600001EUR2 00410GXLT0161060323  040323PRECOMPTE DE COMM. DE FINANCEME  2059801 00000000001746L000001
0518020302600001EUR2 00410GXLT0161060323  040323NT   VIREMENT N 5295341
0718020    00001EUR2 00410GXLT01  060323                                                  0000000000000}
0118020    00001EUR2 00410GXLT11  030323                                                  0000025068056R
0418020464100001EUR2 00410GXLT1191060323  040323MONTANT AVIS DE CREDIT  PAYE PA  2059801 00000000389972L000077
0518020464100001EUR2 00410GXLT1191060323  040323R VIREMENT  5295341
0418020434100001EUR2 00410GXLT1191060323  150423MONTANT FINANCE  PAR VIREMENT 5  2059801 00000000381110R000028
0518020434100001EUR2 00410GXLT1191060323  150423295341
0418020312600001EUR2 00410GXLT1167060323  040323TVA SUR PRECOMPTE DE COMM. DE F  2059801 00000000000349L000013
0518020312600001EUR2 00410GXLT1167060323  040323INANCEMENT   VIREMENT N 5295341
0418020302600001EUR2 00410GXLT1161060323  040323PRECOMPTE DE COMM. DE FINANCEME  2059801 00000000001746L000009
0518020302600001EUR2 00410GXLT1161060323  040323NT   VIREMENT N 5295341
0718020    00001EUR2 00410GXLT11  060323                                                  0000025841235P                `;

    expect(parse(text)).toEqual([
      {
        header: {
          account_nb: '00410GXLT01',
          bank_code: '18020',
          currency_code: 'EUR',
          desk_code: '00001',
          nb_of_dec: '2',
          prev_amount: '77317.88',
          prev_date: '2023-03-03',
          record_code: '01',
        },
        footer: {
          account_nb: '00410GXLT01',
          bank_code: '18020',
          currency_code: 'EUR',
          desk_code: '00001',
          nb_of_dec: '2',
          next_amount: '0',
          next_date: '2023-03-06',
          record_code: '07',
        },
        transactions: [
          {
            323: 'URN 5295341    VIREMENT N 52953',
            _1: '',
            _2: '040',
            _3: '0',
            '_4:': '000070',
            account_nb: '00410GXLT01',
            amount: '-77108.32',
            bank_code: '18020',
            currency_code: 'EUR',
            desk_code: '00001',
            exempt_code: '',
            internal_code: '4041',
            label: 'VIREMENT BANCAIRE EN VOTRE FAVE',
            nb_of_dec: '2',
            operation_code: '21',
            operation_date: '2023-03-06',
            record_code: '04',
            reference: '2059801',
            reject_code: '',
            value_date: '2023-03-04',
          },
          {
            323: 'INANCEMENT   VIREMENT N 5295341',
            _1: '',
            _2: '040',
            _3: '0',
            '_4:': '000002',
            account_nb: '00410GXLT01',
            amount: '-34.93',
            bank_code: '18020',
            currency_code: 'EUR',
            desk_code: '00001',
            exempt_code: '',
            internal_code: '3126',
            label: 'TVA SUR PRECOMPTE DE COMM. DE F',
            nb_of_dec: '2',
            operation_code: '67',
            operation_date: '2023-03-06',
            record_code: '04',
            reference: '2059801',
            reject_code: '',
            value_date: '2023-03-04',
          },
          {
            323: 'NT   VIREMENT N 5295341',
            _1: '',
            _2: '040',
            _3: '0',
            '_4:': '000001',
            account_nb: '00410GXLT01',
            amount: '-174.63',
            bank_code: '18020',
            currency_code: 'EUR',
            desk_code: '00001',
            exempt_code: '',
            internal_code: '3026',
            label: 'PRECOMPTE DE COMM. DE FINANCEME',
            nb_of_dec: '2',
            operation_code: '61',
            operation_date: '2023-03-06',
            record_code: '04',
            reference: '2059801',
            reject_code: '',
            value_date: '2023-03-04',
          },
        ],
        problems: null,
      },
      {
        footer: {
          account_nb: '00410GXLT11',
          bank_code: '18020',
          currency_code: 'EUR',
          desk_code: '00001',
          nb_of_dec: '2',
          next_amount: '-2584123.57',
          next_date: '2023-03-06',
          record_code: '07',
        },
        header: {
          account_nb: '00410GXLT11',
          bank_code: '18020',
          currency_code: 'EUR',
          desk_code: '00001',
          nb_of_dec: '2',
          prev_amount: '-2506805.69',
          prev_date: '2023-03-03',
          record_code: '01',
        },
        problems: null,
        transactions: [
          {
            323: 'R VIREMENT  5295341',
            _1: '',
            _2: '040',
            _3: '0',
            '_4:': '000077',
            account_nb: '00410GXLT11',
            amount: '-38997.23',
            bank_code: '18020',
            currency_code: 'EUR',
            desk_code: '00001',
            exempt_code: '',
            internal_code: '4641',
            label: 'MONTANT AVIS DE CREDIT  PAYE PA',
            nb_of_dec: '2',
            operation_code: '91',
            operation_date: '2023-03-06',
            record_code: '04',
            reference: '2059801',
            reject_code: '',
            value_date: '2023-03-04',
          },
          {
            423: '295341',
            _1: '',
            _2: '150',
            _3: '0',
            '_4:': '000028',
            account_nb: '00410GXLT11',
            amount: '-38111.09',
            bank_code: '18020',
            currency_code: 'EUR',
            desk_code: '00001',
            exempt_code: '',
            internal_code: '4341',
            label: 'MONTANT FINANCE  PAR VIREMENT 5',
            nb_of_dec: '2',
            operation_code: '91',
            operation_date: '2023-03-06',
            record_code: '04',
            reference: '2059801',
            reject_code: '',
            value_date: '2023-04-15',
          },
          {
            323: 'INANCEMENT   VIREMENT N 5295341',
            _1: '',
            _2: '040',
            _3: '0',
            '_4:': '000013',
            account_nb: '00410GXLT11',
            amount: '-34.93',
            bank_code: '18020',
            currency_code: 'EUR',
            desk_code: '00001',
            exempt_code: '',
            internal_code: '3126',
            label: 'TVA SUR PRECOMPTE DE COMM. DE F',
            nb_of_dec: '2',
            operation_code: '67',
            operation_date: '2023-03-06',
            record_code: '04',
            reference: '2059801',
            reject_code: '',
            value_date: '2023-03-04',
          },
          {
            323: 'NT   VIREMENT N 5295341',
            _1: '',
            _2: '040',
            _3: '0',
            '_4:': '000009',
            account_nb: '00410GXLT11',
            amount: '-174.63',
            bank_code: '18020',
            currency_code: 'EUR',
            desk_code: '00001',
            exempt_code: '',
            internal_code: '3026',
            label: 'PRECOMPTE DE COMM. DE FINANCEME',
            nb_of_dec: '2',
            operation_code: '61',
            operation_date: '2023-03-06',
            record_code: '04',
            reference: '2059801',
            reject_code: '',
            value_date: '2023-03-04',
          },
        ],
      },
    ]);
  });

  test('Known bank 3 - no transactions', () => {
    const text = `0118020    00001EUR2 00410GXLT01  210323                                                  0000000000000}
0718020    00001EUR2 00410GXLT01  220323                                                  0000000000000}
0118020    00001EUR2 00410GXLT11  210323                                                  0000019966371M
0718020    00001EUR2 00410GXLT11  220323                                                  0000019966371M                `;

    expect(parse(text)).toEqual([
      {
        header: {
          record_code: '01',
          bank_code: '18020',
          desk_code: '00001',
          currency_code: 'EUR',
          nb_of_dec: '2',
          account_nb: '00410GXLT01',
          prev_date: '2023-03-21',
          prev_amount: '0',
        },
        footer: {
          record_code: '07',
          bank_code: '18020',
          desk_code: '00001',
          currency_code: 'EUR',
          nb_of_dec: '2',
          account_nb: '00410GXLT01',
          next_date: '2023-03-22',
          next_amount: '0',
        },
        transactions: [],
        problems: null,
      },
      {
        header: {
          record_code: '01',
          bank_code: '18020',
          desk_code: '00001',
          currency_code: 'EUR',
          nb_of_dec: '2',
          account_nb: '00410GXLT11',
          prev_date: '2023-03-21',
          prev_amount: '-1996637.14',
        },
        footer: {
          record_code: '07',
          bank_code: '18020',
          desk_code: '00001',
          currency_code: 'EUR',
          nb_of_dec: '2',
          account_nb: '00410GXLT11',
          next_date: '2023-03-22',
          next_amount: '-1996637.14',
        },
        transactions: [],
        problems: null,
      },
    ]);
  });
});
