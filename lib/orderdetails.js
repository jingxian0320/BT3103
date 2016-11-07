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
        shared_customer: [this.userId],
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
      shared_customer: [this.userId],
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
    'viewBill': function(){
      var user = Meteor.users.findOne(this.userId);
      var order = OrderDetails.find({
        _id: {$in: user.current_order_details},
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
    var userslist  = Meteor.users.find({
      _id: {$in: users}
    }).fetch();
    return userslist;
  },

  'confirmSplit': function(OrderDetailId, selectedUser) {
    var details = OrderDetails.find({
      _id: OrderDetailId
    }).fetch();
    selectedUser.push(details[0].owner_customer);
    OrderDetails.update(OrderDetailId,  {$set: {shared_customer: selectedUser}});
    Meteor.users.update({}, {$pull:{current_order_details: OrderDetailId}});
    for (i in selectedUser) {
      var userId = selectedUser[i];
      var userObj = Meteor.users.find({
        _id: userId
      }).fetch();
      if (userObj[0].order_id !== '') {
        Meteor.users.update(userId, {$set: {current_order: details[0].order_id}});
      }
      Meteor.users.update(userId, {$addToSet:{current_order_details: OrderDetailId}});
    }
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
    var items = OrderDetails.find({
      shared_customer: userId 
    }).fetch();
    if (amount <= credits) {
      OrderDetails.update({"owner_customer": userId}, {$set: {paid: true}}, {multi: true});
      Meteor.users.update(userId, {$set: {credits: credits - amount}});
      Meteor.users.update(userId, {$set: {current_order: ''}});
      Meteor.users.update(userId, {$set: {current_order_details: []}});
      result.outstanding = parseFloat(credits - amount).toFixed(2);
      result.paid = true;
      var order = Orders.find({
        customers: userId
      }).fetch();
      if(order.length > 0) {
        var orderUsers = Meteor.users.find({
          _id: {$in: order[0].customers}
        }).fetch();
        var unpaidUsers = orderUsers.filter(function(item){
          return item.current_order_details.length > 0;
        });
        if (unpaidUsers.length <= 0) {
          Tables.update({"current_order": order[0]._id}, {$set: {status: false}});
          // console.log(Tables.findOne({"current_order": order[0]._id}));
          Orders.update(order[0]._id, {$set: {status: 'available'}});
          // console.log(Orders.findOne(order[0]._id));

        }
      }
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
