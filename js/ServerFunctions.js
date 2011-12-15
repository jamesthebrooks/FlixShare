var Server = {
  timeout : 5000,
  baseurl : "/rpc",
  jsonurl : "/rpc/services/json",
  stdErr  : 'An application error has occurred!',
  User    : {},
  Sync    : {},
  Save    : {}
};

Server.Delete = function(nid) {
  Ext.util.JSONP.request({ // Delete Node
    url         : Server.jsonurl,
    callbackKey : 'callback',
    params      : {
      method    : '"node.delete"',
      nid       : '"' + nid + '"'
    },
    callback    : function(result) {
      if(!result['#error']) {
        console.log("Deleted Node: " + nid, result);
      } else {
        Ext.Msg.alert('Error Deleting Node ' + nid + '!',Server.stdErr);
      }
    }
  });
};

Server.Sync.Profiles    = function(settings) {
  console.log("ATTEMPT TO SYNC PROFILES - Settings: " + typeof(settings));
  if (typeof(settings) === 'undefined') {
    settings = {
      profile   : {},
      gotoPanel : Ext.emptyFn
    };
  }
  Ext.util.JSONP.request({
    url         : Server.baseurl + '/profiles.json',
    callbackKey : 'callback',
    callback    : function(result) {
      console.log("RESPONSE RECEIVED FROM SERVER FOR PROFILE SYNCING");
      MyDS.ProfileStore.load();
      var profileStore = MyDS.ProfileStore;
      var local        = profileStore.data.items;
      var server       = result.Items;
      // Sync from server
      var i = 0;
      for (x in server) {
        var found = false;
        if (typeof server[x] === 'object') {
          if (server[x].hasOwnProperty('node')) {
            console.log(i);
            i++;
            for (y in local) {
              if (typeof local[y] === 'object') {
                if (local[y].hasOwnProperty('data')) {
                  if (parseInt(local[y].data.nid, 10) === parseInt(server[x].node.nid, 10)) {
                    if (parseInt(local[y].data.changed, 10) <
                        parseInt(server[x].node.changed, 10)) {
                      console.log("UPDATE PROFILE ON LOCAL STORAGE: " + server[x].node.nid + " S:" + server[x].node.changed + " L:" + local[y].data.changed);
                      local[y].data.changed = parseInt(server[x].node.changed, 10);
                      local[y].data.title   = server[x].node.title;
                      local[y].save();
                      console.log("UPDATING PROFILE LOCALLY: ", local[y]);
                      profileStore.load();
                      profileStore.sync();
                    } else if (parseInt(local[y].data.changed, 10) >
                      parseInt(server[x].node.changed, 10)) {
                      Server.Save.Profile(settings);
                      console.log("UPDATINGPROFILE  ON SERVER: " + server[x].node.nid);
                    } else {
                      console.log("PROFILE PERFECT MATCH - DO NOTHING: " + server[x].node.nid);
                    }
                    found = true;
                    break;
                  }
                }
              }
            }
            if (!found) {
              console.log("ADD PROFILE TO LOCAL STORAGE: " + server[x].node.nid);
              var dt = new Date();
              var now = dt.format('U');
              var profile = Ext.ModelMgr.create({
                id       : Math.floor(Math.random()*now),
                nid      : parseInt(server[x].node.nid, 10),
                posted   : server[x].node.posted,
                changed  : server[x].node.changed,
                title    : server[x].node.title
                },'ProfileModel');
              profile.save();
              profileStore.sync();
              profileStore.load();
            }
          }
        }
      }
      // Sync to server
      for (x in local) {
        if (typeof local[x] === 'object') {
          if (local[x].hasOwnProperty('data')) {
            if (parseInt(local[x].data.nid, 10) < 1 || local[x].data.nid === null) {
              console.log("ADDING PROFILE TO SERVER: " + local[x].data.nid);
              settings.profile = local[x];
              Server.Save.Profile(settings);
            } else {
              // if local has valid nid but does not exist on server, delete local
              found = false;
              for (y in server) {
                if (typeof server[y] === 'object') {
                  if (server[y].hasOwnProperty('node')) {
                    if (parseInt(server[y].node.nid, 10) === parseInt(local[x].data.nid, 10)) {
                      found = true;
                      break;
                    }
                  }
                }
              }
              if (!found) { // Delete local
                console.log('Removing Profile ' + local[x].data.nid + ' and its supplements from local storage.');
                var supplements = local[x].supplements();
                var dSupplements = supplements.getRange();
                supplements.remove(dSupplements);
                supplements.sync();
                profileStore.remove(local[x]);
                profileStore.sync();
              }
            }
          }
        }
      }
      profileStore.load();
      profileStore.sync();
      var task = new Ext.util.DelayedTask(function(){
        Server.Sync.Supplements(settings);
      });
      task.delay(Server.timeout/7);
    }
  });
};

