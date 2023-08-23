const fs = require('fs');
const jsonschema = require('jsonschema');

// Sample schema for validation
const schema = {
  type: 'object',
  properties: {
    discussionTitle: { type: 'string' },
    discussionLabels: { type: 'array', items: { type: 'string' } },
    discussionBody: { type: 'string' }
  },
  required: ['discussionTitle', 'discussionLabels', 'discussionBody']
};

// Simulating discussion creation
const newDiscussion = {
  title: "Sample Discussion",
  labels: ["feature", "bug"],
  body: "This is a sample discussion about generating prompt JSON."
};

// Generate prompt JSON based on discussion
const promptJson = {
  discussionTitle: newDiscussion.title,
  discussionLabels: newDiscussion.labels,
  discussionBody: newDiscussion.body
};

// Serialize promptJson to JSON format
const promptJsonString = JSON.stringify(promptJson, null, 2);

// Write promptJson to a file named prompt.json
fs.writeFileSync('prompt.json', promptJsonString);

// Validate against the schema
const validationResult = jsonschema.validate(promptJson, schema);

if (validationResult.valid) {
  console.log('Generated prompt JSON is valid.');
} else {
  console.log('Generated prompt JSON is invalid.');
  console.log('Validation errors:', validationResult.errors);
}
