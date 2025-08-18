import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@artemo.ai' },
    update: {},
    create: {
      email: 'admin@artemo.ai',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  console.log('✅ Admin user created:', admin.email);

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@artemo.ai' },
    update: {},
    create: {
      email: 'user@artemo.ai',
      name: 'Test User',
      password: userPassword,
      role: 'USER'
    }
  });

  console.log('✅ Test user created:', user.email);

  // Create categories
  const categories = [
    { name: 'Ad Copy', displayOrder: 1 },
    { name: 'Client Management', displayOrder: 2 },
    { name: 'Copy Improvement', displayOrder: 3 },
    { name: 'Email Copy', displayOrder: 4 },
    { name: 'Long Form Content', displayOrder: 5 },
    { name: 'Podcast Tools', displayOrder: 6 },
    { name: 'Sales & Funnel Copy', displayOrder: 7 },
    { name: 'Other', displayOrder: 8 }
  ];

  const createdCategories = [];
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData
    });
    createdCategories.push(category);
    console.log('✅ Category created:', category.name);
  }

  // Create sample tools
  const adCopyCategory = createdCategories.find(c => c.name === 'Ad Copy');
  const emailCategory = createdCategories.find(c => c.name === 'Email Copy');

  if (adCopyCategory) {
    const adTool = await prisma.tool.create({
      data: {
        title: 'Ad Writer (HAO)',
        description: 'Uses the Hook, Angle, Outcome framework to generate compelling ad copy designed to grab attention and drive conversions.',
        categoryId: adCopyCategory.id,
        active: true,
        featured: true,
        primaryModel: 'Claude',
        fallbackModels: ['ChatGPT'],
        promptInstructions: 'You are an expert ad copywriter specializing in the Hook-Angle-Outcome framework. Create compelling ads that grab attention, present a unique angle, and promise a clear outcome.',
        questions: {
          create: [
            {
              label: 'What product or service are you advertising?',
              type: 'textarea',
              required: true,
              order: 1
            },
            {
              label: 'Who is your target audience?',
              type: 'textarea',
              required: true,
              order: 2
            },
            {
              label: 'What platform will you advertise on?',
              type: 'select',
              required: true,
              order: 3,
              options: ['Facebook', 'Instagram', 'Google Ads', 'LinkedIn', 'Twitter']
            },
            {
              label: 'What is your main goal?',
              type: 'select',
              required: true,
              order: 4,
              options: ['Brand Awareness', 'Lead Generation', 'Direct Sales', 'App Downloads']
            }
          ]
        }
      }
    });

    console.log('✅ Sample ad tool created:', adTool.title);
  }

  if (emailCategory) {
    const emailTool = await prisma.tool.create({
      data: {
        title: 'Money Tales Emails',
        description: 'Turns everyday events or simple stories into engaging emails that nurture your audience and seamlessly lead to a sales pitch.',
        categoryId: emailCategory.id,
        active: true,
        featured: true,
        primaryModel: 'Claude',
        fallbackModels: ['ChatGPT'],
        promptInstructions: 'You are an expert email copywriter who specializes in storytelling. Transform simple stories into engaging emails that build connection and naturally lead to sales.',
        questions: {
          create: [
            {
              label: 'What story or experience do you want to share?',
              type: 'textarea',
              required: true,
              order: 1
            },
            {
              label: 'What product or service are you promoting?',
              type: 'input',
              required: true,
              order: 2
            },
            {
              label: 'Who is your email audience?',
              type: 'textarea',
              required: true,
              order: 3
            },
            {
              label: 'What is your call-to-action?',
              type: 'input',
              required: true,
              order: 4
            }
          ]
        }
      }
    });

    console.log('✅ Sample email tool created:', emailTool.title);
  }

  // Create sample project
  const project = await prisma.project.create({
    data: {
      name: 'Q4 Marketing Campaign',
      tags: ['AD_COPY', 'EMAIL_COPY'],
      userId: user.id
    }
  });

  console.log('✅ Sample project created:', project.name);

  console.log('🎉 Database seed completed!');
  console.log('\n📝 Login credentials:');
  console.log('Admin: admin@artemo.ai / admin123');
  console.log('User: user@artemo.ai / user123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });