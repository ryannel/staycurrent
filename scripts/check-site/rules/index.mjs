// Every rule the site check runs. Add a rule here, give it a level in
// ../config.mjs, and a test in ../test/.
import singleH1 from './single-h1.mjs';
import headingLevels from './heading-levels.mjs';
import duplicateIds from './duplicate-ids.mjs';
import imageAlt from './image-alt.mjs';
import internalLinks from './internal-links.mjs';
import noHeadingInFigure from './no-heading-in-figure.mjs';
import titleLine from './title-line.mjs';
import contentsAfterOpening from './contents-after-opening.mjs';
import sourcesSection from './sources-section.mjs';
import figureLabels from './figure-labels.mjs';
import rawColour from './raw-colour.mjs';
import viewportWidth from './viewport-width.mjs';
import cssBalanced from './css-balanced.mjs';
import denseProse from './dense-prose.mjs';

export const rules = [
  singleH1, headingLevels, duplicateIds, imageAlt, internalLinks, noHeadingInFigure,
  titleLine, contentsAfterOpening, sourcesSection, figureLabels,
  rawColour, viewportWidth, cssBalanced, denseProse,
];
