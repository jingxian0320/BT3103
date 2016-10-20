Orders = new Mongo.Collection('orders');

Meteor.methods({
  'createOrder': function(table_id) {
    check(this.userId, String);
    check(table_id, String);
    var table = Tables.findOne(table_id)
    var order_id

    if (table.status === 0){
      order_id = Orders.insert({table_id:table_id,status:'ordering',num_of_ppl: 1, time_ordered: new Date});
      Tables.update(table_id,{$set: {lastest_order: order_id}})
    }
    else{
      order_id = table.current_order
    }

    Meteor.users.update({
      _id: this.userId,}, {
      $set: {current_order: order_id}
    });

    Tables.update(table_id, {$set: {status: 1}});
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
      no_of_ppl: 2,
      time_ordered: new Date
    });
  });
}
