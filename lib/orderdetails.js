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
      var orderdetails_id = cart[i]._id;
      //console.log(orderdetails_id);
      OrderDetails.update(orderdetails_id, {$set: {status: true}});
      Meteor.users.update(this.userId, {$addToSet:{current_order_details: orderdetails_id}})
      // if (Meteor.users.findOne(this.userId).current_order_details!=undefined){
      //   var current_orderdetails = Meteor.users.findOne(this.userId).current_order_details;
      //   current_orderdetails.push(cart[i]._id);
      //   Meteor.users.update({
      //     _id: this.userId,}, {
      //     $set: {current_order_details: current_orderdetails}
      //   })
      // } else {
      //   Meteor.users.update({
      //     _id: this.userId,}, {
      //     $set: {current_order_details: [orderdetails_id]}
      //   })
      // }
    }
  }
});

// Initialize bookmark counts. We could use upsert instead.
if (Meteor.isServer) {
  Meteor.startup(function() {
    OrderDetails.remove({})
  });
}
