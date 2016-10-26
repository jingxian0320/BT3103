Template.feed.events({
  'click .delete': function(){
    // Meteor.call('deleteDish', this.name);
    var this_order_id_status = this.order_details_id;
    Session.set("this_order_id", this.order_details_id);
    if (Session.get(this_order_id_status)) {
      Session.set(this_order_id_status,false)
      console.log('unclick')
    } else {
      Session.set(this_order_id_status,true)
      console.log('click')}
    console.log(this.order_details_id)
    other_users = Meteor.call('getSharer',this.order_details_id);
    Session.set("other_users", other_users);
  },

  'click .plus': function(){
    Meteor.call('addQuantity',this.name);
  },

  'click .minus': function(){
    if (this.qty < 2) {
      $('.minus').disabled = true;
    } else{
      Meteor.call('subtractQuantity',this.name);
    }
  },

  'click .confirm': function(){
    Meteor.call('confirmCart');
  }
}),

Template.feed.helpers({
  checkCount: function(recipe_list){
    return recipe_list.length > 0;
  },
  checkSplit: function(this_set) {
    var od = this_set.order_details_id
    return Session.get(od)
  },
  getOtherUser: function() {
    var other_users = Meteor.call('getSharer', function(error, result){if(error){alert('Error');}else{Session.set("other_users", result)}});
    var a = Session.get("other_users")
    console.log("other_users" + JSON.stringify(a))
    return a;
  },
  this_order_id: function() {
    return Session.get("this_order_id");
  },
  beautify: function(input) {
    return JSON.stringify(input)
  },
  get_order_detail_id: function(input) {
    return input.order_details_id
  }

})

Template.dishCount_split.helpers({
  this_order_id: function() {
    return Session.get("this_order_id");
  },
  checkSplit: function(this_set) {
    var od = this_set.order_details_id
    return Session.get(od)
  }
})

Template.sharer.events({
  'click': function(){
    var current_order_detail = Session.get("this_order_id");
    console.log("current_order_detail" + current_order_detail);
    var current_sharer = this;
    console.log("current_sharer" + current_sharer)
    Meteor.call('splitOrder',current_order_detail,current_sharer);
  }
})

