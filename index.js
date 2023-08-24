const core = require("@actions/core");
const github = require("@actions/github");
const Ajv = require("ajv");

console.log('PAT:', process.env.PAT); // Add this line

const ajv = new Ajv();
const schema = require("./schema.json");

try {
  const discussionNum = github.context.payload.discussion.number;
  const discussionNodeId = github.context.payload.discussion.node_id;
  const discussionBody = github.context.payload.discussion.body;

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

    if (!isValid) {
      const validationErrors = ajv.errorsText();
      throw new Error(`Discussion data is not valid: ${validationErrors}`);
    }

    core.setOutput("disc_ID", discussionNodeId);
    core.setOutput("disc_body", discussionBody);
    core.setOutput("disc_labels", discussionLabels.join(", "));
  });
} catch (error) {
  core.setFailed(error.message);
}
