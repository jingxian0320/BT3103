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
  credits: function(){
    var credit = Meteor.user().credits;
    var credit = credit.toFixed(2);
    return credit;
  },

  table_id: function(){
    var order = Orders.findOne(Meteor.user().current_order)
    return order.table_id
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
