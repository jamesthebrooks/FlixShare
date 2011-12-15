App.ContainerPanel = Ext.extend(Ext.Panel, {
  fullscreen            : true,
  layout                : 'fit',
  displayField          : 'text',
  initComponent         : function() {
    this.items = App.HomePanel;
    App.ContainerPanel.superclass.initComponent.call(this);
  }
});