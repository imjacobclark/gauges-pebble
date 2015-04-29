var UI = require('ui'),
    ajax = require('ajax'),
    Settings = require('settings');

var main = new UI.Card({
    title: 'Gaug.es',
    subtitle: 'v0.1',
    body: 'Unofficial Pebble App!'
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
        var menu = new UI.Menu({
            sections: [{
                title: "Gaug.es",
                items: data.gauges
            }]
        });

        menu.on('select', function(e) {
          var card = new UI.Card({
            title: 'Page Views Today',
            body: data.gauges[e.itemIndex].today.views,
            scrollable: true,
            style: 'large'
          });
          
          card.show();
        });

        menu.show();
    },
    function(error) {
        var card = new UI.Card({
          title: 'Oops...',
          body: 'Couldn\'t talk to Gaug.es, check your internet connection'
        });
    
        card.show();
    });
});


