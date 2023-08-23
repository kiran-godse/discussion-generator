const fs = require('fs');
const jsonschema = require('jsonschema');

// Load your predefined schema
const schema = require('./schema.json'); 

// Load discussion data from the GitHub Actions context
const eventPath = process.argv[2];
const discussionPayload = require(eventPath);

// Debug: Print the event payload
console.log('Event Payload:', discussionPayload);

// Extract discussion data from the payload
const discussionTitle = discussionPayload.discussion.title;
const discussionBody = discussionPayload.discussion.body;
const discussionLabels = discussionPayload.discussion.labels ? discussionPayload.discussion.labels.map(label => label.name) : [];

// Debug: Print the extracted discussion data
console.log('Discussion Title:', discussionTitle);
console.log('Discussion Body:', discussionBody);
console.log('Discussion Labels:', discussionLabels);

// Generate prompt JSON based on discussion
const promptJson = {
  DiscussionTitle: discussionTitle,
  Labels: discussionLabels,
  DiscussionBody: discussionBody
};

// Debug: Print the contents of prompt.json
console.log('Contents of prompt.json:\n', JSON.stringify(promptJson, null, 2));

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
