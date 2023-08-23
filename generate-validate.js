const fs = require('fs');
const jsonschema = require('jsonschema');

// Load your predefined schema
const schema = require('./schema.json'); 

// Simulate discussion creation
const newDiscussion = {
  DiscussionTitle: "Sample Discussion",
  Labels: ["Label1", "Label2"],
  DiscussionBody: "This is a sample discussion about generating prompt JSON."
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

// Validate against the schema
const validationResult = jsonschema.validate(promptJson, schema);

if (validationResult.valid) {
  console.log('Generated prompt JSON is valid.');
} else {
  console.log('Generated prompt JSON is invalid.');
  console.log('Validation errors:', validationResult.errors);
}
