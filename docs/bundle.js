'use strict';

// MilkCocoa
var milkcocoa = new MilkCocoa('guitariu6e7lgx.mlkcca.com');
var ds = milkcocoa.dataStore('messages');

ds.on('send', function (data) {
  console.log(data);
});

console.log('start');