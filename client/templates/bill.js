Template.bill.rendered = function() {
  var totalObj = Session.get("reciept") ? Session.get("reciept") : {};
  totalObj.tips = 0.00;
  Session.set("reciept", totalObj);
},

Template.bill.events({
  'blur .js-tips': function (event) {
    var tips = parseFloat(event.target.value)? parseFloat(event.target.value).toFixed(2) : 0.00;
    event.target.value = tips;
    // Session.set("tips", tips);
    var totalObj = Session.get("reciept");
    if(totalObj) {
      totalObj.tips = tips;
    }
    Session.set("reciept", totalObj);
  },
  'click .pay': function () {
    Session.set("showNotification", true);
    var totalObj = Session.get("reciept");
    var total = 0.00;
    if(totalObj) {
      total = totalObj.total;
    }
    var userId = "";
    if(this.length > 0) {
      userId = this[0].owner_customer;
    }
    if(userId !== "") {
      Meteor.call("payBill", userId, total,
        function(error, result){
            Session.set("noti", result);
            if(result && result.paid) {
              Session.set("reciept", 0.00);
            }
        });
    }
  }
}),

Template.bill.helpers({
  getTotal: function(listSplit) {
    var totalObj = Session.get("reciept");
    if(!totalObj) {
      totalObj = {
        tips: 0.00
      }
    }
    var subtotal = 0;
    for (i in listSplit) {
      subtotal += listSplit[i].sharedPrice;
    }
    subtotal = subtotal;
    var gst = 0.07*subtotal;
    var service = 0.1*subtotal;  
    var tips = parseFloat(totalObj.tips);
    var total = subtotal  + gst + service + tips;
    totalObj.subtotal = parseFloat(subtotal).toFixed(2);
    totalObj.gst = parseFloat(gst).toFixed(2);
    totalObj.service = parseFloat(service).toFixed(2);
    totalObj.total = parseFloat(total).toFixed(2);
    Session.set("reciept", totalObj);
    return totalObj;
  },
  showNotification: function() {
    var notification = Session.get("showNotification");
    return notification ? "active" : "";
  }
}),

Template.payBill.helpers({
  viewUsers: function(arrUser) {
    var thisUser = this.owner_customer;
    if (arrUser.indexOf(thisUser) >= 0) {
      arrUser.splice(arrUser.indexOf(thisUser),1);
    }
    return arrUser.toString();
  }
}),

Template.billTotal.helpers({
  getTips: function () {
    var totalObj = Session.get("reciept");
    var tips = 0.00;
    if(totalObj && totalObj.tips) {
      tips = totalObj.tips;
    }
    return tips;
  }
}),

Template.notification.helpers({
  getResult:function() {
    var totalObj = Session.get("reciept");
    return totalOj;
  },
  getNotification: function() {
    var noti = Session.get('noti');
    return noti;
  }
}),

Template.notification.events({
  'click .js-home': function(event) {
    Session.set("showNotification", false);
    event.target.href = Router.path('home');
  },
  'click .js-backToBill': function(event) {
    Session.set("showNotification", false);
  }
})