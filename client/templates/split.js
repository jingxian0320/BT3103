Template.feed.events({
  'click .js-share': function(){
    Session.set("selectedOrderDetail", this._id);
    var sharedUsersId = this.shared_customer;
    var owner = this.owner_customer;
    Meteor.call('getOtherUsers', 
        this._id, 
        function(error, result){
          if(error){
            alert('Error');
          }
          else{
            Session.set("otherUsers", result);
            Session.set('showUser', true);
            var sharedUsers = Meteor.users.find({
              _id: {$in: sharedUsersId}
            }).fetch();
            sharedUsers = sharedUsers.filter(function(item){
              if(item._id !== owner){
                return item;
              }
            });
            Session.set("selectedUser", sharedUsers);
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
    // users = users.filter(function(item){
    //   if(item._id !== this[0].owner_customer){
    //     return item;
    //   }
    // });
    // var thisUserIndex = users.indexOf(this[0].owner_customer);
    // if(thisUserIndex >= 0) {
    //   users.splice(thisUserIndex,1);
    // }
    return users;
  },
  selected: function() {
    var thisUser = this;
    var userArr = Session.get("selectedUser");
    var isShared = userArr.filter(function(item){
      if(item._id === thisUser._id){
        return item;
      }
    });

    if (isShared.length > 0) {
      return "selected";
    }
    else {
      return '';
    }
  },
  getEmail: function() {
    return this.emails[0].address;
  }
}),

Template.users.events({
  'click .name': function(){
    var thisUser = this;
    var userArr = Session.get("selectedUser") ? Session.get("selectedUser") : [];
    var isShared = userArr.filter(function(item){
      if(item._id === thisUser._id){
        return item;
      }
    });
    if (isShared.length > 0) {
      userArr = userArr.filter(function(item){
        if(item._id !== thisUser._id)
        {
          return item;
        }
      });
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
    var usrs = Session.get("selectedUser");
    var usrIds = usrs.map(function(item){
      return item._id;
    });
    var or = Session.get("selectedOrderDetail");
    Meteor.call('confirmSplit', or, usrIds);
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
    var usrList = Meteor.users.find({
      _id: {$in: arrUser}
    }).fetch();
    var sharedEmails = usrList.map(function(item){
      return item.emails[0].address
    });
    return sharedEmails.toString();
  }
})
