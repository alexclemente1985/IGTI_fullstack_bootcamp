let globalUsers = [];
let globalFilteredUsers = [];
let statistics = {};
let returnedUsers = 0;

async function start() {
  await promiseUsers();
  hideSpinner();
  await render();
  await configFilter();
}

const promiseUsers = () => {
  return new Promise(async (resolve, reject) => {
    const users = await fetchUsers();
    resolve(users);
  });
};

async function fetchUsers() {
  const response = await fetch("http://localhost:3001/results");
  const responseJson = await response.json();

  globalUsers = responseJson.map(({ name, picture, dob, gender }) => {
    return {
      userName: name.first + " " + name.last,
      userPicture: picture.large,
      userAge: dob.age,
      userGender: gender,
    };
  });
  globalUsers.sort((a, b) => a.userName.localeCompare(b.userName));
  console.log("response users: ", globalUsers);
  globalFilteredUsers = [...globalUsers];
  console.log("filtered users: ", globalFilteredUsers);

  statistics = {
    maleGenders: genderStatistics("male"),
    femaleGenders: genderStatistics("female"),
    sumOfAges: sumOfAges(),
    averageAge: averageAge(),
  };
}

const hideSpinner = () => {
  const spinner = document.getElementById("spinner");
  spinner.classList.add("hide");
};

const configFilter = () => {
  const buttonFilter = document.getElementById("buttonFilter");
  const inputFilter = document.getElementById("inputFilter");
  inputFilter.addEventListener("keyup", (event) =>
    handleFilterKeyUp(event, inputFilter)
  );
  buttonFilter.addEventListener("click", () => {
    handleButtonFilterClick(inputFilter);
  });
};

function handleFilterKeyUp({ key }, inputFilter) {
  if (key === "Enter") {
    handleButtonFilterClick(inputFilter);
  }
}

function handleButtonFilterClick(inputFilter) {
  const filterValue = inputFilter.value.toLowerCase().trim();

  globalFilteredUsers = globalUsers.filter((item) => {
    return item.userName.toLowerCase().trim().includes(filterValue);
  });

  statistics = {
    maleGenders: genderStatistics("male"),
    femaleGenders: genderStatistics("female"),
    sumOfAges: sumOfAges(),
    averageAge: averageAge(),
  };

  render();

  console.log("globalFilteredUsers após filtro:", globalFilteredUsers);
  console.log("statistics: ", statistics);
}

function genderStatistics(gender) {
  console.log("gender passado: ", gender);
  console.log(
    "QUANTIDADE: ",
    globalFilteredUsers.filter((item) => {
      item.userGender === gender;
    }).length
  );

  return globalFilteredUsers.filter((item) => item.userGender === gender)
    .length;
}

function sumOfAges() {
  return globalFilteredUsers.reduce((acc, item) => (acc += item.userAge), 0);
}

function averageAge() {
  return globalFilteredUsers.length > 0
    ? (sumOfAges() / globalFilteredUsers.length).toFixed(1)
    : 0;
}

const userSection = () => {
  return `
  ${
    globalFilteredUsers.length > 0
      ? `  
        <div class="userSection">
      
            <span class="searchInfo">${
              globalFilteredUsers.length
            } usuário(s) encontrado(s)</span>
            ${globalFilteredUsers
              .map(({ userPicture, userName, userAge }) => {
                return `
                    <div class="userCard">
                        <img
                          class='userPicture'
                          src=${userPicture}
                          alt=${userName}
                          title=${userName}
                          width='30'
                          heigth='30'
                        />
                        <span >
                          ${userName}, ${userAge} anos
                        </span>
                    </div>
                `;
              })
              .join("")}
        </div>`
      : `<span class="noUserResults">Nenhum usuário filtrado</span>`
  }`;
};

const statisticsSection = () => {
  return `
  ${
    globalFilteredUsers.length > 0
      ? `
            <div class="statisticsSection">
                <span class="searchInfo">Estatísticas</span>
                <div class="statisticsContainer">
                    <span class="statisticsInfo">Sexo masculino: <span class="statisticsValue">${statistics.maleGenders}</span></span>
                    <span class="statisticsInfo">Sexo feminino: <span class="statisticsValue">${statistics.femaleGenders}</span></span>
                    <span class="statisticsInfo">Soma das idades: <span class="statisticsValue">${statistics.sumOfAges}</span></span>
                    <span class="statisticsInfo">Média das idades: <span class="statisticsValue">${statistics.averageAge}</span></span>
                </div>
            </div>`
      : `<span class="noStatisticResults">Nada a ser exibido</span>`
  }
    
    `;
};

const render = async () => {
  const divResults = document.getElementById("results");
  returnedUsers = globalFilteredUsers.length;

  divResults.innerHTML = `
    <div id class="row">
        ${userSection()}
        ${statisticsSection()}
    </div>
    `;
};

start();
