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
      Meteor.call('subtractQuantity',this.name);
    }
  }
})
