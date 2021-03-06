var TAB_KEY = 'recipeShowTab';

Template.recipe.onCreated(function() {
    Template.recipe.setTab('recipe');
});

Template.recipe.onRendered(function () {
  this.$('.recipe').touchwipe({
    wipeDown: function () {
      if (Session.equals(TAB_KEY, 'recipe'))
        Template.recipe.setTab('make')
    },
    preventDefaultEvents: false
  });
  this.$('.attribution-recipe').touchwipe({
    wipeUp: function () {
      if (! Session.equals(TAB_KEY, 'recipe'))
        Template.recipe.setTab('recipe')
    },
    preventDefaultEvents: false
  });
});

// CSS transitions can't tell the difference between e.g. reaching
//   the "make" tab from the expanded state or the "feed" tab
//   so we need to help the transition out by attaching another
//   class that indicates if the feed tab should slide out of the
//   way smoothly, right away, or after the transition is over
Template.recipe.setTab = function(tab) {
  var lastTab = Session.get(TAB_KEY);
  Session.set(TAB_KEY, tab);

  var fromRecipe = (lastTab === 'recipe') && (tab !== 'recipe');
  $('.feed-scrollable').toggleClass('instant', fromRecipe);

  var toRecipe = (lastTab !== 'recipe') && (tab === 'recipe');
  $('.feed-scrollable').toggleClass('delayed', toRecipe);
}

Template.recipe.helpers({
  isActiveTab: function(name) {
    return Session.equals(TAB_KEY, name);
  },
  activeTabClass: function() {
    return Session.get(TAB_KEY);
  },
  bookmarked: function() {
    return Meteor.user() && _.include(Meteor.user().bookmarkedRecipeNames, this.name);
  },
  activities: function() {
    return Activities.find({recipeName: this.name}, {sort: {date: -1}});
  }
});

Template.recipe.events({
  'click .js-show-recipe': function(event) {
    event.stopPropagation();
    Template.recipe.setTab('make')
  },

  'click .js-uncollapse': function() {
    Template.recipe.setTab('recipe')
  },

  'click .js-share': function() {
    Overlay.open('shareOverlay', this);
  },
  'submit'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    var target = event.target;
    var qty = target.qty.value;
    if (! Meteor.userId())
      return Overlay.open('authOverlay');
    Meteor.call('orderDish', this.name, this.price, qty);
    Template.recipe.setTab('recipe')
  }
});
