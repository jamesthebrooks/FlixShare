Ext.regApplication({
  name                 : 'App',
  icon                 : (Ext.is.Phone ?
    'img/app-icon-57.png' :
    'img/app-icon-72.png'),
  tabletStartupScreen  : 'img/startup-tablet.png',
  phoneStartupScreen   : 'img/startup-phone.png',
  glossOnIcon          : false,
  useLoadMask          : true,
  statusBarStyle       : 'black',
  launch               : function() {
    App.AppPanelInstance = new App.ContainerPanel();
  },
  style : '.x-panel {-webkit-backface-visibility: hidden;}'
});