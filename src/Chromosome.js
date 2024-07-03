export default class Chromosome {
  constructor(name, end, markers) {
    this.start = 0;
    this.name = name;
    this.end = end;
    this.markers = markers;
    this.features = [];

    this.markers.sort((a, b) => (a.position > b.position ? 1 : -1));
  }

  markerCount() {
    return this.markers.length;
  }
  insertFeatures(features){
    this.features = features;
    this.features.sort((a, b) => (a.start > b.start ? 1 : -1));
  }
}
