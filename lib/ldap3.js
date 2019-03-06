'use strict'

const ldapjs = require('ldapjs');
const ldapConfig = require('./config');
const assert = require('assert');

const userPrincipalName = "sawangpong.mu@mrta.co.th";
const username = "sawangpong"
const password = "1234P@ssw0rd";
const adSuffix = "OU=Project,DC=mrta,DC=co,DC=th"
const ldapOptions = {
  url: ldapConfig.url,
  connectTimeout: ldapConfig.connectTimeout,
  reconnect: true,
  timeout: ldapConfig.timeout
};

const ldapClient = ldapjs.createClient(ldapOptions);

ldapClient.bind(userPrincipalName,password,err => {
  if(err){
  return console.log("Error binding to LDAP", 'dn: ' + err.dn + '\n code: ' + err.code + '\n message: ' + err.message);
  }
});

// Search AD for user
const searchOptions = {
    scope: "sub",
    //filter: 'objectClass=*'
    //filter: `(userPrincipalName=${userPrincipalName})`
    filter: '(&(objectClass=*)(CN=' + username + '))',
};

ldapClient.search(adSuffix,searchOptions,(err,res) => {
  if (err) {
      console.log('Error occurred while ldap search');
  } else {
      res.on('searchEntry', function (entry) {
          console.log('Entry', JSON.stringify(entry.object));
      });
      res.on('searchReference', function (referral) {
          console.log('Referral', referral);
      });
      res.on('error', function (err) {
          console.log('Error is', err);
      });
      res.on('end', function (result) {
          console.log('Result is', result);
      });
  }

});

// Wrap up
ldapClient.unbind( err => {
    assert.ifError(err);
});
