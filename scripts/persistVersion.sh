#!/bin/bash

echo "Persisting version"

git s
git add VERSION
git commit -m "[ci skip] Bumping version"
git remote rm origin
git remote add origin https://qlikossbuild:${ghoauth}@github.com/qlik-oss/qsSimpleKPI.git
git push