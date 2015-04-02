var Constants = {
	EARLIEST_TIMESTAMP: 1427866500,
	API_CALL_INTERVAL: 1500, //access the riot games api only once every 1.5s to prevent capping out requests
	MATCH_IDS_PULL_INTERVAL: 60000, //pull the next batch of match ids every minute, until caught up with current time,
	TEN_MINUTES: 600000,
	TEST_MONGODB_HOST: 'mongodb://localhost:27017/api_challenge'
};

module.exports = Constants;