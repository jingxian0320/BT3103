// If the auth overlay is on the screen but the user is logged in,
//   then we have come back from the loginWithTwitter flow,
//   and the user has successfully signed in.
//
// We have to use an autorun for this as callbacks get lost in the
//   redirect flow.
Template.authOverlay.onCreated(function() {
  this.autorun(function() {
    if (Meteor.userId() && Meteor.user().current_order && Overlay.template() === 'authOverlay')
      Overlay.close();
  });
});


Template.authOverlay.helpers({
  loginUser: function(){
    return Meteor.userId()
  }
});

Template.authOverlay.events({
  'submit .table-id-form'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    var target = event.target;
    var table_id = target.tableId.value;
    Meteor.call('createOrder', table_id);
  }
})
