# Champion Statistics
This is a webapp created for the Riot Games API Challenge (April 2015)

A working copy of this app is hosted <a href="https://api-challenge-web.herokuapp.com/" target="_blank">here</a> on Heroku

To run this webapp locally, you need a machine with Node.js and MongoDB installed

# Local Setup:
1. download and extract the repository, open terminal and navigate to the extracted repo
2. make sure `mongod` is running, then run `mongorestore -h <db host> -d <db name> db_template/api_challenge`
3. run `npm install`
4. create a file named `.env` with the following content:
<pre><code>MONGOLAB_URI=mongodb://<db host>/<db name>
RIOT_GAMES_API_KEY=<your api key></code></pre>
5. run `nf start` to start a worker and a web server, you are done
