Dishes = new Mongo.Collection('dishes');

if (Meteor.isServer){
  Meteor.startup(function(){
    if (Dishes.find().count() === 0){
      console.log("insert!")
      for (dish in RecipesData){
        console.log(RecipesData[dish])
        Dishes.insert(RecipesData[dish])
      }
    }
  })
}
