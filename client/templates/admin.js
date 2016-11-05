import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
var Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/drilldown')(Highcharts);
require('highcharts/modules/data')(Highcharts);

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

var optionsHistogram = {
  chart: {
    type: 'column'
  },
  title: {
    text: 'Daily and Hourly Customer Visits, 3 Oct 2016 - 9 Oct 2016'
  },
  subtitle: {
    text: 'Click the dates to view hourly customer visits'
  },
  xAxis: {
    type: 'category'
  },
  yAxis: {
    title: {
      text: 'Number of customer visits'
    }

  },
  legend: {
    enabled: false
  },
  plotOptions: {
    series: {
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        format: '{point.y}'
      }
    }
  },

  tooltip: {
    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
  },

  series: [{
    name: "Date",
    colorByPoint: true,
    pointWidth: 100,
    borderWidth: 1,
    data: [{
      name: "Monday 3/10/16",
      y: 121,
      drilldown: "Monday"
    }, {
      name: "Tuesday 4/10/16",
      y: 115,
      drilldown: "Tuesday"
    }, {
      name: "Wednesday 5/10/16",
      y: 130,
      drilldown: "Wednesday"
    }, {
      name: "Thursday 6/10/16",
      y: 130,
      drilldown: "Thursday"
    }, {
      name: "Friday 7/10/16",
      y: 150,
      drilldown: "Friday"
    }, {
      name: "Saturday 8/10/16",
      y: 180,
      drilldown: "Saturday"
    }, {
      name: "Sunday 9/10/16",
      y: 173,
      drilldown: "Sunday"
    }]
  }],
  drilldown: {
    series: [{
      groupPadding: 0,
      pointPadding: 0,
      borderWidth: 1,
      name: "Monday",
      id: "Monday",
      data: [
        ["10am - 11am",3],
        ["11am - 12pm",7],
        ["12pm - 1pm",30],
        ["1pm - 2pm",8],
        ["2pm - 3pm",4],
        ["3pm - 4pm",2],
        ["4pm - 5pm",5],
        ["5pm - 6pm",18],
        ["6pm - 7pm",24],
        ["7pm - 8pm",13],
        ["8pm - 9pm",7]
      ]
    }, {
      groupPadding: 0,
      pointPadding: 0,
      borderWidth: 1,
      name: "Tuesday",
      id: "Tuesday",
      data: [
        ["10am - 11am",1],
        ["11am - 12pm",4],
        ["12pm - 1pm",28],
        ["1pm - 2pm",15],
        ["2pm - 3pm",1],
        ["3pm - 4pm",4],
        ["4pm - 5pm",10],
        ["5pm - 6pm",20],
        ["6pm - 7pm",19],
        ["7pm - 8pm",8],
        ["8pm - 9pm",5]
      ]
    }, {
      groupPadding: 0,
      pointPadding: 0,
      borderWidth: 1,
      name: "Wednesday",
      id: "Wednesday",
      data: [
        ["10am - 11am",3],
        ["11am - 12pm",5],
        ["12pm - 1pm",29],
        ["1pm - 2pm",21],
        ["2pm - 3pm",5],
        ["3pm - 4pm",1],
        ["4pm - 5pm",7],
        ["5pm - 6pm",8],
        ["6pm - 7pm",29],
        ["7pm - 8pm",10],
        ["8pm - 9pm",12]
      ]
    }, {
      groupPadding: 0,
      pointPadding: 0,
      borderWidth: 1,
      name: "Thursday",
      id: "Thursday",
      data: [
        ["10am - 11am",6],
        ["11am - 12pm",11],
        ["12pm - 1pm",23],
        ["1pm - 2pm",19],
        ["2pm - 3pm",7],
        ["3pm - 4pm",1],
        ["4pm - 5pm",2],
        ["5pm - 6pm",11],
        ["6pm - 7pm",20],
        ["7pm - 8pm",14],
        ["8pm - 9pm",16]
      ]
    }, {
      groupPadding: 0,
      pointPadding: 0,
      borderWidth: 1,
      name: "Friday",
      id: "Friday",
      data: [
        ["10am - 11am",2],
        ["11am - 12pm",2],
        ["12pm - 1pm",40],
        ["1pm - 2pm",13],
        ["2pm - 3pm",2],
        ["3pm - 4pm",5],
        ["4pm - 5pm",2],
        ["5pm - 6pm",14],
        ["6pm - 7pm",11],
        ["7pm - 8pm",34],
        ["8pm - 9pm",25]
      ]
    }, {
      groupPadding: 0,
      pointPadding: 0,
      borderWidth: 1,
      name: "Saturday",
      id: "Saturday",
      data: [
        ["10am - 11am",1],
        ["11am - 12pm",5],
        ["12pm - 1pm",15],
        ["1pm - 2pm",37],
        ["2pm - 3pm",18],
        ["3pm - 4pm",12],
        ["4pm - 5pm",12],
        ["5pm - 6pm",2],
        ["6pm - 7pm",15],
        ["7pm - 8pm",42],
        ["8pm - 9pm",21]
      ]
    }, {
      groupPadding: 0,
      pointPadding: 0,
      borderWidth: 1,
      name: "Sunday",
      id: "Sunday",
      data: [
        ["10am - 11am",0],
        ["11am - 12pm",3],
        ["12pm - 1pm",25],
        ["1pm - 2pm",23],
        ["2pm - 3pm",19],
        ["3pm - 4pm",11],
        ["4pm - 5pm",7],
        ["5pm - 6pm",18],
        ["6pm - 7pm",27],
        ["7pm - 8pm",31],
        ["8pm - 9pm",9]
      ]
    }]
  }
}

var optionsChart = {
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
      Highcharts.chart('barchartplace',optionsChart);
    })
  },
  createHistogram: function () {
    Meteor.defer(function() {
      Highcharts.chart('histogramplace',optionsHistogram);
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
      optionsChart.title.text = 'Top 5 Most Popular Dishes';
      optionsChart.xAxis.categories = ['Cheese Fries', 'Seafood Fried Rice', 'Cheese Cake', 'Pineapple Fried Rice', 'Lemon Tea']
      optionsChart.series = [{name: 'Orders', data: [50, 35, 34, 20, 12]}]
    }
    else
    {
      optionsChart.title.text = 'Top 5 Most Popular Shared Dishes';
      optionsChart.xAxis.categories = ['Cheese Fries', 'Cheese Cake', 'Seafood Fried Rice', 'Pineapple Fried Rice', 'Lemon Tea'];
      optionsChart.series = [{name: 'Orders', data: [32, 25, 14, 5, 2]}];

    }
    Highcharts.chart('chartplace',optionsChart);
  }
});
