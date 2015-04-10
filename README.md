# Champion Statistics
This is a webapp created for the Riot Games API Challenge (April 2015)

A working copy of this app is hosted <a href="https://api-challenge-web.herokuapp.com/" target="_blank">here</a> on Heroku

To run this webapp locally, you need a machine with Node.js and MongoDB installed

# App Structure
- This app consists of a worker compoenent (worker.js) and a web server compoenent (web.js)
- worker.js calls the Riot Games API at an interval to grab URF match ids and match data
- worker.js also processes the match data and stores the result into mongodb
- web.js serves static files located in the web folder, and also serves champion statistics at `/data` path

# Local Setup:
1. download and extract the repository, open terminal and navigate to the extracted repo
2. make sure `mongod` is running, then run `mongorestore -h <db host> -d <db name> db_template/api_challenge`
3. run `npm install`
4. run 'npm install foreman -g'
5. create a file named `.env` with the following content:
<pre><code>MONGOLAB_URI=mongodb://&lt;db host&gt;/&lt;db name&gt;
RIOT_GAMES_API_KEY=&lt;your api key&gt;</code></pre>
6. run `nf start` to start a worker and a web server, you are done
