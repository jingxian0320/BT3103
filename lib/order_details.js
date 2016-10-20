OrderDetails = new Mongo.Collection('orderDetails');

Meteor.methods({
  'orderDish': function(productId, qty) {
    check(this.userId, String);
    check(productId, String);

    var orderId = this.userId.current_order;

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
    var cart = OrderDetails.find({
      order_id: this.userId.current_order,
      owner_customer: this.userId
    });
    return cart;
  },

  'deleteDish': function(productId) {
    var orderId = this.userId.current_order;
    var dishOrders = OrderDetails.find({order_id:orderId, owner_customer:this.userId, product_id:productId});
    var dishOrder;
    for (dishOrder in dishOrders){
      OrderDetails.remove({_id:dishOrder._id})
    }
  },

  'addQuantity':function(productId,qty) {
    var orderId = this.userId.current_order;
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

  'subtractQuantity':function(productId,qty){
    var orderId = this.userId.current_order;
    var dishOrders = OrderDetails.find({order_id:orderId, owner_customer:this.userId, product_id:productId});
    var dishOrdersCount = dishOrders.count();
    if(dishOrdersCount > qty){
      var i;
      for (i=0; i<qty; i++){
        var dishOrder = OrderDetails.findOne({order_id:orderId, owner_customer:this.userId, product_id:productId});
        OrderDetails.remove({_id:dishOrder._id})
      }
    }
  }
});

if (Meteor.isServer && OrderDetails.find().count() === 0) {
  Meteor.startup(function() {
    OrderDetails.insert({
      order_id: '1',
      product_id: '1',
      owner_customer: "zFs4pYBq7sRWwgEmn",
      shared_customer: ["zFs4pYBq7sRWwgEmn"],
      time_created: new Date
  });
})}
