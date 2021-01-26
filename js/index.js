const $formTodo = document.getElementById('form-todo');
const $containerTodos = document.getElementById('todos-container');
const $containerInfo = document.getElementById('info-container');

const $input = document.querySelector('.input-header');

const $templateTodo = document.getElementById('template-todo').content;
const $templateInfo = document.getElementById('todo-info-template').content;

const $fragment = document.createDocumentFragment();

let todos = [];
let active = [];
let terminados = [];

//cargan mis datos del localStorage
document.addEventListener('DOMContentLoaded', () => {
	if (localStorage.getItem('todos')) {
		todos = JSON.parse(localStorage.getItem('todos'));
		paintTodosAll();
	}

	if (localStorage.getItem('theme') === null) {
		console.log('todos');
		localStorage.setItem('theme', 'dark');
	}
	if (localStorage.getItem('theme') === 'ligth') {
		console.log('ligth');
		themeLigth();
	}
	if (localStorage.getItem('theme') === 'dark') {
		console.log('sark');
		themeDark();
	}
});

$formTodo.addEventListener('submit', (e) => {
	e.preventDefault();
	let data = $input.value;

	//armo mi todo
	const todo = {
		data: data,
		id: new Date().getTime(),
		terminadado: false,
	};

	//añadimos los todos
	addTodos(todo);

	$input.value = '';
});

function addTodos(todo) {
	todos.push(todo);

	paintTodosAll();
}

function paintTodosAll() {
	$containerTodos.innerHTML = '';

	todos.forEach((todo) => {
		$templateTodo.querySelector('p').textContent = todo.data;
		$templateTodo.querySelector('.input-radio-container').dataset.id = todo.id;
		$templateTodo.querySelector('.croos').dataset.id = todo.id;

		const $clone = document.importNode($templateTodo, true);
		$fragment.prepend($clone);
	});
	$containerTodos.prepend($fragment);

	paintFooter();
}

function paintFooter() {
	if (todos.length === 0) {
		$containerInfo.innerHTML = '';

		$templateInfo.querySelector('.left').textContent = 'Add your first task';
		let clone = document.importNode($templateInfo, true);
		$containerInfo.append(clone);
	}

	if (todos.length > 0) {
		let count = 0;

		todos.forEach((todo) => {
			if (!todo.terminadado) {
				count++;
			}
		});

		$containerInfo.innerHTML = '';

		$templateInfo.querySelector('.left').textContent = `${count} items left`;
		let clone = document.importNode($templateInfo, true);
		$containerInfo.append(clone);
	}
	localStorage.setItem('todos', JSON.stringify(todos));
}
//
$containerTodos.addEventListener('click', (e) => {
	//vemos si la tarea se completo o no
	if (e.target.matches('.input-radio-container')) {
		//le quitamos el check
		if (e.target.classList.contains('is-active')) {
			e.target.classList.remove('is-active');

			todos = todos.map((todo) => {
				if (todo.id == e.target.dataset.id) {
					return {
						...todo,
						terminadado: false,
					};
				} else {
					return todo;
				}
			});
			paintFooter();
			//le añadimos el check
		} else {
			e.target.classList.add('is-active');

			todos = todos.map((todo) => {
				if (todo.id == e.target.dataset.id) {
					return {
						...todo,
						terminadado: true,
					};
				} else {
					return todo;
				}
			});
			paintFooter();
		}
	}

	//eliminamos un todo
	if (e.target.matches('.croos')) {
		// console.log(e.target);
		todos = todos.filter((todo) => todo.id != e.target.dataset.id);
		paintTodosAll();
	}
});

//optines de los todos
$containerInfo.addEventListener('click', (e) => {
	//borrando a todos las tareas completadas
	if (e.target.matches('.clear-complete')) {
		todos = todos.filter((todo) => todo.terminadado === false);
		paintTodosAll();
	}

	//mostrar todas las tareas
	if (e.target.matches('.All')) {
		paintTodosAll();
	}

	//mostrar las tareas por hacer
	if (e.target.matches('.active')) {
		active = todos.filter((todo) => {
			if (!todo.terminadado) {
				return todo;
			}
		});
		paintTodosActive();
	}

	//tareas completdas
	if (e.target.matches('.completed')) {
		terminados = todos.filter((todo) => {
			if (todo.terminadado) {
				return todo;
			}
		});
		paintTodosTerminados();
	}
});

//pintar las tareas que no fueron completadas
function paintTodosActive() {
	$containerTodos.innerHTML = '';

	active.forEach((todo) => {
		$templateTodo.querySelector('p').textContent = todo.data;
		$templateTodo.querySelector('.input-radio-container').dataset.id = todo.id;
		$templateTodo.querySelector('.croos').dataset.id = todo.id;

		const $clone = document.importNode($templateTodo, true);
		$fragment.prepend($clone);
	});
	$containerTodos.prepend($fragment);

	paintFooter();
}

//pintar las tareas que si fueron completadas
function paintTodosTerminados() {
	$containerTodos.innerHTML = '';

	terminados.forEach((todo) => {
		$templateTodo.querySelector('p').textContent = todo.data;
		$templateTodo.querySelector('.input-radio-container').dataset.id = todo.id;
		$templateTodo.querySelector('.croos').dataset.id = todo.id;

		const $clone = document.importNode($templateTodo, true);
		$fragment.prepend($clone);
	});
	$containerTodos.prepend($fragment);

	paintFooter();
}

// drag and drop

Sortable.create($containerTodos, {
	animation: 150,
	chosenClass: 'seleccionado',
	dragClass: 'drag',
});

//dark mode

const $btnColor = document.getElementById('sun');
const $headerImg = document.querySelector('.header-img');

let sun = 'images/icon-sun.svg';
let moon = 'images/icon-moon.svg';

function themeLigth() {
	$headerImg.classList.add('img-light');
	$btnColor.setAttribute('src', moon);
	document.body.classList.add('light');
	$containerTodos.querySelectorAll('.todo').forEach((todo) => {
		todo.classList.add('todo-light');
	});

	$input.classList.add('todo-light');
	$containerInfo.querySelector('.todo-info').classList.add('todo-light');
	$containerInfo.querySelector('.todo-options').classList.add('todo-light');
	localStorage.setItem('theme', 'ligth');
}

function themeDark() {
	$headerImg.classList.remove('img-light');
	$btnColor.setAttribute('src', sun);
	document.body.classList.remove('light');
	$containerTodos.querySelectorAll('.todo').forEach((todo) => {
		todo.classList.remove('todo-light');
	});

	$input.classList.remove('todo-light');
	$containerInfo.querySelector('.todo-info').classList.remove('todo-light');
	$containerInfo.querySelector('.todo-options').classList.remove('todo-light');
	localStorage.setItem('theme', 'dark');
}

document.addEventListener('click', (e) => {
	if (e.target.matches('#sun')) {
		if ($btnColor.getAttribute('src') === sun) {
			themeLigth();
		} else {
			themeDark();
		}
	}
});
