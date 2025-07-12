type Item = string;

interface IFPTreeNode {
    item: Item | null;
    count: number;
    parent: FPTreeNode | null;
    children: Record<Item, FPTreeNode>;
    next: FPTreeNode | null;
}

class FPTreeNode implements IFPTreeNode {
    item: Item | null;
    count: number;
    parent: FPTreeNode | null;
    children: Record<Item, FPTreeNode>;
    next: FPTreeNode | null;

    constructor(item: Item | null, count: number, parent: FPTreeNode | null) {
        this.item = item;
        this.count = count;
        this.parent = parent;
        this.children = {};
        this.next = null;
    }
}

interface HeaderTableEntry {
    count: number;
    node: FPTreeNode | null;
}

interface BuildFPTreeResult {
    tree: FPTreeNode;
    headerTable: Record<Item, HeaderTableEntry>;
}

type Transaction = Item[];

class FPGrowth {
    minSupport: number;

    constructor(minSupport: number) {
        this.minSupport = minSupport;
    }

    buildFPTree(transactions: Transaction[]): BuildFPTreeResult {
        const itemCounts: Record<Item, number> = {};
        transactions.forEach(transaction => {
            transaction.forEach(item => {
                itemCounts[item] = (itemCounts[item] || 0) + 1;
            });
        });

        const frequentItems = Object.keys(itemCounts)
            .filter(item => itemCounts[item] >= this.minSupport * transactions.length)
            .sort((a, b) => itemCounts[b] - itemCounts[a] || a.localeCompare(b));

        const headerTable: Record<Item, HeaderTableEntry> = {};
        frequentItems.forEach(item => {
            headerTable[item] = { count: itemCounts[item], node: null };
        });

        const root = new FPTreeNode(null, 0, null);

        transactions.forEach(transaction => {
            const filteredTransaction = transaction
                .filter(item => frequentItems.includes(item))
                .sort((a, b) => itemCounts[b] - itemCounts[a] || a.localeCompare(b));

            let currentNode = root;
            filteredTransaction.forEach(item => {
                if (currentNode.children[item]) {
                    currentNode.children[item].count++;
                } else {
                    const newNode = new FPTreeNode(item, 1, currentNode);
                    currentNode.children[item] = newNode;

                    // Update header table
                    if (headerTable[item].node) {
                        let lastNode = headerTable[item].node;
                        while (lastNode.next) {
                            lastNode = lastNode.next;
                        }
                        lastNode.next = newNode;
                    } else {
                        headerTable[item].node = newNode;
                    }
                }
                currentNode = currentNode.children[item];
            });
        });

        return { tree: root, headerTable };
    }

    mineTree(
        headerTable: Record<Item, HeaderTableEntry>,
        prefix: Item[] = [],
        frequentItemsets: Item[][] = []
    ): Item[][] {
        const items = Object.keys(headerTable).sort(
            (a, b) => headerTable[a].count - headerTable[b].count
        );

        items.forEach(item => {
            const newPrefix = [...prefix, item];
            frequentItemsets.push(newPrefix);

            const conditionalPatternBase = this.getConditionalPatternBase(headerTable[item].node);

            const conditionalTree = this.buildConditionalTree(conditionalPatternBase);

            if (Object.keys(conditionalTree.headerTable).length > 0) {
                this.mineTree(conditionalTree.headerTable, newPrefix, frequentItemsets);
            }
        });

        return frequentItemsets;
    }

    getConditionalPatternBase(node: FPTreeNode | null): { path: Item[]; count: number }[] {
        const conditionalPatternBase: { path: Item[]; count: number }[] = [];
        let currentNode = node;

        while (currentNode) {
            const path: Item[] = [];
            let parent = currentNode.parent;

            while (parent && parent.item !== null) {
                path.push(parent.item);
                parent = parent.parent;
            }

            if (path.length > 0) {
                conditionalPatternBase.push({ path: path.reverse(), count: currentNode.count });
            }

            currentNode = currentNode.next;
        }

        return conditionalPatternBase;
    }

    buildConditionalTree(
        conditionalPatternBase: { path: Item[]; count: number }[]
    ): BuildFPTreeResult {
        const transactions: Transaction[] = [];

        conditionalPatternBase.forEach(({ path, count }) => {
            for (let i = 0; i < count; i++) {
                transactions.push(path);
            }
        });

        return this.buildFPTree(transactions);
    }

    findFrequentItemsets(transactions: Transaction[]): Item[][] {
        const { headerTable } = this.buildFPTree(transactions);
        return this.mineTree(headerTable);
    }
}

// // Example usage
// const transactions: Transaction[] = [
//     ['a', 'b', 'c', 'd'],
//     ['a', 'b', 'd'],
//     ['b', 'd', 'e'],
//     ['a', 'b', 'e'],
//     ['a', 'c', 'e'],
//     ['b', 'c', 'e'],
//     ['a', 'c', 'e'],
//     ['a', 'b', 'c', 'e'],
//     ['a', 'b', 'c']
// ];

// const fpgrowth = new FPGrowth(0.3); // Min support 30%
// const frequentItemsets = fpgrowth.findFrequentItemsets(transactions);
// console.log("Frequent Itemsets:", frequentItemsets);

export default FPGrowth;
