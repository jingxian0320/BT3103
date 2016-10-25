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
  },

  'getOtherUsers': function(OrderDetailId) {
    // var user = Meteor.users.findOne(this.userId);
    // var orderId = user.current_order;
    // var order = Orders.find({
    //   _id: orderId,
    // }).fetch();
    var users = [{_id: '1', name: "User 1", created_at: "2016-09-20"},
    {_id: '2', name: "User 2", created_at: "2016-09-20"},
    {_id: '3', name: "User 3", created_at: "2016-09-20"},
    {_id: '4', name: "User 4", created_at: "2016-09-20"}];
    // var users = order.users;
    // console.log(users.splice(users.indexOf(this.userId),1));
    // var othersId = users.splice(users.indexOf(this.userId),1);
    // var othersName = [];
    // for (i = 0; i < others.length; ++i) {
    //   othersName.push(Users.findOne({"_id": othersId[i]}).name);
    // }
    // return othersName;
    return users;
  },

  'confirmSplit': function(OrderDetailId, selectedUser) {
    console.log("generate message to other users");
    console.log(OrderDetailId);
    console.log(selectedUser);
    var listorder = OrderDetails.find().fetch();
    var id = listorder[0]._id;
    OrderDetails.update(id,  {$set: {shared_customer: selectedUser}});
    var orderDetails = OrderDetails.findOne({"_id": id});
    console.log(orderDetails);
  }
});

// Initialize bookmark counts. We could use upsert instead.
if (Meteor.isServer) {
  Meteor.startup(function() {
    OrderDetails.remove({})
  });
}
