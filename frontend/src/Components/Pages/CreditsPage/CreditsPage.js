import {clearPage} from "../../../utils/render";
import Navigate from "../../Router/Navigate";

const CreditsPage = () => {
    clearPage();

    const main = document.querySelector("main");

    const sectionImage = document.createElement("section");
    sectionImage.classList.add("image");
    main.appendChild(sectionImage);

    const creditsSection = document.createElement("section");
    creditsSection.classList.add("credits");
    sectionImage.appendChild(creditsSection);

    const collaboratorsTitle = document.createElement("h6");
    collaboratorsTitle.classList.add("title");
    collaboratorsTitle.textContent = "COLLABORATORS";
    creditsSection.appendChild(collaboratorsTitle);

    const tableauCollaborators = [
        {
            name: "D'haeyere Corentin",
            github: "https://github.com/cdhaeyere"
        },
        {
            name: "De Sa Adegas Miguel",
            github: "https://github.com/miguelDeSaAdegas"
        },
        {
            name: "Lapinski Damien",
            github: "https://github.com/SNEKEK"
        },
        {
            name: "Subbota Iuliana",
            github: "https://github.com/Iuliana0123"
        },
        {
            name: "Vandeputte Francois",
            github: "https://github.com/Ractouf"
        }
    ];

    const collaboratorsList = document.createElement("ul");
    collaboratorsList.classList.add("list");
    creditsSection.appendChild(collaboratorsList);

    tableauCollaborators.forEach((collaborator) => {
        const collaboratorElement = document.createElement("li");
        collaboratorsList.appendChild(collaboratorElement);

        const collaboratorGithub = document.createElement("a");
        collaboratorGithub.setAttribute("target", "_blank");
        collaboratorGithub.setAttribute("rel", "noopener noreferrer");
        collaboratorGithub.href = collaborator.github;
        collaboratorElement.appendChild(collaboratorGithub);

        const collaboratorName = document.createElement("h6");
        collaboratorName.classList.add("title-bis");
        collaboratorName.textContent = collaborator.name;
        collaboratorGithub.appendChild(collaboratorName);
    });

    const remerciementsTitle = document.createElement("h6");
    remerciementsTitle.classList.add("title");
    remerciementsTitle.textContent = "SPECIAL THANKS TO";
    creditsSection.appendChild(remerciementsTitle);

    const tableauRemerciements = [
        {
            name: "Jetti Omar (SealRescue)",
            github: "https://github.com/Soxomer"
        },
        {
            name: "Blomme Kimberley (SealRescue)",
            github: "https://github.com/Kybol"
        },
        {
            name: "Garcia Alexandre",
            github: "https://github.com/AlexandreSGarcia"
        }
    ];

    const remerciementsList = document.createElement("ul");
    remerciementsList.classList.add("list");
    creditsSection.appendChild(remerciementsList);

    tableauRemerciements.forEach((remerciement) => {
        const remerciementElement = document.createElement("li");
        remerciementsList.appendChild(remerciementElement);

        const remerciementGithub = document.createElement("a");
        remerciementGithub.setAttribute("target", "_blank");
        remerciementGithub.setAttribute("rel", "noopener noreferrer");
        remerciementGithub.href = remerciement.github;
        remerciementElement.appendChild(remerciementGithub);

        const remerciementName = document.createElement("h6");
        remerciementName.classList.add("title-bis");
        remerciementName.textContent = remerciement.name;
        remerciementGithub.appendChild(remerciementName);
    });

    const backButton = document.createElement("button");
    backButton.classList.add("back-button");
    backButton.textContent = "BACK";
    backButton.addEventListener("click", () => {
        Navigate('/');
    });
    creditsSection.appendChild(backButton);
}

export default CreditsPage;
