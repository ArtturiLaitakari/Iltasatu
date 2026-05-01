#!/bin/sh
npm run build
# Julkaise paikallinen build Netlifyyn tuotantoon
netlify deploy --dir=dist --prod
