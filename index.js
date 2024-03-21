const cohortName = "2402-FTB-ET-WEB-FT";
const API_URL_EVENTS = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${cohortName}/events`;

const state = {
  parties: [],
}

const form = document.querySelector('#addParty');
const parties = document.querySelector('#parties');
form.addEventListener("submit", addParty);


async function render() {
  await getParties();
  renderParty();
}
render();

async function getParties() {
  try {
  const response = await fetch(API_URL);
  const json = await response.json();
  state.parties = json.data;
} catch (error) {
  console.error(error);
}
}
console.log(state);

function renderParty () {
  if(!state.parties.length){
      parties.innerHTML='There are no parties to plan :(';
      return;
  }
  const partyDisplay = state.parties.map((party) =>{
      const partyInfo = document.createElement('li');
      partyInfo.innerHTML=       
      `<h2>${party.name}</h2>
      <p>${party.date}<p>
      <p>${party.description}</p>;
      <p>${party.location}</p>`;
      const button = document.createElement("button");
      button.textContent = "Delete party";
      button.addEventListener('click', () => deleteButton(party.id));
      partyInfo.append(button);

      return partyInfo;
  });
  parties.replaceChildren(...partyDisplay);
}
async function deleteButton (id) {
  try {
      const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
        });
render();
}catch (error) {
  console.log(error);
};
}

async function createParty(name, date, location, description) {
  try {
  const isoDate = new Date(date + ':00').toISOString();
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date: isoDate, location, description }),
    });

    const json = await response.json();

    if (json.error) {
      throw new Error(`Failed to create party`);
  }
   
    render();
  } catch (error) {
      console.error(error);
    };
  }
  
async function addParty(event) {
  event.preventDefault();
  await createParty(
    form.name.value,
    form.date.value,
    form.location.value,
    form.description.value,
  );
  form.name.value = '';
  form.date.value = '';
  form.location.value = '';
  form.description.value = '';
}