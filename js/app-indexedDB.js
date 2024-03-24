let dataBaseIncome;
let dataBaseExpenses;

// TODO bien por el uso de ingles
// TODO fijate Fede que al momento de guardar los registros en el indexDb,
// no estas obteniendolos para mostrarlo apenas se agregue o eliminen. Solo se ven si actualizas la pagina.

// Selectores
const incomeForm = document.querySelector('#add-income');
const expensesForm = document.querySelector('#add-expenses');
const incomeList = document.querySelector('#income-partial');
const expensesList = document.querySelector('#expenses-partial');

// Eventos
document.addEventListener('DOMContentLoaded', createDBIncome);
document.addEventListener('DOMContentLoaded', createDBExpenses);
incomeForm.addEventListener('submit', addIncome);
expensesForm.addEventListener('submit', addExpenses);

// Tomamos la cantidad de ingresos
let income = 0;

function calculateIncome(num) {
	const elementIncome = document.querySelector('#income-total');
	const incomeTotal = (income += num);
	elementIncome.innerHTML = incomeTotal;
	return;
}

function getTotalNode() {
	return document.querySelector('#income-total');
}

function getTotalIncome() {
	let sum = 0;
	const values = Array.from(document.querySelectorAll('.income-value'));
	const getValues = values.map((node) =>
		Number(node.innerHTML.replace('$ ', ''))
	);

	getValues.forEach((element) => (sum += element));
	return sum;
}

function renderTotalIncome() {
	const node = getTotalNode();
	return (node.innerHTML = getTotalIncome());
}

// Tomamos la cantidad de egresos
let expenses = 0;

function calculateExpenses(num) {
	const elementExpenses = document.querySelector('#expenses-total');
	const expensesTotal = (expenses += num);
	elementExpenses.innerHTML = expensesTotal;
	return;
}

function getTotalNodeExpenses() {
	return document.querySelector('#expenses-total');
}

function getTotalExpenses() {
	let sumExpenses = 0;
	const valuesExpenses = Array.from(
		document.querySelectorAll('.expenses-value')
	);
	const getValuesExpenses = valuesExpenses.map((nodeExpenses) =>
		Number(nodeExpenses.innerHTML.replace('$ ', ''))
	);

	getValuesExpenses.forEach((element) => (sumExpenses += element));
	return sumExpenses;
}

function renderTotalExpenses() {
	const nodeExpenses = getTotalNodeExpenses();
	return (nodeExpenses.innerHTML = getTotalExpenses());
}

function addIncome(e) {
	e.preventDefault();

	// Leer datos del form ingresos
	const income = document.querySelector('#income').value;
	const incomeAmount = Number(document.querySelector('#income-amount').value);

	// const income = calculateIncome(incomeAmount);
	const incomeDate = document.querySelector('#income-date').value;

	//TODO aca podrias obtener el locale del usuario y no tener hardcode es-AR. Podes buscar en google "get locale from browser"

	// Formatear fecha
	const incomeDay = new Date(incomeDate);
	const incomeDayFormat = incomeDay.toLocaleDateString('es-AR', {
		timeZone: 'UTC'
	});
	// TODO Aca para mejorar la legibilidad del codigo podes evitar los else if.
	// En vez de poner un return solo, podes hacer return printAlert.
	// Despues podes seguir con el otro if sin usar else if.
	// Esto es porque si no entra en el primer if, el codigo sigue
	// Validamos
	if (income === '' || incomeAmount === '' || incomeDate === '') {
		printAlert('Todos los campos son obligatorios', 'error', 'income');
		return;
	} else if (incomeAmount <= 0 || isNaN(incomeAmount)) {
		printAlert('Cantidad no válida', 'error', 'income');
		return;
	}

	// Insertar en IndexedDB
	const transaction = dataBaseIncome.transaction(['income'], 'readwrite');

	// Habilitar el objectStore
	const objectStore = transaction.objectStore('income');

	// Crear objeto para insertar en la DB
	const incomeAdd = {
		income,
		incomeAmount,
		incomeDayFormat
	};

	// Insertar en la DB
	objectStore.add(incomeAdd);

	transaction.oncomplete = () => {
		console.log('Aggregate income');
		printAlert('Se agregó correctamente', 'success', 'income');
	};

	// Reiniciar el form
	incomeForm.reset();
}

