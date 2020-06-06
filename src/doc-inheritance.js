'use strict';
const extensibility = require('./extensibility');
const yaml = require('yaml');
const jp = require('jsonpath');
const fs = require('promise-fs');
const path = require('path');

async function expand(obj) {
  // changes are made to the clone rather than the original
  const clone = JSON.parse(JSON.stringify(obj));

  const nodes = jp.nodes(obj, '$..*');

  for (var i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const property = node.path.pop();

    switch (property) {
      case '$contract-ref':
        try {
          const replacement = await getReplacement(node.value);
          const parent = jp.parent(clone, jp.stringify(node.path));
          const propertyToUpdate = node.path.pop();
          parent[propertyToUpdate] = replacement;
        } catch (error) {
          return {
            errors: {
              originalPath: error
            }
          }
        }
        break;
      case '$contract-base':
        // TODO: implement base type
        break;
    }
  }

  return {
    obj: clone
  };
}

async function getReplacement(ref) {
  var contents;
  var fileExtension;

  // TODO: support # notation

  // try local
  if (fs.existsSync(ref)) {
    fileExtension = path.extname(ref).toLowerCase();
    try {
      contents = await fs.readFile(ref, {encoding:'utf-8'});
    } catch (error) {
      // Unsuccessful
    }
  }

  if (!contents) {
    // try module
    const extension = await extensibility.getExtension(ref, 'file');
    contents = extension.contents;
    fileExtension = extension.fileExtension.toLowerCase();

    if (fileExtension === '.yaml' || fileExtension === '.yml') {
      // deserialize YAML
      contents = yaml.parse(contents);
    } else if (fileExtension === '.json') {
      // deserialize JSON
      contents = JSON.parse(contents)
    }
  }

  return contents;
}

module.exports.expand = expand;