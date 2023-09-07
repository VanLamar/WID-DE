let dialogData;
let currentDialogID = "Start";
let portraits = [];
let nameOverride;

document.getElementById('jsonUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        dialogData = JSON.parse(event.target.result);
        startDialogue(currentDialogID);
    }
    reader.readAsText(file);
});

document.getElementById('imgUpload').addEventListener('change', function(e) {
    Array.from(e.target.files).forEach(file => {
        const portraitURL = URL.createObjectURL(file);
        portraits.push(portraitURL);
    });
});

function startDialogue(dialogID) {
    const dialog = dialogData.Dialogues.find(d => d.Id === dialogID);
    if (!dialog) return;

    const npcName = document.getElementById('npcName');
    const dialogText = document.getElementById('dialogText');
    const responseButtons = document.getElementById('responseButtons');
    const portrait = document.getElementById('portrait');

    npcName.textContent = nameOverride || dialogData.NPCName;

    if (/(\[p(\d+)\])/g.test(dialog.InitialPhrase)) {
        dialogText.textContent = dialog.InitialPhrase.replace(/\[p(\d+)\]/g, (match, p1) => {
            portrait.src = portraits[parseInt(p1, 10)];
            portrait.hidden = false;
            return "";
        });
    } else {
        portrait.src = portraits[0];
        portrait.hidden = false;
        dialogText.textContent = dialog.InitialPhrase;
    }

    responseButtons.innerHTML = '';
    dialog.PlayerResponses.forEach(response => {
        const button = document.createElement('button');
        button.textContent = response.ResponseTextKey;
        button.onclick = function() {
            if (response.TriggerKey === "Me") {
                nameOverride = "????";
            } else {
                nameOverride = null;
            }
            startDialogue(response.NextDialogueID.trim());
        }
        responseButtons.appendChild(button);
    });
}

function resetDialogue() {
    currentDialogID = "Start";
    nameOverride = null;
    startDialogue(currentDialogID);
}
function back(){
     window.location.href = "index.html";
}
