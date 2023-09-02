document.getElementById('addDialogueBtn').addEventListener('click', function () {
    const dialogue = createDialogue();
    document.getElementById('dialoguesContainer').appendChild(dialogue);
});

document.getElementById('generateJsonBtn').addEventListener('click', function () {
    const jsonData = generateJson();
    console.log(jsonData);
});

function createDialogue() {
    const dialogueDiv = document.createElement('div');
    dialogueDiv.innerHTML = `
            
            <div class="dialogueContent">
            <label for="id">Id:</label>
            <input type="text" class="dialogueId">
            <label for="initialPhrase">initialPhrase:</label>
            <textarea class="initialPhrase"></textarea>
            <div class="playerResponsesContainer">
                <!-- Ответы игрока будут добавляться сюда динамически -->
            </div>
            <button class="addResponseBtn">Добавить ответ игрока</button>
        </div>
    `;

    dialogueDiv.querySelector('.addResponseBtn').addEventListener('click', function () {
        const response = createPlayerResponse();
        dialogueDiv.querySelector('.playerResponsesContainer').appendChild(response);
    });
    const toggleButton = document.createElement('button');
    toggleButton.innerText = '⮟'; // символ для сворачивания
    toggleButton.classList.add('toggleButton');
    toggleButton.addEventListener('click', function () {
        toggleContent(this, dialogueDiv.querySelector('.dialogueContent'));
    });
    dialogueDiv.appendChild(toggleButton);
    return dialogueDiv;
}

function createPlayerResponse() {
    const responseDiv = document.createElement('div');
    responseDiv.innerHTML = `
            <div class="responseContent">
            <label for="responseTextKey">ResponseTextKey:</label>
            <input type="text" class="responseTextKey">
            <label for="nextDialogueID">NextDialogueID:</label>
            <input type="text" class="nextDialogueID">
            <label for="triggerKey">TriggerKey:</label>
            <input type="text" class="triggerKey">
        </div>
    `;
    const toggleButton = document.createElement('button');
    toggleButton.innerText = '⮟'; // символ для сворачивания
    toggleButton.classList.add('toggleButton');
    toggleButton.addEventListener('click', function () {
        toggleContent(this, responseDiv.querySelector('.responseContent'));
    });
    responseDiv.appendChild(toggleButton);
    return responseDiv;
}

function toggleContent(button, contentDiv) {
    if (contentDiv.style.display === 'none') {
        contentDiv.style.display = 'block';
        button.innerText = '⮟'; // символ для разворачивания
    } else {
        contentDiv.style.display = 'none';
        button.innerText = '⮞'; // символ для сворачивания
    }
}


function generateJson() {
    const npcName = document.getElementById('npcName').value;
    const dialogues = [];

    const dialogueElements = document.querySelectorAll('#dialoguesContainer > div');
    dialogueElements.forEach(dialogueElement => {
        const dialogueId = dialogueElement.querySelector('.dialogueId').value;
        const initialPhrase = dialogueElement.querySelector('.initialPhrase').value;

        const playerResponses = [];
        const responseElements = dialogueElement.querySelectorAll('.playerResponsesContainer > div');
        responseElements.forEach(responseElement => {
            const responseTextKey = responseElement.querySelector('.responseTextKey').value;
            const nextDialogueID = responseElement.querySelector('.nextDialogueID').value;
            const triggerKey = responseElement.querySelector('.triggerKey').value;

            playerResponses.push({
                ResponseTextKey: responseTextKey,
                NextDialogueID: nextDialogueID,
                TriggerKey: triggerKey
            });
        });

        dialogues.push({
            Id: dialogueId,
            InitialPhrase: initialPhrase,
            PlayerResponses: playerResponses
        });
    });

    const jsonData = {
        NPCName: npcName,
        Dialogues: dialogues
    };

    return JSON.stringify(jsonData, null, 2);
}

function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

document.addEventListener('input', function (event) {
    if (event.target.matches('.dialogueId, .initialPhrase, .responseTextKey, .nextDialogueID, .triggerKey, #npcName')) {
        const jsonData = generateJson();
        document.getElementById('jsonOutput').textContent = jsonData;
    }
});

document.getElementById('loadFileBtn').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const jsonData = e.target.result;
            populateFieldsFromJson(jsonData);
        };
        reader.readAsText(file);
    }
});

function populateFieldsFromJson(jsonData) {
    const data = JSON.parse(jsonData);

    // Заполняем поле NPCName
    document.getElementById('npcName').value = data.NPCName;

    // Удаляем текущие диалоги
    const dialoguesContainer = document.getElementById('dialoguesContainer');
    dialoguesContainer.innerHTML = '';

    // Заполняем диалоги
    data.Dialogues.forEach(dialogue => {
        const dialogueDiv = createDialogue();
        dialogueDiv.querySelector('.dialogueContent .dialogueId').value = dialogue.Id;
        dialogueDiv.querySelector('.dialogueContent .initialPhrase').value = dialogue.InitialPhrase;

        // Заполняем ответы игрока
        dialogue.PlayerResponses.forEach(response => {
            const responseDiv = createPlayerResponse();
            responseDiv.querySelector('.responseContent .responseTextKey').value = response.ResponseTextKey;
            responseDiv.querySelector('.responseContent .nextDialogueID').value = response.NextDialogueID;
            responseDiv.querySelector('.responseContent .triggerKey').value = response.TriggerKey;
            dialogueDiv.querySelector('.dialogueContent .playerResponsesContainer').appendChild(responseDiv);
        });

        dialoguesContainer.appendChild(dialogueDiv);
    });
}




// Обновленная часть для сохранения JSON на ПК:
document.getElementById('generateJsonBtn').addEventListener('click', function () {
    const jsonData = generateJson();
    console.log(jsonData);
    download('dialogues.json', jsonData);
});

