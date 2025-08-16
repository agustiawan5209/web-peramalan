import { KMeansClustering } from './kmeans';

class HarvestAnalysisModel {
    private clustering = new KMeansClustering();

    public async analyzeHarvestData(transactions: string[][]) {
        try {
            const result = await this.clustering.cluster(transactions);

            // You can add additional model-specific processing here
            return {
                ...result,
                summary: this.generateSummary(result)
            };
        } catch (error) {
            console.error('Clustering failed:', error);
            throw error;
        }
    }

    private generateSummary(result: any) {
        // Generate human-readable summary from the results
        const topFeatures = result.featureImportance.slice(0, 3)
            .map(f => f.item).join(', ');

        return {
            clusterCounts: {
                rendah: result.clusters.rendah.length,
                sedang: result.clusters.sedang.length,
                tinggi: result.clusters.tinggi.length
            },
            topFeatures,
            topAssociations: result.associations.slice(0, 3)
        };
    }
}
