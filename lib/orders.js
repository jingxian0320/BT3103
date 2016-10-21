Orders = new Mongo.Collection('orders');

Meteor.methods({
  'createOrder': function(table_id) {
    check(this.userId, String);
    check(table_id, String);
    var table = Tables.findOne(table_id)
    var order_id

    if (table.status === false){
      order_id = Orders.insert({table_id:table_id,state:'ordering',paid: false, customers: [this.userId], time_created: new Date, time_updated: new Date});
      Tables.update(table_id,{$set: {current_order: order_id}})
    }
    else{
      order_id = table.current_order
      Orders.update({_id: order_id}, {$set: {time_updated: new Date}})
      Orders.update({_id: order_id}, {$addToSet: {customers: this.userId}})
    }

    Meteor.users.update({
      _id: this.userId,}, {
      $set: {current_order: order_id}
    });

    Tables.update(table_id, {$set: {status: true}});
  },
});

// Initialize bookmark counts. We could use upsert instead.
//if (Meteor.isServer && Orders.find().count() === 0) {
if (Meteor.isServer) {
  Meteor.startup(function() {
    Orders.remove({})
    Orders.insert({
      _id: '1',
      table_id: '1',
      status: 'ordering',
      customers: ['1',],
      time_ordered: new Date
    });
  });
}
