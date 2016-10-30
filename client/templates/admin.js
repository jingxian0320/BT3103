import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
var Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);

Template.admin.helpers({
  isAdmin: function() {
    return Meteor.user() && Meteor.user().admin;
  },

  latestNews: function() {
    return News.latest();
  }
});

Template.admin.events({
  'submit form': function(event) {
    event.preventDefault();

    var text = $(event.target).find('[name=text]').val();
    News.insert({ text: text, date: new Date });

    alert('Saved latest news');
  },

  'click .login': function() {
    Meteor.loginWithTwitter();
  }
})


var options = {
    chart: {
        renderTo: 'container',
        defaultSeriesType: 'bar',
    },

    title: {
      text: 'Top 5 Most Popular Dishes'
    },
    subtitle: {
      text: 'Source: Order-details dataset'
    },
    xAxis: {
      categories: ['Cheese Fries', 'Seafood Fried Rice', 'Cheese Cake', 'Pineapple Fried Rice', 'Lemon Tea'],
      title: {
        text: 'Dishes'
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Average Daily Orders',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      }
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true
        }
      }
    },
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    series: [{name: 'Orders', data: [50, 35, 34, 20, 12]}]
};


Template.chart.helpers({
    createChart: function () {
      Meteor.defer(function() {
        Highcharts.chart('chartplace',options);
      })
    },
    remarks: function () {
      if (Session.get('option') === 'shared'){
        return 'Include only orders shared by two or more customers'
      }
      else{
        return 'Include all orders'
      }

    }
  })

Template.chart.events({
  'change #list': function (event) {
    //alert('f')

    var selVal = event.target.value;
    Session.set('option',selVal)
    if(selVal == "all" || selVal == '')
    {
    		options.title.text = 'Top 5 Most Popular Dishes';
        options.xAxis.categories = ['Cheese Fries', 'Seafood Fried Rice', 'Cheese Cake', 'Pineapple Fried Rice', 'Lemon Tea']
        options.series = [{name: 'Orders', data: [50, 35, 34, 20, 12]}]
    }
    else
    {
    		options.title.text = 'Top 5 Most Popular Shared Dishes';
        options.xAxis.categories = ['Cheese Fries', 'Cheese Cake', 'Seafood Fried Rice', 'Pineapple Fried Rice', 'Lemon Tea'];
        options.series = [{name: 'Orders', data: [32, 25, 14, 5, 2]}];

    }
    Highcharts.chart('chartplace',options);
  }
});
