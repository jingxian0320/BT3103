var feedSubscription;

// Handle for launch screen possibly dismissed from app-body.js
dataReadyHold = null;

// Global subscriptions
if (Meteor.isClient) {
  Meteor.subscribe('news');
  //Meteor.subscribe('bookmarkCounts');
  Meteor.subscribe('tables');
  Meteor.subscribe('Orders');
  Meteor.subscribe('OrderDetails');
  feedSubscription = Meteor.subscribe('feed');
}

Router.configure({
  layoutTemplate: 'appBody',
  notFoundTemplate: 'notFound'
});

if (Meteor.isClient) {
  // Keep showing the launch screen on mobile devices until we have loaded
  // the app's data
  dataReadyHold = LaunchScreen.hold();
}

HomeController = RouteController.extend({
  onBeforeAction: function () {
    if (!(Meteor.user() && Meteor.user().current_order !== '')){
      Overlay.open('authOverlay');
    }
  }
});

FeedController = RouteController.extend({
  onBeforeAction: function () {
    if (Meteor.user())
      Meteor.subscribe('feed');
    else
      Overlay.open('authOverlay');
  },
  data: function(){
    if(Meteor.user()){
      Meteor.call('viewOrder', function(error, result){if(error){alert('Error');}else{Session.set("q", result)}});
      var cart = Session.get("q");
      var cartRecipesJ = {};
      var cartRecipesA = [];
      var recipe;
      var input = {};
      var cartRecipesA = [];
      for (i=0;i<cart.length;i++){
        var cartRecipeName = cart[i].recipeName;
        input["name"] = cartRecipeName;
        var recipe = _.values(_.pick(RecipesData, cartRecipeName))[0];
        var num_share = cart[i].shared_customer.length
        input["num_share"] = num_share-1;
        var order_details_id = cart[i]._id;
        input["order_details_id"] = order_details_id;
        var dish_name = recipe.dish_name;
        input["dish_name"] = dish_name;
        var price = recipe.price;
        input["price"] = price;
        var real_input = JSON.parse(JSON.stringify(input));
        cartRecipesJ[order_details_id] = real_input;
      };
      for(var r in cartRecipesJ) {
        cartRecipesA.push(cartRecipesJ[r]);
      };
      console.log(cartRecipesA);
      return cartRecipesA;
    }
  }
});

RecipesController = RouteController.extend({
  data: function () {
    return _.values(RecipesData);
  }
});

BookmarksController = RouteController.extend({
  onBeforeAction: function () {
    if (Meteor.user())
      Meteor.subscribe('bookmarks');
    else
      Overlay.open('authOverlay');
  },
  data: function(){
    if(Meteor.user()){
      Meteor.call('viewCart', function(error, result){if(error){alert('Error');}else{Session.set("q", result)}});
      var cart = Session.get("q");
      var cartRecipesJ = {};
      var cartRecipesA = [];
      var recipe;
      for (cartRecipe in cart){
        var cartRecipeName = cart[cartRecipe].recipeName;
        var cartRecipe = _.values(_.pick(cartRecipesJ,cartRecipeName));
        if (cartRecipe.length == 0){
          recipe = _.values(_.pick(RecipesData, cartRecipeName))[0];
          recipe['qty'] = 1;
          cartRecipesJ[cartRecipeName] = recipe;
        } else {
          cartRecipe[0]['qty']+=1;
        }
      };
      for(var r in cartRecipesJ) {
        cartRecipesA.push(cartRecipesJ[r]);
      };

      return cartRecipesA;
    }
  }
});

RecipeController = RouteController.extend({
  onBeforeAction: function () {
    Meteor.subscribe('recipe', this.params.name);
  },
  data: function () {
    return RecipesData[this.params.name];
  }
});

AdminController = RouteController.extend({
  onBeforeAction: function () {
    Meteor.subscribe('news');
  }
});

Router.route('home', {
  path: '/'
});

Router.route('feed', {
  path: '/split'
});

Router.route('recipes', {
  path: '/dishes'
});

Router.route('bookmarks', {
  path: '/cart'
});

Router.route('about');

Router.route('recipe', {
  path: '/dishes/:name'
});


Router.route('admin', {
  layoutTemplate: null
});

Router.onBeforeAction('dataNotFound', {
  only: 'recipe'
});
