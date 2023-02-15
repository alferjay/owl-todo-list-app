const {Component, mount, xml, useState} = owl

class Task extends Component {
  static template = xml`
  <li t-attf-style="background-color:#{state.color}" class="d-flex align-items-center justify-content-between border-bottom p-3 border rounded mb-2">
    <div t-if="state.isEditing" class="d-flex align-items-center flex-grow-1 me-2">
      <input t-ref="text1" t-model="state.name" class="form-control me-2"/>
      <input style="width:60px" type="color" class="form-control-lg border-0 bg-white m-0 form-control-color" id="color" t-att-value="state.color" t-model="state.color" title="Choose your color"/>
    </div>
    <div t-if="!state.isEditing" class="form-check form-switch fs-5 name-dark">
      <input class="form-check-input" type="checkbox" value="" role="switch" t-att-id="state.id" 
      t-att-checked="state.isCompleted" t-on-click="toggleTask"/>
      <label t-att-for="state.id" 
        t-attf-class="#{state.isCompleted ? 'text-decoration-line-through':''}">
        <t t-esc="state.name"/>
      </label>
    </div>
    <div>
      <button t-if="!state.isEditing" class="btn btn-primary me-2" t-on-click="editTask">
        <i class="bi bi-pencil"></i>
      </button>
      <button t-if="state.isEditing" class="btn btn-primary me-2" t-on-click="saveTask">
        <i class="bi bi-check-lg"></i>
      </button>
      <button class="btn btn-danger" t-on-click="deleteTask"><i class="bi bi-trash"></i></button>
    </div>
  </li>
  `

  // use to get the states from parent component
  static props = ["task", "onDelete", "onEdit"];

  // initialize our state based on parent states
  setup(){
    this.state = useState({
      isEditing:false,
      name: this.props.task.name,
      id: this.props.task.id,
      isCompleted: this.props.task.isCompleted,
      color: this.props.task.color,
    })
  }

  // toggle task
  toggleTask() {
    this.state.isCompleted = !this.state.isCompleted;
  }

  deleteTask() {
    this.props.onDelete(this.props.task);
  }

  // save the edited task
  saveTask() {
    this.state.isEditing = false
    this.props.onEdit(this.state);
  }

  // use to show and hide form input
  editTask() {
    this.state.isEditing = true
  }
}

class Root extends Component {
  static template = xml`
  <div class="m-0 p-4 bg-white rounded">
    <div class="input-group-lg bg-white rounded border d-flex w-100 align-items-center">
      <input type="name" class="form-control-lg fs-5 flex-fill border-0" placeholder="Add your new task" aria-label="Add your new task" id="name" name="name" aria-describedby="button-addon2" t-att-value="state.name" t-model="state.name"/>
      <input type="color" class="form-control-lg border-0 bg-white m-0 form-control-color" id="color" title="Choose your color" t-att-value="state.color" t-model="state.color"/>
      <button class="btn btn-primary" type="button" id="button-addon2" t-on-click="addTask"><i class="bi bi-plus-lg fs-3"></i></button>
    </div>
    
    <ul class="tasks d-flex flex-column p-0 mt-5">
      <t t-foreach="tasks" t-as="task" t-key="task.id">
        <Task task="task" onDelete.bind="deleteTask" onEdit.bind="editTask"/>
      </t>
    </ul>
  </div>
  `

  // use to add sub component
  static components = { Task };

  setup(){
    this.state = useState({
      name: "",
      color: "#FFF700",
      isCompleted: false,
      isEditing: false
    });

    this.tasks = useState([])
  }

  // function to add task
  addTask(){
    // do not allow empty task name
    if (!this.state.name){
      alert("Please add task.")
      return
    }

    // add unique id
    const id = Math.random().toString().substring(2,12)

    // add new task
    this.tasks.push({
      id,
      name: this.state.name,
      color: this.state.color,
      isCompleted: this.state.isCompleted,
    })

    // reset states after saving
    let state = this.state
    this.state = {...state, name:"", color: "#FFF700"}
  }

  // delete task
  deleteTask(task){
    const index = this.tasks.findIndex((t) => t.id === task.id);
    this.tasks.splice(index, 1);
  }

  // edit task
  editTask(ta){
    const index = this.tasks.findIndex((t) => t.id === ta.id);
    this.tasks.splice(index, 1, ta)
  }
}

mount(Root, document.getElementById("root"))