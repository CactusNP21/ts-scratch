var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const ip = '192.168.0.106';
const filed = document.querySelector('.field');
function createTask(task) {
    const length = document.querySelector('.create').childElementCount;
    document.querySelector('.create').insertAdjacentHTML("beforeend", `
            <div class="task">
                <div class="part id">${length}</div>
                <div class="part body">${task.title}</div>
                <button id="${task._id}">DELETE TASK</button>
            </div>`);
    document.getElementById(`${task._id}`).addEventListener('click', (ev) => __awaiter(this, void 0, void 0, function* () {
        console.log('hail');
        const token = sessionStorage.getItem('token');
        const element = ev.target;
        if (element.id) {
            const request = yield fetch(`http://${ip}:8080/user/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                    'id': element.id
                }
            });
            const response = yield request.json();
            console.log(response);
            element.parentElement.remove();
        }
    }));
}
export function getTasks() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = sessionStorage.getItem('token');
        const request = yield fetch(`http://${ip}:8080/user/tasks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });
        const { tasks } = yield request.json();
        for (const responseElement of tasks) {
            createTask(responseElement);
        }
    });
}
export function addTask() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = sessionStorage.getItem('token');
        const title = document.getElementById('task-title').value;
        const request = yield fetch(`http://${ip}:8080/user/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({ title: title })
        });
        const response = yield request.json();
        createTask(response);
    });
}
export function loginOrRegister() {
    return __awaiter(this, void 0, void 0, function* () {
        const registerUsername = document.getElementById('register-name').value;
        const registerPassword = document.getElementById('register-password').value;
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        const request = (name, password, method) => __awaiter(this, void 0, void 0, function* () {
            return yield fetch(`http://${ip}:8080/user/${method}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({ username: name, password: password })
            });
        });
        let response;
        if (name && password) {
            response = yield request(name, password, 'login');
        }
        else {
            response = yield request(registerUsername, registerPassword, 'register');
            response = yield request(registerUsername, registerPassword, 'login');
        }
        const token = yield response.json();
        if (token.token) {
            sessionStorage.setItem('token', token.token);
            filed.classList.add('hide');
            console.log(token.token);
            const user = yield fetch(`http://${ip}:8080/user/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token.token
                }
            });
            const userData = yield user.json();
            const { username } = userData.data;
            document.querySelector('body').insertAdjacentHTML('afterbegin', `     <p>${username}</p>
                      <input placeholder="TITLE TASK" id="task-title">
                      <button id="add-task">ADD TASK</button>`);
            yield getTasks();
            //BUTTONS
            const addTaskBtn = document.getElementById('add-task');
            //
            addTaskBtn.addEventListener('click', addTask);
            //getTaskBtn!.addEventListener("click", getTasks)
        }
    });
}
