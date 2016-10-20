var FEATURED_COUNT = 4;


Template.home.helpers({
  // selects FEATURED_COUNT number of recipes at random
  featuredRecipes: function() {
    var recipes = _.values(RecipesData);
    var selection = [];

    for (var i = 0;i < FEATURED_COUNT;i++)
      selection.push(recipes.splice(_.random(recipes.length - 1), 1)[0]);

    return selection;
  },

  activities: function() {
    return Activities.latest();
  },

  latestNews: function() {
    return News.latest();
  },

  loginUser: function(){
    return Meteor.userId()
  }

});

Template.home.events({
  'click .signout': function() {
    Meteor.logout()
  },

  'click .signin': function(event) {
    event.preventDefault();

    if (! Meteor.userId())
      return Overlay.open('authOverlay');

  },
  'submit'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    var target = event.target;
    var table_id = target.tableId.value;
    if (! Meteor.userId())
      return Overlay.open('authOverlay');
    Meteor.call('createOrder', table_id);
  }
});
