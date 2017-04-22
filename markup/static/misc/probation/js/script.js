var url = 'info.json';
var the_object = [];
var http_request = new XMLHttpRequest();

http_request.open("GET", url, true);
http_request.onreadystatechange = function () {
    if (http_request.readyState == 4) {
        if (http_request.status == 200) {
            the_object.push(JSON.parse(http_request.responseText));
            init();
        } else {
            alert("There was a problem with the URL. " + url);
        }
        http_request = null;
    }
};
http_request.send(null);

function init() {

    function renderPage(obj) {
        var fio = document.getElementById('fio');
        var name = document.getElementById('name');
        var family = document.getElementById('family');
        var patronymic = document.getElementById('patronymic');
        var genderMan = document.getElementById('gender-man');
        var genderWoman = document.getElementById('gender-woman');
        var dateBirth = document.getElementById('date-birth');
        var dateReceipt = document.getElementById('date-receipt');

        name.value = obj.name;
        family.value = obj.family;
        patronymic.value = obj.patronymic;
        fio.textContent = obj.family + ' ' + obj.name + ' ' + obj.patronymic;

        if (obj.gender === 'male') {
            genderMan.checked = true;
            genderWoman.checked = false;
        } else {
            genderMan.checked = false;
            genderWoman.checked = true;
        }

        dateBirth.value = obj.dateBirth;
        dateReceipt.value = obj.dateReceipt;

        var parentElem = document.getElementsByClassName('list-item')[0];
        parentElem.innerHTML = '';

        /** @namespace obj.listItems */
        /*webStorm подчеркивал везде listItems и поэтому появился коммент сверху :)*/
        for (var i = 0; i < obj.listItems.length; i++) {
            var newLabel = document.createElement('label');
            newLabel.htmlFor = 'item' + i;

            var newInput = document.createElement('input');
            newInput.defaultChecked = 'checked';
            newInput.id = 'item' + i;
            newInput.name = 'item' + i;
            newInput.type = 'checkbox';

            var newSpan = document.createElement('span');
            newSpan.className = 'item-name' + i;
            newSpan.innerHTML = obj.listItems[i].name;

            newLabel.appendChild(newInput);
            newLabel.appendChild(newSpan);
            parentElem.appendChild(newLabel);
        }

        graph(obj);
        chart(obj);

        var delStudent = document.getElementById('delete-student');
        delStudent.onclick = function () {
            deleteStudent(obj.id);
            return false;
        };

        var linkSaveStudent = document.getElementById('save-student');
        linkSaveStudent.onclick = function () {
            saveChange(obj);
            return false;
        };

        var linkAddStudent = document.getElementById('add-student');
        linkAddStudent.onclick = function () {
            addStudent();
            return false;
        };

        var linkAddItem = document.getElementById('add-item');
        linkAddItem.onclick = function () {
            addItem(obj);
            return false;
        };

    }

    function renderMenu(obj) {
        var parentElem = document.getElementsByClassName('list-student')[0];
        parentElem.innerHTML = '';
        for (var i = 0; i < obj.length; i++) {
            var newLi = document.createElement('li');
            if (i == 0) {
                newLi.className = 'student' + i + ' active';
            } else {
                newLi.className = 'student' + i;
            }
            var newA = document.createElement('a');
            newA.className = 'fio' + i;
            newA.href = '#';
            newA.innerHTML = obj[i].family + ' ' + obj[i].name + ' ' + obj[i].patronymic;

            newLi.appendChild(newA);
            parentElem.appendChild(newLi);

            var clickFunction = changeCurrentStudent(i);
            clickFunction(i);
        }
    }

    function activeMenu(numberActive) {
        var masLi = document.getElementsByClassName('list-student')[0].children; //[numberActive].className += ' active';
        for (var i = 0; i < masLi.length; i++) {
            if (numberActive === i) {
                masLi[i].className = 'student' + i + ' active';
            } else {
                masLi[i].className = 'student' + i;
            }
        }
    }

    function changeCurrentStudent(i) {
        var elemA = document.getElementsByClassName('fio' + i)[0];
        return function () {
            elemA.onclick = function () {
                for (var j = 0; j < the_object[0].length; j++) {
                    if (the_object[0][j].id === i) {
                        renderPage(the_object[0][j]);
                        activeMenu(the_object[0][j].id);
                        break;
                    }
                }
                return false;
            }
        }
    }

    function graph(obj) {
        var parentElem = document.getElementById('graph-line');
        parentElem.innerHTML = '';
        var newUl = document.createElement('ul');
        newUl.style.width = '701px';
        newUl.style.marginLeft = '6px';

        var sum = 0;
        for (var j = 0; j < obj.listItems.length; j++) {
            sum += obj.listItems[j]['Всего часов'];
        }

        var color = ['e9e9e9', 'e7e2d1', '4a616e', '243139', 'ffcd52', 'e2453f'];
        for (var i = 0; i < obj.listItems.length; i++) {
            var newLi = document.createElement('li');
            newLi.title = obj.listItems[i].name + ' — ' + obj.listItems[i]['Всего часов'] + ' часов.';
            //Зацикливаем разукрашку цветов на случай если учебных предметов больше чем цветов.
            newLi.style.background = '#' + color.slice(i % color.length, i % color.length + 1);
            newLi.style.width = (obj.listItems[i]['Всего часов'] / sum) * 100 + '%';
            newUl.appendChild(newLi);
        }

        parentElem.appendChild(newUl);
    }

    function chart(obj) {
        var ctx = document.getElementById("chart").getContext("2d");
        var xc = 348, yc = 210;

        //Просто зарисовываем серой светлой полоской
        ctx.fillStyle = "transparent";
        ctx.beginPath();
        ctx.lineWidth = 32;
        ctx.strokeStyle = "#efefef";
        // x и y - координаты центра, r - радиус, a и b - начало и конец сектора
        ctx.arc(xc, yc, 129, -Math.PI / 2, Math.PI * 1.5, true);
        ctx.stroke();
        ctx.fill();

        //Всего пропусков
        ctx.fillStyle = "transparent";
        ctx.beginPath();
        ctx.lineWidth = 32;
        ctx.strokeStyle = "#4a616e"; //темно-серый
        // первая цифра считается от 25 прогулов
        ctx.arc(xc, yc, 129, -Math.PI / 2 + ((Math.PI * 1.5) / 235) * Math.PI * obj.listItems[0]['Пропущено'], -Math.PI / 2, true);
        ctx.stroke();
        ctx.fill();

        //Пропущено по уважительной причине
        ctx.fillStyle = "transparent";
        ctx.beginPath();
        ctx.lineWidth = 32;
        ctx.strokeStyle = "#e2453f"; //красный
        // тут первая цифра считается от 25 прогулов
        ctx.arc(xc, yc, 129, -Math.PI / 2 + ((Math.PI * 1.5) / 235) * Math.PI * obj.listItems[0]['По уважительной причине'], -Math.PI / 2, true);
        ctx.stroke();
        ctx.fill();

        var allClear = document.getElementById('all-clear');
        var goodClear = document.getElementById('good-clear');
        allClear.innerHTML = obj.listItems[0]['Пропущено'];
        goodClear.innerHTML = obj.listItems[0]['По уважительной причине'];

    }

    function deleteStudent(idEl) {
        var deleteMenuItem = document.getElementsByClassName('student' + idEl)[0];
        deleteMenuItem.style.display = 'none';

        for (var j = 0; j < the_object[0].length; j++) {
            if (the_object[0][j].id === idEl) {
                the_object[0].splice(j, 1);
                break;
            }
        }

        for (var i = 0; i < the_object[0].length; i++) {
            renderPage(the_object[0][0]);
            activeMenu(the_object[0][0].id);
        }

    }

    function saveChange(obj) {
        var fio = document.getElementById('fio');
        var name = document.getElementById('name');
        var family = document.getElementById('family');
        var patronymic = document.getElementById('patronymic');
        var genderMan = document.getElementById('gender-man');
        var dateBirth = document.getElementById('date-birth');
        var dateReceipt = document.getElementById('date-receipt');
        var fioMenu = document.getElementsByClassName('fio' + obj.id)[0];

        if (validSave(name)) {
            obj.name = name.value
        }
        if (validSave(family)) {
            obj.family = family.value
        }
        if (validSave(patronymic)) {
            obj.patronymic = patronymic.value
        }

        fio.textContent = obj.family + ' ' + obj.name + ' ' + obj.patronymic;
        fioMenu.innerHTML = fio.textContent;

        if (genderMan.checked === true) {
            obj.gender = 'male';
        } else {
            obj.gender = 'female';
        }

        if (validSave(dateBirth)) {
            obj.dateBirth = dateBirth.value
        }
        if (validSave(dateReceipt)) {
            obj.dateReceipt = dateReceipt.value
        }

        var parentElem = document.getElementsByClassName('list-item')[0];
        for (var i = 0; i < parentElem.children.length; i++) {
            var itemName = document.getElementsByClassName('item-name' + i)[0];
            var itemElement = document.getElementById('item' + i);
            if (!itemElement.checked) {
                itemElement.parentNode.style.display = 'none';
                for (var j = 0; j < obj.listItems.length; j++) {
                    if (obj.listItems[j].name == itemName.textContent) {
                        obj.listItems.splice(j, 1);
                        break;
                    } else {

                    }
                }
            } else {

            }
        }

        graph(obj);
    }

    function validSave(str) {
        if (str.value.replace(/\s/g, "") == "") {
            str.className = 'error';
            var errorMessage = str.nextElementSibling;
            errorMessage.innerHTML = 'Поле обязательно к заполнению';
            function clearError() {
                str.className = '';
                errorMessage.innerHTML = '';
            }

            setTimeout(clearError, 2000);
        } else {
            return true;
        }
    }

    function addItem(obj) {
        var newItemInObj = {};
        var newItem = prompt('Введите название нового предмета', '');
        if (!newItem || newItem.replace(/\s/g, "") == "") {
            alert('Некорректное название!');
        } else {
            var newItemTime = prompt('Введите кол-во часов по предмету: ' + newItem, '');
            if (newItemTime > 0) {
                newItemInObj.name = newItem;
                newItemInObj['Всего часов'] = +newItemTime;
                obj.listItems.push(newItemInObj);
            } else {
                alert('Неправильное кол-во часов!');
            }
        }
        // Тут еще можно было бы поспрашивать по кол-ву пропущенных часов всего и по уважительной причине, но это сейчас не важно.
        renderPage(obj);
    }

    function addStudent() {
        var newStudent = {};
        newStudent.id = the_object[0][the_object[0].length - 1].id + 1;
        newStudent.name = 'Имя';
        newStudent.family = 'Фамилия';
        newStudent.patronymic = 'Отчество';
        newStudent.gender = 'male';
        newStudent.dateBirth = '1999-09-09';
        newStudent.dateReceipt = '2004-04-04';
        newStudent.listItems = [{
            "name": "Булева алгебра",
            "Всего часов": 90,
            "Пропущено": 45,
            "По уважительной причине": 17
        }];
        the_object[0].push(newStudent);
        renderPage(newStudent);
        renderMenu(the_object[0]);
    }

    renderPage(the_object[0][0]);
    renderMenu(the_object[0]);

}