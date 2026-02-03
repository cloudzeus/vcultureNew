export interface Movie {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    category: string;
    image: string;
    video: string;
    year: string;
    duration: string;
    director?: string;
    credits?: {
        role: string;
        name: string;
    }[];
    synopsis?: string;
}

export const movies: Movie[] = [
    {
        id: 'nefeli',
        title: 'Οι σκέψεις της Νεφέλης',
        subtitle: 'Μικρού μήκους • Σχολικός εκφοβισμός',
        description: 'Μια συγκινητική ιστορία για τον σχολικό εκφοβισμό και την επίδρασή του στα παιδιά.',
        category: 'Παιδιά & Νεολαία',
        image: '/images/3.jpg',
        video: 'https://vculture.b-cdn.net/video/nefeli%203%20trailer.mp4',
        year: '2023',
        duration: '15 λεπτά',
        director: 'Βασίλης Νάκης',
        synopsis: 'Η Νεφέλη είναι ένα κορίτσι που αντιμετωπίζει καθημερινά τον σχολικό εκφοβισμό. Μέσα από τις σκέψεις της, ανακαλύπτουμε την εσωτερική της δύναμη και την ανθεκτικότητά της. Μια ταινία που φωτίζει ένα σοβαρό κοινωνικό πρόβλημα με ευαισθησία και σεβασμό.',
        credits: [
            { role: 'Σκηνοθεσία', name: 'Βασίλης Νάκης' },
            { role: 'Παραγωγή', name: 'vculture' },
            { role: 'Φωτογραφία', name: 'Γιάννης Παπαδόπουλος' },
        ],
    },
    {
        id: 'roda-ine',
        title: 'Ρόδα είναι και γυρίζει',
        subtitle: 'Ντοκιμαντέρ • ΑμεΑ',
        description: 'Ένα ντοκιμαντέρ που αναδεικνύει τις προκλήσεις και τις νίκες των ατόμων με αναπηρία.',
        category: 'ΑμεΑ',
        image: '/images/rodaIne.jpg',
        video: 'https://vculture.b-cdn.net/video/rodaIneKaiGyriziTrailer.mp4',
        year: '2023',
        duration: '25 λεπτά',
        director: 'Βασίλης Νάκης',
        synopsis: 'Ένα συγκινητικό ντοκιμαντέρ που ακολουθεί την καθημερινή ζωή ατόμων με αναπηρία, αναδεικνύοντας τη δύναμη, την αποφασιστικότητα και την αισιοδοξία τους. Μια ταινία που αλλάζει προοπτικές και εμπνέει.',
        credits: [
            { role: 'Σκηνοθεσία', name: 'Βασίλης Νάκης' },
            { role: 'Παραγωγή', name: 'vculture' },
        ],
    },
    {
        id: 'kathe-stigmi',
        title: 'Κάθε στιγμή που έζησα',
        subtitle: 'Μικρού μήκους • Κοινωνικό',
        description: 'Μια ιστορία για την αξία της ζωής και τη σημασία κάθε στιγμής.',
        category: 'Κοινωνικό',
        image: '/images/4.jpg',
        video: 'https://vculture.b-cdn.net/video/katheStigmiPuEzisaTrailer.mp4',
        year: '2023',
        duration: '18 λεπτά',
        director: 'Βασίλης Νάκης',
        synopsis: 'Μια βαθιά συγκινητική ταινία που εξερευνά τη σημασία κάθε στιγμής στη ζωή μας. Μέσα από προσωπικές ιστορίες, ανακαλύπτουμε πώς οι μικρές στιγμές διαμορφώνουν τη ζωή μας και μας κάνουν αυτό που είμαστε.',
        credits: [
            { role: 'Σκηνοθεσία', name: 'Βασίλης Νάκης' },
            { role: 'Παραγωγή', name: 'vculture' },
            { role: 'Μοντάζ', name: 'Μαρία Κωνσταντίνου' },
        ],
    },
];
