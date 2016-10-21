Tables = new Mongo.Collection('tables');

//if (Meteor.isServer && Tables.find().count() === 0) {
if (Meteor.isServer) {
  Meteor.startup(function() {
    Tables.remove({})
    Tables.insert({
      _id: '1',
      current_order: '1',
      status: true,
      max_seat: 4
    });
    Tables.insert({
      _id: '2',
      current_order: '',
      status: false,
      max_seat: 4
    });
  });
}
