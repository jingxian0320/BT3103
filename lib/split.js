Meteor.methods({
  'splitOrder': function(order_detail_id, user_id) {
    check(order_detail_id, String);
    check(user_id, String);

    var user = Meteor.users.findOne(user_id);
    var orderDetailsList = user.current_order_details;
    var current_order = OrderDetails.findOne(order_detail_id);
    var current_order_sharers = current_order.shared_customer;

    if (current_order_sharers.includes(user_id)) {
    	Meteor.users.update({ _id: user_id }, {$pull: { current_order_details: order }});
    	OrderDetails.update({_id:order_detail_id}, {$pull: {shared_customer: user_id}});
    	console.log("Unshare");
  	} else {
    	Meteor.users.update({ _id: user_id }, {$addToSet: { current_order_details: order }});
    	OrderDetails.update({_id:order_detail_id}, {$addToSet: {shared_customer: user_id}});
    	console.log("Share")}
  },

  'getOrderDetails': function() {
  	var orderDetailsList = OrderDetails.find({owner_customer: this.userId}).fetch();
  	console.log(orderDetailsList)
  	return orderDetailsList
  },

  'getSharer': function(order_detail_id) {
  	check(order_id, String);

  	var user = Meteor.users.findOne(this.userId);
  	var OrderDetail = OrderDetails.findOne(order_detail_id);
  	var order_id = OrderDetail.order_id;
  	var tab = Orders.findOne(order_id).customers;
  	var other_users = tab.filter(function(el) { return el.user_id != this.userId;});
  	return other_users;
  },

  'getCustomerStatus': function(order_detail_id, user_id) {
  	check(order_detail_id, String);
    check(user_id, String);

    var user = Meteor.users.findOne(user_id);
    var orderDetailsList = user.current_order_details;
    var current_order = OrderDetails.findOne(order_detail_id);
    var current_order_sharers = current_order.shared_customer;

    if (current_order_sharers.includes(user_id)) {
    	return "share this with you"
  	} else {
    	return ""
    }
  },

  'getBill': function(user_id) {
  	check(user_id, String);

  	var current_orders = Meteor.users.findOne(user_id).current_order_details;
  	var list = [];
    var total = 0;
	for (i=0;i<current_orders.length;i++) {
		var dishName = OrderDetails.findOne(current_orders[i]).recipeName;
	    console.log("dishName" + dishName);
	    var dishPrice = OrderDetails.findOne(current_orders[i]).price;
	    console.log("dishPrice" + dishPrice);
	    var dishShare = OrderDetails.findOne(current_orders[i]).shared_customer.length;
	    console.log("dishShare" + dishShare);
	    var finalPrice = +(dishPrice/dishShare).toFixed(2)
	    console.log("finalPrice" + finalPrice);
	    total = total + finalPrice;
	    list.push({name:dishName, price:dishPrice, share:dishShare, finalprice:finalPrice});
	};
	return list
  },

  'getCredits': function(user_id) {
  	check(user_id, String);
  	var credits = Meteor.users.findOne(user_id).credits;
  	return credits
  },

  'confirmPayment': function(user_id, total_amt) {
  	check(user_id, String);

  	var current_credits = +(Meteor.users.findOne(user_id).credits).toFixed(2);
    var nets_credits = +(current_credits - total_amt).toFixed(2);
    Meteor.users.update({ _id: user_id }, {$set: { credits: nets_credits }});
  }
});

// Initialize bookmark counts. We could use upsert instead.
if (Meteor.isServer) {
  Meteor.startup(function() {
    OrderDetails.remove({})
  });
}
