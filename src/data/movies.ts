export interface Movie {
    id: string;
    title: string;
    titleEn?: string;
    subtitle: string;
    subtitleEn?: string;
    description: string;
    descriptionEn?: string;
    category: string;
    categoryEn?: string;
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
    synopsisEn?: string;
}

export const movies: Movie[] = [
    {
        id: 'nefeli',
        title: 'Οι σκέψεις της Νεφέλης',
        titleEn: 'Nefeli\'s Thoughts',
        subtitle: 'Μικρού μήκους • Σχολικός εκφοβισμός',
        subtitleEn: 'Short Film • School Bullying',
        description: 'Μια συγκινητική ιστορία για τον σχολικό εκφοβισμό και την επίδρασή του στα παιδιά.',
        descriptionEn: 'A moving story about school bullying and its impact on children.',
        category: 'Παιδιά & Νεολαία',
        categoryEn: 'Children & Youth',
        image: '/images/3.jpg',
        video: 'https://vculture.b-cdn.net/video/nefeli%203%20trailer.mp4',
        year: '2023',
        duration: '15 λεπτά',
        director: 'Βασίλης Νάκης',
        synopsis: 'Η Νεφέλη είναι ένα κορίτσι που αντιμετωπίζει καθημερινά τον σχολικό εκφοβισμό. Μέσα από τις σκέψεις της, ανακαλύπτουμε την εσωτερική της δύναμη και την ανθεκτικότητά της. Μια ταινία που φωτίζει ένα σοβαρό κοινωνικό πρόβλημα με ευαισθησία και σεβασμό.',
        synopsisEn: 'Nefeli is a girl facing school bullying daily. Through her thoughts, we discover her inner strength and resilience. A film that sheds light on a serious social problem with sensitivity and respect.',
        credits: [
            { role: 'Σκηνοθεσία', name: 'Βασίλης Νάκης' },
            { role: 'Παραγωγή', name: 'vculture' },
            { role: 'Φωτογραφία', name: 'Γιάννης Παπαδόπουλος' },
        ],
    },
    {
        id: 'roda-ine',
        title: 'Ρόδα είναι και γυρίζει',
        titleEn: 'The Wheel Turns',
        subtitle: 'Ντοκιμαντέρ • ΑμεΑ',
        subtitleEn: 'Documentary • PwD',
        description: 'Ένα ντοκιμαντέρ που αναδεικνύει τις προκλήσεις και τις νίκες των ατόμων με αναπηρία.',
        descriptionEn: 'A documentary highlighting the challenges and victories of people with disabilities.',
        category: 'ΑμεΑ',
        categoryEn: 'PwD',
        image: '/images/rodaIne.jpg',
        video: 'https://vculture.b-cdn.net/video/rodaIneKaiGyriziTrailer.mp4',
        year: '2023',
        duration: '25 λεπτά',
        director: 'Βασίλης Νάκης',
        synopsis: 'Ένα συγκινητικό ντοκιμαντέρ που ακολουθεί την καθημερινή ζωή ατόμων με αναπηρία, αναδεικνύοντας τη δύναμη, την αποφασιστικότητα και την αισιοδοξία τους. Μια ταινία που αλλάζει προοπτικές και εμπνέει.',
        synopsisEn: 'A moving documentary following the daily lives of people with disabilities, highlighting their strength, determination, and optimism. A film that changes perspectives and inspires.',
        credits: [
            { role: 'Σκηνοθεσία', name: 'Βασίλης Νάκης' },
            { role: 'Παραγωγή', name: 'vculture' },
        ],
    },
    {
        id: 'kathe-stigmi',
        title: 'Κάθε στιγμή που έζησα',
        titleEn: 'Every Moment I Lived',
        subtitle: 'Μικρού μήκους • Κοινωνικό',
        subtitleEn: 'Short Film • Social',
        description: 'Μια ιστορία για την αξία της ζωής και τη σημασία κάθε στιγμής.',
        descriptionEn: 'A story about the value of life and the importance of every moment.',
        category: 'Κοινωνικό',
        categoryEn: 'Social',
        image: '/images/4.jpg',
        video: 'https://vculture.b-cdn.net/video/katheStigmiPuEzisaTrailer.mp4',
        year: '2023',
        duration: '18 λεπτά',
        director: 'Βασίλης Νάκης',
        synopsis: 'Μια βαθιά συγκινητική ταινία που εξερευνά τη σημασία κάθε στιγμής στη ζωή μας. Μέσα από προσωπικές ιστορίες, ανακαλύπτουμε πώς οι μικρές στιγμές διαμορφώνουν τη ζωή μας και μας κάνουν αυτό που είμαστε.',
        synopsisEn: 'A deeply moving film exploring the importance of every moment in our lives. Through personal stories, we discover how small moments shape our lives and make us who we are.',
        credits: [
            { role: 'Σκηνοθεσία', name: 'Βασίλης Νάκης' },
            { role: 'Παραγωγή', name: 'vculture' },
            { role: 'Μοντάζ', name: 'Μαρία Κωνσταντίνου' },
        ],
    },
];
