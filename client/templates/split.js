Template.feed.events({
  'click .js-share': function(){
    Session.set("selectedOrderDetail", this._id);
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

  'click .share': function(){
    Meteor.call('getOtherUsers',this._id);
  },
  'click .confirm': function () {
    
  }
}),

Template.feed.helpers({
  checkCount: function(recipe_list){
    return recipe_list.length > 0;
  },
  showUser: function(){
    var isShow = Session.get('showUser');
    return isShow ? 'active' : '';
  },
  showMessage: function(){
    var shared = Session.get('shareUser');
    var message = "";
    console.log(message);
    if (shared) {
      message = "You shared this with " + shared.toString();
      // for (i = 0; i < usr.length; ++i) {
      //   if (i < usr.length - 1) {
      //     message += " " + Users.findOne({"_id": usr[i]}).name +",";
      //   }
      //   else {
      //     message += " and " + Users.findOne({"_id": usr[i]}).name;
      //   }
    }
    else {
      message = "You got this";
    }
    console.log(message);
    return message;
  }
}),

Template.users.helpers({
  getOtherUsers: function() {
    var users = Session.get('otherUsers');
    return users;
  },
  selected: function() {
    var userArr = Session.get("selectedUser");
    if (userArr.indexOf(this._id) >= 0) {
      return "selected";
    }
    else {
      return '';
    }
  }
}),

Template.users.events({
  'click .name': function(){
    console.log("click.name" + this._id);
    var userArr = Session.get("selectedUser") ? Session.get("selectedUser") : [];
    if (userArr.indexOf(this._id) >= 0) {
      userArr.splice(userArr.indexOf(this._id),1);
    }
    else {
      userArr.push(this._id);
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
    console.log(usr);
    console.log(or);
    Meteor.call('confirmSplit', or, usr);
    Session.set("shareUser", usr);
    Session.set('showUser', false);
    Session.set("selectedUser", []);
  },
})
