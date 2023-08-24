const fs = require('fs');
const jsonschema = require('jsonschema');

// Load your predefined schema
const schema = require('./schema.json');

// Load discussion data from the GitHub Actions context
const eventPath = process.argv[2];
const discussionPayload = require(eventPath);

// Extract discussion data from the payload
const discussionTitle = discussionPayload.discussion.title;
const discussionBody = discussionPayload.discussion.body;

// Parse discussion body to extract title, labels, and content
const discussionLines = discussionBody.split('\n');
let discussionLabels = [];
let discussionContent = '';
let isLabelsSection = false;
for (const line of discussionLines) {
  if (line.startsWith('### Labels:')) {
    isLabelsSection = true;
  } else if (isLabelsSection) {
    discussionLabels = line.trim().split(', ');
    isLabelsSection = false;
  } else {
    discussionContent += line + '\n';
  }
}

// Generate prompt JSON based on extracted data
const promptJson = {
  Title: discussionTitle,
  Labels: discussionLabels,
  Body: discussionContent.trim()
};

// Debug: Print the extracted data
console.log('Extracted Data:', promptJson);

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
