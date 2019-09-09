import React from 'react';

import { Tree, Icon } from 'antd';

import useConnect from '../../store/useConnect';
import { LIB, DECISION_SET } from '../../constants/fileType';

const { TreeNode, DirectoryTree } = Tree;

const FolderIcon = ({ expanded }) => {
  return <Icon style={{ color: '#ffca28' }} theme="filled" type={expanded ? 'folder-open' : 'folder'} />;
};

const XMLFileIcon = () => {
  return <Icon type="file" theme="filled" style={{ color: '#fc7b24' }} />;
};

const ExplorerView = props => {
  const handlerRightClick = e => {
    console.log('e=>', e);
  };

  function handleSelect(value, e) {
    const { ref_id, title, editorType, isLeaf } = e.node.props;

    if (isLeaf) {
      dispatch({
        type: 'tabs/push',
        payload: {
          id: ref_id,
          title,
          editorType
        }
      });
    }
  }

  const { projects, activeKey, dispatch } = useConnect(state => ({
    projects: state.explorer.projects,
    activeKey: state.tabs.activeKey
  }));

  return (
    <DirectoryTree
      showIcon
      defaultExpandAll
      selectedKeys={[activeKey]}
      onSelect={handleSelect}
      onRightClick={handlerRightClick}
    >
      {projects.map(project => {
        return (
          <TreeNode title={project.name} key={project.id} icon={FolderIcon}>
            <TreeNode title="知识包" key={`${project.name}_knowledgeLibs`} icon={FolderIcon} />
            <TreeNode title="资源" key={`${project.name}_resources`} icon={FolderIcon}>
              <TreeNode title="库" key={`${project.name}_libs`} icon={FolderIcon}>
                {project.resources.libs.map(lib => (
                  <TreeNode
                    title={lib.name}
                    key={lib.id}
                    ref_id={lib.id}
                    editorType={LIB}
                    icon={XMLFileIcon}
                    isLeaf
                  ></TreeNode>
                ))}
              </TreeNode>
              <TreeNode title="决策集" key="pj_1_jcj" icon={FolderIcon}>
                {project.resources.decisionSet.map(file => (
                  <TreeNode
                    title={file.name}
                    key={file.id}
                    ref_id={file.id}
                    icon={XMLFileIcon}
                    editorType={DECISION_SET}
                    isLeaf
                  />
                ))}
              </TreeNode>
            </TreeNode>
          </TreeNode>
        );
      })}
    </DirectoryTree>
  );
};

export default ExplorerView;
