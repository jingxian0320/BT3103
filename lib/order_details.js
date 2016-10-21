// BookmarkCounts = new Mongo.Collection('bookmarkCounts');
//
// Meteor.methods({
//   'addCart': function(recipeName, qty) {
//     check(this.userId, String);
//     check(recipeName, String);
//
//     var orderId = this.userId.current_order;
//
//     var i;
//     for (i=0; i<qty; i++){
//       BookmarkCounts.insert({
//         order_id: orderId,
//         recipeName: recipeName,
//         owner_customer: this.userId,
//         shared_customer: [this.userId],
//         time_created: new Date
//       })
//     }
//   },
//
//   'viewCart': function(){
//     var cart = BookmarkCounts.find({
//       order_id: this.userId.current_order,
//       owner_customer: this.userId
//     });
//     return cart;
//   },
//
//   'deleteDish': function(recipeName) {
//     var orderId = this.userId.current_order;
//     var dishOrders = BookmarkCounts.find({order_id:orderId, owner_customer:this.userId, recipeName:recipeName});
//     var dishOrder;
//     for (dishOrder in dishOrders){
//       BookmarkCounts.remove({_id:dishOrder._id})
//     }
//   },
//
//   'addQuantity':function(recipeName,qty) {
//     var orderId = this.userId.current_order;
//     var i;
//     for (i=0; i<qty; i++){
//       BookmarkCounts.insert({
//         order_id: orderId,
//         recipeName: recipeName,
//         owner_customer: this.userId,
//         shared_customer: [this.userId],
//         time_created: new Date
//       })
//     }
//   },
//
//   'subtractQuantity':function(recipeName,qty){
//     var orderId = this.userId.current_order;
//     var dishOrders = BookmarkCounts.find({order_id:orderId, owner_customer:this.userId, recipeName:recipeName});
//     var dishOrdersCount = dishOrders.count();
//     if(dishOrdersCount > qty){
//       var i;
//       for (i=0; i<qty; i++){
//         var dishOrder = BookmarkCounts.findOne({order_id:orderId, owner_customer:this.userId, recipeName:recipeName});
//         BookmarkCounts.remove({_id:dishOrder._id})
//       }
//     }
//   }
// });
//
//
// // Initialize bookmark counts. We could use upsert instead.
// if (Meteor.isServer) {
//   Meteor.startup(function() {
//     BookmarkCounts.remove({});
//     BookmarkCounts.insert({
//       order_id: '1',
//       recipeName: "spring-fromage-fort",
//       owner_customer: "zFs4pYBq7sRWwgEmn",
//       shared_customer: ["zFs4pYBq7sRWwgEmn"],
//       time_created: new Date
//     });
//   })
// }
