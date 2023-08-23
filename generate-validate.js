const fs = require('fs');
const jsonschema = require('jsonschema');

// Load your predefined schema
const schema = require('./schema.json'); 

// Simulate discussion creation event payload (replace this with your actual GitHub event payload)
const discussionPayload = require(process.argv[2]);

// Extract relevant information from the event payload
const newDiscussion = {
  DiscussionTitle: discussionPayload.discussion.title,
  Labels: discussionPayload.discussion.labels.map(label => label.name),
  DiscussionBody: discussionPayload.discussion.body
};

// Generate prompt JSON based on discussion
const promptJson = {
  DiscussionTitle: newDiscussion.DiscussionTitle,
  Labels: newDiscussion.Labels,
  DiscussionBody: newDiscussion.DiscussionBody
};

// Serialize promptJson to JSON format
const promptJsonString = JSON.stringify(promptJson, null, 2);

// Write promptJson to a file named prompt.json
fs.writeFileSync('prompt.json', promptJsonString);

// Log the contents of prompt.json
console.log('Contents of prompt.json:\n', promptJsonString);

// Validate against the schema
const validationResult = jsonschema.validate(promptJson, schema);

if (validationResult.valid) {
  console.log('Generated prompt JSON is valid.');
} else {
  console.log('Generated prompt JSON is invalid.');
  console.log('Validation errors:', validationResult.errors);
}
