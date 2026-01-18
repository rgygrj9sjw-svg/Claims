import { PrismaClient, PolicyType, LossType, EventType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create carriers
  const carriers = [
    { name: 'State Farm', slug: 'state-farm' },
    { name: 'Allstate', slug: 'allstate' },
    { name: 'Progressive', slug: 'progressive' },
    { name: 'GEICO', slug: 'geico' },
    { name: 'USAA', slug: 'usaa' },
    { name: 'Liberty Mutual', slug: 'liberty-mutual' },
    { name: 'Farmers Insurance', slug: 'farmers' },
    { name: 'Nationwide', slug: 'nationwide' },
    { name: 'Travelers', slug: 'travelers' },
    { name: 'American Family', slug: 'american-family' },
    { name: 'Hartford', slug: 'hartford' },
    { name: 'Chubb', slug: 'chubb' },
    { name: 'Erie Insurance', slug: 'erie' },
    { name: 'Auto-Owners', slug: 'auto-owners' },
    { name: 'Citizens Property', slug: 'citizens-property' },
    { name: 'Mercury Insurance', slug: 'mercury' },
    { name: 'Safeco', slug: 'safeco' },
    { name: 'Amica', slug: 'amica' },
    { name: 'MetLife', slug: 'metlife' },
    { name: 'Kemper', slug: 'kemper' },
  ]

  console.log('Creating carriers...')
  for (const carrier of carriers) {
    await prisma.carrier.upsert({
      where: { slug: carrier.slug },
      update: {},
      create: carrier,
    })
  }

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = await bcrypt.hash('admin123', 12)

  console.log('Creating admin user...')
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  // Create test user
  const testPassword = await bcrypt.hash('password123', 12)
  const testUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: testPassword,
      name: 'Test User',
      role: 'USER',
    },
  })

  // Create education articles
  console.log('Creating education articles...')
  const articles = [
    {
      slug: 'water-damage-claims',
      title: 'Understanding Water Damage Claims',
      category: 'Water Damage',
      content: `# Understanding Water Damage Claims

Water damage is one of the most common types of homeowners insurance claims. Understanding the process can help you navigate your claim more effectively.

## Types of Water Damage

### Covered Water Damage
- Burst pipes
- Accidental overflow
- Storm-related water intrusion
- Ice dam damage

### Typically Not Covered
- Flood damage (requires separate flood insurance)
- Gradual leaks
- Maintenance-related issues
- Sewer backup (may require endorsement)

## The Claims Process

1. **Document the damage immediately** - Take photos and videos before cleanup
2. **Mitigate further damage** - You have a duty to prevent additional damage
3. **Report the claim promptly** - Contact your carrier as soon as possible
4. **Meet with the adjuster** - Be present during inspections
5. **Get repair estimates** - Obtain multiple quotes

## Common Challenges

- Distinguishing covered vs. non-covered water damage
- Disputes over scope of damage
- Mold remediation coverage
- Personal property vs. structural damage

## Tips for Policyholders

- Review your policy before a loss occurs
- Document your belongings with photos/inventory
- Understand your deductible
- Keep all receipts for emergency repairs`,
      published: true,
    },
    {
      slug: 'fire-damage-claims',
      title: 'Fire Damage Claims: What to Expect',
      category: 'Fire Damage',
      content: `# Fire Damage Claims: What to Expect

Fire damage claims are among the most complex insurance claims due to the extensive damage and multiple coverage types involved.

## Immediate Steps

1. **Ensure safety first** - Do not enter the property until cleared
2. **Contact your insurance company** - Report the loss immediately
3. **Document everything** - Photos, videos, damaged inventory
4. **Secure the property** - Board up openings, prevent further damage

## Coverage Components

### Dwelling Coverage
Covers the structure of your home, including:
- Walls, roof, foundation
- Built-in appliances
- Attached structures (garage, deck)

### Personal Property
Covers belongings inside the home:
- Furniture, clothing, electronics
- May be subject to sub-limits for certain items

### Additional Living Expenses (ALE)
Covers costs while your home is uninhabitable:
- Hotel/rental costs
- Restaurant meals (above normal food costs)
- Storage fees

## Working with Adjusters

- The carrier will assign an adjuster to evaluate the loss
- Consider hiring a public adjuster for large losses
- Document all communications
- Keep copies of all submitted documents`,
      published: true,
    },
    {
      slug: 'wind-and-hail-claims',
      title: 'Wind and Hail Damage Claims',
      category: 'Storm Damage',
      content: `# Wind and Hail Damage Claims

Wind and hail claims are common, especially in certain geographic regions prone to severe weather.

## Documenting Storm Damage

- Photograph damage as soon as safely possible
- Document the date of the storm
- Check the entire exterior - roof, siding, windows, gutters
- Look for interior water intrusion

## Roof Damage Assessment

### Common Signs of Hail Damage
- Dents in gutters or downspouts
- Damaged shingles (bruising, granule loss)
- Cracked or broken tiles
- Dents in metal components

### Wind Damage Indicators
- Missing or lifted shingles
- Exposed underlayment
- Damaged flashing
- Debris impact marks

## The Inspection Process

1. File your claim promptly after the storm
2. Prepare for the adjuster's inspection
3. Be present during the roof inspection if possible
4. Get independent contractor estimates

## Depreciation Considerations

Most policies pay claims on either:
- **Actual Cash Value (ACV)** - Replacement cost minus depreciation
- **Replacement Cost Value (RCV)** - Full cost to replace, often paid in two installments`,
      published: true,
    },
    {
      slug: 'theft-claims',
      title: 'Filing a Theft Claim',
      category: 'Theft',
      content: `# Filing a Theft Claim

Theft claims require specific documentation and processes to ensure proper handling.

## Immediate Steps

1. **File a police report** - This is essential for any theft claim
2. **Document what was stolen** - Create a detailed inventory
3. **Gather proof of ownership** - Receipts, photos, serial numbers
4. **Contact your insurance company** - Report the theft promptly

## What's Typically Covered

- Personal property stolen from your home
- Items stolen from your vehicle (may have limits)
- Property stolen while traveling
- Damage caused during the theft

## Coverage Limits

Many policies have sub-limits for:
- Jewelry and watches
- Cash and currency
- Electronics
- Firearms
- Collectibles

## Tips for a Successful Claim

- Maintain a home inventory before any loss
- Keep receipts for valuable items
- Consider scheduling high-value items
- Photograph valuable possessions
- Store documentation securely (cloud backup)`,
      published: true,
    },
    {
      slug: 'understanding-deductibles',
      title: 'Understanding Your Insurance Deductible',
      category: 'Policy Basics',
      content: `# Understanding Your Insurance Deductible

Your deductible is a crucial part of your insurance policy that directly affects both your premiums and your out-of-pocket costs during a claim.

## What is a Deductible?

A deductible is the amount you pay out of pocket before your insurance coverage kicks in. For example, if you have a $1,000 deductible and a $10,000 claim, you pay $1,000 and insurance covers $9,000.

## Types of Deductibles

### Flat Dollar Deductibles
A fixed amount regardless of claim size (e.g., $500, $1,000, $2,500)

### Percentage Deductibles
A percentage of your dwelling coverage, common for wind/hail claims
- 1%, 2%, or 5% of Coverage A
- On a $300,000 home, a 2% deductible = $6,000

## Choosing Your Deductible

### Higher Deductible
- Lower monthly/annual premiums
- More out-of-pocket risk per claim
- Best if you have emergency savings

### Lower Deductible
- Higher premiums
- Less out-of-pocket per claim
- Better if you can't afford large unexpected expenses

## Multiple Deductibles

Some policies have different deductibles for:
- General perils (all risk)
- Wind/hail (often higher in coastal/storm-prone areas)
- Hurricane (percentage-based in coastal states)`,
      published: true,
    },
    {
      slug: 'working-with-adjusters',
      title: 'Working with Insurance Adjusters',
      category: 'Claims Process',
      content: `# Working with Insurance Adjusters

Understanding the role of adjusters and how to work with them effectively can significantly impact your claim outcome.

## Types of Adjusters

### Staff Adjusters
- Employed directly by the insurance company
- Handle claims on behalf of your carrier

### Independent Adjusters
- Contractors hired by insurance companies
- Often used during catastrophic events or high volume periods

### Public Adjusters
- Work for policyholders, not insurance companies
- Help document and negotiate claims
- Typically charge a percentage of the claim settlement

## Preparing for Adjuster Visits

1. **Document everything beforehand** - Photos, videos, receipts
2. **Make a list of damaged items** - Be thorough and detailed
3. **Be present during inspections** - Point out all damage
4. **Take notes** - Document what the adjuster says and does
5. **Get everything in writing** - Request written explanations

## Communication Tips

- Be honest and accurate
- Don't exaggerate damage
- Keep records of all conversations
- Follow up verbal discussions with email summaries
- Ask questions if you don't understand something

## If You Disagree

- Request a re-inspection
- Provide additional documentation
- Get independent contractor estimates
- Consider hiring a public adjuster
- Review your policy's dispute resolution options`,
      published: true,
    },
    {
      slug: 'appraisal-process',
      title: 'The Insurance Appraisal Process',
      category: 'Dispute Resolution',
      content: `# The Insurance Appraisal Process

When you and your insurance company disagree on the value of a claim, the appraisal process provides a way to resolve the dispute.

## What is Appraisal?

Appraisal is a dispute resolution process included in most property insurance policies. It's specifically designed to resolve disagreements about the amount of loss, not coverage issues.

## When to Consider Appraisal

- Significant gap between your estimate and the carrier's offer
- All other negotiation efforts have failed
- The dispute is about value, not whether coverage applies

## The Appraisal Process

1. **Demand appraisal in writing** - Reference your policy's appraisal clause
2. **Each party selects an appraiser** - Independent, competent appraisers
3. **Appraisers select an umpire** - Neutral third party to break ties
4. **Appraisers examine the loss** - Independent evaluations
5. **Agreement or umpire decision** - Two of three must agree

## Costs and Considerations

- You pay for your appraiser
- Umpire costs are typically split
- Generally less expensive than litigation
- Usually faster than court proceedings
- Decision is binding on the amount of loss

## Tips for the Appraisal Process

- Choose an experienced appraiser
- Provide thorough documentation
- Understand your policy's specific appraisal clause
- Keep records of all communications`,
      published: true,
    },
    {
      slug: 'auto-insurance-claims',
      title: 'Auto Insurance Claims Guide',
      category: 'Auto Insurance',
      content: `# Auto Insurance Claims Guide

Understanding how to file and manage an auto insurance claim can help ensure you receive fair compensation for vehicle damage or injuries.

## Immediate Steps After an Accident

1. **Ensure safety** - Move to a safe location if possible
2. **Call 911 if needed** - Report injuries or significant damage
3. **Exchange information** - Other driver's insurance and contact info
4. **Document the scene** - Photos, witness information
5. **Report to your insurer** - Even if the other party is at fault

## Types of Auto Coverage

### Liability Coverage
- Covers damage you cause to others
- Bodily injury and property damage
- Required in most states

### Collision Coverage
- Covers damage to your vehicle from collisions
- Applies regardless of fault
- Subject to your deductible

### Comprehensive Coverage
- Covers non-collision damage
- Theft, vandalism, weather, animals
- Subject to your deductible

### Uninsured/Underinsured Motorist
- Covers you when at-fault driver lacks adequate insurance
- Important protection in many states

## Total Loss Claims

Your vehicle may be declared a total loss if:
- Repair costs exceed the vehicle's value
- The vehicle is stolen and not recovered
- Damage makes the vehicle unsafe to repair

Settlement is typically based on actual cash value (ACV) of your vehicle before the loss.`,
      published: true,
    },
    {
      slug: 'documenting-your-claim',
      title: 'How to Document Your Insurance Claim',
      category: 'Claims Process',
      content: `# How to Document Your Insurance Claim

Proper documentation is crucial for a successful insurance claim. The more evidence you have, the better positioned you'll be during the claims process.

## Before a Loss Occurs

### Home Inventory
- Photograph or video each room
- Record serial numbers for electronics
- Keep receipts for major purchases
- Store documentation in the cloud or off-site

### Policy Review
- Know your coverage limits
- Understand your deductibles
- Review exclusions and limitations
- Note endorsements and riders

## After a Loss

### Immediate Documentation
- Take photos and videos before any cleanup
- Capture wide shots and close-ups
- Document the date and time
- Note weather conditions if relevant

### Detailed Inventory
- List all damaged/lost items
- Include description, age, and value
- Note where items were purchased
- Provide photos or receipts if available

### Keep Records Of
- All communications with your insurer
- Names and contact info of adjusters
- Dates of inspections and conversations
- Copies of all submitted documents
- Repair estimates from contractors

## Organizing Your Documentation

- Create a dedicated folder (physical and digital)
- Use consistent naming conventions
- Back up to cloud storage
- Keep a timeline of events
- Save all receipts for emergency expenses`,
      published: true,
    },
    {
      slug: 'claim-denials',
      title: 'What to Do When Your Claim is Denied',
      category: 'Dispute Resolution',
      content: `# What to Do When Your Claim is Denied

A claim denial isn't necessarily the end of the road. Understanding your options can help you challenge an unfair denial.

## Understanding the Denial

### Request a Written Explanation
- Ask for specific policy language cited
- Get details on why coverage doesn't apply
- Understand what evidence was considered

### Review Your Policy
- Read the relevant sections carefully
- Note coverage grants and exclusions
- Check for ambiguous language
- Review any endorsements

## Common Reasons for Denial

- Excluded peril (e.g., flood, earthquake)
- Policy lapse or non-payment
- Late reporting
- Pre-existing damage
- Lack of documentation
- Exceeding policy limits

## Steps to Appeal

1. **Gather additional evidence** - New documentation, expert opinions
2. **Write a formal appeal letter** - Reference policy language
3. **Request re-inspection** - If damage assessment was inadequate
4. **Escalate within the company** - Ask for supervisory review
5. **File a complaint** - State insurance department
6. **Consider legal options** - Attorney consultation

## When to Seek Help

- Large dollar amounts at stake
- Bad faith denial suspected
- Complex policy interpretation issues
- Repeated unsuccessful appeals

## Resources

- State Department of Insurance
- Consumer advocacy organizations
- Insurance attorneys
- Public adjusters`,
      published: true,
    },
    {
      slug: 'mold-damage-claims',
      title: 'Mold Damage and Insurance Claims',
      category: 'Water Damage',
      content: `# Mold Damage and Insurance Claims

Mold claims are among the most complex in homeowners insurance, with coverage varying significantly between policies.

## Is Mold Covered?

### Generally Covered
- Mold resulting from a covered peril
- Example: Mold from burst pipe water damage

### Generally Not Covered
- Mold from long-term humidity/moisture
- Mold from lack of maintenance
- Mold from flooding (unless you have flood insurance)

## Coverage Limitations

Many policies have:
- Mold caps or sub-limits ($5,000-$25,000 common)
- Specific mold exclusions
- Requirements for prompt reporting
- Mitigation requirements

## Handling Mold Claims

### Documentation
- Photograph all visible mold
- Document the source of moisture
- Get professional mold testing
- Keep all remediation receipts

### Mitigation Requirements
- Address moisture source immediately
- Dry affected areas within 24-48 hours
- Consider professional remediation
- Document all steps taken

## Working with Professionals

- Certified mold inspectors
- Industrial hygienists
- Professional remediation companies
- Document all findings and work performed

## Prevention

- Address water intrusion promptly
- Maintain proper ventilation
- Control indoor humidity
- Inspect for leaks regularly`,
      published: true,
    },
    {
      slug: 'business-interruption',
      title: 'Business Interruption Insurance Claims',
      category: 'Commercial Insurance',
      content: `# Business Interruption Insurance Claims

Business interruption insurance (also called business income insurance) protects against lost income when your business can't operate due to a covered loss.

## What's Covered

### Lost Business Income
- Net income that would have been earned
- Based on historical financial records
- Covers the restoration period

### Extra Expenses
- Costs to minimize the shutdown period
- Temporary location expenses
- Equipment rental
- Expedited repairs

## Filing a Business Interruption Claim

### Documentation Needed
- Financial records (P&L, tax returns)
- Projected income calculations
- Extra expense receipts
- Timeline of business restoration

### Period of Restoration
- Begins when physical damage occurs
- Ends when business could resume with reasonable speed
- May extend beyond physical repairs

## Calculating Loss

Factors considered:
- Pre-loss income trends
- Seasonal variations
- Industry conditions
- Growth projections
- Continuing vs. non-continuing expenses

## Common Challenges

- Proving the amount of lost income
- Determining the restoration period
- Documenting extra expenses properly
- Waiting period/deductible issues

## Tips for Policyholders

- Maintain detailed financial records
- Document all mitigation efforts
- Keep all receipts and invoices
- Consider hiring a forensic accountant
- Understand your policy's waiting period`,
      published: true,
    },
  ]

  for (const article of articles) {
    await prisma.educationArticle.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        ...article,
        lastReviewedDate: new Date(),
      },
    })
  }

  // Get carriers for sample claims
  const allCarriers = await prisma.carrier.findMany()

  // Create sample claims
  console.log('Creating sample claims...')

  const sampleClaims = [
    {
      carrierId: allCarriers.find(c => c.slug === 'state-farm')!.id,
      metadata: {
        state: 'TX',
        policyType: PolicyType.HO,
        lossType: LossType.WATER,
        dateOfLossMonth: 3,
        dateOfLossYear: 2024,
        propertyType: 'Single Family',
        occupancy: 'Owner Occupied',
        mitigationDone: true,
      },
      timeline: [
        { date: new Date('2024-03-15'), eventType: EventType.REPORTED, notes: 'Filed claim for burst pipe in upstairs bathroom. Water damage to bathroom, hallway, and living room ceiling below.' },
        { date: new Date('2024-03-17'), eventType: EventType.FIRST_CONTACT, notes: 'Adjuster called to schedule inspection.' },
        { date: new Date('2024-03-20'), eventType: EventType.INSPECTION, notes: 'Adjuster inspected property. Documented all visible damage.' },
        { date: new Date('2024-04-01'), eventType: EventType.PAYMENT, notes: 'Received initial payment for emergency repairs.' },
        { date: new Date('2024-04-15'), eventType: EventType.PAYMENT, notes: 'Final payment received after repairs completed.' },
      ],
      outcome: {
        initialPaymentAmount: 5000,
        finalPaymentAmount: 18500,
        deniedFlag: false,
        partialFlag: false,
        appraisalFlag: false,
        litigationFlag: false,
      },
    },
    {
      carrierId: allCarriers.find(c => c.slug === 'allstate')!.id,
      metadata: {
        state: 'FL',
        policyType: PolicyType.HO,
        lossType: LossType.WIND,
        dateOfLossMonth: 9,
        dateOfLossYear: 2023,
        propertyType: 'Single Family',
        occupancy: 'Owner Occupied',
        mitigationDone: true,
      },
      timeline: [
        { date: new Date('2023-09-28'), eventType: EventType.REPORTED, notes: 'Hurricane damage to roof and fence. Multiple shingles missing, soffit damage.' },
        { date: new Date('2023-10-05'), eventType: EventType.FIRST_CONTACT, notes: 'Assigned adjuster called.' },
        { date: new Date('2023-10-15'), eventType: EventType.INSPECTION, notes: 'Adjuster inspected. Only documented partial roof damage.' },
        { date: new Date('2023-11-01'), eventType: EventType.DENIAL, notes: 'Claim underpaid. Carrier only approved patch repairs, not full roof replacement.' },
        { date: new Date('2023-12-01'), eventType: EventType.APPRAISAL, notes: 'Invoked appraisal clause due to disagreement on repair scope.' },
        { date: new Date('2024-02-15'), eventType: EventType.PAYMENT, notes: 'Appraisal award received.' },
      ],
      outcome: {
        initialPaymentAmount: 3500,
        finalPaymentAmount: 22000,
        deniedFlag: false,
        partialFlag: true,
        appraisalFlag: true,
        litigationFlag: false,
      },
    },
    {
      carrierId: allCarriers.find(c => c.slug === 'progressive')!.id,
      metadata: {
        state: 'CA',
        policyType: PolicyType.AUTO,
        lossType: LossType.OTHER,
        dateOfLossMonth: 6,
        dateOfLossYear: 2024,
        propertyType: null,
        occupancy: null,
        mitigationDone: false,
      },
      timeline: [
        { date: new Date('2024-06-10'), eventType: EventType.REPORTED, notes: 'Rear-ended at stoplight. Damage to bumper, trunk, and tail lights.' },
        { date: new Date('2024-06-11'), eventType: EventType.FIRST_CONTACT, notes: 'Claims representative called same day.' },
        { date: new Date('2024-06-14'), eventType: EventType.INSPECTION, notes: 'Brought vehicle to approved repair shop for estimate.' },
        { date: new Date('2024-06-28'), eventType: EventType.PAYMENT, notes: 'Repairs completed and paid directly to shop.' },
      ],
      outcome: {
        initialPaymentAmount: 4200,
        finalPaymentAmount: 4200,
        deniedFlag: false,
        partialFlag: false,
        appraisalFlag: false,
        litigationFlag: false,
      },
    },
    {
      carrierId: allCarriers.find(c => c.slug === 'usaa')!.id,
      metadata: {
        state: 'VA',
        policyType: PolicyType.HO,
        lossType: LossType.FIRE,
        dateOfLossMonth: 1,
        dateOfLossYear: 2024,
        propertyType: 'Single Family',
        occupancy: 'Owner Occupied',
        mitigationDone: true,
      },
      timeline: [
        { date: new Date('2024-01-20'), eventType: EventType.REPORTED, notes: 'Kitchen fire from stove. Significant damage to kitchen and smoke damage throughout.' },
        { date: new Date('2024-01-20'), eventType: EventType.FIRST_CONTACT, notes: 'Emergency line connected us with restoration company.' },
        { date: new Date('2024-01-22'), eventType: EventType.INSPECTION, notes: 'Adjuster on site within 48 hours.' },
        { date: new Date('2024-02-01'), eventType: EventType.PAYMENT, notes: 'Initial payment for ALE and emergency repairs.' },
        { date: new Date('2024-04-15'), eventType: EventType.PAYMENT, notes: 'Progress payment for kitchen reconstruction.' },
        { date: new Date('2024-06-01'), eventType: EventType.PAYMENT, notes: 'Final depreciation holdback released after repairs completed.' },
      ],
      outcome: {
        initialPaymentAmount: 15000,
        finalPaymentAmount: 78000,
        deniedFlag: false,
        partialFlag: false,
        appraisalFlag: false,
        litigationFlag: false,
      },
    },
    {
      carrierId: allCarriers.find(c => c.slug === 'citizens-property')!.id,
      metadata: {
        state: 'FL',
        policyType: PolicyType.HO,
        lossType: LossType.WATER,
        dateOfLossMonth: 8,
        dateOfLossYear: 2023,
        propertyType: 'Condo',
        occupancy: 'Owner Occupied',
        mitigationDone: true,
      },
      timeline: [
        { date: new Date('2023-08-15'), eventType: EventType.REPORTED, notes: 'AC unit leak caused water damage to ceiling and walls.' },
        { date: new Date('2023-08-20'), eventType: EventType.FIRST_CONTACT, notes: 'Assigned adjuster information received.' },
        { date: new Date('2023-09-05'), eventType: EventType.INSPECTION, notes: 'Inspection completed. Adjuster disputed cause of damage.' },
        { date: new Date('2023-09-20'), eventType: EventType.DENIAL, notes: 'Claim denied - carrier claimed maintenance issue.' },
        { date: new Date('2023-10-15'), eventType: EventType.REOPENED, notes: 'Submitted HVAC technician report showing sudden failure.' },
        { date: new Date('2023-11-10'), eventType: EventType.PAYMENT, notes: 'Claim reopened and partial payment received.' },
      ],
      outcome: {
        initialPaymentAmount: 0,
        finalPaymentAmount: 8500,
        deniedFlag: true,
        partialFlag: true,
        appraisalFlag: false,
        litigationFlag: false,
      },
    },
    {
      carrierId: allCarriers.find(c => c.slug === 'liberty-mutual')!.id,
      metadata: {
        state: 'CO',
        policyType: PolicyType.HO,
        lossType: LossType.HAIL,
        dateOfLossMonth: 5,
        dateOfLossYear: 2024,
        propertyType: 'Single Family',
        occupancy: 'Owner Occupied',
        mitigationDone: false,
      },
      timeline: [
        { date: new Date('2024-05-20'), eventType: EventType.REPORTED, notes: 'Severe hailstorm caused roof and siding damage.' },
        { date: new Date('2024-05-25'), eventType: EventType.FIRST_CONTACT, notes: 'Claim acknowledged via email.' },
        { date: new Date('2024-06-10'), eventType: EventType.INSPECTION, notes: 'Adjuster used drone for roof inspection.' },
        { date: new Date('2024-06-25'), eventType: EventType.PAYMENT, notes: 'Payment for roof replacement approved.' },
      ],
      outcome: {
        initialPaymentAmount: 12000,
        finalPaymentAmount: 18000,
        deniedFlag: false,
        partialFlag: false,
        appraisalFlag: false,
        litigationFlag: false,
      },
    },
    {
      carrierId: allCarriers.find(c => c.slug === 'travelers')!.id,
      metadata: {
        state: 'NY',
        policyType: PolicyType.RENTERS,
        lossType: LossType.THEFT,
        dateOfLossMonth: 4,
        dateOfLossYear: 2024,
        propertyType: 'Apartment',
        occupancy: 'Renter',
        mitigationDone: false,
      },
      timeline: [
        { date: new Date('2024-04-05'), eventType: EventType.REPORTED, notes: 'Apartment burglarized. Electronics and jewelry stolen.' },
        { date: new Date('2024-04-06'), eventType: EventType.FIRST_CONTACT, notes: 'Filed police report and submitted to insurance.' },
        { date: new Date('2024-04-15'), eventType: EventType.INSPECTION, notes: 'Submitted inventory list and receipts for stolen items.' },
        { date: new Date('2024-05-01'), eventType: EventType.PAYMENT, notes: 'Payment received minus deductible and jewelry sub-limit.' },
      ],
      outcome: {
        initialPaymentAmount: 6500,
        finalPaymentAmount: 6500,
        deniedFlag: false,
        partialFlag: true,
        appraisalFlag: false,
        litigationFlag: false,
      },
    },
    {
      carrierId: allCarriers.find(c => c.slug === 'farmers')!.id,
      metadata: {
        state: 'AZ',
        policyType: PolicyType.HO,
        lossType: LossType.WATER,
        dateOfLossMonth: 7,
        dateOfLossYear: 2023,
        propertyType: 'Single Family',
        occupancy: 'Owner Occupied',
        mitigationDone: true,
      },
      timeline: [
        { date: new Date('2023-07-15'), eventType: EventType.REPORTED, notes: 'Monsoon storm caused roof leak and water damage to multiple rooms.' },
        { date: new Date('2023-07-20'), eventType: EventType.FIRST_CONTACT, notes: 'Adjuster assigned within a week.' },
        { date: new Date('2023-08-01'), eventType: EventType.INSPECTION, notes: 'Inspection completed. Dispute over whether damage was from wind or wear.' },
        { date: new Date('2023-08-15'), eventType: EventType.DENIAL, notes: 'Partial denial - roof damage attributed to wear and tear.' },
        { date: new Date('2023-10-01'), eventType: EventType.LITIGATION, notes: 'Hired attorney due to bad faith handling.' },
        { date: new Date('2024-03-01'), eventType: EventType.PAYMENT, notes: 'Settlement reached before trial.' },
      ],
      outcome: {
        initialPaymentAmount: 2000,
        finalPaymentAmount: 35000,
        deniedFlag: true,
        partialFlag: true,
        appraisalFlag: false,
        litigationFlag: true,
      },
    },
    {
      carrierId: allCarriers.find(c => c.slug === 'nationwide')!.id,
      metadata: {
        state: 'OH',
        policyType: PolicyType.HO,
        lossType: LossType.WIND,
        dateOfLossMonth: 6,
        dateOfLossYear: 2024,
        propertyType: 'Single Family',
        occupancy: 'Owner Occupied',
        mitigationDone: true,
      },
      timeline: [
        { date: new Date('2024-06-15'), eventType: EventType.REPORTED, notes: 'Severe thunderstorm with straight-line winds. Tree fell on garage.' },
        { date: new Date('2024-06-16'), eventType: EventType.FIRST_CONTACT, notes: 'Emergency claim line helped arrange tree removal.' },
        { date: new Date('2024-06-20'), eventType: EventType.INSPECTION, notes: 'Adjuster assessed garage and main structure damage.' },
        { date: new Date('2024-07-05'), eventType: EventType.PAYMENT, notes: 'Full payment for garage rebuild and tree removal.' },
      ],
      outcome: {
        initialPaymentAmount: 22000,
        finalPaymentAmount: 28000,
        deniedFlag: false,
        partialFlag: false,
        appraisalFlag: false,
        litigationFlag: false,
      },
    },
    {
      carrierId: allCarriers.find(c => c.slug === 'geico')!.id,
      metadata: {
        state: 'GA',
        policyType: PolicyType.AUTO,
        lossType: LossType.OTHER,
        dateOfLossMonth: 2,
        dateOfLossYear: 2024,
        propertyType: null,
        occupancy: null,
        mitigationDone: false,
      },
      timeline: [
        { date: new Date('2024-02-10'), eventType: EventType.REPORTED, notes: 'Vehicle totaled in accident. Other driver at fault.' },
        { date: new Date('2024-02-11'), eventType: EventType.FIRST_CONTACT, notes: 'Filed through other drivers carrier initially, then own policy.' },
        { date: new Date('2024-02-15'), eventType: EventType.INSPECTION, notes: 'Vehicle inspected and declared total loss.' },
        { date: new Date('2024-02-25'), eventType: EventType.PAYMENT, notes: 'ACV payment received. Negotiated higher value with comparable sales.' },
      ],
      outcome: {
        initialPaymentAmount: 15000,
        finalPaymentAmount: 17500,
        deniedFlag: false,
        partialFlag: false,
        appraisalFlag: false,
        litigationFlag: false,
      },
    },
  ]

  for (const claimData of sampleClaims) {
    const claim = await prisma.claim.create({
      data: {
        userId: testUser.id,
        carrierId: claimData.carrierId,
        status: 'PUBLISHED',
        viewCount: Math.floor(Math.random() * 500) + 10,
        metadata: {
          create: claimData.metadata,
        },
        timeline: {
          create: claimData.timeline.map(event => ({
            date: event.date,
            eventType: event.eventType,
            notesSanitized: event.notes,
          })),
        },
        outcome: {
          create: claimData.outcome,
        },
      },
    })
    console.log(`Created claim: ${claim.id}`)
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
