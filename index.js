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

owner_repo = process.env.GITHUB_REPOSITORY;

const [owner, repo] = owner_repo.split("/");

console.log("owner: " + owner);

console.log("repo: " + repo);

async function files() {
    // https://github.com/rvantonder/silly-test-repo/pull/2.diff

  const response = await fetch(`https://github.com/${owner}/${repo}/pull/${prNum}.diff`);
  const body = await response.text();

  console.log('diff: ' + body);

  const diffs = wtd.parse(body);

  all_paths = "";

  for (var i = 0; i < diffs.length; i++) {
    path = diffs[i].newPath;
    path = path.slice(path.indexOf("/")+1); // strip b/
    console.log("iterating diff file" + diffs[i].newPath);
    all_paths = all_paths + " " + path
  }
  console.log("setting all_paths: " + all_paths);
  fs.writeFile('files.txt', all_paths, function (err) {
    if (err) return console.log(err);
    console.log('saved to files.txt');
  });
}

files()

