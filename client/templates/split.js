
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
  // },

  // 'click .save': function(){
  //   Meteor.call('confirmSplit', this._id, Session.get("selectedUser"));
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
  },
})
