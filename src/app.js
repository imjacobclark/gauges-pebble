var UI = require('ui'),
    ajax = require('ajax'),
    Settings = require('settings');

var main = new UI.Card({
    title: 'Gaug.es',
    subtitle: 'v0.1',
    body: 'Web Analytics'
});

main.show();

Settings.config(
  { url: 'http://pebble-gauges.jacob.uk.com' },
  function(e) {
    console.log('opened configurable');
  },
  function(e) {
    console.log('closed configurable');
  }
);

main.on('click', 'up', function(e) {
    console.warn('Initialising application, grabbing data...');

    ajax({
        url: 'https://secure.gaug.es/gauges',
        type: 'json',
        headers: {
          "X-Gauges-Token": ""
        }
    },    
    function(data) {
        var dashboardList = new UI.Menu({
            sections: [{
                title: "Select View",
                items: data.gauges
            }]
        });

        dashboardList.on('select', function(dashboardSelection) {
          var metricList = new UI.Menu({
              sections: [{
                  title: "Select Metric",
                  items: [
                    {
                      'title': 'Page Views',
                    },
                    {
                      'title': 'People'
                    }
                  ]
              }]
          });
          
          metricList.on('select', function(metricSelection) {
            switch(metricSelection.itemIndex){
              case 0:
                var views = new UI.Card({
                  title: 'Page Views',
                  body: data.gauges[dashboardSelection.itemIndex].today.views,
                  scrollable: true,
                  style: 'large'
                });
                
                views.show();
              break;
              case 1:
                var people = new UI.Card({
                  title: 'People',
                  body: data.gauges[dashboardSelection.itemIndex].today.people,
                  scrollable: true,
                  style: 'large'
                });
                
                people.show();
              break;
            }
          });
          
          metricList.show();
        });

        dashboardList.show();
    },
    function(error) {
        var card = new UI.Card({
          title: 'Oops...',
          body: 'Couldn\'t talk to Gaug.es, check your internet connection'
        });
    
        card.show();
    });
});