Server.Save.Profile     = function(settings) {
  var profile = {
    title    : settings.record.data.title,
    type     : "profile"
  };
  if (settings.record.data.nid>0) {
    profile.nid = settings.record.data.nid;
  }
  profile = Ext.util.JSON.encode(profile);
  console.log("SAVING PROFILE: ", profile);
  Ext.util.JSONP.request({
    url         : Server.jsonurl,
    callbackKey : 'callback',
    params      : {
      method    : '"node.save"',
      node      : profile
    },
    callback    : function(result) {
      if(!result['#error']) {
        if (!result['#data']['#error']) {
          console.log("JUST SAVED PROFILE: " + result['#data']);
          settings.record.data.nid     = result['#data'];
          var dt  = new Date();
          var now = dt.format('U');
          settings.record.data.id = Math.floor(Math.random()*now);
          settings.record.data.changed = now;
          settings.record.save();
          MyDS.ProfileStore.sync();
          MyDS.ProfileStore.load();
          settings.gotoPanel();
        } else {
          MyDS.ProfileFormPanelToolbar.items.get(2).enable();
          Ext.Msg.alert('Error Saving Profile!',result['#data']['#message']);
        }
      } else {
        MyDS.ProfileFormPanelToolbar.items.get(2).enable();
        Ext.Msg.alert('Error Saving Profile!',Server.stdErr);
      }
    }
  });
};

Server.Sync.Supplements = function(settings) {
  if (typeof(settings) === 'undefined') {
    settings = {
      record    : {},
      gotoPanel : Ext.emptyFn
    };
  }
  MyDS.SupplementStore.load();
  var supplementStore = MyDS.SupplementStore;
  var local           = supplementStore.data.items;
  Ext.util.JSONP.request({
    url         : Server.baseurl + '/supplements.json',
    callbackKey : 'callback',
    callback    : function(result) {
      var server = result.Items;
      // Sync from server
      for (x in server) {
        if (typeof server[x] === 'object') {
          if (server[x].hasOwnProperty('node')) {
            var found = false;
            for (y in local) {
              if (typeof local[y] === 'object') {
                if (local[y].hasOwnProperty('data')) {
                  if (parseInt(local[y].data.nid, 10) === parseInt(server[x].node.nid, 10)) {
                    if (parseInt(local[y].data.changed, 10) <
                        parseInt(server[x].node.changed, 10)) {
                      console.log("UPDATE SUPPLEMENT ON LOCAL STORAGE: " + server[x].node.nid + " S:" + server[x].node.changed + " L:" + local[y].data.changed);
                      local[y].data.changed        = parseInt(server[x].node.changed, 10);
                      local[y].data.title          = server[x].node.title;
                      local[y].data.body           = server[x].node.body;
                      local[y].data.amount         = parseInt(server[x].node.amount, 10); //Problem?
                      local[y].data.unit           = server[x].node.unit;
                      local[y].data.frequency      = server[x].node.frequency;
                      local[y].data.frequency_unit = server[x].node.frequency_unit;
                      local[y].save();
                    } else if (parseInt(local[y].data.changed, 10) >
                      parseInt(server[x].node.changed, 10)) {
                      Server.Save.Supplement(settings);
                      console.log("UPDATING SUPPLEMENT ON SERVER: " + server[x].node.nid);
                    } else {
                      console.log("SUPPLEMENT PERFECT MATCH - DO NOTHING: " + server[x].node.nid);
                    }
                    found = true;
                    break;
                  }
                }
              }
            }
            if (!found) {
              console.log("ADD SUPPLEMENT TO LOCAL STORAGE: " + server[x].node.nid);
              var dt             = new Date();
              var now            = dt.format('U');
              var pid            = parseInt(server[x].node.pid, 10);
              MyDS.ProfileStore.load();
              var cIndex         = MyDS.ProfileStore.findExact('nid', pid);
              console.log('trying to find this profile record id: ', cIndex);
              if (cIndex !== -1) {
                var currentRecord  = MyDS.ProfileStore.getAt(cIndex);
                var supplement     = Ext.ModelMgr.create({
                  id              : Math.floor(Math.random()*now),
                  nid             : parseInt(server[x].node.nid, 10),
                  posted          : server[x].node.posted,
                  changed         : server[x].node.changed,
                  title           : server[x].node.title,
                  profilemodel_id : currentRecord.data.id,
                  pid             : pid,
                  body            : server[x].node.body,
                  amount          : server[x].node.amount,
                  unit            : server[x].node.unit,
                  frequency       : server[x].node.frequency,
                  frequency_unit  : server[x].node.frequency_unit
                  },'SupplementModel');
                console.log('TRYING TO SAVE THIS SUPPLEMENT:   ', supplement);
                supplement.save();
                supplementStore.sync();
                supplementStore.load();
              }
            }
          }
        }
      }
      // Sync to server
      for (x in local) {
        found = false;
        if (typeof local[x] === 'object') {
          if (local[x].hasOwnProperty('data')) {
            if (parseInt(local[x].data.nid, 10) < 1 || local[x].data.nid === null) {
              console.log("ADDING SUPPLEMENT TO SERVER: " + local[x].data.nid);
              settings.record = local[x];
              MyDS.activeProfile = MyDS.ProfileStore.getById(local[x].data.profilemodel_id);
              Server.Save.Supplement(settings);
            } else {
              console.log("SERVER: ", server);
              if (server.length>0) {
                for (y in server) {
                  if (typeof server[y] === 'object') {
                    if (server[y].hasOwnProperty('node')) {
                      if (parseInt(server[y].node.nid, 10) === parseInt(local[x].data.nid, 10)) {
                        console.log("SERVER NID: " + parseInt(server[y].node.nid, 10) +
                          " LOCAL NID: " + parseInt(local[x].data.nid, 10));
                        found = true;
                        break;
                      }
                    }
                  }
                }
              }
              if (!found) { // Delete local
                console.log('Removing Supplement ' + local[x].data.nid);
                supplementStore.remove(local[x]);
                supplementStore.sync();
                supplementStore.load();
              } else {
                console.log("Supplement Was Found");
              }
            }
          }
        }
      }
      supplementStore.sync();
      supplementStore.load();
      if (settings.hasOwnProperty('callback')) {
        settings.callback();
      }
    }
  });
};

