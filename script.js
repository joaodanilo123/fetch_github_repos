const reposDisplay = document.getElementById('repos-display')
const profileInfo = document.getElementById('profile-info')
const form = document.getElementById('form')

form.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const username = new FormData(ev.target).get('username');

    const userData = await fetchGithub(username, 'profile');
    const reposData = await fetchGithub(username, 'repos');

    clearPage();
    buildProfileSection(userData);
    buildReposSection(reposData)

});


async function fetchGithub(username, resource) {

    let URL_GITHUB;

    if (resource === "profile") {
        URL_GITHUB = `https://api.github.com/users/${username}`;
    }

    if (resource === "repos") {
        URL_GITHUB = `https://api.github.com/users/${username}/repos`;
    }

    if (URL_GITHUB === undefined) return;

    let response = await fetch(URL_GITHUB);
    data = await response.json();

    console.log(data);

    return data;
}


function buildProfileSection(userData) {

    const img = document.createElement("img");
    img.src = userData.avatar_url;
    img.width = 200;
    img.height = 200;

    const textInfo = document.createElement("aside");

    const link = document.createElement("a")
    link.href = userData.html_url

    const title = document.createElement("h2");
    title.innerText = userData.name

    const subtitle = document.createElement("h4");
    subtitle.innerText = `@${userData.login}`

    const bio = document.createElement("p")
    bio.innerText = userData.bio

    const followers = document.createElement("span");
    followers.innerText = `${userData.followers} followers`

    link.appendChild(subtitle);
    textInfo.appendChild(title);
    textInfo.appendChild(link);
    textInfo.appendChild(bio);
    textInfo.appendChild(followers);
    profileInfo.appendChild(img);
    profileInfo.appendChild(textInfo);

}

function buildReposSection(reposData) {

    let languages = {};

    reposData.forEach(repo => {

        language = repo.language
        if (languages.hasOwnProperty(language)) {
            languages[language].push(repo);
        } else {
            languages[language] = [];
            languages[language].push(repo);
        }

    });

    for (let [language, repos] of Object.entries(languages)) {
        const languageContainer = document.createElement("section");
        const languageTitle = document.createElement("h2");

        if (language === "null") language = "Language not defined"
        languageTitle.innerText = language;

        languageContainer.appendChild(languageTitle)

        repos.forEach(repo => {
            const container = document.createElement("article");
            const link = document.createElement("a");
            link.href = repo.html_url;
            const title = document.createElement("h3");
            title.innerText = repo.name;

            const description = document.createElement("p");
            description.innerText = repo.description;

            link.appendChild(title);
            container.appendChild(link);
            container.appendChild(description)
            container.classList.add("repo")

            languageContainer.appendChild(container);
        })

        reposDisplay.appendChild(languageContainer);
    }

}

function clearPage() {
    reposDisplay.innerHTML = '';
    profileInfo.innerHTML = '';
}