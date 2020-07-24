const wtd = require("what-the-diff");
const fetch = require('node-fetch');
var fs = require("fs");

const ev = JSON.parse(
  fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')
);
const prNum = ev.pull_request.number;

console.log('pr ' + prNum);

// https://github.community/t/github-sha-isnt-the-value-expected/17903/2
//const sha = process.env.GITHUB_SHA
const sha = process.env.PR_HEAD_SHA;

console.log('sha ' + sha);

const token = process.env.GITHUB_TOKEN;

console.log('token ' + token);

const workspace = process.env.GITHUB_WORKSPACE;

owner_repo = process.env.GITHUB_REPOSITORY;

const [owner, repo] = owner_repo.split("/");

console.log("owner: " + owner);

console.log("repo: " + repo);

const output_file = "comby-files-64a2a202-cd8b-11ea-87d0-0242ac130003.txt";

async function files() {
    // https://github.com/rvantonder/silly-test-repo/pull/2.diff

  const response = await fetch(`https://github.com/${owner}/${repo}/pull/${prNum}.diff`);
  const body = await response.text();

  console.log('diff: ' + body);

  const diffs = wtd.parse(body);

  all_paths = "";

  for (var i = 0; i < diffs.length; i++) {
    path = diffs[i].newPath;
    console.log("iterating diff file " + path);
    try {
        path = path.slice(path.indexOf("/")+1); // strip b/
        all_paths = all_paths + " " + path
    } catch {}
  }
  console.log("setting all_paths: " + all_paths);
  fs.writeFile(`${workspace}/${output_file}`, all_paths, function (err) {
    if (err) return console.log(err);
    console.log(`saved to ${workspace}/${output_file}`);
  });
}

files()

