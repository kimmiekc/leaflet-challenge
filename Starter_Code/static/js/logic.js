function getColor(d) {
    return d > 10 ? '#800026' :
      d > 8 ? '#BD0026' :
        d > 7 ? '#E31A1C' :
          d > 5 ? '#FC4E2A' :
            d > 3 ? '#FD8D3C' :
              d > 2.5 ? '#FEB24C' :
                d > 1 ? '#FED976' :
                  '#FFEDA0';
  }
  
  function popUpMsg(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
  
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1
  });
  
  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 18
  });
  
  let baseMaps = {
    "Street Map": streetmap,
    "Topographic Map": topo
  };
  
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap]    
  });
  streetmap.addTo(myMap); 
  let earthquakes = new L.LayerGroup();
  
  let overlayMaps = {
    Earthquakes: earthquakes
  };
  
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
  const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  d3.json(queryUrl).then(function (data) {
    console.log('data:', data)
    console.log(data.features[0].geometry.coordinates[2])

    L.geoJSON(data, {
      style: function (feature) {
        return {
          color: getColor(feature.geometry.coordinates[2])
        }
      },
      pointToLayer: function (feature, latlng) {
        return new L.CircleMarker(latlng, {
          radius:feature.properties.mag*10,
          fillOpacity: 0.75
        });
  
      },
      onEachFeature: popUpMsg
    }).addTo(earthquakes);
  
  
  
    earthquakes.addTo(myMap);
  });
  
  let legend = L.control({ position: 'bottomright' });
  
  legend.onAdd = function (map) {
  
    let div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2.5, 3, 5, 7, 8, 10],
      labels = [];
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
  
    return div;
  };
  legend.addTo(myMap);