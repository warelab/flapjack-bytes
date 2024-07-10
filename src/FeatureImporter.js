//import Marker from './Marker';
import Feature from './Feature';
import Chromosome from './Chromosome';
import GenomeMap from './GenomeMap';

export default class FeatureImporter {
  constructor() {
    this.featureNames = [];
    this.featureData = [];
    this.chromosomeNames = new Set();
  }

  processFeatureFileLine(line) {
    if (line.startsWith('#') || (!line || line.length === 0) || line.startsWith('\t')) {
      return;
    }

    // Only parse our default map file lines (i.e. not the special fixes for
    // exactly specifying the chromosome length)
    // http://flapjack.hutton.ac.uk/en/latest/projects_&_data_formats.html#data-sets-maps-and-genotypes
    const tokens = line.split('\t');
    if (tokens.length === 4) {
      const featureName = tokens[0];
      const chromosome = tokens[1];
      const startPos = tokens[2];
      const endPos = tokens[3];

      // Keep track of the chromosomes that we've found
      this.chromosomeNames.add(chromosome);

      // Create a marker object and add it to our array of markers
      const feature = new Feature(featureName, chromosome, parseFloat(startPos.replace(/,/g, ''), 10), parseFloat(endPos.replace(/,/g, ''), 10));
      this.featureData.push(feature);
    }
  }

  createFeatures(genomeMap) {
    genomeMap.chromosomes.forEach(chromosome => {
      const chromosomeFeatures = this.featureData.filter(m => m.chromosome === chromosome.name);
      chromosome.insertFeatures(chromosomeFeatures);
    });
    return genomeMap;
  }

  parseFile(fileContents, genomeMap) {
    const features = fileContents.split(/\r?\n/);
    for (let feature = 0; feature < features.length; feature += 1) {
      this.processFeatureFileLine(features[feature]);
    }

    const map = this.createFeatures(genomeMap);

    return map;
  }

  // A method which converts BrAPI markerpositions into Flapjack markers for
  // rendering
  } 