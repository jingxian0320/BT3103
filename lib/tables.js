Tables = new Mongo.Collection('table');

if (Meteor.isServer && Tables.find().count() === 0) {
  Meteor.startup(function() {
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
