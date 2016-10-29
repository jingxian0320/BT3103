Template.feed.events({
  'click .js-share': function(){
    Session.set("selectedOrderDetail", this._id);
    var sharedUsers = this.shared_customer;
    var index = sharedUsers.indexOf(this.owner_customer);
    if (index >=0) {
      sharedUsers.splice(index,1)
    }
    Session.set("selectedUser", sharedUsers);
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
    var thisUserIndex = users.indexOf(this[0].owner_customer);
    if(thisUserIndex >= 0) {
      users.splice(thisUserIndex,1);
    }
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
    var thisUser = this.owner_customer;
    if (arrUser.indexOf(thisUser) >= 0) {
      arrUser.splice(arrUser.indexOf(thisUser),1);
    }
    return arrUser.toString();
  }
})
