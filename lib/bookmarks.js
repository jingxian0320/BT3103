OrderDetails = new Mongo.Collection('orderDetails');

Meteor.methods({
  'orderDish': function(productId, qty) {
    check(this.userId, String);
    check(productId, String);

    var user = Meteor.users.findOne(this.userId);
    var orderId = user.current_order;

    var i;
    for (i=0; i<qty; i++){
      OrderDetails.insert({
        order_id: orderId,
        product_id: productId,
        owner_customer: this.userId,
        shared_customer: [this.userId],
        time_created: new Date
      })
    }
  },

  'viewCart': function(){
    var user = Meteor.users.findOne(this.userId);
    var orderId = user.current_order;
    //var orderId = '1';
    var cart = OrderDetails.find({
      order_id: orderId,
      owner_customer: this.userId
    }).fetch();

    return cart
  },

  'deleteDish': function(recipeName) {
    var user = Meteor.users.findOne(this.userId);
    var orderId = user.current_order;
    //var orderId = '1';
    var dishOrders = OrderDetails.find({order_id:orderId, owner_customer:this.userId, recipeName:recipeName}).fetch();
    var i;
    for (i in dishOrders){
      OrderDetails.remove({_id:dishOrders[i]._id})
    }
  },

  'addQuantity':function(recipeName) {
    var user = Meteor.users.findOne(this.userId);
    var orderId = user.current_order;
    //var orderId = '1';
    OrderDetails.insert({
      order_id: orderId,
      recipeName: recipeName,
      owner_customer: this.userId,
      shared_customer: [this.userId],
      time_created: new Date
    })
  },

  'subtractQuantity':function(recipeName){
    var user = Meteor.users.findOne(this.userId);
    var orderId = user.current_order;
    //var orderId = '1';
    var dishOrder = OrderDetails.findOne({order_id:orderId, owner_customer:this.userId, recipeName:recipeName});
    OrderDetails.remove({_id:dishOrder._id});
  }
});

// Initialize bookmark counts. We could use upsert instead.
if (Meteor.isServer && OrderDetails.find().count() === 0) {
  Meteor.startup(function() {
    OrderDetails.remove({})
    OrderDetails.insert({
      order_id: '1',
      recipeName: "spring-fromage-fort",
      owner_customer: "mw2j3qk2GvZ2iNLe2",
      shared_customer: ["mw2j3qk2GvZ2iNLe2"],
      time_created: new Date
    });
    OrderDetails.insert({
      order_id: '1',
      recipeName: "spring-ragu-bolognese",
      owner_customer: "mw2j3qk2GvZ2iNLe2",
      shared_customer: ["mw2j3qk2GvZ2iNLe2"],
      time_created: new Date
    });
  });
}
