# Particular Proteins

Using threejs particle systems to represent protein molecules from the protein data bank.
To follow along with the dev blog visit https://jamesledger.co.uk/blog/posts/exploring-proteins

Visit the deployed version at https://proteins.jamesledger.co.uk/

## Quick start

To get it running locally:

Install deps with
`pnpm i`

Run dev server with:
`pnpm dev`

## Deployment

Currently deploys on merge to main via AWS Amplify deployment pipelines


## Roadmap
[ ] Write tests for mmCIF parser to ensure it works with other proteins
[ ] GPU instancing for individual atoms
[ ] Allow users to select their own protein
[ ] Profile performance targeting 60fps
