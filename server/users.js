Meteor.users.remove({});
Accounts.onCreateUser(function(options, user) {
  if (options.profile)
    user.profile = options.profile;
  user.credits = 100;
  user.current_order = '';
  user.current_order_details = [];
  // If this is the first user going into the database, make them an admin
  if (Meteor.users.find().count() === 0)
    user.admin = true;

  return user;
});