Server.Save.Supplement  = function(settings) {
  var dt = new Date();
  var supplement = {
    title               : settings.record.data.title,
    type                : "supplement",
    changed             : dt.format('U'),
    nid                 : settings.record.data.nid>0 ? settings.record.data.nid : null,
    body                : settings.record.data.body,
    field_amount        : new Array({
      value : settings.record.data.amount
    }),
    field_unit          : new Array({
      value : settings.record.data.unit
    }),
    field_frequency     : new Array({
      value : settings.record.data.frequency
    }),
    field_frequencyunit : new Array({
      value : settings.record.data.frequency_unit
    }),
    field_pid           : {
      nids : MyDS.activeProfile.data.nid
    }
  };
  if (settings.record.data.nid>0) {
    supplement.nid = settings.record.data.nid;
  }
  supplement = Ext.util.JSON.encode(supplement);
  Ext.util.JSONP.request({
    url         : Server.jsonurl,
    callbackKey : 'callback',
    params      : {
      method    : '"node.save"',
      node      : supplement
    },
    callback    : function(result) {
      if (!result['#error']) {
        if (!result['#data']['#error']) {
          console.log("JUST SAVED SUPPLEMENT: " + result['#data']);
          settings.record.data.nid = parseInt(result['#data'], 10);
          settings.record.data.changed = Math.round(new Date().getTime()/1000.0);
          settings.record.data.pid = MyDS.activeProfile.data.nid;
          settings.record.save();
          MyDS.ProfileStore.sync();
          settings.gotoPanel();
        } else {
           Ext.Msg.alert('Error Saving Supplement!',result['#data']['#message']);
           MyDS.SupplementFormPanelToolbar.items.get(2).enable();
        }
      } else {
        Ext.Msg.alert('Error Saving Supplement!',Server.stdErr);
        MyDS.SupplementFormPanelToolbar.items.get(2).enable();
      }
    }
  });
};

