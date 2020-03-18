import { Component, OnInit, AfterViewInit } from '@angular/core';
import { defaults as defaultControls } from 'ol/control';

import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import View from 'ol/View';
import ZoomToExtent from 'ol/control/ZoomToExtent';
import Overlay from 'ol/Overlay';
import Vector from 'ol/layer/Vector';
import vector from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {fromLonLat} from 'ol/proj';




@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  

  ngAfterViewInit() {

    //
    // elements that make up the popup.
    //
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer'); 

    // 
    // Create an overlay to anchor the popup to the map.
    // 
    var overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    // 
    // Add a click handler to hide the popup.
    // Don't follow the href.
    // 
    closer.onclick = function() {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };

    // 
    // Create the map.
    // 

    var map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        center: [813079.7791264898, 5929220.284081122],
        zoom: 7
      }),
      overlays:[overlay],
      controls: defaultControls().extend([
        new ZoomToExtent({
          extent: [
            813079.7791264898, 5929220.284081122,
            848966.9639063801, 5936863.986909639
          ]
        })
      ])
    });

    // 
    // Create the markers.
    // 
    var layer = new Vector({
      source: new vector({
          features: [
              new Feature({
                  geometry: new Point(fromLonLat([4.35247, 50.84673]))
              })
          ]
      })
  });
  var layer2 = new Vector({
    source: new vector({
      features: [
        new Feature({
          geometry: new Point(fromLonLat([250.45456 , 50.55656]))
        })
      ]
    })
  });
  map.addLayer(layer2);
  map.addLayer(layer);






    // 
    // Add a click handler to the map to render the popup.
    // 
    map.on('singleclick', function(evt) {
      if( map.hasFeatureAtPixel(evt.pixel) == true) {
        var coordinate = evt.coordinate;
        var hdms = coordinate;
        content.innerHTML = '<p>hello I am a popup:</p><code>' + hdms +
            '</code>';
        overlay.setPosition(coordinate);

      }
    
    });
      }
  

}

  