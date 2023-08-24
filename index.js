const core = require("@actions/core");
const github = require("@actions/github");
const Ajv = require("ajv");

const ajv = new Ajv();
const schema = require("./schema.json");

try {
const Title = discussionPayload.discussion.title;
const Body = discussionPayload.discussion.body;

  const query = `
    query {
      repository(owner: "${github.context.repo.owner}", name: "${github.context.repo.repo}") {
        discussion(number: ${discussionNum}) {
          title
          body
          labels(first: 10) {
            nodes {
              name
            }
          }
        }
      }
    }
  `;

  const octokit = github.getOctokit(core.getInput("PAT"));

  octokit.graphql(query).then((response) => {
    const discussion = response.repository.discussion;
    const discussionLabels = discussion.labels.nodes.map((node) => node.name);

    // Validation Step
    const isValid = ajv.validate(schema, {
      Title: discussion.title,
      Labels: discussionLabels,
      Body: discussion.body
    });

    // Validate against the schema
const validationResult = jsonschema.validate(promptJson, schema);
if (validationResult.valid) {
  console.log('Generated prompt JSON is valid.');
} else {
  console.log('Generated prompt JSON is invalid.');
  console.log('Validation errors:', validationResult.errors);
}
  });
} catch (error) {
  core.setFailed(error.message);
}
