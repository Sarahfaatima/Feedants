// Seeds a demo user + the "Feedants Classical Dance" competition so the app
// can be evaluated end to end without any manual data entry.
//
// All competition dates are computed RELATIVE to the moment this script
// runs, so the competition is always in "registration_open" state right
// after seeding, no matter when the evaluator runs it. Run again any time
// with `npm run seed` (it wipes and recreates the demo data - safe to rerun).
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const { seedDemoEmail, seedDemoPassword } = require('../src/config/env');

const User = require('../src/models/User');
const Competition = require('../src/models/Competition');
const Registration = require('../src/models/Registration');
const Winner = require('../src/models/Winner');
const Testimonial = require('../src/models/Testimonial');

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const JUDGE_IMAGE = 'https://i.pravatar.cc/300?img=47';
const SAMPLE_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

async function seed() {
  await connectDB();
  const now = Date.now();

  console.log('[seed] clearing existing demo data...');
  await Promise.all([
    User.deleteMany({ email: seedDemoEmail.toLowerCase() }),
    Competition.deleteMany({ slug: 'feedants-classical-dance' }),
  ]);

  const existingCompetition = await Competition.findOne({ slug: 'feedants-classical-dance' });
  if (existingCompetition) {
    await Promise.all([
      Registration.deleteMany({ competition: existingCompetition._id }),
      Winner.deleteMany({ competition: existingCompetition._id }),
      Testimonial.deleteMany({ competition: existingCompetition._id }),
    ]);
  }

  console.log('[seed] creating demo user...');
  const passwordHash = await User.hashPassword(seedDemoPassword);
  const demoUser = await User.create({
    name: 'Prakhar Shukla',
    email: seedDemoEmail.toLowerCase(),
    passwordHash,
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
  });

  console.log('[seed] creating competition...');
  const competition = await Competition.create({
    title: 'Feedants Classical Dance',
    slug: 'feedants-classical-dance',
    category: 'Dance',
    tags: ['Dance', 'Multi-Win'],
    winnersGetCertificate: true,

    description: {
      en:
        'This is an online classical dance competition open for all age groups. ' +
        'Participate from anywhere and showcase your talent. Express your passion ' +
        'through traditional dance.\n\n' +
        'Contestants may perform in any recognized classical Indian dance style, ' +
        'including Kathak, Bharatanatyam, Odissi, Kuchipudi, or Manipuri. Entries ' +
        'are judged on technique, expression, costume, and stage presence. Winners ' +
        'receive cash rewards and a certificate of achievement from Feedants.',
      hi:
        'यह सभी आयु वर्गों के लिए खुली एक ऑनलाइन शास्त्रीय नृत्य प्रतियोगिता है। ' +
        'कहीं से भी भाग लें और अपनी प्रतिभा दिखाएं। पारंपरिक नृत्य के माध्यम से अपने ' +
        'जुनून को व्यक्त करें।\n\n' +
        'प्रतियोगी कथक, भरतनाट्यम, ओडिसी, कुचिपुड़ी या मणिपुरी जैसी किसी भी मान्यता ' +
        'प्राप्त शास्त्रीय भारतीय नृत्य शैली में प्रदर्शन कर सकते हैं। प्रविष्टियों का मूल्यांकन ' +
        'तकनीक, भाव, वेशभूषा और मंच उपस्थिति पर किया जाता है।',
    },

    judgingParameters: {
      en:
        '• Technique & Precision - accuracy of footwork, postures and mudras.\n' +
        '• Expression (Abhinaya) - storytelling and emotional conveyance.\n' +
        '• Costume & Presentation - authenticity and stage presence.\n' +
        '• Rhythm & Musicality - synchronization with the composition.\n' +
        '• Originality - creativity within the classical form.',
      hi:
        '• तकनीक और सटीकता - फुटवर्क, मुद्राओं की सटीकता।\n' +
        '• अभिनय - कहानी और भावनात्मक अभिव्यक्ति।\n' +
        '• वेशभूषा और प्रस्तुति - प्रामाणिकता और मंच उपस्थिति।\n' +
        '• लय और संगीतमयता - रचना के साथ समन्वय।\n' +
        '• मौलिकता - शास्त्रीय रूप के भीतर रचनात्मकता।',
    },

    rules: {
      en:
        '1. Open to all age groups; no professional dance degree required.\n' +
        '2. One submission per participant. Duets/groups are not eligible for this edition.\n' +
        '3. Performance video must be under 5 minutes and filmed in a single continuous take.\n' +
        '4. Entry fee is non-refundable once the submission window opens.\n' +
        '5. Only contributions from paid, registered participants are considered for judging.\n' +
        '6. Decisions made by the judging panel are final.',
      hi:
        '1. सभी आयु वर्गों के लिए खुला; किसी पेशेवर नृत्य डिग्री की आवश्यकता नहीं।\n' +
        '2. प्रति प्रतिभागी केवल एक प्रविष्टि। इस संस्करण के लिए जोड़ी/समूह पात्र नहीं हैं।\n' +
        '3. प्रदर्शन वीडियो 5 मिनट से कम और एक निरंतर टेक में फिल्माया जाना चाहिए।\n' +
        '4. सबमिशन विंडो खुलने के बाद प्रवेश शुल्क वापस नहीं किया जाएगा।\n' +
        '5. केवल भुगतान किए गए, पंजीकृत प्रतिभागियों के योगदान पर ही विचार किया जाएगा।\n' +
        '6. जजिंग पैनल के निर्णय अंतिम होंगे।',
    },

    prizePool: 1500,
    entryFee: 99,

    capacity: 20,
    bookedCount: 0, // incremented below via the real registration flow

    registrationStart: new Date(now - 3 * DAY),
    registrationClose: new Date(now + 1 * DAY + 6 * HOUR + 28 * 60 * 1000),
    submissionStart: new Date(now + 2 * DAY),
    submissionEnd: new Date(now + 22 * DAY),
    resultDate: new Date(now + 25 * DAY),

    judge: {
      name: 'Manju Dubey',
      profession: 'Professional Kathak Dancer',
      experience: '12+ Years of Experience',
      imageUrl: JUDGE_IMAGE,
    },

    featuredImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800',
    introVideoUrl: SAMPLE_VIDEO,
    prizeInfoVideoUrl: SAMPLE_VIDEO,

    languages: ['en', 'hi'],

    rewards: [
      { position: 1, label: '1st Winner', amount: 550, icon: 'trophy' },
      { position: 2, label: '2nd Winner', amount: 300, icon: 'medal' },
      { position: 3, label: '3rd Winner', amount: 240, icon: 'medal' },
      { position: 4, label: '4th Winner', amount: 200, icon: 'star' },
      { position: 5, label: '5th Winner', amount: 130, icon: 'star' },
      { position: 6, label: '6th Winner', amount: 80, icon: 'star' },
    ],

    allowedSubmissionTypes: ['video', 'image'],
    maxSubmissionSizeBytes: 50 * 1024 * 1024,

    referralUrl: 'https://feedants.com/r/referral123',
    referralRewardText: {
      en: 'You earn ₹10 for every signup',
      hi: 'हर साइनअप पर आप ₹10 कमाते हैं',
    },

    status: 'active',
  });

  console.log('[seed] registering demo user (via the real registration flow)...');
  const { registerUserForCompetition } = require('../src/services/registrationService');
  await registerUserForCompetition(competition._id, demoUser._id);

  console.log('[seed] creating previous winners...');
  await Winner.insertMany([
    {
      competition: competition._id,
      name: 'Riya Shah',
      position: 1,
      positionLabel: '1st Winner',
      imageUrl: 'https://i.pravatar.cc/300?img=32',
      videoUrl: SAMPLE_VIDEO,
    },
    {
      competition: competition._id,
      name: 'Aarav Mehta',
      position: 1,
      positionLabel: '1st Winner',
      imageUrl: 'https://i.pravatar.cc/300?img=51',
      videoUrl: SAMPLE_VIDEO,
    },
    {
      competition: competition._id,
      name: 'Neha Verma',
      position: 2,
      positionLabel: '2nd Winner',
      imageUrl: 'https://i.pravatar.cc/300?img=45',
      videoUrl: SAMPLE_VIDEO,
    },
    {
      competition: competition._id,
      name: 'Ishita Chopra',
      position: 3,
      positionLabel: '3rd Winner',
      imageUrl: 'https://i.pravatar.cc/300?img=28',
      videoUrl: SAMPLE_VIDEO,
    },
  ]);

  console.log('[seed] creating testimonials...');
  await Testimonial.insertMany([
    {
      competition: competition._id,
      userName: 'Sanya Kapoor',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      message: 'Super smooth registration and the judges gave genuinely useful feedback. Loved it!',
    },
    {
      competition: competition._id,
      userName: 'Rohan Iyer',
      avatarUrl: 'https://i.pravatar.cc/150?img=14',
      rating: 5,
      message: 'Won 3rd place last season - the prize money hit my account within a week of results.',
    },
    {
      competition: competition._id,
      userName: 'Meera Nair',
      avatarUrl: 'https://i.pravatar.cc/150?img=9',
      rating: 4,
      message: 'Great platform for showcasing classical dance from home. Submission flow was easy to use.',
    },
  ]);

  console.log('\n[seed] done!');
  console.log('--------------------------------------------------');
  console.log(`Demo login:  ${seedDemoEmail} / ${seedDemoPassword}`);
  console.log(`Competition: ${competition.title}  (id: ${competition._id})`);
  console.log('--------------------------------------------------\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
