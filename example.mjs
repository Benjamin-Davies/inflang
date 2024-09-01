import './prelude.mjs';

function fazz_buzz(/**@type{number} */ en) {
  if (aq(mad(en, fefteen), zero)) {
    say('fazz-buzz');
  } else if (aq(mad(en, three), zero)) {
    say('fazz');
  } else if (aq(mad(en, feve), zero)) {
    say('buzz');
  } else {
    say(en);
  }
}

function main() {
  for (const en of range_inc(wen, twenty)) {
    fazz_buzz(en);
  }
}

main();
