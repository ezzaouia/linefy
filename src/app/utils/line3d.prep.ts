import { each, get, chain, map, toNumber, truncate, sortBy } from 'lodash';
import { nest } from 'd3';

// helpers
// -------

// mappers
// --------
export const cast = d => ({
  ...d,
  max_weight: +d.max_weight,
  initial_weight: +d.initial_weight,
});

const prsDte = ( d ) => ( new Date( d.value.date ));

const sortByDate: any = ( a ) => ( sortBy( a, prsDte ));

const sumNbr = ( item, key ) => chain( item )
.map( key )
.map( toNumber )
.sum();

const frst = ( item, key ) =>  chain( item ).first().get( key );

const attr: any = item => ({
  score: sumNbr( item, 'max_weight' ).value(),
  time: sumNbr( item, 'learning_time_spent' ).divide( 60 ).value(),
  nok:  sumNbr( item, 'nbr_ok' ).value(),
  nko:  sumNbr( item, 'nbr_ko' ).value(),
  groupName: frst( item, 'group_name' ).upperCase().trim( ' ' ).value(),
  moduleName: frst( item, 'module_name' ).value(),
  date: new Date( frst( item, 'session_start_date' ).value()),
});

const runningSum = ( data ) => {
  let sumscore, sumtime, sumnok, sumnko;
  each( data, clazz => {

    each( clazz.values, user => {

      // SORT
      user.values = sortByDate( user.values );

      // SUM
      sumscore = 0, sumtime = 0, sumnok = 0, sumnko = 0;

      user.values = map( user.values, ( o, index ) => {
        sumscore += o.value.score;
        sumtime += o.value.time;
        sumnok += o.value.nok;
        sumnko += o.value.nko;

        return {
          X: o.value.date,
          Y: sumscore,
          Z: index + 1, // o.key,
          Xt1: sumtime,
          Xo2: sumnok,
          Xk3: sumnko,
          u: user.key,
          c: clazz.key,
        };
      });

    });
  });

  return data;
};

// prepers
// --------
export const filename = 'assets/data/bts_s26880.v3.csv';

export const line3dPrep = payload => {
  let g = null;
  let data = nest()
    .key(( d: any ) => (( g = get( d, 'group_name' )) ? g : 'UNKNOWN' ))
    .key(
      ( d: any ) =>
        truncate( get( d, 'last_name' ), { length: 2, omission: '-' }) +
        ' ' +
        get( d, 'first_name' )
    )
    .key(( d: any ) => get( d, 'learning_session_id' ))
    .rollup( attr )
    .entries( payload );

  data =  runningSum( data );

  return data;
};
