Template.bookmarks.events({
  'click .delete': function(){
    Meteor.call('deleteDish', this.name);
  },

  'click .plus': function(){
    Meteor.call('addQuantity',this.name);
  },

  'click .minus': function(){
    if (this.qty < 2) {
      $('.minus').disabled = true;
    } else{
      Meteor.call('subtractQuantity',this.name, this.price);
    }
  },

  'click .confirm': function(){
    Meteor.call('confirmCart');
  }
}),

Template.bookmarks.helpers({
  checkCount: function(recipe_list){
    return recipe_list.length > 0;
  }
})
