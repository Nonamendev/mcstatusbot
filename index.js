import 'dotenv/config';
import { ClusterManager, ReClusterManager, fetchRecommendedShards } from 'discord-hybrid-sharding';
import { logSharding, logError } from './functions/consoleLogging.js';

const shardsPerClusters = 2;

let manager = new ClusterManager('./bot.js', {
	shardsPerClusters: shardsPerClusters,
	token: process.env.TOKEN,
	mode: 'process'
});
manager.extend(new ReClusterManager());

manager.on('debug', logSharding);
try {
	spawnShards();
} catch (error) {
	logError('Error spawning shards', error);
}

async function spawnShards() {
	await manager.spawn();
	setInterval(reclusterShards, 24 * 60 * 60 * 1000);
}

async function reclusterShards() {
	try {
		const recommendedShards = await fetchRecommendedShards(process.env.TOKEN);
		if (recommendedShards != manager.totalShards) {
			manager.recluster.start({
				restartMode: 'gracefulSwitch',
				totalShards: recommendedShards,
				shardsPerClusters: shardsPerClusters,
				shardList: null,
				shardClusterList: null
			});
		}
	} catch (error) {
		logError('Error reclustering shards', error);
	}
}
