document.addEventListener('DOMContentLoaded', (event) => {
    const dialoguesContainer = document.getElementById('dialoguesContainer');
    const npcNameInput = document.getElementById('npcName');
    const jsonOutput = document.getElementById('jsonOutput');
    let dialogueCount = 0; // To track the number of dialogues added
    
    document.getElementById('addDialogueBtn').addEventListener('click', () => {
        const isFirstDialogue = dialogueCount === 0;
        const dialogue = createDialogue(isFirstDialogue);
        dialoguesContainer.appendChild(dialogue);
        dialogueCount++;
    });

    document.getElementById('generateJsonBtn').addEventListener('click', () => {
        const jsonData = generateJson();
        console.log(jsonData);
        download('dialogues.json', jsonData);
    });

    document.getElementById('loadFileBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', handleFileInput);

    document.addEventListener('input', () => {
        jsonOutput.textContent = generateJson();
    });

    function createDialogue(isFirstDialogue) {
        const dialogueDiv = document.createElement('div');
        dialogueDiv.classList.add('dialogue');
        const dialogueIdValue = isFirstDialogue ? 'Start' : '';
        dialogueDiv.innerHTML = `
            <div class="dialogueContent">
                <label>Id:</label>
                <input type="text" class="dialogueId" value="${dialogueIdValue}" ${isFirstDialogue ? 'readonly' : ''}>
                <label>Initial Phrase:</label>
                <textarea class="initialPhrase"></textarea>
                <div class="playerResponsesContainer"></div>
                <button class="addResponseBtn">Add Player Response</button>
            </div>
        `;

        dialogueDiv.querySelector('.addResponseBtn').addEventListener('click', () => {
            dialogueDiv.querySelector('.playerResponsesContainer').appendChild(createPlayerResponse());
        });

        return dialogueDiv;
    }

    function createPlayerResponse() {
        const responseDiv = document.createElement('div');
        responseDiv.classList.add('response');
        responseDiv.innerHTML = `
            <div class="responseContent">
                <label>Response Text Key:</label>
                <input type="text" class="responseTextKey">
                <label>Next Dialogue ID:</label>
                <input type="text" class="nextDialogueID">
                <label>Trigger Key:</label>
                <input type="text" class="triggerKey">
                <button class="gotoDialogueBtn">Go to Dialogue</button>
            </div>
        `;

        const gotoButton = responseDiv.querySelector('.gotoDialogueBtn');
        gotoButton.addEventListener('click', () => {
            const nextDialogueID = responseDiv.querySelector('.nextDialogueID').value;
            const targetDialogueElement = [...document.querySelectorAll('.dialogueId')]
                .find(element => element.value === nextDialogueID)?.parentElement.parentElement;
            
            if (targetDialogueElement) {
                targetDialogueElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        return responseDiv;
    }

    function generateJson() {
        const npcName = npcNameInput.value;
        const dialogues = Array.from(dialoguesContainer.children).map((dialogue, index) => {
            const id = dialogue.querySelector('.dialogueId').value || `Dialogue${index + 1}`;
            const initialPhrase = dialogue.querySelector('.initialPhrase').value;
            const responses = Array.from(dialogue.querySelectorAll('.response')).map((response, responseIndex) => {
                const responseTextKey = response.querySelector('.responseTextKey').value;
                const nextDialogueID = response.querySelector('.nextDialogueID').value || `Dialogue${responseIndex + 1}`;
                const triggerKey = response.querySelector('.triggerKey').value;
                return {
                    ResponseTextKey: responseTextKey,
                    NextDialogueID: nextDialogueID,
                    TriggerKey: triggerKey
                };
            });

            return { Id: id, InitialPhrase: initialPhrase, PlayerResponses: responses };
        });

        return JSON.stringify({ NPCName: npcName, Dialogues: dialogues }, null, 2);
    }
    function handleFileInput(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => populateFieldsFromJson(e.target.result);
            reader.readAsText(file);
        }
    }

    function populateFieldsFromJson(jsonData) {
        const data = JSON.parse(jsonData);
        npcNameInput.value = data.NPCName;
        dialoguesContainer.innerHTML = '';
        data.Dialogues.forEach(dialogueData => {
            const dialogueDiv = createDialogue(dialogueData.Id === 'Start');
            dialogueDiv.querySelector('.dialogueId').value = dialogueData.Id;
            dialogueDiv.querySelector('.initialPhrase').value = dialogueData.InitialPhrase;
            dialogueData.PlayerResponses.forEach(responseData => {
                const responseDiv = createPlayerResponse();
                responseDiv.querySelector('.responseTextKey').value = responseData.ResponseTextKey;
                responseDiv.querySelector('.nextDialogueID').value = responseData.NextDialogueID;
                responseDiv.querySelector('.triggerKey').value = responseData.TriggerKey;
                dialogueDiv.querySelector('.playerResponsesContainer').appendChild(responseDiv);
            });
            dialoguesContainer.appendChild(dialogueDiv);
        });
        setupGoToDialogueButtons();
    }

    function setupGoToDialogueButtons() {
        const gotoButtons = dialoguesContainer.querySelectorAll('.gotoDialogueBtn');
        gotoButtons.forEach(button => {
            button.addEventListener('click', () => {
                const responseDiv = button.closest('.response');
                const nextDialogueID = responseDiv.querySelector('.nextDialogueID').value;
                const targetDialogueElement = [...document.querySelectorAll('.dialogueId')]
                    .find(element => element.value === nextDialogueID)?.parentElement.parentElement;

                if (targetDialogueElement) {
                    targetDialogueElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    function download(filename, text) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
});

const openInfoBtn = document.getElementById('openInfoBtn');
const infoModal = document.getElementById('infoModal');
const closeInfoBtn = infoModal.querySelector('.close');

openInfoBtn.addEventListener('click', () => {
    infoModal.style.display = 'block';
});

closeInfoBtn.addEventListener('click', () => {
    infoModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === infoModal) {
        infoModal.style.display = 'none';
    }
});
