OrderDetails = new Mongo.Collection('orderDetails');

Meteor.methods({
  'orderDish': function(productName, qty) {
    check(this.userId, String);
    check(productName, String);

    var user = Meteor.users.findOne(this.userId);
    var orderId = user.current_order;

    var i;
    for (i=0; i<qty; i++){
      OrderDetails.insert({
        order_id: orderId,
        recipeName: productName,
        owner_customer: this.userId,
        shared_customer: [this.userId],
        time_created: new Date,
        status:false
      })
    }
  },

  'viewCart': function(){
    var user = Meteor.users.findOne(this.userId);
    var orderId = user.current_order;
    var cart = OrderDetails.find({
      order_id: orderId,
      owner_customer: this.userId,
      status:false
    }).fetch();

    return cart
  },

  'deleteDish': function(recipeName) {
    var user = Meteor.users.findOne(this.userId);
    var orderId = user.current_order;
    var dishOrders = OrderDetails.find({order_id:orderId, owner_customer:this.userId, recipeName:recipeName}).fetch();
    var i;
    for (i in dishOrders){
      OrderDetails.remove({_id:dishOrders[i]._id})
    }
  },

  'addQuantity':function(recipeName) {
    var user = Meteor.users.findOne(this.userId);
    var orderId = user.current_order;
    OrderDetails.insert({
      order_id: orderId,
      recipeName: recipeName,
      owner_customer: this.userId,
      shared_customer: [this.userId],
      time_created: new Date,
      status:false
    })
  },

  'subtractQuantity':function(recipeName){
    var user = Meteor.users.findOne(this.userId);
    var orderId = user.current_order;
    var dishOrder = OrderDetails.findOne({order_id:orderId, owner_customer:this.userId, recipeName:recipeName, status:false});
    OrderDetails.remove({_id:dishOrder._id});
  },

  'confirmCart': function(){
    var user = Meteor.users.findOne(this.userId);
    var orderId = user.current_order;
    var cart = OrderDetails.find({
      order_id: orderId,
      owner_customer: this.userId,
      status:false
    }).fetch();
    var i;
    for (i in cart) {
      OrderDetails.update(cart[i]._id, {$set: {status: true}})
    }
  }
});

// Initialize bookmark counts. We could use upsert instead.
if (Meteor.isServer) {
  Meteor.startup(function() {
    OrderDetails.remove({})
  });
}