function addExpenses(e) {
	e.preventDefault();

	// Leer datos del form egresos
	const expenses = document.querySelector('#expenses').value;
	const expensesAmount = Number(
		document.querySelector('#expenses-amount').value
	);

	const expensesDate = document.querySelector('#expenses-date').value;

	// Formatear fecha
	const expensesDay = new Date(expensesDate);
	const expensesDayFormat = expensesDay.toLocaleDateString('es-AR', {
		timeZone: 'UTC'
	});

	// Validamos
	if (expenses === '' || expensesAmount === '' || expensesDate === '') {
		printAlert('Todos los campos son obligatorios', 'error', 'expenses');
		return;
	} else if (expensesAmount <= 0 || isNaN(expensesAmount)) {
		printAlert('Cantidad no válida', 'error', 'expenses');
		return;
	}

	// Insertar en IndexedDB
	const transaction = dataBaseExpenses.transaction(['expenses'], 'readwrite');

	// Habilitar el objectStore
	const objectStore = transaction.objectStore('expenses');

	// Crear objeto para insertar en la DB
	const expensesAdd = {
		expenses,
		expensesAmount,
		expensesDayFormat
	};

	// Insertar en la DB
	objectStore.add(expensesAdd);

	transaction.oncomplete = () => {
		console.log('Aggregate income');
		printAlert('Se agregó correctamente', 'success', 'expenses');
	};

	// Reiniciar el form
	expensesForm.reset();
}

function getRemaining() {
	const remaining = document.querySelector('#remaining');
	const getRemaining = renderTotalIncome() - renderTotalExpenses();

	// Chequear Restante disponible y modificar color de fondo
	const remainingDiv = document.querySelector('.remaining');

	if (getRemaining < renderTotalIncome() * 0.25) {
		remainingDiv.classList.remove('alert-success', 'alert-warning');
		remainingDiv.classList.add('alert-danger');
	} else if (getRemaining < renderTotalIncome() * 0.5) {
		remainingDiv.classList.remove('alert-success', 'alert-danger');
		remainingDiv.classList.add('alert-warning');
	} else {
		remainingDiv.classList.remove('alert-danger', 'alert-warning');
		remainingDiv.classList.add('alert-success');
	}

	remaining.innerHTML = getRemaining;
	return;
}

function createDBIncome() {
	// Crear la base de datos indexedDB versión 1.0
	const createDBIncome = window.indexedDB.open('income', 1);

	// Si hay un error
	createDBIncome.onerror = () => {
		console.log('Hubo un error al crear la DB');
	};

	// Si se crea corectamente
	createDBIncome.onsuccess = () => {
		console.log('La DB se creó correctamente');
		dataBaseIncome = createDBIncome.result;
		// Leer el contenido de la DB
		readDBIncome();
	};

	// Definir el schema
	createDBIncome.onupgradeneeded = function (e) {
		const db = e.target.result;

		const objectStore = db.createObjectStore('income', {
			keyPath: 'id',
			autoIncrement: true
		});

		// Definir columnas
		objectStore.createIndex('income', 'income', { unique: false });
		objectStore.createIndex('amount', 'amount', { unique: false });
		objectStore.createIndex('date', 'date', { unique: false });
		objectStore.createIndex('id', 'id', { unique: true });

		console.log('DB creada y lista');
	};
}

function createDBExpenses() {
	// Crear la base de datos indexedDB versión 1.0
	const createDBExpenses = window.indexedDB.open('expenses', 1);

	// Si hay un error
	createDBExpenses.onerror = () => {
		console.log('Hubo un error al crear la DB');
	};

	// Si se crea corectamente
	createDBExpenses.onsuccess = () => {
		console.log('La DB se creó correctamente');
		dataBaseExpenses = createDBExpenses.result;
		// Leer el contenido de la DB
		readDBExpenses();
	};

	// Definir el schema
	createDBExpenses.onupgradeneeded = function (e) {
		const db = e.target.result;

		const objectStore = db.createObjectStore('expenses', {
			keyPath: 'id',
			autoIncrement: true
		});

		// Definir columnas
		objectStore.createIndex('expenses', 'expenses', { unique: false });
		objectStore.createIndex('amount', 'amount', { unique: false });
		objectStore.createIndex('date', 'date', { unique: false });
		objectStore.createIndex('id', 'id', { unique: true });

		console.log('DB creada y lista');
	};
}

