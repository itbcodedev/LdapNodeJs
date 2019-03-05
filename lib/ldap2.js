'use strict'

const ldapjs = require('ldapjs');
const ldapConfig = require('./config');
const assert = require('assert');

const userPrincipalName = "sawangpong.mu@mrta.co.th";
const password = "1234P@ssw0rd";
const adSuffix = "OU=Project,DC=mrta,DC=co,DC=th"
const ldapOptions = {
  url: ldapConfig.url,
  connectTimeout: ldapConfig.connectTimeout,
  reconnect: true
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
    filter: `(userPrincipalName=${userPrincipalName})`
};

ldapClient.search(adSuffix,searchOptions,(err,res) => {
    assert.ifError(err);

    res.on('searchEntry', entry => {
        //console.log(entry.object);
        console.log(entry.object.memberOf[0]);
    });

});

// Wrap up
ldapClient.unbind( err => {
    assert.ifError(err);
});