Server.User.Save        = function(settings) {
  var thisAccount;
  if (typeof(settings.account) === 'undefined') {
    console.log("REGISTER A NEW USER");
    thisAccount = settings.record;
  } else {
    console.log("SAVE AN EXISTING USER");
    Server.User.Login(settings);
    thisAccount = settings.account;
  }
  thisAccount.decrypt();
  var newAcct = {
    name : thisAccount.data.username,
    pass : thisAccount.data.password,
    mail : thisAccount.data.email
  };
  if (parseInt(thisAccount.data.uid, 10)>=0) {
    newAcct.uid = parseInt(thisAccount.data.uid, 10);
  }
  var account = Ext.util.JSON.encode(newAcct);
  console.log("ACCOUNT: ", account);
  Ext.util.JSONP.request({
    url         : Server.jsonurl,
    callbackKey : 'callback',
    params      : {
      method  : '"user.save"',
      account : account
    },
    callback    : function(result) { // REGISTER NEW ACCOUNT
      console.log("REGISTER:", result);
      if(!result['#error']) {
        if (!result['#data']['#error']) {
          settings.record.data.uid = result['#data'];
          if (!settings.record.data.remember) {
            settings.record.data.password = '';
          }
          settings.record.save();
          settings.gotoPanel();
        } else {
          var msg = result['#data']['#message'].replace(/\n/i, "<br />");
          console.log("REGISTRATION ERROR: ", msg);
          Ext.Msg.alert(null,msg);
          MyDS.CreateAccount.items.items[1].items.items[0].enable();
        }
      } else {
        Ext.Msg.alert('Registration Error!',Server.stdErr);
        MyDS.CreateAccount.items.items[1].items.items[0].enable();
      }
    }
  });
};

Server.User.Login    = function(settings) {
  var user = MyDS.SettingsStore.getAt(0);
  if (typeof settings === 'object') {
    thisAccount = settings.record;
  } else if (user.hasOwnProperty('data')) {
    thisAccount = user;
  }
  thisAccount.decrypt();
  console.log("ATTEMPT LOGIN: ", thisAccount);
  Ext.util.JSONP.request({
    url         : Server.jsonurl,
    callbackKey : 'callback',
    params      : {
      method    : '"user.login"',
      username  : '"' + thisAccount.data.username + '"',
      password  : '"' + thisAccount.data.password + '"'
    },
    callback: function(result) {
      console.log("SUCCESS");
      if (!result['#error']) {
        console.log("NO LOGIN ERROR");
        if (!result['#data']['#error']) {
          thisAccount.data.uid = parseInt(result['#data'].user.uid, 10);
          if (!thisAccount.data.remember) {
            console.log('Do not save password locally.');
            thisAccount.data.password = '';
          } else {
            thisAccount.encrypt();
          }
          console.log("Trying to save: ", thisAccount.data);
          thisAccount.save();
          MyDS.SettingsStore.load();
          MyDS.SettingsStore.sync();
          var gonowhere = false;
          if (typeof settings === 'object') {
            if (settings.gotoPanel) {
              settings.gotoPanel();
              gonowhere = true;
            }
          }
          if (!gonowhere) {
            MyDS.MenuPanel.setActiveItem('main', {
              type:'slide',
              direction:'left'
            });
          }
          var task = new Ext.util.DelayedTask(function(){
            Server.Sync.Profiles();
          });
          task.delay(2000);
        } else {
          console.log(result['#data']['#message']);
          Ext.Msg.alert(null,'Error: Incorrect username or password entered.');
          MyDS.Login.items.items[1].items.items[0].enable();
        }
      } else {
        console.log(result['#data']['#message']);
        Ext.Msg.alert(null,'Error: ' + Server.stdErr);
        MyDS.Login.items.items[1].items.items[0].enable();
      }
    }
  });
};

Server.User.Logout      = function(settings) {
  Ext.util.JSONP.request({
    url         : Server.jsonurl,
    callbackKey : 'callback',
    params      : {
      method    : '"user.logout"'
    },
    callback    : function(result) {
      console.log("LOGOUT ERROR: " + result['#error']);
      if (typeof(settings)==='object') {
        if (settings.hasOwnProperty('gotoPanel')) {
          settings.gotoPanel();
        }
      }
    }
  });
};

Server.Connect         = function() {
  Ext.util.JSONP.request({
    url         : Server.jsonurl,
    callbackKey : 'callback',
    params      : {
      method    : '"system.connect"'
    },
    callback    : function(result) {
      var record = MyDS.SettingsStore.getAt(0);
      if (record) {
          if (record.data.remember) {
            if (parseInt(result['#data'].user.uid, 10) === record.data.uid) {
              console.log("IS LOGGED IN");
              MyDS.MenuPanel.setActiveItem('main',false);
              Server.Sync.Profiles();
            } else {
              console.log("IS LOGGED OUT");
              if (record.data.password.length > 0) {
                var settings = {
                  record    : record,
                  gotoPanel : function() {
                    MyDS.MenuPanel.setActiveItem('main',false);
                  }
                };
                Server.User.Login(settings);
              } else {
                MyDS.MenuPanel.setActiveItem('loginPanel',false);
              }
            }
          } else {
            console.log("DON'T REMEMBER PASSWORD");
            MyDS.MenuPanel.setActiveItem('loginPanel',false);
          }
      } else {
        MyDS.MenuPanel.setActiveItem('termsPanel',false);
      }
    }
  });
};