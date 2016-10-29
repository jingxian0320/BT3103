Template.feed.events({
  'click .js-share': function(){
    Session.set("selectedOrderDetail", this._id);
    Session.set("selectedUser", this.shared_customer);
    Session.set('showUser', true);
    Meteor.call('getOtherUsers', 
        this._id, 
        function(error, result){
          if(error){
            alert('Error');
          }
          else{
            Session.set("otherUsers", result);
          }
        });
  },
  'click .js-confirm': function(event) {
    Session.set("showNotification", false);
    event.target.href = Router.path('bill');
  }
}),

Template.feed.helpers({
  checkCount: function(recipe_list){
    return recipe_list.length > 0;
  },
  showUser: function(){
    var isShow = Session.get('showUser');
    return isShow ? 'active' : '';
  }
}),

Template.users.helpers({
  getOtherUsers: function() {
    var users = Session.get('otherUsers');
    return users;
  },
  selected: function() {
    var thisUser = this.toString();
    var userArr = Session.get("selectedUser");
    if (userArr.indexOf(thisUser) >= 0) {
      return "selected";
    }
    else {
      return '';
    }
  }
}),

Template.users.events({
  'click .name': function(){
    var thisUser = this.toString();
    var userArr = Session.get("selectedUser") ? Session.get("selectedUser") : [];
    if (userArr.indexOf(thisUser) >= 0) {
      userArr.splice(userArr.indexOf(thisUser),1);
    }
    else {
      userArr.push(thisUser);
    }
    Session.set("selectedUser", userArr);
  },

  'click .js-cancel': function(){
    Session.set('showUser', false);
    Session.set("selectedUser", []);
  },

  'click .js-save': function(){
    var usr = Session.get("selectedUser");
    var or = Session.get("selectedOrderDetail");
    Meteor.call('confirmSplit', or, usr);
    Session.set('showUser', false);
    Session.set("selectedUser", []);
  },
}),
Template.splitBill.helpers({
  viewUsers: function(arrUser) {
    return arrUser.toString();
  }
})
