import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {

  state = {
    tasks: [],
    taskName: '',
  };

  componentDidMount() {
    this.socket = io('localhost:8000', { transports: ['websocket'] });
    this.socket.on('removeTask', delTask => {
      this.removeTask(delTask);
    });
    this.socket.on('addTask', task => {
      this.addTask(task);
    });
    this.socket.on('updateData', updateData => {
      this.updateTask(updateData);
    });
  };

  removeTask = (delTask) => {
    this.setState({
      tasks: this.state.tasks.filter(task => task.id !== delTask)
    });
    this.socket.emit('removeTask', delTask)
  };

  submitForm = (event) => {
    event.preventDefault();
    const taskName = { name: this.state.taskName, id: uuidv4() };
    this.addTask(taskName);
    this.socket.emit('addTask', taskName);
  };

  addTask = (task) => {
    this.setState({ tasks: [...this.state.tasks, task] })
  };

  updateTask = (updateData) => {
    this.setState({ tasks: updateData })
  };

  render() {
    const { taskName } = this.state;
    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map(task => (
              <li key={task.id}>
                {task.name}
                <button className="btn btn--red" onClick={() => this.removeTask(task.id)}>Remove</button>
              </li>
            ))}
          </ul>

          <form id="add-task-form">
            <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name"
              value={taskName} onChange={(event) => this.setState({ taskName: event.target.value })} />
            <button className="btn" type="submit" onClick={e => this.submitForm(e)}>Add</button>
          </form>

        </section>
      </div>
    );
  };
};

export default App;