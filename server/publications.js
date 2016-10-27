// Meteor.publish('bookmarkCounts', function() {
//   return BookmarkCounts.find();
// });

Meteor.publish('tables', function() {
  return Tables.find();
});


Meteor.publish('dishes', function() {
  return Dishes.find();
});


Meteor.publish('news', function() {
  return News.find({}, {sort: {date: -1}, limit: 1});
});

Meteor.publish('latestActivity', function () {
  return Activities.latest();
});

Meteor.publish('feed', function() {
  return Activities.find({}, {sort: {date: -1}, limit: 10});
});

Meteor.publish('Orders', function() {
  return Orders.find();
});

Meteor.publish('OrderDetails', function() {
  return OrderDetails.find();
});


Meteor.publish('recipe', function(name) {
  check(name, String);
  return [
    //BookmarkCounts.find({recipeName: name}),
    Activities.find({recipeName: name})
  ];
});

// autopublish the user's information
// Meteor.publish(null, function() {
//   return Meteor.users.find(this.userId, {
//     fields: {
//       admin: 1,
//       current_order: 1,
//       current_order_details: 1,
//       credits: 1,
//     }
//   });
// })

Meteor.publish(null, function() {
  return Meteor.users.find();
})
