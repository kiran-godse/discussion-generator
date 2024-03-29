const fs = require('fs');
const jsonschema = require('jsonschema');

// Load your predefined schema
const schema = require('./schema.json'); // Adjust the path as needed

// Load discussion data from the GitHub Actions context
const eventPath = process.argv[2];
const discussionPayload = require(eventPath);

// Extract discussion data from the payload
const discussionTitle = discussionPayload.discussion.title;
const discussionLabels = discussionPayload.discussion.labels.map(label => label.name);
const discussionBody = discussionPayload.discussion.body;

// Generate prompt JSON based on discussion
const promptJson = {
  Title: discussionTitle,
  Labels: discussionLabels,
  Body: discussionBody
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
