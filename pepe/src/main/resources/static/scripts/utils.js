
function send_single_state(id,additional_info){

const sessionData = {};
sessionData[id] = sessionStorage.getItem(id);
if(sessionData[id]==null){
    sessionData[id] = ""
}
if(additional_info!=null){
for (const key in additional_info) {
    if (additional_info.hasOwnProperty(key)) {
        const value = additional_info[key];
        sessionData[key] = value;
    }
}
}
sessionData["username"] = sessionStorage.getItem("username");
sessionData["sessionID"] = sessionStorage.getItem("sessionID");

// Step 2: Optionally, convert the data to an object or array
// If you want to send the data as an array, you can use Object.values(sessionData)

// Step 3: Send the data to the server using the Fetch API
fetch('/update-state', {
    method: 'POST', // or 'PUT', 'GET', etc., depending on your server's API
    headers: {
        'Content-Type': 'application/json', // Set the appropriate content type
    },
    body: JSON.stringify(sessionData), // Send the data as JSON
})
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    })
    .catch((error) => {
        console.error('Error sending data to server:', error);
    });

}

function send_state(){
// Step 1: Retrieve all keys and values from sessionStorage
const sessionData = {};
for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);
    sessionData[key] = value;
}

// Step 2: Optionally, convert the data to an object or array
// If you want to send the data as an array, you can use Object.values(sessionData)

// Step 3: Send the data to the server using the Fetch API
fetch('/update-state', {
    method: 'POST', // or 'PUT', 'GET', etc., depending on your server's API
    headers: {
        'Content-Type': 'application/json', // Set the appropriate content type
    },
    body: JSON.stringify(sessionData), // Send the data as JSON
})
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    })
    .catch((error) => {
        console.error('Error sending data to server:', error);
    });
}