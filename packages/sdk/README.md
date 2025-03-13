# @headless-gamify/sdk

A powerful and flexible SDK for integrating gamification features into your retail business applications. This package provides a simple interface to interact with the Headless Gamify API, designed specifically for engaging retail users in sales, collaboration, and application usage.

## Table of Contents

- [@headless-gamify/sdk](#headless-gamifysdk)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Getting Started](#getting-started)
  - [Authentication](#authentication)
    - [Managing Multiple Companies](#managing-multiple-companies)
  - [Core Concepts](#core-concepts)
  - [API Reference](#api-reference)
    - [Users](#users)
    - [Metrics](#metrics)
    - [Badges](#badges)
    - [Objectives](#objectives)
    - [Teams](#teams)
    - [Rewards](#rewards)
  - [Examples](#examples)
    - [Complete Retail user Journey Example](#complete-retail-user-journey-example)
  - [Error Handling](#error-handling)

## Installation

Install the SDK using npm or yarn:

```bash
# Using npm
npm install @headless-gamify/sdk

# Using yarn
yarn add @headless-gamify/sdk
```

## Getting Started

To start using the SDK, you need to initialize it with your API credentials:

```typescript
import { HeadlessGamify } from '@headless-gamify/sdk';

// Initialize the SDK with credentials
const gamify = new HeadlessGamify({
  API_BASE_URL: 'https://api.yourdomain.com', // API base URL
  COMPANY_API_KEY: 'api-key', // Unique per company
});

// Now you can use the SDK to interact with the API
```

## Authentication

The SDK requires a company-specific API key for authentication. Each retail organization receives a unique key that must be obtained from the Headless Gamify database. This key is tied to a specific company in our multi-tenant system and is automatically included in all requests.

⚠️ **Security Note**: Always store API keys in environment variables or secure secret storage. Never commit them to version control.

### Managing Multiple Companies

It's recommended to use a hashmap pattern where company IDs serve as keys and HeadlessGamify instances as values:

```typescript
// Create a map to store company-specific SDK instances
const gamifySDKs = new Map<string, HeadlessGamify>();

// Initialize SDK instances for each company
function initializeGamifySDK(companyId: string, apiKey: string) {
  const sdk = new HeadlessGamify({
    API_BASE_URL: 'https://api.yourdomain.com',
    API_KEY: apiKey,
  });
  gamifySDKs.set(companyId, sdk);
}

// Get SDK instance for a specific company
function getGamifySDK(companyId: string): HeadlessGamify | undefined {
  return gamifySDKs.get(companyId);
}

// Example usage
initializeGamifySDK('company-1-id', 'api-key-1');
initializeGamifySDK('company-2-id', 'api-key-2');

// Use the SDK for a specific company
const downtownSDK = getGamifySDK('company-2-id');
await downtownSDK.users.create({
    // ... user data
  });
```

## Core Concepts

Headless Gamify for retail is built around several core concepts:

- **Users**: participating in the gamification system
- **Metrics**: Trackable values that measure user performance (e.g., sales numbers, customer satisfaction scores)
- **Badges**: Achievements that users can earn based on specific accomplishments
- **Objectives**: Sales targets or performance goals that users can complete to earn rewards
- **Teams**: Departments or Group of users sections that can collaborate and compete
- **Rewards**: Incentives that users can earn or claim
- **Conditions**: Rules that determine when badges are awarded

## API Reference

### Users

Manage users in your gamification system.

```typescript
// Create a new user profile
await gamify.users.create({
  xp: 0, // Optional, defaults to 0
  level: 1, // Optional, defaults to 1
  streaks: 0, // Optional, defaults to 0
  lastActivity: null, // Optional, defaults to null
  penalties: 0, // Optional, defaults to 0
  metadata: {
    username: 'sarah.smith',
    displayName: 'Sarah Smith',
    department: 'Electronics',
    role: 'Sales Associate',
    hireDate: '2024-01-15',
    storeLocation: 'Downtown'
  }
});

// Get a list of users
const { data } = await gamify.users.list();

// Get a specific user's profile
const { data: user } = await gamify.users.retrieve('user-id');

// Update an user's information
await gamify.users.update('user-id', {
  // All fields are optional in update
  xp: 150,
  level: 2,
  streaks: 3,
  penalties: 0,
  metadata: {
    displayName: 'Sarah Johnson',
    role: 'Senior Sales Associate'
  }
});

// Track user's sales performance
await gamify.users.updateMetric('user-id', 'sales-metric-id', {
  value: 1500 // Required, must be a positive number
});
```

### Metrics

Track various aspects of retail performance.

```typescript
// Create a new metric
await gamify.metrics.create({
  name: 'daily-sales', // Required
  description: 'Daily sales amount in dollars', // Optional
  defaultGainXP: 5, // Optional, defaults to 1
  metadata: { // Optional
    currency: 'USD',
    category: 'performance'
  }
});

// List all metrics with pagination
const { data } = await gamify.metrics.list({
  page: 1,
  limit: 10
});

// Retrieve a specific metric
const { data: metric } = await gamify.metrics.retrieve('metric-id');

// Update a metric
await gamify.metrics.update('metric-id', {
  description: 'Updated description',
  defaultGainXP: 10,
  metadata: {
    category: 'updated-category'
  }
});

// Delete a metric
await gamify.metrics.delete('metric-id');
```

### Badges

Create achievements for retail excellence.

```typescript
// Create a sales achievement badge
await gamify.badges.create({
  name: 'sales-star',
  displayName: 'Sales Star',
  description: 'Achieve $10,000 in monthly sales',
  conditions: [{
    metricId: 'monthly-sales-metric-id',
    operator: 'gte',
    value: 10000,
    type: 'conditional',
    priority: 1
  }],
  metadata: {
    tier: 'gold',
    category: 'sales'
  }
});

// Create an app usage badge
await gamify.badges.create({
  name: 'digital-expert',
  displayName: 'Digital Expert',
  description: 'Complete all app training modules',
  conditions: [{
    metricId: 'app-training-metric-id',
    operator: 'eq',
    value: 100,
    type: 'conditional',
    priority: 1
  }]
});
```

### Objectives

Set sales targets and performance goals.

```typescript
// Create a monthly sales objective
await gamify.objectives.create({
  name: 'holiday-sales-drive',
  displayName: 'Holiday Sales Drive',
  description: 'Reach $20,000 in sales during December',
  startDate: '2024-12-01T00:00:00Z',
  endDate: '2024-12-31T23:59:59Z',
  metricId: 'monthly-sales-metric-id',
  targetValue: 20000,
  rewardXp: 500,
  type: 'solo'
});

// Create a team collaboration objective
await gamify.objectives.create({
  name: 'department-collaboration',
  displayName: 'Cross-Department Sales',
  description: 'Achieve 50 cross-department sales referrals',
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-01-31T23:59:59Z',
  metricId: 'referrals-metric-id',
  targetValue: 50,
  rewardXp: 300,
  type: 'team',
  teamId: 'electronics-team-id'
});
```

### Teams

Manage department teams and competitions.

```typescript
// Create a department team
await gamify.teams.create({
  name: 'electronics-team',
  displayName: 'Electronics Department',
  xp: 0,
  members: ['user-id-1', 'user-id-2'],
  metadata: {
    department: 'Electronics',
    floor: '2nd',
    manager: 'user-id-1'
  }
});
```

### Rewards

Manage user incentives and recognition.

```typescript
// Create a performance bonus reward
await gamify.rewards.create({
  name: 'quarterly-bonus',
  displayName: 'Quarterly Performance Bonus',
  description: '$500 bonus for top performers',
  type: 'monetary',
  xpThreshold: 5000,
  value: 500,
  quantity: 5,
  expiresAt: '2024-03-31T23:59:59Z',
  metadata: {
    currency: 'USD',
    category: 'performance'
  }
});

// Create an user recognition reward
await gamify.rewards.create({
  name: 'employee-of-month',
  displayName: 'Employee of the Month',
  description: 'Premium parking spot + recognition plaque',
  type: 'recognition',
  xpThreshold: 2000,
  quantity: 1,
  metadata: {
    benefits: ['parking-spot', 'plaque', 'wall-feature']
  }
});
```

## Examples

### Complete Retail user Journey Example

Here's a complete example of implementing a retail user engagement system:

```typescript
import { HeadlessGamify } from '@headless-gamify/sdk';

// Initialize the SDK
const gamify = new HeadlessGamify({
  API_BASE_URL: 'https://api.yourdomain.com',
  API_KEY: 'company-api-key',
});

async function setupRetailGamification() {
  try {
    // 1. Create sales metrics
    const { data: salesMetric } = await gamify.metrics.create({
      name: 'daily-sales',
      displayName: 'Daily Sales',
      description: 'Daily sales amount',
      defaultGainXP: 5
    });
    
    const { data: customerSatisfactionMetric } = await gamify.metrics.create({
      name: 'customer-satisfaction',
      displayName: 'Customer Satisfaction',
      description: 'Customer satisfaction score',
      defaultGainXP: 10
    });
    
    // 2. Create sales achievement badges
    const { data: salesBadge } = await gamify.badges.create({
      name: 'sales-expert',
      displayName: 'Sales Expert',
      description: 'Achieve $5000 in daily sales',
      imageUrl: 'https://example.com/badges/sales-expert.png'
    });
    
    // 3. Add conditions to the badge
    await gamify.conditions.create({
      badgeId: salesBadge.id,
      metricId: salesMetric.id,
      operator: 'gte',
      value: 5000
    });
    
    // 4. Create a sales objective
    await gamify.objectives.create({
      name: 'monthly-target',
      displayName: 'Monthly Sales Target',
      description: 'Reach $100,000 in monthly sales',
      metricId: salesMetric.id,
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-01-31T23:59:59Z',
      targetValue: 100000,
      rewardXp: 1000
    });
    
    // 5. Create a performance reward
    await gamify.rewards.create({
      name: 'performance-bonus',
      displayName: 'Performance Bonus',
      description: 'Monthly bonus for top performers',
      type: 'monetary',
      xpThreshold: 5000,
      value: 250
    });
    
    console.log('Retail gamification setup complete!');
  } catch (error) {
    console.error('Error setting up gamification:', error);
  }
}

async function trackEmployeePerformance(userId: string) {
  try {
    // Track daily sales
    await gamify.users.updateMetric(userId, 'daily-sales-metric-id', {
      value: 2500 // $2,500 in sales
    });
    
    // Track customer satisfaction
    await gamify.users.updateMetric(userId, 'customer-satisfaction-metric-id', {
      value: 4.8 // Customer rating out of 5
    });
    
    console.log('Employee performance updated!');
  } catch (error) {
    console.error('Error updating user performance:', error);
  }
}

// Run the setup
setupRetailGamification();
```

## Error Handling

The SDK uses Axios for HTTP requests. Here's how to handle common retail scenarios:

```typescript
try {
  await gamify.users.updateMetric('user-id', 'sales-metric-id', {
    value: 1500
  });
} catch (error) {
  if (error.response) {
    // Handle specific retail error scenarios
    switch (error.response.status) {
      case 404:
        console.error('Employee or metric not found');
        break;
      case 400:
        console.error('Invalid sales amount');
        break;
      default:
        console.error('Error updating sales metric:', error.response.data);
    }
  } else if (error.request) {
    console.error('Network error - please check your connection');
  } else {
    console.error('Error:', error.message);
  }
}
```