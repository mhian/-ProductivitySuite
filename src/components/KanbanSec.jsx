import { useState } from 'react';
import { ListBox, ListBoxToolbar, processListBoxData, processListBoxDragAndDrop } from '@progress/kendo-react-listbox';
import { TextBox } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';

import './styles/kanban-sec.css';

const toDo = [{
  name: 'Task 1',
  selected: false
}, {
  name: 'Task 2',
  selected: false
}];
const inDevelopment = [{
  name: 'Task 3',
  selected: false
}, {
  name: 'Task 4',
  selected: false
}];
const shipped = [{
  name: 'Task 5',
  selected: false
}, {
  name: 'Task 6',
  selected: false
}];
const SELECTED_FIELD = 'selected';
const toolbarTools = ['moveUp', 'moveDown', 'transferTo', 'transferFrom', 'transferAllTo', 'transferAllFrom', 'remove'];
const KanbanSec = () => {
  const [state, setState] = useState({
    toDo,
    inDevelopment,
    shipped,
    draggedItem: {}
  });
  const handleItemClick = (event, data, connectedData, secondConnectedData) => {
    setState({
      ...state,
      [data]: state[data].map(item => {
        if (item.name === event.dataItem.name) {
          item[SELECTED_FIELD] = !item[SELECTED_FIELD];
        } else if (!event.nativeEvent.ctrlKey) {
          item[SELECTED_FIELD] = false;
        }
        return item;
      }),
      [connectedData]: state[connectedData].map(item => {
        item[SELECTED_FIELD] = false;
        return item;
      }),
      [secondConnectedData]: state[secondConnectedData].map(item => {
        item[SELECTED_FIELD] = false;
        return item;
      })
    });
  };
  const handleToolBarClick = (e, data, connectedData) => {
    let result = processListBoxData(state[data], state[connectedData], e.toolName, SELECTED_FIELD);
    setState({
      ...state,
      [data]: result.listBoxOneData,
      [connectedData]: result.listBoxTwoData
    });
  };
  const handleDragStart = e => {
    let target = e.target;
    e.dataItem.dataCollection = target.props.name || '';
    setState({
      ...state,
      draggedItem: e.dataItem
    });
  };
  const handleDrop = e => {
    let target = e.target;
    let dragItemData = state.draggedItem.dataCollection;
    let dropItemData = target.props.name;
    let result = processListBoxDragAndDrop(state[dragItemData], state[dropItemData], state.draggedItem, e.dataItem, 'name');
    setState({
      ...state,
      [dragItemData]: result.listBoxOneData,
      [dropItemData]: result.listBoxTwoData
    });
  };

  //New task
  const [newTaskName, setNewTaskName] = useState('');
  const handleNewTask = (e) => {
    setNewTaskName(e.target.value);
  }
  const handleClickCreateTask = () => {
    let newTask = {
        name: newTaskName,
        selected: false,
    }
    state.toDo.push(newTask)
    let newState = {...state}
    setNewTaskName('');
    //setState(newState);
  }

  return <div className='container'>
        <div className='row justify-content-between'>
          <div className='col'>
            <h6>To Do </h6>
            <ListBox style={{
          height: 350,
          width: '100%',
        }} data={state.toDo} textField="name" selectedField={SELECTED_FIELD} onItemClick={e => handleItemClick(e, 'toDo', 'inDevelopment', 'shipped')} onDragStart={handleDragStart} onDrop={handleDrop}
        // @ts-ignore: for specific use
        name='toDo' toolbar={() => {
          return <ListBoxToolbar tools={toolbarTools} data={state.toDo} dataConnected={state.inDevelopment} onToolClick={e => handleToolBarClick(e, 'toDo', 'inDevelopment')} />;
        }} />
          </div>
          <div className='col'>
            <h6>Doing</h6>
            <ListBox style={{
          height: 350,
          width: '100%'
        }} data={state.inDevelopment} textField="name" selectedField={SELECTED_FIELD} onItemClick={e => handleItemClick(e, 'inDevelopment', 'toDo', 'shipped')} onDragStart={handleDragStart} onDrop={handleDrop}
        // @ts-ignore: for specific use
        name='inDevelopment' toolbar={() => {
          return <ListBoxToolbar tools={toolbarTools} data={state.inDevelopment} dataConnected={state.shipped} onToolClick={e => handleToolBarClick(e, 'inDevelopment', 'shipped')} />;
        }} />
          </div>
          <div className='col'>
            <h6>Done</h6>
            <ListBox style={{
          height: 350,
          width: '100%'
        }} data={state.shipped} textField="name" selectedField={SELECTED_FIELD} onItemClick={e => handleItemClick(e, 'shipped', 'inDevelopment', 'toDo')} onDragStart={handleDragStart} onDrop={handleDrop}
        // @ts-ignore: for specific use
        name='shipped' />
          </div>
        </div>
        <TextBox style={{
            width: 300,
            margin: 15,
            backgroundColor: '#fefefe',
            color: '#3d3d3d',
        }}fillMode={'flat'} placeholder='New Task' value={newTaskName} onChange={handleNewTask}/>
        <Button onClick={handleClickCreateTask}>
            Create New Task
        </Button>
      </div>;
};
export default KanbanSec;