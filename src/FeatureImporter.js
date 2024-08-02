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
    if (tokens.length === 12) {
      const chromosome = tokens[0];
      const startPos = +tokens[1];
      const endPos = +tokens[2];
      const featureName = tokens[3];
      const score = tokens[4];
      const strand = tokens[5];
      const thickStart = tokens[6];
      const thickEnd = tokens[7];
      const color = tokens[8];
      const blocks = +tokens[9];
      // blockSizes and blockStarts are comma separated lists
      const blockSizes = tokens[10].split(',').map(s => +s);
      const blockStarts = tokens[11].split(',').map(s => +s);


      // Keep track of the chromosomes that we've found
      this.chromosomeNames.add(chromosome);

      // Create a feature object for the entire gene (from startPos to endPos)
      const feature = new Feature('gene',featureName, chromosome, startPos, endPos);
      this.featureData.push(feature);

      // Create an exon object for each of the blocks
      blockSizes.forEach((size,i) => {
        const exonStart = blockStarts[i] + startPos;
        const exonEnd = exonStart + size;
        const j = i+1;
        const exon = new Feature('exon',featureName + 'exon' + j, chromosome, exonStart, exonEnd);
        this.featureData.push(exon);
      });
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
