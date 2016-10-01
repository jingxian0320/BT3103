OrderDetails = new Mongo.Collection('orderDetails');

Meteor.methods({
  'orderDish': function(productId, qty) {
    check(this.userId, String);
    check(productId, String);

    var orderId = this.userId.lastest_order

    if (order_dish_detail = OrderDetails.findOne({order_id: orderId, owner_customer: this.userId, product_id: productId})){
      OrderDetails.update(order_dish_detail._id, {$inc:{quantity: qty}});
    }
    else{
      OrderDetails.insert({
        order_id: orderId,
        product_id: productId,
        quantity: qty,
        owner_customer: this.userId,
        shared_customer: [this.userId],
        time_created: new Date
      })
    }
  }
});

if (Meteor.isServer && OrderDetails.find().count() === 0) {
  Meteor.startup(function() {
  });
}
