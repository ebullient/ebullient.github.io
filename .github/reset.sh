#!/bin/bash -x
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BASE_DIR=$(dirname "$SCRIPT_DIR")

cd ${BASE_DIR}
for x in $(find projects -type d -maxdepth 1 -depth 1); do
    pushd $x
    git reset origin/main --hard; git clean -fq
    popd
done

cd ${BASE_DIR}
node ${SCRIPT_DIR}/update-pages.js

rm -r ${BASE_DIR}/public
cd ${BASE_DIR}/site
hugo --minify
