export default class Feature {
  constructor(type, name, chromosome, startPosition, endPosition) {
    this.name = name;
    this.chromosome = chromosome;
    this.start = startPosition;
    this.end = endPosition;
    this.type = type;
  }
}
