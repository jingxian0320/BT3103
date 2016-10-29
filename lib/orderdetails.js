OrderDetails = new Mongo.Collection('orderDetails');

Meteor.methods({
  'orderDish': function(recipeName, price, qty) {
    check(this.userId, String);
    check(recipeName, String);

    var user = Meteor.users.findOne(this.userId);
    var orderId = user.current_order;
    var i;
    for (i=0; i<qty; i++){
      OrderDetails.insert({
        order_id: orderId,
        recipeName: recipeName,
        price: price,
        owner_customer: this.userId,
        shared_customer: [],
        time_created: new Date,
        status:false,
        paid:false
      })
    }
  },

  'viewCart': function(){
    var user = Meteor.users.findOne(this.userId);
    var orderId = user.current_order;
    var cart = OrderDetails.find({
      order_id: orderId,
      owner_customer: this.userId,
      status:false,
      paid:false
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

  'addQuantity':function(recipeName, price) {
    var user = Meteor.users.findOne(this.userId);
    var orderId = user.current_order;
    OrderDetails.insert({
      order_id: orderId,
      recipeName: recipeName,
      price: price,
      owner_customer: this.userId,
      shared_customer: [],
      time_created: new Date,
      status:false,
      paid:false
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
      OrderDetails.update(orderdetails_id, {$set: {status: true}});
      Meteor.users.update(this.userId, {$addToSet:{current_order_details: orderdetails_id}})
    }
  },
    'viewOrder': function(){
      var user = Meteor.users.findOne(this.userId);
      var orderId = user.current_order;
      var order = OrderDetails.find({
        order_id: orderId,
        owner_customer: this.userId,
        status:true,
        paid:false
      }).fetch();
      return order;
  },

  'getOtherUsers': function(OrderDetailId) {
    var user = Meteor.users.find({_id : this.userId}).fetch()[0];
    var orderId = user.current_order;
    var order = Orders.find({
      _id: orderId,
    }).fetch();
    var users = order[0].customers;
    var thisUserIndex = users.indexOf(this.userId);
    
    if(thisUserIndex >= 0) {
      users.splice(thisUserIndex,1);
    }
    // var othersName = [];
    // for (i = 0; i < others.length; ++i) {
    //   othersName.push(Users.findOne({"_id": othersId[i]}).name);
    // }
    // return othersName;
    return users;
  },

  'confirmSplit': function(OrderDetailId, selectedUser) {
    var listorder = OrderDetails.find().fetch();
    OrderDetails.update(OrderDetailId,  {$set: {shared_customer: selectedUser}});
    var orderDetails = OrderDetails.findOne({"_id": OrderDetailId});
  },

  'payBill': function(userId, total) {
    var user = Meteor.users.find({_id : userId}).fetch()[0];
    var credits = user.credits;
    var amount = parseFloat(total);
    var result = {
      paid: false,
      balance: parseFloat(credits).toFixed(2),
      total: amount
    };
    if (amount <= credits) {
      Meteor.users.update(userId, {$set: {credits: credits - amount}});
      OrderDetails.update({"owner_customer": userId}, {$set: {paid: true}}, {multi:true});
      result.outstanding = parseFloat(credits - amount).toFixed(2);
      result.paid = true;
    }
    return result;
  }
});

// Initialize bookmark counts. We could use upsert instead.
if (Meteor.isServer) {
  Meteor.startup(function() {
    OrderDetails.remove({})
  });
}
