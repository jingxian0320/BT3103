Tables = new Mongo.Collection('tables');

//if (Meteor.isServer && Tables.find().count() === 0) {
if (Meteor.isServer) {
  Meteor.startup(function() {
    Tables.remove({})
    Tables.insert({
      _id: '1',
      status: 1,
      max_seat: 4
    });
    Tables.insert({
      _id: '2',
      status: 0,
      max_seat: 4
    });
  });
}
