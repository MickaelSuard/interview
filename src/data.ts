import type { Contact } from "./type";

const sound = (name: string) => `${import.meta.env.BASE_URL}${name}`;
const avatar = (name: string) => `${import.meta.env.BASE_URL}avatar/${name}`;

const waves = {
    calm: [3, 5, 7, 9, 6, 8, 10, 7, 5, 8, 11, 9, 6, 4, 7, 9, 5, 8, 10, 6, 7, 4, 6, 9, 8, 5, 7, 10, 6, 4],
    precise: [4, 8, 6, 10, 7, 5, 9, 11, 6, 8, 4, 7, 10, 8, 5, 9, 6, 11, 7, 4, 8, 6, 9, 5, 10, 7, 4, 8, 6, 9],
    bright: [6, 4, 9, 7, 11, 5, 8, 6, 10, 4, 7, 9, 5, 8, 11, 6, 4, 9, 7, 5, 10, 8, 6, 4, 9, 7, 11, 5, 8, 6],
    dense: [5, 9, 7, 4, 10, 8, 6, 11, 5, 7, 9, 4, 8, 6, 10, 5, 7, 11, 4, 9, 6, 8, 5, 10, 7, 4, 9, 6, 11, 8],
    long: [7, 5, 10, 8, 4, 11, 6, 9, 5, 8, 10, 6, 4, 9, 7, 11, 5, 8, 6, 10, 4, 7, 9, 5, 11, 8, 6, 4, 10, 7],
};

export const SOUND_SRC = sound("sound1.mp3");

export const CONTACTS: Contact[] = [
    {
        id: "mentor",
        name: "Mickael Suard",
        role: "Ingénieur en Ingénierie Logicielle",
        preview: "Vous : Comment avez-vous organise mon integration dans l'equipe ?",
        date: "19/06",
        status: "En ligne",
        avatarSrc: avatar("MS.jpg"),
        avatarClassName: "bg-gradient-to-br from-blue-100 to-blue-200",
        avatarTextClassName: "text-blue-700",
        conversation: [
            { id: 1, question: "Comment avez-vous organise mon integration dans l'equipe ?", audioWaveform: waves.calm, audioSrc: sound("sound1.mp3") },
            { id: 2, question: "Quelles responsabilites m'avez-vous confiees au fil du stage ?", audioWaveform: waves.precise, audioSrc: sound("sound.mp3") },
            { id: 3, question: "Quel moment montre le mieux ma progression selon vous ?", audioWaveform: waves.bright, audioSrc: sound("sound2.mp3") },
            { id: 4, question: "Quels conseils me donneriez-vous pour la suite de mon parcours ?", audioWaveform: waves.long, audioSrc: sound("sound4.mp3") },
        ],
    },
    {
        id: "tutor",
        name: "Claire Laurent",
        role: "Tutrice pedagogique",
        preview: "Vous : Quels points voulez-vous voir apparaitre dans le rapport ?",
        date: "19/06",
        status: "Disponible",
        avatarClassName: "bg-gradient-to-br from-violet-100 to-violet-300",
        avatarTextClassName: "text-violet-800",
        conversation: [
            { id: 1, question: "Quels points voulez-vous voir apparaitre dans le rapport ?", audioWaveform: waves.precise, audioSrc: sound("sound2.mp3") },
            { id: 2, question: "Comment relier mes missions aux competences attendues par la formation ?", audioWaveform: waves.dense, audioSrc: sound("sound3.mp3") },
            { id: 3, question: "Que dois-je clarifier avant la soutenance ?", audioWaveform: waves.calm, audioSrc: sound("sound1.mp3") },
        ],
    },
    {
        id: "project",
        name: "Amina Roche",
        role: "Cheffe de projet",
        preview: "Vous : Quelle place mon travail a-t-il prise dans le projet ?",
        date: "18/06",
        status: "Occupee",
        avatarClassName: "bg-gradient-to-br from-amber-100 to-amber-300",
        avatarTextClassName: "text-amber-800",
        conversation: [
            { id: 1, question: "Quelle place mon travail a-t-il prise dans le projet ?", audioWaveform: waves.bright, audioSrc: sound("sound.mp3") },
            { id: 2, question: "Quelles contraintes importantes avez-vous du gerer avec l'equipe ?", audioWaveform: waves.long, audioSrc: sound("sound4.mp3") },
            { id: 3, question: "Qu'est-ce qui aurait pu rendre ma contribution encore plus utile ?", audioWaveform: waves.dense, audioSrc: sound("sound3.mp3") },
        ],
    },
    {
        id: "dev",
        name: "Nolan Tessier",
        role: "Developpeur referent",
        preview: "Vous : Quelles bonnes pratiques techniques ai-je le plus progresse a appliquer ?",
        date: "17/06",
        status: "En ligne",
        avatarClassName: "bg-gradient-to-br from-green-100 to-green-300",
        avatarTextClassName: "text-green-800",
        conversation: [
            { id: 1, question: "Quelles bonnes pratiques techniques ai-je le plus progresse a appliquer ?", audioWaveform: waves.dense, audioSrc: sound("sound3.mp3") },
            { id: 2, question: "Comment avez-vous percu mon autonomie sur les tickets confies ?", audioWaveform: waves.calm, audioSrc: sound("sound1.mp3") },
            { id: 3, question: "Quelle competence technique devrais-je continuer a consolider ?", audioWaveform: waves.precise, audioSrc: sound("sound2.mp3") },
        ],
    },
    {
        id: "hr",
        name: "Emma Simon",
        role: "Ressources humaines",
        preview: "Vous : Quels comportements professionnels sont ressortis pendant le stage ?",
        date: "17/06",
        status: "Disponible",
        avatarClassName: "bg-gradient-to-br from-red-100 to-red-200",
        avatarTextClassName: "text-red-800",
        conversation: [
            { id: 1, question: "Quels comportements professionnels sont ressortis pendant le stage ?", audioWaveform: waves.long, audioSrc: sound("sound4.mp3") },
            { id: 2, question: "Comment presenter cette experience dans un futur entretien ?", audioWaveform: waves.bright, audioSrc: sound("sound.mp3") },
            { id: 3, question: "Quels points forts dois-je mettre en avant sur mon CV ?", audioWaveform: waves.calm, audioSrc: sound("sound1.mp3") },
        ],
    },
    {
        id: "manager",
        name: "Victor Delmas",
        role: "Responsable d'equipe",
        preview: "Vous : Quelle impression globale gardez-vous de mon passage dans l'equipe ?",
        date: "16/06",
        status: "Absent",
        avatarClassName: "bg-gradient-to-br from-sky-100 to-sky-300",
        avatarTextClassName: "text-sky-800",
        conversation: [
            { id: 1, question: "Quelle impression globale gardez-vous de mon passage dans l'equipe ?", audioWaveform: waves.precise, audioSrc: sound("sound2.mp3") },
            { id: 2, question: "En quoi mes missions ont-elles aide l'organisation de l'equipe ?", audioWaveform: waves.long, audioSrc: sound("sound4.mp3") },
            { id: 3, question: "Quelle recommandation feriez-vous pour mon prochain stage ou emploi ?", audioWaveform: waves.dense, audioSrc: sound("sound3.mp3") },
        ],
    },
];
