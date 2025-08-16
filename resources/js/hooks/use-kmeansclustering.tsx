import { useEffect, useMemo, useState } from 'react';

interface ClusterResult {
    clusters: {
        rendah: string[][];
        sedang: string[][];
        tinggi: string[][];
    };
    centroids: number[][];
    associations: {
        item: string;
        influence: number;
    }[];
    featureImportance: {
        item: string;
        importance: number;
        clusterVariances: {
            rendah: number;
            sedang: number;
            tinggi: number;
        };
    }[];
    uniqueItems: string[];
}

const useKMeansClustering = (transactions: string[][], k: number = 3, maxIterations: number = 100): ClusterResult => {
    const [result, setResult] = useState<ClusterResult>({
        clusters: { rendah: [], sedang: [], tinggi: [] },
        centroids: [],
        associations: [],
        featureImportance: [],
        uniqueItems: [],
    });

    // Preprocess data and get unique items
    const { numericData, uniqueItems } = useMemo(() => {
        const allItems = new Set<string>();
        transactions.forEach((transaction) => {
            transaction.forEach((item) => allItems.add(item));
        });
        const items = Array.from(allItems);

        // Convert each transaction to a numeric vector
        const numeric = transactions.map((transaction) => {
            return items.map((item) => (transaction.includes(item) ? 1 : 0));
        });

        return { numericData: numeric, uniqueItems: items };
    }, [transactions]);

    // K-Means algorithm with feature importance calculation
    useEffect(() => {
        if (transactions.length === 0 || numericData.length === 0) return;

        // Initialize centroids randomly
        let centroids: number[][] = [];
        const numFeatures = numericData[0].length;

        for (let i = 0; i < k; i++) {
            const randomIndex = Math.floor(Math.random() * numericData.length);
            centroids.push([...numericData[randomIndex]]);
        }

        let clusters: number[][] = Array(k).fill([]);
        let prevClusters: number[][] = [];
        let iterations = 0;

        while (iterations < maxIterations) {
            // Assign each point to the nearest centroid
            clusters = Array(k)
                .fill([])
                .map(() => []);

            numericData.forEach((point, idx) => {
                let minDistance = Infinity;
                let clusterIndex = 0;

                centroids.forEach((centroid, i) => {
                    const distance = euclideanDistance(point, centroid);
                    if (distance < minDistance) {
                        minDistance = distance;
                        clusterIndex = i;
                    }
                });

                clusters[clusterIndex].push(idx);
            });

            // Check for convergence
            if (JSON.stringify(clusters) === JSON.stringify(prevClusters)) {
                break;
            }

            prevClusters = clusters.map((cluster) => [...cluster]);

            // Update centroids
            centroids = clusters.map((cluster) => {
                if (cluster.length === 0) {
                    return centroids[clusters.indexOf(cluster)];
                }

                const sum = Array(numFeatures).fill(0);
                cluster.forEach((pointIdx) => {
                    const point = numericData[pointIdx];
                    point.forEach((val, i) => {
                        sum[i] += val;
                    });
                });

                return sum.map((s) => s / cluster.length);
            });

            iterations++;
        }

        // Sort clusters by size to determine rendah, sedang, tinggi
        const sortedClusters = clusters
            .map((cluster, idx) => ({ indices: cluster, centroid: centroids[idx] }))
            .sort((a, b) => a.indices.length - b.indices.length);

        // Prepare the final clusters
        const finalClusters = {
            rendah: sortedClusters[0].indices.map((idx) => transactions[idx]),
            sedang: sortedClusters[1].indices.map((idx) => transactions[idx]),
            tinggi: sortedClusters[2].indices.map((idx) => transactions[idx]),
        };

        // Calculate item influence (association rules)
        const itemInfluences = uniqueItems.map((item) => {
            const itemIndex = uniqueItems.indexOf(item);
            const itemSupport = transactions.filter((t) => t.includes(item)).length / transactions.length;

            let clusterInfluence = 0;
            Object.values(finalClusters).forEach((clusterTransactions) => {
                const clusterSupport = clusterTransactions.filter((t) => t.includes(item)).length / (clusterTransactions.length || 1);
                clusterInfluence += Math.abs(clusterSupport - itemSupport);
            });

            return {
                item,
                influence: clusterInfluence,
            };
        });

        // Calculate feature importance
        const featureImportance = uniqueItems.map((item) => {
            const itemIndex = uniqueItems.indexOf(item);

            // Calculate mean and variance for each cluster
            const clusterStats = sortedClusters.map((cluster) => {
                const values = cluster.indices.map((idx) => numericData[idx][itemIndex]);
                const mean = values.reduce((sum, val) => sum + val, 0) / (values.length || 1);
                const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length || 1);
                return { mean, variance };
            });

            // Importance is based on between-cluster variance vs within-cluster variance
            const globalMean = numericData.reduce((sum, point) => sum + point[itemIndex], 0) / numericData.length;
            const betweenVar =
                clusterStats.reduce((sum, stat, i) => {
                    return sum + sortedClusters[i].indices.length * Math.pow(stat.mean - globalMean, 2);
                }, 0) / numericData.length;

            const withinVar = clusterStats.reduce((sum, stat) => sum + stat.variance, 0) / k;

            const importance = betweenVar / (withinVar + 1e-9); // Add small constant to avoid division by zero

            return {
                item,
                importance,
                clusterVariances: {
                    rendah: clusterStats[0].variance,
                    sedang: clusterStats[1].variance,
                    tinggi: clusterStats[2].variance,
                },
            };
        });

        // Sort results
        const sortedAssociations = itemInfluences.sort((a, b) => b.influence - a.influence);
        const sortedFeatureImportance = featureImportance.sort((a, b) => b.importance - a.importance);

        setResult({
            clusters: finalClusters,
            centroids: sortedClusters.map((c) => c.centroid),
            associations: sortedAssociations,
            featureImportance: sortedFeatureImportance,
            uniqueItems,
        });
    }, [transactions, numericData, uniqueItems, k, maxIterations]);

    return result;
};

// Helper functions
const euclideanDistance = (a: number[], b: number[]): number => {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
};

export default useKMeansClustering;
