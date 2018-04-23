namespace OcMap {
    import customElement = Polymer.decorators.customElement;
    import property = Polymer.decorators.property;

    @customElement('oc-leaflet-circle')
    class OcLeafletMap extends Polymer.Element {

        @property({type: Object, notify: true, reflectToAttribute: true})
        private latLng: L.LatLng;

        @property({type: Object})
        private circle: L.Circle;

        ready() {
            super.ready();
        }

        public createCircle(latLng: L.LatLng, circleRadius: number): L.Circle {
            return L.circle([latLng.lat, latLng.lng], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: circleRadius
            })
        }
    }
}
