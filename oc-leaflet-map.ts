namespace OcMap {
    import customElement = Polymer.decorators.customElement;
    import query = Polymer.decorators.query;
    import property = Polymer.decorators.property;
    import observe = Polymer.decorators.observe;

    @customElement('oc-leaflet-map')
    class OcLeafletMap extends Polymer.Element {
        private map: L.Map;
        private currentMarker: L.Marker;
        private layers: L.Layer[] = [];

        @query('#myMap')
        private mapContainer: any;

        @property({type: Boolean})
        private isSelectable: boolean = true;

        @property({type: Number, notify: true, reflectToAttribute: true})
        private latLng: L.LatLng;

        @property({type: Boolean})
        private disabled: boolean = false;

        ready() {
            super.ready();
            // Accommodate shadow dom load of the css
            setTimeout(() => { window.dispatchEvent(new Event('resize')) }, 250);

            // Default image path, for the markers
            L.Icon.Default.imagePath = '../../../images/';
            this.map = L.map(this.mapContainer).setView([-26, 28], 14);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);

            this.addMapEvents();
        }

        @observe('latLng')
        private onLatAndLngChange(latLng) {
            this.addMarker(latLng);
        }

        @observe('disabled')
        private onDisabled(disabled) {
            if (!this.map) return;
            if (disabled)
                this.map.dragging.disable();
            else
                this.map.dragging.enabled()
        }

        private addMapEvents() {
            this.onDisabled(this.disabled);
            this.map.on('click', (e: any) => {
                if (!this.isSelectable || this.disabled) return;
                this.latLng = <L.LatLng>e.latlng;
            })
        }

        private addMarker(latLng: L.LatLng) {
            if (this.currentMarker) {
                this.currentMarker.setLatLng(latLng);
            } else {
                this.currentMarker = L.marker(latLng);
                this.currentMarker.addTo(this.map);
            }

            this.map.panTo(latLng);
        }

        public addCircleToMap(layer: L.Circle, haveMultipleLayers: boolean, circleRadius: number) {
            if (haveMultipleLayers) {
                this.layers.push(layer);
                layer.addTo(this.map);
            } else {
                if (this.layers[0]) {
                    (<L.Circle>this.layers[0]).setLatLng(this.latLng);
                    (<L.Circle>this.layers[0]).setRadius(circleRadius);
                } else {
                    this.layers.push(layer);
                    layer.addTo(this.map);
                }
            }
        }
    }
}
