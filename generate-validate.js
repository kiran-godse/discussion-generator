const fs = require('fs');

// Load discussion data from the GitHub Actions context
const eventPath = process.argv[2];
const discussionPayload = require(eventPath);

// Extract discussion data from the payload
const discussionTitle = discussionPayload.discussion.title;
const discussionBody = discussionPayload.discussion.body;

// Function to extract labels from discussion body
function extractLabelsFromDiscussionBody(body) {
  const labelsRegex = /labels:\s*((?:[\w\s-]+,?\s*)+)/i;
  const match = body.match(labelsRegex);
  if (match && match[1]) {
    const labelsString = match[1];
    const labelsArray = labelsString.split(',').map(label => label.trim());
    return labelsArray;
  }
  return [];
}

const discussionLabels = extractLabelsFromDiscussionBody(discussionBody);

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
