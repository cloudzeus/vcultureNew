import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import 'dotenv/config'
import sharp from 'sharp'

const prisma = new PrismaClient()

// --- DATA ---
const movies = [
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

const journalPosts = [
    {
        id: 'camera-off',
        title: 'Όταν η κάμερα σβήνει, τι μένει στους ανθρώπους;',
        category: 'Field Notes',
        readTime: '6 min read',
        image: '/images/bts-1.jpg',
        excerpt: 'Μια σκέψη για το τι μένει πίσω από τα γυρίσματα και πώς επηρεάζουμε τους ανθρώπους που συναντάμε.',
        date: '2024-01-15',
        author: 'Βασίλης Νάκης',
        content: `Κάθε φορά που τελειώνει ένα γύρισμα, υπάρχει μια στιγμή σιωπής. Η κάμερα σβήνει, τα φώτα κλείνουν, και μένουμε εκεί - εμείς και οι άνθρωποι που μόλις μοιράστηκαν μαζί μας την ιστορία τους.

## Η Ευθύνη της Αφήγησης

Όταν δουλεύουμε με ευαίσθητα θέματα, όπως ο σχολικός εκφοβισμός ή η αναπηρία, η ευθύνη μας δεν τελειώνει με το "cut". Κάθε συνέντευξη, κάθε στιγμή που καταγράφουμε, αφήνει ένα αποτύπωμα στους ανθρώπους που συμμετέχουν.

### Το Πριν και το Μετά

Πριν από κάθε γύρισμα, περνάμε ώρες μιλώντας με τους συμμετέχοντες. Όχι για το σενάριο, αλλά για το πώς νιώθουν, τι φοβούνται, τι ελπίζουν. Αυτές οι συζητήσεις δεν καταγράφονται ποτέ, αλλά είναι το θεμέλιο όλης της δουλειάς μας.

Μετά το γύρισμα, παραμένουμε σε επαφή. Μοιραζόμαστε το υλικό, ακούμε τις σκέψεις τους, προσαρμόζουμε όπου χρειάζεται. Γιατί η ιστορία δεν είναι δική μας - είναι δική τους.

## Η Δύναμη της Εμπιστοσύνης

Το πιο πολύτιμο δώρο που μας κάνει κάποιος είναι η εμπιστοσύνη του. Να μας εμπιστευτεί την ιστορία του, την ευαλωτότητά του, τον πόνο του. Αυτή η εμπιστοσύνη είναι κάτι που δεν παίρνουμε ποτέ ως δεδομένο.

Κάθε ταινία που φτιάχνουμε είναι μια υπόσχεση: ότι θα αφηγηθούμε την ιστορία με σεβασμό, με αλήθεια, με αξιοπρέπεια.

## Τι Μένει

Όταν η κάμερα σβήνει, μένει η σχέση. Μένουν οι άνθρωποι που γνωρίσαμε, οι ιστορίες που μοιραστήκαμε, η αλλαγή που ελπίζουμε να φέρουμε.

Και αυτό είναι που κάνει τη δουλειά μας να έχει νόημα.`,
    },
    {
        id: 'bullying-story',
        title: 'Μιλώντας για bullying χωρίς να το ξαναζωντανεύουμε',
        category: 'Production',
        readTime: '5 min read',
        image: '/images/bts-2.jpg',
        excerpt: 'Πώς προσεγγίζουμε ευαίσθητα θέματα όπως ο σχολικός εκφοβισμός με τρόπο που θεραπεύει αντί να τραυματίζει.',
        date: '2024-01-10',
        author: 'Βασίλης Νάκης',
        content: `Το bullying είναι ένα θέμα που αγγίζει βαθιά. Και όταν το αφηγείσαι, υπάρχει πάντα ο κίνδυνος να το ξαναζωντανέψεις για όσους το έχουν βιώσει.

## Η Προσέγγισή μας

Στο "Οι σκέψεις της Νεφέλης", αποφασίσαμε να μην δείξουμε ποτέ τη βία. Αντί να εστιάσουμε στον εκφοβισμό, εστιάσαμε στην εσωτερική δύναμη του παιδιού.

### Οι Επιλογές μας

1. **Καμία γραφική βία**: Δεν δείχνουμε σκηνές εκφοβισμού
2. **Εστίαση στην ανθεκτικότητα**: Δείχνουμε πώς το παιδί αντιμετωπίζει
3. **Φωνή στο θύμα**: Η αφήγηση γίνεται από την οπτική του παιδιού
4. **Ελπίδα**: Κάθε σκηνή έχει ένα στοιχείο ελπίδας

## Η Σημασία της Προετοιμασίας

Πριν από κάθε γύρισμα, συνεργαζόμαστε με ψυχολόγους και ειδικούς. Διασφαλίζουμε ότι κάθε παιδί που συμμετέχει έχει την κατάλληλη υποστήριξη.

Το αποτέλεσμα; Μια ταινία που θεραπεύει, όχι που τραυματίζει.`,
    },
    {
        id: 'vulnerability-dignity',
        title: 'Πώς αφηγείσαι την ευαλωτότητα με αξιοπρέπεια',
        category: 'Post',
        readTime: '7 min read',
        image: '/images/bts-3.jpg',
        excerpt: 'Η τέχνη της ευαίσθητης αφήγησης: πώς δίνουμε φωνή σε ευάλωτες ομάδες χωρίς να τις εκθέτουμε.',
        date: '2024-01-05',
        author: 'Μαρία Κωνσταντίνου',
        content: `Η ευαλωτότητα είναι δύναμη. Αλλά πώς την αφηγείσαι χωρίς να την εκμεταλλεύεσαι;

## Οι Αρχές μας

Κάθε ιστορία που αφηγούμαστε ακολουθεί τρεις βασικές αρχές:

1. **Αξιοπρέπεια πάνω απ' όλα**
2. **Η φωνή ανήκει στον άνθρωπο, όχι σε μας**
3. **Κανένα exploitation**

## Στην Πράξη

Όταν γυρίζαμε το "Ρόδα είναι και γυρίζει", δεν θέλαμε να δείξουμε τα άτομα με αναπηρία ως "ήρωες" ή "θύματα". Θέλαμε να τα δείξουμε ως ανθρώπους - με όνειρα, φόβους, χαρές.

### Η Διαδικασία

- Συνεργασία από την αρχή
- Έλεγχος σε κάθε στάδιο
- Σεβασμός στα όρια
- Δικαίωμα veto σε οποιαδήποτε σκηνή

## Το Αποτέλεσμα

Ιστορίες που εμπνέουν, που αλλάζουν προοπτικές, που φέρνουν αλλαγή.`,
    },
    {
        id: 'vasilis-nakis-vision',
        title: 'Ο Βασίλης Νάκης και το όραμα της vculture',
        category: 'Studio',
        readTime: '4 min read',
        image: '/images/vaggelis-nakis-hamogelo-tou-paidiou-beater-gr.jpg',
        excerpt: 'Η ιστορία πίσω από το studio και το όραμα για μια διαφορετική προσέγγιση στην κοινωνική αφήγηση.',
        date: '2024-01-01',
        author: 'vculture Team',
        content: `Το 2020, ο Βασίλης Νάκης είχε ένα όραμα: να δημιουργήσει ένα studio που θα αφηγείται ιστορίες με σκοπό.

## Η Αρχή

"Είχα κουραστεί να βλέπω ιστορίες που εκμεταλλεύονται τον πόνο των ανθρώπων για views," λέει ο Βασίλης. "Ήθελα να φτιάξω κάτι διαφορετικό."

## Το Όραμα

Η vculture δημιουργήθηκε με μια απλή ιδέα: κάθε ιστορία έχει τη δύναμη να αλλάξει κάτι. Αλλά μόνο αν αφηγηθεί σωστά.

### Οι Αξίες μας

- **Σεβασμός**: Σε κάθε άνθρωπο, κάθε ιστορία
- **Αλήθεια**: Χωρίς φίλτρα, χωρίς manipulation
- **Επίδραση**: Κάθε ταινία πρέπει να αλλάζει κάτι

## Σήμερα

Τέσσερα χρόνια μετά, η vculture έχει αφηγηθεί δεκάδες ιστορίες. Και κάθε μία έχει αφήσει το δικό της αποτύπωμα.

"Δεν μετράμε την επιτυχία μας σε views," λέει ο Βασίλης. "Τη μετράμε σε ζωές που άγγιξαν οι ιστορίες μας."`,
    },
];

const BUNNY_STORAGE_URL = process.env.BUNNY_STORAGE_URL
const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE
const BUNNY_ACCESS_KEY = process.env.BUNNY_ACCESS_KEY

async function uploadToBunny(localPath: string, fileName: string) {
    if (!BUNNY_ACCESS_KEY || !BUNNY_STORAGE_ZONE) {
        console.warn('BunnyCDN credentials missing, skipping upload')
        return null
    }

    try {
        const cleanPath = localPath.startsWith('/') ? localPath.slice(1) : localPath;
        const filePath = path.join(process.cwd(), 'public', cleanPath)

        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`)
            return null
        }

        const fileContent = fs.readFileSync(filePath)

        // Convert to WebP using Sharp
        const webpBuffer = await sharp(fileContent)
            .webp({ quality: 80 })
            .toBuffer()

        const webpFileName = fileName.replace(/\.[^/.]+$/, "") + ".webp"
        const targetPath = `projects/${webpFileName}`
        const storageUrl = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${targetPath}`

        console.log(`Uploading ${webpFileName} to ${storageUrl}...`);

        const response = await fetch(storageUrl, {
            method: 'PUT',
            headers: {
                'AccessKey': BUNNY_ACCESS_KEY,
                'Content-Type': 'image/webp',
            },
            body: webpBuffer as any
        })

        if (!response.ok) {
            console.error(`Failed to upload ${webpFileName}: ${response.statusText} ${response.status}`)
            // Print body if possible
            const txt = await response.text();
            console.error(txt);
            return null
        }

        console.log(`Upload success: ${webpFileName}`)

        // Return Pull Zone URL
        return `${BUNNY_STORAGE_URL}/${targetPath}`
    } catch (error) {
        console.error('Error uploading to Bunny:', error)
        return null
    }
}

async function main() {
    // 1. Create Admin User
    const email = 'gkozyris@i4ria.com'
    const password = await bcrypt.hash('1f1femsk', 10)

    await prisma.user.upsert({
        where: { email },
        update: { password },
        create: {
            email,
            password,
            name: 'Admin',
            role: 'ADMIN'
        }
    })
    console.log('Admin user created/updated')

    // 2. Create Categories & Movies
    for (const movie of movies) {
        // Create Category
        const slugify = (text: string) => text.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w\u0370-\u03FF-]/g, '')

        const catSlug = slugify(movie.category)

        const category = await prisma.category.upsert({
            where: { slug: catSlug },
            update: {},
            create: {
                name: movie.category,
                slug: catSlug,
            }
        })

        // Upload Image
        const fileName = path.basename(movie.image)
        const publicUrl = await uploadToBunny(movie.image, fileName)

        const finalImageUrl = publicUrl || movie.image // Fallback

        // Create Project
        await prisma.project.upsert({
            where: { slug: movie.id },
            update: {
                heroImageUrl: finalImageUrl,
            },
            create: {
                title: movie.title,
                slug: movie.id,
                categoryId: category.id,
                year: parseInt(movie.year),
                duration: movie.duration,
                director: movie.director || 'Unknown',
                shortDescription: movie.description,
                fullDescription: movie.synopsis || movie.description,
                heroImageUrl: finalImageUrl,
                trailerUrl: movie.video,
                status: 'PUBLISHED',
                projectOrder: 0,
            }
        })
        console.log(`Processed movie: ${movie.title} with image ${finalImageUrl}`)
    }

    // 3. Create Journal Posts
    console.log('Seeding Journal Posts...')
    for (const post of journalPosts) {
        // Create Tag/Category as Tag since no category relation
        // Actually schema has "PostTag".
        const slugify = (text: string) => text.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/[^\w\u0370-\u03FF-]/g, '')
        const tagSlug = slugify(post.category)

        const tag = await prisma.tag.upsert({
            where: { slug: tagSlug },
            update: {},
            create: {
                name: post.category,
                slug: tagSlug
            }
        })

        // Upload Image
        const fileName = path.basename(post.image)
        const publicUrl = await uploadToBunny(post.image, fileName)
        const finalImageUrl = publicUrl || post.image

        const readTimeInt = parseInt(post.readTime)

        await prisma.journalPost.upsert({
            where: { slug: post.id },
            update: {
                featuredImageUrl: finalImageUrl,
            },
            create: {
                title: post.title,
                slug: post.id,
                excerpt: post.excerpt,
                content: post.content,
                featuredImageUrl: finalImageUrl,
                authorName: post.author || 'vculture Team',
                publishedAt: new Date(post.date),
                status: 'PUBLISHED',
                readTime: isNaN(readTimeInt) ? 5 : readTimeInt,
                tags: {
                    create: {
                        tagId: tag.id
                    }
                }
            }
        })
        console.log(`Processed post: ${post.title}`)
    }

    // 4. Create Hero Section
    console.log('Seeding Hero Section...')
    const heroBg = await uploadToBunny('/images/1.jpg', 'hero-bg.jpg')
    const heroBanner = await uploadToBunny('/Banner1.png', 'Banner1.png')

    await prisma.heroSection.upsert({
        where: { id: 'default-hero' },
        update: {
            backgroundImageUrl: heroBg,
            afisaUrl: heroBanner,
        },
        create: {
            id: 'default-hero',
            titleMain: 'vculture',
            titleSubtitle1: 'Κοινωνικές ιστορίες',
            titleSubtitle2: 'με αληθινούς ανθρώπους',
            description: 'Ένα social-first video studio που μετατρέπει πολύπλοκες πραγματικότητες σε ανθρώπινες ιστορίες.',
            primaryCtaText: 'Ανακαλύψτε τα Projects',
            primaryCtaLink: '#gallery',
            secondaryCtaText: 'Το Journal μας',
            secondaryCtaLink: '#journal',
            backgroundVideoUrl: 'https://vculture.b-cdn.net/video/nefeli%203%20trailer.mp4',
            backgroundImageUrl: heroBg,
            afisaUrl: heroBanner,
            showAfisa: true,
            active: true
        }
    })

    // 5. Create Studio Section
    console.log('Seeding Studio Section...')
    const studioBg = await uploadToBunny('/images/2.jpg', 'studio-bg.jpg')
    const studioCardImg = await uploadToBunny('/images/3.jpg', 'studio-card.jpg')

    await prisma.studioSection.upsert({
        where: { id: 'default-studio' },
        update: {
            backgroundImageUrl: studioBg,
            cardImageUrl: studioCardImg,
        },
        create: {
            id: 'default-studio',
            eyebrow: 'Το Studio',
            headline: 'Η vculture είναι ένα social-first video studio.',
            description: 'Συνεργαζόμαστε με ΜΚΟ, ιδρύματα και συνειδητές εταιρείες για να μετατρέπουμε πολύπλοκες πραγματικότητες σε σαφείς, ανθρώπινες ιστορίες—χωρίς να χάνουμε τη νuance.',
            backgroundImageUrl: studioBg,
            cardTitle: 'Οι σκέψεις της Νεφέλης',
            cardSubtitle: 'Μικρού μήκους ταινία • Σχολικός εκφοβισμός',
            cardDescription: '«Για τον σχολικό εκφοβισμό και τις σιωπές που τον τρέφουν»',
            cardImageUrl: studioCardImg,
            cardVideoUrl: 'https://vculture.b-cdn.net/video/nefeli%203%20trailer.mp4',
            active: true
        }
    })

    // 6. Create Impact Section
    console.log('Seeding Impact Section...')
    const impactBg = await uploadToBunny('/images/oito.jpg', 'impact-bg.jpg')
    await prisma.impactSection.upsert({
        where: { id: 'default-impact' },
        update: {
            backgroundImageUrl: impactBg,
        },
        create: {
            id: 'default-impact',
            heading: 'Our impact in frames',
            description: 'Κάθε νούμερο είναι ένας άνθρωπος, μια ανάσα, ένα βλέμμα στην κάμερα.',
            backgroundImageUrl: impactBg,
            active: true,
            stats: {
                create: [
                    { value: 50, suffix: '+', label: 'κοινωνικές ιστορίες', order: 0 },
                    { value: 10, suffix: '', label: 'χώρες', order: 1 },
                    { value: 20, suffix: '+', label: 'συνεργασίες με οργανισμούς', order: 2 },
                ]
            }
        }
    })

    // 7. Create Process Section
    console.log('Seeding Process Section...')
    const processBg = await uploadToBunny('/images/5.jpg', 'process-bg.jpg')
    await prisma.processSection.upsert({
        where: { id: 'default-process' },
        update: { backgroundImageUrl: processBg },
        create: {
            id: 'default-process',
            headline: '«Η κάμερα δεν είναι ουδέτερη. Διαλέγει πλευρά.»',
            description: 'Εμείς διαλέγουμε τους ανθρώπους.',
            backgroundImageUrl: processBg,
            active: true
        }
    })

    // 8. Create Story Section
    console.log('Seeding Story Section...')
    const storyBg = await uploadToBunny('/images/roda2.jpg', 'story-bg.jpg')
    await prisma.storySection.upsert({
        where: { id: 'default-story' },
        update: { backgroundImageUrl: storyBg },
        create: {
            id: 'default-story',
            label: 'Ντοκιμαντέρ',
            title: 'Ρόδα είναι και γυρίζει',
            description: 'Ένα ντοκιμαντέρ για την ισότητα, την αναπηρία και τη δύναμη της ανθρώπινης θέλησης.',
            backgroundImageUrl: storyBg,
            videoUrl: 'https://vculture.b-cdn.net/video/rodaIneKaiGyriziTrailer.mp4',
            active: true
        }
    })

    // 9. Create BTS Section
    console.log('Seeding BTS Section...')
    const bts1 = await uploadToBunny('/images/vaggelis-nakis-hamogelo-tou-paidiou-beater-gr.jpg', 'bts-field.jpg')
    const bts2 = await uploadToBunny('/images/«Δύο-Ζωές»ταινία-αφιερωμένη-στα-25-Χρόνια-του-Χαμόγελου-του-Παιδιού-1-600x399.jpg', 'bts-interview.jpg')
    const bts3 = await uploadToBunny('/images/bts-3.jpg', 'bts-grading.jpg')
    const bts4 = await uploadToBunny('/images/bts-4.jpg', 'bts-subtitles.jpg')

    await prisma.bTSSection.upsert({
        where: { id: 'default-bts' },
        update: {},
        create: {
            id: 'default-bts',
            title: 'Πίσω από τις κάμερες',
            description: 'Η τεχνική που κάνει την ιστορία να αντέχει.',
            active: true,
            cards: {
                create: [
                    { label: 'Παραγωγή στο πεδίο', imageUrl: bts1 || '', order: 0 },
                    { label: 'Συνεντεύξεις', imageUrl: bts2 || '', order: 1 },
                    { label: 'Color grading', imageUrl: bts3 || '', order: 2 },
                    { label: 'Υποτιτλισμός & προσβασιμότητα', imageUrl: bts4 || '', order: 3 },
                ]
            }
        }
    })

    // 10. Create Services Section
    console.log('Seeding Services Section...')
    const servicesBg = await uploadToBunny('/images/partners-bg.jpg', 'services-bg.jpg')
    await prisma.servicesSection.upsert({
        where: { id: 'default-services' },
        update: {
            backgroundImageUrl: servicesBg
        },
        create: {
            id: 'default-services',
            headline: 'Τι δημιουργούμε',
            description: 'Συνεργασίες με ΜΚΟ, οργανισμούς, ιδρύματα και brands που θέλουν να πουν μια κοινωνική ιστορία με σεβασμό και αλήθεια.',
            backgroundImageUrl: servicesBg,
            active: true,
            services: {
                create: [
                    {
                        iconName: 'Film',
                        title: 'Social Documentaries',
                        description: 'Κινηματογραφημένες ανθρώπινες ιστορίες που εστιάζουν σε καθημερινές ζωές, αόρατες ανισότητες και μικρές νίκες αξιοπρέπειας.',
                        bullets: ['Έρευνα και ανάπτυξη concept', 'Γυρίσματα σε πραγματικούς χώρους', 'Μοντάζ με cinematic αισθητική'],
                        order: 0
                    },
                    {
                        iconName: 'Megaphone',
                        title: 'Campaigns για NGOs',
                        description: 'Σχεδιάζουμε video καμπάνιες που μεταφράζουν δύσκολα κοινωνικά ζητήματα σε κατανοητές, συναισθηματικά φορτισμένες ιστορίες.',
                        bullets: ['Spots για social media & TV', 'Content σειρές', 'Στρατηγική διάδοσης'],
                        order: 1
                    },
                    {
                        iconName: 'Heart',
                        title: 'Advocacy Videos',
                        description: 'Videos που λειτουργούν ως εργαλεία υπεράσπισης δικαιωμάτων, ενημέρωσης φορέων και εκπαίδευσης κοινού.',
                        bullets: ['Video για καμπάνιες κατά του bullying', 'Περιεχόμενο για ημερίδες & συνέδρια', 'Υλικό για ευρωπαϊκά προγράμματα'],
                        order: 2
                    }
                ]
            }
        }
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
