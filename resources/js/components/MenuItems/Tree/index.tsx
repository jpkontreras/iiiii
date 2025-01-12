import {
  StaticTreeDataProvider,
  Tree,
  UncontrolledTreeEnvironment,
} from 'react-complex-tree';

// const transformToTreeFormat = (data: OriginalNode[]): TreeItems => {
//   const items: TreeItems = {
//     root: {
//       index: 'root',
//       isFolder: true,
//       children: [],
//       data: 'Menu Items',
//     },
//   };

//   const processNode = (node: OriginalNode) => {
//     const nodeId = `node-${node.id}`;

//     items[nodeId] = {
//       index: nodeId,
//       isFolder: node.type === 'category',
//       children: [],
//       data: {
//         name: node.name,
//         type: node.type,
//         description: node.description,
//         price: node.price,
//         variations: node.variations,
//         modifier_groups: node.modifier_groups,
//         slug: node.slug,
//       },
//     };

//     // If this is a top-level node, add it to root's children
//     if (node.depth === 0) {
//       items.root.children.push(nodeId);
//     }

//     // Process children if they exist
//     if (node.children && node.children.length > 0) {
//       node.children.forEach((child) => {
//         const childId = `node-${child.id}`;
//         items[nodeId].children.push(childId);
//         processNode(child);
//       });
//     }
//   };

//   // Process each top-level node
//   data.forEach(processNode);

//   return items;
// };

function MenuTree({ items }: { items: MenuItem[] }) {
  const ix = {
    root: {
      index: 'root',
      isFolder: true,
      children: ['child1', 'child2'],
      data: 'Root item',
    },
    child1: {
      index: 'child1',
      children: [],
      data: 'Child item 1',
    },
    child2: {
      index: 'child2',
      isFolder: true,
      children: ['child3'],
      data: 'Child item 2',
    },
    child3: {
      index: 'child3',
      children: [],
      data: 'Child item 3',
    },
  };

  // const injectItem = () => {
  //   const rand = `${Math.random()}`;
  //   items[rand] = { data: 'New Item', index: rand };
  //   items.root.children.push(rand);
  //   dataProvider.onDidChangeTreeDataEmitter.emit(['root']);
  // };

  // const removeItem = () => {
  //   if (items.root.children.length === 0) return;
  //   items.root.children.pop();
  //   dataProvider.onDidChangeTreeDataEmitter.emit(['root']);
  // };

  return (
    <UncontrolledTreeEnvironment
      dataProvider={
        new StaticTreeDataProvider(ix, (item, data) => ({ ...item, data }))
      }
      renderItemArrow={() => null}
      getItemTitle={(item) => item.data}
      viewState={{
        'tree-1': {},
      }}
    >
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </UncontrolledTreeEnvironment>
  );
}

export default MenuTree;