function readDBIncome() {
	// Leer el contenido de la DB
	const objectStore = dataBaseIncome
		.transaction('income')
		.objectStore('income');
	objectStore.openCursor().onsuccess = (e) => {
		console.log(e.target.result);
		const cursor = e.target.result;

		// Imprimir el contenido de la DB
		printDBIncome(cursor);
	};
}

function readDBExpenses() {
	// Leer el contenido de la DB
	const objectStore = dataBaseExpenses
		.transaction('expenses')
		.objectStore('expenses');
	objectStore.openCursor().onsuccess = (e) => {
		console.log(e.target.result);
		const cursor = e.target.result;

		// Imprimir el contenido de la DB
		printDBExpenses(cursor);
	};
}

function printDBIncome(cursor) {
	if (cursor) {
		const { income, incomeAmount, incomeDayFormat, id } = cursor.value;

		// Formatear moneda
		// const currencyFormat = incomeAmount;
		// const incomeCurrencyFormat = currencyFormat.toLocaleString('es-ar', {
		// 	style: 'currency',
		// 	currency: 'ARS',
		// 	minimumFractionDigits: 2
		// });

		const newIncome = document.createElement('li');
		newIncome.className =
			'list-group-item d-flex justify-content-between align-items-center';
		// Generar el HTML del ingreso
		newIncome.innerHTML = `
    		<div class="col-lg-3">${incomeDayFormat}</div>
    		<div class="col-lg-5">${income}</div>
    		<div class="col-lg-3"><span class="income-value">${incomeAmount}</span></div>
    		`;

		// Botón para eliminar un ingreso
		const btnDelete = document.createElement('button');
		btnDelete.classList.add('btn', 'btn-danger', 'mr-2');
		btnDelete.innerHTML = '<div><i class="fa fa-trash"></i></div>';
		btnDelete.onclick = () => deleteIncome(id);

		// Agregar al HTML
		newIncome.appendChild(btnDelete);
		incomeList.appendChild(newIncome);

		// Ir al siguiente ingreso
		cursor.continue();
	}

	// Imprimimos el total de ingresos
	renderTotalIncome();

	// Calculamos el restante
	getRemaining();
}

function printDBExpenses(cursor) {
	if (cursor) {
		const { expenses, expensesAmount, expensesDayFormat } = cursor.value;
		const newExpenses = document.createElement('li');
		newExpenses.className =
			'list-group-item d-flex justify-content-between align-items-center';

		// Generar el HTML del egreso
		newExpenses.innerHTML = `
        <div class="col-lg-4">${expensesDayFormat}</div>
        <div class="col-lg-4">${expenses}</div>
        <div class="col-lg-4"><span class="expenses-value">$ ${expensesAmount}</span></div>        
        `;

		// Agregar al HTML
		expensesList.appendChild(newExpenses);
		// Ir al siguiente ingreso
		cursor.continue();
	}

	// Imprimimos el total de ingresos
	renderTotalExpenses();

	// Calculamos el restante
	getRemaining();
}

function printAlert(message, type, block) {
	// Crear el div
	const divMessage = document.createElement('div');
	divMessage.classList.add('text-center', 'alert');

	if (type === 'error') {
		divMessage.classList.add('alert-danger');
	} else {
		divMessage.classList.add('alert-success');
	}

	// Mensaje de error
	divMessage.textContent = message;

	if (block === 'income') {
		// Insertar mensaje de error en el HTML
		document
			.querySelector('.printAlertIncome')
			.insertBefore(divMessage, incomeForm);
	} else {
		// Insertar mensaje de error en el HTML
		document
			.querySelector('.printAlertExpenses')
			.insertBefore(divMessage, expensesForm);
	}

	// Quitar mensaje
	setTimeout(() => {
		divMessage.remove();
	}, 3000);
}

function deleteIncome(id) {
	// Eliminar el ingreso
	const transaction = dataBaseIncome.transaction(['income'], 'readwrite');
	const objectStore = transaction.objectStore('income');

	objectStore.delete(id);

	transaction.oncomplete = () => {
		console.log(`Ingreso ${id} eliminado`);
	};

	// Mostrar mensaje
	printAlert('Se eliminó correctamente', 'success', 'income');

	// Refrescar ingresos
	printDBIncome();
}
