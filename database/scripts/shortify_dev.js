// 1. Select the database
use('shortify_dev');

// 2. Insert multiple URL documents into the 'urls' collection
db.getCollection('urls').insertMany([
  {
    shortCode: 'xYz123',
    longUrl: 'https://example.com/article1',
    userId: null,
    isPublic: true,
    isCustom: false,
    createdAt: new Date('2025-05-01T10:15:00Z'),
    expiresAt: null,
    clicks: 0,
    status: 'active'
  },
  {
    shortCode: 'abc789',
    longUrl: 'https://openai.com',
    userId: 'user_01',
    isPublic: true,
    isCustom: true,
    createdAt: new Date('2025-05-02T12:00:00Z'),
    expiresAt: null,
    clicks: 3,
    status: 'active'
  },
  {
    shortCode: 'customAlias',
    longUrl: 'https://github.com',
    userId: 'user_02',
    isPublic: false,
    isCustom: true,
    createdAt: new Date('2025-05-03T09:30:00Z'),
    expiresAt: new Date('2025-06-01T00:00:00Z'),
    clicks: 12,
    status: 'active'
  },
  {
    shortCode: 'guest456',
    longUrl: 'https://example.org',
    userId: null,
    isPublic: true,
    isCustom: false,
    createdAt: new Date('2025-04-30T14:00:00Z'),
    expiresAt: null,
    clicks: 5,
    status: 'inactive'
  },
  {
    shortCode: 'mno321',
    longUrl: 'https://news.ycombinator.com',
    userId: 'user_03',
    isPublic: true,
    isCustom: false,
    createdAt: new Date('2025-05-01T18:45:00Z'),
    expiresAt: null,
    clicks: 7,
    status: 'active'
  },
  {
    shortCode: 'qwe654',
    longUrl: 'https://youtube.com',
    userId: null,
    isPublic: true,
    isCustom: false,
    createdAt: new Date('2025-05-01T22:00:00Z'),
    expiresAt: null,
    clicks: 0,
    status: 'active'
  }
]);

// 3. Count how many URLs were created on May 1st, 2025
const urlsOnMay1 = db.getCollection('urls').find({
  createdAt: {
    $gte: new Date('2025-05-01T00:00:00Z'),
    $lt: new Date('2025-05-02T00:00:00Z')
  }
}).count();

console.log(`${urlsOnMay1} URLs were created on May 1st, 2025.`);

// 4. Aggregate total clicks per user (excluding guests)
db.getCollection('urls').aggregate([
  { $match: { userId: { $ne: null } } },              // exclude guest URLs
  { $group: { _id: '$userId', totalClicks: { $sum: '$clicks' } } }  // sum clicks by user
]);

// 5. Count how many URLs are currently active or inactive
db.getCollection('urls').aggregate([
  { $group: { _id: '$status', count: { $sum: 1 } } }
]);
